import type { Request, Response } from 'express';
import type Stripe from 'stripe';

import {
  panelCodeForPlan,
  PLAN_CATALOG,
  planForPriceId,
  priceIdForPlan,
} from '../../helpers/plans';
import { stripe } from '../../helpers/stripeClient';
import { isEntitled } from '../../helpers/subscriptionAccess';
import { supabaseAdmin } from '../../helpers/supabaseClient';
import type { AuthenticatedRequest } from '../../types';

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const CRON_SECRET = process.env.CRON_SECRET;

// ---------------------------------------------------------------------------
// GET /api/subscriptions — fetch current user's subscription + access verdict
// ---------------------------------------------------------------------------
export const getSubscription = async (req: Request, res: Response) => {
  try {
    const user = (req as AuthenticatedRequest).user;

    const { data: sub, error } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw error;

    // `entitled` is computed server-side so the client never has to re-implement
    // the grace-period rules — it just trusts this flag.
    res.json({ subscription: sub ?? null, entitled: isEntitled(sub) });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
};

// ---------------------------------------------------------------------------
// GET /api/subscriptions/plans — plan catalog enriched with live Stripe prices
// ---------------------------------------------------------------------------
export const getPlans = async (_req: Request, res: Response) => {
  try {
    const priceCache = new Map<string, Stripe.Price>();

    const plans = await Promise.all(
      PLAN_CATALOG.map(async (plan) => {
        const priceId = priceIdForPlan(plan.key);
        let price: Stripe.Price | null = null;

        if (priceId) {
          if (!priceCache.has(priceId)) {
            priceCache.set(priceId, await stripe.prices.retrieve(priceId));
          }
          price = priceCache.get(priceId) ?? null;
        }

        return {
          key: plan.key,
          label: plan.label,
          description: plan.description,
          panelCode: plan.panelCode,
          priceId: priceId ?? null,
          // Live pricing straight from Stripe so the UI can never drift from
          // what the customer is actually charged.
          amount: price?.unit_amount ?? null,
          currency: price?.currency ?? null,
          interval: price?.recurring?.interval ?? null,
        };
      })
    );

    res.json({ plans });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
};

// ---------------------------------------------------------------------------
// POST /api/subscriptions/checkout — create a Stripe Checkout session
// ---------------------------------------------------------------------------
export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const user = (req as AuthenticatedRequest).user;
    const { plan, successUrl, cancelUrl } = req.body as {
      plan: string;
      successUrl: string;
      cancelUrl: string;
    };

    const priceId = priceIdForPlan(plan);

    if (!priceId) {
      return res.status(400).json({ error: `Invalid plan: "${plan}"` });
    }

    const customerId = await getOrCreateCustomer(user.id, user.email);

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      subscription_data: {
        metadata: { supabase_user_id: user.id, plan },
      },
      automatic_tax: { enabled: true },
      customer_update: { address: 'auto' },
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
};

// ---------------------------------------------------------------------------
// POST /api/subscriptions/portal — open the Stripe Customer Portal
// ---------------------------------------------------------------------------
export const createPortalSession = async (req: Request, res: Response) => {
  try {
    const user = (req as AuthenticatedRequest).user;
    const { returnUrl } = req.body as { returnUrl: string };

    const customerId = await getOrCreateCustomer(user.id, user.email);

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
};

// ---------------------------------------------------------------------------
// POST /api/subscriptions/webhook — Stripe webhook handler
// NOTE: This route must receive the raw body (registered before express.json)
// ---------------------------------------------------------------------------
export const handleWebhook = async (req: Request, res: Response) => {
  if (!WEBHOOK_SECRET) {
    return res.status(500).json({ error: 'Missing STRIPE_WEBHOOK_SECRET' });
  }

  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body as Buffer, sig, WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({
      error: `Webhook signature verification failed: ${err instanceof Error ? err.message : String(err)}`,
    });
  }

  // Idempotency: claim the event id up front. Stripe can deliver the same event
  // more than once; if we've already processed it, acknowledge and stop.
  const claimed = await claimEvent(event.id, event.type);

  if (!claimed) {
    return res.json({ received: true, duplicate: true });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.subscription) {
          const sub = await stripe.subscriptions.retrieve(session.subscription as string);

          await applyStripeSubscription(sub);
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        // A single path for all subscription lifecycle events — the row always
        // reflects Stripe's current status (deleted arrives as status
        // 'canceled', so no special-casing needed).
        await applyStripeSubscription(event.data.object as Stripe.Subscription);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        // In API 2026-05-27.dahlia, subscription moved from Invoice to
        // Invoice.parent.subscription_details. Re-fetch the subscription so the
        // row carries the authoritative status + current_period_end (the grace
        // window is anchored on current_period_end).
        const subscriptionId =
          invoice.parent?.type === 'subscription_details'
            ? (invoice.parent.subscription_details?.subscription as string | null)
            : null;

        if (subscriptionId) {
          const sub = await stripe.subscriptions.retrieve(subscriptionId);

          await applyStripeSubscription(sub);
        }
        break;
      }
    }

    res.json({ received: true });
  } catch (err) {
    // Processing failed — release the claim so Stripe's automatic retry will
    // reprocess this event instead of it being silently skipped as a duplicate.
    await releaseEvent(event.id);
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
};

// ---------------------------------------------------------------------------
// POST /api/subscriptions/reconcile — drift backstop (run on a schedule)
// Guarded by the x-cron-secret header. Re-reads every known subscription from
// Stripe and re-applies it, healing rows left stale by any missed webhook.
// ---------------------------------------------------------------------------
export const reconcileSubscriptions = async (req: Request, res: Response) => {
  if (!CRON_SECRET || req.headers['x-cron-secret'] !== CRON_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { data: rows, error } = await supabaseAdmin
      .from('subscriptions')
      .select('stripe_subscription_id')
      .not('stripe_subscription_id', 'is', null);

    if (error) throw error;

    let checked = 0;
    let updated = 0;
    let canceled = 0;
    const errors: string[] = [];

    for (const row of rows ?? []) {
      const id = row.stripe_subscription_id as string;

      checked += 1;

      try {
        const sub = await stripe.subscriptions.retrieve(id);

        await applyStripeSubscription(sub);
        updated += 1;
      } catch (err) {
        // Subscription no longer exists in Stripe — treat as canceled locally.
        if (err instanceof Error && 'code' in err && err.code === 'resource_missing') {
          await supabaseAdmin
            .from('subscriptions')
            .update({ status: 'canceled' })
            .eq('stripe_subscription_id', id);
          canceled += 1;
        } else {
          errors.push(`${id}: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
    }

    res.json({ checked, updated, canceled, errors });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
};

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Returns the user's Stripe customer id, creating + persisting it on first use.
 * Persisting immediately (rather than waiting for the webhook) prevents a fresh
 * Stripe customer being created on every checkout click for users who abandon.
 */
async function getOrCreateCustomer(userId: string, email?: string): Promise<string> {
  const { data: existing } = await supabaseAdmin
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .maybeSingle();

  if (existing?.stripe_customer_id) return existing.stripe_customer_id as string;

  // Reuse a customer Stripe already has for this email before creating a new one.
  let customerId: string | undefined;

  if (email) {
    const found = await stripe.customers.list({ email, limit: 1 });

    customerId = found.data[0]?.id;
  }

  if (!customerId) {
    const customer = await stripe.customers.create({
      ...(email ? { email } : {}),
      metadata: { supabase_user_id: userId },
    });

    customerId = customer.id;
  }

  // Persist now so portal/checkout never create duplicates. The row may not
  // exist yet (no subscription), so upsert a minimal placeholder.
  await supabaseAdmin.from('subscriptions').upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId,
      status: 'incomplete',
      plan: 'none',
    },
    { onConflict: 'user_id' }
  );

  return customerId;
}

/** Claim a webhook event id. Returns false if it was already processed. */
async function claimEvent(eventId: string, type: string): Promise<boolean> {
  const { error } = await supabaseAdmin.from('stripe_events').insert({ id: eventId, type });

  if (!error) return true;
  // 23505 = unique_violation → already processed.
  if (error.code === '23505') return false;
  throw error;
}

async function releaseEvent(eventId: string): Promise<void> {
  await supabaseAdmin.from('stripe_events').delete().eq('id', eventId);
}

/** Resolve the app plan key for a subscription (metadata wins, price is fallback). */
function resolvePlan(sub: Stripe.Subscription): string {
  const metaPlan = sub.metadata?.plan;

  if (metaPlan && PLAN_CATALOG.some((p) => p.key === metaPlan)) return metaPlan;

  const priceId = sub.items.data[0]?.price?.id;

  return planForPriceId(priceId) ?? 'unknown';
}

/**
 * Write a Stripe subscription into our mirror table. Idempotent — safe to call
 * from the webhook and the reconcile job with the same input.
 *
 * Entitlement (app access) is enforced separately from `panel_id` now: this only
 * keeps the displayed blood panel in sync with the active plan and never
 * destructively clears it (a canceled user is blocked by status, not by losing
 * their panel — and keeps it if they resubscribe).
 */
async function applyStripeSubscription(sub: Stripe.Subscription) {
  const userId = sub.metadata?.supabase_user_id;

  if (!userId) return;

  const plan = resolvePlan(sub);

  // current_period_end moved from Subscription to SubscriptionItem in API
  // 2026-05-27.dahlia.
  const itemPeriodEnd = sub.items.data[0]?.current_period_end;
  const periodEnd = itemPeriodEnd ? new Date(itemPeriodEnd * 1000).toISOString() : null;

  await supabaseAdmin.from('subscriptions').upsert(
    {
      user_id: userId,
      stripe_customer_id: sub.customer as string,
      stripe_subscription_id: sub.id,
      status: sub.status,
      plan,
      current_period_end: periodEnd,
      cancel_at_period_end: sub.cancel_at_period_end ?? false,
    },
    { onConflict: 'user_id' }
  );

  // Keep the displayed panel aligned with the plan while the sub is live.
  if (sub.status === 'active' || sub.status === 'trialing') {
    const panelCode = panelCodeForPlan(plan);

    if (panelCode) {
      const { data: panel } = await supabaseAdmin
        .from('panels')
        .select('id')
        .eq('code', panelCode)
        .single();

      if (panel?.id) {
        await supabaseAdmin.from('profiles').update({ panel_id: panel.id }).eq('id', userId);
      }
    }
  }
}

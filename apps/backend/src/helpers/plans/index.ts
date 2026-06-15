/**
 * Single source of truth for subscription plans.
 *
 * Everything that needs to map between an app "plan key", a Stripe Price, and a
 * blood `panels.code` derives from this one catalog — the webhook, the checkout
 * controller, the /plans endpoint and the reconcile job. Previously these maps
 * were duplicated inline in the controller and could drift apart.
 *
 * Marketing copy (label/description) lives here so the API can return it to the
 * client; the actual € amount is fetched live from Stripe (see getPlans) so the
 * UI can never disagree with what the customer is charged.
 */
export interface PlanDef {
  /** App-internal plan key (stored in subscriptions.plan, sent from the client). */
  key: string;
  /** Display name shown in the paywall / settings. */
  label: string;
  /** Short marketing description. */
  description: string;
  /** Matching `panels.code` for the blood panel this plan unlocks. */
  panelCode: string;
  /** Name of the env var holding this plan's Stripe Price ID. */
  priceEnv: string;
}

/**
 * Ordered list — the order is also the display order in the UI.
 *
 * NOTE: `performance_women` intentionally shares the `hybrid` Stripe price. When
 * reverse-mapping a Price ID back to a plan we therefore prefer the
 * subscription's `metadata.plan` and only fall back to the price; for the shared
 * price the fallback resolves to whichever plan appears first here (`hybrid`).
 */
export const PLAN_CATALOG: readonly PlanDef[] = [
  {
    key: 'test_sub',
    label: 'Test Subscription',
    description: 'Interne testsub voor development & QA (niet zichtbaar in UI).',
    panelCode: 'test_sub',
    priceEnv: 'STRIPE_PRICE_ID_TEST_SUB',
  },
  {
    key: 'strength',
    label: 'Peak Strength',
    description: 'Gericht op kracht & spierherstel.',
    panelCode: 'peak_strength',
    priceEnv: 'STRIPE_PRICE_ID_STRENGTH',
  },
  {
    key: 'endurance',
    label: 'Peak Endurance',
    description: 'Panel voor duursport & endurance atleten.',
    panelCode: 'peak_endurance',
    priceEnv: 'STRIPE_PRICE_ID_ENDURANCE',
  },
  {
    key: 'hybrid',
    label: 'Peak Hybrid',
    description: 'Combinatie van kracht & endurance.',
    panelCode: 'peak_hybrid',
    priceEnv: 'STRIPE_PRICE_ID_HYBRID',
  },
  {
    key: 'performance_women',
    label: 'Peak Performance Women',
    description: 'Hormonaal & performance panel voor vrouwen.',
    panelCode: 'peak_performance_women',
    priceEnv: 'STRIPE_PRICE_ID_HYBRID', // shares hybrid pricing
  },
  {
    key: 'pro',
    label: 'Peak Pro',
    description: 'Uitgebreid panel voor gevorderde atleten met AI-inzichten.',
    panelCode: 'peak_pro',
    priceEnv: 'STRIPE_PRICE_ID_PRO',
  },
] as const;

export const getPlanByKey = (key: string | null | undefined): PlanDef | undefined =>
  PLAN_CATALOG.find((p) => p.key === key);

/** Stripe Price ID configured for a plan key (undefined if env var is unset). */
export const priceIdForPlan = (key: string): string | undefined =>
  process.env[getPlanByKey(key)?.priceEnv ?? ''] || undefined;

export const panelCodeForPlan = (key: string): string | undefined => getPlanByKey(key)?.panelCode;

/**
 * Reverse-map a Stripe Price ID to a plan key. Returns the first catalog entry
 * whose configured price matches (so a shared price resolves deterministically).
 */
export const planForPriceId = (priceId: string | null | undefined): string | undefined => {
  if (!priceId) return undefined;

  return PLAN_CATALOG.find((p) => process.env[p.priceEnv] === priceId)?.key;
};

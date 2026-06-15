import { useEffect, useState } from 'react';

import { authenticatedFetch } from '../../utils/authenticatedFetch';

export interface Plan {
  key: string;
  label: string;
  description: string;
  panelCode: string;
  priceId: string | null;
  /** Amount in the currency's minor unit (e.g. cents), straight from Stripe. */
  amount: number | null;
  currency: string | null;
  /** Billing interval, e.g. 'month' | 'year'. */
  interval: string | null;
}

const INTERVAL_LABEL_NL: Record<string, string> = {
  day: 'dag',
  week: 'week',
  month: 'maand',
  year: 'jaar',
};

/** Format a plan's live Stripe price as e.g. "€9 / maand". */
export const formatPlanPrice = (plan: Plan): string | null => {
  if (plan.amount === null || !plan.currency) return null;

  const amount = new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: plan.currency.toUpperCase(),
    minimumFractionDigits: plan.amount % 100 === 0 ? 0 : 2,
  }).format(plan.amount / 100);

  const interval = plan.interval ? (INTERVAL_LABEL_NL[plan.interval] ?? plan.interval) : null;

  return interval ? `${amount} / ${interval}` : amount;
};

/**
 * Loads the plan catalog with live Stripe prices from the backend so the paywall
 * and settings screens render a single, drift-free source instead of hardcoded
 * price strings.
 */
export const usePlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const res = await authenticatedFetch('/api/subscriptions/plans');

        if (!res.ok) throw new Error('Failed to fetch plans');

        const data: { plans: Plan[] } = await res.json();

        if (active) setPlans(data.plans);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return { plans, loading, error };
};

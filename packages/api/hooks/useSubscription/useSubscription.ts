import { useCallback, useEffect, useState } from 'react';

import { authenticatedFetch } from '../../utils/authenticatedFetch';

export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'unpaid'
  | 'paused';

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string | null;
  status: SubscriptionStatus;
  plan: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
}

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  // Authoritative access flag computed by the backend (knows the grace-period
  // rules). The client never re-derives entitlement from raw status.
  const [entitled, setEntitled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await authenticatedFetch('/api/subscriptions');

      if (!res.ok) throw new Error('Failed to fetch subscription');

      const data: { subscription: Subscription | null; entitled?: boolean } = await res.json();

      setSubscription(data.subscription);
      setEntitled(Boolean(data.entitled));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const startCheckout = useCallback(async (plan: string) => {
    const res = await authenticatedFetch('/api/subscriptions/checkout', {
      method: 'POST',
      body: JSON.stringify({
        plan,
        successUrl: `${window.location.origin}/settings?section=subscription&success=true`,
        cancelUrl: `${window.location.origin}/settings?section=subscription`,
      }),
    });

    if (!res.ok) {
      const data = await res.json();

      throw new Error(data.error ?? 'Failed to create checkout session');
    }

    const data: { url: string } = await res.json();

    window.location.href = data.url;
  }, []);

  const openPortal = useCallback(async () => {
    const res = await authenticatedFetch('/api/subscriptions/portal', {
      method: 'POST',
      body: JSON.stringify({
        returnUrl: `${window.location.origin}/settings?section=subscription`,
      }),
    });

    if (!res.ok) {
      const data = await res.json();

      throw new Error(data.error ?? 'Failed to create portal session');
    }

    const data: { url: string } = await res.json();

    window.location.href = data.url;
  }, []);

  return {
    subscription,
    loading,
    error,
    // `isActive` now reflects real entitlement (incl. past_due grace), not a
    // raw status check. Kept under the same name so call sites don't change.
    isActive: entitled,
    entitled,
    startCheckout,
    openPortal,
    refetch: fetchSubscription,
  };
};

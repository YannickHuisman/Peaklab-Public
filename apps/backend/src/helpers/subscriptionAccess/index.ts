/**
 * The single definition of "does this subscription grant access right now".
 *
 * Used by the requireActiveSubscription middleware, the GET /subscriptions
 * response and the reconcile job so the backend always agrees with itself, and
 * the frontend mirrors the same rule (see useSubscription.ts).
 *
 * Policy: active / trialing always pass. `past_due` keeps access until the paid
 * period actually ends (`current_period_end`) — a grace window while Stripe
 * retries the card (dunning) instead of locking the user out on the first
 * failed charge. Everything else (canceled, unpaid, incomplete*, paused) is
 * blocked.
 */
export interface EntitlementInput {
  status?: string | null;
  current_period_end?: string | null;
}

export const isEntitled = (sub: EntitlementInput | null | undefined): boolean => {
  if (!sub?.status) return false;

  if (sub.status === 'active' || sub.status === 'trialing') return true;

  if (sub.status === 'past_due') {
    return !!sub.current_period_end && new Date(sub.current_period_end).getTime() > Date.now();
  }

  return false;
};

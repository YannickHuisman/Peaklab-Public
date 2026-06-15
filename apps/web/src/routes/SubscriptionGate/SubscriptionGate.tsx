import type { ReactNode } from 'react';
import { useState } from 'react';

import { Button } from '@components/Button/Button';
import { Heading } from '@components/Heading';
import { Loader } from '@components/Loader';
import { Paragraph } from '@components/Paragraph';
import { Spacer } from '@components/Spacer';
import { FlexColumn } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';

import { formatPlanPrice, useAuth, usePlans, useSubscription } from '@package/api';
import { theme } from '@package/ui';

import { StyledGateWrapper, StyledPlansGrid, StyledSignOutButton } from './styles';

// ---------------------------------------------------------------------------
// Paywall
// ---------------------------------------------------------------------------

function SubscriptionPaywall() {
  const { startCheckout } = useSubscription();
  const { plans } = usePlans();
  const { signOut } = useAuth();
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  const handleSelect = async (plan: string) => {
    setCheckoutLoading(plan);
    try {
      await startCheckout(plan);
    } catch {
      setCheckoutLoading(null);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch {
      // ignore
    }
  };

  return (
    <StyledGateWrapper>
      <Heading $size="large" $weight={700}>
        Kies je abonnement
      </Heading>
      <Paragraph $variant="secondary" style={{ marginTop: theme.spacing.sm }}>
        Activeer een plan om toegang te krijgen tot Peaklab.
      </Paragraph>

      <Spacer size="2xl" />

      <StyledPlansGrid>
        {plans.map((plan) => (
          <StyledCard key={plan.key}>
            <FlexColumn $gap="sm" $flex={1}>
              <Heading $size="small" $weight={600}>
                {plan.label}
              </Heading>
              <Paragraph $size="small" $variant="secondary">
                {plan.description}
              </Paragraph>
              <Paragraph $size="small" $weight={600} $mt="auto">
                {formatPlanPrice(plan) ?? ''}
              </Paragraph>

              <Button
                label={checkoutLoading === plan.key ? 'Laden...' : 'Selecteren'}
                $variant="primary"
                $size="small"
                onClick={() => handleSelect(plan.key)}
                disabled={checkoutLoading !== null}
              />
            </FlexColumn>
          </StyledCard>
        ))}
      </StyledPlansGrid>

      <Spacer size="2xl" />

      <StyledSignOutButton onClick={handleSignOut}>Uitloggen</StyledSignOutButton>
    </StyledGateWrapper>
  );
}

// ---------------------------------------------------------------------------
// Gate — renders children when subscription is active, paywall otherwise
// ---------------------------------------------------------------------------

export function SubscriptionGate({ children }: { children: ReactNode }) {
  const { isActive, loading } = useSubscription();

  if (loading) return <Loader />;
  if (!isActive) return <SubscriptionPaywall />;

  return <>{children}</>;
}

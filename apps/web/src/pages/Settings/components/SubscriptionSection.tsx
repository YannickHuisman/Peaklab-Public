import { useEffect, useState } from 'react';

import { Button } from '@components/Button/Button';
import { Heading } from '@components/Heading';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';

import { formatPlanPrice, usePlans, useSubscription } from '@package/api';
import { theme } from '@package/ui';

import { StyledSection, StyledSectionBlockTitle, StyledSettingRow } from '../styles';

export function SubscriptionSection({
  t,
  showSuccess = false,
}: {
  t: (text: string) => string;
  showSuccess?: boolean;
}) {
  const { subscription, loading, isActive, startCheckout, openPortal, refetch } = useSubscription();
  const { plans } = usePlans();

  // Re-fetch after Stripe redirects back with ?success=true to pick up the new subscription
  useEffect(() => {
    if (showSuccess) refetch();
  }, [showSuccess, refetch]);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  const handleCheckout = async (plan: string) => {
    setCheckoutLoading(plan);

    try {
      await startCheckout(plan);
    } catch {
      setCheckoutLoading(null);
    }
  };

  const handlePortal = async () => {
    setPortalLoading(true);

    try {
      await openPortal();
    } catch {
      setPortalLoading(false);
    }
  };

  const statusColor: Record<string, string> = {
    active: theme.colors.accent.green.strong,
    trialing: theme.colors.accent.blue.strong,
    past_due: theme.colors.accent.orange.strong,
    canceled: theme.colors.text.secondary,
    incomplete: theme.colors.accent.orange.strong,
  };

  return (
    <StyledSection>
      {showSuccess && (
        <StyledCard $variant="section" $gap="md">
          <Paragraph $weight={500} $color={theme.colors.accent.green.strong}>
            {t('Gelukt! Je abonnement is actief.')}
          </Paragraph>
        </StyledCard>
      )}
      {/* Current plan */}
      <StyledCard $variant="section" $gap="md">
        <StyledSectionBlockTitle>
          <Heading $size="small" $weight={600}>
            {t('Huidig abonnement')}
          </Heading>
          <Paragraph $variant="secondary" $size="small">
            {t('Beheer je Peaklab-abonnement en factuurgegevens.')}
          </Paragraph>
        </StyledSectionBlockTitle>

        {loading && (
          <Paragraph $size="small" $variant="secondary">
            {t('Laden...')}
          </Paragraph>
        )}
        {!loading && isActive && subscription && (
          <FlexColumn $gap="sm">
            <FlexRow $gap="sm" $align="center">
              <Paragraph $weight={600} $size="medium">
                {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
              </Paragraph>
              <Paragraph
                $size="small"
                $weight={500}
                $color={statusColor[subscription.status] ?? theme.colors.text.secondary}
              >
                {subscription.status}
              </Paragraph>
            </FlexRow>

            {subscription.current_period_end && (
              <Paragraph $variant="secondary" $size="small">
                {subscription.cancel_at_period_end ? t('Eindigt op') : t('Verlengt op')}{' '}
                {new Date(subscription.current_period_end).toLocaleDateString('nl-NL', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </Paragraph>
            )}

            {subscription.status === 'past_due' && (
              <Paragraph $size="small" $color={theme.colors.accent.orange.strong}>
                {t(
                  'Je laatste betaling is mislukt. Werk je betaalmethode bij om toegang te behouden.'
                )}
              </Paragraph>
            )}

            <FlexRow $gap="sm">
              {subscription.stripe_customer_id && (
                <Button
                  label={portalLoading ? t('Laden...') : t('Abonnement beheren')}
                  $variant="secondary"
                  $size="small"
                  onClick={handlePortal}
                  disabled={portalLoading}
                />
              )}
            </FlexRow>
          </FlexColumn>
        )}
        {!loading && !(isActive && subscription) && (
          <Paragraph $variant="secondary" $size="small">
            {t('Je hebt momenteel geen actief abonnement.')}
          </Paragraph>
        )}
      </StyledCard>

      {/* Plan picker — only shown when user has no active subscription */}
      {!loading && !isActive && (
        <StyledCard $variant="section" $gap="md">
          <StyledSectionBlockTitle>
            <Heading $size="small" $weight={600}>
              {t('Kies een plan')}
            </Heading>
            <Paragraph $variant="secondary" $size="small">
              {t('Je wordt doorgestuurd naar Stripe om veilig te betalen.')}
            </Paragraph>
          </StyledSectionBlockTitle>

          <FlexColumn $gap="sm">
            {plans.map((plan) => (
              <StyledSettingRow key={plan.key}>
                <FlexColumn $gap="xs">
                  <Paragraph $weight={600}>{plan.label}</Paragraph>
                  <Paragraph $variant="secondary" $size="small">
                    {plan.description}
                  </Paragraph>
                </FlexColumn>

                <FlexRow $gap="sm" $align="center">
                  <Paragraph $size="small" $weight={500}>
                    {formatPlanPrice(plan) ?? ''}
                  </Paragraph>
                  <Button
                    label={checkoutLoading === plan.key ? t('Laden...') : t('Selecteren')}
                    $variant="primary"
                    $size="small"
                    onClick={() => handleCheckout(plan.key)}
                    disabled={checkoutLoading !== null}
                  />
                </FlexRow>
              </StyledSettingRow>
            ))}
          </FlexColumn>
        </StyledCard>
      )}
    </StyledSection>
  );
}

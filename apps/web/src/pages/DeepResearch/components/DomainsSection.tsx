import { useMemo, useState } from 'react';

import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow, Grid } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { type TabItem, Tabs } from '@components/Tabs/Tabs';
import { useTranslation } from '@helpers/i18n';

import type { Domain } from '@package/api';
import { theme } from '@package/ui';

import { STATUS_LABELS } from '../constants';
import { StyledDomainScore, StyledInsightItem, StyledStatusBadge } from '../styles';

function DomainPanel({ domain }: { domain: Domain }) {
  return (
    <FlexColumn $gap="lg">
      <FlexRow $gap="md" $align="center">
        <StyledDomainScore $status={domain.status}>{domain.score}</StyledDomainScore>
        <FlexColumn $gap="xxs">
          <Heading $size="xsmall">{domain.name}</Heading>
          <StyledStatusBadge $status={domain.status}>
            {STATUS_LABELS[domain.status]}
          </StyledStatusBadge>
        </FlexColumn>
      </FlexRow>

      <Paragraph $variant="secondary" $size="small">
        {domain.summary}
      </Paragraph>

      <Grid $gap="sm" $gridMinWidth="240px">
        {domain.biomarkers.map((b) => (
          <StyledCard
            key={b.name}
            $variant="small"
            $noShadow
            style={{ border: `1px solid ${theme.colors.border.subtle}` }}
          >
            <FlexColumn $gap="xs">
              <FlexRow $justify="space-between" $align="center">
                <Paragraph $weight={600} $size="small">
                  {b.name}
                </Paragraph>
                <StyledStatusBadge $status={b.status}>{STATUS_LABELS[b.status]}</StyledStatusBadge>
              </FlexRow>
              <Heading $size="small" $color={theme.colors.text.primary}>
                {b.value}{' '}
                <span
                  style={{
                    fontSize: theme.typography.fontSize.xs,
                    fontWeight: 400,
                    color: theme.colors.text.muted,
                  }}
                >
                  {b.unit}
                </span>
              </Heading>
              <Paragraph $size="xsmall" $variant="secondary">
                {b.interpretation}
              </Paragraph>
            </FlexColumn>
          </StyledCard>
        ))}
      </Grid>

      {domain.insights?.length > 0 && (
        <FlexColumn $gap="sm">
          <Paragraph $weight={600} $size="small">
            Inzichten
          </Paragraph>
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing.sm,
            }}
          >
            {domain.insights.map((insight, i) => (
              <StyledInsightItem key={i}>{insight}</StyledInsightItem>
            ))}
          </ul>
        </FlexColumn>
      )}
    </FlexColumn>
  );
}

export function DomainsSection({ domains }: { domains: Domain[] }) {
  const { t } = useTranslation();
  const [activeDomain, setActiveDomain] = useState(domains[0]?.name ?? '');

  const tabs: TabItem<string>[] = useMemo(
    () => domains.map((d) => ({ id: d.name, label: d.name })),
    [domains]
  );

  const active = domains.find((d) => d.name === activeDomain) ?? domains[0];

  return (
    <StyledCard $variant="section">
      <FlexColumn $gap="lg">
        <FlexRow $gap="sm" $align="center">
          <Icons.Activity size="xs" color={theme.colors.primary} />
          <Heading $size="small">{t('Domeinanalyse')}</Heading>
        </FlexRow>

        {domains.length > 1 && (
          <Tabs tabs={tabs} activeTab={activeDomain} onChange={setActiveDomain} />
        )}

        {active && <DomainPanel domain={active} />}
      </FlexColumn>
    </StyledCard>
  );
}

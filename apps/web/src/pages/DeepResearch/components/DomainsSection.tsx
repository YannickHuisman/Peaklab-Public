import { useMemo, useState } from 'react';

import { Heading } from '@components/Heading';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow, Grid } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { type TabItem, Tabs } from '@components/Tabs/Tabs';
import { useTranslation } from '@helpers/i18n';

import type { Domain } from '@package/api';
import { theme } from '@package/ui';

import { STATUS_LABELS } from '../constants';
import { StyledDomainScore, StyledInsightItem, StyledStatusBadge } from '../styles';
import { BiomarkerRangeCard } from './BiomarkerRangeCard';

export function deriveDomainStatus(domain: Domain): 'optimal' | 'good' | 'concern' {
  const score = domain.score ?? 0;

  if (score >= 85) return 'optimal';
  if (score >= 65) return 'good';

  return 'concern';
}

function DomainPanel({ domain }: { domain: Domain }) {
  const status = deriveDomainStatus(domain);

  return (
    <FlexColumn $gap="lg">
      <FlexRow $gap="md" $align="center">
        <StyledDomainScore $status={status}>{domain.score}</StyledDomainScore>
        <FlexColumn $gap="sm">
          <Heading $size="xsmall">{domain.name}</Heading>
          <StyledStatusBadge $status={status}>{STATUS_LABELS[status]}</StyledStatusBadge>
        </FlexColumn>
      </FlexRow>

      <Paragraph $variant="secondary" $size="small">
        {domain.summary}
      </Paragraph>

      <Grid $gap="md" $gridMinWidth="320px">
        {domain.biomarkers.map((b) => (
          <BiomarkerRangeCard key={b.name} biomarker={b} />
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

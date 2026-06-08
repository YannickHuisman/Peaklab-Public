import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { useTranslation } from '@helpers/i18n';

import type { ReportSummary } from '@package/api';
import { theme } from '@package/ui';

interface ReportHistoryProps {
  reports: ReportSummary[];
  activeReportId: string | null;
  onSelect: (reportId: string) => void;
}

const STATUS_CONFIG = {
  completed: { color: theme.colors.accent.green.strong, label: 'Voltooid' },
  generating: { color: theme.colors.warning.strong, label: 'Bezig...' },
  failed: { color: theme.colors.error.strong, label: 'Mislukt' },
} as const;

export function ReportHistory({ reports, activeReportId, onSelect }: ReportHistoryProps) {
  const { t } = useTranslation();

  const completedReports = reports.filter((r) => r.status === 'completed');

  if (completedReports.length <= 1) return null;

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  return (
    <StyledCard $variant="small" $noShadow>
      <FlexColumn $gap="sm">
        <FlexRow $gap="xs" $align="center">
          <Icons.Clock size={16} color={theme.colors.text.secondary} />
          <Paragraph $size="small" $weight={600}>
            {t('Eerdere rapporten')}
          </Paragraph>
        </FlexRow>

        <FlexColumn $gap="xs">
          {completedReports.map((report) => {
            const isActive = report.id === activeReportId;
            const config = STATUS_CONFIG[report.status];

            return (
              <FlexRow
                key={report.id}
                $gap="sm"
                $align="center"
                $padding="sm"
                onClick={() => onSelect(report.id)}
                style={{
                  cursor: 'pointer',
                  borderRadius: theme.borderRadius.md,
                  background: isActive ? theme.colors.neutral[100] : 'transparent',
                  transition: 'background 0.15s',
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: config.color,
                    flexShrink: 0,
                  }}
                />
                <FlexColumn $gap="xxs" $flex={1}>
                  <Paragraph $size="small" $weight={isActive ? 600 : 400}>
                    {formatDate(report.created_at)}
                  </Paragraph>
                  {report.summary && (
                    <Paragraph
                      $size="xsmall"
                      $variant="secondary"
                      $overflow="hidden"
                      $textOverflow="ellipsis"
                      $maxWidth="300px"
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {report.summary}
                    </Paragraph>
                  )}
                </FlexColumn>
                {isActive && <Icons.ChevronRight size={16} color={theme.colors.text.secondary} />}
              </FlexRow>
            );
          })}
        </FlexColumn>
      </FlexColumn>
    </StyledCard>
  );
}

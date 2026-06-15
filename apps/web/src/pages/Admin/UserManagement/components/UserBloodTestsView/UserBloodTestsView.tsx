import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { Grid } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { getClickableProps } from '@helpers/getClickableProps';

import { StyledContainer, StyledEmptyState, StyledTestStatus } from './styles';

interface BloodTest {
  id: number;
  sample_taken_at: string;
  status: string;
  panel?: {
    id: number;
    name: string;
    code: string;
  };
}

interface UserBloodTestsViewProps {
  bloodTests: BloodTest[];
  onTestSelect?: (testId: number) => void;
}

import { formatDate } from '@helpers/formatDate';

export function UserBloodTestsView({ bloodTests, onTestSelect }: UserBloodTestsViewProps) {
  return (
    <StyledContainer>
      <Heading $size="xsmall" $weight={600}>
        Blood Tests History ({bloodTests.length})
      </Heading>

      {bloodTests.length === 0 && <StyledEmptyState>No blood tests found</StyledEmptyState>}
      {bloodTests.length > 0 && (
        <Grid $gridMinWidth="200px" $gap="sm">
          {bloodTests.map((test) => (
            <StyledCard
              key={test.id}
              $variant="small"
              $interactive={!!onTestSelect}
              {...(onTestSelect
                ? getClickableProps(
                    () => onTestSelect(test.id),
                    formatDate(test.sample_taken_at, { preset: 'date' })
                  )
                : {})}
            >
              <Paragraph $weight={600}>
                {formatDate(test.sample_taken_at, { preset: 'date' })}
              </Paragraph>
              <Paragraph $size="small" $variant="secondary">
                {test.panel?.name}
              </Paragraph>
              <Paragraph $size="xsmall" $variant="secondary">
                Code: {test.panel?.code}
              </Paragraph>
              <StyledTestStatus $status={test.status}>
                {test.status === 'completed' && (
                  <>
                    <Icons.Check size="sm" /> Completed
                  </>
                )}
                {test.status !== 'completed' && (
                  <>
                    <Icons.Clock size="sm" /> Pending
                  </>
                )}
              </StyledTestStatus>
            </StyledCard>
          ))}
        </Grid>
      )}
    </StyledContainer>
  );
}

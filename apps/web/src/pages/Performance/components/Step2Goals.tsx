import { Input } from '@components/form/Input';
import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { Spacer } from '@components/Spacer';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';

import { theme } from '@package/ui';

import {
  StyledGoalIcon,
  StyledGoalRequired,
  StyledGoalsOverviewItem,
  StyledGoalsOverviewTitle,
  StyledTextarea,
} from '../styles';
import type { PerformanceFormData } from '../types';

interface Step2GoalsProps {
  formData: PerformanceFormData;
  onChange: <K extends keyof PerformanceFormData>(field: K, value: PerformanceFormData[K]) => void;
  hideHeading?: boolean;
}

export function Step2Goals({ formData, onChange, hideHeading }: Step2GoalsProps) {
  const handleSecondaryGoalChange = (index: number, value: string) => {
    const newSecondaryGoals = [...formData.secondaryGoals];

    newSecondaryGoals[index] = value;
    onChange('secondaryGoals', newSecondaryGoals);
  };

  const hasAnyGoal =
    formData.primaryGoal || formData.secondaryGoals.some((g) => g.trim().length > 0);

  return (
    <FlexColumn $gap="lg">
      {!hideHeading && (
        <FlexColumn $gap="xs">
          <Heading $size="medium">Performance Doelen</Heading>
          <Paragraph $variant="secondary">
            Kies 1 primair doel en maximaal 2 secundaire doelen
          </Paragraph>
        </FlexColumn>
      )}

      {/* Primary Goal */}
      <FlexRow $align="center" $gap="sm">
        <StyledGoalIcon>
          <Icons.Target size="sm" color={theme.colors.text.primary} />
        </StyledGoalIcon>
        <FlexColumn $gap="xxs">
          <Paragraph $weight={600}>
            Primair Doel <StyledGoalRequired>*</StyledGoalRequired>
          </Paragraph>
          <Paragraph $size="small" $variant="secondary">
            Wees specifiek en meetbaar
          </Paragraph>
        </FlexColumn>
      </FlexRow>

      <StyledTextarea
        value={formData.primaryGoal}
        onChange={(e) => onChange('primaryGoal', e.target.value)}
      />

      <FlexColumn $gap="sm">
        <Paragraph $size="small" $variant="secondary">
          Wanneer wil je dit doel behalen?
        </Paragraph>
        <Input
          type="number"
          suffix="maanden"
          min={1}
          value={formData.primaryGoalTimelineMonths ?? ''}
          onChange={(e) => onChange('primaryGoalTimelineMonths', Number(e.target.value) || null)}
          style={{ width: '64px' }}
        />
      </FlexColumn>

      <Spacer size="lg" />

      {/* Secondary Goals */}
      <FlexColumn $gap="md">
        <FlexRow $gap="sm" $align="center">
          <StyledGoalIcon>
            <Icons.Settings size="sm" color={theme.colors.text.primary} />
          </StyledGoalIcon>
          <FlexColumn $gap="xxs">
            <Paragraph $weight={600}>Secundaire Doelen (optioneel, max 2)</Paragraph>
            <Paragraph $size="small" $variant="secondary">
              Wees concreet en meetbaar in je doelen
            </Paragraph>
          </FlexColumn>
        </FlexRow>

        <FlexColumn $gap="sm">
          <FlexColumn $gap="xs">
            <Paragraph $size="small" $weight={500}>
              Secundair Doel 1
            </Paragraph>
            <StyledTextarea
              value={formData.secondaryGoals[0] || ''}
              onChange={(e) => handleSecondaryGoalChange(0, e.target.value)}
              style={{ minHeight: '60px' }}
            />
          </FlexColumn>

          <FlexColumn $gap="xs">
            <Paragraph $size="small" $weight={500}>
              Secundair Doel 2
            </Paragraph>
            <StyledTextarea
              value={formData.secondaryGoals[1] || ''}
              onChange={(e) => handleSecondaryGoalChange(1, e.target.value)}
              style={{ minHeight: '60px' }}
            />
          </FlexColumn>
        </FlexColumn>
      </FlexColumn>

      {/* Goals Overview */}
      {hasAnyGoal && (
        <StyledCard $variant="small" $gap="sm">
          <StyledGoalsOverviewTitle>
            <Icons.Clipboard size="sm" color={theme.colors.text.primary} />
            Jouw doelen overzicht
          </StyledGoalsOverviewTitle>
          {formData.primaryGoal && (
            <StyledGoalsOverviewItem>Primair: {formData.primaryGoal}</StyledGoalsOverviewItem>
          )}
          {formData.secondaryGoals.map(
            (goal, index) =>
              goal.trim().length > 0 && (
                <StyledGoalsOverviewItem key={index}>
                  Secundair {index + 1}: {goal}
                </StyledGoalsOverviewItem>
              )
          )}
        </StyledCard>
      )}
    </FlexColumn>
  );
}

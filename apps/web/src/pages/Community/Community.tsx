import { Icons } from '@components/Icons';
import { FlexColumn } from '@components/styled/layout';

import { theme } from '@package/ui';

import { StyledChip, StyledIconRing } from './styles';

export function Community() {
  return (
    <FlexColumn
      $gap="lg"
      $align="center"
      $flex={1}
      $justify="center"
      style={{ textAlign: 'center', minHeight: 560 }}
    >
      <StyledIconRing>
        <Icons.Users size={30} color={theme.colors.ink} strokeWidth={1.5} />
      </StyledIconRing>

      <FlexColumn $gap="sm" $align="center" style={{ maxWidth: 440 }}>
        <h1
          style={{
            fontFamily: theme.typography.fontFamily.primary,
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: '-0.025em',
            margin: 0,
            color: theme.colors.ink,
          }}
        >
          Community
        </h1>
        <div
          style={{
            fontSize: 15,
            color: theme.colors.ink60,
            marginTop: 10,
            lineHeight: 1.6,
          }}
        >
          We bouwen aan een platform waar sporters, biomarkers en prestaties samenkomen. Deel
          voortgang, stel vragen en ontdek ervaringen van anderen.
        </div>
      </FlexColumn>

      <StyledChip>
        <Icons.Clock size={15} color={theme.colors.ink60} />
        <span style={{ fontSize: 13, fontWeight: 600, color: theme.colors.ink70 }}>
          Verwacht in Q3 2026
        </span>
      </StyledChip>
    </FlexColumn>
  );
}

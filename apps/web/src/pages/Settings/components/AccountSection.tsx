import { Button } from '@components/Button/Button';
import { Heading } from '@components/Heading';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';

import { theme } from '@package/ui';

import {
  StyledDangerZone,
  StyledSection,
  StyledSectionBlock,
  StyledSectionBlockTitle,
  StyledSettingRow,
} from '../styles';

export function AccountSection({ t }: { t: (text: string) => string }) {
  return (
    <StyledSection>
      <StyledSectionBlock>
        <StyledSectionBlockTitle>
          <Heading $size="small" $weight={600}>
            {t('Wachtwoord')}
          </Heading>
          <Paragraph $variant="secondary" $size="small">
            {t('Wijzig je wachtwoord of stel tweefactorauthenticatie in.')}
          </Paragraph>
        </StyledSectionBlockTitle>

        <FlexRow $gap="sm">
          <Button label={t('Wachtwoord wijzigen')} $variant="secondary" $size="small" />
        </FlexRow>
      </StyledSectionBlock>

      <StyledSectionBlock>
        <StyledSectionBlockTitle>
          <Heading $size="small" $weight={600}>
            {t('Verbonden accounts')}
          </Heading>
          <Paragraph $variant="secondary" $size="small">
            {t('Koppel externe platforms voor extra gezondheidsdata.')}
          </Paragraph>
        </StyledSectionBlockTitle>

        <FlexColumn $gap="sm">
          {[
            { label: 'Garmin', connected: false },
            { label: 'Apple Health', connected: false },
            { label: 'Google Fit', connected: false },
          ].map(({ label, connected }) => (
            <StyledSettingRow key={label}>
              <Paragraph $weight={500}>{label}</Paragraph>
              <Button
                label={connected ? t('Ontkoppelen') : t('Koppelen')}
                $variant={connected ? 'ghost' : 'secondary'}
                $size="small"
              />
            </StyledSettingRow>
          ))}
        </FlexColumn>
      </StyledSectionBlock>

      <StyledSectionBlock>
        <StyledSectionBlockTitle>
          <Heading $size="small" $weight={600}>
            {t('Gegevens exporteren')}
          </Heading>
          <Paragraph $variant="secondary" $size="small">
            {t('Download een kopie van al jouw PeakLab-data.')}
          </Paragraph>
        </StyledSectionBlockTitle>

        <Button label={t('Gegevens exporteren (CSV)')} $variant="secondary" $size="small" />
      </StyledSectionBlock>

      <StyledDangerZone>
        <Heading $size="small" $weight={600} $color={theme.colors.error.strong}>
          {t('Gevarenzone')}
        </Heading>
        <Paragraph $variant="secondary" $size="small">
          {t('Het verwijderen van je account is onomkeerbaar. Alle data wordt permanent gewist.')}
        </Paragraph>
        <Button label={t('Account verwijderen')} $variant="ghost" $size="small" />
      </StyledDangerZone>
    </StyledSection>
  );
}

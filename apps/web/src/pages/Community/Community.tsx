import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { useTranslation } from '@helpers/i18n';

import { theme } from '@package/ui';

import { StyledIconRing } from './styles';

export function Community() {
  const { t } = useTranslation();

  return (
    <FlexColumn $gap="lg" $align="center" $flex={1} $justify="center">
      {/* <FlexColumn $gap="2xl" $width="100%" style={{ margin: '0 auto' }}> */}
      {/* <FlexColumn $gap="2xl" $maxWidth={640} style={{ width: '100%', margin: '0 auto' }}> */}
      {/* Hero block */}
      <StyledIconRing>
        <Icons.Users size={32} color={theme.colors.neutral[900]} />
      </StyledIconRing>

      <FlexColumn $gap="sm" $align="center">
        <Heading $size="xlarge" $weight={800} $align="center">
          {t('Community')}
        </Heading>
        <Paragraph $variant="secondary" $align="center" $size="large">
          {t('We bouwen aan een platform waar sporters, biopmarkers en prestaties samenkomen.')}
        </Paragraph>
      </FlexColumn>

      <StyledCard $padding="sm" $noShadow>
        <FlexRow $align="center" $gap="xs">
          <Icons.Clock size="sm" color={theme.colors.warning.main} />
          <Paragraph $size="small" $weight={600} $color={theme.colors.warning.strong}>
            {t('Verwacht in Q3 2026')}
          </Paragraph>
        </FlexRow>
      </StyledCard>
    </FlexColumn>

    // {/* Feature list */}
    // {/* <FlexColumn $gap="sm">
    //     {FEATURES.map((f) => (
    //       <StyledFeatureItem key={f.title}>
    //         <StyledFeatureIconBox $color={f.bg}>{f.icon}</StyledFeatureIconBox>
    //         <FlexColumn $gap="xs">
    //           <Paragraph $weight={600}>{f.title}</Paragraph>
    //           <Paragraph $variant="secondary" $size="small">
    //             {f.description}
    //           </Paragraph>
    //         </FlexColumn>
    //       </StyledFeatureItem>
    //     ))}
    //   </FlexColumn> */}

    // {/* Notify form */}
    // {/* <StyledCard $padding="xl">
    //     <FlexColumn $gap="md">
    //       <FlexColumn $gap="xs">
    //         <Heading $size="small" $weight={700}>
    //           Blijf op de hoogte
    //         </Heading>
    //         <Paragraph $variant="secondary" $size="small">
    //           Meld je aan en ontvang een bericht zodra de Community live gaat.
    //         </Paragraph>
    //       </FlexColumn>

    //       {submitted ? (
    //         <StyledSuccessBanner>
    //           <Icons.Check size="sm" color={theme.colors.success.strong} />
    //           Gelukt! We laten je weten zodra het zover is.
    //         </StyledSuccessBanner>
    //       ) : (
    //         <form onSubmit={handleNotify}>
    //           <FlexRow $gap="sm" $align="center">
    //             <StyledEmailInput
    //               type="email"
    //               placeholder="jouw@email.nl"
    //               value={email}
    //               onChange={(e) => setEmail(e.target.value)}
    //               required
    //             />
    //             <Button $variant="primary" $size="small" type="submit">
    //               <Icons.Bell size="sm" />
    //               Herinner mij
    //             </Button>
    //           </FlexRow>
    //         </form>
    //       )}
    //     </FlexColumn>
    //   </StyledCard> */}
  );
}

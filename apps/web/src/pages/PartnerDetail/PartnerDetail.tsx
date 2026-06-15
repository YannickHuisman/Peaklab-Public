import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { Button } from '@components/Button';
import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Loader } from '@components/Loader';
import { OptimizedImage } from '@components/OptimizedImage';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow, Grid } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { REGION_OPTIONS, SPECIALIZATION_OPTIONS } from '@consts';
import { useTranslation } from '@helpers/i18n';
import { useDeviceBreakpoints } from '@hooks/useDeviceBreakpoints';

import type { Partner, PartnerLink } from '@package/api';
import { useAppData } from '@package/api';
import { theme } from '@package/ui';

import {
  StyledDetailBadge,
  StyledDetailHero,
  StyledInfoRow,
  StyledRatingBadge,
  StyledSectionHeading,
  StyledTag,
} from './styles';

const PARTNER_TYPE_LABELS: Record<Partner['type'], string> = {
  trainer: 'Trainer / Coach',
  expert: 'Expert / Specialist',
  supplement: 'Supplementen',
  clothing: 'Sportkleding',
  other: 'Anders',
};

function getRegionLabel(value: string) {
  return REGION_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

function getSpecializationLabel(value: string) {
  return SPECIALIZATION_OPTIONS.find((o) => o.value === value)?.label ?? value;
}

function getLinkIcon(type: PartnerLink['type']) {
  switch (type) {
    case 'instagram':
      return <Icons.ExternalLink size="xs" color={theme.colors.text.muted} />;
    case 'website':
      return <Icons.Globe size="xs" color={theme.colors.text.muted} />;
    default:
      return <Icons.ExternalLink size="xs" color={theme.colors.text.muted} />;
  }
}

function getLinkLabel(link: PartnerLink) {
  if (link.label) return link.label;
  switch (link.type) {
    case 'instagram':
      return 'Instagram';
    case 'website':
      return 'Website';
    default:
      return link.url;
  }
}

export function PartnerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isMobile } = useDeviceBreakpoints();
  const { partners, loading } = useAppData();
  const location = useLocation();

  const handleBack = () => {
    if (location.key !== 'default') {
      navigate(-1);
    } else {
      navigate('/partners');
    }
  };

  const partner = partners.find((p) => p.id === id);

  if (loading) {
    return <Loader />;
  }

  if (!partner) {
    return (
      <FlexColumn $gap="lg">
        <Button $variant="ghost" $size="small" onClick={handleBack}>
          <FlexRow $gap="xs" $align="center">
            <Icons.ArrowLeft size="xs" />
            <span>{t('Terug naar partners')}</span>
          </FlexRow>
        </Button>
        <StyledCard $variant="small" $tone="error">
          <Paragraph>{t('Deze partner bestaat niet of is niet meer actief.')}</Paragraph>
        </StyledCard>
      </FlexColumn>
    );
  }

  const hasSpecs = partner.specializations && partner.specializations.length > 0;

  // Collect all links
  const allLinks: { label: string; url: string; icon: React.ReactNode }[] = [];

  if (partner.affiliate_url) {
    allLinks.push({
      label: t('Bekijk aanbod'),
      url: partner.affiliate_url,
      icon: <Icons.ExternalLink size="xs" />,
    });
  }

  if (partner.website_url && partner.website_url !== partner.affiliate_url) {
    allLinks.push({
      label: t('Website'),
      url: partner.website_url,
      icon: <Icons.Globe size="xs" />,
    });
  }

  if (partner.links) {
    const seen = new Set(allLinks.map((l) => l.url));

    partner.links.forEach((link) => {
      if (!link.url || seen.has(link.url)) return;
      seen.add(link.url);
      allLinks.push({
        label: getLinkLabel(link),
        url: link.url,
        icon: getLinkIcon(link.type),
      });
    });
  }

  return (
    <FlexColumn $gap="lg">
      {/* Back navigation */}
      <Button $variant="ghost" $size="small" onClick={handleBack}>
        <FlexRow $gap="xs" $align="center">
          <Icons.ArrowLeft size="xs" />
          <span>{t('Terug naar partners')}</span>
        </FlexRow>
      </Button>

      {/* Hero image */}
      {partner.image_url && (
        <StyledDetailHero>
          <OptimizedImage
            src={partner.image_url}
            alt={partner.name}
            height="260px"
            objectFit="cover"
            fallbackIcon={<Icons.User size="xl" color={theme.colors.text.muted} />}
          />
        </StyledDetailHero>
      )}

      {/* Main content */}
      <Grid $gap="lg" $gridMinWidth={isMobile ? '100%' : '300px'}>
        {/* Primary info — spans full width */}
        <StyledCard $padding="lg" style={{ gridColumn: isMobile ? undefined : '1 / -1' }}>
          <FlexColumn $gap="md">
            {/* Name + type + rating */}
            <FlexRow $justify="space-between" $align="flex-start" $gap="sm">
              <FlexColumn $gap="xs">
                <Heading $size="large" $weight={700}>
                  {partner.name}
                </Heading>
                {partner.subtitle && <Paragraph $variant="secondary">{partner.subtitle}</Paragraph>}
              </FlexColumn>

              <FlexColumn $align="flex-end" $gap="xs">
                <StyledDetailBadge $type={partner.type}>
                  {PARTNER_TYPE_LABELS[partner.type]}
                </StyledDetailBadge>
                {partner.rating && (
                  <StyledRatingBadge>
                    ★ {partner.rating.toFixed(1)}
                    {partner.review_count > 0 && (
                      <Paragraph as="span" $size="xsmall" $variant="tertiary" $weight={400}>
                        &nbsp;({partner.review_count})
                      </Paragraph>
                    )}
                  </StyledRatingBadge>
                )}
              </FlexColumn>
            </FlexRow>

            {/* Meta info */}
            <FlexColumn $gap="xs">
              {(() => {
                const regions =
                  partner.regions && partner.regions.length > 0
                    ? partner.regions
                    : partner.region
                      ? [partner.region]
                      : [];

                return (
                  regions.length > 0 && (
                    <StyledInfoRow>
                      <Icons.Globe size="xs" color={theme.colors.text.muted} />
                      <span>{regions.map(getRegionLabel).join(', ')}</span>
                    </StyledInfoRow>
                  )
                );
              })()}
              {partner.gender && partner.gender !== 'other' && (
                <StyledInfoRow>
                  <Icons.User size="xs" color={theme.colors.text.muted} />
                  <span>{partner.gender === 'male' ? 'Man' : 'Vrouw'}</span>
                </StyledInfoRow>
              )}
              {partner.price_from !== null && (
                <StyledInfoRow>
                  <Icons.Target size="xs" color={theme.colors.text.muted} />
                  <span>
                    {t('Vanaf')} €{partner.price_from.toFixed(0)}/{partner.price_unit}
                  </span>
                </StyledInfoRow>
              )}
            </FlexColumn>

            {/* Tags */}
            {partner.tags.length > 0 && (
              <FlexRow $flexWrap="wrap" $gap="xs">
                {partner.tags.map((tag) => (
                  <StyledTag key={tag}>{tag}</StyledTag>
                ))}
              </FlexRow>
            )}

            {/* Description */}
            {partner.description && (
              <Paragraph $variant="secondary" style={{ lineHeight: 1.65 }}>
                {partner.description}
              </Paragraph>
            )}
          </FlexColumn>
        </StyledCard>

        {/* Specializations */}
        {hasSpecs && (
          <StyledCard $padding="lg">
            <StyledSectionHeading>{t('Specialisaties')}</StyledSectionHeading>
            <FlexColumn $gap="xs">
              {partner.specializations?.map((spec) => (
                <StyledInfoRow key={spec}>
                  <Icons.Check size="xs" color={theme.colors.text.muted} />
                  <span>{getSpecializationLabel(spec)}</span>
                </StyledInfoRow>
              ))}
            </FlexColumn>
          </StyledCard>
        )}

        {/* Links & Contact */}
        {allLinks.length > 0 && (
          <StyledCard $padding="lg">
            <StyledSectionHeading>{t('Links & Contact')}</StyledSectionHeading>
            <FlexColumn $gap="sm">
              {allLinks.map((link, index) => (
                <Button
                  key={index}
                  $variant={index === 0 ? 'primary' : 'secondary'}
                  onClick={() => window.open(link.url, '_blank', 'noopener,noreferrer')}
                >
                  <FlexRow $gap="xs" $align="center">
                    {link.icon}
                    <span>{link.label}</span>
                  </FlexRow>
                </Button>
              ))}
            </FlexColumn>
          </StyledCard>
        )}
      </Grid>
    </FlexColumn>
  );
}

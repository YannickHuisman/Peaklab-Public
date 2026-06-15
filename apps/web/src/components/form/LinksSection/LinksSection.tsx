import { Button } from '@components/Button';
import { Input } from '@components/form/Input';
import { Select } from '@components/form/Select';
import { Icons } from '@components/Icons';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { isValidUrl } from '@hooks/useForm';

import type { PartnerLink, PartnerLinkType } from '@package/api';
import { theme } from '@package/ui';

import { StyledLabel, StyledSectionTitle } from './styles';

const LINK_TYPE_OPTIONS: { value: PartnerLinkType; label: string }[] = [
  { value: 'website', label: 'Website' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'other', label: 'Anders' },
];

const LINK_PLACEHOLDERS: Record<PartnerLinkType, string> = {
  website: 'https://www.jouwwebsite.nl',
  instagram: 'https://www.instagram.com/jouwprofiel',
  other: 'https://...',
};

interface LinksSectionProps {
  links: PartnerLink[];
  onChange: (links: PartnerLink[]) => void;
}

export function LinksSection({ links, onChange }: LinksSectionProps) {
  const addLink = () => {
    onChange([...links, { type: 'website', url: '' }]);
  };

  const removeLink = (index: number) => {
    onChange(links.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, partial: Partial<PartnerLink>) => {
    onChange(links.map((link, i) => (i === index ? { ...link, ...partial } : link)));
  };

  return (
    <div>
      <StyledSectionTitle>Links</StyledSectionTitle>
      <FlexColumn $gap="sm">
        {links.map((link, index) => {
          const hasError = link.url.length > 0 && !isValidUrl(link.url);

          return (
            <FlexRow key={index} $gap="sm" $align="flex-start">
              <div style={{ flexShrink: 0, width: 140 }}>
                <StyledLabel htmlFor={`link-type-${index}`}>Type</StyledLabel>
                <Select
                  id={`link-type-${index}`}
                  options={LINK_TYPE_OPTIONS}
                  value={link.type}
                  onChange={(e) => updateLink(index, { type: e.target.value as PartnerLinkType })}
                />
              </div>
              <div style={{ flex: 1 }}>
                <Input
                  label="URL"
                  value={link.url}
                  onChange={(e) => updateLink(index, { url: e.target.value })}
                  placeholder={LINK_PLACEHOLDERS[link.type]}
                  type="url"
                  error={hasError ? 'Voer een geldige URL in (begint met https://)' : undefined}
                />
              </div>
              <div style={{ paddingTop: 22, flexShrink: 0 }}>
                <Button
                  type="button"
                  $variant="ghost"
                  $size="small"
                  onClick={() => removeLink(index)}
                  title="Verwijder link"
                  aria-label="Verwijder link"
                >
                  <Icons.Trash size="xs" color={theme.colors.text.muted} aria-hidden="true" />
                </Button>
              </div>
            </FlexRow>
          );
        })}

        {links.length < 5 && (
          <Button
            type="button"
            $variant="secondary"
            $size="small"
            onClick={addLink}
            style={{ alignSelf: 'flex-start' }}
          >
            <FlexRow $gap="xs" $align="center">
              <Icons.Plus size="xs" />
              <span>Link toevoegen</span>
            </FlexRow>
          </Button>
        )}
      </FlexColumn>
    </div>
  );
}

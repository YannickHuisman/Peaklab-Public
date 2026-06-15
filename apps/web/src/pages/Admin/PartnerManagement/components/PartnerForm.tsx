import { useRef, useState } from 'react';

import { Button } from '@components/Button';
import { ImageUpload } from '@components/form/ImageUpload';
import { Input } from '@components/form/Input';
import { LinksSection } from '@components/form/LinksSection';
import { MultiSelect } from '@components/form/MultiSelect';
import { Select } from '@components/form/Select';
import { TagsInput } from '@components/form/TagsInput';
import { Paragraph } from '@components/Paragraph';
import { FlexRow } from '@components/styled/layout';
import { Tooltip } from '@components/Tooltip';
import { GENDER_OPTIONS, REGION_OPTIONS, SPECIALIZATION_OPTIONS } from '@consts';
import { numeric, urlList, useForm } from '@hooks/useForm';

import type {
  DutchRegion,
  Partner,
  PartnerLink,
  PartnerType,
  TrainerSpecialization,
} from '@package/api';

import { authenticatedFetch } from '../../../../helpers/authenticatedFetch';
import {
  StyledCheckboxGrid,
  StyledCheckboxLabel,
  StyledCheckboxWrapper,
  StyledFormGrid,
  StyledFormRow,
  StyledLabel,
  StyledTextArea,
} from './styles';

interface PartnerFormProps {
  partner: Partner | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const PARTNER_TYPE_OPTIONS: { value: PartnerType; label: string }[] = [
  { value: 'trainer', label: 'Trainer / Coach' },
  { value: 'expert', label: 'Expert / Specialist' },
  { value: 'supplement', label: 'Supplementen' },
  { value: 'clothing', label: 'Sportkleding' },
  { value: 'other', label: 'Anders' },
];

const PRICE_UNIT_OPTIONS = [
  { value: 'sessie', label: 'Per sessie' },
  { value: 'uur', label: 'Per uur' },
  { value: 'maand', label: 'Per maand' },
  { value: 'jaar', label: 'Per jaar' },
  { value: 'project', label: 'Per project' },
];

interface PartnerFormData {
  name: string;
  type: PartnerType;
  subtitle: string;
  description: string;
  image_url: string | null;
  affiliate_url: string;
  website_url: string;
  rating: string;
  price_from: string;
  price_unit: string;
  gender: 'male' | 'female' | 'other' | '';
  is_featured: boolean;
  regions: DutchRegion[];
  specializations: TrainerSpecialization[];
  links: PartnerLink[];
  tags: string[];
}

export function PartnerForm({ partner, onSuccess, onCancel }: PartnerFormProps) {
  const [priceFocused, setPriceFocused] = useState(false);
  const priceInputRef = useRef<HTMLInputElement>(null);

  const {
    values,
    errors,
    touched,
    isSubmitting,
    getFieldProps,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
    toggleArrayItem,
  } = useForm<PartnerFormData>({
    initialValues: {
      name: partner?.name || '',
      type: partner?.type || 'trainer',
      subtitle: partner?.subtitle || '',
      description: partner?.description || '',
      image_url: partner?.image_url || null,
      affiliate_url: partner?.affiliate_url || '',
      website_url: partner?.website_url || '',
      rating: partner?.rating?.toString() || '',
      price_from: partner?.price_from?.toString() || '',
      price_unit: partner?.price_unit || 'sessie',
      gender: partner?.gender || '',
      is_featured: partner?.is_featured ?? false,
      regions:
        partner?.regions && partner.regions.length > 0
          ? partner.regions
          : partner?.region
            ? [partner.region]
            : [],
      specializations: partner?.specializations || [],
      links: partner?.links || [],
      tags: partner?.tags || [],
    },
    requiredFields: ['name', 'type'],
    validationRules: {
      rating: (value) => {
        if (value && (Number(value) < 0 || Number(value) > 5)) {
          return 'Rating must be between 0 and 5';
        }

        return null;
      },
      price_from: numeric({ min: 0, message: 'Price cannot be negative' }),
      links: urlList<PartnerFormData, PartnerLink>({ itemLabel: 'Link' }),
    },
    onSubmit: async (formData) => {
      const cleanedLinks = formData.links.filter((l) => l.url);
      const websiteFromLinks = cleanedLinks.find((l) => l.type === 'website')?.url ?? null;

      const payload = {
        name: formData.name,
        type: formData.type,
        subtitle: formData.subtitle || null,
        description: formData.description || null,
        image_url: formData.image_url || null,
        affiliate_url: formData.affiliate_url || null,
        website_url: formData.website_url || websiteFromLinks,
        rating: formData.rating ? Number(formData.rating) : null,
        price_from: formData.price_from ? Number(formData.price_from) : null,
        price_unit: formData.price_from ? formData.price_unit : null,
        region: formData.regions[0] || null,
        regions: formData.regions.length > 0 ? formData.regions : null,
        gender: formData.gender || null,
        specializations: formData.specializations.length > 0 ? formData.specializations : null,
        links: cleanedLinks.length > 0 ? cleanedLinks : null,
        tags: formData.tags,
        is_featured: formData.is_featured,
        is_active: true,
      };

      if (partner) {
        await authenticatedFetch(`/api/partners/admin/${partner.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await authenticatedFetch('/api/partners/admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      onSuccess();
    },
  });

  const showTrainerFields = values.type === 'trainer';
  const linksError = touched.links && errors.links ? errors.links : undefined;

  return (
    <form onSubmit={handleSubmit}>
      <StyledFormGrid>
        {/* Basic info */}
        <StyledFormRow>
          <Input
            label="Naam *"
            {...getFieldProps('name')}
            placeholder="Naam van de partner"
            error={touched.name && errors.name ? errors.name : undefined}
          />
          <Select
            label="Type *"
            options={PARTNER_TYPE_OPTIONS}
            value={values.type}
            onChange={(e) => setFieldValue('type', e.target.value as PartnerType)}
            error={touched.type && errors.type ? errors.type : undefined}
          />
        </StyledFormRow>

        <Input
          label="Tagline"
          {...getFieldProps('subtitle')}
          placeholder="Personal Trainer in Amsterdam"
        />

        <div>
          <StyledLabel>Omschrijving</StyledLabel>
          <StyledTextArea
            {...getFieldProps('description')}
            placeholder="Beschrijf de partner..."
            rows={3}
          />
        </div>

        {/* Profile image */}
        <div>
          <StyledLabel>Profielfoto</StyledLabel>
          <ImageUpload
            value={values.image_url}
            onChange={(url) => setFieldValue('image_url', url)}
          />
        </div>

        {/* URLs */}
        <StyledFormRow>
          <Input
            label="Affiliate URL"
            {...getFieldProps('affiliate_url')}
            placeholder="https://..."
            type="url"
          />
          <Input
            label="Website URL"
            {...getFieldProps('website_url')}
            placeholder="https://www.partner.nl"
            type="url"
          />
        </StyledFormRow>

        {/* Price */}
        <div>
          <StyledLabel>Startprijs</StyledLabel>
          <div
            style={{
              display: 'flex',
              alignItems: 'stretch',
              border: `1px solid ${priceFocused ? 'var(--color-border-strong)' : 'var(--color-border-subtle)'}`,
              borderRadius: '8px',
              background: 'var(--color-bg-raised)',
              overflow: 'hidden',
              transition: 'border-color 0.15s ease',
            }}
            onClick={() => priceInputRef.current?.focus()}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0 10px',
                fontSize: '14px',
                fontWeight: 500,
                color: 'var(--color-text-muted)',
                background: 'var(--color-bg-app)',
                borderRight: '1px solid var(--color-border-subtle)',
                flexShrink: 0,
                userSelect: 'none',
              }}
            >
              €
            </span>
            <input
              ref={priceInputRef}
              {...getFieldProps('price_from')}
              type="number"
              min="0"
              step="1"
              placeholder="49"
              onFocus={() => setPriceFocused(true)}
              onBlur={() => {
                setPriceFocused(false);
                getFieldProps('price_from').onBlur?.();
              }}
              style={{
                flex: 1,
                minWidth: 0,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                padding: '8px 10px',
                fontSize: '14px',
                color: 'var(--color-text-primary)',
                fontFamily: 'inherit',
                MozAppearance: 'textfield',
              }}
            />
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0 6px',
                fontSize: '13px',
                color: 'var(--color-text-muted)',
                background: 'var(--color-bg-app)',
                borderLeft: '1px solid var(--color-border-subtle)',
                borderRight: '1px solid var(--color-border-subtle)',
                userSelect: 'none',
                flexShrink: 0,
              }}
            >
              /
            </span>
            <select
              value={values.price_unit}
              onChange={(e) => setFieldValue('price_unit', e.target.value)}
              onFocus={() => setPriceFocused(true)}
              onBlur={() => setPriceFocused(false)}
              style={{
                border: 'none',
                outline: 'none',
                background: 'var(--color-bg-app)',
                padding: '8px 28px 8px 8px',
                fontSize: '13px',
                color: 'var(--color-text-secondary)',
                fontFamily: 'inherit',
                cursor: 'pointer',
                flexShrink: 0,
                appearance: 'none',
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 6px center',
              }}
            >
              {PRICE_UNIT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          {touched.price_from && errors.price_from && (
            <Paragraph $size="small" style={{ color: 'var(--color-error)', marginTop: 4 }}>
              {errors.price_from}
            </Paragraph>
          )}
        </div>

        {/* Trainer-specific fields */}
        {showTrainerFields && (
          <>
            <div>
              <Paragraph $size="small" $weight={500} style={{ marginBottom: 12 }}>
                Trainer details
              </Paragraph>
            </div>

            <StyledFormRow>
              <div>
                <StyledLabel>
                  <Tooltip content="Selecteer alle regio's waarin de trainer actief is.">
                    Regio's
                  </Tooltip>
                </StyledLabel>
                <MultiSelect
                  options={REGION_OPTIONS}
                  value={values.regions}
                  onChange={(selected) => setFieldValue('regions', selected as DutchRegion[])}
                  placeholder="Selecteer regio's..."
                />
              </div>

              <Select
                label="Gender"
                options={GENDER_OPTIONS}
                value={values.gender}
                onChange={(e) =>
                  setFieldValue('gender', e.target.value as 'male' | 'female' | 'other' | '')
                }
                placeholder="Select gender..."
              />
            </StyledFormRow>

            <div>
              <StyledLabel>Specialisaties</StyledLabel>
              <StyledCheckboxGrid>
                {SPECIALIZATION_OPTIONS.map((option) => (
                  <StyledCheckboxLabel key={option.value}>
                    <input
                      type="checkbox"
                      checked={values.specializations.includes(
                        option.value as TrainerSpecialization
                      )}
                      onChange={() =>
                        toggleArrayItem('specializations', option.value as TrainerSpecialization)
                      }
                    />
                    {option.label}
                  </StyledCheckboxLabel>
                ))}
              </StyledCheckboxGrid>
            </div>
          </>
        )}

        {/* Links */}
        <div>
          <LinksSection
            links={values.links}
            onChange={(next) => {
              setFieldValue('links', next);
              setFieldTouched('links', true);
            }}
          />
          {linksError && (
            <Paragraph $size="small" style={{ color: 'var(--color-error)', marginTop: 4 }}>
              {linksError}
            </Paragraph>
          )}
        </div>

        {/* Tags */}
        <div>
          <StyledLabel>
            <Tooltip content="Tags helpen gebruikers de partner te vinden. Bijv. hardlopen, krachttraining, amsterdam.">
              Tags
            </Tooltip>
          </StyledLabel>
          <TagsInput value={values.tags} onChange={(next) => setFieldValue('tags', next)} />
        </div>

        {/* Admin-only flags */}
        <StyledFormRow>
          <Input
            label="Rating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            {...getFieldProps('rating')}
            placeholder="0 – 5"
            error={touched.rating && errors.rating ? errors.rating : undefined}
          />
          <StyledCheckboxWrapper>
            <input
              type="checkbox"
              checked={values.is_featured}
              onChange={(e) => setFieldValue('is_featured', e.target.checked)}
            />
            <span>Featured partner</span>
          </StyledCheckboxWrapper>
        </StyledFormRow>
      </StyledFormGrid>

      <FlexRow $gap="md" $justify="flex-end">
        <Button type="button" $variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Annuleren
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Opslaan...' : partner ? 'Bijwerken' : 'Aanmaken'}
        </Button>
      </FlexRow>
    </form>
  );
}

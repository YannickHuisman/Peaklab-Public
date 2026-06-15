import { useRef, useState } from 'react';

import { Button } from '@components/Button';
import { ImageUpload } from '@components/form/ImageUpload';
import { Input } from '@components/form/Input';
import { LinksSection } from '@components/form/LinksSection';
import { MultiSelect } from '@components/form/MultiSelect';
import { Select } from '@components/form/Select';
import { TagsInput } from '@components/form/TagsInput';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { Tooltip } from '@components/Tooltip';
import { REGION_OPTIONS, SPECIALIZATION_OPTIONS } from '@consts';
import { email, numeric, urlList, useForm } from '@hooks/useForm';

import type {
  ContactPreference,
  DutchRegion,
  PartnerLink,
  PartnerType,
  TrainerSpecialization,
} from '@package/api';

import { apiUrl } from '../../../helpers/api';
import {
  StyledCheckboxGrid,
  StyledCheckboxLabel,
  StyledFormGrid,
  StyledFormRow,
  StyledFormSection,
  StyledLabel,
  StyledOptionalBadge,
  StyledPriceDivider,
  StyledPriceError,
  StyledPriceInputGroup,
  StyledPriceLabelRow,
  StyledPriceLabelText,
  StyledPriceNumberInput,
  StyledPricePrefix,
  StyledPriceUnitSelect,
  StyledSectionTitle,
  StyledTextArea,
} from '../styles';

interface IntakeFormProps {
  onSuccess: () => void;
}

const PARTNER_TYPE_OPTIONS: { value: PartnerType; label: string }[] = [
  { value: 'trainer', label: 'Trainer / Coach' },
  { value: 'expert', label: 'Expert / Specialist' },
  { value: 'supplement', label: 'Supplementen' },
  { value: 'clothing', label: 'Sportkleding' },
  { value: 'other', label: 'Anders' },
];

const CONTACT_PREFERENCE_OPTIONS: { value: ContactPreference; label: string }[] = [
  { value: 'email', label: 'E-mail' },
  { value: 'phone', label: 'Telefoon' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'no_preference', label: 'Geen voorkeur' },
];

const PRICE_UNIT_OPTIONS = [
  { value: 'sessie', label: 'Per sessie' },
  { value: 'uur', label: 'Per uur' },
  { value: 'maand', label: 'Per maand' },
  { value: 'jaar', label: 'Per jaar' },
  { value: 'project', label: 'Per project' },
];

interface IntakeFormData {
  contact_name: string;
  contact_email: string;
  phone: string;
  phone_company: string;
  company_name: string;
  subtitle: string;
  type: PartnerType;
  description: string;
  contact_preference: ContactPreference;
  price_from: string;
  price_unit: string;
  image_url: string | null;
  regions: DutchRegion[];
  specializations: TrainerSpecialization[];
  links: PartnerLink[];
  tags: string[];
}

export function IntakeForm({ onSuccess }: IntakeFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
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
  } = useForm<IntakeFormData>({
    initialValues: {
      contact_name: '',
      contact_email: '',
      phone: '',
      phone_company: '',
      company_name: '',
      subtitle: '',
      type: 'trainer',
      description: '',
      contact_preference: 'no_preference',
      price_from: '',
      price_unit: 'sessie',
      image_url: null,
      regions: [],
      specializations: [],
      // Seed with one website row so users see where their primary URL goes
      links: [{ type: 'website', url: '' }],
      tags: [],
    },
    requiredFields: ['contact_name', 'contact_email', 'phone', 'company_name', 'type'],
    validationRules: {
      contact_email: email(),
      price_from: numeric({ min: 0, message: 'Vul een geldig bedrag in' }),
      links: urlList<IntakeFormData, PartnerLink>({ itemLabel: 'Link' }),
    },
    onSubmit: async (formData) => {
      setSubmitError(null);

      const cleanedLinks = formData.links.filter((l) => l.url);
      // Promote the first website link to website_url (backend also derives this as fallback)
      const websiteUrl = cleanedLinks.find((l) => l.type === 'website')?.url ?? null;

      const payload = {
        contact_name: formData.contact_name,
        contact_email: formData.contact_email,
        phone: formData.phone || null,
        phone_company: formData.phone_company || null,
        company_name: formData.company_name,
        subtitle: formData.subtitle || null,
        type: formData.type,
        description: formData.description || null,
        website_url: websiteUrl,
        image_url: formData.image_url || null,
        region: formData.regions[0] || null,
        regions: formData.regions.length > 0 ? formData.regions : null,
        specializations: formData.specializations,
        contact_preference: formData.contact_preference || null,
        price_from: formData.price_from ? Number(formData.price_from) : null,
        price_unit: formData.price_from ? formData.price_unit : null,
        links: cleanedLinks.length > 0 ? cleanedLinks : null,
        tags: formData.tags.length > 0 ? formData.tags : [],
      };

      const response = await fetch(apiUrl('/api/partner-applications'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(data?.error || 'Er is iets misgegaan. Probeer het opnieuw.');
      }

      onSuccess();
    },
  });

  const showTrainerFields = values.type === 'trainer';
  const linksError = touched.links && errors.links ? errors.links : undefined;

  return (
    <form
      onSubmit={(e) => {
        setSubmitError(null);
        handleSubmit(e).catch((err: Error) => {
          setSubmitError(err.message);
        });
      }}
    >
      <StyledCard $padding="2xl">
        <FlexColumn $gap="lg">
          {/* Contact info */}
          <StyledFormSection>
            <StyledSectionTitle>Contactgegevens</StyledSectionTitle>
            <StyledFormGrid>
              <StyledFormRow>
                <Input
                  label="Contactpersoon *"
                  {...getFieldProps('contact_name')}
                  placeholder="Voor- en achternaam"
                  error={
                    touched.contact_name && errors.contact_name ? errors.contact_name : undefined
                  }
                />
                <Input
                  label="E-mailadres *"
                  {...getFieldProps('contact_email')}
                  placeholder="naam@bedrijf.nl"
                  type="email"
                  error={
                    touched.contact_email && errors.contact_email ? errors.contact_email : undefined
                  }
                />
              </StyledFormRow>
              <StyledFormRow>
                <Input
                  label="Mobiel / WhatsApp *"
                  {...getFieldProps('phone')}
                  placeholder="+31 6 12345678"
                  type="tel"
                  error={touched.phone && errors.phone ? errors.phone : undefined}
                />
                <Input
                  label="Bedrijfstelefoon"
                  {...getFieldProps('phone_company')}
                  placeholder="+31 20 1234567"
                  type="tel"
                />
              </StyledFormRow>
              <StyledFormRow>
                <Select
                  label="Voorkeur contactmethode"
                  options={CONTACT_PREFERENCE_OPTIONS}
                  value={values.contact_preference}
                  onChange={(e) =>
                    setFieldValue('contact_preference', e.target.value as ContactPreference)
                  }
                />
              </StyledFormRow>
            </StyledFormGrid>
          </StyledFormSection>

          {/* Business info */}
          <StyledFormSection>
            <StyledSectionTitle>Bedrijfsgegevens</StyledSectionTitle>
            <StyledFormGrid>
              <StyledFormRow>
                <Input
                  label="Bedrijfs- of merknaam *"
                  {...getFieldProps('company_name')}
                  placeholder="Naam van je bedrijf of merk"
                  error={
                    touched.company_name && errors.company_name ? errors.company_name : undefined
                  }
                />
                <Select
                  label="Type partner *"
                  options={PARTNER_TYPE_OPTIONS}
                  value={values.type}
                  onChange={(e) => setFieldValue('type', e.target.value as PartnerType)}
                  error={touched.type && errors.type ? errors.type : undefined}
                />
              </StyledFormRow>

              <div>
                <StyledLabel>
                  <Tooltip content="Korte tagline die direct onder je naam wordt getoond. Bijvoorbeeld: 'Personal Trainer in Amsterdam' of 'Premium supplementen voor sporters'.">
                    Tagline
                  </Tooltip>
                </StyledLabel>
                <Input {...getFieldProps('subtitle')} placeholder="Personal Trainer in Amsterdam" />
              </div>

              <div>
                <StyledLabel>
                  <Tooltip content="Korte omschrijving van je diensten, producten of expertise. Dit helpt ons de samenwerking goed in te schatten.">
                    Omschrijving
                  </Tooltip>
                </StyledLabel>
                <StyledTextArea
                  {...getFieldProps('description')}
                  placeholder="Vertel kort over je bedrijf en diensten..."
                  rows={4}
                />
              </div>

              {/* Tags */}
              <div>
                <StyledLabel>
                  <Tooltip content="Tags helpen gebruikers je profiel te vinden. Denk aan: hardlopen, krachttraining, voeding, amsterdam, etc.">
                    Tags
                  </Tooltip>
                </StyledLabel>
                <TagsInput value={values.tags} onChange={(next) => setFieldValue('tags', next)} />
              </div>

              {/* Price */}
              <div>
                <StyledPriceLabelRow>
                  <StyledPriceLabelText>Startprijs</StyledPriceLabelText>
                  <StyledOptionalBadge>optioneel</StyledOptionalBadge>
                  <Tooltip content="Wat is de startprijs voor jouw diensten of producten? Dit wordt getoond op je partnerprofiel." />
                </StyledPriceLabelRow>

                <StyledPriceInputGroup
                  $focused={priceFocused}
                  onClick={() => priceInputRef.current?.focus()}
                >
                  <StyledPricePrefix>€</StyledPricePrefix>
                  <StyledPriceNumberInput
                    ref={priceInputRef}
                    {...getFieldProps('price_from')}
                    placeholder="49"
                    type="number"
                    min="0"
                    step="1"
                    onFocus={() => setPriceFocused(true)}
                    onBlur={() => {
                      setPriceFocused(false);
                      getFieldProps('price_from').onBlur?.();
                    }}
                  />
                  <StyledPriceDivider>/</StyledPriceDivider>
                  <StyledPriceUnitSelect
                    value={values.price_unit}
                    onChange={(e) => setFieldValue('price_unit', e.target.value)}
                    onFocus={() => setPriceFocused(true)}
                    onBlur={() => setPriceFocused(false)}
                  >
                    {PRICE_UNIT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </StyledPriceUnitSelect>
                </StyledPriceInputGroup>

                {touched.price_from && errors.price_from && (
                  <StyledPriceError>{errors.price_from}</StyledPriceError>
                )}
              </div>
            </StyledFormGrid>
          </StyledFormSection>

          {/* Profile image */}
          <StyledFormSection>
            <StyledSectionTitle>Profielfoto</StyledSectionTitle>
            <ImageUpload
              value={values.image_url}
              onChange={(url) => setFieldValue('image_url', url)}
            />
          </StyledFormSection>

          {/* Trainer-specific fields */}
          {showTrainerFields && (
            <StyledFormSection>
              <StyledSectionTitle>Trainer details</StyledSectionTitle>
              <StyledFormGrid>
                <div>
                  <StyledLabel>
                    <Tooltip content="Selecteer alle regio's waarin je actief bent of klanten begeleidt.">
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

                <div>
                  <StyledLabel>
                    <Tooltip content="Kies de specialisaties die het beste aansluiten bij jouw aanbod.">
                      Specialisaties
                    </Tooltip>
                  </StyledLabel>
                  <StyledCheckboxGrid>
                    {SPECIALIZATION_OPTIONS.map((option) => (
                      <StyledCheckboxLabel key={option.value}>
                        <input
                          type="checkbox"
                          checked={values.specializations.includes(
                            option.value as TrainerSpecialization
                          )}
                          onChange={() =>
                            toggleArrayItem(
                              'specializations',
                              option.value as TrainerSpecialization
                            )
                          }
                        />
                        {option.label}
                      </StyledCheckboxLabel>
                    ))}
                  </StyledCheckboxGrid>
                </div>
              </StyledFormGrid>
            </StyledFormSection>
          )}

          {/* Links */}
          <StyledFormSection>
            <LinksSection
              links={values.links}
              onChange={(next) => {
                setFieldValue('links', next);
                setFieldTouched('links', true);
              }}
            />
            {linksError && (
              <Paragraph
                $size="small"
                style={{ color: 'var(--color-error, #e53e3e)', marginTop: 4 }}
              >
                {linksError}
              </Paragraph>
            )}
          </StyledFormSection>

          {submitError && (
            <Paragraph $size="small" style={{ color: 'var(--color-error, #e53e3e)' }}>
              {submitError}
            </Paragraph>
          )}

          <FlexRow $justify="flex-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Versturen...' : 'Aanvraag versturen'}
            </Button>
          </FlexRow>
        </FlexColumn>
      </StyledCard>
    </form>
  );
}

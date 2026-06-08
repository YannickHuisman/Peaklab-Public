import { useState } from 'react';

import { Button } from '@components/Button';
import { Input } from '@components/form/Input';
import { Select } from '@components/form/Select';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { REGION_OPTIONS, SPECIALIZATION_OPTIONS } from '@consts';
import { useForm } from '@hooks/useForm';

import type { DutchRegion, PartnerType, TrainerSpecialization } from '@package/types';

import { apiUrl } from '../../../helpers/api';
import {
  StyledCheckboxGrid,
  StyledCheckboxLabel,
  StyledFormGrid,
  StyledFormRow,
  StyledFormSection,
  StyledLabel,
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

interface IntakeFormData {
  contact_name: string;
  contact_email: string;
  phone: string;
  company_name: string;
  type: PartnerType;
  website_url: string;
  description: string;
  region: DutchRegion | '';
  motivation: string;
  [key: string]: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function IntakeForm({ onSuccess }: IntakeFormProps) {
  const [specializations, setSpecializations] = useState<TrainerSpecialization[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { values, errors, touched, isSubmitting, getFieldProps, handleSubmit, setFieldValue } =
    useForm<IntakeFormData>({
      initialValues: {
        contact_name: '',
        contact_email: '',
        phone: '',
        company_name: '',
        type: 'trainer',
        website_url: '',
        description: '',
        region: '',
        motivation: '',
      },
      requiredFields: ['contact_name', 'contact_email', 'company_name', 'type'],
      validationRules: {
        contact_email: (value) => {
          if (value && !EMAIL_REGEX.test(String(value))) {
            return 'Vul een geldig e-mailadres in';
          }

          return null;
        },
      },
      onSubmit: async (formData) => {
        setSubmitError(null);

        const payload = {
          contact_name: formData.contact_name,
          contact_email: formData.contact_email,
          phone: formData.phone || null,
          company_name: formData.company_name,
          type: formData.type,
          description: formData.description || null,
          website_url: formData.website_url || null,
          region: formData.region || null,
          specializations: specializations.length > 0 ? specializations : [],
          motivation: formData.motivation || null,
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

  const toggleSpecialization = (spec: TrainerSpecialization) => {
    if (specializations.includes(spec)) {
      setSpecializations(specializations.filter((s) => s !== spec));
    } else {
      setSpecializations([...specializations, spec]);
    }
  };

  const showTrainerFields = values.type === 'trainer';

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
                  label="Naam *"
                  {...getFieldProps('contact_name')}
                  placeholder="Je volledige naam"
                />
                <Input
                  label="E-mailadres *"
                  {...getFieldProps('contact_email')}
                  placeholder="naam@bedrijf.nl"
                  type="email"
                />
              </StyledFormRow>
              <div style={{ maxWidth: '50%' }}>
                <Input
                  label="Telefoonnummer"
                  {...getFieldProps('phone')}
                  placeholder="+31 6 12345678"
                  type="tel"
                />
              </div>
            </StyledFormGrid>
          </StyledFormSection>

          {/* Business info */}
          <StyledFormSection>
            <StyledSectionTitle>Bedrijfsgegevens</StyledSectionTitle>
            <StyledFormGrid>
              <StyledFormRow>
                <Input
                  label="Bedrijfsnaam *"
                  {...getFieldProps('company_name')}
                  placeholder="Naam van je bedrijf"
                />
                <Select
                  label="Type partner *"
                  options={PARTNER_TYPE_OPTIONS}
                  value={values.type}
                  onChange={(e) => setFieldValue('type', e.target.value as PartnerType)}
                  placeholder="Selecteer type..."
                  error={touched.type && errors.type ? errors.type : undefined}
                />
              </StyledFormRow>

              <Input
                label="Website"
                {...getFieldProps('website_url')}
                placeholder="https://www.jouwwebsite.nl"
                type="url"
              />

              <div>
                <StyledLabel>Omschrijving</StyledLabel>
                <StyledTextArea
                  {...getFieldProps('description')}
                  placeholder="Vertel kort over je bedrijf en diensten..."
                  rows={4}
                />
              </div>
            </StyledFormGrid>
          </StyledFormSection>

          {/* Trainer-specific fields */}
          {showTrainerFields && (
            <StyledFormSection>
              <StyledSectionTitle>Trainer details</StyledSectionTitle>
              <StyledFormGrid>
                <Select
                  label="Regio"
                  options={REGION_OPTIONS}
                  value={values.region}
                  onChange={(e) => setFieldValue('region', e.target.value as DutchRegion | '')}
                  placeholder="Selecteer regio..."
                />

                <div>
                  <StyledLabel>Specialisaties</StyledLabel>
                  <StyledCheckboxGrid>
                    {SPECIALIZATION_OPTIONS.map((option) => (
                      <StyledCheckboxLabel key={option.value}>
                        <input
                          type="checkbox"
                          checked={specializations.includes(option.value as TrainerSpecialization)}
                          onChange={() =>
                            toggleSpecialization(option.value as TrainerSpecialization)
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

          {/* Motivation */}
          <StyledFormSection>
            <StyledSectionTitle>Motivatie</StyledSectionTitle>
            <StyledFormGrid>
              <div>
                <StyledLabel>Waarom wil je partner worden van Peaklab?</StyledLabel>
                <StyledTextArea
                  {...getFieldProps('motivation')}
                  placeholder="Vertel ons waarom je graag partner wilt worden en wat je kunt bijdragen..."
                  rows={4}
                />
              </div>
            </StyledFormGrid>
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

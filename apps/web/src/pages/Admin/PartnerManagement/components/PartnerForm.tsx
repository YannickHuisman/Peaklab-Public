import { useState } from 'react';

import { Button } from '@components/Button';
import { Input } from '@components/form/Input';
import { Select } from '@components/form/Select';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { FlexRow } from '@components/styled/layout';
import { GENDER_OPTIONS, REGION_OPTIONS, SPECIALIZATION_OPTIONS } from '@consts';
import { useForm } from '@hooks/useForm';

import type { DutchRegion, Partner, PartnerType, TrainerSpecialization } from '@package/api';

import { authenticatedFetch } from '../../../../helpers/authenticatedFetch';
import {
  StyledCheckboxGrid,
  StyledCheckboxLabel,
  StyledCheckboxWrapper,
  StyledFormGrid,
  StyledFormRow,
  StyledLabel,
  StyledTag,
  StyledTagInput,
  StyledTagsInput,
  StyledTextArea,
} from './styles';

interface PartnerFormProps {
  partner: Partner | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const PARTNER_TYPE_OPTIONS: { value: PartnerType; label: string }[] = [
  { value: 'trainer', label: 'Trainer' },
  { value: 'expert', label: 'Expert' },
  { value: 'supplement', label: 'Supplement' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'other', label: 'Other' },
];

interface PartnerFormData {
  name: string;
  type: PartnerType;
  subtitle: string;
  description: string;
  image_url: string;
  affiliate_url: string;
  rating: string;
  price_from: string;
  price_unit: string;
  region: DutchRegion | '';
  gender: 'male' | 'female' | 'other' | '';
  is_featured: boolean;
  [key: string]: string | boolean;
}

export function PartnerForm({ partner, onSuccess, onCancel }: PartnerFormProps) {
  const [tags, setTags] = useState<string[]>(partner?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [specializations, setSpecializations] = useState<TrainerSpecialization[]>(
    partner?.specializations || []
  );

  const { values, errors, touched, isSubmitting, getFieldProps, handleSubmit, setFieldValue } =
    useForm<PartnerFormData>({
      initialValues: {
        name: partner?.name || '',
        type: partner?.type || 'trainer',
        subtitle: partner?.subtitle || '',
        description: partner?.description || '',
        image_url: partner?.image_url || '',
        affiliate_url: partner?.affiliate_url || '',
        rating: partner?.rating?.toString() || '',
        price_from: partner?.price_from?.toString() || '',
        price_unit: partner?.price_unit || 'maand',
        region: partner?.region || '',
        gender: partner?.gender || '',
        is_featured: partner?.is_featured ?? false,
      },
      requiredFields: ['name', 'type'],
      validationRules: {
        rating: (value) => {
          if (value && (Number(value) < 0 || Number(value) > 5)) {
            return 'Rating must be between 0 and 5';
          }

          return null;
        },
        price_from: (value) => {
          if (value && Number(value) < 0) {
            return 'Price cannot be negative';
          }

          return null;
        },
      },
      onSubmit: async (formData) => {
        const payload = {
          name: formData.name,
          type: formData.type,
          subtitle: formData.subtitle || null,
          description: formData.description || null,
          image_url: formData.image_url || null,
          affiliate_url: formData.affiliate_url || null,
          rating: formData.rating ? Number(formData.rating) : null,
          price_from: formData.price_from ? Number(formData.price_from) : null,
          price_unit: formData.price_unit || 'maand',
          region: formData.region || null,
          gender: formData.gender || null,
          specializations: specializations.length > 0 ? specializations : null,
          tags,
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

  const handleAddTag = () => {
    const trimmed = tagInput.trim();

    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const toggleSpecialization = (spec: TrainerSpecialization) => {
    if (specializations.includes(spec)) {
      setSpecializations(specializations.filter((s) => s !== spec));
    } else {
      setSpecializations([...specializations, spec]);
    }
  };

  const showTrainerFields = values.type === 'trainer';

  return (
    <form onSubmit={handleSubmit}>
      <StyledFormGrid>
        <StyledFormRow>
          <div>
            <Input label="Name *" {...getFieldProps('name')} placeholder="Partner name" required />
          </div>

          <Select
            label="Type *"
            options={PARTNER_TYPE_OPTIONS}
            value={values.type}
            onChange={(e) => setFieldValue('type', e.target.value as PartnerType)}
            placeholder="Select type..."
            error={touched.type && errors.type ? errors.type : undefined}
          />
        </StyledFormRow>

        <div>
          <Input
            label="Subtitle"
            {...getFieldProps('subtitle')}
            placeholder="e.g., Personal Trainer Amsterdam"
          />
        </div>

        <div>
          <StyledLabel>Description</StyledLabel>
          <StyledTextArea
            {...getFieldProps('description')}
            placeholder="Describe the partner..."
            rows={3}
          />
        </div>

        <StyledFormRow>
          <div>
            <Input
              label="Image URL"
              {...getFieldProps('image_url')}
              placeholder="https://..."
              type="url"
            />
          </div>

          <div>
            <Input
              label="Affiliate URL"
              {...getFieldProps('affiliate_url')}
              placeholder="https://..."
              type="url"
            />
          </div>
        </StyledFormRow>

        <StyledFormRow>
          <div>
            <Input
              label="Rating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              {...getFieldProps('rating')}
              placeholder="0-5"
            />
          </div>

          <StyledFormRow>
            <div>
              <Input
                label="Price From"
                type="number"
                step="1"
                min="0"
                {...getFieldProps('price_from')}
                placeholder="e.g., 50"
              />
            </div>
            <div>
              <Input
                label="Price Unit"
                {...getFieldProps('price_unit')}
                placeholder="e.g., maand, sessie"
              />
            </div>
          </StyledFormRow>
        </StyledFormRow>

        {showTrainerFields && (
          <>
            <div style={{ marginTop: '8px' }}>
              <Paragraph $size="small" $weight={500}>
                Trainer-specific fields
              </Paragraph>
            </div>

            <StyledFormRow>
              <Select
                label="Region"
                options={REGION_OPTIONS}
                value={values.region}
                onChange={(e) => setFieldValue('region', e.target.value as DutchRegion | '')}
                placeholder="Select region..."
              />

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
              <StyledLabel>Specializations</StyledLabel>
              <StyledCheckboxGrid>
                {SPECIALIZATION_OPTIONS.map((option) => (
                  <StyledCheckboxLabel key={option.value}>
                    <input
                      type="checkbox"
                      checked={specializations.includes(option.value as TrainerSpecialization)}
                      onChange={() => toggleSpecialization(option.value as TrainerSpecialization)}
                    />
                    {option.label}
                  </StyledCheckboxLabel>
                ))}
              </StyledCheckboxGrid>
            </div>
          </>
        )}

        <div>
          <StyledLabel>Tags</StyledLabel>
          <StyledTagsInput>
            {tags.map((tag) => (
              <StyledTag key={tag}>
                {tag}
                <button type="button" onClick={() => handleRemoveTag(tag)}>
                  <Icons.X size="xs" />
                </button>
              </StyledTag>
            ))}
            <StyledTagInput
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              onBlur={handleAddTag}
              placeholder={tags.length === 0 ? 'Add tags...' : ''}
            />
          </StyledTagsInput>
          <div style={{ marginTop: '4px' }}>
            <Paragraph $size="xsmall" $variant="tertiary">
              Press Enter to add a tag
            </Paragraph>
          </div>
        </div>

        <StyledCheckboxWrapper>
          <input
            type="checkbox"
            checked={values.is_featured}
            onChange={(e) => setFieldValue('is_featured', e.target.checked)}
          />
          <span>Featured Partner</span>
        </StyledCheckboxWrapper>
      </StyledFormGrid>

      <FlexRow $gap="md" $justify="flex-end">
        <Button type="button" $variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : partner ? 'Update' : 'Create'}
        </Button>
      </FlexRow>
    </form>
  );
}

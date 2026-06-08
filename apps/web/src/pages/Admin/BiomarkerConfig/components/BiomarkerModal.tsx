import { useState } from 'react';

import { Button } from '@components/Button';
import { Input } from '@components/form/Input';
import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { FlexRow } from '@components/styled/layout';

import type { BiomarkerCategory, BiomarkerWithConfig } from '@package/api';
import { theme } from '@package/ui';

import { authenticatedFetch } from '../../../../helpers/authenticatedFetch';
import {
  StyledCheckboxWrapper,
  StyledFormGrid,
  StyledFormRow,
  StyledLabel,
  StyledModalBody,
  StyledModalContent,
  StyledModalHeader,
  StyledModalOverlay,
  StyledSelect,
} from './styles';

interface BiomarkerModalProps {
  biomarker: BiomarkerWithConfig | null;
  categories: BiomarkerCategory[];
  onClose: () => void;
  onSave: () => void;
}

export function BiomarkerModal({ biomarker, categories, onClose, onSave }: BiomarkerModalProps) {
  const [formData, setFormData] = useState({
    name: biomarker?.name || '',
    display_name: biomarker?.display_name || '',
    category_id: biomarker?.category.id || (categories[0]?.id ?? ''),
    unit: biomarker?.unit || '',
    ref_male_min: biomarker?.ref_male_min?.toString() || '',
    ref_male_max: biomarker?.ref_male_max?.toString() || '',
    ref_female_min: biomarker?.ref_female_min?.toString() || '',
    ref_female_max: biomarker?.ref_female_max?.toString() || '',
    performance_male_min: biomarker?.performance_male_min?.toString() || '',
    performance_male_max: biomarker?.performance_male_max?.toString() || '',
    performance_female_min: biomarker?.performance_female_min?.toString() || '',
    performance_female_max: biomarker?.performance_female_max?.toString() || '',
    is_active: biomarker?.is_active ?? true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        display_name: formData.display_name,
        category_id: Number(formData.category_id),
        unit: formData.unit || null,
        ref_male_min: formData.ref_male_min ? Number(formData.ref_male_min) : null,
        ref_male_max: formData.ref_male_max ? Number(formData.ref_male_max) : null,
        ref_female_min: formData.ref_female_min ? Number(formData.ref_female_min) : null,
        ref_female_max: formData.ref_female_max ? Number(formData.ref_female_max) : null,
        performance_male_min: formData.performance_male_min
          ? Number(formData.performance_male_min)
          : null,
        performance_male_max: formData.performance_male_max
          ? Number(formData.performance_male_max)
          : null,
        performance_female_min: formData.performance_female_min
          ? Number(formData.performance_female_min)
          : null,
        performance_female_max: formData.performance_female_max
          ? Number(formData.performance_female_max)
          : null,
        is_active: formData.is_active,
      };

      if (biomarker) {
        // Update existing biomarker
        await authenticatedFetch(`/api/biomarkers/admin/${biomarker.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // Create new biomarker
        await authenticatedFetch('/api/biomarkers/admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      onSave();
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to save biomarker');
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <StyledModalOverlay onClick={handleOverlayClick}>
      <StyledModalContent>
        <StyledModalHeader>
          <Heading $size="large">{biomarker ? 'Edit Biomarker' : 'Create New Biomarker'}</Heading>
          <Button $variant="ghost" $size="small" onClick={onClose}>
            <Icons.X />
          </Button>
        </StyledModalHeader>

        <StyledModalBody>
          <form onSubmit={handleSubmit}>
            <StyledFormGrid>
              <div>
                <Input
                  label="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Hemoglobin"
                  required
                />
              </div>

              <div>
                <Input
                  label="Display Name"
                  value={formData.display_name}
                  onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  placeholder="e.g., Hemoglobine"
                  required
                />
              </div>

              <div>
                <StyledLabel>Category *</StyledLabel>
                <StyledSelect
                  value={formData.category_id}
                  onChange={(e) =>
                    setFormData({ ...formData, category_id: Number(e.target.value) })
                  }
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </StyledSelect>
              </div>

              <div>
                <Input
                  label="Unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="e.g., mmol/L, µg/L, %, etc."
                />
              </div>

              <div style={{ marginTop: '8px' }}>
                <Paragraph $size="small" $variant="secondary">
                  Reference Range Male
                </Paragraph>
              </div>

              <StyledFormRow>
                <Input
                  label="Min"
                  type="number"
                  step="any"
                  value={formData.ref_male_min}
                  onChange={(e) => setFormData({ ...formData, ref_male_min: e.target.value })}
                  placeholder="e.g., 8.5"
                />
                <Input
                  label="Max"
                  type="number"
                  step="any"
                  value={formData.ref_male_max}
                  onChange={(e) => setFormData({ ...formData, ref_male_max: e.target.value })}
                  placeholder="e.g., 10.5"
                />
              </StyledFormRow>

              <div style={{ marginTop: '8px' }}>
                <Paragraph $size="small" $variant="secondary">
                  Reference Range Female
                </Paragraph>
              </div>

              <StyledFormRow>
                <Input
                  label="Min"
                  type="number"
                  step="any"
                  value={formData.ref_female_min}
                  onChange={(e) => setFormData({ ...formData, ref_female_min: e.target.value })}
                  placeholder="e.g., 8.5"
                />
                <Input
                  label="Max"
                  type="number"
                  step="any"
                  value={formData.ref_female_max}
                  onChange={(e) => setFormData({ ...formData, ref_female_max: e.target.value })}
                  placeholder="e.g., 10.5"
                />
              </StyledFormRow>

              <div style={{ marginTop: '8px' }}>
                <Paragraph $size="small" $variant="secondary">
                  Performance Range Male (Optional)
                </Paragraph>
              </div>

              <StyledFormRow>
                <Input
                  label="Min"
                  type="number"
                  step="any"
                  value={formData.performance_male_min}
                  onChange={(e) =>
                    setFormData({ ...formData, performance_male_min: e.target.value })
                  }
                  placeholder="e.g., 9"
                />
                <Input
                  label="Max"
                  type="number"
                  step="any"
                  value={formData.performance_male_max}
                  onChange={(e) =>
                    setFormData({ ...formData, performance_male_max: e.target.value })
                  }
                  placeholder="e.g., 10"
                />
              </StyledFormRow>

              <div style={{ marginTop: '8px' }}>
                <Paragraph $size="small" $variant="secondary">
                  Performance Range Female (Optional)
                </Paragraph>
              </div>

              <StyledFormRow>
                <Input
                  label="Min"
                  type="number"
                  step="any"
                  value={formData.performance_female_min}
                  onChange={(e) =>
                    setFormData({ ...formData, performance_female_min: e.target.value })
                  }
                  placeholder="e.g., 9"
                />
                <Input
                  label="Max"
                  type="number"
                  step="any"
                  value={formData.performance_female_max}
                  onChange={(e) =>
                    setFormData({ ...formData, performance_female_max: e.target.value })
                  }
                  placeholder="e.g., 10"
                />
              </StyledFormRow>

              <StyledCheckboxWrapper>
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                />
                <span>Active</span>
              </StyledCheckboxWrapper>
            </StyledFormGrid>

            {error && (
              <div style={{ marginBottom: '16px' }}>
                <Paragraph $variant="secondary">
                  <span style={{ color: theme.colors.error.strong }}>{error}</span>
                </Paragraph>
              </div>
            )}

            <FlexRow $gap="md" $justify="flex-end">
              <Button type="button" $variant="ghost" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : biomarker ? 'Update' : 'Create'}
              </Button>
            </FlexRow>
          </form>
        </StyledModalBody>
      </StyledModalContent>
    </StyledModalOverlay>
  );
}

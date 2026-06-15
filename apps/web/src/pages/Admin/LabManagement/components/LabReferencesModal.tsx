import { useCallback, useEffect, useState } from 'react';

import { Button } from '@components/Button';
import { Input } from '@components/form/Input';
import { Select } from '@components/form/Select';
import { Icons } from '@components/Icons';
import { Modal } from '@components/Modal';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { authenticatedFetch } from '@helpers/authenticatedFetch';
import { useTranslation } from '@helpers/i18n';
import { useForm } from '@hooks/useForm';

import { useAppData } from '@package/api';
import type { LabBiomarkerReferenceWithBiomarker } from '@package/types';

interface LabReferencesModalProps {
  labId: number;
  labName: string;
  onClose: () => void;
}

interface ReferenceFormData {
  biomarker_id: string;
  unit: string;
  lab_ref_min: string;
  lab_ref_max: string;
  ref_male_min: string;
  ref_male_max: string;
  ref_female_min: string;
  ref_female_max: string;
  performance_male_min: string;
  performance_male_max: string;
  performance_female_min: string;
  performance_female_max: string;
}

const INITIAL_VALUES: ReferenceFormData = {
  biomarker_id: '',
  unit: '',
  lab_ref_min: '',
  lab_ref_max: '',
  ref_male_min: '',
  ref_male_max: '',
  ref_female_min: '',
  ref_female_max: '',
  performance_male_min: '',
  performance_male_max: '',
  performance_female_min: '',
  performance_female_max: '',
};

export function LabReferencesModal({ labId, labName, onClose }: LabReferencesModalProps) {
  const { t } = useTranslation();

  const { biomarkers } = useAppData();
  const [references, setReferences] = useState<LabBiomarkerReferenceWithBiomarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchReferences = useCallback(async () => {
    try {
      const response = await authenticatedFetch(`/api/labs/${labId}`);

      if (response.ok) {
        const data = await response.json();

        setReferences(data.references || []);
      }
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  }, [labId]);

  useEffect(() => {
    fetchReferences();
  }, [fetchReferences]);

  const { getFieldProps, handleSubmit, isSubmitting, reset, setFieldValue, values } =
    useForm<ReferenceFormData>({
      initialValues: INITIAL_VALUES,
      requiredFields: ['biomarker_id', 'unit'],
      validationRules: {
        lab_ref_min: (value, formData) => {
          const data = formData as ReferenceFormData;

          if (value && data?.lab_ref_max && Number(value) >= Number(data.lab_ref_max)) {
            return t('Min moet kleiner zijn dan max');
          }

          return null;
        },
        lab_ref_max: (value, formData) => {
          const data = formData as ReferenceFormData;

          if (value && data?.lab_ref_min && Number(value) <= Number(data.lab_ref_min)) {
            return t('Max moet groter zijn dan min');
          }

          return null;
        },
      },
      onSubmit: async (formValues) => {
        const response = await authenticatedFetch(`/api/labs/admin/${labId}/references`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            references: [
              {
                biomarker_id: parseInt(formValues.biomarker_id, 10),
                unit: formValues.unit,
                lab_ref_min: formValues.lab_ref_min ? parseFloat(formValues.lab_ref_min) : null,
                lab_ref_max: formValues.lab_ref_max ? parseFloat(formValues.lab_ref_max) : null,
                ref_male_min: formValues.ref_male_min ? parseFloat(formValues.ref_male_min) : null,
                ref_male_max: formValues.ref_male_max ? parseFloat(formValues.ref_male_max) : null,
                ref_female_min: formValues.ref_female_min
                  ? parseFloat(formValues.ref_female_min)
                  : null,
                ref_female_max: formValues.ref_female_max
                  ? parseFloat(formValues.ref_female_max)
                  : null,
                performance_male_min: formValues.performance_male_min
                  ? parseFloat(formValues.performance_male_min)
                  : null,
                performance_male_max: formValues.performance_male_max
                  ? parseFloat(formValues.performance_male_max)
                  : null,
                performance_female_min: formValues.performance_female_min
                  ? parseFloat(formValues.performance_female_min)
                  : null,
                performance_female_max: formValues.performance_female_max
                  ? parseFloat(formValues.performance_female_max)
                  : null,
              },
            ],
          }),
        });

        if (!response.ok) {
          throw new Error(t('Opslaan mislukt'));
        }

        setShowAddForm(false);
        reset();
        await fetchReferences();
      },
    });

  const handleDeleteReference = async (referenceId: number) => {
    try {
      const response = await authenticatedFetch(`/api/labs/admin/references/${referenceId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchReferences();
      }
    } catch {
      console.error(t('Verwijderen mislukt'));
    }
  };

  const biomarkerOptions = biomarkers
    .filter((b) => !references.some((r) => r.biomarker_id === b.id))
    .map((b) => ({ value: String(b.id), label: b.display_name || b.name }));

  return (
    <Modal isOpen onClose={onClose} title={`Referentiewaarden: ${labName}`} maxWidth="800px">
      <FlexColumn $gap="lg">
        <FlexRow $justify="flex-end">
          <Button
            $size="small"
            label={t('Referentie toevoegen')}
            onClick={() => setShowAddForm(!showAddForm)}
          />
        </FlexRow>

        {showAddForm && (
          <StyledCard $padding="lg" $showBorder>
            <form onSubmit={handleSubmit}>
              <FlexColumn $gap="md">
                <Select
                  label={t('Biomarker *')}
                  options={biomarkerOptions}
                  value={values.biomarker_id}
                  onChange={(e) => setFieldValue('biomarker_id', e.target.value)}
                  placeholder={t('Selecteer biomarker')}
                />
                <Input
                  label={t('Eenheid *')}
                  {...getFieldProps('unit')}
                  placeholder={t('bv. mmol/L, g/dL')}
                />
                <FlexRow $gap="md">
                  <Input label="Lab ref. min" {...getFieldProps('lab_ref_min')} placeholder="Min" />
                  <Input label="Lab ref. max" {...getFieldProps('lab_ref_max')} placeholder="Max" />
                </FlexRow>
                <FlexRow $gap="md">
                  <Input
                    label="Ref male min"
                    {...getFieldProps('ref_male_min')}
                    placeholder="Min"
                  />
                  <Input
                    label="Ref male max"
                    {...getFieldProps('ref_male_max')}
                    placeholder="Max"
                  />
                </FlexRow>
                <FlexRow $gap="md">
                  <Input
                    label="Ref female min"
                    {...getFieldProps('ref_female_min')}
                    placeholder="Min"
                  />
                  <Input
                    label="Ref female max"
                    {...getFieldProps('ref_female_max')}
                    placeholder="Max"
                  />
                </FlexRow>
                <FlexRow $gap="md">
                  <Input
                    label="Perf male min"
                    {...getFieldProps('performance_male_min')}
                    placeholder="Min"
                  />
                  <Input
                    label="Perf male max"
                    {...getFieldProps('performance_male_max')}
                    placeholder="Max"
                  />
                </FlexRow>
                <FlexRow $gap="md">
                  <Input
                    label="Perf female min"
                    {...getFieldProps('performance_female_min')}
                    placeholder="Min"
                  />
                  <Input
                    label="Perf female max"
                    {...getFieldProps('performance_female_max')}
                    placeholder="Max"
                  />
                </FlexRow>
                <FlexRow $gap="sm" $justify="flex-end">
                  <Button
                    $variant="secondary"
                    $size="small"
                    label={t('Annuleren')}
                    onClick={() => {
                      setShowAddForm(false);
                      reset();
                    }}
                  />
                  <Button
                    type="submit"
                    $size="small"
                    label={isSubmitting ? t('Opslaan...') : t('Opslaan')}
                    disabled={isSubmitting}
                  />
                </FlexRow>
              </FlexColumn>
            </form>
          </StyledCard>
        )}

        {loading && <Paragraph $variant="secondary">{t('Laden...')}</Paragraph>}

        {!loading && references.length === 0 && (
          <Paragraph $variant="secondary" $align="center">
            {t('Geen referentiewaarden geconfigureerd voor dit lab.')}
          </Paragraph>
        )}

        {references.map((ref) => (
          <StyledCard key={ref.id} $padding="md" $showBorder>
            <FlexRow $justify="space-between" $align="center">
              <FlexColumn $gap="xs">
                <Paragraph $weight={600} $size="small">
                  {ref.biomarker?.display_name ||
                    ref.biomarker?.name ||
                    `Biomarker #${ref.biomarker_id}`}
                </Paragraph>
                <Paragraph $size="xsmall" $variant="secondary">
                  {ref.unit} | Ref M: {ref.ref_male_min ?? '-'} - {ref.ref_male_max ?? '-'} | Ref F:{' '}
                  {ref.ref_female_min ?? '-'} - {ref.ref_female_max ?? '-'}
                </Paragraph>
              </FlexColumn>
              <Button
                $variant="ghost"
                $size="small"
                onClick={() => handleDeleteReference(ref.id)}
                aria-label="Referentiewaarde verwijderen"
              >
                <Icons.Trash size="sm" aria-hidden="true" />
              </Button>
            </FlexRow>
          </StyledCard>
        ))}
      </FlexColumn>
    </Modal>
  );
}

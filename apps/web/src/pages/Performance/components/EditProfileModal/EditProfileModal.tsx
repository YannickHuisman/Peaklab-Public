import { useCallback, useState } from 'react';

import { Button } from '@components/Button/Button';
import { Divider } from '@components/Divider';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { useTranslation } from '@helpers/i18n';

import type { PerformanceFormData } from '../../types';
import type { SnapshotCardType } from '../PerformanceSnapshot/PerformanceSnapshot';
import { Step1Profile } from '../Step1Profile';
import { Step2Goals } from '../Step2Goals';
import { Step3Limitations } from '../Step3Limitations';
import { Step4Recovery } from '../Step4Recovery';
import { Step5Nutrition } from '../Step5Nutrition';
import { Step7Training } from '../Step7Training';
import { Step8Level } from '../Step8Level';

// Map card types to their corresponding step components and titles
const CARD_CONFIG: Record<
  SnapshotCardType,
  {
    title: string;
    subtitle?: string;
    Component: React.ComponentType<{
      formData: PerformanceFormData;
      onChange: <K extends keyof PerformanceFormData>(
        field: K,
        value: PerformanceFormData[K]
      ) => void;
    }>;
  }
> = {
  profile: {
    title: 'performance.edit.profile' as const,
    Component: Step1Profile,
  },
  goals: {
    title: 'performance.edit.goals' as const,
    Component: Step2Goals,
  },
  training: {
    title: 'performance.edit.training' as const,
    Component: Step7Training,
  },
  recovery: {
    title: 'performance.edit.recovery' as const,
    Component: Step4Recovery,
  },
  limitations: {
    title: 'performance.edit.limitations' as const,
    Component: Step3Limitations,
  },
  nutrition: {
    title: 'performance.edit.nutrition' as const,
    Component: Step5Nutrition,
  },
};

interface EditProfileModalProps {
  cardType: SnapshotCardType;
  initialFormData: PerformanceFormData;
  onSave: (updatedFormData: PerformanceFormData) => void;
  onCancel: () => void;
}

export function EditProfileModal({
  cardType,
  initialFormData,
  onSave,
  onCancel,
}: EditProfileModalProps) {
  // Local form state - isolated from the parent
  const [localFormData, setLocalFormData] = useState<PerformanceFormData>(initialFormData);

  const handleFieldChange = useCallback(
    <K extends keyof PerformanceFormData>(field: K, value: PerformanceFormData[K]) => {
      setLocalFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  const handleSave = useCallback(() => {
    onSave(localFormData);
  }, [onSave, localFormData]);

  const { t } = useTranslation();
  const config = CARD_CONFIG[cardType];
  const { Component } = config;

  return (
    <FlexColumn $gap="lg">
      <Component formData={localFormData} onChange={handleFieldChange} />
      {cardType === 'goals' && (
        <>
          <Divider />
          <Step8Level formData={localFormData} onChange={handleFieldChange} />
        </>
      )}

      <FlexRow $gap="sm" $justify="flex-end">
        <Button $variant="ghost" onClick={onCancel}>
          {t('Annuleren')}
        </Button>
        <Button $variant="primary" onClick={handleSave}>
          {t('Opslaan')}
        </Button>
      </FlexRow>
    </FlexColumn>
  );
}

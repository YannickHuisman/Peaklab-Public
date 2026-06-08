import { useCallback } from 'react';

import { Loader } from '@components/Loader';
import { StyledCard } from '@components/styled/StyledCard';
import { useModal } from '@context/ModalProvider';
import { useForm } from '@hooks/useForm';

import { useData } from '@package/api';
import { deepEqual } from '@package/utils';

import {
  EditProfileModal,
  PerformanceResultsView,
  PerformanceStepperView,
  TipSelectionView,
} from './components';
import type { SnapshotCardType } from './components/PerformanceSnapshot/PerformanceSnapshot';
import { STEP_VALIDATION, TOTAL_STEPS } from './consts';
import { useChatUserContext, usePerformanceProfileInit, usePerformanceTips } from './hooks';
import { INITIAL_FORM_DATA, type PerformanceFormData } from './types';

export function Performance() {
  const { openModal, closeModal } = useModal();
  const { biomarkers, savePerformanceProfile } = useData();

  const {
    values: formData,
    setFieldValue,
    setValues,
    currentStep,
    isFirstStep,
    isLastStep,
    canProceed,
    nextStep,
    previousStep,
    goToStep,
  } = useForm<PerformanceFormData>({
    initialValues: INITIAL_FORM_DATA,
    stepValidation: STEP_VALIDATION,
    totalSteps: TOTAL_STEPS,
    onSubmit: async () => {},
  });

  const tips = usePerformanceTips({ formData });

  const { hasInitialized, profileLoading } = usePerformanceProfileInit({
    setValues,
    setTipsData: tips.setTipsData,
    setPlanFormData: tips.setPlanFormData,
    setSelectedTipIds: tips.setSelectedTipIds,
    setShowResults: tips.setShowResults,
  });

  const hasFormDataChanged = tips.planFormData ? !deepEqual(formData, tips.planFormData) : false;

  const chatUserContext = useChatUserContext({
    formData,
    tipsData: tips.tipsData,
    selectedTipIds: tips.selectedTipIds,
  });

  const handleFieldChange = useCallback(
    <K extends keyof PerformanceFormData>(field: K, value: PerformanceFormData[K]) => {
      setFieldValue(field, value);
    },
    [setFieldValue]
  );

  const handleSaveFromModal = useCallback(
    async (updatedFormData: PerformanceFormData) => {
      closeModal();
      setValues(updatedFormData);
      await savePerformanceProfile({ form_data: updatedFormData });
    },
    [closeModal, setValues, savePerformanceProfile]
  );

  const handleEditCard = useCallback(
    (cardId: SnapshotCardType) => {
      openModal({
        size: 'large',
        content: (
          <EditProfileModal
            cardType={cardId}
            initialFormData={formData}
            onSave={handleSaveFromModal}
            onCancel={closeModal}
          />
        ),
      });
    },
    [openModal, closeModal, formData, handleSaveFromModal]
  );

  if (!hasInitialized && profileLoading) {
    return <Loader />;
  }

  if (tips.showTipSelection && tips.tipsData) {
    return (
      <StyledCard $variant="section">
        <TipSelectionView
          tipsData={tips.tipsData}
          selectedTipIds={tips.selectedTipIds}
          onToggleTip={tips.toggleTip}
          onSave={tips.saveTips}
          isSaving={tips.isSavingTips}
        />
      </StyledCard>
    );
  }

  if (tips.showResults && tips.tipsData) {
    return (
      <PerformanceResultsView
        formData={formData}
        tipsData={tips.tipsData}
        biomarkers={biomarkers ?? []}
        chatUserContext={chatUserContext}
        hasFormDataChanged={hasFormDataChanged}
        isRegenerating={tips.isGenerating}
        onEditCard={handleEditCard}
        onEditTips={tips.editTips}
        onRegenerate={tips.regenerate}
      />
    );
  }

  return (
    <PerformanceStepperView
      formData={formData}
      currentStep={currentStep}
      isFirstStep={isFirstStep}
      isLastStep={isLastStep}
      canProceed={canProceed}
      isGenerating={tips.isGenerating}
      onFieldChange={handleFieldChange}
      onPrevious={previousStep}
      onNext={nextStep}
      onStepClick={goToStep}
      onSubmit={tips.submit}
    />
  );
}

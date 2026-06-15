import { useCallback, useEffect } from 'react';

import { Icons } from '@components/Icons';
import { Loader } from '@components/Loader';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { useModal } from '@context/ModalProvider';
import { useTranslation } from '@helpers/i18n';
import { useForm } from '@hooks/useForm';

import { useData } from '@package/api';
import { theme } from '@package/ui';
import { deepEqual } from '@package/utils';

import {
  EditProfileModal,
  PerformanceGeneratingView,
  PerformanceResultsView,
  PerformanceStepperView,
  TipSelectionView,
} from './components';
import type { SnapshotCardType } from './components/PerformanceSnapshot/PerformanceSnapshot';
import { CARD_LABELS, STEP_VALIDATION, TOTAL_STEPS } from './consts';
import {
  useChatUserContext,
  usePerformanceDraft,
  usePerformanceProfileInit,
  usePerformanceTips,
} from './hooks';
import { INITIAL_FORM_DATA, type PerformanceFormData } from './types';

export function Performance() {
  const { openModal, closeModal } = useModal();
  const { t } = useTranslation();
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
  const { loadDraft, saveDraft, clearDraft } = usePerformanceDraft();

  const { hasInitialized } = usePerformanceProfileInit({
    setValues,
    setTipsData: tips.setTipsData,
    setPlanFormData: tips.setPlanFormData,
    setSelectedTipIds: tips.setSelectedTipIds,
    setShowResults: tips.setShowResults,
    loadDraft,
  });

  // Persist the stepper draft locally while the user is filling in the steps
  // (no plan generated yet), so progress survives navigation/refresh.
  const inStepper = !tips.showResults && !tips.showTipSelection;

  useEffect(() => {
    if (!hasInitialized || !inStepper) return;

    saveDraft(formData);
  }, [hasInitialized, inStepper, formData, saveDraft]);

  // Once a plan exists the form_data is committed to the DB on generate, so
  // the local draft is obsolete and must be cleared to avoid overriding it.
  useEffect(() => {
    if (tips.tipsData) clearDraft();
  }, [tips.tipsData, clearDraft]);

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
    async (updatedFormData: PerformanceFormData): Promise<boolean> => {
      const saved = await savePerformanceProfile({ form_data: updatedFormData });

      // Only apply the edit locally and close the modal when the save actually
      // persisted — otherwise the modal stays open and shows the error.
      if (!saved) return false;

      setValues(updatedFormData);
      closeModal();

      return true;
    },
    [closeModal, setValues, savePerformanceProfile]
  );

  const handleEditCard = (cardId: SnapshotCardType) => {
    openModal({
      size: 'large',
      title: t(CARD_LABELS[cardId]),
      content: (
        <EditProfileModal
          cardType={cardId}
          initialFormData={formData}
          onSave={handleSaveFromModal}
          onCancel={closeModal}
        />
      ),
    });
  };

  // Hold the loader until initialization actually finishes — not just while the
  // profile is loading. A cached profile never sets `loading`, so gating on it
  // would let the stepper render for a frame before the real view (results /
  // tip selection) is restored.
  if (!hasInitialized) {
    return <Loader />;
  }

  const errorBanner = tips.error && (
    <StyledCard $variant="section" $tone="error" $noShadow>
      <FlexRow $gap="sm" $align="center">
        <Icons.AlertCircle size={20} color={theme.colors.error.strong} />
        <Paragraph $size="small" $color={theme.colors.error.strong}>
          {tips.error}
        </Paragraph>
      </FlexRow>
    </StyledCard>
  );

  // While generating the initial plan (including resuming an in-flight job
  // after a reload) show a dedicated screen instead of the stepper, so the user
  // can't kick off a duplicate generation. Regeneration keeps its in-place
  // indicator on the results view, so it's excluded here.
  if (tips.isGenerating && !tips.showResults && !tips.showTipSelection) {
    return (
      <FlexColumn $gap="md">
        {errorBanner}
        <PerformanceGeneratingView />
      </FlexColumn>
    );
  }

  if (tips.showTipSelection && tips.tipsData) {
    return (
      <FlexColumn $gap="md">
        {errorBanner}
        <StyledCard $variant="section">
          <TipSelectionView
            tipsData={tips.tipsData}
            selectedTipIds={tips.selectedTipIds}
            onToggleTip={tips.toggleTip}
            onSave={tips.saveTips}
            isSaving={tips.isSavingTips}
          />
        </StyledCard>
      </FlexColumn>
    );
  }

  if (tips.showResults && tips.tipsData) {
    return (
      <FlexColumn $gap="md">
        {errorBanner}
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
      </FlexColumn>
    );
  }

  return (
    <FlexColumn $gap="md">
      {errorBanner}
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
    </FlexColumn>
  );
}

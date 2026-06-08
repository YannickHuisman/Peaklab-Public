import { Button } from '@components/Button';
import { Icons } from '@components/Icons';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { useTranslation } from '@helpers/i18n';

import type { Biomarker } from '@package/api';
import { useAppData } from '@package/api';

import { useBiomarkerContent } from '../hooks';
import { EditingView } from './EditingView';
import { ReadOnlyView } from './ReadOnlyView';

interface DetailsTabProps {
  biomarker: Biomarker;
  isAdmin: boolean;
}

export function DetailsTab({ biomarker, isAdmin }: DetailsTabProps) {
  const { t } = useTranslation();
  const { refetchBiomarkers } = useAppData();

  const {
    isEditing,
    isSaving,
    editValues,
    startEditing,
    cancelEditing,
    saveContent,
    updateField,
    addTip,
    updateTip,
    removeTip,
    addSource,
    updateSource,
    removeSource,
  } = useBiomarkerContent(biomarker, { onSave: refetchBiomarkers });

  const hasNoContent =
    !biomarker.what_it_measures &&
    !biomarker.why_relevant &&
    !biomarker.interpretation &&
    !biomarker.how_to_optimize &&
    (!biomarker.optimization_tips || biomarker.optimization_tips.length === 0) &&
    (!biomarker.scientific_sources || biomarker.scientific_sources.length === 0);

  return (
    <FlexColumn $gap="lg">
      {isAdmin && (
        <FlexRow $justify="flex-end" $gap="sm">
          {isEditing ? (
            <>
              <Button
                type="button"
                $variant="ghost"
                $size="small"
                onClick={cancelEditing}
                disabled={isSaving}
              >
                {t('Annuleren')}
              </Button>
              <Button type="button" $size="small" onClick={saveContent} disabled={isSaving}>
                {isSaving ? t('Opslaan...') : t('Opslaan')}
              </Button>
            </>
          ) : (
            <Button type="button" $variant="ghost" $size="small" onClick={startEditing}>
              <Icons.Edit size="xs" /> {t('Bewerken')}
            </Button>
          )}
        </FlexRow>
      )}

      {isEditing ? (
        <EditingView
          editValues={editValues}
          biomarkerName={biomarker.display_name}
          updateField={updateField}
          addTip={addTip}
          updateTip={updateTip}
          removeTip={removeTip}
          addSource={addSource}
          updateSource={updateSource}
          removeSource={removeSource}
        />
      ) : (
        <ReadOnlyView biomarker={biomarker} hasNoContent={hasNoContent} />
      )}
    </FlexColumn>
  );
}

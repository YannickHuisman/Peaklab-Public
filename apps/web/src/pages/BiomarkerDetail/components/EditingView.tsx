import { EditableSourcesList } from '@components/form/EditableSourcesList';
import { EditableTipsList } from '@components/form/EditableTipsList';
import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { MarkdownEditor } from '@components/MarkdownEditor';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';

import { theme } from '@package/ui';

import type { useBiomarkerContent } from '../hooks';

type ContentEditor = ReturnType<typeof useBiomarkerContent>;

export interface EditingViewProps {
  editValues: ContentEditor['editValues'];
  biomarkerName: string;
  updateField: ContentEditor['updateField'];
  addTip: ContentEditor['addTip'];
  updateTip: ContentEditor['updateTip'];
  removeTip: ContentEditor['removeTip'];
  addSource: ContentEditor['addSource'];
  updateSource: ContentEditor['updateSource'];
  removeSource: ContentEditor['removeSource'];
}

export function EditingView({
  editValues,
  biomarkerName,
  updateField,
  addTip,
  updateTip,
  removeTip,
  addSource,
  updateSource,
  removeSource,
}: EditingViewProps) {
  return (
    <>
      <StyledCard $variant="section" $noShadow>
        <FlexColumn $gap="sm">
          <FlexRow $gap="sm" $align="center">
            <Icons.Info size="sm" color={theme.colors.primary} />
            <Heading $size="small">Wat meet deze biomarker in het lichaam?</Heading>
          </FlexRow>
          <MarkdownEditor
            value={editValues.what_it_measures}
            onChange={(val) => updateField('what_it_measures', val)}
            placeholder="Beschrijf wat deze biomarker meet..."
          />
        </FlexColumn>
      </StyledCard>

      <StyledCard $variant="section" $noShadow>
        <FlexColumn $gap="sm">
          <Heading $size="small">Waarom relevant?</Heading>
          <MarkdownEditor
            value={editValues.why_relevant}
            onChange={(val) => updateField('why_relevant', val)}
            placeholder="Leg uit waarom deze biomarker relevant is..."
          />
        </FlexColumn>
      </StyledCard>

      <StyledCard $variant="section" $noShadow>
        <FlexColumn $gap="sm">
          <Heading $size="small">Wat zegt een lage of hoge waarde?</Heading>
          <MarkdownEditor
            value={editValues.interpretation}
            onChange={(val) => updateField('interpretation', val)}
            placeholder="Beschrijf wat lage of hoge waarden betekenen..."
          />
        </FlexColumn>
      </StyledCard>

      <StyledCard $variant="section" $noShadow>
        <FlexColumn $gap="sm">
          <Heading $size="small">Hoe optimaliseer je {biomarkerName}?</Heading>
          <MarkdownEditor
            value={editValues.how_to_optimize}
            onChange={(val) => updateField('how_to_optimize', val)}
            placeholder="Beschrijf hoe je deze biomarker kunt optimaliseren..."
          />
        </FlexColumn>
      </StyledCard>

      <StyledCard $variant="section" $noShadow>
        <FlexColumn $gap="sm">
          <Heading $size="small">Algemene optimalisatie tips</Heading>
          <EditableTipsList
            tips={editValues.optimization_tips}
            onAdd={addTip}
            onUpdate={updateTip}
            onRemove={removeTip}
          />
        </FlexColumn>
      </StyledCard>

      <StyledCard $variant="section" $noShadow>
        <FlexColumn $gap="sm">
          <Heading $size="small">Wetenschappelijke bronnen</Heading>
          <EditableSourcesList
            sources={editValues.scientific_sources}
            onAdd={addSource}
            onUpdate={updateSource}
            onRemove={removeSource}
          />
        </FlexColumn>
      </StyledCard>
    </>
  );
}

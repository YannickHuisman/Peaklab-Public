import { EditableSourcesList } from '@components/form/EditableSourcesList';
import { EditableTipsList } from '@components/form/EditableTipsList';
import { MarkdownEditor } from '@components/MarkdownEditor';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn } from '@components/styled/layout';

import type { ScientificSource } from '@package/api';

import { StyledFormGrid, StyledLabel } from '../styles';
import type { BiomarkerFormData } from './types';

type FieldProps = {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur: () => void;
  error?: string;
};

interface ContentTabProps {
  values: BiomarkerFormData;
  getFieldProps: (field: keyof BiomarkerFormData) => FieldProps;
  setFieldValue: (field: keyof BiomarkerFormData, value: unknown) => void;
}

export function ContentTab({ values, getFieldProps, setFieldValue }: ContentTabProps) {
  const updateArray = <T,>(field: keyof BiomarkerFormData, mutator: (current: T[]) => T[]) => {
    const current = (values[field] as T[] | undefined) ?? [];

    setFieldValue(field, mutator(current));
  };

  const tips = values.optimization_tips;
  const sources = values.scientific_sources;
  const label = values.display_name || 'deze biomarker';

  return (
    <StyledFormGrid>
      <FlexColumn $gap="xs">
        <StyledLabel>Wat meet deze biomarker in het lichaam?</StyledLabel>
        <MarkdownEditor
          value={getFieldProps('what_it_measures').value}
          onChange={(val) => setFieldValue('what_it_measures', val)}
          placeholder="Beschrijf wat deze biomarker meet..."
        />
      </FlexColumn>
      <FlexColumn $gap="xs">
        <StyledLabel>Waarom relevant?</StyledLabel>
        <MarkdownEditor
          value={getFieldProps('why_relevant').value}
          onChange={(val) => setFieldValue('why_relevant', val)}
          placeholder="Leg uit waarom deze biomarker relevant is..."
        />
      </FlexColumn>
      <FlexColumn $gap="xs">
        <StyledLabel>Wat zegt een lage of hoge waarde?</StyledLabel>
        <MarkdownEditor
          value={getFieldProps('interpretation').value}
          onChange={(val) => setFieldValue('interpretation', val)}
          placeholder="Beschrijf wat lage of hoge waarden betekenen..."
        />
      </FlexColumn>
      <FlexColumn $gap="xs">
        <StyledLabel>Hoe kun je {label} optimaliseren?</StyledLabel>
        <MarkdownEditor
          value={getFieldProps('how_to_optimize').value}
          onChange={(val) => setFieldValue('how_to_optimize', val)}
          placeholder="Beschrijf hoe je deze biomarker kunt optimaliseren..."
        />
      </FlexColumn>

      <FlexColumn $gap="xs">
        <StyledLabel>Algemene optimalisatie tips</StyledLabel>
        <Paragraph $size="xsmall" $variant="secondary">
          Voeg concrete tips toe om deze biomarker te optimaliseren
        </Paragraph>
        <EditableTipsList
          tips={tips}
          onAdd={() => updateArray<string>('optimization_tips', (cur) => [...cur, ''])}
          onUpdate={(index, value) =>
            updateArray<string>('optimization_tips', (cur) => {
              const next = [...cur];

              next[index] = value;

              return next;
            })
          }
          onRemove={(index) =>
            updateArray<string>('optimization_tips', (cur) => cur.filter((_, i) => i !== index))
          }
        />
      </FlexColumn>

      <FlexColumn $gap="xs">
        <StyledLabel>Wetenschappelijke bronnen</StyledLabel>
        <Paragraph $size="xsmall" $variant="secondary">
          Voeg URL's naar wetenschappelijke artikelen of bronnen toe
        </Paragraph>
        <EditableSourcesList
          sources={sources}
          onAdd={() =>
            updateArray<ScientificSource>('scientific_sources', (cur) => [
              ...cur,
              { title: '', url: '' },
            ])
          }
          onUpdate={(index, field, value) =>
            updateArray<ScientificSource>('scientific_sources', (cur) => {
              const next = [...cur];

              next[index] = { ...next[index], [field]: value };

              return next;
            })
          }
          onRemove={(index) =>
            updateArray<ScientificSource>('scientific_sources', (cur) =>
              cur.filter((_, i) => i !== index)
            )
          }
        />
      </FlexColumn>
    </StyledFormGrid>
  );
}

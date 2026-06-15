import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn } from '@components/styled/layout';

import {
  StyledAutofillButton,
  StyledBiomarkerCard,
  StyledBiomarkerHeader,
  StyledExistingBadge,
  StyledFlagSelect,
  StyledInput,
  StyledInputGrid,
  StyledPanelBadge,
} from '../../styles';
import type { Biomarker, BiomarkerResult } from '../../types';

interface BiomarkerCardProps {
  biomarker: Biomarker;
  resultData: Partial<BiomarkerResult>;
  hasExisting: boolean;
  isInPanel: boolean;
  onResultChange: (biomarkerId: number, field: string, value: string | number | null) => void;
  onAutofill: (biomarker: Biomarker) => void;
}

export function BiomarkerCard({
  biomarker,
  resultData,
  hasExisting,
  isInPanel,
  onResultChange,
  onAutofill,
}: BiomarkerCardProps) {
  return (
    <StyledBiomarkerCard $hasValue={hasExisting}>
      <StyledBiomarkerHeader>
        <div>
          <Paragraph $size="small" $weight={600}>
            {biomarker.display_name}
            {isInPanel && <StyledPanelBadge>Panel</StyledPanelBadge>}
          </Paragraph>
        </div>
        <StyledAutofillButton
          type="button"
          onClick={() => onAutofill(biomarker)}
          title="Auto-fill reference ranges"
          aria-label="Auto-fill reference ranges"
        >
          <Icons.Zap size="sm" aria-hidden="true" />
        </StyledAutofillButton>
      </StyledBiomarkerHeader>
      <Paragraph $size="xsmall" $variant="secondary">
        {biomarker.name}
      </Paragraph>

      <StyledInputGrid>
        <FlexColumn $gap="xxs">
          <Paragraph $size="xsmall" $weight={500} $variant="secondary" $allCaps>
            Value *
          </Paragraph>
          <StyledInput
            type="number"
            step="0.01"
            placeholder="0.00"
            value={resultData.value || ''}
            onChange={(e) => onResultChange(biomarker.id, 'value', e.target.value)}
          />
        </FlexColumn>

        <FlexColumn $gap="xxs">
          <Paragraph $size="xsmall" $weight={500} $variant="secondary" $allCaps>
            Unit
          </Paragraph>
          <StyledInput
            type="text"
            placeholder={biomarker.unit}
            value={resultData.unit || biomarker.unit}
            onChange={(e) => onResultChange(biomarker.id, 'unit', e.target.value)}
          />
        </FlexColumn>

        <FlexColumn $gap="xxs">
          <Paragraph $size="xsmall" $weight={500} $variant="secondary" $allCaps>
            Ref Low
          </Paragraph>
          <StyledInput
            type="number"
            step="0.01"
            placeholder={biomarker.ref_male_min?.toString() || ''}
            value={resultData.ref_low || ''}
            onChange={(e) => onResultChange(biomarker.id, 'ref_low', e.target.value)}
          />
        </FlexColumn>

        <FlexColumn $gap="xxs">
          <Paragraph $size="xsmall" $weight={500} $variant="secondary" $allCaps>
            Ref High
          </Paragraph>
          <StyledInput
            type="number"
            step="0.01"
            placeholder={biomarker.ref_male_max?.toString() || ''}
            value={resultData.ref_high || ''}
            onChange={(e) => onResultChange(biomarker.id, 'ref_high', e.target.value)}
          />
        </FlexColumn>

        <FlexColumn $gap="xxs">
          <Paragraph $size="xsmall" $weight={500} $variant="secondary" $allCaps>
            Flag
          </Paragraph>
          <StyledFlagSelect
            value={resultData.flag || ''}
            onChange={(e) => onResultChange(biomarker.id, 'flag', e.target.value)}
          >
            <option value="">Auto</option>
            <option value="N">N - Normal</option>
            <option value="L">L - Low</option>
            <option value="H">H - High</option>
          </StyledFlagSelect>
        </FlexColumn>
      </StyledInputGrid>

      {hasExisting && (
        <StyledExistingBadge>
          <Icons.Check size="sm" /> Has value
        </StyledExistingBadge>
      )}
    </StyledBiomarkerCard>
  );
}

import { Paragraph } from '@components/Paragraph';
import { FlexColumn } from '@components/styled/layout';

import {
  StyledLabel,
  StyledPanelCheckbox,
  StyledPanelCheckboxCode,
  StyledPanelCheckboxName,
  StyledPanelsList,
} from '../styles';

interface PanelOption {
  id: number;
  name: string;
  code: string;
}

interface PanelSelectorProps {
  panels: PanelOption[];
  selectedIds: number[];
  loading: boolean;
  onChange: (ids: number[]) => void;
}

export function PanelSelector({ panels, selectedIds, loading, onChange }: PanelSelectorProps) {
  const togglePanel = (id: number, checked: boolean) => {
    onChange(checked ? [...selectedIds, id] : selectedIds.filter((i) => i !== id));
  };

  if (loading) {
    return (
      <FlexColumn $gap="xs">
        <StyledLabel>Assign to Panels</StyledLabel>
        <Paragraph $size="small" $variant="secondary">
          Loading panels...
        </Paragraph>
      </FlexColumn>
    );
  }

  return (
    <FlexColumn $gap="xs">
      <StyledLabel>Assign to Panels</StyledLabel>
      <Paragraph $size="xsmall" $variant="secondary">
        Select which test panels include this biomarker
      </Paragraph>
      <StyledPanelsList>
        {panels.map((panel) => (
          <StyledPanelCheckbox key={panel.id}>
            <input
              type="checkbox"
              checked={selectedIds.includes(panel.id)}
              onChange={(e) => togglePanel(panel.id, e.target.checked)}
            />
            <div>
              <StyledPanelCheckboxName>{panel.name}</StyledPanelCheckboxName>
              <StyledPanelCheckboxCode>{panel.code}</StyledPanelCheckboxCode>
            </div>
          </StyledPanelCheckbox>
        ))}
      </StyledPanelsList>
    </FlexColumn>
  );
}

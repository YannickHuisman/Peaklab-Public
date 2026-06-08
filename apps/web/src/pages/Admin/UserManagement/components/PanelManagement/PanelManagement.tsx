import { useState } from 'react';

import { Button } from '@components/Button';
import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';

import { useAppData } from '@package/api';
import { theme } from '@package/ui';

import { authenticatedFetch } from '../../../../../helpers/authenticatedFetch';
import { StyledPanelCard, StyledSelect } from './styles';

interface PanelManagementProps {
  userId: string;
  currentPanel: {
    panel_id: number;
    panel: { name: string; code: string; description?: string };
  } | null;
  onUpdate: () => void;
}

export function PanelManagement({ userId, currentPanel, onUpdate }: PanelManagementProps) {
  const { panels } = useAppData();
  const [selectedPanelId, setSelectedPanelId] = useState<number | null>(
    currentPanel?.panel_id || null
  );
  const [loading, setLoading] = useState(false);

  const handleUpdatePanel = async () => {
    if (!selectedPanelId) {
      console.error('Please select a panel');

      return;
    }

    try {
      setLoading(true);
      await authenticatedFetch(`/api/admin/users/${userId}/panel`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ panelId: selectedPanelId }),
      });

      console.error('Panel updated successfully');
      onUpdate();
    } catch (error) {
      console.error('Failed to update panel', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePanel = async () => {
    if (!confirm("Are you sure you want to remove this user's panel assignment?")) return;

    try {
      setLoading(true);
      await authenticatedFetch(`/api/admin/users/${userId}/panel`, {
        method: 'DELETE',
      });

      console.error('Panel removed successfully');
      setSelectedPanelId(null);
      onUpdate();
    } catch (error) {
      console.error('Failed to remove panel', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FlexColumn $gap="lg">
      <Heading $size="xsmall" $weight={600}>
        Panel Assignment
      </Heading>
      <Paragraph $size="small" $variant="secondary">
        Assign a panel to this user. The panel determines which biomarkers are tracked in their
        blood tests.
      </Paragraph>

      {currentPanel && (
        <StyledCard $variant="small" $tone="success" $showBorder $noShadow>
          <FlexRow $align="center" $justify="space-between">
            <div>
              <Paragraph $weight={600} $color={theme.colors.success.strong}>
                Current Panel: {currentPanel.panel.name}
              </Paragraph>
              <Paragraph $size="small" $color={theme.colors.success.main}>
                Code: {currentPanel.panel.code}
              </Paragraph>
              {currentPanel.panel.description && (
                <Paragraph $size="small" $color={theme.colors.success.main} $italic>
                  {currentPanel.panel.description}
                </Paragraph>
              )}
            </div>
            <Button
              $variant="secondary"
              $size="small"
              onClick={handleRemovePanel}
              disabled={loading}
            >
              <Icons.Trash size="sm" /> Remove Panel
            </Button>
          </FlexRow>
        </StyledCard>
      )}

      <FlexColumn $gap="xs">
        <Paragraph $size="small" $weight={500}>
          Select Panel
        </Paragraph>
        <StyledSelect
          value={selectedPanelId || ''}
          onChange={(e) => setSelectedPanelId(Number(e.target.value))}
          disabled={loading}
        >
          <option value="">-- Select a panel --</option>
          {panels.map((panel) => (
            <option key={panel.id} value={panel.id}>
              {panel.name} ({panel.code})
            </option>
          ))}
        </StyledSelect>
      </FlexColumn>

      <FlexColumn $gap="xs">
        <Heading $size="xsmall" $variant="secondary" $weight={600}>
          Available Panels
        </Heading>
        {panels.map((panel) => (
          <StyledPanelCard
            key={panel.id}
            $selected={selectedPanelId === panel.id}
            onClick={() => setSelectedPanelId(panel.id)}
          >
            <Paragraph $size="small" $weight={600}>
              {panel.name}
            </Paragraph>
            <Paragraph $size="xsmall" $variant="secondary">
              {panel.code}
            </Paragraph>
          </StyledPanelCard>
        ))}
      </FlexColumn>

      <FlexRow $justify="flex-end" $gap="xs" $pt="xs" style={{ borderTop: '1px solid #e5e7eb' }}>
        <Button onClick={handleUpdatePanel} disabled={loading || !selectedPanelId}>
          {loading ? 'Updating...' : currentPanel ? 'Update Panel' : 'Assign Panel'}
        </Button>
      </FlexRow>
    </FlexColumn>
  );
}

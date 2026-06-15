import { type FormEvent, useCallback, useEffect, useState } from 'react';

import { Button } from '@components/Button';
import { Loader } from '@components/Loader';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { apiUrl } from '@helpers/api';

import { StyledForm, StyledMessage } from '../../../styles';
import { StyledPanelList, StyledPanelOption } from '../../styles';

interface PublicPanel {
  id: number;
  name: string;
  code: string;
  description: string | null;
  target_sport: string | null;
  target_sex: string | null;
}

interface PanelStepProps {
  selectedPanelId: number | null;
  onSelectPanel: (panelId: number, panelCode: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  loading: boolean;
  success: string;
  error: string;
}

export function PanelStep({
  selectedPanelId,
  onSelectPanel,
  onBack,
  onSubmit,
  loading,
  success,
  error,
}: PanelStepProps) {
  const [panels, setPanels] = useState<PublicPanel[]>([]);
  const [panelsLoading, setPanelsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    const fetchPanels = async () => {
      try {
        const res = await fetch(apiUrl('/api/panels/public'));

        if (!res.ok) {
          throw new Error('Failed to load panels');
        }

        const data = await res.json();

        setPanels(data.panels || []);
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : 'Failed to load panels');
      } finally {
        setPanelsLoading(false);
      }
    };

    fetchPanels();
  }, []);

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      onSubmit();
    },
    [onSubmit]
  );

  if (panelsLoading) {
    return <Loader />;
  }

  if (fetchError) {
    return <StyledMessage $type="error">{fetchError}</StyledMessage>;
  }

  return (
    <StyledForm onSubmit={handleSubmit}>
      <FlexColumn $gap="xs">
        <Paragraph $size="small" $variant="secondary">
          Choose the panel that matches your goals. This determines which biomarkers we track for
          you.
        </Paragraph>
      </FlexColumn>

      <StyledPanelList>
        {panels.length === 0 && (
          <Paragraph $size="small" $variant="secondary" $italic>
            No panels available. Please contact support.
          </Paragraph>
        )}
        {panels.length > 0 &&
          panels.map((panel) => (
            <StyledPanelOption
              key={panel.id}
              type="button"
              $selected={selectedPanelId === panel.id}
              aria-pressed={selectedPanelId === panel.id}
              onClick={() => onSelectPanel(panel.id, panel.code)}
              disabled={loading}
            >
              <Paragraph $weight={600}>{panel.name}</Paragraph>
              {panel.description && (
                <Paragraph $size="small" $variant="secondary">
                  {panel.description}
                </Paragraph>
              )}
            </StyledPanelOption>
          ))}
      </StyledPanelList>

      {success && <StyledMessage $type="success">{success}</StyledMessage>}
      {error && <StyledMessage $type="error">{error}</StyledMessage>}

      <FlexRow $gap="sm">
        <Button type="button" $variant="secondary" onClick={onBack} disabled={loading} $fullWidth>
          Back
        </Button>
        <Button type="submit" disabled={loading || !selectedPanelId} $fullWidth>
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>
      </FlexRow>
    </StyledForm>
  );
}

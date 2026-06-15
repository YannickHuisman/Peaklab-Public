import { useCallback, useEffect, useState } from 'react';

import { Button } from '@components/Button';
import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow, Grid } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { formatDate } from '@helpers/formatDate';

import { useAppData } from '@package/api';
import type { Lab } from '@package/types';

import { authenticatedFetch } from '../../../../../helpers/authenticatedFetch';
import { BiomarkerResultsForm } from '../BiomarkerResultsForm';
import {
  StyledEmptyState,
  StyledInput,
  StyledListHeader,
  StyledSelect,
  StyledTestCardHeader,
  StyledTestStatus,
} from './styles';

interface BloodTestManagementProps {
  userId: string;
  userPanel: { panel_id: number } | null;
  showAllBiomarkers: boolean;
  onUpdate: () => void;
}

interface BloodTest {
  id: number;
  sample_taken_at: string;
  status: string;
  panel: {
    id: number;
    name: string;
    code: string;
  };
}

export function BloodTestManagement({
  userId,
  userPanel,
  showAllBiomarkers,
  onUpdate,
}: BloodTestManagementProps) {
  const { panels } = useAppData();
  const [bloodTests, setBloodTests] = useState<BloodTest[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);

  // Labs
  const [labs, setLabs] = useState<Lab[]>([]);

  const fetchLabs = useCallback(async () => {
    try {
      const response = await authenticatedFetch('/api/labs');
      const data = await response.json();

      setLabs(data.labs || []);
    } catch {
      // Silent fail
    }
  }, []);

  // Create form state
  const [selectedPanelId, setSelectedPanelId] = useState<number | null>(
    userPanel?.panel_id || null
  );
  const [selectedLabId, setSelectedLabId] = useState<number | null>(null);
  const [sampleDate, setSampleDate] = useState('');
  const [sampleTime, setSampleTime] = useState('');

  const fetchBloodTests = useCallback(async () => {
    try {
      const response = await authenticatedFetch(`/api/admin/users/${userId}`);
      const data = await response.json();

      setBloodTests(data.bloodTests || []);
    } catch {
      // swallow: error already surfaced via UI state
    }
  }, [userId]);

  useEffect(() => {
    fetchBloodTests();
    fetchLabs();
  }, [userId, fetchLabs, fetchBloodTests]);

  const handleCreateTest = async () => {
    if (!selectedPanelId || !sampleDate || !sampleTime) {
      console.error('Please fill in all fields');

      return;
    }

    try {
      setLoading(true);
      const sampleTakenAt = `${sampleDate}T${sampleTime}:00`;

      await authenticatedFetch(`/api/admin/users/${userId}/blood-tests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          panelId: selectedPanelId,
          labId: selectedLabId,
          sampleTakenAt,
          status: 'completed',
        }),
      });

      console.error('Blood test created successfully');
      setShowCreateForm(false);
      setSampleDate('');
      setSampleTime('');
      await fetchBloodTests();
      onUpdate();
    } catch (error) {
      console.error('Failed to create blood test', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTest = async (testId: number) => {
    if (
      !confirm(
        'Are you sure you want to delete this blood test? All associated results will be deleted.'
      )
    )
      return;

    try {
      setLoading(true);
      await authenticatedFetch(`/api/admin/blood-tests/${testId}`, {
        method: 'DELETE',
      });

      console.error('Blood test deleted successfully');
      await fetchBloodTests();
      onUpdate();
    } catch (error) {
      console.error('Failed to delete blood test', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FlexColumn $gap="lg">
      <FlexRow $justify="space-between" $align="flex-start">
        <div>
          <Heading $size="xsmall" $weight={600}>
            Blood Test Management
          </Heading>
          <Paragraph $size="small" $variant="secondary">
            Create and manage blood tests for this user
          </Paragraph>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <Icons.Plus />
          {showCreateForm ? 'Cancel' : 'Create Blood Test'}
        </Button>
      </FlexRow>

      {showCreateForm && (
        <StyledCard $variant="small" $showBorder $noShadow>
          <Heading $size="xsmall" $weight={600}>
            Create New Blood Test
          </Heading>

          <Grid $gridMinWidth="200px" $gap="md" $mb="md">
            <FlexColumn $gap="xs">
              <Paragraph $size="small" $weight={500}>
                Panel *
              </Paragraph>
              <StyledSelect
                value={selectedPanelId || ''}
                onChange={(e) => setSelectedPanelId(Number(e.target.value))}
                disabled={loading}
              >
                <option value="">-- Select panel --</option>
                {panels.map((panel) => (
                  <option key={panel.id} value={panel.id}>
                    {panel.name} ({panel.code})
                  </option>
                ))}
              </StyledSelect>
            </FlexColumn>

            <FlexColumn $gap="xs">
              <Paragraph $size="small" $weight={500}>
                Lab
              </Paragraph>
              <StyledSelect
                value={selectedLabId || ''}
                onChange={(e) => setSelectedLabId(e.target.value ? Number(e.target.value) : null)}
                disabled={loading}
              >
                <option value="">-- Select lab --</option>
                {labs.map((lab) => (
                  <option key={lab.id} value={lab.id}>
                    {lab.name}
                  </option>
                ))}
              </StyledSelect>
            </FlexColumn>

            <FlexColumn $gap="xs">
              <Paragraph $size="small" $weight={500}>
                Sample Date *
              </Paragraph>
              <StyledInput
                type="date"
                value={sampleDate}
                onChange={(e) => setSampleDate(e.target.value)}
                disabled={loading}
              />
            </FlexColumn>

            <FlexColumn $gap="xs">
              <Paragraph $size="small" $weight={500}>
                Sample Time *
              </Paragraph>
              <StyledInput
                type="time"
                value={sampleTime}
                onChange={(e) => setSampleTime(e.target.value)}
                disabled={loading}
              />
            </FlexColumn>
          </Grid>

          <FlexRow $justify="flex-end" $gap="xs">
            <Button $variant="ghost" onClick={() => setShowCreateForm(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleCreateTest} disabled={loading}>
              {loading ? 'Creating...' : 'Create Blood Test'}
            </Button>
          </FlexRow>
        </StyledCard>
      )}

      <FlexColumn $gap="sm">
        <StyledListHeader>
          <span>Blood Tests ({bloodTests.length})</span>
        </StyledListHeader>

        {bloodTests.length === 0 && (
          <StyledEmptyState>No blood tests found. Create one to get started.</StyledEmptyState>
        )}
        {bloodTests.length > 0 &&
          bloodTests.map((test) => (
            <StyledCard $variant="small" $showBorder $noShadow key={test.id}>
              <StyledTestCardHeader>
                <FlexColumn $gap="xs">
                  <Paragraph $weight={600}>
                    {formatDate(test.sample_taken_at, { preset: 'datetime' })}
                  </Paragraph>
                  <Paragraph $size="small" $variant="secondary">
                    {test.panel.name} ({test.panel.code})
                  </Paragraph>
                  <StyledTestStatus $status={test.status}>
                    {test.status === 'completed' ? 'Completed' : 'Pending'}
                  </StyledTestStatus>
                </FlexColumn>
                <FlexRow $gap="sm">
                  <Button
                    $variant="ghost"
                    $size="small"
                    onClick={() => setSelectedTestId(selectedTestId === test.id ? null : test.id)}
                  >
                    {selectedTestId === test.id ? '▲ Hide Results' : '▼ Manage Results'}
                  </Button>
                  <Button
                    $variant="secondary"
                    $size="small"
                    onClick={() => handleDeleteTest(test.id)}
                    disabled={loading}
                    aria-label="Bloedtest verwijderen"
                  >
                    <Icons.Trash aria-hidden="true" />
                  </Button>
                </FlexRow>
              </StyledTestCardHeader>

              {selectedTestId === test.id && (
                <BiomarkerResultsForm
                  testId={test.id}
                  panelId={test.panel.id}
                  defaultShowAll={showAllBiomarkers}
                  onUpdate={() => {
                    fetchBloodTests();
                    onUpdate();
                  }}
                />
              )}
            </StyledCard>
          ))}
      </FlexColumn>
    </FlexColumn>
  );
}

import { useState } from 'react';

import { Button } from '@components/Button';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import type { TabItem } from '@components/Tabs';
import { Tabs } from '@components/Tabs';

import type { BiomarkerCategory, BiomarkerWithConfig } from '@package/api';

import { BasicInfoTab } from './BasicInfoTab';
import { ContentTab } from './ContentTab';
import type { FormTab } from './types';
import { useBiomarkerForm } from './useBiomarkerForm';
import { useBiomarkerPanels } from './useBiomarkerPanels';

interface BiomarkerFormProps {
  biomarker: BiomarkerWithConfig | null;
  categories: BiomarkerCategory[];
  panels: Array<{ id: number; name: string; code: string }>;
  onSuccess: () => void;
  onCancel: () => void;
}

const TABS: TabItem<FormTab>[] = [
  { id: 'basic', label: 'Basis Informatie' },
  { id: 'content', label: 'Detail Content' },
];

export function BiomarkerForm({
  biomarker,
  categories,
  panels,
  onSuccess,
  onCancel,
}: BiomarkerFormProps) {
  const [activeTab, setActiveTab] = useState<FormTab>('basic');

  const {
    selectedPanels,
    setSelectedPanels,
    loading: loadingPanels,
  } = useBiomarkerPanels(biomarker);

  const form = useBiomarkerForm({
    biomarker,
    categories,
    selectedPanels,
    onSuccess,
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
      e.preventDefault();
    }
  };

  return (
    <form onSubmit={form.handleSubmit} onKeyDown={handleKeyDown}>
      <FlexColumn $gap="lg">
        <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === 'basic' && (
          <BasicInfoTab
            values={form.values}
            errors={form.errors}
            touched={form.touched}
            categories={categories}
            panels={panels}
            selectedPanels={selectedPanels}
            loadingPanels={loadingPanels}
            onPanelsChange={setSelectedPanels}
            setFieldValue={form.setFieldValue}
            getFieldProps={form.getFieldProps}
          />
        )}

        {activeTab === 'content' && (
          <ContentTab
            values={form.values}
            getFieldProps={form.getFieldProps}
            setFieldValue={form.setFieldValue}
          />
        )}

        <FlexRow $gap="md" $justify="flex-end">
          <Button type="button" $variant="ghost" onClick={onCancel} disabled={form.isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.isSubmitting}>
            {form.isSubmitting ? 'Saving...' : biomarker ? 'Update' : 'Create'}
          </Button>
        </FlexRow>
      </FlexColumn>
    </form>
  );
}

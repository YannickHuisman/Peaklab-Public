import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { PageHeader } from '@components/PageHeader';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn } from '@components/styled/layout';
import type { TabItem } from '@components/Tabs';
import { Tabs } from '@components/Tabs';
import { buildBiomarkerConfig, getRangeStatus } from '@helpers/getRangeStatus';
import { useDeviceBreakpoints } from '@hooks/useDeviceBreakpoints';

import { useAuth, useData } from '@package/api';

import { DetailsTab, OverviewTab } from './components';

type Tab = 'overview' | 'details';

const TABS: TabItem<Tab>[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'details', label: 'Details' },
];

export function BiomarkerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { biomarkers, biomarkerHistory, fetchBiomarkerHistory, userGender } = useData();
  const { isAdmin } = useAuth();
  const { isMobile } = useDeviceBreakpoints();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const gender = userGender === 'female' ? 'female' : 'male';
  const biomarker = biomarkers.find((b) => String(b.biomarker.id) === id);

  const config = biomarker ? buildBiomarkerConfig(biomarker, gender) : null;
  const history = id ? biomarkerHistory[Number(id)] || [] : [];
  const isLoadingHistory = id ? biomarkerHistory[Number(id)] === undefined : false;

  useEffect(() => {
    if (id) {
      fetchBiomarkerHistory(Number(id));
    }
  }, [id, fetchBiomarkerHistory]);

  if (!biomarker) {
    return <Paragraph>Biomarker niet gevonden.</Paragraph>;
  }

  const rangeStatus =
    config?.normalRange && biomarker
      ? getRangeStatus(biomarker.value, config.normalRange, config.performanceRange)
      : null;

  return (
    <FlexColumn $gap="lg">
      <PageHeader
        title={biomarker.biomarker.display_name}
        subtitle={biomarker.biomarker.category?.name}
        onBack={() => navigate('/biomarkers')}
      />

      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'overview' && (
        <OverviewTab
          value={biomarker.value}
          unit={config?.unit}
          isOutOfRange={rangeStatus?.tone === 'error'}
          tone={rangeStatus?.tone || 'neutral'}
          normalRange={config?.normalRange}
          performanceRange={config?.performanceRange}
          history={history}
          isLoadingHistory={isLoadingHistory}
          isMobile={isMobile}
        />
      )}

      {activeTab === 'details' && <DetailsTab biomarker={biomarker.biomarker} isAdmin={isAdmin} />}
    </FlexColumn>
  );
}

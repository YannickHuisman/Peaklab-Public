import { useEffect } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import { PageHeader } from '@components/PageHeader';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn } from '@components/styled/layout';
import type { TabItem } from '@components/Tabs';
import { Tabs } from '@components/Tabs';
import { buildBiomarkerConfig, getRangeStatus } from '@helpers/getRangeStatus';
import { useDeviceBreakpoints } from '@hooks/useDeviceBreakpoints';

import type { BiomarkerResult } from '@package/api';
import { useAuth, useData } from '@package/api';

import { DetailsTab, OverviewTab } from './components';

type Tab = 'overview' | 'details';

export function BiomarkerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { biomarkers, biomarkerHistory, fetchBiomarkerHistory, userGender } = useData();
  const location = useLocation();

  const handleBack = () => {
    if (location.key !== 'default') {
      navigate(-1);
    } else {
      navigate('/biomarkers');
    }
  };
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAdmin } = useAuth();
  const { isMobile } = useDeviceBreakpoints();

  const tabParam = searchParams.get('tab') as Tab | null;
  const activeTab: Tab = tabParam === 'details' ? 'details' : 'overview';

  const setActiveTab = (tab: Tab) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);

        if (tab === 'overview') next.delete('tab');
        else next.set('tab', tab);

        return next;
      },
      { replace: true }
    );
  };

  const gender = userGender === 'female' ? 'female' : 'male';
  const biomarker = biomarkers.find((b) => String(b.biomarker.id) === id);

  const config = biomarker ? buildBiomarkerConfig(biomarker, gender) : null;
  const history = id ? biomarkerHistory[Number(id)] || [] : [];
  const isLoadingHistory = id ? biomarkerHistory[Number(id)] === undefined : false;

  const currentId = biomarker?.biomarker.id;
  const currentKind = biomarker?.biomarker.kind ?? 'direct';

  // For a direct biomarker: derived biomarkers (ratios + calculated) that
  // depend on it. For a derived biomarker: nothing here.
  const linkedDerived: BiomarkerResult[] = (() => {
    if (!currentId || currentKind !== 'direct') return [];

    return biomarkers.filter((b) => {
      const kind = b.biomarker.kind;

      if (kind !== 'ratio' && kind !== 'calculated') return false;

      return (b.biomarker.dependencies ?? []).some((d) => d.source_id === currentId);
    });
  })();

  // For a derived biomarker: the source biomarkers it is built from.
  const sourcesOfThis: BiomarkerResult[] = (() => {
    if (!biomarker || currentKind === 'direct') return [];
    const sourceIds = new Set((biomarker.biomarker.dependencies ?? []).map((d) => d.source_id));

    return biomarkers.filter((b) => sourceIds.has(b.biomarker.id));
  })();

  const tabs: TabItem<Tab>[] = [
    { id: 'overview', label: 'Overzicht' },
    { id: 'details', label: 'Details' },
  ];

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

  // Determine status for pill
  const pillStatus =
    rangeStatus?.tone === 'error'
      ? 'buiten'
      : rangeStatus?.tone === 'success'
        ? 'performance'
        : 'normaal';

  return (
    <FlexColumn $gap="lg">
      <FlexColumn $gap="md">
        <PageHeader
          title={biomarker.biomarker.display_name}
          subtitle={biomarker.biomarker.category?.name}
          onBack={handleBack}
        />
      </FlexColumn>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === 'overview' && (
        <OverviewTab
          value={biomarker.value}
          unit={config?.unit}
          status={pillStatus}
          tone={rangeStatus?.tone || 'neutral'}
          normalRange={config?.normalRange}
          performanceRange={config?.performanceRange}
          history={history}
          isLoadingHistory={isLoadingHistory}
          isMobile={isMobile}
          linkedDerived={linkedDerived}
          sourcesOfThis={sourcesOfThis}
        />
      )}

      {activeTab === 'details' && <DetailsTab biomarker={biomarker.biomarker} isAdmin={isAdmin} />}
    </FlexColumn>
  );
}

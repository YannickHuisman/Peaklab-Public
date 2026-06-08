import { useState } from 'react';

import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Loader, SmallLoader } from '@components/Loader';
import { PageHeader } from '@components/PageHeader';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { useTranslation } from '@helpers/i18n';
import { useDeviceBreakpoints } from '@hooks/useDeviceBreakpoints';

import { theme } from '@package/ui';

import { useSettings } from '../../context/SettingsProvider';
import {
  AccountSection,
  AISection,
  LanguageSection,
  NotificationsSection,
  PrivacySection,
} from './components';
import {
  StyledMobileSectionItem,
  StyledMobileSectionPicker,
  StyledSettingsLayout,
  StyledSidebar,
  StyledSidebarItem,
} from './styles';

type SettingsSectionId = 'language' | 'privacy' | 'notifications' | 'ai' | 'account';

interface SectionDef {
  id: SettingsSectionId;
  label: string;
  icon: React.ReactNode;
}

const SECTIONS: SectionDef[] = [
  { id: 'language', label: 'Taal & Regio', icon: <Icons.Globe size={16} /> },
  { id: 'privacy', label: 'Privacy', icon: <Icons.Lock size={16} /> },
  { id: 'notifications', label: 'Meldingen', icon: <Icons.Bell size={16} /> },
  { id: 'ai', label: 'AI Assistent', icon: <Icons.Sparkles size={16} /> },
  { id: 'account', label: 'Account & Beveiliging', icon: <Icons.Shield size={16} /> },
];

export function Settings() {
  const { isMobile } = useDeviceBreakpoints();
  const [activeSection, setActiveSection] = useState<SettingsSectionId>('language');
  const { settings, loading, saving, update } = useSettings();
  const { t } = useTranslation();

  function renderSection() {
    switch (activeSection) {
      case 'language':
        return <LanguageSection settings={settings} onUpdate={update} t={t} />;
      case 'privacy':
        return <PrivacySection settings={settings} onUpdate={update} t={t} />;
      case 'notifications':
        return <NotificationsSection settings={settings} onUpdate={update} t={t} />;
      case 'ai':
        return <AISection settings={settings} onUpdate={update} t={t} />;
      case 'account':
        return <AccountSection t={t} />;
      default:
        return null;
    }
  }

  const activeLabel = SECTIONS.find((s) => s.id === activeSection)?.label ?? '';

  if (loading) {
    return <Loader />;
  }

  return (
    <FlexColumn $gap="xl">
      <FlexRow $justify="space-between" $align="flex-start">
        <PageHeader
          title={t('Instellingen')}
          subtitle={t('Beheer jouw taal, privacy en accountinstellingen')}
        />
        {saving && <SmallLoader />}
      </FlexRow>

      <StyledSettingsLayout $isMobile={isMobile}>
        {isMobile ? (
          <StyledMobileSectionPicker>
            {SECTIONS.map((section) => (
              <StyledMobileSectionItem
                key={section.id}
                $active={activeSection === section.id}
                onClick={() => setActiveSection(section.id)}
              >
                <FlexRow $align="center" $gap="sm" $width="auto">
                  <span style={{ color: theme.colors.text.secondary }}>{section.icon}</span>
                  <span>{t(section.label)}</span>
                </FlexRow>
                <Icons.ChevronRight size={16} color={theme.colors.text.muted} />
              </StyledMobileSectionItem>
            ))}
          </StyledMobileSectionPicker>
        ) : (
          <StyledSidebar>
            {SECTIONS.map((section) => (
              <StyledSidebarItem
                key={section.id}
                $active={activeSection === section.id}
                onClick={() => setActiveSection(section.id)}
              >
                <span
                  style={{
                    color:
                      activeSection === section.id
                        ? theme.colors.text.primary
                        : theme.colors.text.muted,
                  }}
                >
                  {section.icon}
                </span>
                {t(section.label)}
              </StyledSidebarItem>
            ))}
          </StyledSidebar>
        )}

        <FlexColumn $gap="md">
          {isMobile && (
            <Heading $size="small" $weight={700}>
              {t(activeLabel)}
            </Heading>
          )}
          {renderSection()}
        </FlexColumn>
      </StyledSettingsLayout>
    </FlexColumn>
  );
}

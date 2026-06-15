import { useCallback, useEffect, useState } from 'react';

import { Button } from '@components/Button';
import { Heading } from '@components/Heading';
import { Icons } from '@components/Icons';
import { Loader } from '@components/Loader';
import { Modal } from '@components/Modal';
import { Paragraph } from '@components/Paragraph';
import { Spacer } from '@components/Spacer';
import { FlexColumn, FlexRow, Grid } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import type { TabItem } from '@components/Tabs';
import { Tabs } from '@components/Tabs';
import { ToggleGroup } from '@components/ToggleGroup';
import { useModal } from '@context/ModalProvider';
import { authenticatedFetch } from '@helpers/authenticatedFetch';
import { useTranslation } from '@helpers/i18n';

import type { Biomarker } from '@package/api';
import { useAuth } from '@package/api';

import { AppointmentManagement } from '../AppointmentManagement';
import { BloodTestManagement } from '../BloodTestManagement';
import { PanelManagement } from '../PanelManagement';
import { UserBiomarkersView } from '../UserBiomarkersView';
import { UserBloodTestsView } from '../UserBloodTestsView';
import { UserInfoCard } from '../UserInfoCard';
import { StyledNoDataMessage, StyledSummaryCard, StyledTabContent } from './styles';

interface AdminProfile {
  first_name?: string;
  last_name?: string;
  username?: string;
  date_of_birth?: string;
  gender?: string;
  show_all_biomarkers?: boolean;
  [key: string]: unknown;
}

interface AdminPanel {
  panel_id: number;
  panel: { name: string; code: string; [key: string]: unknown };
  [key: string]: unknown;
}

interface AdminBloodTest {
  id: number;
  sample_taken_at: string;
  status: string;
  [key: string]: unknown;
}

interface AdminBiomarkerResult {
  biomarker: Biomarker;
  blood_test_id: string;
  value: number;
  unit: string;
  flag: string | null;
  ref_low: number | null;
  ref_high: number | null;
  [key: string]: unknown;
}

interface AdminSubscription {
  status: string;
  plan: string | null;
  stripe_subscription_id: string | null;
  current_period_end: string | null;
}

interface UserData {
  user: {
    id: string;
    email: string;
    role: string;
    created_at: string;
    last_sign_in?: string;
  };
  profile: AdminProfile | null;
  panel: AdminPanel | null;
  bloodTests: AdminBloodTest[];
  biomarkerResults: AdminBiomarkerResult[];
  subscription: AdminSubscription | null;
}

interface UserDetailsModalProps {
  userId: string;
  onRefresh: () => void;
}

type Tab = 'overview' | 'panel' | 'blood-tests' | 'biomarkers' | 'appointments';

export function UserDetailsModal({ userId, onRefresh }: UserDetailsModalProps) {
  const { t } = useTranslation();
  const { closeModal } = useModal();

  const emptyUserData: UserData = {
    user: { id: '', email: '', role: '', created_at: '', last_sign_in: undefined },
    profile: null,
    panel: null,
    bloodTests: [],
    biomarkerResults: [],
    subscription: null,
  };

  const [userData, setUserData] = useState<UserData>(emptyUserData);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { user: currentUser } = useAuth();
  const [confirmRole, setConfirmRole] = useState<'user' | 'admin' | null>(null);
  const [visibilitySaving, setVisibilitySaving] = useState(false);
  const [localShowAll, setLocalShowAll] = useState(false);
  const [confirmDeleteSubscription, setConfirmDeleteSubscription] = useState(false);
  const [confirmDeleteUser, setConfirmDeleteUser] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUserDetails = useCallback(async () => {
    // Fetching user details
    if (!userId) return;

    try {
      const res = await authenticatedFetch(`/api/admin/users/${userId}`);

      if (res.ok) {
        const data = await res.json();

        setUserData(data);
      }
    } catch {
      // leaving previous data visible
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    fetchUserDetails();
  }, [userId, fetchUserDetails]);

  useEffect(() => {
    setLocalShowAll(userData.profile?.show_all_biomarkers ?? false);
  }, [userData.profile?.show_all_biomarkers]);

  const handleVisibilityChange = async (newShowAll: boolean) => {
    if (newShowAll === localShowAll) return;

    try {
      setVisibilitySaving(true);
      setLocalShowAll(newShowAll);
      const res = await authenticatedFetch(
        `/api/admin/users/${userData.user.id}/biomarker-visibility`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ showAllBiomarkers: newShowAll }),
        }
      );

      if (!res.ok) {
        setLocalShowAll(!newShowAll);
      }
    } catch (error) {
      console.error('Failed to update biomarker visibility', error);
      setLocalShowAll(!newShowAll);
    } finally {
      setVisibilitySaving(false);
    }
  };

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
    fetchUserDetails();
    onRefresh();
  };

  const handleUpdateRole = (newRole: 'user' | 'admin') => {
    setConfirmRole(newRole);
  };

  const executeRoleUpdate = async () => {
    if (!confirmRole) return;

    try {
      const res = await authenticatedFetch(`/api/admin/users/${userData.user.id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: confirmRole }),
      });

      if (!res.ok) {
        throw new Error('Rol bijwerken mislukt');
      }

      handleRefresh();
      setConfirmRole(null);
    } catch (err) {
      console.error('Failed to update user role', err);
    }
  };

  const showAdminControls =
    currentUser?.app_metadata?.role === 'super_admin' && userData.user.role !== 'super_admin';

  const executeDeleteSubscription = async () => {
    try {
      setActionLoading(true);
      const res = await authenticatedFetch(`/api/admin/users/${userData.user.id}/subscription`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Verwijderen mislukt');

      handleRefresh();
      setConfirmDeleteSubscription(false);
    } catch (err) {
      console.error('Failed to delete subscription', err);
    } finally {
      setActionLoading(false);
    }
  };

  const executeDeleteUser = async () => {
    try {
      setActionLoading(true);
      const res = await authenticatedFetch(`/api/admin/users/${userData.user.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Verwijderen mislukt');

      setConfirmDeleteUser(false);
      onRefresh();
      closeModal();
    } catch (err) {
      console.error('Failed to delete user', err);
    } finally {
      setActionLoading(false);
    }
  };

  const tabs: TabItem<Tab>[] = [
    {
      id: 'overview',
      label: (
        <>
          <Icons.Clipboard size="sm" /> {t('Overzicht')}
        </>
      ),
    },
    {
      id: 'panel',
      label: (
        <>
          <Icons.Target size="sm" /> {t('Panelbeheer')}
        </>
      ),
    },
    {
      id: 'blood-tests',
      label: (
        <>
          <Icons.Activity size="sm" /> {t('Bloedtests')}
        </>
      ),
    },
    {
      id: 'biomarkers',
      label: (
        <>
          <Icons.BarChart2 size="sm" /> {t('Biomarkers')}
        </>
      ),
    },
    {
      id: 'appointments',
      label: (
        <>
          <Icons.Calendar size="sm" /> {t('Afspraken')}
        </>
      ),
    },
  ];

  return (
    <FlexColumn style={{ width: '100%', minHeight: 0 }}>
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      <Spacer size="lg" />

      {isLoading && <Loader />}

      {!isLoading && !!userData && (
        <StyledTabContent>
          {activeTab === 'overview' && (
            <FlexColumn $gap="lg">
              <UserInfoCard user={userData.user} profile={userData.profile} />

              {showAdminControls && (
                <FlexColumn $gap="sm" $align="flex-start">
                  <Heading $size="xsmall">{t('Beheerder Rechten')}</Heading>

                  {userData.user.role !== 'admin' && (
                    <Button $size="small" onClick={() => handleUpdateRole('admin')}>
                      {t('Maak Admin')}
                    </Button>
                  )}
                  {userData.user.role === 'admin' && (
                    <Button $size="small" onClick={() => handleUpdateRole('user')}>
                      {t('Verwijder Admin Rechten')}
                    </Button>
                  )}
                </FlexColumn>
              )}

              <FlexColumn $gap="sm">
                <Heading $size="xsmall">{t('Abonnement')}</Heading>
                {userData.subscription && (
                  <StyledCard $variant="small" $showBorder $noShadow>
                    <Grid $gridColumns="140px 1fr" $gap="sm">
                      <Paragraph $size="small" $weight={500} $variant="secondary">
                        {t('Status:')}
                      </Paragraph>
                      <Paragraph $size="small">{userData.subscription.status}</Paragraph>
                      {userData.subscription.plan && (
                        <>
                          <Paragraph $size="small" $weight={500} $variant="secondary">
                            {t('Plan:')}
                          </Paragraph>
                          <Paragraph $size="small">{userData.subscription.plan}</Paragraph>
                        </>
                      )}
                      {userData.subscription.current_period_end && (
                        <>
                          <Paragraph $size="small" $weight={500} $variant="secondary">
                            {t('Geldig tot:')}
                          </Paragraph>
                          <Paragraph $size="small">
                            {new Date(userData.subscription.current_period_end).toLocaleDateString(
                              'nl-NL'
                            )}
                          </Paragraph>
                        </>
                      )}
                    </Grid>
                    <Spacer size="md" />
                    <Button
                      $size="small"
                      $variant="ghost"
                      onClick={() => setConfirmDeleteSubscription(true)}
                    >
                      {t('Verwijder abonnement')}
                    </Button>
                  </StyledCard>
                )}
                {!userData.subscription && (
                  <StyledNoDataMessage>{t('Geen actief abonnement')}</StyledNoDataMessage>
                )}
              </FlexColumn>

              <FlexColumn $gap="sm">
                <Heading $size="xsmall">{t('Panelkoppeling')}</Heading>
                {userData.panel && (
                  <StyledCard $variant="small" $showBorder $noShadow>
                    <Grid $gridColumns="140px 1fr" $gap="sm">
                      <Paragraph $size="small" $weight={500} $variant="secondary">
                        {t('Huidig panel:')}
                      </Paragraph>
                      <Paragraph $size="small">{userData.panel.panel.name}</Paragraph>
                      <Paragraph $size="small" $weight={500} $variant="secondary">
                        {t('Panelcode:')}
                      </Paragraph>
                      <Paragraph $size="small">{userData.panel.panel.code}</Paragraph>
                    </Grid>
                  </StyledCard>
                )}
                {!userData.panel && (
                  <StyledNoDataMessage>{t('Geen panel gekoppeld')}</StyledNoDataMessage>
                )}
              </FlexColumn>

              <FlexColumn $gap="sm" $align="flex-start">
                <Heading $size="xsmall">{t('Gebruiker verwijderen')}</Heading>
                <Paragraph $size="small" $variant="secondary">
                  {t(
                    'Permanent verwijderen van de gebruiker. Dit verwijdert het abonnement, profiel en het account.'
                  )}
                </Paragraph>
                <Button
                  $size="small"
                  $variant="secondary"
                  onClick={() => setConfirmDeleteUser(true)}
                >
                  {t('Verwijder gebruiker')}
                </Button>
              </FlexColumn>

              <FlexColumn $gap="sm">
                <Heading $size="xsmall">{t('Bloedtests samenvatting')}</Heading>
                <Grid $gridColumns="repeat(auto-fit, minmax(150px, 1fr))" $gap="md">
                  <StyledSummaryCard>
                    <Heading $size="xlarge" $weight={700} $color="inherit">
                      {userData.bloodTests.length}
                    </Heading>
                    <Paragraph $size="small" $color="inherit">
                      {t('Totale tests')}
                    </Paragraph>
                  </StyledSummaryCard>
                  <StyledSummaryCard>
                    <Heading $size="xlarge" $weight={700} $color="inherit">
                      {userData.biomarkerResults.length}
                    </Heading>
                    <Paragraph $size="small" $color="inherit">
                      {t('Biomarker resultaten')}
                    </Paragraph>
                  </StyledSummaryCard>
                  <StyledSummaryCard>
                    <Heading $size="xlarge" $weight={700} $color="inherit">
                      {userData.bloodTests.filter((bt) => bt.status === 'completed').length}
                    </Heading>
                    <Paragraph $size="small" $color="inherit">
                      {t('Voltooide tests')}
                    </Paragraph>
                  </StyledSummaryCard>
                </Grid>
              </FlexColumn>
            </FlexColumn>
          )}

          {activeTab === 'panel' && (
            <PanelManagement
              userId={userData.user.id}
              currentPanel={userData.panel}
              onUpdate={handleRefresh}
            />
          )}

          {activeTab === 'blood-tests' && (
            <BloodTestManagement
              userId={userData.user.id}
              userPanel={userData.panel}
              showAllBiomarkers={userData.profile?.show_all_biomarkers ?? false}
              onUpdate={handleRefresh}
              key={refreshTrigger}
            />
          )}

          {activeTab === 'biomarkers' && (
            <FlexColumn $gap="lg">
              <FlexColumn $gap="sm">
                <Heading $size="xsmall" $weight={600}>
                  {t('Biomarker Visibility')}
                </Heading>
                <Paragraph $size="small" $variant="secondary">
                  {t(
                    'Control which biomarkers are visible when entering blood test results for this user.'
                  )}
                </Paragraph>
                <ToggleGroup
                  options={[
                    { value: 'panel', label: t('Panel only') },
                    { value: 'all', label: t('All biomarkers') },
                  ]}
                  value={localShowAll ? 'all' : 'panel'}
                  disabled={visibilitySaving}
                  onChange={(v) => handleVisibilityChange(v === 'all')}
                />
              </FlexColumn>
              <UserBloodTestsView
                bloodTests={userData.bloodTests}
                onTestSelect={() => {
                  // Could implement drilling into specific test
                }}
              />
              <UserBiomarkersView
                biomarkerResults={userData.biomarkerResults}
                bloodTests={userData.bloodTests}
              />
            </FlexColumn>
          )}

          {activeTab === 'appointments' && (
            <AppointmentManagement userId={userData.user.id} onUpdate={handleRefresh} />
          )}
        </StyledTabContent>
      )}

      <Modal
        isOpen={!!confirmRole}
        onClose={() => setConfirmRole(null)}
        title={t('Weet je zeker dat je de rol wilt wijzigen?')}
        maxWidth="400px"
      >
        <FlexColumn $gap="lg">
          <p>
            Weet je zeker dat je de rol van deze gebruiker wilt wijzigen naar "
            {confirmRole === 'admin' ? 'Admin' : 'User'}"?
          </p>
          <FlexRow $gap="md" $justify="flex-end">
            <Button $variant="ghost" onClick={() => setConfirmRole(null)}>
              {t('Annuleren')}
            </Button>
            <Button onClick={executeRoleUpdate}>{t('Bevestigen')}</Button>
          </FlexRow>
        </FlexColumn>
      </Modal>

      <Modal
        isOpen={confirmDeleteSubscription}
        onClose={() => setConfirmDeleteSubscription(false)}
        title={t('Abonnement verwijderen?')}
        maxWidth="400px"
      >
        <FlexColumn $gap="lg">
          <Paragraph>
            {t(
              'Het Stripe abonnement wordt direct opgezegd en de koppeling wordt verwijderd. Het paneel wordt losgehaakt.'
            )}
          </Paragraph>
          <FlexRow $gap="md" $justify="flex-end">
            <Button $variant="ghost" onClick={() => setConfirmDeleteSubscription(false)}>
              {t('Annuleren')}
            </Button>
            <Button onClick={executeDeleteSubscription} disabled={actionLoading}>
              {actionLoading ? t('Bezig...') : t('Verwijderen')}
            </Button>
          </FlexRow>
        </FlexColumn>
      </Modal>

      <Modal
        isOpen={confirmDeleteUser}
        onClose={() => setConfirmDeleteUser(false)}
        title={t('Gebruiker permanent verwijderen?')}
        maxWidth="400px"
      >
        <FlexColumn $gap="lg">
          <Paragraph>
            {t(
              'Dit verwijdert het abonnement, het profiel en het account van de gebruiker. Deze actie kan niet ongedaan worden gemaakt.'
            )}
          </Paragraph>
          <FlexRow $gap="md" $justify="flex-end">
            <Button $variant="ghost" onClick={() => setConfirmDeleteUser(false)}>
              {t('Annuleren')}
            </Button>
            <Button onClick={executeDeleteUser} disabled={actionLoading}>
              {actionLoading ? t('Bezig...') : t('Permanent verwijderen')}
            </Button>
          </FlexRow>
        </FlexColumn>
      </Modal>
    </FlexColumn>
  );
}

import { useCallback, useEffect, useState } from 'react';

import { Input } from '@components/form/Input';
import { Select } from '@components/form/Select';
import { Icons } from '@components/Icons';
import { PageHeader } from '@components/PageHeader';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn, FlexRow } from '@components/styled/layout';
import { StyledCard } from '@components/styled/StyledCard';
import { useModal } from '@context/ModalProvider';
import { authenticatedFetch } from '@helpers/authenticatedFetch';

import { UserDetailsModal } from './components/UserDetailsModal';
import { UsersTable } from './components/UsersTable';

interface User {
  id: string;
  email: string;
  role: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  created_at: string;
  last_sign_in?: string;
}

export function UserManagement() {
  const { openModal } = useModal();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [usersData, setUsersData] = useState<{ users: User[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTick, setRefreshTick] = useState(0);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    setRefreshTick((t) => t + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;

    authenticatedFetch('/api/auth/admin/users').then(async (res) => {
      if (cancelled) return;
      if (res.ok) setUsersData(await res.json());
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [refreshTick]);

  const handleViewUser = (user: User) => {
    openModal({
      title: `User Details - ${user.email}`,
      content: <UserDetailsModal userId={user.id} onRefresh={fetchUsers} />,
      size: 'xlarge',
    });
  };

  const filteredUsers = (usersData?.users || []).filter((user) => {
    const matchesSearch =
      searchQuery === '' ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === '' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <FlexColumn $gap="lg" $flex={1}>
      <PageHeader
        title="User Management"
        subtitle="Manage users, panels, blood tests, and biomarker results"
        backHref="/admin"
      />

      <StyledCard $flex={1}>
        <FlexColumn $gap="lg" $flex={1}>
          <FlexRow $align="center" $justify="space-between" $gap="md" $flexWrap="wrap">
            <FlexRow $align="center" $gap="md" $flex={1} $flexWrap="wrap" $minWidth="0">
              <Input
                placeholder="Search users by email, name, or username..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Icons.Search />}
                style={{ maxWidth: '500px', minWidth: '200px' }}
              />
              <Select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                options={[
                  { value: 'user', label: 'User' },
                  { value: 'admin', label: 'Admin' },
                ]}
                placeholder="All Roles"
                style={{ maxWidth: '160px' }}
              />
            </FlexRow>
            <FlexRow $gap="sm">
              <Paragraph $size="small" $variant="secondary">
                Total Users: {filteredUsers.length}
              </Paragraph>
            </FlexRow>
          </FlexRow>

          <UsersTable users={filteredUsers} isLoading={loading} onViewUser={handleViewUser} />
        </FlexColumn>
      </StyledCard>
    </FlexColumn>
  );
}

import { Button } from '@components/Button';
import { type Column, DataTable } from '@components/DataTable';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn } from '@components/styled/layout';
import { formatDate } from '@helpers/formatDate';

import { RolePill } from '../RolePill';

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

interface UsersTableProps {
  users: User[];
  isLoading?: boolean;
  onViewUser: (user: User) => void;
}

export function UsersTable({ users, isLoading, onViewUser }: UsersTableProps) {
  const columns: Column<User>[] = [
    {
      id: 'user',
      header: 'User',
      width: '100px',
      cell: (user: User) => (
        <>
          <FlexColumn $gap="xxs">
            <Paragraph $weight={500}>
              {user.first_name || user.last_name
                ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                : user.username || 'No name'}
            </Paragraph>
            {user.username && (
              <Paragraph $size="xsmall" $variant="secondary">
                @{user.username}
              </Paragraph>
            )}
          </FlexColumn>
        </>
      ),
    },
    { id: 'email', header: 'Email', cell: (user: User) => user.email, width: '150px' },
    {
      id: 'role',
      header: 'Role',
      width: '100px',
      cell: (user: User) => <RolePill role={user.role} centered />,
    },
    {
      id: 'joined',
      header: 'Joined',
      cell: (user: User) => formatDate(user.created_at, { preset: 'datetime' }),
    },
    {
      id: 'lastSignIn',
      header: 'Last Sign In',
      cell: (user: User) => formatDate(user.last_sign_in, { preset: 'datetime' }),
    },
    {
      id: 'actions',
      header: '',

      cell: (user: User) => (
        <Button
          $variant="ghost"
          $size="small"
          $ml="auto"
          onClick={() => onViewUser(user)}
          aria-label="Gebruiker bekijken"
        >
          <Icons.Eye aria-hidden="true" />
        </Button>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={users}
      isLoading={isLoading}
      rowKey={(u) => u.id}
      minWidth="800px"
    />
  );
}

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Button } from '@components/Button';
import { Icons } from '@components/Icons';
import { Paragraph } from '@components/Paragraph';
import { FlexColumn } from '@components/styled/layout';
import { authenticatedFetch } from '@helpers/authenticatedFetch';
import { useClickOutside } from '@hooks/useClickOutside';

import type { AdminNotification, UserNotification } from '@package/types';

import {
  StyledNotificationBadge,
  StyledNotificationDot,
  StyledNotificationDropdown,
  StyledNotificationHeader,
  StyledNotificationItem,
  StyledNotificationWrapper,
} from './styles';

type TaggedNotification =
  | (AdminNotification & { _source: 'admin' })
  | (UserNotification & { _source: 'user' });

interface NotificationDropdownProps {
  iconColor: string;
  isAdmin?: boolean;
}

const NAVIGATE_MAP: Record<string, string> = {
  blood_result_upload: '/admin/uploads',
  partner_application: '/admin/applications',
  deep_research_completed: '/biomarkers/deep-research',
};

export function NotificationDropdown({ iconColor, isAdmin }: NotificationDropdownProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<TaggedNotification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const fetchNotifications = useCallback(async () => {
    try {
      const fetches: Promise<TaggedNotification[]>[] = [
        authenticatedFetch('/api/notifications')
          .then((r) => (r.ok ? r.json() : { notifications: [] }))
          .then((d) =>
            (d.notifications || []).map((n: UserNotification) => ({
              ...n,
              _source: 'user' as const,
            }))
          ),
      ];

      if (isAdmin) {
        fetches.push(
          authenticatedFetch('/api/notifications/admin')
            .then((r) => (r.ok ? r.json() : { notifications: [] }))
            .then((d) =>
              (d.notifications || []).map((n: AdminNotification) => ({
                ...n,
                _source: 'admin' as const,
              }))
            )
        );
      }

      const results = await Promise.all(fetches);
      const merged = results
        .flat()
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setNotifications(merged);
    } catch {
      // Silent fail
    }
  }, [isAdmin]);

  useEffect(() => {
    const poll = () => {
      fetchNotifications();
    };

    const timeout = setTimeout(poll, 0);
    const interval = setInterval(poll, 60000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [fetchNotifications]);

  useClickOutside(dropdownRef, () => setIsOpen(false), isOpen);

  useEffect(() => {
    // Use timeout to prevent synchronous cascading renders warning
    const timer = setTimeout(() => setIsOpen(false), 0);

    return () => clearTimeout(timer);
  }, [pathname]);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleNotificationClick = useCallback(
    async (notification: TaggedNotification) => {
      if (!notification.is_read) {
        const basePath =
          notification._source === 'admin' ? '/api/notifications/admin' : '/api/notifications';

        try {
          await authenticatedFetch(`${basePath}/${notification.id}/read`, {
            method: 'PUT',
          });

          setNotifications((prev) =>
            prev.map((n) => (n.id === notification.id ? { ...n, is_read: true } : n))
          );
        } catch {
          // Silent fail
        }
      }

      setIsOpen(false);

      const target = NAVIGATE_MAP[notification.type];

      if (target) {
        navigate(target);
      }
    },
    [navigate]
  );

  const handleMarkAllRead = useCallback(async () => {
    try {
      const promises = [authenticatedFetch('/api/notifications/read-all', { method: 'PUT' })];

      if (isAdmin) {
        promises.push(authenticatedFetch('/api/notifications/admin/read-all', { method: 'PUT' }));
      }

      await Promise.all(promises);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch {
      // Silent fail
    }
  }, [isAdmin]);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <StyledNotificationWrapper ref={dropdownRef}>
      <Button
        $variant="ghost"
        onClick={handleToggle}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={unreadCount > 0 ? `Notificaties, ${unreadCount} ongelezen` : 'Notificaties'}
      >
        <Icons.Bell color={iconColor} aria-hidden="true" />
        {unreadCount > 0 && (
          <StyledNotificationBadge aria-hidden="true">
            {unreadCount > 9 ? '9+' : unreadCount}
          </StyledNotificationBadge>
        )}
      </Button>

      {isOpen && (
        <StyledNotificationDropdown>
          <StyledNotificationHeader>
            <Paragraph $weight={600} $size="small">
              Notificaties
            </Paragraph>
            {unreadCount > 0 && (
              <Button
                $variant="ghost"
                $size="small"
                label="Alles gelezen"
                onClick={handleMarkAllRead}
              />
            )}
          </StyledNotificationHeader>

          {notifications.length === 0 && (
            <FlexColumn $align="center" $padding="lg">
              <Paragraph $variant="secondary" $size="small">
                Geen notificaties
              </Paragraph>
            </FlexColumn>
          )}
          {notifications.length > 0 && (
            <FlexColumn $gap="xs">
              {notifications.map((notification) => (
                <StyledNotificationItem
                  key={notification.id}
                  type="button"
                  $unread={!notification.is_read}
                  onClick={() => handleNotificationClick(notification)}
                >
                  {!notification.is_read && <StyledNotificationDot aria-hidden="true" />}
                  <FlexColumn $gap="xxs">
                    <Paragraph $size="small" $weight={notification.is_read ? 400 : 600}>
                      {notification.title}
                    </Paragraph>
                    {notification.message && (
                      <Paragraph $size="xsmall" $variant="secondary">
                        {notification.message}
                      </Paragraph>
                    )}
                    <Paragraph $size="xsmall" $variant="tertiary">
                      {formatDate(notification.created_at)}
                    </Paragraph>
                  </FlexColumn>
                </StyledNotificationItem>
              ))}
            </FlexColumn>
          )}
        </StyledNotificationDropdown>
      )}
    </StyledNotificationWrapper>
  );
}

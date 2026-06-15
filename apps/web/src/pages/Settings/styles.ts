import styled from 'styled-components';

import { theme } from '@package/ui';

export const StyledSettingsLayout = styled.div<{ $isMobile: boolean }>`
  display: grid;
  grid-template-columns: ${({ $isMobile }) => ($isMobile ? '1fr' : '220px 1fr')};
  gap: ${theme.spacing.xl};
  align-items: start;
`;

export const StyledSidebar = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  position: sticky;
  top: ${theme.spacing.xl};
`;

export const StyledSidebarItem = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  border: none;
  cursor: pointer;
  text-align: left;
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  transition:
    background ${theme.transitions.duration.fast} ease,
    color ${theme.transitions.duration.fast} ease;

  background: ${({ $active }) => ($active ? theme.colors.neutral[200] : 'transparent')};
  color: ${({ $active }) => ($active ? theme.colors.text.primary : theme.colors.text.secondary)};

  &:hover {
    background: ${theme.colors.neutral[200]};
    color: ${theme.colors.text.primary};
  }
`;

export const StyledSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

export const StyledSectionBlockTitle = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  padding-bottom: ${theme.spacing.md};
  border-bottom: 1px solid ${theme.colors.border.subtle};
`;

export const StyledSettingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing.md};
  min-height: 44px;
`;

export const StyledSettingLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xxs};
  flex: 1;
`;

export const StyledToggle = styled.button<{ $enabled: boolean }>`
  position: relative;
  width: 44px;
  height: 24px;
  border-radius: ${theme.borderRadius.full};
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  transition: background ${theme.transitions.duration.fast} ease;
  background: ${({ $enabled }) => ($enabled ? theme.colors.primary : theme.colors.neutral[300])};

  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${({ $enabled }) => ($enabled ? '23px' : '3px')};
    width: 18px;
    height: 18px;
    border-radius: ${theme.borderRadius.full};
    background: ${theme.colors.neutral[50]};
    transition: left ${theme.transitions.duration.fast} ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }
`;

export const StyledMobileSectionItem = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  border: none;
  cursor: pointer;
  text-align: left;
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  transition: background ${theme.transitions.duration.fast} ease;
  background: ${({ $active }) => ($active ? theme.colors.neutral[200] : 'transparent')};
  color: ${theme.colors.text.primary};

  &:hover {
    background: ${theme.colors.neutral[200]};
  }
`;

export const StyledProviderButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid
    ${({ $active }) => ($active ? theme.colors.primary : theme.colors.border.subtle)};
  background: ${({ $active }) => ($active ? theme.colors.primary : 'transparent')};
  color: ${({ $active }) => ($active ? theme.colors.neutral[50] : theme.colors.text.secondary)};
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  cursor: pointer;
  transition:
    background ${theme.transitions.duration.fast} ease,
    border-color ${theme.transitions.duration.fast} ease,
    color ${theme.transitions.duration.fast} ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

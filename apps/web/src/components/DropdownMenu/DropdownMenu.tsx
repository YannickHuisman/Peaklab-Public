import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Button } from '@components/Button';
import { moveRovingFocus } from '@helpers/moveRovingFocus';
import { useClickOutside } from '@hooks/useClickOutside';

import { StyledDropdown, StyledDropdownContent, StyledDropdownItem } from './styles';

export interface DropdownMenuItem {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
}

interface DropdownMenuProps {
  trigger: ReactNode;
  items: DropdownMenuItem[];
  align?: 'left' | 'right';
  /** Accessible name for the trigger button (required when the trigger is icon-only). */
  ariaLabel?: string;
}

export function DropdownMenu({ trigger, items, align = 'right', ariaLabel }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const { pathname } = useLocation();

  const focusTrigger = useCallback(() => {
    dropdownRef.current?.querySelector<HTMLButtonElement>('button')?.focus();
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleItemClick = useCallback((onClick?: () => void) => {
    if (onClick) {
      onClick();
      setIsOpen(false);
    }
  }, []);

  useClickOutside(dropdownRef, close, isOpen);

  // Instantly collapse the dropdown when we bounce back (e.g. from swipe back navigation)
  useEffect(() => {
    // Use timeout to prevent synchronous cascading renders warning
    const timer = setTimeout(() => setIsOpen(false), 0);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Move focus to the first enabled item when the menu opens via keyboard.
  useEffect(() => {
    if (!isOpen) return;
    const firstEnabled = itemRefs.current.find((el) => el && !el.disabled);

    firstEnabled?.focus();
  }, [isOpen]);

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    // Enter/Space are left to the native button click (which toggles open/closed);
    // intercepting them here with preventDefault would suppress that click and make
    // the trigger open-only. Arrow keys open the menu and focus the first item.
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const handleMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Menu-specific keys; arrow / Home / End navigation is shared with Tabs.
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      focusTrigger();

      return;
    }

    if (e.key === 'Tab') {
      close();

      return;
    }

    moveRovingFocus(itemRefs.current, e, { orientation: 'vertical' });
  };

  return (
    <StyledDropdown ref={dropdownRef}>
      <Button
        $variant="ghost"
        onClick={toggleDropdown}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
      >
        {trigger}
      </Button>
      {isOpen && (
        <StyledDropdownContent
          $align={align}
          role="menu"
          aria-label={ariaLabel}
          onKeyDown={handleMenuKeyDown}
        >
          {items.map((item, index) => (
            <StyledDropdownItem
              type="button"
              key={index}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              role="menuitem"
              disabled={item.disabled}
              onClick={item.onClick ? () => handleItemClick(item.onClick) : undefined}
              $danger={item.danger}
              $interactive={!!item.onClick}
              $disabled={item.disabled}
            >
              {item.icon && (
                <span className="icon" aria-hidden="true">
                  {item.icon}
                </span>
              )}
              <span className="label">{item.label}</span>
            </StyledDropdownItem>
          ))}
        </StyledDropdownContent>
      )}
    </StyledDropdown>
  );
}

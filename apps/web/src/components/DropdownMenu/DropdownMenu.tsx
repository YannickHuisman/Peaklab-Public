import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@components/Button';

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
}

export function DropdownMenu({ trigger, items, align = 'right' }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleItemClick = useCallback((onClick?: () => void) => {
    if (onClick) {
      onClick();
      setIsOpen(false);
    }
  }, []);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (isOpen && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    },
    [isOpen]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <StyledDropdown ref={dropdownRef}>
      <Button $variant="ghost" onClick={toggleDropdown}>
        {trigger}
      </Button>
      {isOpen && (
        <StyledDropdownContent $align={align}>
          {items.map((item, index) => (
            <StyledDropdownItem
              key={index}
              onClick={item.onClick ? () => handleItemClick(item.onClick) : undefined}
              $danger={item.danger}
              $interactive={!!item.onClick}
              $disabled={item.disabled}
            >
              {item.icon && <span className="icon">{item.icon}</span>}
              <span className="label">{item.label}</span>
            </StyledDropdownItem>
          ))}
        </StyledDropdownContent>
      )}
    </StyledDropdown>
  );
}

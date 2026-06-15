import { useId, useRef, useState } from 'react';

import { Icons } from '@components/Icons';
import { useClickOutside } from '@hooks/useClickOutside';

import { theme } from '@package/ui';

import {
  StyledChevron,
  StyledMultiSelectDropdown,
  StyledMultiSelectLabel,
  StyledMultiSelectOption,
  StyledMultiSelectTrigger,
  StyledMultiSelectTriggerText,
  StyledMultiSelectWrapper,
} from './styles';

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  label?: string;
  options: MultiSelectOption[];
  value: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  error?: string;
}

export function MultiSelect({
  label,
  options,
  value,
  onChange,
  placeholder = 'Selecteer...',
  error,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const errorId = useId();

  useClickOutside(wrapperRef, () => setOpen(false), open);

  const toggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const triggerLabel =
    value.length === 0
      ? undefined
      : value.length === 1
        ? options.find((o) => o.value === value[0])?.label
        : `${value.length} geselecteerd`;

  return (
    <StyledMultiSelectWrapper ref={wrapperRef}>
      {label && <StyledMultiSelectLabel id={labelId}>{label}</StyledMultiSelectLabel>}
      <div style={{ position: 'relative' }}>
        <StyledMultiSelectTrigger
          type="button"
          $open={open}
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-labelledby={label ? labelId : undefined}
          aria-label={label ? undefined : placeholder}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        >
          <StyledMultiSelectTriggerText $placeholder={!triggerLabel}>
            {triggerLabel ?? placeholder}
          </StyledMultiSelectTriggerText>
          <StyledChevron $open={open} aria-hidden="true">
            <Icons.ChevronDown size="xs" color={theme.colors.text.muted} />
          </StyledChevron>
        </StyledMultiSelectTrigger>

        {open && (
          <StyledMultiSelectDropdown role="group" aria-label={label ?? placeholder}>
            {options.map((option) => {
              const checked = value.includes(option.value);

              return (
                <StyledMultiSelectOption key={option.value} $checked={checked}>
                  <input type="checkbox" checked={checked} onChange={() => toggle(option.value)} />
                  {option.label}
                </StyledMultiSelectOption>
              );
            })}
          </StyledMultiSelectDropdown>
        )}
      </div>
      {error && (
        <span className="error" id={errorId} role="alert">
          {error}
        </span>
      )}
    </StyledMultiSelectWrapper>
  );
}

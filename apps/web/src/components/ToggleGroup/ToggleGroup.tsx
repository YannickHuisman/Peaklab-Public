import { StyledToggleGroupButton, StyledToggleGroupWrapper } from './styles';

export interface ToggleOption<T extends string = string> {
  value: T;
  label: string;
}

interface ToggleGroupProps<T extends string = string> {
  options: ToggleOption<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
}

export function ToggleGroup<T extends string = string>({
  options,
  value,
  onChange,
  disabled,
}: ToggleGroupProps<T>) {
  return (
    <StyledToggleGroupWrapper role="group">
      {options.map((option) => (
        <StyledToggleGroupButton
          key={option.value}
          type="button"
          $active={value === option.value}
          aria-pressed={value === option.value}
          disabled={disabled}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </StyledToggleGroupButton>
      ))}
    </StyledToggleGroupWrapper>
  );
}

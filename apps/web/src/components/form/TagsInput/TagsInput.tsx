import { useRef, useState } from 'react';

import {
  StyledTagChip,
  StyledTagHint,
  StyledTagInput,
  StyledTagRemove,
  StyledTagsWrapper,
} from './styles';

const MAX_TAGS = 8;
const MAX_TAG_LENGTH = 30;

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
}

export function TagsInput({ value, onChange }: TagsInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (raw: string) => {
    const tag = raw.trim().toLowerCase().replace(/\s+/g, ' ');

    if (!tag || tag.length > MAX_TAG_LENGTH) return;
    if (value.includes(tag)) return;
    if (value.length >= MAX_TAGS) return;

    onChange([...value, tag]);
    setInputValue('');
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && inputValue === '' && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const handleBlur = () => {
    setFocused(false);
    if (inputValue.trim()) {
      addTag(inputValue);
    }
  };

  const placeholder = value.length === 0 ? 'bijv. hardlopen, krachttraining...' : '';

  return (
    <div>
      <StyledTagsWrapper $focused={focused} onClick={() => inputRef.current?.focus()}>
        {value.map((tag, i) => (
          <StyledTagChip key={tag}>
            {tag}
            <StyledTagRemove
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(i);
              }}
              title={`Verwijder tag "${tag}"`}
              aria-label={`Verwijder tag "${tag}"`}
            >
              ×
            </StyledTagRemove>
          </StyledTagChip>
        ))}

        {value.length < MAX_TAGS && (
          <StyledTagInput
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={handleBlur}
            placeholder={placeholder}
            aria-label="Voeg een tag toe"
          />
        )}
      </StyledTagsWrapper>

      <StyledTagHint>
        Druk op Enter of komma om een tag toe te voegen · max {MAX_TAGS} tags
      </StyledTagHint>
    </div>
  );
}

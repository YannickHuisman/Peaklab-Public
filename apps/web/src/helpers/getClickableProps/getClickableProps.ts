import type { KeyboardEvent } from 'react';

/**
 * Returns the props that make a non-button element (e.g. a clickable card or
 * row) operable by keyboard: it gains button semantics, becomes focusable, and
 * activates on Enter/Space — satisfying WCAG 2.1.1 (Keyboard) and 4.1.2.
 *
 * Use on elements that aren't already a <button>/<a>. Do not use on elements
 * that contain their own focusable controls (nested interactive content).
 */
export function getClickableProps<T extends HTMLElement = HTMLElement>(
  onActivate: () => void,
  label?: string
) {
  return {
    role: 'button' as const,
    tabIndex: 0,
    'aria-label': label,
    onClick: onActivate,
    onKeyDown: (e: KeyboardEvent<T>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onActivate();
      }
    },
  };
}

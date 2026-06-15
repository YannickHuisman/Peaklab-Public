import type { KeyboardEvent } from 'react';

type Orientation = 'horizontal' | 'vertical' | 'both';

interface RovingFocusOptions {
  /** Which arrow keys navigate. Defaults to 'vertical' (Up/Down). */
  orientation?: Orientation;
  /** Wrap from last→first and first→last. Defaults to true. */
  loop?: boolean;
}

/**
 * Roving-tabindex keyboard navigation shared by menus and tab lists: moves DOM
 * focus to the next/previous/first/last item among `items` based on the pressed
 * arrow / Home / End key, relative to the currently focused element.
 *
 * Disabled items are skipped. Returns true and calls preventDefault when it
 * handled the key, so callers can let other keys (Escape, Tab, …) fall through.
 */
export function moveRovingFocus(
  items: (HTMLElement | null)[],
  e: KeyboardEvent,
  { orientation = 'vertical', loop = true }: RovingFocusOptions = {}
): boolean {
  const focusable = items.filter(
    (el): el is HTMLElement => !!el && !(el as HTMLButtonElement).disabled
  );

  if (focusable.length === 0) return false;

  const nextKeys = orientation === 'horizontal' ? ['ArrowRight'] : ['ArrowDown'];
  const prevKeys = orientation === 'horizontal' ? ['ArrowLeft'] : ['ArrowUp'];

  if (orientation === 'both') {
    nextKeys.push('ArrowRight');
    prevKeys.push('ArrowLeft');
  }

  const current = focusable.indexOf(document.activeElement as HTMLElement);

  let target: number;

  if (nextKeys.includes(e.key)) {
    target = current + 1;
  } else if (prevKeys.includes(e.key)) {
    target = current - 1;
  } else if (e.key === 'Home') {
    target = 0;
  } else if (e.key === 'End') {
    target = focusable.length - 1;
  } else {
    return false;
  }

  target = loop
    ? (target + focusable.length) % focusable.length
    : Math.max(0, Math.min(focusable.length - 1, target));

  e.preventDefault();
  focusable[target].focus();

  return true;
}

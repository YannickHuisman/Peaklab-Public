import { type RefObject, useEffect, useRef } from 'react';

/**
 * Invokes `onOutside` when a pointer press lands outside the referenced element.
 * Pass `enabled` (typically the open state) so the listener is only attached
 * while it's relevant — e.g. closing a dropdown, popover or menu on outside click.
 *
 * `onOutside` is read through a ref, so callers can pass an inline callback
 * without causing the listener to detach/reattach on every render.
 */
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  onOutside: () => void,
  enabled = true
) {
  const onOutsideRef = useRef(onOutside);

  useEffect(() => {
    onOutsideRef.current = onOutside;
  }, [onOutside]);

  useEffect(() => {
    if (!enabled) return;

    const handleMouseDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOutsideRef.current();
      }
    };

    document.addEventListener('mousedown', handleMouseDown);

    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [ref, enabled]);
}

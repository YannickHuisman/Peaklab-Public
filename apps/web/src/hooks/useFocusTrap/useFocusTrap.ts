import { type RefObject, useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Dialog focus management for an open overlay (WCAG 2.1.2 / 2.4.3):
 * - moves focus into `ref` when it opens (first focusable element, else the container),
 * - traps Tab / Shift+Tab within `ref`,
 * - closes on Escape,
 * - locks body scroll while open,
 * - restores focus to the previously-focused element on close.
 *
 * `onClose` is read through a ref so an inline handler doesn't re-run the effect
 * (which would steal focus mid-interaction).
 */
export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  isOpen: boolean,
  onClose: () => void
) {
  const onCloseRef = useRef(onClose);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current();

        return;
      }

      if (e.key !== 'Tab') return;

      const focusable = ref.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);

      if (!focusable || focusable.length === 0) {
        e.preventDefault();

        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    const focusable = ref.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);

    if (focusable && focusable.length > 0) {
      focusable[0].focus();
    } else {
      ref.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
      previouslyFocused.current?.focus?.();
    };
  }, [isOpen, ref]);
}

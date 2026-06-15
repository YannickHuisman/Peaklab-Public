import { useCallback, useRef } from 'react';

const SCROLL_MARGIN = 48;

export function useDirectionalScroll<T extends HTMLElement = HTMLElement>() {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(T | null)[]>([]);
  const prevIndexRef = useRef<number>(0);

  const scrollToIndex = useCallback((index: number) => {
    const container = containerRef.current;
    const item = itemRefs.current[index];

    if (!container || !item) return;

    const containerRect = container.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const offsetLeft = itemRect.left - containerRect.left + container.scrollLeft;

    const goingForward = index >= prevIndexRef.current;
    const target = goingForward
      ? offsetLeft - SCROLL_MARGIN
      : offsetLeft - containerRect.width + itemRect.width + SCROLL_MARGIN;

    prevIndexRef.current = index;
    container.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }, []);

  return { containerRef, itemRefs, scrollToIndex };
}

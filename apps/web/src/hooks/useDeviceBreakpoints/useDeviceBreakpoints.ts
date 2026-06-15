import { useEffect, useMemo, useRef, useState } from 'react';

export interface DeviceBreakpoints {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
}

const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
};

const DEBOUNCE_MS = 150;

export function useDeviceBreakpoints(): DeviceBreakpoints {
  const [width, setWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleResize = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setWidth(window.innerWidth);
      }, DEBOUNCE_MS);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return useMemo(
    () => ({
      isMobile: width < BREAKPOINTS.mobile,
      isTablet: width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet,
      isDesktop: width >= BREAKPOINTS.tablet,
      width,
    }),
    [width]
  );
}

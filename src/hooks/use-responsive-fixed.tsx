
import { useState, useEffect } from 'react';

export type BreakpointKey = 'mobile' | 'tablet' | 'desktop';

export interface ResponsiveConfig {
  mobile: string;
  tablet: string;
  desktop: string;
}

export const useResponsive = () => {
  const [breakpoint, setBreakpoint] = useState<BreakpointKey>('desktop');

  useEffect(() => {
    const getBreakpoint = (): BreakpointKey => {
      if (typeof window === 'undefined') return 'desktop';
      
      const width = window.innerWidth;
      if (width < 768) return 'mobile';
      if (width < 1024) return 'tablet';
      return 'desktop';
    };

    const handleResize = () => {
      const newBreakpoint = getBreakpoint();
      setBreakpoint(current => {
        // Only update if the breakpoint actually changed
        if (current !== newBreakpoint) {
          return newBreakpoint;
        }
        return current;
      });
    };

    // Set initial breakpoint
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty dependency array - this effect should only run once

  const getResponsiveValue = <T,>(config: Record<BreakpointKey, T>): T => {
    return config[breakpoint];
  };

  return {
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop',
    getResponsiveValue,
  };
};

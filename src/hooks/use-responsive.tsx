
import { useState, useEffect } from 'react';

interface BreakpointOptions {
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

const defaultBreakpoints: Required<BreakpointOptions> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export function useResponsive(customBreakpoints?: BreakpointOptions) {
  const breakpoints = { ...defaultBreakpoints, ...customBreakpoints };
  
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  const [currentBreakpoint, setCurrentBreakpoint] = useState<keyof typeof breakpoints>('sm');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({ width, height });

      // Determine current breakpoint
      if (width >= breakpoints.xl) {
        setCurrentBreakpoint('xl');
      } else if (width >= breakpoints.lg) {
        setCurrentBreakpoint('lg');
      } else if (width >= breakpoints.md) {
        setCurrentBreakpoint('md');
      } else {
        setCurrentBreakpoint('sm');
      }
    };

    handleResize(); // Set initial values
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoints]);

  return {
    screenSize,
    currentBreakpoint,
    isMobile: screenSize.width < breakpoints.md,
    isTablet: screenSize.width >= breakpoints.md && screenSize.width < breakpoints.lg,
    isDesktop: screenSize.width >= breakpoints.lg,
    isSmall: currentBreakpoint === 'sm',
    isMedium: currentBreakpoint === 'md',
    isLarge: currentBreakpoint === 'lg',
    isExtraLarge: currentBreakpoint === 'xl',
  };
}

export default useResponsive;

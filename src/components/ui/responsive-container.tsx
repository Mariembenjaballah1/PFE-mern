
import React from 'react';
import { cn } from '@/lib/utils';
import useResponsive from '@/hooks/use-responsive';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  mobileClassName?: string;
  tabletClassName?: string;
  desktopClassName?: string;
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className,
  mobileClassName,
  tabletClassName,
  desktopClassName,
}) => {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  const responsiveClass = cn(
    className,
    isMobile && mobileClassName,
    isTablet && tabletClassName,
    isDesktop && desktopClassName
  );

  return (
    <div className={responsiveClass}>
      {children}
    </div>
  );
};

export default ResponsiveContainer;

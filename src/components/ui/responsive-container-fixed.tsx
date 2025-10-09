
import React from 'react';
import { useResponsive, type ResponsiveConfig } from '@/hooks/use-responsive-fixed';
import { cn } from '@/lib/utils';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  mobileClassName?: string;
  tabletClassName?: string;
  desktopClassName?: string;
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  mobileClassName = '',
  tabletClassName = '',
  desktopClassName = '',
}) => {
  const { getResponsiveValue } = useResponsive();

  const responsiveClassName = getResponsiveValue({
    mobile: mobileClassName,
    tablet: tabletClassName,
    desktop: desktopClassName,
  });

  return (
    <div className={cn(className, responsiveClassName)}>
      {children}
    </div>
  );
};

export default ResponsiveContainer;

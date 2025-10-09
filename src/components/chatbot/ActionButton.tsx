
import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'secondary';
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  icon: Icon,
  onClick,
  variant = 'outline'
}) => {
  return (
    <Button
      variant={variant}
      size="sm"
      onClick={onClick}
      className="flex items-center gap-2 text-xs"
    >
      <Icon className="h-3 w-3" />
      {label}
    </Button>
  );
};

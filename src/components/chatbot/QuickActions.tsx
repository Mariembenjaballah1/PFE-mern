
import React from 'react';
import { Plus, Search, Calendar, FileText, Settings, Users } from 'lucide-react';
import { ActionButton } from './ActionButton';
import { useNavigate } from 'react-router-dom';

interface QuickActionsProps {
  onAction: (action: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onAction }) => {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Add Asset',
      icon: Plus,
      action: () => {
        navigate('/assets');
        onAction('Navigate to Assets page to add new asset');
      }
    },
    {
      label: 'Search Assets',
      icon: Search,
      action: () => {
        navigate('/assets');
        onAction('Navigate to Assets page for searching');
      }
    },
    {
      label: 'Schedule Maintenance',
      icon: Calendar,
      action: () => {
        navigate('/maintenance');
        onAction('Navigate to Maintenance page to schedule tasks');
      }
    },
    {
      label: 'View Reports',
      icon: FileText,
      action: () => {
        navigate('/reports');
        onAction('Navigate to Reports page for analytics');
      }
    },
    {
      label: 'Manage Users',
      icon: Users,
      action: () => {
        navigate('/users');
        onAction('Navigate to User Management page');
      }
    },
    {
      label: 'Settings',
      icon: Settings,
      action: () => {
        navigate('/settings');
        onAction('Navigate to Settings page');
      }
    }
  ];

  return (
    <div className="border-t p-3">
      <p className="text-xs text-muted-foreground mb-2">Quick Actions:</p>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action, index) => (
          <ActionButton
            key={index}
            label={action.label}
            icon={action.icon}
            onClick={action.action}
          />
        ))}
      </div>
    </div>
  );
};

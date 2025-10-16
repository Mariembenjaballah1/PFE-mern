
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Project, Asset } from '@/types/asset';

interface ProjectStatusBadgeProps {
  status: Project['status'];
}

export const ProjectStatusBadge: React.FC<ProjectStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'active':
      return <Badge variant="default" className="bg-green-500">Active</Badge>;
    case 'on-hold':
      return <Badge variant="outline" className="text-yellow-500 border-yellow-500">On Hold</Badge>;
    case 'completed':
      return <Badge variant="outline" className="text-blue-500 border-blue-500">Completed</Badge>;
    case 'cancelled':
      return <Badge variant="outline" className="text-red-500 border-red-500">Cancelled</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

interface ProjectPriorityBadgeProps {
  priority: Project['priority'];
}

export const ProjectPriorityBadge: React.FC<ProjectPriorityBadgeProps> = ({ priority }) => {
  switch (priority) {
    case 'critical':
      return <Badge variant="destructive">Critical</Badge>;
    case 'high':
      return <Badge variant="outline" className="text-orange-500 border-orange-500">High</Badge>;
    case 'medium':
      return <Badge variant="outline" className="text-blue-500 border-blue-500">Medium</Badge>;
    case 'low':
      return <Badge variant="outline" className="text-green-500 border-green-500">Low</Badge>;
    default:
      return <Badge variant="outline">{priority}</Badge>;
  }
};

interface AssetStatusBadgeProps {
  status: Asset['status'];
}

export const AssetStatusBadge: React.FC<AssetStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'operational':
      return <Badge variant="outline" className="text-green-500 border-green-500">Operational</Badge>;
    case 'maintenance':
      return <Badge variant="outline" className="text-yellow-500 border-yellow-500">Maintenance</Badge>;
    case 'repair':
      return <Badge variant="outline" className="text-red-500 border-red-500">Repair</Badge>;
    case 'retired':
      return <Badge variant="outline" className="text-gray-500 border-gray-500">Retired</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

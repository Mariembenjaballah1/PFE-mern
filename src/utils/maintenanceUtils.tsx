
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CircleCheck, CircleX, CircleAlert, Flag } from 'lucide-react';

/**
 * Returns a Badge component styled according to the task status
 */
export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'scheduled':
      return <Badge variant="outline" className="border-blue-500 text-blue-500 flex items-center gap-1">
        <CircleAlert className="h-3 w-3" /> Scheduled
      </Badge>;
    case 'in-progress':
      return <Badge variant="outline" className="border-orange-500 text-orange-500 flex items-center gap-1">
        <Flag className="h-3 w-3" /> In Progress
      </Badge>;
    case 'completed':
      return <Badge variant="outline" className="border-green-500 text-green-500 flex items-center gap-1">
        <CircleCheck className="h-3 w-3" /> Completed
      </Badge>;
    case 'overdue':
      return <Badge variant="outline" className="border-red-500 text-red-500 flex items-center gap-1">
        <CircleX className="h-3 w-3" /> Overdue
      </Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

/**
 * Returns a Badge component styled according to the task priority
 */
export const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'low':
      return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">Low</Badge>;
    case 'medium':
      return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">Medium</Badge>;
    case 'high':
      return <Badge className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20">High</Badge>;
    case 'critical':
      return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">Critical</Badge>;
    default:
      return <Badge>Unknown</Badge>;
  }
};

/**
 * Returns a color class based on priority
 */
export const getPriorityColorClass = (priority: string): string => {
  switch (priority) {
    case 'critical': return 'bg-red-500';
    case 'high': return 'bg-orange-500'; 
    case 'medium': return 'bg-yellow-500';
    case 'low': 
    default: return 'bg-blue-500';
  }
};

/**
 * Format a date string to a localized date
 */
export const formatDateTime = (dateTime: string): string => {
  const date = new Date(dateTime);
  return date.toLocaleDateString();
};

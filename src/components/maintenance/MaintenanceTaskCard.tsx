
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarClock, Clock, Settings, Edit, Trash2, Eye } from 'lucide-react';
import { MaintenanceTask } from '@/types/asset';
import { getStatusBadge, getPriorityBadge, getPriorityColorClass, formatDateTime } from '@/utils/maintenanceUtils';

interface MaintenanceTaskCardProps {
  task: MaintenanceTask;
  onViewDetails?: (taskId: string) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  compact?: boolean;
}

const MaintenanceTaskCard: React.FC<MaintenanceTaskCardProps> = ({ 
  task, 
  onViewDetails, 
  onEdit, 
  onDelete, 
  compact = false 
}) => {
  const handleViewDetails = () => {
    console.log('View Details clicked for task:', task);
    console.log('Task ID:', task._id);
    console.log('OnViewDetails function:', onViewDetails);
    
    if (onViewDetails && task._id) {
      onViewDetails(task._id);
    } else {
      console.error('Cannot view details: missing onViewDetails function or task ID');
    }
  };
  
  // Helper function to get assignedTo name
  const getAssignedToName = (): string => {
    if (!task.assignedTo) return 'Unassigned';
    if (typeof task.assignedTo === 'string') return task.assignedTo;
    return task.assignedTo.name || 'Unassigned';
  };

  // Helper function to get asset name
  const getAssetName = (): string => {
    if (!task.asset) return 'Unknown Asset';
    if (typeof task.asset === 'object' && 'name' in task.asset) {
      return task.asset.name;
    }
    return 'Unknown Asset';
  };
  
  return (
    <Card key={task._id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className={`h-1 w-full ${getPriorityColorClass(task.priority)}`} />
      <CardContent className={compact ? "p-4" : "p-6"}>
        <div className="flex flex-wrap justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-lg">{getAssetName()}</h3>
            </div>
            {!compact && <p className="text-muted-foreground">{task.description}</p>}
          </div>
          <div className="space-x-2">
            {getStatusBadge(task.status)}
            {getPriorityBadge(task.priority)}
          </div>
        </div>
        
        {!compact && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-muted-foreground" />
              <span>
                Scheduled: {formatDateTime(task.scheduledDate)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-muted-foreground" />
              <span>
                Type: {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                Est. Time: {task.estimatedHours} {task.estimatedHours === 1 ? 'hour' : 'hours'}
              </span>
            </div>
          </div>
        )}
        
        {compact ? (
          <div className="mt-2 text-xs text-muted-foreground">
            {formatDateTime(task.scheduledDate)}
          </div>
        ) : (
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm">
              Assigned to: <span className="font-medium">{getAssignedToName()}</span>
            </div>
            <div className="flex space-x-2">
              {onEdit && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onEdit}
                  className="hover:bg-blue-50"
                >
                  <Edit className="h-4 w-4 mr-1" /> Edit
                </Button>
              )}
              {onDelete && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onDelete}
                  className="hover:bg-red-50 text-red-500 border-red-200"
                >
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              )}
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleViewDetails}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!task._id}
              >
                <Eye className="h-4 w-4 mr-1" /> View Details
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MaintenanceTaskCard;

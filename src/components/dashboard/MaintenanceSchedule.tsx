
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, isAfter, isBefore, isToday, addDays } from 'date-fns';
import { CheckCircle, AlertCircle, Clock, CalendarClock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MaintenanceTask {
  _id: string;
  asset: {
    _id: string;
    name: string;
  };
  type: string;
  priority: string;
  status: string;
  scheduledDate: string;
  assignedTo?: {
    name: string;
  } | null;
}

interface MaintenanceScheduleProps {
  maintenanceData?: MaintenanceTask[];
}

const MaintenanceSchedule: React.FC<MaintenanceScheduleProps> = ({ maintenanceData = [] }) => {
  const navigate = useNavigate();
  
  // If no data provided, use sample maintenance tasks
  const tasks = maintenanceData.length > 0 ? maintenanceData : [
    {
      _id: 'mt1',
      asset: {
        _id: 'a1',
        name: 'Database Server',
      },
      type: 'preventive',
      priority: 'high',
      status: 'scheduled',
      scheduledDate: addDays(new Date(), 1).toISOString(),
      assignedTo: {
        name: 'John Technician',
      },
    },
    {
      _id: 'mt2',
      asset: {
        _id: 'a2',
        name: 'Web Server Cluster',
      },
      type: 'corrective',
      priority: 'medium',
      status: 'in-progress',
      scheduledDate: new Date().toISOString(),
      assignedTo: {
        name: 'Alice Engineer',
      },
    },
    {
      _id: 'mt3',
      asset: {
        _id: 'a3',
        name: 'Network Switch',
      },
      type: 'preventive',
      priority: 'low',
      status: 'scheduled',
      scheduledDate: addDays(new Date(), 3).toISOString(),
      assignedTo: {
        name: 'Bob Specialist',
      },
    },
  ];
  
  const getStatusIcon = (task: MaintenanceTask) => {
    const scheduledDate = new Date(task.scheduledDate);
    
    if (task.status === 'completed') {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (task.status === 'in-progress') {
      return <Clock className="h-5 w-5 text-blue-500" />;
    } else if (isToday(scheduledDate)) {
      return <AlertCircle className="h-5 w-5 text-amber-500" />;
    } else if (isBefore(scheduledDate, new Date())) {
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    } else {
      return <CalendarClock className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Low</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };
  
  const handleTaskClick = (id: string) => {
    navigate(`/maintenance/details/${id}`);
  };

  const getAssignedToName = (task: MaintenanceTask) => {
    return task.assignedTo?.name || 'Unassigned';
  };

  return (
    <Card className="card-gradient animate-scale-in">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Upcoming Maintenance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.slice(0, 5).map((task, index) => (
            <div 
              key={task._id} 
              className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer animate-fade-in transition-colors"
              style={{animationDelay: `${index * 100}ms`}}
              onClick={() => handleTaskClick(task._id)}
            >
              <div className="flex items-center gap-3">
                {getStatusIcon(task)}
                <div>
                  <h4 className="font-medium">{task.asset?.name || 'Unknown Asset'}</h4>
                  <p className="text-xs text-muted-foreground">
                    {task.type.charAt(0).toUpperCase() + task.type.slice(1)} • {format(new Date(task.scheduledDate), 'MMM d, yyyy')} • {getAssignedToName(task)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getPriorityBadge(task.priority)}
              </div>
            </div>
          ))}
          
          {tasks.length === 0 && (
            <p className="text-center text-muted-foreground py-8">No upcoming maintenance tasks scheduled</p>
          )}
          
          {tasks.length > 5 && (
            <div className="text-center pt-2">
              <span className="text-sm text-muted-foreground">
                +{tasks.length - 5} more tasks
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MaintenanceSchedule;

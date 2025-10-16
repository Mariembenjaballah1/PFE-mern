
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { MaintenanceTask } from '@/types/asset';
import { useToast } from '@/hooks/use-toast';
import { fetchMaintenanceTasks, updateMaintenanceTask } from '@/services/maintenanceApi';
import { Eye, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TechnicianNotificationsPage: React.FC = () => {
  const [selectedTask, setSelectedTask] = useState<MaintenanceTask | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Get current user ID from localStorage
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setCurrentUserId(user._id);
      }
    } catch (error) {
      console.error('Error getting current user:', error);
    }
  }, []);

  // Fetch maintenance tasks assigned to current technician
  const { data: allTasks = [], isLoading, refetch } = useQuery({
    queryKey: ['maintenance-tasks', currentUserId],
    queryFn: fetchMaintenanceTasks,
    enabled: !!currentUserId
  });

  // Filter tasks assigned to current technician
  const tasks = (allTasks as MaintenanceTask[]).filter((task: MaintenanceTask) => {
    const assignedToId = typeof task.assignedTo === 'string' 
      ? task.assignedTo 
      : task.assignedTo?._id;
    return assignedToId === currentUserId;
  });

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'critical': return 'text-red-500 bg-red-100';
      case 'high': return 'text-orange-500 bg-orange-100';
      case 'medium': return 'text-yellow-500 bg-yellow-100';
      case 'low': return 'text-blue-500 bg-blue-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'scheduled': return 'border-blue-400 bg-blue-50 text-blue-600';
      case 'in-progress': return 'border-yellow-400 bg-yellow-50 text-yellow-600';
      case 'completed': return 'border-green-400 bg-green-50 text-green-600';
      case 'overdue': return 'border-red-400 bg-red-50 text-red-600';
      default: return 'border-gray-400 bg-gray-50 text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleMarkAsComplete = (task: MaintenanceTask) => {
    setSelectedTask(task);
    setIsConfirmDialogOpen(true);
  };

  const confirmComplete = async () => {
    if (selectedTask && selectedTask._id) {
      try {
        await updateMaintenanceTask({ id: selectedTask._id, status: 'completed' });
        
        toast({
          title: 'Task Completed',
          description: `Maintenance task for ${getAssetName(selectedTask)} marked as completed.`,
        });
        
        setIsConfirmDialogOpen(false);
        refetch(); // Refresh the tasks list
      } catch (error) {
        console.error('Error completing task:', error);
        toast({
          title: 'Error',
          description: 'Failed to mark task as completed. Please try again.',
          variant: 'destructive'
        });
      }
    }
  };

  const handleViewDetails = (taskId: string) => {
    navigate(`/maintenance/details/${taskId}`);
  };

  const getAssetName = (task: MaintenanceTask) => {
    if (typeof task.asset === 'object' && task.asset?.name) {
      return task.asset.name;
    }
    return 'Unknown Asset';
  };

  if (isLoading) {
    return (
      <DashboardLayout userRole="TECHNICIAN">
        <div className="space-y-6 w-full">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Assigned Maintenance Tasks</h2>
            <p className="text-muted-foreground">Loading your maintenance assignments...</p>
          </div>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="TECHNICIAN">
      <div className="space-y-6 w-full">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Assigned Maintenance Tasks</h2>
          <p className="text-muted-foreground">Manage your maintenance assignments and notifications.</p>
        </div>

        <div className="grid gap-4 w-full">
          {tasks.map((task) => (
            <Card key={task._id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{getAssetName(task)}</h3>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </Badge>
                      <Badge variant="outline" className={getPriorityColor(task.priority)}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-4">{task.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Type:</span> {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                      </div>
                      <div>
                        <span className="font-medium">Estimated hours:</span> {task.estimatedHours}
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">Scheduled:</span> {formatDate(task.scheduledDate)}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(task._id!)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {task.status !== 'completed' && (
                      <Button
                        onClick={() => handleMarkAsComplete(task)}
                        variant="default"
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Complete
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {tasks.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No maintenance tasks currently assigned to you.
              </CardContent>
            </Card>
          )}
        </div>

        <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Complete Maintenance Task?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to mark this task as complete? This action will notify the administrator.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmComplete}>
                Mark as Complete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default TechnicianNotificationsPage;

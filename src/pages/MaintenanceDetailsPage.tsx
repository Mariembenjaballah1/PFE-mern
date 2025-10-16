
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchMaintenanceTaskById, updateMaintenanceTask, deleteMaintenanceTask } from '@/services/maintenanceApi';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CalendarClock, 
  Clock, 
  Settings, 
  ArrowLeft, 
  Wrench, 
  AlertTriangle,
  Pencil,
  CheckCircle,
  XCircle,
  AlertOctagon,
  Edit,
  Trash2
} from 'lucide-react';
import { formatDateTime, getStatusBadge, getPriorityBadge } from '@/utils/maintenanceUtils';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PlanMaintenanceForm from '@/components/maintenance/PlanMaintenanceForm';
import { Asset } from '@/types/asset';

const MaintenanceDetailsPage: React.FC = () => {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  console.log('=== MAINTENANCE DETAILS PAGE - ENHANCED DEBUG VERSION ===');
  console.log('Raw params object:', params);
  console.log('Extracted ID:', id);
  console.log('Current URL:', window.location.href);

  // Get user info from localStorage to check permissions
  const userStr = localStorage.getItem('user');
  const currentUser = userStr ? JSON.parse(userStr) : null;
  console.log('Current user:', currentUser);
  console.log('User role:', currentUser?.role);
  console.log('Can update maintenance:', currentUser?.role === 'ADMIN' || currentUser?.role === 'TECHNICIAN');

  // Enhanced validation for ID
  const isValidId = id && typeof id === 'string' && id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id);
  
  console.log('ID validation result:', {
    id,
    isString: typeof id === 'string',
    hasCorrectLength: id?.length === 24,
    isHexFormat: id ? /^[0-9a-fA-F]{24}$/.test(id) : false,
    isValid: isValidId
  });

  // Fetch maintenance task details with improved error handling
  const { data: task, isLoading, error, refetch } = useQuery({
    queryKey: ['maintenance', id],
    queryFn: async () => {
      if (!isValidId) {
        throw new Error('Invalid maintenance task ID format');
      }
      
      console.log('Fetching maintenance task for ID:', id);
      return await fetchMaintenanceTaskById(id);
    },
    retry: (failureCount, error: any) => {
      // Don't retry on 404 or validation errors
      if (error?.message?.includes('not found') || error?.message?.includes('Invalid')) {
        return false;
      }
      return failureCount < 2;
    },
    enabled: isValidId
  });

  // Handle invalid ID case
  if (!isValidId) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigate('/maintenance')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Invalid Maintenance Task ID</h1>
          </div>
          <Card>
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Invalid Task ID</h3>
              <p className="mb-4">
                The maintenance task ID format is invalid. Please navigate to the task from the maintenance list.
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Received ID: {id || 'undefined'}
              </p>
              <div className="space-y-2">
                <Button onClick={() => navigate('/maintenance')}>
                  Return to Maintenance List
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Refresh Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const handleGoBack = () => {
    navigate('/maintenance');
  };

  const updateTaskStatus = async (newStatus: 'pending' | 'in-progress' | 'completed' | 'cancelled' | 'scheduled' | 'overdue') => {
    if (!id) {
      toast({
        title: "Error",
        description: "No task ID available for update",
        variant: "destructive"
      });
      return;
    }

    // Check user permissions
    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'TECHNICIAN')) {
      toast({
        title: "Permission Denied",
        description: `You need ADMIN or TECHNICIAN role to update maintenance tasks. Your current role: ${currentUser?.role || 'Unknown'}`,
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Updating task status:', { id, newStatus, userRole: currentUser.role });
      await updateMaintenanceTask({ id, status: newStatus });
      
      toast({
        title: "Status updated",
        description: `Task status changed to ${newStatus}`,
      });
      
      // Refetch task data and invalidate tasks list
      queryClient.invalidateQueries({ queryKey: ['maintenance', id] });
      queryClient.invalidateQueries({ queryKey: ['maintenance-tasks'] });
    } catch (error: any) {
      console.error('Error updating status:', error);
      console.error('Error response:', error.response?.data);
      toast({
        title: "Update failed",
        description: error.response?.data?.message || "There was an error updating the status.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteTask = async () => {
    if (!id) {
      toast({
        title: "Error",
        description: "No task ID available for deletion",
        variant: "destructive"
      });
      return;
    }

    // Check user permissions for deletion (only ADMIN)
    if (!currentUser || currentUser.role !== 'ADMIN') {
      toast({
        title: "Permission Denied",
        description: `Only ADMIN users can delete maintenance tasks. Your current role: ${currentUser?.role || 'Unknown'}`,
        variant: "destructive"
      });
      return;
    }

    if (window.confirm("Are you sure you want to delete this maintenance task? This action cannot be undone.")) {
      try {
        console.log('Deleting maintenance task:', id);
        await deleteMaintenanceTask(id);
        toast({
          title: "Task deleted",
          description: "Maintenance task has been successfully deleted",
        });
        navigate('/maintenance');
      } catch (error: any) {
        console.error('Error deleting task:', error);
        console.error('Error response:', error.response?.data);
        toast({
          title: "Delete failed",
          description: error.response?.data?.message || "There was an error deleting the task.",
          variant: "destructive"
        });
      }
    }
  };

  // Helper function to safely get asset name with proper Asset type handling
  const getAssetName = (asset: Asset | { _id: string; name: string } | undefined): string => {
    if (!asset) return 'Unknown Asset';
    
    if (typeof asset === 'string') {
      return asset;
    }
    
    if (typeof asset === 'object') {
      // Handle Asset type
      if ('name' in asset && asset.name) {
        return asset.name;
      }
      // Handle simple object type
      if ('name' in asset) {
        return asset.name || 'Unknown Asset';
      }
    }
    
    return 'Unknown Asset';
  };

  // Helper function to safely get assigned to name with proper type handling
  const getAssignedToName = (assignedTo: string | { _id: string; name: string } | undefined): string => {
    if (!assignedTo) return 'Unknown Technician';
    
    if (typeof assignedTo === 'string') {
      return assignedTo;
    }
    
    if (typeof assignedTo === 'object' && 'name' in assignedTo) {
      return assignedTo.name || 'Unknown Technician';
    }
    
    return 'Unknown Technician';
  };

  // Check if user can update tasks
  const canUpdateTasks = currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'TECHNICIAN');
  const canDeleteTasks = currentUser && currentUser.role === 'ADMIN';
  
  // Show loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleGoBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Skeleton className="h-8 w-64" />
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }
  
  // Show error or not found state
  if (error || !task) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleGoBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Maintenance Task Error</h1>
          </div>
          <Card>
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {error?.message?.includes('not found') ? 'Task Not Found' : 'Error Loading Task'}
              </h3>
              <p className="mb-4">
                {error?.message || "There was an error loading the maintenance task details."}
              </p>
              <p className="text-sm text-muted-foreground mb-4">Task ID: {id}</p>
              <div className="space-y-2">
                <Button onClick={handleGoBack}>
                  Return to Maintenance List
                </Button>
                <Button variant="outline" onClick={() => refetch()}>
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleGoBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Maintenance Task Details</h1>
          </div>
          <div className="flex space-x-2">
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
              <Button 
                variant="outline" 
                onClick={() => setEditDialogOpen(true)}
                className="flex items-center gap-2"
                disabled={!canUpdateTasks}
              >
                <Edit className="h-4 w-4" /> Edit Task
              </Button>
              <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Maintenance Task</DialogTitle>
                  <DialogDescription>
                    Update maintenance activity details
                  </DialogDescription>
                </DialogHeader>
                <PlanMaintenanceForm
                  taskId={id}
                  isEditMode={true}
                  onSuccess={() => {
                    setEditDialogOpen(false);
                    queryClient.invalidateQueries({ queryKey: ['maintenance', id] });
                    queryClient.invalidateQueries({ queryKey: ['maintenance-tasks'] });
                  }}
                  onCancel={() => setEditDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 text-red-500 hover:bg-red-50 border-red-200"
              onClick={handleDeleteTask}
              disabled={!canDeleteTasks}
            >
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </div>
        </div>

        {/* Permission Info Card */}
        {!canUpdateTasks && (
          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="text-sm font-medium text-amber-800">
                    Limited Permissions
                  </p>
                  <p className="text-sm text-amber-700">
                    Your role ({currentUser?.role || 'Unknown'}) doesn't allow updating maintenance tasks. 
                    Contact an ADMIN or TECHNICIAN to make changes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl font-bold">
                  {getAssetName(task.asset)}
                </CardTitle>
                <p className="text-muted-foreground">ID: {task._id}</p>
              </div>
              <div className="space-x-2">
                {getStatusBadge(task.status)}
                {getPriorityBadge(task.priority)}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-6">
            <div>
              <h3 className="font-medium mb-2">Description</h3>
              <p>{task.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-b py-4">
              <div className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Scheduled Date</p>
                  <p>{formatDateTime(task.scheduledDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Maintenance Type</p>
                  <p>{task.type.charAt(0).toUpperCase() + task.type.slice(1)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Estimated Duration</p>
                  <p>{task.estimatedHours || task.estimatedDuration || 0} {(task.estimatedHours || task.estimatedDuration || 0) === 1 ? 'hour' : 'hours'}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Technician Information</h3>
              <div className="flex items-center gap-2">
                <Wrench className="h-4 w-4 text-muted-foreground" />
                <span>Assigned to: <strong>{getAssignedToName(task.assignedTo)}</strong></span>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Update Status</h3>
              {canUpdateTasks ? (
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={task.status === 'scheduled' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => updateTaskStatus('scheduled')}
                    disabled={task.status === 'scheduled'}
                  >
                    <CalendarClock className="h-4 w-4 mr-1" /> Scheduled
                  </Button>
                  <Button 
                    variant={task.status === 'in-progress' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => updateTaskStatus('in-progress')}
                    disabled={task.status === 'in-progress'}
                  >
                    <Pencil className="h-4 w-4 mr-1" /> In Progress
                  </Button>
                  <Button 
                    variant={task.status === 'completed' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => updateTaskStatus('completed')}
                    disabled={task.status === 'completed'}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" /> Completed
                  </Button>
                  <Button 
                    variant={task.status === 'overdue' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => updateTaskStatus('overdue')}
                    disabled={task.status === 'overdue'}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    <AlertOctagon className="h-4 w-4 mr-1" /> Mark Overdue
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  You don't have permission to update the status of this maintenance task.
                </p>
              )}
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={handleGoBack}>
                Back to List
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MaintenanceDetailsPage;

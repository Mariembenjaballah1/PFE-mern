import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, User, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/hooks/use-notifications';
import { sendEmail } from '@/services/emailApi';
import { addActivity } from '@/services/activitiesApi';
import { toast } from "@/components/ui/sonner";

interface MaintenanceNotificationProps {
  task: {
    id: string;
    assetName: string;
    assetId: string;
    description: string;
    location: string;
    scheduledDate: string;
    dueDate?: string; // Optional end date
    assignedTo: string;
    status: 'scheduled' | 'in-progress' | 'completed' | 'overdue';
    priority: 'low' | 'medium' | 'high';
  };
  onAccept?: () => void;
  onComplete?: () => void;
}

const MaintenanceNotification: React.FC<MaintenanceNotificationProps> = ({ 
  task, 
  onAccept, 
  onComplete 
}) => {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline" className="border-blue-500 text-blue-500">Scheduled</Badge>;
      case 'in-progress':
        return <Badge variant="outline" className="border-orange-500 text-orange-500">In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="border-green-500 text-green-500">Completed</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-500">High Priority</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500">Medium Priority</Badge>;
      case 'low':
        return <Badge className="bg-green-500">Low Priority</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  const handleAccept = async () => {
    if (onAccept) onAccept();
    
    // Send notification to admin
    addNotification({
      type: 'maintenance',
      title: 'Maintenance Task Accepted',
      message: `Task for ${task.assetName} has been accepted by ${task.assignedTo}`,
    });
    
    // Add activity record
    try {
      await addActivity({
        user: task.assignedTo,
        action: "Accepted maintenance task",
        asset: task.assetName
      });
    } catch (error) {
      console.error("Failed to add activity record:", error);
    }
    
    // Try to send email notification
    try {
      const response = await sendEmail({
        to: 'admin@example.com', // Replace with actual admin email in production
        subject: `Maintenance Task Accepted: ${task.assetName}`,
        message: `
          Maintenance task for ${task.assetName} has been accepted by ${task.assignedTo}.
          
          Task Details:
          - Status: In Progress
          - Priority: ${task.priority}
          - Location: ${task.location}
          - Scheduled Date: ${new Date(task.scheduledDate).toLocaleDateString()}
          
          You can view the complete details in the system.
        `
      });
      
      // In development mode, this log will be useful
      console.log("Email send response:", response);
    } catch (error) {
      console.error("Failed to send email notification:", error);
      // Don't show toast here - the sendEmail function will handle that
    }
  };
  
  const handleComplete = async () => {
    if (onComplete) onComplete();
    
    // Send notification to admin
    addNotification({
      type: 'maintenance',
      title: 'Maintenance Task Completed',
      message: `Task for ${task.assetName} has been marked as completed by ${task.assignedTo}`,
    });
    
    // Add activity record
    try {
      await addActivity({
        user: task.assignedTo,
        action: "Completed maintenance task",
        asset: task.assetName
      });
    } catch (error) {
      console.error("Failed to add activity record:", error);
    }
    
    // Try to send email notification
    try {
      const response = await sendEmail({
        to: 'admin@example.com', // Replace with actual admin email in production
        subject: `Maintenance Task Completed: ${task.assetName}`,
        message: `
          Maintenance task for ${task.assetName} has been completed by ${task.assignedTo}.
          
          Task Details:
          - Status: Completed
          - Priority: ${task.priority}
          - Location: ${task.location}
          - Scheduled Date: ${new Date(task.scheduledDate).toLocaleDateString()}
          - Completed Date: ${new Date().toLocaleDateString()}
          
          You can view the complete details in the system.
        `
      });
      
      // In development mode, this log will be useful
      console.log("Email send response:", response);
    } catch (error) {
      console.error("Failed to send email notification:", error);
      // Don't show toast here - the sendEmail function will handle that
    }
  };
  
  const handleViewDetails = () => {
    navigate(`/maintenance/${task.id}`);
  };
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{task.assetName}</CardTitle>
            <CardDescription>Maintenance Task #{task.id}</CardDescription>
          </div>
          <div className="flex gap-2">
            {getStatusBadge(task.status)}
            {getPriorityBadge(task.priority)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="mb-4">{task.description}</p>
        
        <div className="grid grid-cols-2 gap-y-2">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Start: {new Date(task.scheduledDate).toLocaleDateString()}</span>
          </div>
          
          {task.dueDate && (
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{task.location}</span>
          </div>
          
          <div className="flex items-center text-sm">
            <User className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>Assigned to: {task.assignedTo}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Button variant="outline" size="sm" onClick={handleViewDetails}>
          View Details
        </Button>
        <div className="flex gap-2">
          {task.status === 'scheduled' && (
            <Button size="sm" onClick={handleAccept}>
              <Wrench className="h-4 w-4 mr-2" />
              Accept Task
            </Button>
          )}
          {task.status === 'in-progress' && (
            <Button size="sm" onClick={handleComplete}>
              <Wrench className="h-4 w-4 mr-2" />
              Mark as Complete
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default MaintenanceNotification;


import React from 'react';
import { MaintenanceTask } from '@/types/asset';
import MaintenanceTaskCard from './MaintenanceTaskCard';
import { useNavigate } from 'react-router-dom';

interface MaintenanceTaskListProps {
  tasks: MaintenanceTask[];
  onEdit?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
}

const MaintenanceTaskList: React.FC<MaintenanceTaskListProps> = ({ tasks, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const handleViewDetails = (taskId: string) => {
    console.log('MaintenanceTaskList: Navigating to task details:', taskId);
    console.log('Full URL will be:', `/maintenance/details/${taskId}`);
    navigate(`/maintenance/details/${taskId}`);
  };

  console.log('MaintenanceTaskList: Rendering tasks:', tasks);
  console.log('MaintenanceTaskList: handleViewDetails function created');

  return (
    <div className="space-y-4">
      {tasks.map(task => {
        console.log('Rendering task card for:', task._id, task.description);
        return (
          <MaintenanceTaskCard 
            key={task._id} 
            task={task} 
            onViewDetails={handleViewDetails}
            onEdit={onEdit ? () => onEdit(task._id) : undefined}
            onDelete={onDelete ? () => onDelete(task._id) : undefined}
          />
        );
      })}
      {tasks.length === 0 && (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No maintenance tasks found</p>
        </div>
      )}
    </div>
  );
};

export default MaintenanceTaskList;

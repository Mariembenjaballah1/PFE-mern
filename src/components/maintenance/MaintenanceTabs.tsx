
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MaintenanceTask } from '@/types/asset';
import MaintenanceTaskList from './MaintenanceTaskList';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { List } from 'lucide-react';

interface MaintenanceTabsProps {
  tasks: MaintenanceTask[];
  isLoading: boolean;
  onEdit?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
}

const MaintenanceTabs: React.FC<MaintenanceTabsProps> = ({ tasks, isLoading, onEdit, onDelete }) => {
  const navigate = useNavigate();
  
  const filterTasks = (status: string | null) => {
    if (!status) return tasks;
    return tasks.filter(task => task.status === status);
  };
  
  const statusCounts = {
    all: tasks.length,
    scheduled: tasks.filter(task => task.status === 'scheduled').length,
    inProgress: tasks.filter(task => task.status === 'in-progress').length,
    completed: tasks.filter(task => task.status === 'completed').length,
    overdue: tasks.filter(task => task.status === 'overdue').length,
  };

  return (
    <Tabs defaultValue="all">
      <div className="flex justify-between items-center mb-6">
        <TabsList className="grid grid-cols-5 w-full md:w-auto md:inline-flex">
          <TabsTrigger value="all">All Tasks ({statusCounts.all})</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled ({statusCounts.scheduled})</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress ({statusCounts.inProgress})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({statusCounts.completed})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({statusCounts.overdue})</TabsTrigger>
        </TabsList>
        
        <Button 
          variant="outline"
          size="sm"
          className="hidden md:flex"
          onClick={() => navigate('/maintenance')}
        >
          <List className="h-4 w-4 mr-2" /> View All Maintenance
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-center py-10">
          <p>Loading maintenance tasks...</p>
        </div>
      ) : (
        <>
          <TabsContent value="all">
            <MaintenanceTaskList tasks={filterTasks(null)} onEdit={onEdit} onDelete={onDelete} />
          </TabsContent>
          <TabsContent value="scheduled">
            <MaintenanceTaskList tasks={filterTasks('scheduled')} onEdit={onEdit} onDelete={onDelete} />
          </TabsContent>
          <TabsContent value="in-progress">
            <MaintenanceTaskList tasks={filterTasks('in-progress')} onEdit={onEdit} onDelete={onDelete} />
          </TabsContent>
          <TabsContent value="completed">
            <MaintenanceTaskList tasks={filterTasks('completed')} onEdit={onEdit} onDelete={onDelete} />
          </TabsContent>
          <TabsContent value="overdue">
            <MaintenanceTaskList tasks={filterTasks('overdue')} onEdit={onEdit} onDelete={onDelete} />
          </TabsContent>
        </>
      )}
    </Tabs>
  );
};

export default MaintenanceTabs;

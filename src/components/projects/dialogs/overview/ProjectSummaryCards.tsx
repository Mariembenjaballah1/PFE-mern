
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Project, Asset } from '@/types/asset';
import { 
  Target,
  Users,
  Clock,
  Activity
} from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { ProjectStatusBadge } from '../ProjectBadges';

interface ProjectSummaryCardsProps {
  project: Project;
  assets: Asset[];
  progress: number;
}

export const ProjectSummaryCards: React.FC<ProjectSummaryCardsProps> = ({ 
  project, 
  assets, 
  progress 
}) => {
  const daysRemaining = project.endDate ? differenceInDays(new Date(project.endDate), new Date()) : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium">Progress</p>
              <p className="text-2xl font-bold">{Math.round(progress)}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium">Assets</p>
              <p className="text-2xl font-bold">{assets.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm font-medium">Days Left</p>
              <p className="text-2xl font-bold">{daysRemaining !== null ? Math.max(daysRemaining, 0) : '∞'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Activity className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium">Status</p>
              <div className="mt-1">
                <ProjectStatusBadge status={project.status} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

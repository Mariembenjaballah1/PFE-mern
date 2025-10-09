
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Project } from '@/types/asset';
import { TrendingUp } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

interface ProjectTimelineCardProps {
  project: Project;
  progress: number;
}

export const ProjectTimelineCard: React.FC<ProjectTimelineCardProps> = ({ 
  project, 
  progress 
}) => {
  const daysRemaining = project.endDate ? differenceInDays(new Date(project.endDate), new Date()) : null;

  if (!project.endDate) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Project Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Progress: {Math.round(progress)}%</span>
            <span>{daysRemaining !== null && daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Project ended'}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Start Date:</span>
            <p className="font-medium">{format(new Date(project.startDate), 'MMM d, yyyy')}</p>
          </div>
          <div>
            <span className="text-muted-foreground">End Date:</span>
            <p className="font-medium">{format(new Date(project.endDate), 'MMM d, yyyy')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

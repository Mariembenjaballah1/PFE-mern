
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Project } from '@/types/asset';
import { 
  Calendar, 
  User, 
  Building, 
  Tag,
  Edit3
} from 'lucide-react';
import { ProjectStatusBadge, ProjectPriorityBadge } from '../ProjectBadges';
import { ProjectManagerUpdateDialog } from '../../ProjectManagerUpdateDialog';

interface ProjectInfoCardProps {
  project: Project;
  onManagerUpdate?: () => void;
}

export const ProjectInfoCard: React.FC<ProjectInfoCardProps> = ({ 
  project,
  onManagerUpdate 
}) => {
  const [managerDialogOpen, setManagerDialogOpen] = useState(false);

  const handleManagerUpdateSuccess = () => {
    if (onManagerUpdate) onManagerUpdate();
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Informations du Projet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Gestionnaire:</span>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 font-medium">
                <User className="h-3 w-3" />
                {project.manager}
              </span>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setManagerDialogOpen(true)}
                className="h-6 w-6 p-0"
              >
                <Edit3 className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          {project.department && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Département:</span>
              <span className="flex items-center gap-1 font-medium">
                <Building className="h-3 w-3" />
                {project.department}
              </span>
            </div>
          )}
          
          <div className="flex justify-between text-sm items-center">
            <span className="text-muted-foreground">Priorité:</span>
            <ProjectPriorityBadge priority={project.priority} />
          </div>
          
          <div className="flex justify-between text-sm items-center">
            <span className="text-muted-foreground">Statut:</span>
            <ProjectStatusBadge status={project.status} />
          </div>

          {project.tags && project.tags.length > 0 && (
            <div className="space-y-2">
              <span className="text-muted-foreground text-sm">Tags:</span>
              <div className="flex flex-wrap gap-1">
                {project.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    <Tag className="h-2 w-2 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ProjectManagerUpdateDialog
        project={project}
        open={managerDialogOpen}
        onOpenChange={setManagerDialogOpen}
        onSuccess={handleManagerUpdateSuccess}
      />
    </>
  );
};

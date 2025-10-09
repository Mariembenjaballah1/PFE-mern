
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Project } from '@/types/asset';
import { 
  Calendar, 
  User,
  Building,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  UserCog
} from 'lucide-react';
import { ProjectStatusBadge, ProjectPriorityBadge } from '../dialogs/ProjectBadges';
import { ProjectManagerChangeDialog } from '../ProjectManagerChangeDialog';
import { isMockProject } from '../utils/projectUtils';

interface ProjectCardProps {
  project: Project;
  index: number;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onView: (project: Project) => void;
  isDeleting: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  index, 
  onEdit, 
  onDelete, 
  onView,
  isDeleting 
}) => {
  const [isManagerDialogOpen, setIsManagerDialogOpen] = useState(false);

  const handleChangeManager = () => {
    if (isMockProject(project.id)) {
      // For mock projects, we'll still allow the dialog to open for demo purposes
      // but it won't actually save changes
    }
    setIsManagerDialogOpen(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Non définie';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 animate-fade-in" 
            style={{ animationDelay: `${index * 100}ms` }}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <CardTitle className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer"
                          onClick={() => onView(project)}>
                  {project.name}
                </CardTitle>
                <div className="flex gap-2">
                  <ProjectStatusBadge status={project.status} />
                  <ProjectPriorityBadge priority={project.priority} />
                </div>
              </div>
              {project.description && (
                <CardDescription className="text-gray-600 leading-relaxed">
                  {project.description}
                </CardDescription>
              )}
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onView(project)} className="cursor-pointer">
                  <Eye className="mr-2 h-4 w-4" />
                  Voir détails
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(project)} className="cursor-pointer">
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleChangeManager} className="cursor-pointer">
                  <UserCog className="mr-2 h-4 w-4" />
                  Changer gestionnaire
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(project)} 
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  disabled={isDeleting}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {isDeleting ? 'Suppression...' : 'Supprimer'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-blue-500" />
              <span className="text-gray-600">Gestionnaire:</span>
              <span className="font-medium text-gray-900">
                {project.manager || 'Non assigné'}
              </span>
            </div>
            
            {project.department && (
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-green-500" />
                <span className="text-gray-600">Département:</span>
                <span className="font-medium text-gray-900">{project.department}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-purple-500" />
              <span className="text-gray-600">Début:</span>
              <span className="font-medium text-gray-900">{formatDate(project.startDate)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-orange-500" />
              <span className="text-gray-600">Fin:</span>
              <span className="font-medium text-gray-900">{formatDate(project.endDate)}</span>
            </div>
          </div>

          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-2">
              {project.tags.map((tag, tagIndex) => (
                <Badge key={tagIndex} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ProjectManagerChangeDialog
        project={project}
        open={isManagerDialogOpen}
        onOpenChange={setIsManagerDialogOpen}
        onSuccess={() => {
          // The dialog will handle the refresh via custom events
        }}
      />
    </>
  );
};

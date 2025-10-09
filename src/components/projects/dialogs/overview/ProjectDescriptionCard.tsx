
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Project } from '@/types/asset';

interface ProjectDescriptionCardProps {
  project: Project;
}

export const ProjectDescriptionCard: React.FC<ProjectDescriptionCardProps> = ({ project }) => {
  if (!project.description) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md">Project Description</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed">{project.description}</p>
      </CardContent>
    </Card>
  );
};


import React from 'react';
import { Project, Asset } from '@/types/asset';
import { differenceInDays } from 'date-fns';
import { ProjectSummaryCards } from './overview/ProjectSummaryCards';
import { ProjectTimelineCard } from './overview/ProjectTimelineCard';
import { ProjectInfoCard } from './overview/ProjectInfoCard';
import { ProjectResourceCard } from './overview/ProjectResourceCard';
import { ProjectDescriptionCard } from './overview/ProjectDescriptionCard';
import { ProjectAssetSummaryCard } from './overview/ProjectAssetSummaryCard';

interface ProjectOverviewTabProps {
  project: Project;
  assets: Asset[];
}

export const ProjectOverviewTab: React.FC<ProjectOverviewTabProps> = ({ 
  project, 
  assets 
}) => {
  // Calculate project progress
  const calculateProgress = () => {
    if (!project.endDate) return 0;
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    const now = new Date();
    
    const totalDays = differenceInDays(end, start);
    const elapsedDays = differenceInDays(now, start);
    
    return Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100);
  };

  const progress = calculateProgress();

  return (
    <div className="space-y-6">
      {/* Project Summary Cards */}
      <ProjectSummaryCards project={project} assets={assets} progress={progress} />

      {/* Progress Timeline */}
      <ProjectTimelineCard project={project} progress={progress} />

      {/* Main Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProjectInfoCard project={project} />
        <ProjectResourceCard project={project} assets={assets} />
      </div>
      
      {/* Description Card */}
      <ProjectDescriptionCard project={project} />

      {/* Asset Summary */}
      <ProjectAssetSummaryCard assets={assets} />
    </div>
  );
};

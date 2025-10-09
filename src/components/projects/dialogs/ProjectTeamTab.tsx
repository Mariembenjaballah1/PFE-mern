
import React from 'react';
import { Project, Asset } from '@/types/asset';
import { TeamOverviewCards } from './team/TeamOverviewCards';
import { TeamMembersList } from './team/TeamMembersList';
import { TeamActivityCard } from './team/TeamActivityCard';
import { useTeamData } from './team/useTeamData';

interface ProjectTeamTabProps {
  project: Project;
  assets: Asset[];
}

export const ProjectTeamTab: React.FC<ProjectTeamTabProps> = ({ 
  project, 
  assets 
}) => {
  const { allMembers, recentActivities, refreshTeamData } = useTeamData(project, assets);

  return (
    <div className="space-y-6">
      {/* Team Overview */}
      <TeamOverviewCards 
        teamSize={allMembers.length}
        activeMembers={allMembers.filter(m => m.status === 'active').length}
        totalAssets={assets.length}
      />

      {/* Team Members */}
      <TeamMembersList 
        members={allMembers} 
        projectId={project.id}
        projectName={project.name}
        onRefresh={refreshTeamData}
      />

      {/* Recent Activity */}
      <TeamActivityCard activities={recentActivities} />
    </div>
  );
};

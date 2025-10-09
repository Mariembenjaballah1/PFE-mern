
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, UserPlus } from 'lucide-react';
import { TeamMemberCard, TeamMember } from './TeamMemberCard';
import { AddTeamMemberDialog } from './AddTeamMemberDialog';

interface TeamMembersListProps {
  members: TeamMember[];
  projectId: string;
  projectName: string;
  onRefresh?: () => void;
}

export const TeamMembersList: React.FC<TeamMembersListProps> = ({ 
  members, 
  projectId, 
  projectName,
  onRefresh 
}) => {
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);

  const handleAddMemberSuccess = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  const handleRoleChanged = () => {
    if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Membres de l'Équipe
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => setAddMemberDialogOpen(true)}
            >
              <UserPlus className="h-4 w-4" />
              Ajouter Membre
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((member, index) => (
              <TeamMemberCard 
                key={index} 
                member={member} 
                projectId={projectId}
                onRoleChanged={handleRoleChanged}
              />
            ))}
          </div>

          {members.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun membre assigné à ce projet pour le moment.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setAddMemberDialogOpen(true)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Ajouter des Membres
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <AddTeamMemberDialog
        open={addMemberDialogOpen}
        onOpenChange={setAddMemberDialogOpen}
        projectId={projectId}
        projectName={projectName}
        onSuccess={handleAddMemberSuccess}
      />
    </>
  );
};

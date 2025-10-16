
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, UserCog } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { teamMemberService } from '@/services/teamMemberService';
import { updateProject } from '@/services/projectApi';
import { TeamMember } from './TeamMemberCard';

interface ChangeRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: TeamMember;
  projectId: string;
  onSuccess: () => void;
}

export const ChangeRoleDialog: React.FC<ChangeRoleDialogProps> = ({
  open,
  onOpenChange,
  member,
  projectId,
  onSuccess
}) => {
  const [newRole, setNewRole] = useState(member.role);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const availableRoles = [
    'Project Manager',
    'Team Lead',
    'Senior Developer',
    'Developer',
    'Designer',
    'Analyst',
    'QA Engineer',
    'DevOps Engineer',
    'Team Member'
  ];

  const handleUpdateRole = async () => {
    if (newRole === member.role) {
      onOpenChange(false);
      return;
    }

    setIsUpdating(true);
    try {
      console.log('ChangeRoleDialog: Starting role change', {
        memberName: member.name,
        currentRole: member.role,
        newRole,
        isOfficialManager: member.isOfficialManager
      });

      // If changing FROM official Project Manager to another role
      if (member.isOfficialManager && newRole !== 'Project Manager') {
        console.log('ChangeRoleDialog: Changing official project manager to team member role');
        
        // 1. Update project manager to "Unassigned"
        await updateProject(projectId, { manager: 'Unassigned' });
        
        // 2. Add the former manager as a team member with the new role
        const userObj = {
          _id: member.name,
          name: member.name,
          email: member.email
        };
        await teamMemberService.addTeamMember(projectId, userObj, newRole);
        
        // 3. Clean up any duplicate entries for this user
        const allMembers = teamMemberService.getProjectTeamMembers(projectId);
        const duplicates = allMembers.filter(m => m.userName === member.name);
        console.log('ChangeRoleDialog: Found duplicate entries:', duplicates);
        
        // Remove all old entries for this user first
        for (const duplicate of duplicates) {
          if (duplicate.role !== newRole) {
            await teamMemberService.removeTeamMember(projectId, duplicate.userName);
          }
        }
        
        // 4. Dispatch events to notify other components
        window.dispatchEvent(new CustomEvent('projectManagerUpdated', {
          detail: { projectId, managerName: 'Unassigned' }
        }));
        
        toast({
          title: "Rôle mis à jour",
          description: `${member.name} n'est plus le gestionnaire de projet et a été assigné comme ${newRole}`,
        });
      }
      // If changing TO Project Manager role
      else if (newRole === 'Project Manager') {
        console.log('ChangeRoleDialog: Changing member to Project Manager');
        
        // Update project manager
        await updateProject(projectId, { manager: member.name });
        
        // Remove from team members if they were manually added
        try {
          await teamMemberService.removeTeamMember(projectId, member.name);
          console.log('ChangeRoleDialog: Removed from team members list');
        } catch (error) {
          console.log('ChangeRoleDialog: Member was not in team members list, continuing...');
        }
        
        // Dispatch event to notify other components
        window.dispatchEvent(new CustomEvent('projectManagerUpdated', {
          detail: { projectId, managerName: member.name }
        }));
        
        toast({
          title: "Gestionnaire de projet mis à jour",
          description: `${member.name} est maintenant le gestionnaire officiel du projet`,
        });
      } 
      // If changing between team member roles (not involving Project Manager)
      else {
        console.log('ChangeRoleDialog: Changing between team member roles');
        
        const userObj = {
          _id: member.name,
          name: member.name,
          email: member.email
        };

        // Remove old role entry first
        await teamMemberService.removeTeamMember(projectId, member.name);
        
        // Add with new role
        await teamMemberService.addTeamMember(projectId, userObj, newRole);
        
        toast({
          title: "Rôle mis à jour",
          description: `Le rôle de ${member.name} a été changé vers "${newRole}"`,
        });
      }

      console.log('ChangeRoleDialog: Role change completed successfully');
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('ChangeRoleDialog: Error updating member role:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le rôle du membre",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getAlertMessage = () => {
    if (member.isOfficialManager && newRole !== 'Project Manager') {
      return "Attention : Changer le rôle du gestionnaire officiel vers un autre rôle supprimera sa fonction de gestionnaire de projet. Le projet n'aura plus de gestionnaire assigné.";
    }
    if (newRole === 'Project Manager') {
      return "Choisir \"Project Manager\" fera de ce membre le gestionnaire officiel du projet.";
    }
    return "Les autres rôles sont disponibles pour les membres de l'équipe.";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Changer le Rôle
          </DialogTitle>
          <DialogDescription>
            Modifier le rôle de {member.name} dans l'équipe du projet
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              {getAlertMessage()}
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="current-role">Rôle Actuel</Label>
            <div className="p-2 bg-muted rounded text-sm">
              {member.isOfficialManager ? 'Project Manager (Officiel)' : member.role}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-role">Nouveau Rôle</Label>
            <Select value={newRole} onValueChange={setNewRole}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un rôle" />
              </SelectTrigger>
              <SelectContent>
                {availableRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
          >
            Annuler
          </Button>
          <Button
            onClick={handleUpdateRole}
            disabled={isUpdating || newRole === member.role}
          >
            {isUpdating ? 'Mise à jour...' : 'Mettre à jour'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '@/services/userApi';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { teamMemberService } from '@/services/teamMemberService';
import { AddTeamMemberForm } from './AddTeamMemberForm';
import { AddTeamMemberActions } from './AddTeamMemberActions';

interface AddTeamMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectName: string;
  onSuccess: () => void;
}

export const AddTeamMemberDialog: React.FC<AddTeamMemberDialogProps> = ({
  open,
  onOpenChange,
  projectId,
  projectName,
  onSuccess
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [role, setRole] = useState('Team Member');
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    enabled: open
  });

  const filteredUsers = users.filter((user: any) => {
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.department.toLowerCase().includes(query)
    );
  });

  const handleAddToTeam = async () => {
    if (!selectedUser) return;

    setIsAdding(true);
    try {
      console.log('AddTeamMemberDialog: Starting team member addition...');
      console.log('AddTeamMemberDialog: Project ID:', projectId);
      console.log('AddTeamMemberDialog: User:', selectedUser);
      console.log('AddTeamMemberDialog: Role:', role);
      
      await teamMemberService.addTeamMember(projectId, selectedUser, role);

      const managerText = role === 'Project Manager' 
        ? ` and set as the project manager`
        : '';

      toast({
        title: "Team Member Added",
        description: `${selectedUser.name} has been added to ${projectName} as ${role}${managerText}`,
      });

      console.log('AddTeamMemberDialog: Team member added successfully, calling onSuccess');
      
      // Give a small delay to ensure all events are processed
      setTimeout(() => {
        onSuccess();
        onOpenChange(false);
        setSelectedUser(null);
        setSearchQuery('');
        setRole('Team Member');
      }, 250);
      
    } catch (error) {
      console.error('AddTeamMemberDialog: CRITICAL ERROR adding team member:', error);
      console.error('AddTeamMemberDialog: Error details:', {
        message: error.message,
        stack: error.stack,
        projectId,
        selectedUser,
        role
      });
      
      toast({
        title: "Error",
        description: `Failed to add team member: ${error.message || 'Unknown error'}. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add Team Member
          </DialogTitle>
          <DialogDescription>
            Add a user to the {projectName} project team
          </DialogDescription>
        </DialogHeader>

        <AddTeamMemberForm
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filteredUsers={filteredUsers}
          selectedUser={selectedUser}
          onUserSelect={setSelectedUser}
          isLoading={isLoading}
          role={role}
          onRoleChange={setRole}
        />

        <AddTeamMemberActions
          onCancel={handleCancel}
          onAddToTeam={handleAddToTeam}
          selectedUser={selectedUser}
          isAdding={isAdding}
        />
      </DialogContent>
    </Dialog>
  );
};

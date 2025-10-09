
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '@/services/userApi';
import { fetchProjects } from '@/services/projectApi';
import { SelectProjectDialog } from './dialogs/team/SelectProjectDialog';
import { teamMemberService } from '@/services/teamMemberService';
import { UserSearchInput } from './search/UserSearchInput';
import { UserList } from './search/UserList';
import { SelectedUserDetails } from './search/SelectedUserDetails';
import { EmptyStates } from './search/EmptyStates';

interface ProjectUserSearchProps {
  onUserSelect?: (user: any, projects: any[]) => void;
}

export const ProjectUserSearch: React.FC<ProjectUserSearchProps> = ({ onUserSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectProjectDialogOpen, setSelectProjectDialogOpen] = useState(false);

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects
  });

  const getUserProjects = (userName: string, userEmail: string) => {
    const userProjects = [];
    
    // Check if user is a project manager
    const managedProjects = projects.filter((project: any) => project.manager === userName);
    userProjects.push(...managedProjects);
    
    // Check if user is a team member in any projects
    const allTeamMembers = teamMemberService.getTeamMembers();
    const userTeamMemberships = allTeamMembers.filter(
      member => member.userName === userName || member.userEmail === userEmail
    );
    
    // Get projects where user is a team member
    const teamProjects = userTeamMemberships.map(membership => 
      projects.find((project: any) => project.id === membership.projectId)
    ).filter(Boolean);
    
    userProjects.push(...teamProjects);
    
    // Remove duplicates
    const uniqueProjects = userProjects.filter((project, index, self) =>
      index === self.findIndex(p => p.id === project.id)
    );
    
    console.log('getUserProjects for', userName, ':', uniqueProjects);
    return uniqueProjects;
  };

  const filteredUsers = users.filter((user: any) => {
    const query = searchQuery.toLowerCase();
    
    // Search by user properties
    const userMatches = (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.department.toLowerCase().includes(query)
    );
    
    // Search by project names where user is a member
    const userProjects = getUserProjects(user.name, user.email);
    const projectMatches = userProjects.some((project: any) => 
      project.name.toLowerCase().includes(query)
    );
    
    return userMatches || projectMatches;
  });

  const handleUserClick = (user: any) => {
    setSelectedUser(user);
    const userProjects = getUserProjects(user.name, user.email);
    if (onUserSelect) {
      onUserSelect(user, userProjects);
    }
  };

  const handleAddToProject = (user: any) => {
    setSelectedUser(user);
    setSelectProjectDialogOpen(true);
  };

  const handleProjectAssignmentSuccess = () => {
    setSelectedUser(null);
  };

  return (
    <>
      <Card className="border-2 border-dashed border-muted">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Search className="h-6 w-6 text-primary" />
            Find Users & Manage Project Teams
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Search for users by name, email, department, or project membership and add them to new projects
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <UserSearchInput
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            resultsCount={filteredUsers.length}
          />

          <UserList
            users={filteredUsers}
            searchQuery={searchQuery}
            selectedUser={selectedUser}
            getUserProjects={getUserProjects}
            onUserClick={handleUserClick}
            onAddToProject={handleAddToProject}
          />

          {selectedUser && (
            <SelectedUserDetails
              user={selectedUser}
              userProjects={getUserProjects(selectedUser.name, selectedUser.email)}
            />
          )}

          <EmptyStates
            searchQuery={searchQuery}
            hasResults={filteredUsers.length > 0}
          />
        </CardContent>
      </Card>

      <SelectProjectDialog
        open={selectProjectDialogOpen}
        onOpenChange={setSelectProjectDialogOpen}
        selectedUser={selectedUser}
        onSuccess={handleProjectAssignmentSuccess}
      />
    </>
  );
};

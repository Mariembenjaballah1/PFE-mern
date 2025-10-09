
import React from 'react';
import { UserCard } from './UserCard';

interface UserListProps {
  users: any[];
  searchQuery: string;
  selectedUser: any;
  getUserProjects: (userName: string, userEmail: string) => any[];
  onUserClick: (user: any) => void;
  onAddToProject: (user: any) => void;
}

export const UserList: React.FC<UserListProps> = ({
  users,
  searchQuery,
  selectedUser,
  getUserProjects,
  onUserClick,
  onAddToProject
}) => {
  if (users.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground border-b pb-2">
        {searchQuery 
          ? `Showing ${users.length} user${users.length !== 1 ? 's' : ''} matching your search. Click on a user to view details, or use "Add to Project" to assign them to a project.`
          : `Showing all ${users.length} users. Click on a user to view details, or use "Add to Project" to assign them to a project.`
        }
      </div>
      
      <div className="max-h-80 overflow-y-auto space-y-3">
        {users.map((user: any) => {
          const userProjects = getUserProjects(user.name, user.email);
          const isSelected = selectedUser?._id === user._id;
          
          return (
            <UserCard
              key={user._id}
              user={user}
              userProjects={userProjects}
              isSelected={isSelected}
              onUserClick={onUserClick}
              onAddToProject={onAddToProject}
            />
          );
        })}
      </div>
    </div>
  );
};

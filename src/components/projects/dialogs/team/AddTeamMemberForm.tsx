
import React from 'react';
import { UserSearchSection } from './UserSearchSection';
import { UserSelectionList } from './UserSelectionList';
import { RoleSelectionField } from './RoleSelectionField';
import { SelectedUserPreview } from './SelectedUserPreview';

interface AddTeamMemberFormProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filteredUsers: any[];
  selectedUser: any;
  onUserSelect: (user: any) => void;
  isLoading: boolean;
  role: string;
  onRoleChange: (role: string) => void;
}

export const AddTeamMemberForm: React.FC<AddTeamMemberFormProps> = ({
  searchQuery,
  onSearchChange,
  filteredUsers,
  selectedUser,
  onUserSelect,
  isLoading,
  role,
  onRoleChange
}) => {
  return (
    <div className="space-y-6">
      <UserSearchSection
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />

      <UserSelectionList
        users={filteredUsers}
        selectedUser={selectedUser}
        onUserSelect={onUserSelect}
        isLoading={isLoading}
      />

      {selectedUser && (
        <RoleSelectionField
          selectedRole={role}
          onRoleChange={onRoleChange}
        />
      )}

      <SelectedUserPreview
        user={selectedUser}
        role={role}
      />
    </div>
  );
};

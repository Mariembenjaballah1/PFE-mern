
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';

interface UserSelectionListProps {
  users: any[];
  selectedUser: any;
  onUserSelect: (user: any) => void;
  isLoading: boolean;
}

export const UserSelectionList: React.FC<UserSelectionListProps> = ({
  users,
  selectedUser,
  onUserSelect,
  isLoading
}) => {
  return (
    <div className="space-y-2">
      <Label>Select User</Label>
      <div className="border rounded-lg max-h-64 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-muted-foreground">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No users found matching your search
          </div>
        ) : (
          <div className="divide-y">
            {users.map((user: any) => (
              <div
                key={user._id}
                className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                  selectedUser?._id === user._id ? 'bg-muted' : ''
                }`}
                onClick={() => onUserSelect(user)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {user.name.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{user.department}</Badge>
                    <Badge variant="secondary">{user.role}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface SelectedUserPreviewProps {
  user: any;
  role: string;
}

export const SelectedUserPreview: React.FC<SelectedUserPreviewProps> = ({
  user,
  role
}) => {
  if (!user) return null;

  return (
    <div className="p-4 border rounded-lg bg-muted/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarFallback>
              {user.name.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-sm text-muted-foreground">{user.email}</div>
          </div>
        </div>
        <Badge>{role}</Badge>
      </div>
    </div>
  );
};

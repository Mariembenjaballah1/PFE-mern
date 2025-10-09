
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Settings } from 'lucide-react';
import { ChangeRoleDialog } from './ChangeRoleDialog';

export interface TeamMember {
  name: string;
  role: string;
  email: string;
  phone: string;
  assetsCount: number;
  avatar: string;
  status: string;
  isOfficialManager?: boolean; // True only for the official project manager
  canChangeRole?: boolean; // True for manually added members
}

interface TeamMemberCardProps {
  member: TeamMember;
  projectId?: string;
  onRoleChanged?: () => void;
}

export const TeamMemberCard: React.FC<TeamMemberCardProps> = ({ 
  member, 
  projectId,
  onRoleChanged 
}) => {
  const [changeRoleDialogOpen, setChangeRoleDialogOpen] = useState(false);
  
  console.log('TeamMemberCard: rendering member', member);

  const getBadgeVariant = () => {
    if (member.isOfficialManager) {
      return 'default'; // Blue badge for official project manager
    }
    return 'secondary'; // Gray badge for other roles
  };

  const getBadgeText = () => {
    if (member.isOfficialManager) {
      return 'Project Manager'; // Only official manager gets this title
    }
    return member.role; // All other roles display their actual role
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={member.avatar} alt={member.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {member.name ? member.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-foreground">
                {member.name || 'Unknown User'}
              </h4>
              <Badge variant={getBadgeVariant()}>
                {getBadgeText()}
              </Badge>
              {member.isOfficialManager && (
                <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
                  Official
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {member.email}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {member.phone}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-right space-y-1">
            <div className="text-sm font-medium">
              {member.assetsCount} Assets
            </div>
            <Badge variant={member.status === 'active' ? 'default' : 'secondary'} className="text-xs">
              {member.status}
            </Badge>
          </div>
          
          {/* Allow role change for all members including official managers */}
          {projectId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setChangeRoleDialogOpen(true)}
              className="ml-2"
            >
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Allow role change dialog for all members */}
      {projectId && (
        <ChangeRoleDialog
          open={changeRoleDialogOpen}
          onOpenChange={setChangeRoleDialogOpen}
          member={member}
          projectId={projectId}
          onSuccess={() => {
            if (onRoleChanged) onRoleChanged();
          }}
        />
      )}
    </>
  );
};

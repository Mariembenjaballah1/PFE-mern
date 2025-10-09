
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from '@/services/projectApi';
import { Search, FolderOpen, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { teamMemberService } from '@/services/teamMemberService';

interface SelectProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUser: any;
  onSuccess: () => void;
}

export const SelectProjectDialog: React.FC<SelectProjectDialogProps> = ({
  open,
  onOpenChange,
  selectedUser,
  onSuccess
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [role, setRole] = useState('Team Member');
  const [isAdding, setIsAdding] = useState(false);
  const { toast } = useToast();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    enabled: open
  });

  const filteredProjects = projects.filter((project: any) => {
    const query = searchQuery.toLowerCase();
    return (
      project.name.toLowerCase().includes(query) ||
      project.description?.toLowerCase().includes(query) ||
      project.manager?.toLowerCase().includes(query)
    );
  });

  const handleAddToProject = async () => {
    if (!selectedUser || !selectedProject) return;

    setIsAdding(true);
    try {
      // Add the team member using the service
      teamMemberService.addTeamMember(selectedProject.id, selectedUser, role);

      toast({
        title: "User Added to Project",
        description: `${selectedUser.name} has been added to ${selectedProject.name} as ${role}`,
      });

      onSuccess();
      onOpenChange(false);
      setSelectedProject(null);
      setSearchQuery('');
      setRole('Team Member');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add user to project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAdding(false);
    }
  };

  if (!selectedUser) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add User to Project
          </DialogTitle>
          <DialogDescription>
            Select a project to add {selectedUser.name} to
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selected User Preview */}
          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  {selectedUser.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{selectedUser.name}</div>
                <div className="text-sm text-muted-foreground">{selectedUser.email}</div>
                <div className="text-xs text-muted-foreground">{selectedUser.department}</div>
              </div>
              <Badge variant="outline">{selectedUser.role}</Badge>
            </div>
          </div>

          {/* Search Projects */}
          <div className="space-y-2">
            <Label htmlFor="search">Search Projects</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by project name, description, or manager..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Project List */}
          <div className="space-y-2">
            <Label>Select Project</Label>
            <div className="border rounded-lg max-h-64 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-muted-foreground">
                  Loading projects...
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No projects found matching your search
                </div>
              ) : (
                <div className="divide-y">
                  {filteredProjects.map((project: any) => (
                    <div
                      key={project.id}
                      className={`p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                        selectedProject?.id === project.id ? 'bg-muted' : ''
                      }`}
                      onClick={() => setSelectedProject(project)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FolderOpen className="h-8 w-8 text-primary" />
                          <div>
                            <div className="font-medium">{project.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {project.description || 'No description'}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Manager: {project.manager || 'Unassigned'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                            {project.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Role Selection */}
          {selectedProject && (
            <div className="space-y-2">
              <Label htmlFor="role">Project Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Project Manager">Project Manager</SelectItem>
                  <SelectItem value="Team Lead">Team Lead</SelectItem>
                  <SelectItem value="Developer">Developer</SelectItem>
                  <SelectItem value="Designer">Designer</SelectItem>
                  <SelectItem value="Analyst">Analyst</SelectItem>
                  <SelectItem value="Team Member">Team Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Selected Project Preview */}
          {selectedProject && (
            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FolderOpen className="h-8 w-8 text-primary" />
                  <div>
                    <div className="font-medium">{selectedProject.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedProject.description || 'No description'}
                    </div>
                  </div>
                </div>
                <Badge>{role}</Badge>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddToProject} 
            disabled={!selectedProject || isAdding}
          >
            {isAdding ? 'Adding...' : 'Add to Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

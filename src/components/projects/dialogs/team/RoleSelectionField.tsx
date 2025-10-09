
import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from 'lucide-react';

interface RoleSelectionFieldProps {
  selectedRole: string;
  onRoleChange: (role: string) => void;
}

export const RoleSelectionField: React.FC<RoleSelectionFieldProps> = ({
  selectedRole,
  onRoleChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="role">Rôle dans le Projet</Label>
      
      <Alert className="mb-3">
        <Info className="h-4 w-4" />
        <AlertDescription className="text-sm">
          Le badge "Project Manager" est réservé au gestionnaire officiel du projet. 
          Choisissez un autre rôle approprié pour ce membre.
        </AlertDescription>
      </Alert>
      
      <Select value={selectedRole} onValueChange={onRoleChange}>
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner un rôle" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Team Lead">Team Lead</SelectItem>
          <SelectItem value="Senior Developer">Senior Developer</SelectItem>
          <SelectItem value="Developer">Developer</SelectItem>
          <SelectItem value="Designer">Designer</SelectItem>
          <SelectItem value="Analyst">Analyst</SelectItem>
          <SelectItem value="QA Engineer">QA Engineer</SelectItem>
          <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
          <SelectItem value="Team Member">Team Member</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};


import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, Users } from 'lucide-react';

interface UserSearchInputProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  resultsCount: number;
}

export const UserSearchInput: React.FC<UserSearchInputProps> = ({
  searchQuery,
  onSearchChange,
  resultsCount
}) => {
  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Search Users</label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, department, or project name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 border-2 focus:border-primary"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          💡 Tip: You can search for users by the projects they're assigned to as well
        </p>
      </div>

      {/* Results Summary - Show for all cases now */}
      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg border">
        <Users className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">
          {searchQuery 
            ? `${resultsCount} user${resultsCount !== 1 ? 's' : ''} found`
            : `${resultsCount} total user${resultsCount !== 1 ? 's' : ''}`
          }
        </span>
      </div>
    </div>
  );
};

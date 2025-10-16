
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';

interface UserSearchSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const UserSearchSection: React.FC<UserSearchSectionProps> = ({
  searchQuery,
  onSearchChange
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="search">Search Users</Label>
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          id="search"
          placeholder="Search by name, email, or department..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
};

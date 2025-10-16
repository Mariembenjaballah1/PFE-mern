
import React from 'react';
import { User } from 'lucide-react';

interface EmptyStatesProps {
  searchQuery: string;
  hasResults: boolean;
}

export const EmptyStates: React.FC<EmptyStatesProps> = ({
  searchQuery,
  hasResults
}) => {
  // Only show "No Results" state when there's a search query but no results
  if (searchQuery && !hasResults) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
        <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
        <h3 className="font-semibold text-lg mb-2">No Users Found</h3>
        <p className="text-muted-foreground">
          No users match your search criteria. Try adjusting your search terms.
        </p>
      </div>
    );
  }

  return null;
};

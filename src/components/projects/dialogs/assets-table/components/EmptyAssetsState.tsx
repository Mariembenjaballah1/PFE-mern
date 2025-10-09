
import React from 'react';
import { Info } from 'lucide-react';

interface EmptyAssetsStateProps {
  isMock: boolean;
}

export const EmptyAssetsState: React.FC<EmptyAssetsStateProps> = ({ isMock }) => {
  return (
    <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="mx-auto w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
        <Info className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        No Assets Assigned
      </h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
        {isMock 
          ? "This demo project doesn't have any asset assignments. Create a new project and assign assets to see them here."
          : "No assets have been assigned to this project yet. Start by allocating servers and resources to this project."
        }
      </p>
    </div>
  );
};


import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/3"></div>
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl"></div>
        ))}
      </div>
    </div>
  );
};

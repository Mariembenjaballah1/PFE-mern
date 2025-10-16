
import React from 'react';

interface VMFieldRowProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  isMono?: boolean;
  renderBadge?: (value: string) => React.ReactNode;
}

const VMFieldRow: React.FC<VMFieldRowProps> = ({ 
  label, 
  value, 
  icon, 
  isMono = false, 
  renderBadge 
}) => {
  const hasValue = value && value !== 'N/A' && value.trim() !== '';
  
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-1 mb-2">
            {icon}
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {label}
            </label>
          </div>
          
          {hasValue ? (
            <div className="flex items-center gap-2">
              {renderBadge ? (
                renderBadge(value)
              ) : (
                <span className={`text-sm font-medium text-gray-900 dark:text-gray-100 ${
                  isMono ? 'font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs' : ''
                }`}>
                  {value}
                </span>
              )}
            </div>
          ) : (
            <span className="text-sm text-gray-400 dark:text-gray-500 italic">
              Not configured
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VMFieldRow;

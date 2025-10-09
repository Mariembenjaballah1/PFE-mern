
import React from 'react';
import { Asset } from '@/types/asset';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getEnvironmentBadgeColor } from '../utils/assetUtils';
import { getEnvironmentIcon } from '../utils/environmentIcons';
import { AssetTableRow } from './AssetTableRow';

interface EnvironmentSectionProps {
  environment: string;
  assets: Asset[];
  isExpanded: boolean;
  onToggle: () => void;
  onAssetClick: (asset: Asset) => void;
  onRemoveFromProject?: (asset: Asset) => void;
}

export const EnvironmentSection: React.FC<EnvironmentSectionProps> = ({
  environment,
  assets,
  isExpanded,
  onToggle,
  onAssetClick,
  onRemoveFromProject
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
      <div 
        className="flex items-center justify-between cursor-pointer p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 border-b border-gray-100 dark:border-gray-800"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3">
          {getEnvironmentIcon(environment)}
          <span className="font-semibold text-gray-900 dark:text-gray-100">{environment}</span>
          <Badge className={`${getEnvironmentBadgeColor(environment)} font-medium px-3 py-1`}>
            {assets.length} server{assets.length !== 1 ? 's' : ''}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          {isExpanded ? 
            <ChevronUp className="h-5 w-5 text-gray-500 transition-transform duration-200" /> : 
            <ChevronDown className="h-5 w-5 text-gray-500 transition-transform duration-200" />
          }
        </div>
      </div>

      {isExpanded && (
        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-100 dark:border-gray-800">
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Asset Name</TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Category</TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Status</TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Location</TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Assigned To</TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Resources</TableHead>
                <TableHead className="font-semibold text-gray-700 dark:text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((asset) => (
                <AssetTableRow
                  key={asset.id || asset._id}
                  asset={asset}
                  onAssetClick={onAssetClick}
                  onRemoveFromProject={onRemoveFromProject}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

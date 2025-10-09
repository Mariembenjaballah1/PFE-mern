
import React from 'react';
import { Asset } from '@/types/asset';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Cpu, HardDrive, Database as DatabaseIcon, Trash2 } from 'lucide-react';
import { getStatusColor } from '../utils/assetUtils';

// Helper function to calculate resources from asset data if not present
const calculateResourcesFromAssetData = (asset: Asset) => {
  const vmInfo = asset.vmInfo || {};
  const additionalData = asset.additionalData || {};
  
  // Extract CPU cores
  let cpuCores = 0;
  if (vmInfo.cpus) {
    cpuCores = parseInt(vmInfo.cpus.toString()) || 0;
  } else if (additionalData.cpu) {
    const cpuMatch = additionalData.cpu.toString().match(/\d+/);
    cpuCores = cpuMatch ? parseInt(cpuMatch[0]) : 0;
  }
  
  // Extract RAM in MB
  let ramMB = 0;
  if (vmInfo.memorySize) {
    const memoryStr = vmInfo.memorySize.toString().toLowerCase();
    const memoryMatch = memoryStr.match(/\d+/);
    if (memoryMatch) {
      const memoryValue = parseInt(memoryMatch[0]);
      if (memoryStr.includes('gb')) {
        ramMB = memoryValue * 1024;
      } else {
        ramMB = memoryValue;
      }
    }
  } else if (additionalData.ram) {
    const ramStr = additionalData.ram.toString().toLowerCase();
    const ramMatch = ramStr.match(/\d+/);
    if (ramMatch) {
      const ramValue = parseInt(ramMatch[0]);
      if (ramStr.includes('gb')) {
        ramMB = ramValue * 1024;
      } else {
        ramMB = ramValue;
      }
    }
  }
  
  // Extract Disk in MB
  let diskMB = 0;
  if (vmInfo.provisionedMB) {
    diskMB = parseInt(vmInfo.provisionedMB.toString()) || 0;
  } else if (additionalData.disk) {
    const diskStr = additionalData.disk.toString().toLowerCase();
    const diskMatch = diskStr.match(/\d+/);
    if (diskMatch) {
      const diskValue = parseInt(diskMatch[0]);
      if (diskStr.includes('gb')) {
        diskMB = diskValue * 1024;
      } else if (diskStr.includes('tb')) {
        diskMB = diskValue * 1024 * 1024;
      } else {
        diskMB = diskValue;
      }
    }
  } else if (additionalData.storage) {
    const storageStr = additionalData.storage.toString().toLowerCase();
    const storageMatch = storageStr.match(/\d+/);
    if (storageMatch) {
      const storageValue = parseInt(storageMatch[0]);
      if (storageStr.includes('gb')) {
        diskMB = storageValue * 1024;
      } else if (storageStr.includes('tb')) {
        diskMB = storageValue * 1024 * 1024;
      } else {
        diskMB = storageValue;
      }
    }
  }
  
  return {
    cpu: cpuCores,
    ram: ramMB,
    disk: diskMB
  };
};

interface AssetTableRowProps {
  asset: Asset;
  onAssetClick: (asset: Asset) => void;
  onRemoveFromProject?: (asset: Asset) => void;
}

export const AssetTableRow: React.FC<AssetTableRowProps> = ({ asset, onAssetClick, onRemoveFromProject }) => {
  // Debug logging for asset
  console.log('=== ASSET TABLE ROW DEBUG ===');
  console.log('Asset name:', asset.name);
  console.log('Asset resources:', asset.resources);
  console.log('Asset vmInfo:', asset.vmInfo);
  console.log('Asset additionalData:', asset.additionalData);
  console.log('Asset specs:', asset.specs);
  
  // Get resources from asset or calculate from available data
  const calculatedResources = calculateResourcesFromAssetData(asset);
  console.log('Calculated resources:', calculatedResources);
  
  const resources = asset.resources || calculatedResources;
  console.log('Final resources used:', resources);
  
  const hasResources = resources && (resources.cpu > 0 || resources.ram > 0 || resources.disk > 0);
  console.log('Has resources:', hasResources);
  
  return (
    <TableRow key={asset.id || asset._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors duration-150">
      <TableCell>
        <button
          onClick={() => onAssetClick(asset)}
          className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors duration-150 cursor-pointer text-left"
        >
          {asset.name}
        </button>
      </TableCell>
      <TableCell className="text-gray-600 dark:text-gray-400">{asset.category}</TableCell>
      <TableCell>
        <Badge className={`${getStatusColor(asset.status)} font-medium`}>
          {asset.status}
        </Badge>
      </TableCell>
      <TableCell className="text-gray-600 dark:text-gray-400">{asset.location}</TableCell>
      <TableCell className="text-gray-600 dark:text-gray-400">{asset.assignedTo || 'Unassigned'}</TableCell>
      <TableCell>
        {hasResources ? (
          <div className="text-sm space-y-1">
            {resources.cpu > 0 && (
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Cpu className="h-3 w-3" />
                {resources.cpu} cores
              </div>
            )}
            {resources.ram > 0 && (
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <HardDrive className="h-3 w-3" />
                {resources.ram >= 1024 ? `${(resources.ram / 1024).toFixed(1)} GB` : `${resources.ram} MB`}
              </div>
            )}
            {resources.disk > 0 && (
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <DatabaseIcon className="h-3 w-3" />
                {resources.disk >= 1024 ? `${(resources.disk / 1024).toFixed(1)} GB` : `${resources.disk} MB`}
              </div>
            )}
          </div>
        ) : (
          <span className="text-gray-400 text-sm italic">No resources</span>
        )}
      </TableCell>
      <TableCell>
        {onRemoveFromProject && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveFromProject(asset);
            }}
            className="text-red-600 hover:text-red-800 hover:bg-red-50 h-8 w-8 p-0"
            title="Remove from project"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};

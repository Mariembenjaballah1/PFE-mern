
import React from 'react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Asset } from '@/types/asset';
import { Skeleton } from '@/components/ui/skeleton';
import AssetActionsMenu from './AssetActionsMenu';
import { useNavigate } from 'react-router-dom';

interface AssetsTableProps {
  assets: Asset[];
  isLoading?: boolean;
  onEdit?: (asset: Asset) => void;
  onDelete?: (assetId: string) => void;
  currentUser?: { name: string; role: string };
}

const AssetsTable: React.FC<AssetsTableProps> = ({ 
  assets, 
  isLoading = false,
  onEdit,
  onDelete,
  currentUser
}) => {
  const navigate = useNavigate();
  
  const handleViewDetails = (asset: Asset) => {
    // Use either id or _id for navigation
    const assetId = asset.id || (asset as any)._id;
    if (!assetId) {
      console.error("Cannot view details: Asset has no ID", asset);
      return;
    }
    navigate(`/assets/${assetId}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return <Badge variant="outline" className="border-green-500 text-green-500 animate-pulse transition-all duration-500">Operational</Badge>;
      case 'maintenance':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-500 animate-fade-in transition-all duration-300">Maintenance</Badge>;
      case 'repair':
        return <Badge variant="outline" className="border-red-500 text-red-500 animate-pulse transition-all duration-700">Repair</Badge>;
      case 'retired':
        return <Badge variant="outline" className="border-gray-500 text-gray-500 transition-all duration-300">Retired</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Asset Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Last Update</TableHead>
              {(onEdit || onDelete) && <TableHead className="w-[60px]"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(5).fill(0).map((_, index) => (
              <TableRow key={index}>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                {(onEdit || onDelete) && <TableCell><Skeleton className="h-8 w-8" /></TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  // More flexible asset filtering - accept assets with either id or _id
  const validAssets = assets.filter(asset => !!(asset.id || (asset as any)._id));
  
  console.log('Assets in table:', assets);
  console.log('Valid assets after filtering:', validAssets);

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Asset Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Last Update</TableHead>
            <TableHead className="w-[60px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {validAssets.map((asset) => {
            const assetId = asset.id || (asset as any)._id;
            const displayId = assetId || 'N/A';
            
            return (
              <TableRow 
                key={assetId || Math.random()} 
                className="cursor-pointer hover:bg-muted/60" 
                onClick={() => handleViewDetails(asset)}
              >
                <TableCell className="font-medium">{displayId}</TableCell>
                <TableCell>{asset.name}</TableCell>
                <TableCell>{asset.category}</TableCell>
                <TableCell>{getStatusBadge(asset.status)}</TableCell>
                <TableCell>{asset.location}</TableCell>
                <TableCell>{asset.assignedTo || 'Unassigned'}</TableCell>
                <TableCell>{new Date(asset.lastUpdate).toLocaleDateString()}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <AssetActionsMenu 
                    asset={asset} 
                    onEdit={onEdit || (() => {})} 
                    onDelete={onDelete || (() => {})}
                    onViewDetails={() => handleViewDetails(asset)}
                    currentUser={currentUser}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {validAssets.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-muted-foreground">No assets match your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default AssetsTable;

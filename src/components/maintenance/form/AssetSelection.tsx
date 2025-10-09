
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAssets } from '@/services/assetApi';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMaintenanceForm } from './MaintenanceFormContext';
import { Loader2, RefreshCw } from 'lucide-react';
import { Asset } from '@/types/asset';
import { Button } from '@/components/ui/button';

const AssetSelection = () => {
  const { form } = useMaintenanceForm();
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  // Updated to use proper TanStack Query format with dynamic filtering
  const { data: assets = [], isLoading, refetch } = useQuery<Asset[]>({
    queryKey: ['assets', categoryFilter ? { category: categoryFilter } : {}],
    queryFn: fetchAssets,
    staleTime: 60000, // 1 minute
  });
  
  // Function to get asset ID based on the type of asset response
  const getAssetId = (asset: Asset | any): string => {
    return asset.id || asset._id || '';
  };

  // Get unique categories for filter with proper type safety
  const categories = Array.from(new Set(
    assets
      .map(asset => asset.category)
      .filter((category): category is string => typeof category === 'string')
  ));
  
  // Reset selected asset when category changes
  useEffect(() => {
    if (categoryFilter) {
      form.setValue('asset', '');
    }
  }, [categoryFilter, form]);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Select 
            value={categoryFilter || "all-categories"} 
            onValueChange={(value) => setCategoryFilter(value === "all-categories" ? null : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-categories">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category || "Unnamed Category"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <FormField
        control={form.control}
        name="asset"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Asset</FormLabel>
            <Select onValueChange={field.onChange} value={field.value || "no-selection"}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select asset" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="no-selection">Select an asset</SelectItem>
                {isLoading ? (
                  <SelectItem value="loading-assets">Loading assets...</SelectItem>
                ) : assets.length > 0 ? (
                  assets.map((asset) => {
                    const id = getAssetId(asset);
                    const categoryDisplay = asset.category || "No Category";
                    return (
                      <SelectItem key={id} value={id}>
                        {asset.name} - {categoryDisplay}
                      </SelectItem>
                    );
                  })
                ) : (
                  <SelectItem value="no-assets-found">No assets found</SelectItem>
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AssetSelection;

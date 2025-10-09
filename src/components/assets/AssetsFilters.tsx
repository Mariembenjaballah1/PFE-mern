
import React, { useEffect } from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { getAssetCategories, getAssetStatuses } from '@/services/assetService';

interface AssetsFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterCategory: string;
  setFilterCategory: (category: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterProject: string;
  setFilterProject: (project: string) => void;
  categories: string[];
  statuses: string[];
  projects: string[];
  onRefresh?: () => void;
}

const AssetsFilters: React.FC<AssetsFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  filterCategory,
  setFilterCategory,
  filterStatus,
  setFilterStatus,
  filterProject,
  setFilterProject,
  categories,
  statuses,
  projects,
  onRefresh
}) => {
  // For realtime category updates
  const { data: dynamicCategories = [] } = useQuery({
    queryKey: ['assetCategories'],
    queryFn: getAssetCategories,
    staleTime: 300000, // 5 minutes
  });

  // For realtime status updates
  const { data: dynamicStatuses = [] } = useQuery({
    queryKey: ['assetStatuses'],
    queryFn: getAssetStatuses,
    staleTime: 300000, // 5 minutes
  });

  // Merge server-fetched categories with prop categories for better coordination
  const mergedCategories = [...new Set([...categories, ...dynamicCategories])];
  const mergedStatuses = [...new Set([...statuses, ...dynamicStatuses])];

  // Reset filters when categories change
  useEffect(() => {
    if (filterCategory && !mergedCategories.includes(filterCategory) && filterCategory !== 'all-categories') {
      setFilterCategory('all-categories');
    }
  }, [mergedCategories, filterCategory, setFilterCategory]);

  // Reset project filter when projects change
  useEffect(() => {
    if (filterProject && !projects.includes(filterProject) && filterProject !== 'all-projects') {
      setFilterProject('all-projects');
    }
  }, [projects, filterProject, setFilterProject]);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search assets by name or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm">Filters:</span>
      </div>
      <Select value={filterCategory} onValueChange={setFilterCategory}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all-categories">All Categories</SelectItem>
          {mergedCategories.map(category => (
            <SelectItem key={category} value={category || "undefined-category"}>{category || "Undefined Category"}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={filterStatus} onValueChange={setFilterStatus}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all-statuses">All Statuses</SelectItem>
          {mergedStatuses.map(status => (
            <SelectItem key={status} value={status || "undefined-status"}>
              {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Undefined Status"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={filterProject} onValueChange={setFilterProject}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Project" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all-projects">All Projects</SelectItem>
          {projects.map(project => (
            <SelectItem key={project} value={project}>{project}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      {onRefresh && (
        <Button variant="outline" onClick={onRefresh} className="h-10 px-3">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      )}
    </div>
  );
};

export default AssetsFilters;

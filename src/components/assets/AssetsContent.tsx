
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AssetsFilters from '@/components/assets/AssetsFilters';
import AssetsTable from '@/components/assets/AssetsTable';
import { Asset } from '@/types/asset';
import { useToast } from '@/hooks/use-toast';

interface AssetsContentProps {
  viewMode: 'all' | 'assigned';
  setViewMode: (value: 'all' | 'assigned') => void;
  showAssignedTab: boolean;
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
  displayedAssets: Asset[];
  isLoading: boolean;
  onRefresh: () => void;
  onEdit: (asset: Asset) => void;
  onDelete: (assetId: string) => void;
  currentUser: { name: string; role: string };
}

const AssetsContent: React.FC<AssetsContentProps> = ({
  viewMode,
  setViewMode,
  showAssignedTab,
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
  displayedAssets,
  isLoading,
  onRefresh,
  onEdit,
  onDelete,
  currentUser
}) => {
  const { toast } = useToast();

  if (showAssignedTab) {
    return (
      <div className="space-y-6">
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'all' | 'assigned')}>
          <TabsList className="mb-6 bg-gray-100/50">
            <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              All Assets
            </TabsTrigger>
            <TabsTrigger value="assigned" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Assigned to Me
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6">
            <AssetsFilters 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filterProject={filterProject}
              setFilterProject={setFilterProject}
              categories={categories}
              statuses={statuses}
              projects={projects}
              onRefresh={onRefresh}
            />
            
            <AssetsTable 
              assets={displayedAssets} 
              isLoading={isLoading} 
              onEdit={onEdit}
              onDelete={onDelete}
              currentUser={currentUser}
            />
          </TabsContent>
          
          <TabsContent value="assigned" className="space-y-6">
            <AssetsFilters 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filterProject={filterProject}
              setFilterProject={setFilterProject}
              categories={categories}
              statuses={statuses}
              projects={projects}
              onRefresh={onRefresh}
            />
            
            <AssetsTable 
              assets={displayedAssets} 
              isLoading={isLoading}
              onEdit={onEdit}
              onDelete={onDelete}
              currentUser={currentUser}
            />
          </TabsContent>
        </Tabs>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <AssetsFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        filterProject={filterProject}
        setFilterProject={setFilterProject}
        categories={categories}
        statuses={statuses}
        projects={projects}
        onRefresh={onRefresh}
      />
      
      <AssetsTable 
        assets={displayedAssets} 
        isLoading={isLoading}
        onEdit={onEdit}
        onDelete={onDelete}
        currentUser={currentUser}
      />
    </div>
  );
};

export default AssetsContent;

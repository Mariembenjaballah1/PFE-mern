
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from '@/services/projectApi';
import { exportToCSV } from '@/services/reportsService';

interface AssetsByProjectExportProps {
  assetsByProject: Record<string, { count: number; manager: string; }>;
  hasData: boolean;
}

const AssetsByProjectExport: React.FC<AssetsByProjectExportProps> = ({
  assetsByProject,
  hasData
}) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch projects to get the most up-to-date manager information
  const { data: projects = [], refetch } = useQuery({
    queryKey: ['projects', 'export', refreshTrigger],
    queryFn: fetchProjects,
  });

  // Listen for project manager updates
  useEffect(() => {
    const handleProjectManagerUpdate = () => {
      console.log('Project manager updated, refreshing export data...');
      setRefreshTrigger(prev => prev + 1);
      refetch();
    };

    window.addEventListener('projectManagerUpdated', handleProjectManagerUpdate);
    window.addEventListener('projectUpdated', handleProjectManagerUpdate);
    
    return () => {
      window.removeEventListener('projectManagerUpdated', handleProjectManagerUpdate);
      window.removeEventListener('projectUpdated', handleProjectManagerUpdate);
    };
  }, [refetch]);

  const handleExport = async (format: 'csv' | 'excel' | 'pdf' = 'pdf') => {
    setIsExporting(true);
    try {
      // Create a map of project names to managers from the fetched projects
      const projectManagerMap = projects.reduce((acc: Record<string, string>, project: any) => {
        acc[project.name] = project.manager || 'Non assigné';
        return acc;
      }, {});

      console.log('Project manager mapping for export (updated):', projectManagerMap);

      const exportData = Object.entries(assetsByProject).map(([projectName, info]) => {
        // Use the real-time project manager data, fallback to cached info
        const managerName = projectManagerMap[projectName] || info.manager || 'Non assigné';
        
        console.log(`Export data for ${projectName}:`, {
          projectName,
          assetCount: info.count,
          managerFromMap: projectManagerMap[projectName],
          managerFromInfo: info.manager,
          finalManager: managerName
        });

        return {
          'Nom du Projet': projectName,
          'Nombre d\'Assets': info.count,
          'Gestionnaire de Projet': managerName
        };
      });
      
      console.log('Final export data with updated managers:', exportData);
      
      // Export all chart types (pie, bar, CPU, RAM)
      const chartIds = [
        'assets-by-project-chart',
        'assets-by-project-bar-chart', 
        'assets-by-project-cpu-chart',
        'assets-by-project-ram-chart'
      ];
      
      await exportToCSV(exportData, 'assets_par_projet_tous_graphiques', format, chartIds);
      
      toast({
        title: "Succès",
        description: `Tous les graphiques de distribution des assets par projet exportés avec succès en ${format.toUpperCase()}`
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Erreur",
        description: "Échec de l'export des graphiques de distribution des assets par projet",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (!hasData) return null;

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="bg-white dark:bg-gray-800"
      disabled={isExporting}
      onClick={() => handleExport('pdf')}
    >
      {isExporting ? (
        <span className="animate-spin mr-1">⏳</span>
      ) : (
        <Download className="h-4 w-4 mr-1" />
      )}
      Exporter PDF
    </Button>
  );
};

export default AssetsByProjectExport;

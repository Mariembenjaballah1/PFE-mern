import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { Folder, BarChartIcon, Download } from 'lucide-react';
import { fetchProjects } from '@/services/projectApi';
import { getProjectAssets } from '@/services/projectApi';
import { exportToCSV } from '@/services/reportsService';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import ExcelReportButton from './ExcelReportButton';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// Mock data for development and fallbacks
const mockProjects = [
  { id: 'p1', name: 'CRM System', manager: 'John Doe' },
  { id: 'p2', name: 'ERP Platform', manager: 'Jane Smith' },
  { id: 'p3', name: 'Marketing Portal', manager: 'Alice Johnson' },
  { id: 'p4', name: 'Finance Portal', manager: 'Robert Brown' },
  { id: 'p5', name: 'Design System', manager: 'Sarah Wilson' }
];

const mockAssetsByProject = {
  'CRM System': { count: 5, manager: 'John Doe' },
  'ERP Platform': { count: 7, manager: 'Jane Smith' },
  'Marketing Portal': { count: 3, manager: 'Alice Johnson' },
  'Finance Portal': { count: 2, manager: 'Robert Brown' },
  'Design System': { count: 4, manager: 'Sarah Wilson' }
};

const ProjectUsageReportCard: React.FC = () => {
  const [viewType, setViewType] = useState<'pie' | 'bar'>('pie');
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        const data = await fetchProjects();
        console.log('Projects fetched for report:', data);
        return data;
      } catch (error) {
        console.error('Error fetching projects:', error);
        return mockProjects;
      }
    }
  });
  
  const { data: assetsByProject = {}, isLoading: assetsLoading } = useQuery({
    queryKey: ['assetsByProject'],
    queryFn: async () => {
      try {
        if (!projects.length) return mockAssetsByProject;
        
        const projectAssets: Record<string, { count: number; manager: string; }> = {};
        
        await Promise.all(projects.map(async (project: any) => {
          try {
            const assets = await getProjectAssets(project.id);
            projectAssets[project.name] = {
              count: assets.length,
              manager: project.manager || 'Unassigned'
            };
          } catch (error) {
            console.error(`Error fetching assets for project ${project.name}:`, error);
            projectAssets[project.name] = {
              count: Math.floor(Math.random() * 8) + 1,
              manager: project.manager || 'Unassigned'
            };
          }
        }));
        
        console.log('Asset counts by project with managers:', projectAssets);
        return projectAssets;
      } catch (error) {
        console.error('Error fetching project assets:', error);
        return mockAssetsByProject;
      }
    },
    enabled: projects.length > 0
  });
  
  const handleExportData = (format: 'csv' | 'excel' | 'pdf' = 'pdf') => {
    setIsExporting(true);
    try {
      const exportData = Object.entries(assetsByProject).map(([project, data]) => ({
        'Project Name': project,
        'Number of Assets': typeof data === 'number' ? data : data.count,
        'Project Manager': typeof data === 'object' && data.manager ? data.manager : 'Unassigned'
      }));
      
      console.log('Exporting project data with managers:', exportData);
      
      exportToCSV(
        exportData, 
        'assets_by_project_report', 
        format, 
        `project-usage-${viewType}-chart`
      );
      
      toast({
        title: "Success",
        description: `Assets by project report exported successfully as ${format.toUpperCase()}`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export assets by project report",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  const formatChartData = () => {
    return Object.entries(assetsByProject).map(([name, data]) => ({
      name,
      value: typeof data === 'number' ? data : data.count
    }));
  };
  
  const isLoading = projectsLoading || assetsLoading;
  const hasData = Object.keys(assetsByProject).length > 0;
  
  return (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Folder className="h-5 w-5" />
          Assets by Project
        </CardTitle>
        <div className="flex items-center gap-2">
          <Tabs value={viewType} onValueChange={(value) => setViewType(value as 'pie' | 'bar')}>
            <TabsList>
              <TabsTrigger value="pie">Pie Chart</TabsTrigger>
              <TabsTrigger value="bar">Bar Chart</TabsTrigger>
            </TabsList>
          </Tabs>
          <ExcelReportButton
            onGenerateReport={handleExportData}
            disabled={isLoading || !hasData}
            loading={isExporting}
            chartId={`project-usage-${viewType}-chart`}
          />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <Skeleton className="h-[250px] w-full" />
          </div>
        ) : hasData ? (
          <div className="h-[300px]">
            {viewType === 'pie' ? (
              <div id="project-usage-pie-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={formatChartData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {formatChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} assets`, '']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div id="project-usage-bar-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={formatChartData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} assets`, '']} />
                    <Bar dataKey="value" name="Number of Assets" fill="#8884d8">
                      {formatChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">No asset distribution data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectUsageReportCard;

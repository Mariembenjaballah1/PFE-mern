import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Folder, 
  Server, 
  Database, 
  ChevronDown, 
  ChevronUp, 
  Monitor, 
  Laptop, 
  Printer, 
  Network, 
  HardDrive, 
  Cpu,
  Eye,
  BarChart3,
  User
} from 'lucide-react';
import { Asset } from '@/types/asset';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from '@/services/projectApi';

interface ProjectAssignmentCardProps {
  assets: Asset[];
}

const ProjectAssignmentCard: React.FC<ProjectAssignmentCardProps> = ({ assets }) => {
  const navigate = useNavigate();
  const [expandedProjects, setExpandedProjects] = useState<string[]>([]);
  
  // Fetch projects to get manager information
  const { 
    data: projects = [], 
    refetch: refetchProjects 
  } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects
  });

  // Listen for project manager updates from various sources
  useEffect(() => {
    const handleProjectManagerUpdate = (event: CustomEvent) => {
      console.log('ProjectAssignmentCard: Project manager updated, refetching projects...', event.detail);
      refetchProjects();
    };

    const handleProjectUpdate = (event: CustomEvent) => {
      console.log('ProjectAssignmentCard: Project updated, refetching projects...', event.detail);
      refetchProjects();
    };

    const handleForceProjectRefresh = (event: CustomEvent) => {
      console.log('ProjectAssignmentCard: Force project refresh, refetching projects...', event.detail);
      refetchProjects();
    };

    // Listen for all relevant events
    window.addEventListener('projectManagerUpdated', handleProjectManagerUpdate);
    window.addEventListener('projectUpdated', handleProjectUpdate);
    window.addEventListener('forceProjectRefresh', handleForceProjectRefresh);

    return () => {
      window.removeEventListener('projectManagerUpdated', handleProjectManagerUpdate);
      window.removeEventListener('projectUpdated', handleProjectUpdate);
      window.removeEventListener('forceProjectRefresh', handleForceProjectRefresh);
    };
  }, [refetchProjects]);
  
  // Fixed project grouping logic to properly handle project names
  const projectGroups = assets.reduce((groups: Record<string, Asset[]>, asset) => {
    let projectName = 'Unassigned';
    
    // Enhanced project name extraction with proper object handling
    if (asset.project) {
      if (typeof asset.project === 'string') {
        projectName = asset.project;
      } else if (typeof asset.project === 'object' && asset.project !== null) {
        // Handle project object with name property
        if ('name' in asset.project && typeof asset.project.name === 'string') {
          projectName = asset.project.name;
        } else {
          // Fallback for other object structures
          projectName = String(asset.project);
        }
      }
    } else if (asset.projectName && typeof asset.projectName === 'string') {
      projectName = asset.projectName;
    }
    
    console.log('Processing asset project assignment:', {
      assetName: asset.name,
      originalProject: asset.project,
      projectName: asset.projectName,
      resolvedProjectName: projectName
    });
    
    if (!groups[projectName]) {
      groups[projectName] = [];
    }
    groups[projectName].push(asset);
    return groups;
  }, {});

  // Sort projects with Unassigned last
  const sortedProjects = Object.keys(projectGroups).sort((a, b) => {
    if (a === 'Unassigned') return 1;
    if (b === 'Unassigned') return -1;
    return a.localeCompare(b);
  });

  const toggleProject = (project: string) => {
    setExpandedProjects(prev => 
      prev.includes(project) 
        ? prev.filter(p => p !== project)
        : [...prev, project]
    );
  };

  // Helper function to get project manager name with improved lookup
  const getProjectManager = (projectName: string) => {
    if (projectName === 'Unassigned') return 'No Manager';
    
    // Find the project in the fetched projects data
    const project = projects.find((p: any) => p.name === projectName);
    if (project && project.manager && project.manager !== 'Unassigned') {
      console.log(`ProjectAssignmentCard: Found manager for project ${projectName}:`, project.manager);
      return project.manager;
    }
    
    console.log(`ProjectAssignmentCard: No manager found for project ${projectName}, using Unassigned`);
    return 'Unassigned';
  };

  const getAssetIcon = (category: string) => {
    const iconMap: Record<string, JSX.Element> = {
      servers: <Server className="h-4 w-4 text-blue-600" />,
      databases: <Database className="h-4 w-4 text-purple-600" />,
      networking: <Network className="h-4 w-4 text-indigo-600" />,
      laptops: <Laptop className="h-4 w-4 text-green-600" />,
      displays: <Monitor className="h-4 w-4 text-amber-600" />,
      printers: <Printer className="h-4 w-4 text-red-600" />
    };
    return iconMap[category.toLowerCase()] || <HardDrive className="h-4 w-4 text-gray-600" />;
  };

  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      operational: 'bg-green-100 text-green-800 border-green-300',
      maintenance: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      repair: 'bg-red-100 text-red-800 border-red-300',
      retired: 'bg-gray-100 text-gray-800 border-gray-300'
    };
    
    return (
      <Badge 
        variant="outline" 
        className={`text-xs ${statusStyles[status] || 'bg-blue-100 text-blue-800 border-blue-300'}`}
      >
        {status}
      </Badge>
    );
  };

  const handleAssetClick = (asset: Asset) => {
    const assetId = asset.id || asset._id;
    if (assetId) {
      navigate(`/assets/${assetId}`);
    }
  };

  if (sortedProjects.length === 0) {
    return (
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="p-4 bg-gray-100 rounded-full mb-4">
            <Folder className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Project Assignments</h3>
          <p className="text-gray-500">Assets will appear here once they are assigned to projects.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border border-gray-200">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl text-gray-900">Active Assets by Project</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Assets currently assigned to projects</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {assets.length} Total Assets
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="space-y-0">
          {sortedProjects.map((project, index) => {
            const projectAssets = projectGroups[project];
            const isExpanded = expandedProjects.includes(project);
            const managerName = getProjectManager(project);
            
            return (
              <div key={project} className={`border-b border-gray-100 ${index === sortedProjects.length - 1 ? 'border-b-0' : ''}`}>
                <div 
                  className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => toggleProject(project)}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Folder className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{project}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span>
                          {projectAssets.length} {projectAssets.length === 1 ? 'asset' : 'assets'}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          Manager: {managerName}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {projectAssets.filter(a => a.status === 'operational').length} Active
                    </Badge>
                    {isExpanded ? 
                      <ChevronUp className="h-4 w-4 text-gray-400" /> : 
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    }
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="px-4 pb-4">
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                      {projectAssets.map(asset => (
                        <div 
                          key={asset.id || asset._id}
                          className="flex items-center justify-between p-3 bg-white rounded border border-gray-200 hover:border-gray-300 cursor-pointer transition-colors"
                          onClick={() => handleAssetClick(asset)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-gray-50 rounded">
                              {getAssetIcon(asset.category)}
                            </div>
                            <div>
                              <p className="font-medium text-sm text-gray-900">{asset.name}</p>
                              <p className="text-xs text-gray-500">{asset.category}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(asset.status)}
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectAssignmentCard;


import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/DashboardLayout';
import { ProjectsList } from '@/components/projects/ProjectsList';
import { AddProjectDialog } from '@/components/projects/AddProjectDialog';
import { ProjectDetailsDialog } from '@/components/projects/dialogs/ProjectDetailsDialog';
import { fetchProjects } from '@/services/projectApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertCircle, FolderOpen, Plus, Briefcase, Users, Target, TrendingUp } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Project } from '@/types/asset';

const ProjectsPage: React.FC = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const { 
    data: projects = [], 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setIsDetailsDialogOpen(true);
  };

  const handleAddProject = () => {
    setIsAddDialogOpen(true);
  };

  const handleProjectAdded = () => {
    refetch();
    setIsAddDialogOpen(false);
  };

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
          <div className="container mx-auto px-6 py-8 space-y-8">
            {/* Enhanced Header */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-lg mb-6 animate-pulse">
                <FolderOpen className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-4">
                <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Project Management
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Comprehensive project oversight and resource allocation
                </p>
              </div>
            </div>

            {/* Loading Card */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="flex items-center justify-center p-20">
                <div className="text-center space-y-6">
                  <Loader2 className="h-16 w-16 animate-spin text-blue-500 mx-auto" />
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold">Loading Projects</h3>
                    <p className="text-muted-foreground">Gathering project information...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show error state if any data fails to load
  if (error) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50/30">
          <div className="container mx-auto px-6 py-8 space-y-8">
            {/* Enhanced Header */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-3xl shadow-lg mb-6">
                <AlertCircle className="h-10 w-10 text-red-600" />
              </div>
              <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Project Management
              </h1>
            </div>

            {/* Error Alert */}
            <Alert variant="destructive" className="max-w-2xl mx-auto shadow-xl">
              <AlertCircle className="h-5 w-5" />
              <AlertDescription className="text-base">
                There was an error loading the projects data. Please try refreshing the page or contact support if the issue persists.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const onHoldProjects = projects.filter(p => p.status === 'on-hold').length;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="container mx-auto px-6 py-8 space-y-8">
          {/* Enhanced Header Section */}
          <div className="text-center space-y-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-lg mb-6 animate-fade-in">
              <FolderOpen className="h-10 w-10 text-white" />
            </div>
            
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent animate-fade-in">
                Project Management
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed animate-fade-in" style={{animationDelay: '100ms'}}>
                Comprehensive project oversight and resource allocation. 
                Manage teams, track progress, and optimize resource utilization across all projects.
              </p>
            </div>

            {/* Enhanced Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 max-w-6xl mx-auto animate-fade-in" style={{animationDelay: '200ms'}}>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md">
                    <Briefcase className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-blue-700">{projects.length}</p>
                    <p className="text-sm font-medium text-blue-600">Total Projects</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-green-700">{activeProjects}</p>
                    <p className="text-sm font-medium text-green-600">Active Projects</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 shadow-lg border border-purple-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-purple-700">{completedProjects}</p>
                    <p className="text-sm font-medium text-purple-600">Completed</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 shadow-lg border border-orange-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="flex items-center space-x-4">
                  <div className="p-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-md">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-orange-700">{onHoldProjects}</p>
                    <p className="text-sm font-medium text-orange-600">On Hold</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Project Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border-0 p-8 animate-fade-in" style={{animationDelay: '300ms'}}>
            <div className="flex justify-between items-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-gray-900">Projects Overview</h2>
                <p className="text-lg text-muted-foreground">Manage and monitor all your projects</p>
              </div>
              <Button 
                onClick={handleAddProject} 
                className="gap-3 px-6 py-3 text-base bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
                size="lg"
              >
                <Plus className="h-5 w-5" />
                Add Project
              </Button>
            </div>
          </div>
          
          {/* Enhanced Projects List */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border-0 p-8 animate-fade-in" style={{animationDelay: '400ms'}}>
            <ProjectsList 
              projects={projects}
              isLoading={isLoading}
              onSuccess={refetch}
            />
          </div>

          <AddProjectDialog
            open={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onSuccess={handleProjectAdded}
          />

          <ProjectDetailsDialog
            project={selectedProject}
            open={isDetailsDialogOpen}
            onOpenChange={setIsDetailsDialogOpen}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectsPage;

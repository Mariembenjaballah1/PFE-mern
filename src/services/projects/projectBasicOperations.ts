
import api from '../apiClient';
import { Project } from '@/types/asset';

// Helper function to transform MongoDB project to frontend format
const transformProject = (mongoProject: any): Project => {
  console.log('projectBasicOperations: Transforming MongoDB project:', mongoProject);
  
  const { _id, __v, createdAt, updatedAt, ...rest } = mongoProject;
  
  // Ensure we have a valid ID - use _id from MongoDB or fallback to existing id
  const projectId = _id?.toString() || mongoProject.id?.toString() || '';
  
  const transformedProject = {
    ...rest,
    id: projectId
  };
  
  console.log('projectBasicOperations: Transformed project:', transformedProject);
  return transformedProject;
};

// Basic Project CRUD operations
export const fetchProjects = async (): Promise<Project[]> => {
  try {
    console.log('projectBasicOperations: Fetching projects from API...');
    const response = await api.get('/projects');
    console.log('projectBasicOperations: Raw API response for projects:', response.data);
    
    // Ensure we have valid data before transforming
    if (!Array.isArray(response.data)) {
      console.error('projectBasicOperations: Invalid projects data received:', response.data);
      const { mockProjects } = await import('./projectMockData');
      return mockProjects();
    }
    
    // Transform MongoDB projects to frontend format
    const transformedProjects = response.data.map(project => {
      console.log('projectBasicOperations: Processing project from API:', project);
      return transformProject(project);
    });
    console.log('projectBasicOperations: All transformed projects:', transformedProjects);
    
    // Filter out any projects without valid IDs
    const validProjects = transformedProjects.filter(project => {
      const isValid = project.id && project.id.trim() !== '' && project.name && project.name.trim() !== '';
      if (!isValid) {
        console.warn('projectBasicOperations: Filtering out invalid project:', project);
      }
      return isValid;
    });
    console.log('projectBasicOperations: Final valid projects with IDs and managers:', 
      validProjects.map(p => ({ id: p.id, name: p.name, manager: p.manager })));
    
    // Cache projects in localStorage for manager updates
    localStorage.setItem('cached_projects', JSON.stringify(validProjects));
    
    return validProjects;
  } catch (error) {
    console.error('projectBasicOperations: Error fetching projects:', error);
    // Return mock data if API fails for demo
    const { mockProjects } = await import('./projectMockData');
    return mockProjects();
  }
};

export const fetchProjectById = async (id: string): Promise<Project> => {
  try {
    const response = await api.get(`/projects/${id}`);
    return transformProject(response.data);
  } catch (error) {
    console.error(`Error fetching project with ID ${id}:`, error);
    throw error;
  }
};

export const createProject = async (projectData: Omit<Project, 'id'>): Promise<Project> => {
  try {
    console.log('Creating project with data:', projectData);
    const response = await api.post('/projects', projectData);
    console.log('Project created successfully:', response.data);
    const newProject = transformProject(response.data);
    
    // Update cached projects
    const cachedProjects = localStorage.getItem('cached_projects');
    if (cachedProjects) {
      const projects = JSON.parse(cachedProjects);
      projects.push(newProject);
      localStorage.setItem('cached_projects', JSON.stringify(projects));
    }
    
    // Emit global event for project creation
    window.dispatchEvent(new CustomEvent('projectUpdated', { 
      detail: { type: 'create', project: newProject } 
    }));
    
    return newProject;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const updateProject = async (id: string, projectData: Partial<Project>): Promise<Project> => {
  try {
    console.log(`projectBasicOperations: Updating project ${id} with data:`, projectData);
    console.log(`projectBasicOperations: Manager update - from cache vs new:`, {
      cached: localStorage.getItem('cached_projects') ? JSON.parse(localStorage.getItem('cached_projects')!).find((p: any) => p.id === id)?.manager : 'not found',
      new: projectData.manager
    });
    
    // Check if this is a mock project ID (like P001, P002, etc.)
    if (id.match(/^P\d+$/)) {
      console.warn('projectBasicOperations: Attempting to update mock project with ID:', id);
      throw new Error('Cannot update mock project data. Please create a new project instead.');
    }
    
    const response = await api.patch(`/projects/${id}`, projectData);
    console.log('projectBasicOperations: Project updated successfully on server:', response.data);
    const updatedProject = transformProject(response.data);
    console.log('projectBasicOperations: Transformed updated project:', updatedProject);
    
    // Update cached projects immediately
    const cachedProjects = localStorage.getItem('cached_projects');
    if (cachedProjects) {
      const projects = JSON.parse(cachedProjects);
      const projectIndex = projects.findIndex((p: any) => p.id === id);
      if (projectIndex >= 0) {
        projects[projectIndex] = updatedProject;
        localStorage.setItem('cached_projects', JSON.stringify(projects));
        console.log('projectBasicOperations: Updated cached projects with new manager:', updatedProject.manager);
      }
    }
    
    // Emit global event for project update - this will notify all components
    console.log('projectBasicOperations: Emitting projectUpdated event for:', updatedProject);
    window.dispatchEvent(new CustomEvent('projectUpdated', { 
      detail: { type: 'update', project: updatedProject } 
    }));
    
    // Special event for manager updates to ensure all components refresh
    if (projectData.manager) {
      console.log('projectBasicOperations: Emitting projectManagerUpdated event with details:', {
        projectId: id,
        projectName: updatedProject.name,
        managerName: projectData.manager
      });
      window.dispatchEvent(new CustomEvent('projectManagerUpdated', {
        detail: { projectId: id, projectName: updatedProject.name, managerName: projectData.manager }
      }));
    }
    
    return updatedProject;
  } catch (error) {
    console.error(`projectBasicOperations: Error updating project with ID ${id}:`, error);
    throw error;
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  try {
    console.log(`Deleting project with ID: ${id}`);
    
    // Check if this is a mock project ID
    if (id.match(/^P\d+$/)) {
      console.warn('projectBasicOperations: Attempting to delete mock project with ID:', id);
      throw new Error('Cannot delete mock project data.');
    }
    
    await api.delete(`/projects/${id}`);
    console.log('Project deleted successfully');
    
    // Update cached projects
    const cachedProjects = localStorage.getItem('cached_projects');
    if (cachedProjects) {
      const projects = JSON.parse(cachedProjects);
      const filteredProjects = projects.filter((p: any) => p.id !== id);
      localStorage.setItem('cached_projects', JSON.stringify(filteredProjects));
    }
    
    // Emit global event for project deletion
    window.dispatchEvent(new CustomEvent('projectUpdated', { 
      detail: { type: 'delete', projectId: id } 
    }));
  } catch (error) {
    console.error(`projectBasicOperations: Error deleting project with ID ${id}:`, error);
    throw error;
  }
};

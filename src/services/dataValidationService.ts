
import { Project } from '@/types/asset';
import { fetchProjects } from './projectApi';

export class DataValidationService {
  // Validate project data consistency
  static async validateProjectData(): Promise<{
    isValid: boolean;
    issues: string[];
    projects: Project[];
  }> {
    const issues: string[] = [];
    
    try {
      const projects = await fetchProjects();
      
      // Check for duplicate projects
      const projectNames = projects.map(p => p.name);
      const duplicateNames = projectNames.filter((name, index) => 
        projectNames.indexOf(name) !== index
      );
      
      if (duplicateNames.length > 0) {
        issues.push(`Duplicate project names found: ${duplicateNames.join(', ')}`);
      }
      
      // Check for projects without managers
      const projectsWithoutManagers = projects.filter(p => 
        !p.manager || p.manager === 'Auto-assigned' || p.manager.trim() === ''
      );
      
      if (projectsWithoutManagers.length > 0) {
        issues.push(`Projects without proper managers: ${projectsWithoutManagers.map(p => p.name).join(', ')}`);
      }
      
      // Check for invalid dates
      const projectsWithInvalidDates = projects.filter(p => {
        const startDate = new Date(p.startDate);
        const endDate = p.endDate ? new Date(p.endDate) : null;
        
        return isNaN(startDate.getTime()) || 
               (endDate && isNaN(endDate.getTime())) ||
               (endDate && endDate < startDate);
      });
      
      if (projectsWithInvalidDates.length > 0) {
        issues.push(`Projects with invalid dates: ${projectsWithInvalidDates.map(p => p.name).join(', ')}`);
      }
      
      console.log('Data validation completed:', {
        totalProjects: projects.length,
        issuesFound: issues.length,
        issues
      });
      
      return {
        isValid: issues.length === 0,
        issues,
        projects
      };
      
    } catch (error) {
      console.error('Error validating project data:', error);
      return {
        isValid: false,
        issues: ['Failed to fetch project data for validation'],
        projects: []
      };
    }
  }
  
  // Fix auto-assigned managers
  static async fixAutoAssignedManagers(projects: Project[]): Promise<void> {
    const autoAssignedProjects = projects.filter(p => 
      p.manager === 'Auto-assigned' || !p.manager || p.manager.trim() === ''
    );
    
    console.log(`Found ${autoAssignedProjects.length} projects with auto-assigned managers`);
    
    // In a real implementation, you would update these projects
    // For now, we'll just log the issue
    autoAssignedProjects.forEach(project => {
      console.log(`Project "${project.name}" needs manager assignment`);
    });
  }
  
  // Validate data consistency between dashboard and projects page
  static validateDataConsistency(dashboardData: any, projectsData: Project[]): {
    isConsistent: boolean;
    issues: string[];
  } {
    const issues: string[] = [];
    
    // Check if project counts match
    if (dashboardData?.projects?.count !== projectsData.length) {
      issues.push(`Project count mismatch: Dashboard shows ${dashboardData?.projects?.count}, Projects page shows ${projectsData.length}`);
    }
    
    // Check if active project counts match
    const activeProjects = projectsData.filter(p => p.status === 'active').length;
    const dashboardActiveProjects = dashboardData?.activeProjects;
    
    if (dashboardActiveProjects && dashboardActiveProjects !== activeProjects) {
      issues.push(`Active project count mismatch: Dashboard shows ${dashboardActiveProjects}, actual count is ${activeProjects}`);
    }
    
    return {
      isConsistent: issues.length === 0,
      issues
    };
  }
}

export default DataValidationService;

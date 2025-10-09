// Team member storage service to manage project team members
interface StoredTeamMember {
  projectId: string;
  userId: string;
  userName: string;
  userEmail: string;
  role: string;
  addedAt: string;
}

const STORAGE_KEY = 'project_team_members';

export const teamMemberService = {
  // Add a team member to a project
  addTeamMember: async (projectId: string, user: any, role: string): Promise<void> => {
    const members = teamMemberService.getTeamMembers();
    const newMember: StoredTeamMember = {
      projectId,
      userId: user._id || user.id,
      userName: user.name,
      userEmail: user.email,
      role,
      addedAt: new Date().toISOString()
    };
    
    // Check if member already exists
    const existingIndex = members.findIndex(
      m => m.projectId === projectId && m.userId === newMember.userId
    );
    
    let activityAction = '';
    if (existingIndex >= 0) {
      // Update existing member's role
      const oldRole = members[existingIndex].role;
      members[existingIndex] = newMember;
      activityAction = `Updated ${user.name}'s role from ${oldRole} to ${role}`;
    } else {
      // Add new member
      members.push(newMember);
      activityAction = `Added ${user.name} to team as ${role}`;
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
    console.log('Team member added:', newMember);
    
    // Log activity in Recent Activities
    await teamMemberService.logTeamActivity({
      user: 'System',
      action: activityAction,
      asset: `Project: ${await teamMemberService.getProjectName(projectId)}`
    });
    
    // If the role is Project Manager, update the project manager FIRST
    if (role === 'Project Manager') {
      console.log('teamMemberService: Adding Project Manager, updating project immediately...');
      console.log('teamMemberService: Project ID for update:', projectId);
      console.log('teamMemberService: Manager name for update:', user.name);
      
      try {
        await teamMemberService.updateProjectManagerEverywhere(projectId, user.name);
        console.log('teamMemberService: Project manager update completed successfully');
      } catch (error) {
        console.error('teamMemberService: Failed to update project manager:', error);
        throw error; // Re-throw to let the calling code handle it
      }
    }
  },

  // Remove a team member from a project
  removeTeamMember: async (projectId: string, userId: string): Promise<void> => {
    const members = teamMemberService.getTeamMembers();
    const memberToRemove = members.find(m => m.projectId === projectId && (m.userId === userId || m.userName === userId));
    
    if (memberToRemove) {
      // Log removal activity
      const projectName = await teamMemberService.getProjectName(projectId);
      await teamMemberService.logTeamActivity({
        user: 'System',
        action: `Removed ${memberToRemove.userName} from team (was ${memberToRemove.role})`,
        asset: `Project: ${projectName}`
      });
    }
    
    const filtered = members.filter(
      m => !(m.projectId === projectId && (m.userId === userId || m.userName === userId))
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    console.log('Team member removed:', { projectId, userId });
  },

  // Helper function to get project name for activity logging
  getProjectName: async (projectId: string): Promise<string> => {
    try {
      // First try to get from fresh API call
      const { fetchProjects } = await import('./projectApi');
      const projects = await fetchProjects();
      const project = projects.find((p: any) => p.id === projectId);
      if (project?.name) {
        return project.name;
      }
      
      // Fallback to cached data
      const cachedProjects = localStorage.getItem('cached_projects');
      if (cachedProjects) {
        const cachedProjectsData = JSON.parse(cachedProjects);
        const cachedProject = cachedProjectsData.find((p: any) => p.id === projectId);
        return cachedProject?.name || 'Unknown Project';
      }
    } catch (error) {
      console.error('Error getting project name:', error);
    }
    return 'Unknown Project';
  },

  // Log team member activities
  logTeamActivity: async (activity: { user: string; action: string; asset?: string }): Promise<void> => {
    try {
      // Import and use the activity API to log the activity
      const { addActivity } = await import('./activitiesApi');
      await addActivity({
        user: activity.user,
        action: activity.action,
        asset: activity.asset
      });
      
      // Dispatch custom event to trigger refresh of activities
      window.dispatchEvent(new CustomEvent('activityAdded', {
        detail: activity
      }));
      
      console.log('Team activity logged:', activity);
    } catch (error) {
      console.error('Error logging team activity:', error);
    }
  },

  // Enhanced method to update project manager everywhere with better error handling
  updateProjectManagerEverywhere: async (projectId: string, managerName: string): Promise<void> => {
    console.log('teamMemberService: Starting updateProjectManagerEverywhere');
    console.log('teamMemberService: Project ID:', projectId);
    console.log('teamMemberService: Manager Name:', managerName);
    
    try {
      // 1. Update the project on the server FIRST using the project API
      console.log('teamMemberService: Updating project on server...');
      const { updateProject } = await import('./projectApi');
      
      const updateData = { manager: managerName };
      console.log('teamMemberService: Calling updateProject with:', { projectId, updateData });
      
      const updatedProject = await updateProject(projectId, updateData);
      console.log('teamMemberService: Server update successful, result:', updatedProject);
      
      // 2. Update local cache AFTER server update succeeds
      console.log('teamMemberService: Updating local cache...');
      teamMemberService.updateProjectManager(projectId, managerName);
      
      // 3. Clear ALL cached data to force fresh fetch
      console.log('teamMemberService: Clearing all cached data...');
      localStorage.removeItem('cached_projects');
      
      // 4. Log project manager update activity
      const projectName = await teamMemberService.getProjectName(projectId);
      await teamMemberService.logTeamActivity({
        user: 'System',
        action: `Project manager updated to ${managerName}`,
        asset: `Project: ${projectName}`
      });
      
      // 5. Emit immediate refresh events with retry mechanism
      console.log('teamMemberService: Emitting refresh events...');
      
      const eventData = { 
        projectId, 
        managerName, 
        source: 'team-member-service', 
        timestamp: Date.now() 
      };
      
      // Immediate events
      window.dispatchEvent(new CustomEvent('projectManagerUpdated', { detail: eventData }));
      window.dispatchEvent(new CustomEvent('projectUpdated', { detail: eventData }));
      window.dispatchEvent(new CustomEvent('forceProjectRefresh', { detail: eventData }));
      
      // Delayed events to ensure all components process the change
      setTimeout(() => {
        console.log('teamMemberService: Emitting delayed refresh events...');
        window.dispatchEvent(new CustomEvent('projectDataChanged', { detail: eventData }));
        window.dispatchEvent(new CustomEvent('refetchAllProjectData', { detail: eventData }));
      }, 100);
      
      // Additional delayed event for maximum reliability
      setTimeout(() => {
        console.log('teamMemberService: Final refresh event...');
        window.dispatchEvent(new CustomEvent('projectManagerUpdated', { 
          detail: { ...eventData, delayed: true } 
        }));
      }, 500);
      
      console.log('teamMemberService: All operations completed successfully');
      
    } catch (error) {
      console.error('teamMemberService: CRITICAL ERROR updating project manager:', error);
      console.error('teamMemberService: Error details:', {
        message: error.message,
        stack: error.stack,
        projectId,
        managerName
      });
      
      // Log error activity
      const projectName = await teamMemberService.getProjectName(projectId);
      await teamMemberService.logTeamActivity({
        user: 'System',
        action: `Failed to update project manager to ${managerName}: ${error.message}`,
        asset: `Project: ${projectName}`
      });
      
      // Even if server update fails, try to emit events to force UI refresh
      window.dispatchEvent(new CustomEvent('projectManagerUpdated', {
        detail: { projectId, managerName, source: 'team-member-add-failed', error: error.message }
      }));
      
      // Re-throw the error so the calling code knows it failed
      throw error;
    }
  },

  // Update project manager in projects data
  updateProjectManager: (projectId: string, managerName: string): void => {
    // Get projects from localStorage if they exist
    const projectsKey = 'cached_projects';
    try {
      const cachedProjects = localStorage.getItem(projectsKey);
      if (cachedProjects) {
        const projects = JSON.parse(cachedProjects);
        const projectIndex = projects.findIndex((p: any) => p.id === projectId);
        
        if (projectIndex >= 0) {
          console.log('teamMemberService: Updating cached project manager from', projects[projectIndex].manager, 'to', managerName);
          projects[projectIndex].manager = managerName;
          localStorage.setItem(projectsKey, JSON.stringify(projects));
          console.log('teamMemberService: Successfully updated cached project manager');
        } else {
          console.warn('teamMemberService: Project not found in cache for ID:', projectId);
          console.warn('teamMemberService: Available project IDs in cache:', projects.map((p: any) => p.id));
        }
      } else {
        console.warn('teamMemberService: No cached projects found');
      }
    } catch (error) {
      console.error('teamMemberService: Error updating project manager in cache:', error);
    }
  },

  // Get all team members
  getTeamMembers: (): StoredTeamMember[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading team members:', error);
      return [];
    }
  },

  // Get team members for a specific project
  getProjectTeamMembers: (projectId: string): StoredTeamMember[] => {
    const allMembers = teamMemberService.getTeamMembers();
    return allMembers.filter(member => member.projectId === projectId);
  },

  // Clear all team members (for testing)
  clearAllTeamMembers: (): void => {
    localStorage.removeItem(STORAGE_KEY);
  }
};

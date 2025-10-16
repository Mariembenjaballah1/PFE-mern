import { useState, useMemo, useCallback } from 'react';
import { Project, Asset } from '@/types/asset';
import { TeamMember } from './TeamMemberCard';
import { teamMemberService } from '@/services/teamMemberService';

export const useTeamData = (project: Project, assets: Asset[]) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshTeamData = useCallback(() => {
    console.log('useTeamData: Refreshing team data');
    setRefreshKey(prev => prev + 1);
  }, []);

  const allMembers: TeamMember[] = useMemo(() => {
    console.log('useTeamData: generating team members for project', project);
    console.log('useTeamData: current project manager is:', project.manager);
    console.log('useTeamData: assets', assets);
    
    // Get unique team members from assets, project manager, and manually added members
    const memberMap = new Map<string, TeamMember>();
    
    // Add official project manager FIRST (this is the ONLY one who gets "Project Manager" badge)
    // IMPORTANT: Only add if manager is not "Unassigned" and exists
    if (project.manager && project.manager !== 'Unassigned' && project.manager !== 'Auto-assigned') {
      const projectManager: TeamMember = {
        name: project.manager,
        role: 'Project Manager',
        email: `${project.manager.toLowerCase().replace(/\s+/g, '.')}@company.com`,
        phone: '+1 (555) 123-4567',
        assetsCount: 0,
        avatar: '',
        status: 'active',
        isOfficialManager: true,
        canChangeRole: true
      };
      memberMap.set(project.manager, projectManager);
      console.log('useTeamData: added official project manager', projectManager);
    }

    // Add team members from assigned assets
    assets.forEach(asset => {
      if (asset.assignedTo && asset.assignedTo !== 'Unassigned') {
        if (!memberMap.has(asset.assignedTo)) {
          const teamMember: TeamMember = {
            name: asset.assignedTo,
            role: 'Team Member',
            email: `${asset.assignedTo.toLowerCase().replace(/\s+/g, '.')}@company.com`,
            phone: '+1 (555) 987-6543',
            assetsCount: 0,
            avatar: '',
            status: 'active',
            isOfficialManager: false, // Asset assignees are never official managers
            canChangeRole: true
          };
          memberMap.set(asset.assignedTo, teamMember);
          console.log('useTeamData: added team member from asset', teamMember);
        }
        
        // Increment asset count for this member
        const member = memberMap.get(asset.assignedTo)!;
        member.assetsCount += 1;
        
        // CRITICAL: If this person is assigned to assets but is NOT the official manager,
        // make sure they are NOT marked as official manager
        if (member.name !== project.manager) {
          member.isOfficialManager = false;
        }
      }
    });

    // Add manually added team members (but avoid duplicates and role conflicts)
    const manualMembers = teamMemberService.getProjectTeamMembers(project.id);
    console.log('useTeamData: manually added members', manualMembers);
    
    // Group manual members by name to handle duplicates
    const membersByName = new Map<string, typeof manualMembers[0]>();
    
    manualMembers.forEach(storedMember => {
      const existing = membersByName.get(storedMember.userName);
      if (!existing || new Date(storedMember.addedAt) > new Date(existing.addedAt)) {
        // Keep the most recent entry for each user
        membersByName.set(storedMember.userName, storedMember);
      }
    });
    
    // Now process the deduplicated manual members
    membersByName.forEach(storedMember => {
      if (!memberMap.has(storedMember.userName)) {
        // This is a new member not in the official manager or asset assignments
        const teamMember: TeamMember = {
          name: storedMember.userName,
          role: storedMember.role,
          email: storedMember.userEmail,
          phone: '+1 (555) 987-6543',
          assetsCount: 0,
          avatar: '',
          status: 'active',
          isOfficialManager: false, // Manual members are never official managers by default
          canChangeRole: true
        };
        memberMap.set(storedMember.userName, teamMember);
        console.log('useTeamData: added manually added member', teamMember);
      } else {
        // Update role if member exists
        const existingMember = memberMap.get(storedMember.userName)!;
        
        // CRITICAL FIX: Only update role if this person is NOT the current official manager
        // OR if they are the official manager but the stored role is NOT "Project Manager"
        if (existingMember.name !== project.manager || 
            (existingMember.name === project.manager && storedMember.role !== 'Project Manager')) {
          
          // If they were the official manager but now have a different role stored,
          // it means they were demoted from Project Manager
          if (existingMember.isOfficialManager && storedMember.role !== 'Project Manager') {
            console.log('useTeamData: detected former project manager with new role', storedMember);
            existingMember.isOfficialManager = false;
          }
          
          existingMember.role = storedMember.role;
          existingMember.email = storedMember.userEmail;
          existingMember.canChangeRole = true;
          console.log('useTeamData: updated existing member role', existingMember);
        }
      }
    });

    // FINAL VALIDATION: Ensure only the current project manager has isOfficialManager = true
    memberMap.forEach((member, name) => {
      if (name === project.manager && project.manager !== 'Unassigned' && project.manager !== 'Auto-assigned') {
        member.isOfficialManager = true;
        member.role = 'Project Manager'; // Force the role to be Project Manager
      } else {
        member.isOfficialManager = false;
      }
    });

    const members = Array.from(memberMap.values());
    console.log('useTeamData: final members list', members);
    console.log('useTeamData: official manager check - project.manager:', project.manager);
    members.forEach(m => {
      console.log(`useTeamData: ${m.name} - isOfficialManager: ${m.isOfficialManager}, role: ${m.role}`);
    });
    
    return members;
  }, [project, assets, refreshKey]);

  const recentActivities = useMemo(() => {
    const activities = [
      {
        user: project.manager,
        action: `${project.manager} was assigned as Project Manager`,
        time: '2 days ago'
      },
      {
        user: 'System',
        action: `${assets.length} assets assigned to project`,
        time: '5 days ago'
      }
    ];

    // Add activities for manually added members (deduplicated)
    const manualMembers = teamMemberService.getProjectTeamMembers(project.id);
    const membersByName = new Map<string, typeof manualMembers[0]>();
    
    manualMembers.forEach(member => {
      const existing = membersByName.get(member.userName);
      if (!existing || new Date(member.addedAt) > new Date(existing.addedAt)) {
        membersByName.set(member.userName, member);
      }
    });
    
    membersByName.forEach(member => {
      activities.unshift({
        user: 'System',
        action: `${member.userName} was added to team as ${member.role}`,
        time: 'Recently'
      });
    });

    return activities;
  }, [project, assets, refreshKey]);

  return {
    allMembers,
    recentActivities,
    refreshTeamData
  };
};


import { Asset } from '@/types/asset';

interface ChatbotContext {
  currentPage?: string;
  recentAssets?: Asset[];
  userRole?: string;
}

export const getEnhancedBotResponse = (
  userMessage: string,
  context?: ChatbotContext
): { text: string; suggestions?: string[]; actions?: string[] } => {
  const lowerCaseMessage = userMessage.toLowerCase();
  
  // Context-aware responses
  if (context?.currentPage === 'projects' && lowerCaseMessage.includes('project')) {
    return {
      text: 'I see you\'re on the Projects page! I can help you create new projects, assign resources, manage team members, or explain project features. What would you like to do?',
      suggestions: ['Create new project', 'Assign assets to project', 'View project timeline', 'Add team member'],
      actions: ['add_project', 'manage_resources']
    };
  }

  // Asset-related with suggestions
  if (lowerCaseMessage.includes('asset')) {
    if (lowerCaseMessage.includes('add') || lowerCaseMessage.includes('create')) {
      return {
        text: 'I can guide you through adding a new asset. You can add servers, laptops, network equipment, and more. Would you like me to walk you through the process?',
        suggestions: ['Add server', 'Add laptop', 'Add network device', 'View asset categories'],
        actions: ['navigate_assets', 'show_asset_form']
      };
    }
    if (lowerCaseMessage.includes('search') || lowerCaseMessage.includes('find')) {
      return {
        text: 'You can search assets by name, category, status, location, or assigned person. The search supports filters for more precise results.',
        suggestions: ['Search by status', 'Filter by location', 'Find unassigned assets', 'Search by category'],
        actions: ['navigate_assets']
      };
    }
    return {
      text: 'Our asset management system tracks all your inventory in real-time. You can add, edit, assign, and monitor assets from the Assets section.',
      suggestions: ['View all assets', 'Add new asset', 'Asset reports', 'Asset maintenance'],
      actions: ['navigate_assets']
    };
  }

  // Enhanced maintenance responses
  if (lowerCaseMessage.includes('maintenance')) {
    if (lowerCaseMessage.includes('schedule') || lowerCaseMessage.includes('plan')) {
      return {
        text: 'I can help you schedule maintenance tasks. You can set recurring schedules, assign technicians, and track completion status.',
        suggestions: ['Schedule preventive maintenance', 'Plan emergency repair', 'View maintenance calendar', 'Assign technician'],
        actions: ['navigate_maintenance', 'schedule_maintenance']
      };
    }
    if (lowerCaseMessage.includes('overdue')) {
      return {
        text: 'Overdue maintenance tasks appear in red on your dashboard and maintenance calendar. You can filter tasks by status to see all overdue items.',
        suggestions: ['View overdue tasks', 'Update task status', 'Reassign overdue maintenance', 'Set reminders'],
        actions: ['navigate_maintenance']
      };
    }
    return {
      text: 'Our maintenance system helps you stay on top of asset upkeep with scheduling, tracking, and automated reminders.',
      suggestions: ['View maintenance schedule', 'Plan new maintenance', 'Check overdue tasks', 'Maintenance reports'],
      actions: ['navigate_maintenance']
    };
  }

  // Enhanced reporting with more options
  if (lowerCaseMessage.includes('report')) {
    return {
      text: 'I can help you generate detailed reports including asset inventory, usage analytics, maintenance history, and project resources. All reports can be exported in multiple formats.',
      suggestions: ['Asset inventory report', 'Usage analytics', 'Maintenance history', 'Project resources', 'Custom report'],
      actions: ['navigate_reports', 'generate_report']
    };
  }

  // User management responses
  if (lowerCaseMessage.includes('user') || lowerCaseMessage.includes('team')) {
    return {
      text: 'I can help you manage users, assign roles, and configure permissions. There are Admin, Technician, and User roles available.',
      suggestions: ['Add new user', 'Manage permissions', 'View user activity', 'Reset password'],
      actions: ['navigate_users', 'manage_permissions']
    };
  }

  // Smart suggestions based on common workflows
  if (lowerCaseMessage.includes('help') || lowerCaseMessage.includes('what can')) {
    return {
      text: 'I can help you with asset management, maintenance scheduling, report generation, user management, and project coordination. What would you like to work on?',
      suggestions: ['Manage assets', 'Schedule maintenance', 'Generate reports', 'Manage users', 'Create projects'],
      actions: ['show_features', 'navigate_dashboard']
    };
  }

  // Default with context-aware suggestions
  const defaultSuggestions = context?.currentPage === 'dashboard' 
    ? ['View recent activities', 'Check maintenance alerts', 'Asset overview', 'Quick actions']
    : ['Show help', 'Navigate dashboard', 'Search assets', 'View reports'];

  return {
    text: 'I\'m here to help with your inventory management needs. Ask me about assets, maintenance, reports, or any other features!',
    suggestions: defaultSuggestions,
    actions: ['show_help']
  };
};

export const getContextualSuggestions = (currentPage: string): string[] => {
  switch (currentPage) {
    case 'assets':
      return ['Add new asset', 'Search assets', 'Filter by status', 'Export asset list'];
    case 'maintenance':
      return ['Schedule maintenance', 'View calendar', 'Check overdue tasks', 'Assign technician'];
    case 'reports':
      return ['Generate inventory report', 'Usage analytics', 'Export to Excel', 'Custom report'];
    case 'projects':
      return ['Create project', 'Assign resources', 'View timeline', 'Manage team'];
    default:
      return ['What can you do?', 'Show dashboard', 'Quick help', 'Navigate to...'];
  }
};

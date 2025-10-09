
export const getBotResponse = (userMessage: string): string => {
  const lowerCaseMessage = userMessage.toLowerCase();
  
  // Common greetings
  if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi') || lowerCaseMessage.includes('hey')) {
    return 'Hello! How can I assist you with your inventory today?';
  } 
  
  // Maintenance related queries
  else if (lowerCaseMessage.includes('maintenance')) {
    if (lowerCaseMessage.includes('schedule') || lowerCaseMessage.includes('plan')) {
      return 'You can schedule maintenance by going to the Maintenance tab and clicking "Plan Maintenance". Would you like me to guide you through the process?';
    } else if (lowerCaseMessage.includes('overdue')) {
      return 'Overdue maintenance tasks are highlighted in red in the Maintenance section. You can filter by status to see all overdue tasks.';
    } else {
      return 'Our maintenance system tracks all scheduled upkeep for your assets. What specific information about maintenance are you looking for?';
    }
  } 
  
  // Asset related queries
  else if (lowerCaseMessage.includes('asset') || lowerCaseMessage.includes('inventory')) {
    if (lowerCaseMessage.includes('add') || lowerCaseMessage.includes('create')) {
      return 'To add a new asset, go to the Assets section and click the "+ Add Asset" button in the top-right corner. You can then fill in the asset details in the form.';
    } else if (lowerCaseMessage.includes('search') || lowerCaseMessage.includes('find')) {
      return 'You can search for assets using the search bar in the Assets section. You can filter by various attributes like status, type, and location.';
    } else {
      return 'Our system tracks all your assets in real-time. You can view them in the Assets section. Would you like more information about a specific asset feature?';
    }
  } 
  
  // Report related queries
  else if (lowerCaseMessage.includes('report')) {
    if (lowerCaseMessage.includes('generate') || lowerCaseMessage.includes('create')) {
      return 'To generate a report, go to the Reports section and select the report type you need. You can customize parameters and export in various formats including Excel and PDF.';
    } else if (lowerCaseMessage.includes('download') || lowerCaseMessage.includes('export')) {
      return 'Reports can be exported as Excel or PDF documents. Look for the export buttons at the top of each report view.';
    } else {
      return 'Our reporting system provides comprehensive insights into your inventory and maintenance activities. What specific report are you interested in?';
    }
  } 
  
  // Email related queries
  else if (lowerCaseMessage.includes('email') || lowerCaseMessage.includes('mail') || lowerCaseMessage.includes('send')) {
    if (lowerCaseMessage.includes('template')) {
      return 'We offer several email templates for common communications. Go to the Email section and check the templates dropdown to select one.';
    } else {
      return 'You can send emails to team members and stakeholders from the Email section. You can attach files and use templates for common communications.';
    }
  }
  
  // Dashboard related queries
  else if (lowerCaseMessage.includes('dashboard') || lowerCaseMessage.includes('overview')) {
    return 'The dashboard provides an overview of your inventory system with key metrics, upcoming maintenance, and recent activities. You can customize the widgets shown there in Settings.';
  }
  
  // Settings related queries
  else if (lowerCaseMessage.includes('settings') || lowerCaseMessage.includes('config') || lowerCaseMessage.includes('preferences')) {
    return 'You can access system settings by clicking on the Settings option in the sidebar. There you can configure notifications, user permissions, and system preferences.';
  }
  
  // Help related queries
  else if (lowerCaseMessage.includes('help') || lowerCaseMessage.includes('guide') || lowerCaseMessage.includes('tutorial')) {
    return 'I can guide you through any feature in the system. Just tell me what you need help with, or you can access the full documentation by clicking the Help icon in the top-right corner.';
  }
  
  // User related queries
  else if (lowerCaseMessage.includes('user') || lowerCaseMessage.includes('account') || lowerCaseMessage.includes('profile')) {
    if (lowerCaseMessage.includes('add') || lowerCaseMessage.includes('create')) {
      return 'To add a new user, go to User Management and click the "Add User" button. Note that you need administrator privileges for this action.';
    } else if (lowerCaseMessage.includes('permission') || lowerCaseMessage.includes('role')) {
      return 'User permissions are managed in the User Management section. There are three main roles: Admin, Technician, and User, each with different access levels.';
    } else {
      return 'User accounts can be managed in the User Management section. What specific information about users are you looking for?';
    }
  }
  
  // Thank you/gratitude responses
  else if (lowerCaseMessage.includes('thanks') || lowerCaseMessage.includes('thank you') || lowerCaseMessage.includes('appreciate')) {
    return 'You\'re welcome! Let me know if you need anything else.';
  }
  
  // Goodbye responses
  else if (lowerCaseMessage.includes('bye') || lowerCaseMessage.includes('goodbye') || lowerCaseMessage.includes('see you')) {
    return 'Goodbye! Feel free to open the chat again whenever you need assistance.';
  }
  
  // Fallback for unrecognized queries
  else {
    return 'I\'m not sure I understand. Could you please rephrase or ask about specific features like assets, maintenance, reports, email, or settings?';
  }
};

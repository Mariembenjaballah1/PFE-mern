
import api from './apiClient';
import { toast } from "@/components/ui/sonner";

export interface EmailData {
  to: string;
  subject: string;
  message: string;
  attachments?: File[];
}

export interface ReceivedEmail {
  id: string;
  from: string;
  to: string;
  subject: string;
  message: string;
  read: boolean;
  date: string;
  attachments?: {name: string, url: string}[];
}

// Helper function to get emails from localStorage
const getStoredEmails = (): ReceivedEmail[] => {
  try {
    const storedEmails = localStorage.getItem('sentEmails');
    return storedEmails ? JSON.parse(storedEmails) : [];
  } catch (e) {
    console.error('Error getting stored emails:', e);
    return [];
  }
};

// Helper function to save emails to localStorage
const storeEmails = (emails: ReceivedEmail[]) => {
  try {
    localStorage.setItem('sentEmails', JSON.stringify(emails));
  } catch (e) {
    console.error('Error storing emails:', e);
  }
};

export const sendEmail = async (emailData: EmailData) => {
  try {
    // Check if we're in development mode where backend may not be available
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: Simulating email send', emailData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Add the sent email to our local storage
      const currentUser = JSON.parse(localStorage.getItem('user') || '{"name":"User","email":"current@user.com"}');
      const sentEmail: ReceivedEmail = {
        id: `email-${Date.now()}`,
        from: currentUser.email || 'current@user.com',
        to: emailData.to,
        subject: emailData.subject,
        message: emailData.message,
        read: true,
        date: new Date().toISOString(),
        attachments: emailData.attachments ? emailData.attachments.map(file => ({
          name: file.name,
          url: '#'
        })) : undefined
      };
      
      // Get existing emails and add the new one
      const storedEmails = getStoredEmails();
      storeEmails([sentEmail, ...storedEmails]);
      
      // Return a mock successful response
      toast.success('Email sent successfully', {
        description: 'In development mode, emails are simulated'
      });
      
      return {
        success: true,
        message: 'Email sent successfully (Development mode)'
      };
    }
    
    // In production, make the actual API call
    const response = await api.post('/email/send', emailData);
    toast.success('Email sent successfully');
    return response.data;
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Show a more detailed error message to help troubleshoot
    toast.error('Failed to send email', {
      description: 'Please check your connection and try again. If the problem persists, contact support.'
    });
    
    // Return a standardized error object
    return {
      success: false,
      message: 'Failed to send email',
      error: error
    };
  }
};

export const getEmailTemplates = async () => {
  try {
    const response = await api.get('/email/templates');
    return response.data;
  } catch (error) {
    console.error('Error fetching email templates:', error);
    
    // Return mock data if API fails
    return [
      { id: 'e1', name: 'Maintenance Notification', subject: 'Upcoming Maintenance for {asset}' },
      { id: 'e2', name: 'Asset Assignment', subject: 'New Asset Assignment: {asset}' },
      { id: 'e3', name: 'Issue Report', subject: 'Issue Report for {asset}' },
    ];
  }
};

export const getReceivedEmails = async () => {
  try {
    // In production, make the actual API call
    if (process.env.NODE_ENV !== 'development') {
      const response = await api.get('/email/inbox');
      return response.data;
    }
    
    // In development, return mock data plus stored sent emails
    console.log('Development mode: Returning mock inbox data and sent emails');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Get stored sent emails
    const storedEmails = getStoredEmails();
    console.log('Stored sent emails:', storedEmails);
    
    // Combine mock data with stored sent emails
    const mockEmails = [
      {
        id: 'e1',
        from: 'john.doe@example.com',
        to: 'current@user.com',
        subject: 'Maintenance Report - Server Room A',
        message: 'Dear Team,\n\nThe scheduled maintenance for Server Room A has been completed. All systems are now operational. Please find the detailed report attached.\n\nBest regards,\nJohn Doe',
        read: false,
        date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        attachments: [
          { name: 'maintenance-report.pdf', url: '#' }
        ]
      },
      {
        id: 'e2',
        from: 'sarah.tech@example.com',
        to: 'current@user.com',
        subject: 'Urgent: Network Switch Replacement',
        message: 'Hi,\n\nWe need to schedule an urgent replacement for the main network switch. Several ports have failed and it\'s affecting connectivity in the east wing.\n\nCan we meet tomorrow to discuss this?\n\nRegards,\nSarah',
        read: true,
        date: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString(), // 25 hours ago
      },
      {
        id: 'e3',
        from: 'tech.support@vendor.com',
        to: 'current@user.com',
        subject: 'License Renewal Notice',
        message: 'Hello,\n\nThis is a reminder that your software licenses for the inventory management system will expire in 14 days. Please process the renewal to avoid service interruption.\n\nThank you,\nVendor Support Team',
        read: false,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      }
    ];
    
    // Combine and sort by date (newest first)
    const allEmails = [...storedEmails, ...mockEmails].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    return allEmails;
  } catch (error) {
    console.error('Error fetching received emails:', error);
    toast.error('Failed to fetch emails', {
      description: 'Please try again later.'
    });
    return [];
  }
};

export const markEmailAsRead = async (emailId: string) => {
  try {
    // In production, make the actual API call
    if (process.env.NODE_ENV !== 'development') {
      const response = await api.post(`/email/read/${emailId}`);
      return response.data;
    }
    
    console.log('Development mode: Marking email as read', emailId);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Also update in localStorage if it's one of our sent emails
    const storedEmails = getStoredEmails();
    const updatedEmails = storedEmails.map(email => 
      email.id === emailId ? { ...email, read: true } : email
    );
    
    // Only update storage if we found and changed an email
    if (JSON.stringify(storedEmails) !== JSON.stringify(updatedEmails)) {
      storeEmails(updatedEmails);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error marking email as read:', error);
    return { success: false };
  }
};

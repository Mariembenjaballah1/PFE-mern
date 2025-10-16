
import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '@/components/DashboardLayout';
import EmailForm from '@/components/email/EmailForm';
import EmailInbox from '@/components/email/EmailInbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, SendHorizonal } from 'lucide-react';
import useApiData from '@/hooks/useApiData';
import { fetchUserById } from '@/services/userApi';

interface User {
  name: string;
  role: string;
  email?: string;
}

const EmailPage: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User>({
    name: 'User',
    role: 'USER'
  });
  const [activeTab, setActiveTab] = useState<string>('inbox');
  const queryClient = useQueryClient();
  
  // Get current user ID from localStorage
  const [userId, setUserId] = useState<string | null>(null);
  
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        setCurrentUser({
          name: user.name || 'User',
          role: user.role || 'USER',
          email: user.email
        });
        
        if (user._id) {
          setUserId(user._id);
        }
      }
    } catch (e) {
      console.error('Error getting current user:', e);
    }
  }, []);
  
  // Fetch user data if we have a userId
  const { data: userData } = useApiData<User>(
    ['user', userId],
    () => fetchUserById(userId || ''),
    {
      enabled: !!userId,
      mockData: currentUser
    }
  );
  
  // Update current user when userData changes
  useEffect(() => {
    if (userData) {
      setCurrentUser(userData);
    }
  }, [userData]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // If switching to inbox tab, refresh emails data
    if (value === 'inbox') {
      queryClient.invalidateQueries({ queryKey: ['receivedEmails'] });
    }
  };

  // Create a function to handle after email is sent
  const handleEmailSent = () => {
    // Refresh the emails data
    queryClient.invalidateQueries({ queryKey: ['receivedEmails'] });
    
    // Switch to inbox tab to see the sent email
    setActiveTab('inbox');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight animate-slide-in">Email Communications</h1>
        <p className="text-muted-foreground animate-slide-in" style={{animationDelay: '100ms'}}>
          Send notifications and updates to team members and stakeholders.
        </p>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full animate-scale-in">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="inbox" className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> Inbox
            </TabsTrigger>
            <TabsTrigger value="compose" className="flex items-center gap-2">
              <SendHorizonal className="h-4 w-4" /> Compose
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="inbox" className="mt-4">
            <div className="bg-card shadow-sm rounded-lg border p-6">
              <EmailInbox />
            </div>
          </TabsContent>
          
          <TabsContent value="compose" className="mt-4">
            <div className="bg-card shadow-sm rounded-lg border p-6">
              <div className="mb-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm">
                  <span className="font-medium">Sending as:</span> {currentUser.name} ({currentUser.role.toLowerCase()})
                  {currentUser.email && <span className="ml-2">• {currentUser.email}</span>}
                </p>
              </div>
              <EmailForm onEmailSent={handleEmailSent} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default EmailPage;

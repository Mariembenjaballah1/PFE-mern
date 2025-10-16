
import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { UserCog, Bell, Shield, Database } from 'lucide-react';
import { useSettings } from '@/hooks/use-settings';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from 'react-hook-form';

const SettingsPage: React.FC = () => {
  const { profile, updateProfile, notifications, updateNotifications, updatePassword, system, updateSystem } = useSettings();
  
  // For password fields
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordSubmit = () => {
    updatePassword(
      passwordData.currentPassword,
      passwordData.newPassword,
      passwordData.confirmPassword
    );
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const bio = formData.get('bio') as string;

    updateProfile({ name, email, bio });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 w-full">
        <h1 className="text-3xl font-bold tracking-tight animate-fade-in">Settings</h1>
        <p className="text-muted-foreground animate-fade-in" style={{animationDelay: '100ms'}}>
          Manage your account, notification preferences, and system settings.
        </p>
        
        <Tabs defaultValue="profile" className="w-full animate-fade-in" style={{animationDelay: '150ms'}}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="profile" className="flex gap-2">
              <UserCog className="h-4 w-4" /> Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex gap-2">
              <Bell className="h-4 w-4" /> Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="flex gap-2">
              <Shield className="h-4 w-4" /> Security
            </TabsTrigger>
            <TabsTrigger value="system" className="flex gap-2">
              <Database className="h-4 w-4" /> System
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        placeholder="Your name" 
                        defaultValue={profile.name} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        placeholder="Your email" 
                        defaultValue={profile.email} 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input 
                      id="bio" 
                      name="bio" 
                      placeholder="About you" 
                      defaultValue={profile.bio} 
                    />
                  </div>
                  <Button type="submit">Save Changes</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive email alerts for important system events</p>
                  </div>
                  <Switch 
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => updateNotifications({ emailNotifications: checked })} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Maintenance Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified about scheduled maintenance</p>
                  </div>
                  <Switch 
                    checked={notifications.maintenanceAlerts}
                    onCheckedChange={(checked) => updateNotifications({ maintenanceAlerts: checked })} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">System Updates</p>
                    <p className="text-sm text-muted-foreground">Be informed about system updates and changes</p>
                  </div>
                  <Switch 
                    checked={notifications.systemUpdates}
                    onCheckedChange={(checked) => updateNotifications({ systemUpdates: checked })} 
                  />
                </div>
                <Button 
                  onClick={() => updateNotifications({
                    emailNotifications: notifications.emailNotifications,
                    maintenanceAlerts: notifications.maintenanceAlerts,
                    systemUpdates: notifications.systemUpdates
                  })}
                >
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input 
                      id="current-password" 
                      type="password" 
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input 
                      id="new-password" 
                      type="password" 
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input 
                      id="confirm-password" 
                      type="password" 
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={handlePasswordSubmit}>Update Password</Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">Enable dark mode for the application</p>
                  </div>
                  <Switch 
                    checked={system.darkMode}
                    onCheckedChange={(checked) => updateSystem({ darkMode: checked })} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Analytics Tracking</p>
                    <p className="text-sm text-muted-foreground">Allow system to collect usage data</p>
                  </div>
                  <Switch 
                    checked={system.analyticsTracking}
                    onCheckedChange={(checked) => updateSystem({ analyticsTracking: checked })} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto Updates</p>
                    <p className="text-sm text-muted-foreground">Automatically update when new versions available</p>
                  </div>
                  <Switch 
                    checked={system.autoUpdates}
                    onCheckedChange={(checked) => updateSystem({ autoUpdates: checked })} 
                  />
                </div>
                <Button 
                  onClick={() => updateSystem({
                    darkMode: system.darkMode,
                    analyticsTracking: system.analyticsTracking,
                    autoUpdates: system.autoUpdates
                  })}
                >
                  Apply Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;

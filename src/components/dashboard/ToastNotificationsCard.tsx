import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Bell, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

const ToastNotificationsCard: React.FC = () => {
  const { toast } = useToast();

  const showDemoToast = () => {
    toast.success('Toast Notifications Active!', {
      description: 'All actions now provide user feedback with toast notifications'
    });
  };

  return (
    <Card className="col-span-full border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
          <Bell className="h-5 w-5" />
          Toast Notifications Enabled
        </CardTitle>
        <CardDescription className="text-blue-600 dark:text-blue-400">
          User feedback is now provided for all major actions throughout the application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Success
          </Badge>
          <Badge variant="secondary" className="bg-red-100 text-red-700 border-red-200 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Error
          </Badge>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-yellow-200 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Warning
          </Badge>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200 flex items-center gap-1">
            <Info className="h-3 w-3" />
            Info
          </Badge>
        </div>
        
        <div className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
          <p>✅ <strong>Asset Management:</strong> Create, edit, delete, assign assets</p>
          <p>✅ <strong>Project Management:</strong> Create, edit, manage projects</p>
          <p>✅ <strong>Maintenance:</strong> Schedule, update maintenance tasks</p>
          <p>✅ <strong>User Management:</strong> Add, edit users and roles</p>
          <p>✅ <strong>Authentication:</strong> Login, logout notifications</p>
          <p>✅ <strong>System Actions:</strong> Import/export, file uploads</p>
        </div>

        <Button onClick={showDemoToast} size="sm" className="bg-blue-600 hover:bg-blue-700">
          Test Toast Notification
        </Button>
      </CardContent>
    </Card>
  );
};

export default ToastNotificationsCard;
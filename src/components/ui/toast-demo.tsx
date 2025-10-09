import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, AlertCircle, Info, Upload, Download, Trash2, Plus, Edit } from 'lucide-react';

const ToastDemo: React.FC = () => {
  const { toast } = useToast();

  const showSuccessToast = () => {
    toast.success('Operation Successful!', {
      description: 'Your action has been completed successfully.'
    });
  };

  const showErrorToast = () => {
    toast.error('Operation Failed!', {
      description: 'Something went wrong. Please try again.'
    });
  };

  const showWarningToast = () => {
    toast.warning('Warning!', {
      description: 'Please review your action before proceeding.'
    });
  };

  const showInfoToast = () => {
    toast.info('Information', {
      description: 'Here is some useful information for you.'
    });
  };

  const showAssetCreatedToast = () => {
    toast.success('Asset Created', {
      description: 'New server "WEB-SERVER-01" has been added to inventory.'
    });
  };

  const showAssetDeletedToast = () => {
    toast.success('Asset Deleted', {
      description: 'Asset "OLD-PRINTER-05" has been removed from inventory.'
    });
  };

  const showMaintenanceScheduledToast = () => {
    toast.success('Maintenance Scheduled', {
      description: 'Technician has been notified and asset marked as non-functional.'
    });
  };

  const showProjectCreatedToast = () => {
    toast.success('Project Created', {
      description: 'Project "Data Migration Q1 2024" is now active.'
    });
  };

  const showUserAddedToast = () => {
    toast.success('User Created', {
      description: 'New technician "John Smith" has been added to the system.'
    });
  };

  const showExportToast = () => {
    toast.success('Export Complete', {
      description: 'Report has been downloaded to your device.'
    });
  };

  const showUploadToast = () => {
    toast.success('Upload Complete', {
      description: '25 servers imported successfully from CSV file.'
    });
  };

  const showConnectionToast = () => {
    toast.info('Connection Restored', {
      description: 'Real-time updates are now active.'
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-6 w-6" />
          Toast Notifications Demo
        </CardTitle>
        <CardDescription>
          Click any button below to see different types of toast notifications used throughout the application.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Toast Types */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Basic Toast Types</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button onClick={showSuccessToast} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              Success
            </Button>
            <Button onClick={showErrorToast} variant="destructive">
              <XCircle className="h-4 w-4 mr-2" />
              Error
            </Button>
            <Button onClick={showWarningToast} className="bg-yellow-600 hover:bg-yellow-700">
              <AlertCircle className="h-4 w-4 mr-2" />
              Warning
            </Button>
            <Button onClick={showInfoToast} className="bg-blue-600 hover:bg-blue-700">
              <Info className="h-4 w-4 mr-2" />
              Info
            </Button>
          </div>
        </div>

        {/* Asset Management Toasts */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Asset Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button onClick={showAssetCreatedToast} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Asset Created
            </Button>
            <Button onClick={showAssetDeletedToast} variant="outline">
              <Trash2 className="h-4 w-4 mr-2" />
              Asset Deleted
            </Button>
            <Button onClick={showMaintenanceScheduledToast} variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Maintenance Scheduled
            </Button>
          </div>
        </div>

        {/* Project & User Management */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Project & User Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button onClick={showProjectCreatedToast} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Project Created
            </Button>
            <Button onClick={showUserAddedToast} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              User Added
            </Button>
          </div>
        </div>

        {/* System Operations */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">System Operations</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button onClick={showExportToast} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Complete
            </Button>
            <Button onClick={showUploadToast} variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Upload Complete
            </Button>
            <Button onClick={showConnectionToast} variant="outline">
              <CheckCircle className="h-4 w-4 mr-2" />
              Connection Restored
            </Button>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Implementation Notes:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Toast notifications are now implemented across all major actions</li>
            <li>• Success toasts appear for: asset creation/editing, project creation, user management</li>
            <li>• Error toasts appear for: failed operations, validation errors, network issues</li>
            <li>• Info toasts appear for: system status changes, navigation actions</li>
            <li>• Warning toasts appear for: important notices, confirmations needed</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ToastDemo;
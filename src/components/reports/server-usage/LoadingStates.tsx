
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, AlertCircle, Server } from 'lucide-react';

interface LoadingStatesProps {
  type: 'loading' | 'error';
  onRefresh: () => void;
  errorMessage?: string;
}

const LoadingStates: React.FC<LoadingStatesProps> = ({ 
  type, 
  onRefresh, 
  errorMessage = "Failed to load data" 
}) => {
  if (type === 'loading') {
    return (
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
          <CardTitle className="text-xl font-bold flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Server className="h-6 w-6 text-blue-600" />
            </div>
            <span>Server Resource Monitor</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-center items-center py-16">
            <div className="text-center space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto" />
              <div>
                <h3 className="font-medium text-gray-900">Loading Dynamic Data</h3>
                <p className="text-sm text-muted-foreground">Fetching real-time server information...</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-t-lg">
        <CardTitle className="text-xl font-bold flex items-center space-x-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <span>Server Resource Monitor</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="text-center py-16">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Connection Error</h3>
          <p className="text-muted-foreground mb-4">{errorMessage}</p>
          <p className="text-sm text-gray-500 mb-6">Unable to fetch dynamic server data from the API</p>
          <Button 
            variant="outline" 
            onClick={onRefresh}
            className="bg-red-50 hover:bg-red-100 border-red-200"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingStates;

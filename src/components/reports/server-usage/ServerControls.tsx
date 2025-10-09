
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, RotateCcw, Clock, Wifi } from 'lucide-react';

interface ServerResourceData {
  cpu: number;
  ram: number;
  disk: number;
  network: number;
  connections: number;
  uptime: string;
}

interface ServerControlsProps {
  resourceData: ServerResourceData | null;
  onResetStats: () => void;
  isResetting: boolean;
}

const ServerControls: React.FC<ServerControlsProps> = ({
  resourceData,
  onResetStats,
  isResetting
}) => {
  if (!resourceData) return null;

  return (
    <Card className="bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 text-sm text-gray-700">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <span className="font-semibold text-gray-900">Uptime:</span>
                <span className="font-mono bg-white px-3 py-1.5 rounded-lg border ml-2 text-gray-800 font-medium">
                  {resourceData.uptime || 'Unknown'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 text-sm text-gray-700">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <Wifi className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <span className="font-semibold text-gray-900">Live Data</span>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-sm"></div>
                  <span className="text-xs font-semibold text-emerald-700">Active Monitoring</span>
                </div>
              </div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onResetStats}
            disabled={isResetting}
            className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-all duration-200 font-semibold px-4 py-2 h-10"
          >
            {isResetting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RotateCcw className="h-4 w-4" />
            )}
            <span>{isResetting ? 'Resetting Statistics...' : 'Reset Statistics'}</span>
          </Button>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-8 text-xs text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Auto-refresh every 20 seconds</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="font-medium">Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServerControls;

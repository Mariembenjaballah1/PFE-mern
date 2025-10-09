
import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWebSocket } from '@/services/websocketService';
import { useToast } from '@/hooks/use-toast';

interface UseRealTimeDataOptions {
  enableAssetUpdates?: boolean;
  enableMaintenanceUpdates?: boolean;
  enableStatsUpdates?: boolean;
  enableActivityUpdates?: boolean;
  enableProjectUpdates?: boolean;
  autoRefreshInterval?: number;
}

export const useRealTimeData = (options: UseRealTimeDataOptions = {}) => {
  const {
    enableAssetUpdates = true,
    enableMaintenanceUpdates = true,
    enableStatsUpdates = true,
    enableActivityUpdates = true,
    enableProjectUpdates = true,
    autoRefreshInterval = 30000, // 30 seconds
  } = options;

  const queryClient = useQueryClient();
  const { on, off, isConnected, simulateRealtimeData } = useWebSocket();
  const { toast } = useToast();

  const invalidateQueries = useCallback((queryKeys: string[]) => {
    queryKeys.forEach(key => {
      queryClient.invalidateQueries({ queryKey: [key] });
    });
  }, [queryClient]);

  const handleAssetUpdate = useCallback((data: any) => {
    console.log('Real-time asset update:', data);
    invalidateQueries(['assets', 'dashboardStats', 'assetCategories', 'assetStatuses']);
  }, [invalidateQueries]);

  const handleMaintenanceUpdate = useCallback((data: any) => {
    console.log('Real-time maintenance update:', data);
    invalidateQueries(['maintenance', 'dashboardStats']);
  }, [invalidateQueries]);

  const handleStatsUpdate = useCallback((data: any) => {
    console.log('Real-time stats update:', data);
    invalidateQueries(['dashboardStats', 'stats']);
  }, [invalidateQueries]);

  const handleActivityUpdate = useCallback((data: any) => {
    console.log('Real-time activity update:', data);
    invalidateQueries(['activities']);
  }, [invalidateQueries]);

  const handleProjectUpdate = useCallback((data: any) => {
    console.log('Real-time project update:', data);
    invalidateQueries(['dashboardProjects', 'dashboardAssetsByProject']);
  }, [invalidateQueries]);

  const handleResourceAlert = useCallback((data: any) => {
    console.log('Real-time resource alert:', data);
    toast({
      title: "Resource Alert",
      description: data.message || "System resource threshold exceeded",
      variant: "destructive"
    });
  }, [toast]);

  useEffect(() => {
    // Set up event listeners based on options
    if (enableAssetUpdates) {
      on('asset-updated', handleAssetUpdate);
      on('asset-created', handleAssetUpdate);
      on('asset-deleted', handleAssetUpdate);
    }

    if (enableMaintenanceUpdates) {
      on('maintenance-scheduled', handleMaintenanceUpdate);
      on('maintenance-completed', handleMaintenanceUpdate);
    }

    if (enableStatsUpdates) {
      on('stats-updated', handleStatsUpdate);
    }

    if (enableActivityUpdates) {
      on('activity-added', handleActivityUpdate);
    }

    if (enableProjectUpdates) {
      on('project-updated', handleProjectUpdate);
    }

    // Always listen for resource alerts
    on('resource-alert', handleResourceAlert);

    // In development mode, simulate real-time data if WebSocket isn't connected
    if (process.env.NODE_ENV === 'development' && !isConnected) {
      console.log('Simulating real-time data for development');
      simulateRealtimeData();
    }

    // Set up auto-refresh interval as fallback
    const autoRefreshTimer = setInterval(() => {
      if (!isConnected) {
        console.log('Auto-refreshing data (WebSocket not connected)');
        invalidateQueries(['assets', 'maintenance', 'dashboardStats', 'activities']);
      }
    }, autoRefreshInterval);

    return () => {
      // Clean up event listeners
      if (enableAssetUpdates) {
        off('asset-updated', handleAssetUpdate);
        off('asset-created', handleAssetUpdate);
        off('asset-deleted', handleAssetUpdate);
      }

      if (enableMaintenanceUpdates) {
        off('maintenance-scheduled', handleMaintenanceUpdate);
        off('maintenance-completed', handleMaintenanceUpdate);
      }

      if (enableStatsUpdates) {
        off('stats-updated', handleStatsUpdate);
      }

      if (enableActivityUpdates) {
        off('activity-added', handleActivityUpdate);
      }

      if (enableProjectUpdates) {
        off('project-updated', handleProjectUpdate);
      }

      off('resource-alert', handleResourceAlert);
      clearInterval(autoRefreshTimer);
    };
  }, [
    enableAssetUpdates,
    enableMaintenanceUpdates,
    enableStatsUpdates,
    enableActivityUpdates,
    enableProjectUpdates,
    on,
    off,
    handleAssetUpdate,
    handleMaintenanceUpdate,
    handleStatsUpdate,
    handleActivityUpdate,
    handleProjectUpdate,
    handleResourceAlert,
    isConnected,
    simulateRealtimeData,
    autoRefreshInterval,
    invalidateQueries
  ]);

  return {
    isConnected,
    refresh: () => invalidateQueries(['assets', 'maintenance', 'dashboardStats', 'activities'])
  };
};

export default useRealTimeData;

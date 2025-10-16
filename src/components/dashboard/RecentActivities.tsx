
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { fetchRecentActivities, addActivity } from '@/services/activitiesApi';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { RefreshCw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface Activity {
  id: string;
  user: string;
  action: string;
  asset?: string;
  timestamp: string;
}

const RecentActivities: React.FC = () => {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const queryClient = useQueryClient();
  
  // Use React Query for data fetching with auto-refresh
  const { data: activities = [], isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['activities'],
    queryFn: fetchRecentActivities,
    refetchInterval: autoRefresh ? 15000 : false, // Auto refresh every 15 seconds if enabled
    staleTime: 10000, // Consider data stale after 10 seconds
    meta: {
      onSettled: (data: any, error: Error | null) => {
        if (error) {
          console.error('Error loading activities:', error);
        }
      },
    }
  });

  // Use effect to set up a listener for activity changes
  useEffect(() => {
    // This is a mock event listener for local development
    // In a real app, this might be a WebSocket connection or server event
    const handleActivityChange = () => {
      console.log('Activity updated, refreshing data');
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    };
    
    // Subscribe to storage events (for local testing)
    window.addEventListener('storage', handleActivityChange);
    
    // Custom event for activity changes
    window.addEventListener('activityAdded', handleActivityChange);
    
    return () => {
      window.removeEventListener('storage', handleActivityChange);
      window.removeEventListener('activityAdded', handleActivityChange);
    };
  }, [queryClient]);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    // Convert to minutes
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(prev => !prev);
  };
  
  const handleRefreshClick = () => {
    refetch();
  };
  
  // For testing: Add a new activity
  const handleAddTestActivity = async () => {
    try {
      await addActivity({
        user: "Test User",
        action: "Added test activity",
        asset: "Test Asset"
      });
      
      // Dispatch custom event to trigger refresh
      window.dispatchEvent(new CustomEvent('activityAdded'));
      
      // Force refetch
      queryClient.invalidateQueries({ queryKey: ['activities'] });
    } catch (error) {
      console.error("Error adding test activity:", error);
    }
  };

  return (
    <Card className="card-gradient animate-scale-in">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <CardTitle>Recent Activities</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`${autoRefresh ? 'text-green-500' : 'text-muted-foreground'}`}
            onClick={toggleAutoRefresh}
          >
            {autoRefresh ? 'Auto-refresh on' : 'Auto-refresh off'}
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className={`${isRefetching ? 'animate-spin' : ''}`}
            onClick={handleRefreshClick}
            disabled={isLoading || isRefetching}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-72 pr-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((_, index) => (
                <div key={index} className="p-3 bg-background/50 rounded-lg border border-border">
                  <div className="flex justify-between items-start">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full mt-2" />
                </div>
              ))}
            </div>
          ) : activities.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No recent activities found
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div 
                    key={activity.id} 
                    className="p-3 bg-background/50 rounded-lg border border-border transition-all duration-300 hover:shadow-md hover:bg-background/80"
                    style={{ 
                      animationDelay: `${index * 100}ms`,
                      opacity: 0,
                      animation: 'fade-in 0.5s forwards',
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="font-medium">{activity.user}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatTimestamp(activity.timestamp)}
                      </div>
                    </div>
                    <div className="text-sm mt-1">
                      {activity.action}
                      {activity.asset && <span className="font-medium"> - {activity.asset}</span>}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* For development/testing only - remove in production */}
              <div className="mt-4 pt-4 border-t border-dashed border-border">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs" 
                  onClick={handleAddTestActivity}
                >
                  Add Test Activity (Dev Only)
                </Button>
              </div>
            </>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RecentActivities;


import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Database, Laptop, Calendar, AlertTriangle, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchMaintenanceTasks } from '@/services/maintenanceApi';
import { Badge } from '@/components/ui/badge';
import { getStatsTrends } from '@/services/statsService';
import { Skeleton } from '@/components/ui/skeleton';

// Define the Stats interface
export interface StatsData {
  assets: {
    count: number;
    percentage: number;
    isIncrease: boolean;
    detail: string;
  };
  projects: {
    count: number;
    percentage: number;
    isIncrease: boolean;
    detail: string;
  };
  maintenance: {
    count: number;
    percentage: number;
    isIncrease: boolean;
    detail: string;
  };
  issues: {
    count: number;
    percentage: number;
    isIncrease: boolean;
    detail: string;
  };
}

interface StatsCardsProps {
  statsData?: StatsData;
}

const StatsCards: React.FC<StatsCardsProps> = ({ statsData }) => {
  // Fetch stats with all dynamic data
  const { data: fetchedStatsData, isLoading: statsLoading, error } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getStatsTrends,
    enabled: !statsData // Only fetch if not provided via props
  });
  
  // Use provided data or fetched data
  const stats = statsData || fetchedStatsData;
  const isLoading = statsLoading && !statsData;

  // Enhanced debug logging to understand the data flow
  console.log('=== StatsCards Debug Start ===');
  console.log('Props statsData:', statsData);
  console.log('Fetched statsData:', fetchedStatsData);
  console.log('Final stats object:', stats);
  console.log('Is loading:', isLoading);
  console.log('Error:', error);
  
  if (stats) {
    console.log('Assets count from stats:', stats.assets?.count);
    console.log('Projects count from stats:', stats.projects?.count);
    console.log('Maintenance count from stats:', stats.maintenance?.count);
    console.log('Issues count from stats:', stats.issues?.count);
  }
  console.log('=== StatsCards Debug End ===');

  // Define the stats cards with loading states
  const statsItems = [
    {
      title: 'Total Assets',
      value: isLoading ? null : stats?.assets?.count ?? 0,
      icon: Database,
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400',
      percentage: isLoading ? null : stats?.assets?.percentage ?? 0,
      isIncrease: isLoading ? true : stats?.assets?.isIncrease ?? true,
      detail: isLoading ? 'Loading...' : stats?.assets?.detail ?? 'No data available',
    },
    {
      title: 'Total Projects',
      value: isLoading ? null : stats?.projects?.count ?? 0,
      icon: Laptop,
      color: 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400',
      percentage: isLoading ? null : stats?.projects?.percentage ?? 0,
      isIncrease: isLoading ? true : stats?.projects?.isIncrease ?? true,
      detail: isLoading ? 'Loading...' : stats?.projects?.detail ?? 'No data available',
    },
    {
      title: 'Pending Maintenance',
      value: isLoading ? null : stats?.maintenance?.count ?? 0,
      icon: Calendar,
      color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400',
      percentage: isLoading ? null : stats?.maintenance?.percentage ?? 0,
      isIncrease: isLoading ? true : stats?.maintenance?.isIncrease ?? true,
      detail: isLoading ? 'Loading...' : stats?.maintenance?.detail ?? 'No data available',
    },
    {
      title: 'Issues Reported',
      value: isLoading ? null : stats?.issues?.count ?? 0,
      icon: AlertTriangle,
      color: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400',
      percentage: isLoading ? null : stats?.issues?.percentage ?? 0,
      isIncrease: isLoading ? true : stats?.issues?.isIncrease ?? true,
      detail: isLoading ? 'Loading...' : stats?.issues?.detail ?? 'No data available',
    },
  ];

  console.log('Final statsItems values:', statsItems.map(item => ({
    title: item.title,
    value: item.value,
    percentage: item.percentage,
    detail: item.detail
  })));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsItems.map((stat, index) => {
        const Icon = stat.icon;
        const TrendIcon = stat.isIncrease ? TrendingUp : TrendingDown;
        const trendColor = stat.isIncrease ? 
          (stat.title === 'Issues Reported' || stat.title === 'Pending Maintenance' ? 'text-red-600' : 'text-green-600') : 
          (stat.title === 'Issues Reported' || stat.title === 'Pending Maintenance' ? 'text-green-600' : 'text-red-600');
        
        return (
          <Card key={stat.title} className="overflow-hidden animate-fade-in border border-gray-100 dark:border-gray-800 shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16 mb-2" />
                  ) : (
                    <h3 className="text-2xl font-bold">
                      {stat.value}
                    </h3>
                  )}
                  {isLoading ? (
                    <Skeleton className="h-5 w-24" />
                  ) : (
                    <div className="flex items-center mt-2 space-x-2">
                      <Badge 
                        variant={stat.isIncrease ? 
                          (stat.title === 'Issues Reported' || stat.title === 'Pending Maintenance' ? 'destructive' : 'default') : 
                          (stat.title === 'Issues Reported' || stat.title === 'Pending Maintenance' ? 'default' : 'destructive')
                        }
                        className="rounded-sm px-1 py-0.5 text-xs font-medium"
                      >
                        <TrendIcon className="h-3 w-3 mr-1 inline" />
                        {stat.percentage}%
                      </Badge>
                      <span className="text-xs text-muted-foreground">{stat.detail}</span>
                    </div>
                  )}
                </div>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsCards;

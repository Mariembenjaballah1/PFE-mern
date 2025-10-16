
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import AssetUsageReportCard from '@/components/reports/AssetUsageReportCard';
import ProjectResourceAllocationCard from '@/components/reports/ProjectResourceAllocationCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import { fetchAssets } from '@/services/assetApi';
import { Skeleton } from '@/components/ui/skeleton';

const AssetUsageAnalyticsPage: React.FC = () => {
  console.log('AssetUsageAnalyticsPage: Component rendering');
  
  const { data: assets = [], isLoading, error } = useQuery({
    queryKey: ['assets', 'usage-analytics'],
    queryFn: async () => {
      console.log('AssetUsageAnalyticsPage: Fetching assets');
      try {
        const data = await fetchAssets();
        console.log('AssetUsageAnalyticsPage: Assets fetched successfully', data);
        return data;
      } catch (err) {
        console.error('AssetUsageAnalyticsPage: Error fetching assets', err);
        throw err;
      }
    }
  });

  console.log('AssetUsageAnalyticsPage: Render state', { 
    assetsCount: assets.length, 
    isLoading, 
    hasError: !!error 
  });

  if (isLoading) {
    console.log('AssetUsageAnalyticsPage: Rendering loading state');
    return (
      <DashboardLayout>
        <div className="container mx-auto px-6 py-8 space-y-8">
          <div className="text-center space-y-4">
            <Skeleton className="h-8 w-64 mx-auto" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-96" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    console.error('AssetUsageAnalyticsPage: Rendering error state', error);
    return (
      <DashboardLayout>
        <div className="container mx-auto px-6 py-8 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Asset Usage Analytics</h1>
            <p className="text-muted-foreground">Comprehensive analysis of asset utilization and performance metrics</p>
          </div>

          <Card>
            <CardContent className="p-8 text-center">
              <div className="space-y-4">
                <BarChart3 className="h-12 w-12 text-red-500 mx-auto" />
                <h2 className="text-xl font-semibold text-red-600">Error Loading Data</h2>
                <p className="text-muted-foreground">Unable to load asset usage analytics. Please try again later.</p>
                <p className="text-sm text-red-500">{error?.message || 'Unknown error'}</p>
                <Link to="/reports">
                  <Button variant="outline">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Reports
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  console.log('AssetUsageAnalyticsPage: Rendering main content');
  return (
    <DashboardLayout>
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Asset Usage Analytics</h1>
          <p className="text-muted-foreground">Comprehensive analysis of asset utilization and performance metrics</p>
          
          <Link to="/reports">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reports
            </Button>
          </Link>
        </div>

        {/* Content Section */}
        <div className="space-y-8">
          {/* Asset Usage Report Card */}
          <div>
            {assets && assets.length > 0 ? (
              <AssetUsageReportCard assets={assets} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Asset Usage Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-8">
                    No asset data available to generate usage report.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Project Resource Allocation Card */}
          <div>
            {assets && assets.length > 0 ? (
              <ProjectResourceAllocationCard assets={assets} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Resource Allocation by Project</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center py-8">
                    No asset data available to generate resource allocation report.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AssetUsageAnalyticsPage;

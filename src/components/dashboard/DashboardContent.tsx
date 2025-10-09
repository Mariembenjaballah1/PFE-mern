
import React from 'react';
import StatsCards, { StatsData } from '@/components/dashboard/StatsCards';
import UsageChart from '@/components/dashboard/UsageChart';
import MaintenanceSchedule from '@/components/dashboard/MaintenanceSchedule';
import StatusPieChart from '@/components/dashboard/StatusPieChart';
import RecentActivities from '@/components/dashboard/RecentActivities';
import DashboardCalendar from '@/components/dashboard/DashboardCalendar';
import ResourcesCard from '@/components/dashboard/ResourcesCard';
import ResourcesChart from '@/components/dashboard/ResourcesChart';
import AssetsByProjectWidget from '@/components/dashboard/AssetsByProjectWidget';
import ProjectAssignmentCard from '@/components/assets/ProjectAssignmentCard';
import ToastNotificationsCard from '@/components/dashboard/ToastNotificationsCard';
import { Asset } from '@/types/asset';

interface DashboardContentProps {
  assets: Asset[];
  stats: StatsData;
  maintenance: any[];
}

const DashboardContent: React.FC<DashboardContentProps> = ({ 
  assets, 
  stats, 
  maintenance 
}) => {
  return (
    <>
      <p className="text-muted-foreground animate-slide-in" style={{animationDelay: '100ms'}}>
        Welcome to InvenTrack. All data is now dynamic and updated in real-time.
      </p>
      
      {/* Toast Notifications Info Card */}
      <div className="pt-4">
        <ToastNotificationsCard />
      </div>
      
      {/* Dynamic Stats Cards */}
      <div className="pt-4">
        <StatsCards statsData={stats} />
      </div>
      
      {/* Rewritten Project Assignment Card */}
      <div className="pt-6">
        <ProjectAssignmentCard assets={assets} />
      </div>
      
      {/* Dynamic Asset Distribution by Project */}
      <div className="pt-6">
        <AssetsByProjectWidget />
      </div>
      
      {/* Dynamic Resource Usage Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
        <div className="lg:col-span-2">
          <ResourcesChart assets={assets} />
        </div>
        <ResourcesCard assets={assets} />
      </div>
      
      {/* Dynamic Charts and Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-6">
        <UsageChart assets={assets} />
        <MaintenanceSchedule maintenanceData={maintenance} />
      </div>
      
      {/* Dynamic Calendar */}
      <div className="grid grid-cols-1 gap-6 pt-6">
        <DashboardCalendar maintenanceData={maintenance} />
      </div>
      
      {/* Additional Dynamic Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
        <StatusPieChart assets={assets} />
        <div className="lg:col-span-2">
          <RecentActivities />
        </div>
      </div>
    </>
  );
};

export default DashboardContent;

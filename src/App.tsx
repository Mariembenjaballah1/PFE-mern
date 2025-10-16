
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { EnhancedToastProvider } from '@/components/ui/enhanced-toast-provider';
import { NotificationsProvider } from '@/hooks/use-notifications';

import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import AssetsRoutes from '@/components/assets/AssetsRoutes';
import ProjectsPage from '@/pages/ProjectsPage';
import ReportsPage from '@/pages/ReportsPage';
import UserManagementPage from '@/pages/UserManagementPage';
import SettingsPage from '@/pages/SettingsPage';
import LoginPage from '@/pages/LoginPage';
import PasswordResetPage from '@/pages/PasswordResetPage';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import RoleBasedRoute from '@/components/auth/RoleBasedRoute';
import EmailPage from '@/pages/EmailPage';
import AIInsightsPage from '@/pages/AIInsightsPage';
import TechnicianNotificationsPage from '@/pages/TechnicianNotificationsPage';
import AssetUsageAnalyticsPage from '@/pages/AssetUsageAnalyticsPage';
import MaintenanceRoutes from '@/components/maintenance/MaintenanceRoutes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationsProvider>
        <EnhancedToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/password-reset" element={<PasswordResetPage />} />
              
              {/* Routes accessible to all authenticated users */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/projects" element={
                <ProtectedRoute>
                  <ProjectsPage />
                </ProtectedRoute>
              } />
              
              {/* Routes for TECHNICIAN and ADMIN only */}
              <Route path="/assets/*" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['TECHNICIAN', 'ADMIN']}>
                    <AssetsRoutes />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              
              <Route path="/maintenance/*" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['TECHNICIAN', 'ADMIN']}>
                    <MaintenanceRoutes />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              
              <Route path="/reports" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['TECHNICIAN', 'ADMIN']}>
                    <ReportsPage />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              
              <Route path="/reports/asset-usage" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['TECHNICIAN', 'ADMIN']}>
                    <AssetUsageAnalyticsPage />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              
              <Route path="/email" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['TECHNICIAN', 'ADMIN']}>
                    <EmailPage />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              
              <Route path="/ai-insights" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['TECHNICIAN', 'ADMIN']}>
                    <AIInsightsPage />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              
              <Route path="/technician-notifications" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['TECHNICIAN', 'ADMIN']}>
                    <TechnicianNotificationsPage />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              
              <Route path="/asset-usage-analytics" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['TECHNICIAN', 'ADMIN']}>
                    <AssetUsageAnalyticsPage />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['TECHNICIAN', 'ADMIN']}>
                    <SettingsPage />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              
              {/* Routes for ADMIN only */}
              <Route path="/users" element={
                <ProtectedRoute>
                  <RoleBasedRoute allowedRoles={['ADMIN']}>
                    <UserManagementPage />
                  </RoleBasedRoute>
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </BrowserRouter>
        </EnhancedToastProvider>
      </NotificationsProvider>
    </QueryClientProvider>
  );
}

export default App;

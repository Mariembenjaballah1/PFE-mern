
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MaintenancePage from '@/pages/MaintenancePage';
import MaintenanceDetailsPage from '@/pages/MaintenanceDetailsPage';

const MaintenanceRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<MaintenancePage />} />
      <Route path="details/:id" element={<MaintenanceDetailsPage />} />
    </Routes>
  );
};

export default MaintenanceRoutes;


import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AssetsPage from '@/pages/AssetsPage';
import AssetDetailsPage from '@/pages/AssetDetailsPage';

const AssetsRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AssetsPage />} />
      <Route path=":id" element={<AssetDetailsPage />} />
    </Routes>
  );
};

export default AssetsRoutes;

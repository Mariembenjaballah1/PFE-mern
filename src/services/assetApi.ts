
// This file now serves as a barrel file to export all asset-related services
// This preserves backward compatibility with existing imports

import { 
  fetchAssets,
  fetchAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  deleteAllServers,
  CreateAssetData,
  UpdateAssetData
} from './assets/assetBasicOperations';

import {
  fetchAssetsByCategory,
  fetchAssetsByStatus,
  fetchAssetsByProject
} from './assets/assetFilterOperations';

import { 
  fetchServerResourceData,
  resetServerUsageStats,
  defaultServerMetrics
} from './assets/assetResourceOperations';

import {
  updateAssetsForProjectManager,
  getAssetsByProject,
  UpdateAssetsForProjectData
} from './assets/assetProjectOperations';

import { mockAssets } from './assets/assetMocks';

export {
  fetchAssets,
  fetchAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  deleteAllServers,
  fetchAssetsByCategory,
  fetchAssetsByStatus,
  fetchAssetsByProject,
  fetchServerResourceData,
  resetServerUsageStats,
  defaultServerMetrics,
  updateAssetsForProjectManager,
  getAssetsByProject,
  mockAssets
};

export type { CreateAssetData, UpdateAssetData, UpdateAssetsForProjectData };


import { Asset } from '@/types/asset';

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'operational': return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800';
    case 'maintenance': return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800';
    case 'repair': return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800';
    case 'retired': return 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800';
    default: return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
  }
};

export const getEnvironmentBadgeColor = (env: string) => {
  switch (env.toLowerCase()) {
    case 'production':
    case 'prod':
      return 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border-red-300 shadow-sm dark:from-red-900/20 dark:to-red-800/20 dark:text-red-400 dark:border-red-700';
    case 'pca':
      return 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border-blue-300 shadow-sm dark:from-blue-900/20 dark:to-blue-800/20 dark:text-blue-400 dark:border-blue-700';
    case 'integration':
      return 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-800 border-purple-300 shadow-sm dark:from-purple-900/20 dark:to-purple-800/20 dark:text-purple-400 dark:border-purple-700';
    case 'infra':
      return 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-800 border-orange-300 shadow-sm dark:from-orange-900/20 dark:to-orange-800/20 dark:text-orange-400 dark:border-orange-700';
    case 'app':
      return 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 border-green-300 shadow-sm dark:from-green-900/20 dark:to-green-800/20 dark:text-green-400 dark:border-green-700';
    case 'db':
      return 'bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-800 border-indigo-300 shadow-sm dark:from-indigo-900/20 dark:to-indigo-800/20 dark:text-indigo-400 dark:border-indigo-700';
    default:
      return 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-gray-300 shadow-sm dark:from-gray-900/20 dark:to-gray-800/20 dark:text-gray-400 dark:border-gray-700';
  }
};

export const getEnvironmentFromAsset = (asset: Asset) => {
  console.log('Getting environment for asset:', asset.name, 'Full asset data:', asset);
  
  // Check various sources for environment information
  const vmInfo = asset.vmInfo || {};
  const additionalData = asset.additionalData || {};
  
  console.log('Asset vmInfo:', vmInfo);
  console.log('Asset additionalData:', additionalData);
  
  // First check for direct environment property in additionalData
  if (additionalData.environment) {
    const env = additionalData.environment.toLowerCase().trim();
    console.log('Found environment in additionalData:', env);
    
    // Map common variations to standard names  
    if (env === 'production' || env === 'prod') {
      console.log('Returning Production for environment:', env);
      return 'Production';
    }
    if (env === 'pca') return 'PCA';
    if (env === 'integration') return 'Integration';
    if (env === 'staging') return 'Staging';
    if (env === 'testing') return 'Testing';
    if (env === 'development') return 'Development';
    if (env === 'preproduction') return 'PreProduction';
    if (env === 'qualification') return 'Qualification';
    if (env === 'recette') return 'Recette';
  }
  
  // Check for environment indicators as boolean flags (legacy support)
  if (vmInfo.prod || additionalData.prod || additionalData.Prod) {
    console.log('Found production flag, returning Production');
    return 'Production';
  }
  if (vmInfo.pca || additionalData.pca || additionalData.Pca) return 'PCA';
  if (vmInfo.integration || additionalData.integration || additionalData.Integration) return 'Integration';
  if (vmInfo.infra || additionalData.infra || additionalData.Infra) return 'Infrastructure';
  if (vmInfo.app || additionalData.app || additionalData.App) return 'Application';
  if (vmInfo.db || additionalData.db || additionalData.DB) return 'Database';
  
  // Additional check for staging variations - only in additionalData since these properties don't exist in VMInfo type
  if (additionalData.staging || additionalData.Staging) return 'Staging';
  if (additionalData.testing || additionalData.Testing) return 'Testing';
  if (additionalData.development || additionalData.Development) return 'Development';
  
  console.log('No specific environment found for asset:', asset.name, 'defaulting to Other');
  console.log('Final check - additionalData keys:', Object.keys(additionalData));
  console.log('Final check - vmInfo keys:', Object.keys(vmInfo));
  
  return 'Other';
};

export const groupAssetsByEnvironment = (assets: Asset[]) => {
  console.log('Grouping assets by environment, total assets:', assets.length);
  
  return assets.reduce((groups: Record<string, Asset[]>, asset) => {
    const environment = getEnvironmentFromAsset(asset);
    console.log(`Asset "${asset.name}" assigned to environment: "${environment}"`);
    
    if (!groups[environment]) {
      groups[environment] = [];
    }
    groups[environment].push(asset);
    return groups;
  }, {});
};

export const sortEnvironments = (environments: string[]) => {
  const environmentOrder = ['Production', 'PCA', 'Integration', 'Infrastructure', 'Application', 'Database', 'Staging', 'Testing', 'Development', 'PreProduction', 'Qualification', 'Recette', 'Other'];
  return environments.sort((a, b) => {
    const aIndex = environmentOrder.indexOf(a);
    const bIndex = environmentOrder.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
};

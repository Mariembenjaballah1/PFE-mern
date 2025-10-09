
/**
 * Dynamic API endpoint configuration for assets
 * This allows for easy modification of endpoint paths in one place
 */
export const ASSET_ENDPOINTS = {
  BASE: '/assets',
  DETAIL: (id: string) => `/assets/${id}`,
  BY_CATEGORY: (category: string) => `/assets/category/${category}`,
  BY_STATUS: (status: string) => `/assets/status/${status}`,
  BY_PROJECT: (projectId: string) => `/assets/project/${projectId}`,
  RESOURCES: (id: string) => `/assets/${id}/resources`,
};

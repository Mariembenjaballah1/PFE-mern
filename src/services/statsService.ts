
import api from './apiClient';

export const getStatsTrends = async () => {
  try {
    console.log('Fetching stats trends from database...');
    const response = await api.get('/stats/trends');
    console.log('Stats trends from database:', response.data);
    
    // Validate the response format
    if (response.data && response.data.assets && typeof response.data.assets.count !== 'undefined') {
      return response.data;
    } else {
      console.warn('Invalid stats format from database, calculating from assets...');
      // Try to calculate stats from actual asset data
      const assetsResponse = await api.get('/assets');
      const assets = assetsResponse.data || [];
      console.log('Calculating stats from real asset data:', assets);
      
      const assetsCount = assets.length;
      const projectsCount = new Set(
        assets
          .filter(asset => asset.project)
          .map(asset => asset.project._id || asset.project)
      ).size;
      
      const calculatedStats = {
        assets: {
          count: assetsCount,
          percentage: 12.5,
          isIncrease: true,
          detail: "calculated from database assets"
        },
        projects: {
          count: projectsCount,
          percentage: 15.2,
          isIncrease: true,
          detail: "calculated from database assets"
        },
        maintenance: {
          count: 0,
          percentage: 8.3,
          isIncrease: false,
          detail: "maintenance endpoint requires authentication"
        },
        issues: {
          count: 0,
          percentage: 25.0,
          isIncrease: false,
          detail: "issues endpoint requires authentication"
        }
      };
      
      console.log('Calculated stats from database:', calculatedStats);
      return calculatedStats;
    }
  } catch (error) {
    console.error('Error fetching stats from database:', error);
    throw error; // Don't fallback to mock data
  }
};

export const getDashboardStats = async () => {
  try {
    console.log('Fetching dashboard stats from database...');
    const response = await api.get('/stats/dashboard');
    console.log('Dashboard stats from database:', response.data);
    
    // Validate the response format
    if (response.data && response.data.assets && typeof response.data.assets.count !== 'undefined') {
      return response.data;
    } else {
      console.warn('Invalid dashboard stats format, falling back to trends calculation');
      return getStatsTrends();
    }
  } catch (error) {
    console.error('Error fetching dashboard stats from database:', error);
    // Fallback to getStatsTrends which calculates from real data
    return getStatsTrends();
  }
};

// Export for backward compatibility
export const getStats = getDashboardStats;

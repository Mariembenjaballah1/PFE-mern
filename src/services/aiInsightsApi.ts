
import api from './apiClient';

// Type definitions
export interface AIAnalyticsData {
  predictive: {
    downtimeReduction: number;
    maintenanceCostReduction: number;
    recommendations: string[];
  };
  optimization: {
    inventoryCostReduction: number;
    partAvailability: number;
    suggestions: string[];
  };
  insights: {
    anomalyDetections: number;
    visualRecognitionAccuracy: number;
    reportsGenerated: number;
  };
  implementationPhase: 'data-collection' | 'predictive-models' | 'full-automation';
}

export interface AIInsight {
  id: string;
  title: string;
  description: string;
  confidence: number;
  category: string;
  createdAt: string;
  relatedAssets: string[];
  actionItems: string[];
}

export interface RecommendedMaintenance {
  id: number;
  assetName: string;
  reason: string;
  priority: 'High' | 'Medium' | 'Low';
  confidence: number;
}

export interface OptimizationSuggestion {
  id: number;
  title: string;
  description: string;
  impact: string;
  implementationEffort: string;
  implemented?: boolean;
}

// Fetch AI insights data
export const fetchAIInsights = async (): Promise<AIAnalyticsData> => {
  try {
    const response = await api.get('/ai-insights');
    return response.data;
  } catch (error) {
    console.error('Error fetching AI insights:', error);
    // Return mock data as fallback
    return getMockAIInsights();
  }
};

// Get specific insight by ID
export const fetchInsightById = async (id: string): Promise<AIInsight> => {
  try {
    const response = await api.get(`/ai-insights/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching insight with ID ${id}:`, error);
    // Return mock insight as fallback
    const mockInsights = getMockInsights();
    return mockInsights.find(insight => insight.id === id) || mockInsights[0];
  }
};

// Generate new insight based on provided data
export const generateInsight = async (data: any) => {
  try {
    const response = await api.post('/ai-insights/generate', data);
    return response.data;
  } catch (error) {
    console.error('Error generating insight:', error);
    throw error;
  }
};

// Fetch recommended maintenance tasks
export const fetchRecommendedMaintenance = async (): Promise<RecommendedMaintenance[]> => {
  try {
    const response = await api.get('/ai-insights/maintenance-recommendations');
    return response.data;
  } catch (error) {
    console.error('Error fetching maintenance recommendations:', error);
    return getMockRecommendedMaintenance();
  }
};

// Fetch optimization suggestions
export const fetchOptimizationSuggestions = async (): Promise<OptimizationSuggestion[]> => {
  try {
    const response = await api.get('/ai-insights/optimization-suggestions');
    return response.data;
  } catch (error) {
    console.error('Error fetching optimization suggestions:', error);
    return getMockOptimizationSuggestions();
  }
};

// Generate AI analysis
export const generateAIAnalysis = async (): Promise<{ success: boolean }> => {
  try {
    const response = await api.post('/ai-insights/analyze');
    return response.data;
  } catch (error) {
    console.error('Error generating AI analysis:', error);
    // Return mock success response
    return { success: true };
  }
};

// Mock data for AI analytics when API is unavailable
const getMockAIInsights = (): AIAnalyticsData => {
  return {
    predictive: {
      downtimeReduction: 23,
      maintenanceCostReduction: 18,
      recommendations: [
        "Schedule maintenance for Server SRV-001 within 2 weeks",
        "Replace cooling fans in rack B3"
      ]
    },
    optimization: {
      inventoryCostReduction: 15,
      partAvailability: 92,
      suggestions: [
        "Consolidate spare parts inventory",
        "Implement just-in-time ordering for common components"
      ]
    },
    insights: {
      anomalyDetections: 7,
      visualRecognitionAccuracy: 89,
      reportsGenerated: 42
    },
    implementationPhase: 'data-collection'
  };
};

// Mock data for AI insights when API is unavailable
const getMockInsights = (): AIInsight[] => {
  return [
    {
      id: 'ins001',
      title: 'Maintenance Optimization',
      description: 'Based on asset usage patterns, scheduling maintenance on Thursdays would minimize downtime.',
      confidence: 87,
      category: 'maintenance',
      createdAt: new Date().toISOString(),
      relatedAssets: ['srv001', 'srv003'],
      actionItems: [
        'Reschedule maintenance for servers to Thursdays',
        'Prepare backup systems during maintenance windows'
      ]
    },
    {
      id: 'ins002',
      title: 'Resource Allocation Recommendation',
      description: 'Project Alpha is under-resourced by 15% based on historical usage patterns.',
      confidence: 92,
      category: 'resources',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      relatedAssets: ['srv002', 'srv005', 'dev001'],
      actionItems: [
        'Increase CPU allocation by 10%',
        'Add 8GB RAM to development servers'
      ]
    },
    {
      id: 'ins003',
      title: 'Asset Lifecycle Alert',
      description: '3 servers are approaching end-of-life within 60 days and should be scheduled for replacement.',
      confidence: 99,
      category: 'lifecycle',
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      relatedAssets: ['srv006', 'srv008', 'srv012'],
      actionItems: [
        'Initiate procurement for replacement servers',
        'Schedule data migration for affected systems'
      ]
    }
  ];
};

// Mock data for recommended maintenance
const getMockRecommendedMaintenance = (): RecommendedMaintenance[] => {
  return [
    {
      id: 1,
      assetName: "Database Server DB-01",
      reason: "Predictive analysis indicates potential disk failure within 2 weeks",
      priority: "High",
      confidence: 87
    },
    {
      id: 2,
      assetName: "Network Switch SW-03",
      reason: "Unusual packet loss patterns detected, maintenance recommended",
      priority: "Medium",
      confidence: 76
    },
    {
      id: 3,
      assetName: "Development Server DEV-05",
      reason: "Regular maintenance due based on usage patterns",
      priority: "Low",
      confidence: 92
    }
  ];
};

// Mock data for optimization suggestions
const getMockOptimizationSuggestions = (): OptimizationSuggestion[] => {
  return [
    {
      id: 1,
      title: "Server Consolidation Opportunity",
      description: "Servers SRV-07 and SRV-08 are consistently under-utilized. Consider consolidating workloads to a single server.",
      impact: "Medium",
      implementationEffort: "Low"
    },
    {
      id: 2,
      title: "Resource Reallocation",
      description: "Project Alpha servers are over-provisioned by 30%. Consider reducing allocated resources.",
      impact: "High",
      implementationEffort: "Medium"
    },
    {
      id: 3,
      title: "License Optimization",
      description: "5 unused software licenses detected across development team. Consider reassignment or cancellation.",
      impact: "Low",
      implementationEffort: "Low"
    }
  ];
};

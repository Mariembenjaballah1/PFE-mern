
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from '@tanstack/react-query';
import { fetchAIInsights, AIAnalyticsData } from '@/services/aiInsightsApi';
import { Skeleton } from '@/components/ui/skeleton';

const AICapabilities: React.FC = () => {
  const { data: aiData, isLoading, error } = useQuery({
    queryKey: ['ai-insights'],
    queryFn: fetchAIInsights
  });

  // Initialize with default values in case data is still loading
  const data: AIAnalyticsData = aiData || {
    predictive: { downtimeReduction: 0, maintenanceCostReduction: 0, recommendations: [] },
    optimization: { inventoryCostReduction: 0, partAvailability: 0, suggestions: [] },
    insights: { anomalyDetections: 0, visualRecognitionAccuracy: 0, reportsGenerated: 0 },
    implementationPhase: 'data-collection'
  };
  
  return (
    <Card className="animate-scale-in">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>AI-Powered Features</CardTitle>
            <CardDescription>Enhance your asset management with artificial intelligence</CardDescription>
          </div>
          <Badge variant="outline" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-none animate-pulse">
            Next-Gen
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="predictive">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="predictive" className="transition-all duration-300 hover:bg-gradient-to-r hover:from-green-100 hover:to-blue-100 dark:hover:from-green-900/40 dark:hover:to-blue-900/40">
              Predictive Maintenance
            </TabsTrigger>
            <TabsTrigger value="optimization" className="transition-all duration-300 hover:bg-gradient-to-r hover:from-green-100 hover:to-blue-100 dark:hover:from-green-900/40 dark:hover:to-blue-900/40">
              Resource Optimization
            </TabsTrigger>
            <TabsTrigger value="insights" className="transition-all duration-300 hover:bg-gradient-to-r hover:from-green-100 hover:to-blue-100 dark:hover:from-green-900/40 dark:hover:to-blue-900/40">
              Smart Insights
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="predictive" className="space-y-4 transition-all duration-300">
            <div className="bg-muted/50 p-4 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-medium mb-2">Predict Equipment Failures</h3>
              <p className="text-muted-foreground">
                Our AI analyzes historical maintenance data and asset usage patterns to predict when equipment might fail, 
                allowing you to schedule maintenance before breakdowns occur.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {isLoading ? (
                  <>
                    <Skeleton className="h-16 bg-background" />
                    <Skeleton className="h-16 bg-background" />
                  </>
                ) : (
                  <>
                    <div className="bg-background p-3 rounded-md shadow-inner transition-transform duration-300 hover:scale-105">
                      <div className="font-medium">Reduced Downtime</div>
                      <div className="text-sm text-muted-foreground">By up to {data.predictive.downtimeReduction}%</div>
                    </div>
                    <div className="bg-background p-3 rounded-md shadow-inner transition-transform duration-300 hover:scale-105">
                      <div className="font-medium">Maintenance Cost</div>
                      <div className="text-sm text-muted-foreground">Reduced by {data.predictive.maintenanceCostReduction}%</div>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="bg-background p-4 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-medium mb-2">Smart Scheduling</h3>
              <p className="text-muted-foreground">
                The AI optimizes maintenance schedules based on asset importance, resource availability, and predicted failure rates.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="optimization" className="space-y-4 transition-all duration-300">
            <div className="bg-muted/50 p-4 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-medium mb-2">Dynamic Resource Allocation</h3>
              <p className="text-muted-foreground">
                AI algorithms automatically assign technicians to maintenance tasks based on skills, location, and workload to maximize efficiency.
              </p>
            </div>
            
            <div className="bg-background p-4 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-medium mb-2">Inventory Optimization</h3>
              <p className="text-muted-foreground">
                Predict spare parts needs and optimize inventory levels to reduce holding costs while ensuring parts availability.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {isLoading ? (
                  <>
                    <Skeleton className="h-16 bg-muted/30" />
                    <Skeleton className="h-16 bg-muted/30" />
                  </>
                ) : (
                  <>
                    <div className="bg-muted/30 p-3 rounded-md transition-transform duration-300 hover:scale-105 shadow-inner">
                      <div className="font-medium">Inventory Costs</div>
                      <div className="text-sm text-muted-foreground">Reduced by {data.optimization.inventoryCostReduction}%</div>
                    </div>
                    <div className="bg-muted/30 p-3 rounded-md transition-transform duration-300 hover:scale-105 shadow-inner">
                      <div className="font-medium">Part Availability</div>
                      <div className="text-sm text-muted-foreground">Increased to {data.optimization.partAvailability}%</div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="insights" className="space-y-4 transition-all duration-300">
            <div className="bg-muted/50 p-4 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-medium mb-2">Anomaly Detection</h3>
              <p className="text-muted-foreground">
                AI continuously monitors asset performance data to detect abnormal patterns that may indicate developing issues.
              </p>
              {!isLoading && (
                <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                  {data.insights.anomalyDetections} anomalies detected this month
                </div>
              )}
            </div>
            
            <div className="bg-background p-4 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-medium mb-2">Natural Language Reports</h3>
              <p className="text-muted-foreground">
                AI generates easy-to-understand narratives explaining complex data patterns and recommendations.
              </p>
              {!isLoading && (
                <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                  {data.insights.reportsGenerated} reports generated
                </div>
              )}
            </div>
            
            <div className="bg-background p-4 rounded-lg border shadow-sm hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-medium mb-2">Visual Recognition</h3>
              <p className="text-muted-foreground">
                Upload photos of equipment issues and the AI will analyze and suggest possible causes and solutions.
              </p>
              {!isLoading && (
                <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                  {data.insights.visualRecognitionAccuracy}% recognition accuracy
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800 shadow-inner">
          <h3 className="font-medium text-green-800 dark:text-green-300 mb-2">Implementation Roadmap</h3>
          <ul className="space-y-2 text-sm text-green-700 dark:text-green-400">
            <li className="flex items-center gap-2 transition-all duration-300 hover:translate-x-1">
              <span className="bg-green-200 dark:bg-green-800 rounded-full p-1">
                {data.implementationPhase === 'data-collection' ? '✓' : '○'}
              </span>
              <span>Phase 1: Data collection and integration {data.implementationPhase === 'data-collection' ? '(Current)' : ''}</span>
            </li>
            <li className="flex items-center gap-2 transition-all duration-300 hover:translate-x-1">
              <span className="bg-green-200 dark:bg-green-800 rounded-full p-1">
                {data.implementationPhase === 'predictive-models' ? '✓' : data.implementationPhase === 'data-collection' ? '⋯' : '○'}
              </span>
              <span>Phase 2: Predictive models and training {data.implementationPhase === 'predictive-models' ? '(Current)' : data.implementationPhase === 'data-collection' ? '(Upcoming)' : ''}</span>
            </li>
            <li className="flex items-center gap-2 transition-all duration-300 hover:translate-x-1">
              <span className="bg-green-200 dark:bg-green-800 rounded-full p-1">
                {data.implementationPhase === 'full-automation' ? '✓' : '○'}
              </span>
              <span>Phase 3: Full automation and integration {data.implementationPhase === 'full-automation' ? '(Current)' : '(Future)'}</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AICapabilities;

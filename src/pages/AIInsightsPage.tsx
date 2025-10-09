import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import AICapabilities from '@/components/ai/AICapabilities';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchRecommendedMaintenance, 
  fetchOptimizationSuggestions, 
  generateAIAnalysis,
  RecommendedMaintenance,
  OptimizationSuggestion
} from '@/services/aiInsightsApi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, ChartBar, Activity, Loader } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const AIInsightsPage: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch recommended maintenance tasks
  const { 
    data: recommendedMaintenance = [] as RecommendedMaintenance[], 
    isLoading: isLoadingMaintenance 
  } = useQuery({
    queryKey: ['ai-insights', 'recommended-maintenance'],
    queryFn: fetchRecommendedMaintenance
  });
  
  // Fetch optimization suggestions
  const { 
    data: optimizationSuggestions = [] as OptimizationSuggestion[], 
    isLoading: isLoadingOptimization
  } = useQuery({
    queryKey: ['ai-insights', 'optimization-suggestions'],
    queryFn: fetchOptimizationSuggestions
  });

  // Generate new AI analysis mutation
  const generateMutation = useMutation({
    mutationFn: generateAIAnalysis,
    onMutate: () => {
      setIsGenerating(true);
    },
    onSuccess: () => {
      // Invalidate and refetch queries to update the UI
      queryClient.invalidateQueries({ queryKey: ['ai-insights'] });
      toast({
        title: "Analysis complete",
        description: "AI insights have been updated with fresh data",
      });
      setIsGenerating(false);
    },
    onError: () => {
      toast({
        title: "Analysis failed",
        description: "Could not generate new analysis. Using mock data instead.",
        variant: "destructive"
      });
      setIsGenerating(false);
    },
  });

  const handleGenerateAnalysis = () => {
    generateMutation.mutate();
  };

  const handleImplementSuggestion = (suggestionId: number) => {
    toast({
      title: "Implementing suggestion",
      description: `Suggestion #${suggestionId} is being implemented.`,
    });
    // In a real app, this would trigger an API call to implement the suggestion
  };

  const handleScheduleMaintenance = (taskId: number) => {
    toast({
      title: "Maintenance Scheduled",
      description: `Task #${taskId} has been added to the maintenance schedule.`,
    });
    // In a real app, this would trigger an API call to schedule the maintenance
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent animate-fade-in">
              AI Insights
            </h1>
            <p className="text-muted-foreground mt-1 animate-fade-in" style={{ animationDelay: '100ms' }}>
              Intelligent analytics and predictions for your inventory system
            </p>
          </div>
          <Button 
            onClick={handleGenerateAnalysis} 
            className="bg-gradient-to-r from-green-700 to-green-500 hover:from-green-800 hover:to-green-600 transition-all duration-300 animate-fade-in shadow-lg hover:shadow-xl"
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
            )}
            {isGenerating ? "Generating..." : "Generate New Analysis"}
          </Button>
        </div>
        
        <AICapabilities />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="overflow-hidden border border-green-100 dark:border-green-900/30 shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in">
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
                <CardTitle>Predictive Maintenance</CardTitle>
              </div>
              <CardDescription>Recommendations based on asset data analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-5">
              {isLoadingMaintenance ? (
                [...Array(3)].map((_, index) => (
                  <Skeleton 
                    key={index} 
                    className="h-32 w-full rounded-lg"
                    style={{ animationDelay: `${index * 150}ms` }}
                  />
                ))
              ) : recommendedMaintenance.length === 0 ? (
                <div className="p-8 text-center border border-dashed rounded-lg">
                  <p className="text-muted-foreground">No maintenance tasks recommended at this time.</p>
                </div>
              ) : (
                recommendedMaintenance.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow hover:shadow-md transition-all duration-200 hover:translate-y-[-2px]"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="flex justify-between">
                      <h3 className="font-medium text-green-800 dark:text-green-300">{item.assetName}</h3>
                      <div className={`px-2 py-0.5 rounded text-xs ${
                        item.priority === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 
                        item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' : 
                        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      }`}>
                        {item.priority} Priority
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground my-2">{item.reason}</p>
                    <div className="flex justify-between items-center mt-3">
                      <div className="text-xs text-muted-foreground">
                        AI Confidence: 
                        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1">
                          <div 
                            className="h-full bg-green-500 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${item.confidence}%` }}
                          ></div>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="group"
                        onClick={() => handleScheduleMaintenance(item.id)}
                      >
                        Schedule
                        <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden border border-green-100 dark:border-green-900/30 shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in" style={{ animationDelay: '150ms' }}>
            <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30">
              <div className="flex items-center gap-2">
                <ChartBar className="h-5 w-5 text-green-600 dark:text-green-400" />
                <CardTitle>Resource Optimization</CardTitle>
              </div>
              <CardDescription>Suggestions to improve operational efficiency</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="suggestions" className="mt-2">
                <TabsList className="mb-4 bg-green-100 dark:bg-green-900/30">
                  <TabsTrigger 
                    value="suggestions"
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 transition-all duration-300"
                  >
                    Suggestions
                  </TabsTrigger>
                  <TabsTrigger 
                    value="implemented"
                    className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 transition-all duration-300"
                  >
                    Implemented
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="suggestions" className="space-y-4">
                  {isLoadingOptimization ? (
                    [...Array(3)].map((_, index) => (
                      <Skeleton 
                        key={index} 
                        className="h-28 w-full rounded-lg"
                        style={{ animationDelay: `${index * 150}ms` }}
                      />
                    ))
                  ) : optimizationSuggestions.length === 0 ? (
                    <div className="p-8 text-center border border-dashed rounded-lg">
                      <p className="text-muted-foreground">No optimization suggestions available at this time.</p>
                    </div>
                  ) : (
                    optimizationSuggestions.map((suggestion, index) => (
                      <div 
                        key={suggestion.id} 
                        className="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow hover:shadow-md transition-all duration-200 hover:translate-y-[-2px]"
                        style={{ animationDelay: `${index * 150 + 300}ms` }}
                      >
                        <h3 className="font-medium text-green-800 dark:text-green-300">{suggestion.title}</h3>
                        <p className="text-sm text-muted-foreground my-2">{suggestion.description}</p>
                        <div className="flex justify-between mt-3">
                          <div className="flex space-x-2">
                            <div className="text-xs bg-muted px-2 py-1 rounded-full">
                              Impact: {suggestion.impact}
                            </div>
                            <div className="text-xs bg-muted px-2 py-1 rounded-full">
                              Effort: {suggestion.implementationEffort}
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="group"
                            onClick={() => handleImplementSuggestion(suggestion.id)}
                          >
                            Implement
                            <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
                <TabsContent value="implemented">
                  <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-lg">
                    <Sparkles className="h-10 w-10 text-gray-300 dark:text-gray-600 mb-2" />
                    <p className="text-muted-foreground">No suggestions have been implemented yet.</p>
                    <Button variant="ghost" size="sm" className="mt-4">
                      View implementation history
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIInsightsPage;

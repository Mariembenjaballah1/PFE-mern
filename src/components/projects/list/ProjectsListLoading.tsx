
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const ProjectsListLoading: React.FC = () => {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-4">
                {/* Title and badges */}
                <div className="space-y-3">
                  <Skeleton className="h-8 w-64" />
                  <div className="flex gap-3">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
                
                {/* Description */}
                <Skeleton className="h-4 w-full max-w-2xl" />
                
                {/* Details grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
                
                {/* Resource allocation */}
                <div className="space-y-3">
                  <Skeleton className="h-4 w-32" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                </div>
              </div>
              
              {/* Action buttons */}
              <div className="flex gap-2 ml-6">
                <Skeleton className="h-10 w-10 rounded" />
                <Skeleton className="h-10 w-10 rounded" />
                <Skeleton className="h-10 w-10 rounded" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

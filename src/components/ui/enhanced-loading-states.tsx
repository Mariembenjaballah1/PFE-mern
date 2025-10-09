
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import LoadingSpinner from './loading-spinner';

// Loading state for asset cards
export const AssetCardSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-8 w-1/3" />
      </div>
    </CardContent>
  </Card>
);

// Loading state for table rows
export const TableRowSkeleton = ({ columns = 5 }: { columns?: number }) => (
  <tr>
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="px-4 py-2">
        <Skeleton className="h-4 w-full" />
      </td>
    ))}
  </tr>
);

// Loading state for forms
export const FormSkeleton = () => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-10 w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-10 w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-24 w-full" />
    </div>
    <Skeleton className="h-10 w-1/3" />
  </div>
);

// Loading overlay for full-page loading
export const LoadingOverlay = ({ message = "Loading..." }: { message?: string }) => (
  <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
    <LoadingSpinner size="lg" text={message} />
  </div>
);

// Loading state for charts
export const ChartSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-6 w-1/3" />
    <div className="h-64 flex items-end justify-between gap-2">
      {Array.from({ length: 7 }).map((_, i) => (
        <Skeleton 
          key={i} 
          className="w-full" 
          style={{ height: `${Math.random() * 60 + 40}%` }}
        />
      ))}
    </div>
  </div>
);

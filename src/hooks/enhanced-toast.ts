
import { toast as baseToast } from '@/hooks/use-toast';

// Enhanced toast configurations for different scenarios
export const enhancedToast = {
  // Success variations
  success: {
    default: (title: string, description?: string) => 
      baseToast({
        title: `✅ ${title}`,
        description,
        variant: "default",
        duration: 4000
      }),
    
    withAction: (title: string, description: string, actionLabel: string, actionFn: () => void) =>
      baseToast({
        title: `✅ ${title}`,
        description,
        variant: "default",
        duration: 6000
      }),
    
    persistent: (title: string, description?: string) =>
      baseToast({
        title: `✅ ${title}`,
        description,
        variant: "default",
        duration: 0 // Persistent until dismissed
      })
  },

  // Error variations
  error: {
    default: (title: string, description?: string) =>
      baseToast({
        title: `❌ ${title}`,
        description,
        variant: "destructive",
        duration: 6000
      }),
    
    withRetry: (title: string, description: string, retryFn: () => void) =>
      baseToast({
        title: `❌ ${title}`,
        description: `${description} Click retry to try again.`,
        variant: "destructive",
        duration: 8000
      }),
    
    critical: (title: string, description?: string) =>
      baseToast({
        title: `🚨 ${title}`,
        description,
        variant: "destructive",
        duration: 0 // Persistent for critical errors
      })
  },

  // Warning variations
  warning: {
    default: (title: string, description?: string) =>
      baseToast({
        title: `⚠️ ${title}`,
        description,
        variant: "default",
        duration: 5000
      }),
    
    withAction: (title: string, description: string, actionLabel: string, actionFn: () => void) =>
      baseToast({
        title: `⚠️ ${title}`,
        description,
        variant: "default",
        duration: 7000
      })
  },

  // Info variations
  info: {
    default: (title: string, description?: string) =>
      baseToast({
        title: `ℹ️ ${title}`,
        description,
        variant: "default",
        duration: 4000
      }),
    
    progress: (title: string, description: string, progress?: number) =>
      baseToast({
        title: `🔄 ${title}`,
        description: progress ? `${description} (${progress}% complete)` : description,
        variant: "default",
        duration: progress === 100 ? 3000 : 0
      })
  },

  // Asset-specific toasts
  asset: {
    created: (assetName: string) =>
      baseToast({
        title: "🆕 Asset Created",
        description: `"${assetName}" has been successfully added to your inventory`,
        variant: "default",
        duration: 5000
      }),
    
    updated: (assetName: string) =>
      baseToast({
        title: "📝 Asset Updated",
        description: `"${assetName}" has been successfully updated`,
        variant: "default",
        duration: 4000
      }),
    
    deleted: (assetName: string) =>
      baseToast({
        title: "🗑️ Asset Deleted",
        description: `"${assetName}" has been removed from your inventory`,
        variant: "default",
        duration: 4000
      }),
    
    assigned: (assetName: string, assignee: string) =>
      baseToast({
        title: "👤 Asset Assigned",
        description: `"${assetName}" has been assigned to ${assignee}`,
        variant: "default",
        duration: 5000
      })
  },

  // Maintenance-specific toasts
  maintenance: {
    scheduled: (assetName: string, date: string) =>
      baseToast({
        title: "📅 Maintenance Scheduled",
        description: `Maintenance for "${assetName}" scheduled for ${date}`,
        variant: "default",
        duration: 6000
      }),
    
    completed: (assetName: string) =>
      baseToast({
        title: "✅ Maintenance Completed",
        description: `Maintenance for "${assetName}" has been completed successfully`,
        variant: "default",
        duration: 5000
      }),
    
    overdue: (assetName: string) =>
      baseToast({
        title: "⚠️ Maintenance Overdue",
        description: `Maintenance for "${assetName}" is overdue and needs immediate attention`,
        variant: "destructive",
        duration: 8000
      })
  }
};

export { baseToast as toast };

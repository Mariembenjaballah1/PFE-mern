
# Components Documentation

## Overview
This document provides detailed information about all components in the InvenTrack application, their props, usage, and examples.

## Component Categories

### 1. Dashboard Components

#### StatsCards
**Location**: `src/components/dashboard/StatsCards.tsx`
**Purpose**: Displays key performance metrics in card format

**Props**: None (fetches data internally)

**Features**:
- Real-time asset count
- Active projects count
- Pending maintenance tasks
- Reported issues count
- Trend indicators with percentages

**Usage**:
```tsx
import StatsCards from '@/components/dashboard/StatsCards';

<StatsCards />
```

#### ResourcesCard
**Location**: `src/components/dashboard/ResourcesCard.tsx`
**Purpose**: Shows system resource utilization with progress bars

**Props**:
```tsx
interface ResourcesCardProps {
  assets?: Asset[];
}
```

**Features**:
- CPU usage monitoring
- Memory utilization
- Storage capacity tracking
- Database load indicators
- Animated progress bars

#### MaintenanceSchedule
**Location**: `src/components/dashboard/MaintenanceSchedule.tsx`
**Purpose**: Displays upcoming maintenance tasks

**Features**:
- Chronological task listing
- Priority indicators
- Status badges
- Direct task navigation

### 2. Asset Management Components

#### AssetsTable
**Location**: `src/components/assets/AssetsTable.tsx`
**Purpose**: Main table for displaying and managing assets

**Props**:
```tsx
interface AssetsTableProps {
  assets: Asset[];
  onAssetClick: (asset: Asset) => void;
  onEditAsset: (asset: Asset) => void;
  onDeleteAsset: (assetId: string) => void;
  isLoading?: boolean;
}
```

**Features**:
- Sortable columns
- Status indicators
- Action menus
- Responsive design
- Loading states

#### AddAssetForm
**Location**: `src/components/assets/AddAssetForm.tsx`
**Purpose**: Form for creating new assets

**Props**:
```tsx
interface AddAssetFormProps {
  onAssetAdded: (asset: Asset) => void;
  onCancel: () => void;
}
```

**Features**:
- Form validation
- Category selection
- Resource allocation
- File upload support

#### AssetDetailsDialog
**Location**: `src/components/assets/AssetDetailsDialog.tsx`
**Purpose**: Modal for displaying detailed asset information

**Props**:
```tsx
interface AssetDetailsDialogProps {
  asset: Asset | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (asset: Asset) => void;
}
```

**Features**:
- Tabbed interface
- Resource utilization charts
- Maintenance history
- Action buttons

### 3. Maintenance Components

#### MaintenanceTaskList
**Location**: `src/components/maintenance/MaintenanceTaskList.tsx`
**Purpose**: Lists maintenance tasks with filtering

**Props**:
```tsx
interface MaintenanceTaskListProps {
  tasks: MaintenanceTask[];
  onTaskClick: (task: MaintenanceTask) => void;
  filters: TaskFilters;
}
```

**Features**:
- Status filtering
- Priority sorting
- Search functionality
- Bulk operations

#### PlanMaintenanceForm
**Location**: `src/components/maintenance/PlanMaintenanceForm.tsx`
**Purpose**: Form for scheduling maintenance tasks

**Props**:
```tsx
interface PlanMaintenanceFormProps {
  assets: Asset[];
  technicians: User[];
  onSubmit: (task: Partial<MaintenanceTask>) => void;
  onCancel: () => void;
}
```

**Features**:
- Asset selection
- Technician assignment
- Scheduling calendar
- Priority setting
- Estimated duration

### 4. Project Management Components

#### ProjectsList
**Location**: `src/components/projects/ProjectsList.tsx`
**Purpose**: Displays projects in card or list format

**Props**:
```tsx
interface ProjectsListProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
  viewMode: 'grid' | 'list';
}
```

**Features**:
- Resource quota visualization
- Status indicators
- Progress tracking
- Quick actions

#### ProjectDetailsDialog
**Location**: `src/components/projects/dialogs/ProjectDetailsDialog.tsx`
**Purpose**: Comprehensive project information modal

**Props**:
```tsx
interface ProjectDetailsDialogProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (project: Project) => void;
}
```

**Features**:
- Overview tab
- Assets tab
- Resource allocation
- Team management

### 5. Reporting Components

#### ReportsTabs
**Location**: `src/components/reports/ReportsTabs.tsx`
**Purpose**: Main reporting interface with tabbed navigation

**Props**:
```tsx
interface ReportsTabsProps {
  assetData: Asset[];
  maintenanceData: any[];
  settings: any;
}
```

**Features**:
- General reports
- Asset reports
- Maintenance reports
- Export functionality

#### AssetInventoryReportCard
**Location**: `src/components/reports/AssetInventoryReportCard.tsx`
**Purpose**: Asset inventory visualization and export

**Props**:
```tsx
interface AssetInventoryReportCardProps {
  assets?: Asset[];
}
```

**Features**:
- Bar chart visualization
- Export to PDF/Excel/CSV
- Automatic data refresh
- Empty state handling

#### ExcelReportButton
**Location**: `src/components/reports/ExcelReportButton.tsx`
**Purpose**: Multi-format export button with dropdown

**Props**:
```tsx
interface ExcelReportButtonProps {
  onGenerateReport: (format: 'csv' | 'excel' | 'pdf') => void;
  disabled?: boolean;
  loading?: boolean;
  chartId?: string;
}
```

**Features**:
- Multiple export formats
- Loading states
- Chart integration
- Error handling

### 6. User Interface Components

#### Navigation Components
- **AppSidebar**: Main navigation sidebar
- **UserDisplay**: User information and actions
- **Logo**: Application branding

#### Form Components
- **Button**: Enhanced button with variants
- **Input**: Styled input fields
- **Select**: Dropdown selection
- **Textarea**: Multi-line text input
- **Checkbox**: Boolean input control

#### Layout Components
- **Card**: Content container
- **Dialog**: Modal dialogs
- **Tabs**: Tabbed interfaces
- **Progress**: Progress indicators

### 7. Specialized Components

#### Chatbot Components
**Location**: `src/components/chatbot/`

- **Chatbot**: Main chatbot interface
- **ChatWindow**: Chat conversation area
- **MessageList**: Message history
- **MessageInput**: User input field

#### Email Components
**Location**: `src/components/email/`

- **EmailForm**: Compose email interface
- **EmailInbox**: Received emails list
- **AttachmentsField**: File attachment handling

#### Notification Components
**Location**: `src/components/notifications/`

- **NotificationBell**: Notification indicator
- **NotificationList**: Notification history
- **NotificationItem**: Individual notification

## Component Patterns

### Common Props Patterns

#### Loading States
```tsx
interface ComponentProps {
  isLoading?: boolean;
}
```

#### Error Handling
```tsx
interface ComponentProps {
  error?: string | null;
  onRetry?: () => void;
}
```

#### Event Handlers
```tsx
interface ComponentProps {
  onSuccess: (data: any) => void;
  onError: (error: Error) => void;
  onCancel: () => void;
}
```

### State Management Patterns

#### Local State
```tsx
const [isOpen, setIsOpen] = useState(false);
const [data, setData] = useState<T[]>([]);
```

#### Server State (TanStack Query)
```tsx
const { data, isLoading, error } = useQuery({
  queryKey: ['assets'],
  queryFn: fetchAssets,
});
```

### Styling Patterns

#### Tailwind Classes
```tsx
className="flex items-center gap-2 p-4 rounded-md border"
```

#### Conditional Styling
```tsx
className={cn(
  "base-class",
  isActive && "active-class",
  variant === "primary" && "primary-class"
)}
```

## Best Practices

### Component Design
1. Keep components small and focused
2. Use proper TypeScript interfaces
3. Implement loading and error states
4. Follow naming conventions
5. Add proper documentation

### Performance
1. Use React.memo for expensive components
2. Implement proper key props in lists
3. Avoid inline object creation
4. Use useCallback for event handlers
5. Lazy load heavy components

### Accessibility
1. Use semantic HTML elements
2. Add proper ARIA labels
3. Implement keyboard navigation
4. Ensure color contrast
5. Test with screen readers

### Testing
1. Write unit tests for complex logic
2. Test user interactions
3. Mock external dependencies
4. Test error scenarios
5. Maintain good test coverage

## Component Lifecycle

### Creation Process
1. Define component interface
2. Implement basic structure
3. Add styling with Tailwind
4. Implement functionality
5. Add error handling
6. Write tests
7. Document usage

### Maintenance
1. Regular prop type updates
2. Performance optimization
3. Accessibility improvements
4. Bug fixes and enhancements
5. Documentation updates

## Migration Guide

### From Class to Functional Components
```tsx
// Old: Class component
class MyComponent extends React.Component {
  state = { count: 0 };
  
  render() {
    return <div>{this.state.count}</div>;
  }
}

// New: Functional component
const MyComponent: React.FC = () => {
  const [count, setCount] = useState(0);
  
  return <div>{count}</div>;
};
```

### Adding TypeScript
```tsx
// Add proper interfaces
interface Props {
  title: string;
  items: Item[];
  onItemClick: (item: Item) => void;
}

// Use the interface
const MyComponent: React.FC<Props> = ({ title, items, onItemClick }) => {
  // Component implementation
};
```

This documentation should be updated as components are added, modified, or removed from the application.

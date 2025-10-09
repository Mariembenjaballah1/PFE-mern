
# Services Documentation

## Overview
This document provides comprehensive information about all service modules in the InvenTrack application, including API services, utility services, and helper functions.

## Service Architecture

```
Services Layer
├── API Services (External communication)
├── Business Logic Services (Data processing)
├── Utility Services (Helper functions)
└── Mock Services (Development support)
```

## API Services

### Core API Services

#### assetApi.ts
**Purpose**: Manages all asset-related API operations

**Functions**:
```typescript
// Basic CRUD operations
fetchAssets(params?: FilterParams): Promise<Asset[]>
fetchAssetById(id: string): Promise<Asset>
createAsset(assetData: Omit<Asset, 'id' | 'lastUpdate'>): Promise<Asset>
updateAsset(id: string, assetData: Partial<Asset>): Promise<Asset>
deleteAsset(id: string): Promise<void>

// Filtering operations
fetchAssetsByCategory(category: string): Promise<Asset[]>
fetchAssetsByStatus(status: string): Promise<Asset[]>
fetchAssetsByProject(projectId: string): Promise<Asset[]>

// Resource operations
updateAssetResources(id: string, resources: AssetResources): Promise<Asset>
```

**Error Handling**:
- Automatic retry for network failures
- Fallback to mock data in development
- Proper error logging and reporting

**Usage Example**:
```typescript
import { fetchAssets, createAsset } from '@/services/assetApi';

// Fetch all assets
const assets = await fetchAssets();

// Create new asset
const newAsset = await createAsset({
  name: 'New Server',
  category: 'Servers',
  status: 'operational',
  location: 'Data Center',
  purchaseDate: '2024-01-01',
  assignedTo: 'IT Team'
});
```

#### userApi.ts
**Purpose**: Handles user authentication and management

**Functions**:
```typescript
// Authentication
login(email: string, password: string): Promise<LoginResponse>
logout(): Promise<void>

// User management
fetchUsers(): Promise<User[]>
fetchUserById(id: string): Promise<User>
createUser(userData: CreateUserData): Promise<User>
updateUser(id: string, userData: Partial<User>): Promise<User>
deleteUser(id: string): Promise<void>
```

**Features**:
- JWT token management
- Mock authentication for development
- Automatic token refresh
- Role-based access control

**Usage Example**:
```typescript
import { login, fetchUsers } from '@/services/userApi';

// User login
const response = await login('user@example.com', 'password');
localStorage.setItem('token', response.user.token);

// Fetch all users (admin only)
const users = await fetchUsers();
```

#### maintenanceApi.ts
**Purpose**: Maintenance task management

**Functions**:
```typescript
// Basic operations
fetchMaintenance(): Promise<MaintenanceTask[]>
getMaintenanceTasks(): Promise<MaintenanceTask[]>
fetchMaintenanceById(id: string): Promise<MaintenanceTask>
createMaintenance(data: CreateMaintenanceData): Promise<MaintenanceTask>
updateMaintenance(id: string, data: Partial<MaintenanceTask>): Promise<MaintenanceTask>
deleteMaintenance(id: string): Promise<void>

// Analytics
getPendingMaintenanceCount(): Promise<number>
getIssuesCount(): Promise<number>
```

**Features**:
- Task status tracking
- Priority management
- Technician assignment
- Scheduling and notifications

#### projectApi.ts
**Purpose**: Project and resource management

**Functions**:
```typescript
// Project operations
fetchProjects(): Promise<Project[]>
fetchProjectById(id: string): Promise<Project>
createProject(data: CreateProjectData): Promise<Project>
updateProject(id: string, data: Partial<Project>): Promise<Project>
deleteProject(id: string): Promise<void>

// Resource operations
getProjectAssets(projectId: string): Promise<Asset[]>
getProjectResourceUsage(): Promise<ResourceUsage[]>
```

**Features**:
- Resource quota management
- Asset assignment
- Progress tracking
- Team collaboration

#### emailApi.ts
**Purpose**: Email functionality and communication

**Functions**:
```typescript
// Email operations
sendEmail(emailData: EmailData): Promise<SendEmailResponse>
getEmailTemplates(): Promise<EmailTemplate[]>
getReceivedEmails(): Promise<ReceivedEmail[]>
markEmailAsRead(emailId: string): Promise<void>
```

**Features**:
- Template system
- Attachment support
- Mock email for development
- Inbox management

**Data Structures**:
```typescript
interface EmailData {
  to: string;
  subject: string;
  message: string;
  attachments?: File[];
}

interface ReceivedEmail {
  id: string;
  from: string;
  to: string;
  subject: string;
  message: string;
  read: boolean;
  date: string;
  attachments?: {name: string, url: string}[];
}
```

#### reportsService.ts
**Purpose**: Report generation and export functionality

**Functions**:
```typescript
// Report generation
generateAssetUsageReport(): Promise<AssetUsageReport>
generateMaintenanceHistoryReport(): Promise<MaintenanceHistoryReport>
generateAssetInventoryReport(): Promise<AssetInventoryReport>

// Export functions
exportToCSV(data: any[], filename: string, format?: 'csv' | 'excel' | 'pdf', chartId?: string): Promise<void>
```

**Features**:
- Multiple export formats (PDF, Excel, CSV)
- Chart integration
- Automated report scheduling
- Custom report builders

**Export Example**:
```typescript
import { generateAssetInventoryReport, exportToCSV } from '@/services/reportsService';

// Generate and export report
const reportData = await generateAssetInventoryReport();
await exportToCSV(reportData.assets, 'inventory_report', 'pdf', 'chart-element-id');
```

### Specialized Services

#### settingsApi.ts
**Purpose**: Application and user settings management

**Functions**:
```typescript
// User settings
fetchUserSettings(): Promise<UserSettings>
updateUserSettings(settings: Partial<UserSettings>): Promise<UserSettings>

// System settings (admin only)
fetchSystemSettings(): Promise<SystemSettings>
updateSystemSettings(settings: Partial<SystemSettings>): Promise<SystemSettings>
```

**Settings Structure**:
```typescript
interface UserSettings {
  notifications: {
    email: boolean;
    inApp: boolean;
    maintenance: boolean;
    resourceAlerts: boolean;
  };
  theme: 'light' | 'dark' | 'system';
  language: string;
  dashboardLayout: string;
  pageSize: number;
}
```

#### aiInsightsApi.ts
**Purpose**: AI-powered insights and recommendations

**Functions**:
```typescript
// Insights
getAssetInsights(assetId: string): Promise<AssetInsights>
getMaintenancePredictions(): Promise<MaintenancePrediction[]>
getResourceOptimizations(): Promise<ResourceOptimization[]>
```

#### statsService.ts
**Purpose**: Dashboard statistics and analytics

**Functions**:
```typescript
// Statistics
getTotalAssetsCount(): Promise<number>
getActiveProjectsCount(): Promise<number>
getPendingMaintenanceCount(): Promise<number>
getIssuesReportedCount(): Promise<number>
getStatsTrends(): Promise<StatsTrends>
```

## Asset Services (Specialized)

### assetBasicOperations.ts
**Purpose**: Core asset CRUD operations with TanStack Query compatibility

**Key Features**:
- TanStack Query integration
- Proper error handling
- Type safety
- Mock data fallback

**Usage with TanStack Query**:
```typescript
import { useQuery } from '@tanstack/react-query';
import { fetchAssets } from '@/services/assets/assetBasicOperations';

const { data: assets, isLoading, error } = useQuery({
  queryKey: ['assets'],
  queryFn: fetchAssets,
});
```

### assetFilterOperations.ts
**Purpose**: Advanced asset filtering and search

**Functions**:
```typescript
fetchAssetsByCategory(category: string): Promise<Asset[]>
fetchAssetsByStatus(status: string): Promise<Asset[]>
fetchAssetsByProject(projectId: string): Promise<Asset[]>
```

### assetResourceOperations.ts
**Purpose**: Server resource management and monitoring

**Functions**:
```typescript
// Resource operations
fetchServerResourceData(assetId: string): Promise<ServerResourceData>
updateAssetResources(assetId: string, resources: ResourceUpdate): Promise<Asset>
allocateServerResources(assetId: string, cpu: number, ram: number, disk: number): Promise<Asset>
resetServerUsageStats(assetId: string): Promise<void>

// Utility functions
generateServerUptime(serverId: string): string
generateServerMetrics(serverId: string): ServerMetrics
```

**Server Metrics Example**:
```typescript
const metrics = generateServerMetrics('server-123');
// Returns: { cpu: 45, ram: 60, disk: 75, network: 25, connections: 120, uptime: '15 days, 8 hours' }
```

## API Client Configuration

### apiClient.ts
**Purpose**: Centralized HTTP client configuration

**Features**:
- Automatic token injection
- Response/request interceptors
- Error handling
- Base URL configuration

**Configuration**:
```typescript
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - adds auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - handles auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## Service Patterns

### Error Handling Pattern
```typescript
export const fetchData = async () => {
  try {
    const response = await api.get('/endpoint');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    
    // Development fallback
    if (process.env.NODE_ENV === 'development') {
      return mockData;
    }
    
    throw error;
  }
};
```

### TanStack Query Integration
```typescript
export const fetchAssets = async (queryContext?: any): Promise<Asset[]> => {
  // Handle TanStack Query context
  let params: Record<string, string> = {};
  
  if (queryContext && typeof queryContext === 'object') {
    if (Array.isArray(queryContext.queryKey) && queryContext.queryKey.length > 1) {
      params = queryContext.queryKey[1] || {};
    }
  }
  
  // Make API call with params
  const response = await api.get('/assets', { params });
  return response.data;
};
```

### Mock Data Pattern
```typescript
const mockUsers = (): User[] => {
  return [
    {
      _id: 'user1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'ADMIN',
      department: 'IT'
    },
    // ... more mock data
  ];
};
```

## Testing Services

### Unit Testing
```typescript
// Example test for asset service
import { fetchAssets } from '@/services/assetApi';
import api from '@/services/apiClient';

jest.mock('@/services/apiClient');
const mockedApi = api as jest.Mocked<typeof api>;

describe('assetApi', () => {
  it('should fetch assets successfully', async () => {
    const mockAssets = [{ id: '1', name: 'Test Asset' }];
    mockedApi.get.mockResolvedValue({ data: mockAssets });
    
    const result = await fetchAssets();
    
    expect(result).toEqual(mockAssets);
    expect(mockedApi.get).toHaveBeenCalledWith('/assets');
  });
});
```

### Integration Testing
```typescript
// Test with actual API endpoints
describe('Asset API Integration', () => {
  it('should create and fetch asset', async () => {
    const newAsset = {
      name: 'Test Server',
      category: 'Servers',
      status: 'operational'
    };
    
    const created = await createAsset(newAsset);
    expect(created.id).toBeDefined();
    
    const fetched = await fetchAssetById(created.id);
    expect(fetched.name).toBe(newAsset.name);
  });
});
```

## Performance Optimization

### Caching Strategy
- TanStack Query for server state caching
- localStorage for user preferences
- Memory caching for frequently accessed data

### Request Optimization
- Request deduplication
- Batch operations where possible
- Pagination for large datasets
- Lazy loading for heavy operations

### Error Recovery
- Automatic retry for transient failures
- Fallback to cached data
- Graceful degradation
- User-friendly error messages

## Security Considerations

### Authentication
- JWT token management
- Automatic token refresh
- Secure token storage
- Logout on token expiry

### Data Validation
- Input sanitization
- Type checking
- Schema validation
- XSS prevention

### API Security
- CORS configuration
- Rate limiting
- Request validation
- Error message sanitization

## Development Guidelines

### Service Creation
1. Define clear interfaces
2. Implement error handling
3. Add mock data support
4. Write comprehensive tests
5. Document usage examples

### Maintenance
1. Regular dependency updates
2. Performance monitoring
3. Error tracking
4. API versioning
5. Documentation updates

### Best Practices
1. Use TypeScript for type safety
2. Implement proper error handling
3. Add loading states
4. Cache frequently accessed data
5. Log important operations

This service documentation should be updated as new services are added or existing ones are modified.

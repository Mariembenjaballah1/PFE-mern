
# InvenTrack - Comprehensive Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Components Documentation](#components-documentation)
6. [Services Documentation](#services-documentation)
7. [API Documentation](#api-documentation)
8. [Setup and Installation](#setup-and-installation)
9. [Development Guidelines](#development-guidelines)
10. [Testing](#testing)
11. [Deployment](#deployment)

## Project Overview

InvenTrack is a comprehensive inventory management system built with React and TypeScript. It provides organizations with tools to track, manage, and maintain their assets efficiently while offering real-time insights, maintenance scheduling, and AI-powered suggestions.

### Key Features
- **Asset Management**: Complete asset lifecycle tracking
- **Maintenance Management**: Preventive and corrective maintenance scheduling
- **Project Management**: Resource allocation and project tracking
- **Reporting System**: Comprehensive reporting with export capabilities
- **User Management**: Role-based access control
- **Dashboard Analytics**: Real-time metrics and visualizations
- **Email Integration**: Notification and communication system
- **AI Insights**: Smart recommendations and predictive analytics

## Architecture

InvenTrack follows a modern single-page application (SPA) architecture:

```
┌─────────────────┐
│   Frontend      │
│   (React/TS)    │
├─────────────────┤
│   Services      │
│   Layer         │
├─────────────────┤
│   API Client    │
│   (Axios)       │
├─────────────────┤
│   Backend API   │
│   (Node.js)     │
├─────────────────┤
│   Database      │
│   (MongoDB)     │
└─────────────────┘
```

## Technology Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **Shadcn/UI** - Component library
- **React Router DOM** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **Recharts** - Data visualization
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **CORS** - Cross-origin resource sharing

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript Compiler** - Type checking

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── assets/         # Asset management components
│   ├── dashboard/      # Dashboard widgets
│   ├── maintenance/    # Maintenance management
│   ├── projects/       # Project management
│   ├── reports/        # Reporting components
│   ├── users/          # User management
│   ├── email/          # Email functionality
│   ├── auth/           # Authentication
│   ├── chatbot/        # AI assistant
│   └── notifications/  # Notification system
├── pages/              # Page components
├── services/           # API services and utilities
│   ├── assets/         # Asset-specific services
│   └── *.ts            # Various API services
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── docs/               # Documentation
└── styles/             # Global styles and themes
```

## Components Documentation

### Core Components

#### Dashboard Components
Located in `src/components/dashboard/`

- **StatsCards**: Displays key metrics (assets, projects, maintenance, issues)
- **ResourcesCard**: Shows system resource utilization
- **ResourcesChart**: Visual representation of resource usage
- **StatusPieChart**: Asset status distribution
- **MaintenanceSchedule**: Upcoming maintenance tasks
- **RecentActivities**: Latest system activities

#### Asset Management
Located in `src/components/assets/`

- **AssetsTable**: Main asset listing with filtering and sorting
- **AssetDetailsDialog**: Detailed asset information modal
- **AddAssetForm**: Form for creating new assets
- **EditAssetDialog**: Asset modification interface
- **AssetActionsMenu**: Dropdown menu for asset operations
- **ServerForm**: Specialized form for server assets

#### Maintenance Management
Located in `src/components/maintenance/`

- **MaintenanceTaskList**: List of maintenance tasks
- **MaintenanceTaskCard**: Individual task display
- **PlanMaintenanceForm**: Create maintenance schedules
- **MaintenanceCalendar**: Calendar view of maintenance
- **MaintenanceNotification**: Task notifications

#### Reporting System
Located in `src/components/reports/`

- **ReportsTabs**: Main reporting interface
- **AssetInventoryReportCard**: Asset inventory reports
- **MaintenanceHistoryReportCard**: Maintenance history
- **AssetUsageReportCard**: Asset utilization reports
- **ExcelReportButton**: Export functionality

### UI Components
All base UI components are located in `src/components/ui/` and follow the Shadcn/UI pattern.

## Services Documentation

### API Services
Located in `src/services/`

#### Core Services

**assetApi.ts**
- Manages all asset-related API calls
- Functions: fetchAssets, createAsset, updateAsset, deleteAsset
- Supports filtering by category, status, and project

**userApi.ts**
- Handles user authentication and management
- Functions: login, logout, fetchUsers, createUser, updateUser
- Includes mock authentication for development

**maintenanceApi.ts**
- Maintenance task management
- Functions: fetchMaintenance, createMaintenance, updateMaintenance
- Supports task filtering and status updates

**projectApi.ts**
- Project and resource management
- Functions: fetchProjects, createProject, getProjectAssets
- Handles resource allocation and tracking

**reportsService.ts**
- Report generation and export functionality
- Supports PDF, Excel, and CSV export formats
- Includes chart integration for visual reports

**emailApi.ts**
- Email functionality with template support
- Mock email system for development
- Attachment handling and inbox management

#### Specialized Services

**settingsApi.ts**
- User and system settings management
- Notification preferences and theme settings

**aiInsightsApi.ts**
- AI-powered recommendations and insights
- Predictive maintenance suggestions

**statsService.ts**
- Dashboard statistics and metrics
- Trend analysis and comparisons

### Asset Services
Located in `src/services/assets/`

**assetBasicOperations.ts**
- Core CRUD operations for assets
- TanStack Query compatible functions

**assetFilterOperations.ts**
- Advanced filtering and search capabilities
- Category, status, and project-based filtering

**assetResourceOperations.ts**
- Server resource management
- CPU, RAM, and disk allocation tracking

## API Documentation

### Endpoints

#### Assets
```
GET    /api/assets                     # Get all assets
GET    /api/assets/:id                 # Get specific asset
POST   /api/assets                     # Create new asset
PATCH  /api/assets/:id                 # Update asset
DELETE /api/assets/:id                 # Delete asset
GET    /api/assets/category/:category  # Filter by category
GET    /api/assets/status/:status      # Filter by status
GET    /api/assets/project/:projectId  # Filter by project
```

#### Users
```
GET    /api/users           # Get all users
POST   /api/users           # Create user
PATCH  /api/users/:id       # Update user
DELETE /api/users/:id       # Delete user
POST   /api/users/login     # User authentication
```

#### Maintenance
```
GET    /api/maintenance     # Get maintenance tasks
POST   /api/maintenance     # Create maintenance task
PATCH  /api/maintenance/:id # Update task
DELETE /api/maintenance/:id # Delete task
```

#### Projects
```
GET    /api/projects        # Get all projects
POST   /api/projects        # Create project
PATCH  /api/projects/:id    # Update project
DELETE /api/projects/:id    # Delete project
```

## Setup and Installation

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- MongoDB (local or Atlas)

### Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Backend Setup
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file with:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/inventrackdb
# JWT_SECRET=your_secret_key
# NODE_ENV=development

# Start server
npm run dev
```

### Environment Variables
```env
# Backend (.env in server directory)
PORT=5000
MONGODB_URI=mongodb://localhost:27017/inventrackdb
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
NODE_ENV=development
```

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow React functional component patterns
- Use Tailwind CSS for styling
- Implement proper error handling
- Write descriptive commit messages

### Component Guidelines
- Keep components small and focused
- Use proper TypeScript interfaces
- Implement loading and error states
- Follow the established folder structure
- Use custom hooks for complex logic

### API Guidelines
- Use TanStack Query for data fetching
- Implement proper error handling
- Use consistent endpoint naming
- Include proper TypeScript types
- Handle loading states gracefully

### State Management
- Use React's built-in state management
- TanStack Query for server state
- Local state for UI interactions
- Context for global application state

## Testing

### Testing Strategy
- Unit tests for utility functions
- Component testing with React Testing Library
- Integration tests for API services
- E2E tests for critical user flows

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Deployment

### Production Build
```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

### Deployment Options
- **Lovable Platform**: Click "Publish" button
- **Vercel**: Connect GitHub repository
- **Netlify**: Deploy from Git
- **Custom Server**: Upload build files to web server

### Environment Configuration
- Update API endpoints for production
- Configure proper CORS settings
- Set up environment variables
- Configure database connections

## Security Considerations

### Authentication
- JWT-based authentication
- Secure token storage
- Role-based access control
- Session management

### Data Protection
- Input validation and sanitization
- XSS protection
- CSRF protection
- Secure API endpoints

### Best Practices
- Regular dependency updates
- Security audit tools
- Error logging and monitoring
- Backup strategies

## Performance Optimization

### Frontend Optimization
- Code splitting with React.lazy
- Image optimization
- Bundle size monitoring
- Caching strategies

### Backend Optimization
- Database indexing
- Query optimization
- Caching layers
- Rate limiting

## Troubleshooting

### Common Issues
- **Build Errors**: Check TypeScript types and imports
- **API Errors**: Verify backend server is running
- **Database Issues**: Ensure MongoDB connection
- **Authentication**: Check JWT configuration

### Development Tips
- Use browser dev tools for debugging
- Check console logs for errors
- Verify API responses in Network tab
- Use React Developer Tools extension

## Contributing

### Getting Started
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests for new functionality
5. Submit a pull request

### Code Review Process
- All changes require review
- Automated tests must pass
- Follow coding standards
- Update documentation as needed

## License

Copyright © 2023-2025 InvenTrack Systems. All rights reserved.

## Support

For questions and support:
- Check the documentation
- Review existing issues
- Contact the development team
- Join the community discussions


# API Documentation

## Overview
This document describes the REST API endpoints for the InvenTrack inventory management system. The API follows RESTful conventions and uses JSON for data exchange.

## Base Configuration

### Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

### Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

### Content Type
All requests and responses use JSON:
```
Content-Type: application/json
```

### Response Format
All API responses follow this structure:
```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "error": null
}
```

## Authentication Endpoints

### POST /users/login
Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user123",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "ADMIN",
      "department": "IT",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
}
```

**Error Responses:**
- `400` - Invalid credentials
- `401` - Authentication failed
- `500` - Server error

### POST /users/logout
Logout the current user (optional endpoint for token invalidation).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "User logged out successfully"
}
```

## Asset Endpoints

### GET /assets
Retrieve all assets with optional filtering.

**Query Parameters:**
- `category` (string, optional) - Filter by asset category
- `status` (string, optional) - Filter by asset status
- `project` (string, optional) - Filter by project ID
- `location` (string, optional) - Filter by location
- `page` (number, optional) - Page number for pagination
- `limit` (number, optional) - Number of items per page

**Example Request:**
```
GET /api/assets?category=Servers&status=operational&page=1&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "asset123",
      "name": "Dell PowerEdge R740",
      "category": "Servers",
      "status": "operational",
      "location": "Data Center Rack A1",
      "purchaseDate": "2023-01-15",
      "lastUpdate": "2024-01-15",
      "assignedTo": "IT Department",
      "project": "project456",
      "resources": {
        "cpu": 16,
        "ram": 64,
        "disk": 2048
      },
      "specs": {
        "cpu_model": "Intel Xeon Silver 4214",
        "cpu_cores": 16,
        "ram_total": "64GB",
        "ram_type": "DDR4",
        "disk_total": "2TB",
        "disk_type": "SSD"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### GET /assets/:id
Retrieve a specific asset by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "asset123",
    "name": "Dell PowerEdge R740",
    // ... full asset object
  }
}
```

**Error Responses:**
- `404` - Asset not found
- `403` - Access denied

### POST /assets
Create a new asset.

**Request Body:**
```json
{
  "name": "New Server",
  "category": "Servers",
  "status": "operational",
  "location": "Data Center",
  "purchaseDate": "2024-01-01",
  "assignedTo": "IT Team",
  "project": "project123",
  "resources": {
    "cpu": 8,
    "ram": 32,
    "disk": 1024
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "asset789",
    "name": "New Server",
    // ... complete asset object with generated fields
  },
  "message": "Asset created successfully"
}
```

**Error Responses:**
- `400` - Invalid input data
- `401` - Unauthorized
- `403` - Insufficient permissions

### PATCH /assets/:id
Update an existing asset.

**Request Body (partial update):**
```json
{
  "status": "maintenance",
  "location": "Maintenance Room",
  "resources": {
    "cpu": 16,
    "ram": 64
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "asset123",
    // ... updated asset object
  },
  "message": "Asset updated successfully"
}
```

### DELETE /assets/:id
Delete an asset.

**Response:**
```json
{
  "success": true,
  "message": "Asset deleted successfully"
}
```

**Error Responses:**
- `404` - Asset not found
- `403` - Cannot delete (asset in use)

### GET /assets/category/:category
Get assets by category.

**Example:**
```
GET /api/assets/category/Servers
```

### GET /assets/status/:status
Get assets by status.

**Example:**
```
GET /api/assets/status/operational
```

### GET /assets/project/:projectId
Get assets assigned to a specific project.

**Example:**
```
GET /api/assets/project/project123
```

### GET /assets/:id/resources
Get resource usage data for a specific server asset.

**Response:**
```json
{
  "success": true,
  "data": {
    "assetId": "asset123",
    "metrics": {
      "cpu": 45,
      "ram": 60,
      "disk": 75,
      "network": 25,
      "connections": 120,
      "uptime": "15 days, 8 hours"
    },
    "history": [
      {
        "timestamp": "2024-01-15T10:00:00Z",
        "cpu": 42,
        "ram": 58,
        "disk": 74
      }
    ]
  }
}
```

## User Endpoints

### GET /users
Get all users (admin only).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "user123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "ADMIN",
      "department": "IT",
      "createdAt": "2023-01-01T00:00:00Z",
      "lastLogin": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### GET /users/:id
Get a specific user by ID.

### POST /users
Create a new user (admin only).

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "securePassword123",
  "role": "TECHNICIAN",
  "department": "Maintenance"
}
```

### PATCH /users/:id
Update user information.

### DELETE /users/:id
Delete a user (admin only).

## Maintenance Endpoints

### GET /maintenance
Get all maintenance tasks.

**Query Parameters:**
- `status` (string) - Filter by task status
- `priority` (string) - Filter by priority
- `assignedTo` (string) - Filter by assigned technician
- `asset` (string) - Filter by asset ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "task123",
      "asset": {
        "_id": "asset123",
        "name": "Dell Server R740"
      },
      "description": "Routine maintenance check",
      "type": "preventive",
      "status": "scheduled",
      "priority": "medium",
      "assignedTo": {
        "_id": "user123",
        "name": "John Technician"
      },
      "scheduledDate": "2024-02-01T09:00:00Z",
      "estimatedHours": 2,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ]
}
```

### GET /maintenance/:id
Get a specific maintenance task.

### POST /maintenance
Create a new maintenance task.

**Request Body:**
```json
{
  "asset": "asset123",
  "description": "Replace cooling fan",
  "type": "corrective",
  "priority": "high",
  "assignedTo": "user123",
  "scheduledDate": "2024-01-20T14:00:00Z",
  "estimatedHours": 1
}
```

### PATCH /maintenance/:id
Update a maintenance task.

### DELETE /maintenance/:id
Delete a maintenance task.

## Project Endpoints

### GET /projects
Get all projects.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "project123",
      "name": "ERP Implementation",
      "description": "Enterprise Resource Planning system",
      "status": "active",
      "startDate": "2023-06-01",
      "endDate": "2024-06-01",
      "manager": "Project Manager",
      "department": "IT",
      "resourceQuotas": {
        "cpu": 32,
        "ram": 128,
        "disk": 2048
      },
      "priority": "high",
      "tags": ["erp", "enterprise"]
    }
  ]
}
```

### GET /projects/:id
Get a specific project.

### POST /projects
Create a new project.

### PATCH /projects/:id
Update a project.

### DELETE /projects/:id
Delete a project.

### GET /projects/resources/usage
Get resource usage across all projects.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "projectId": "project123",
      "name": "ERP Implementation",
      "quotas": {
        "cpu": 32,
        "ram": 128,
        "disk": 2048
      },
      "used": {
        "cpu": 24,
        "ram": 96,
        "disk": 1536
      },
      "utilization": {
        "cpu": 75,
        "ram": 75,
        "disk": 75
      }
    }
  ]
}
```

## Settings Endpoints

### GET /settings
Get user settings.

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": {
      "email": true,
      "inApp": true,
      "maintenance": true,
      "resourceAlerts": true
    },
    "theme": "system",
    "language": "en",
    "dashboardLayout": "default",
    "pageSize": 10
  }
}
```

### PATCH /settings
Update user settings.

### GET /settings/system
Get system settings (admin only).

### PATCH /settings/system
Update system settings (admin only).

## Email Endpoints

### POST /email/send
Send an email.

**Request Body:**
```json
{
  "to": "recipient@example.com",
  "subject": "Maintenance Notification",
  "message": "Your server is scheduled for maintenance...",
  "template": "maintenance_notification",
  "attachments": []
}
```

### GET /email/templates
Get available email templates.

### GET /email/inbox
Get received emails (user-specific).

### POST /email/read/:emailId
Mark an email as read.

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  }
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `500` - Internal Server Error

### Error Codes
- `VALIDATION_ERROR` - Input validation failed
- `AUTHENTICATION_ERROR` - Invalid credentials
- `AUTHORIZATION_ERROR` - Insufficient permissions
- `RESOURCE_NOT_FOUND` - Requested resource doesn't exist
- `RESOURCE_CONFLICT` - Resource already exists or in use
- `SERVER_ERROR` - Internal server error

## Rate Limiting

### Limits
- General API: 1000 requests per hour per user
- Authentication: 5 failed attempts per 15 minutes
- Export operations: 10 requests per hour per user

### Headers
Rate limit information is included in response headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642694400
```

## Pagination

### Request Parameters
```
GET /api/assets?page=2&limit=25
```

### Response Format
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 25,
    "total": 150,
    "pages": 6,
    "hasNext": true,
    "hasPrev": true
  }
}
```

## Filtering and Sorting

### Query Parameters
```
GET /api/assets?category=Servers&status=operational&sort=name&order=asc
```

### Supported Operations
- `eq` - Equal
- `ne` - Not equal
- `gt` - Greater than
- `gte` - Greater than or equal
- `lt` - Less than
- `lte` - Less than or equal
- `in` - In array
- `contains` - String contains

### Example
```
GET /api/assets?purchaseDate[gte]=2023-01-01&category[in]=Servers,Networking
```

## API Versioning

### Version Header
```
API-Version: v1
```

### URL Versioning (future)
```
https://api.inventrack.com/v2/assets
```

## Development and Testing

### Mock Data
In development mode, the API provides mock data when the backend is unavailable:

```javascript
// Development fallback example
if (process.env.NODE_ENV === 'development') {
  return mockAssets();
}
```

### Testing Endpoints
Use the following test endpoints for development:

```
GET /api/health - Health check
GET /api/version - API version info
POST /api/test/reset - Reset test data (development only)
```

### API Documentation
- Interactive API docs: `http://localhost:5000/api-docs`
- OpenAPI spec: `http://localhost:5000/api/spec`

This API documentation should be kept up-to-date with any changes to the backend endpoints and data structures.


# InvenTrack Backend API

This is the backend API for the InvenTrack Inventory Management System.

## Setup Instructions

1. Clone the repository
2. Navigate to the server directory
3. Install dependencies with `npm install`
4. Create a `.env` file based on `.env.example`
5. Start the development server with `npm run dev`

## API Endpoints

### Assets
- `GET /api/assets` - Get all assets
- `GET /api/assets/:id` - Get a specific asset
- `POST /api/assets` - Create a new asset
- `PATCH /api/assets/:id` - Update an asset
- `DELETE /api/assets/:id` - Delete an asset
- `GET /api/assets/category/:category` - Get assets by category
- `GET /api/assets/status/:status` - Get assets by status

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a specific user
- `POST /api/users` - Create a new user
- `PATCH /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user
- `POST /api/users/login` - User login

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `NODE_ENV` - Environment (development/production)

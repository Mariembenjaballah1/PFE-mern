
# Getting Started with InvenTrack

This guide will help you set up and run InvenTrack locally for development and testing.

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MongoDB installed locally or MongoDB Atlas account

## Step 1: Clone the Repository

If you haven't already cloned the repository:

```bash
git clone <your-repository-url>
cd inventrack
```

## Step 2: Frontend Setup

1. Install frontend dependencies:

```bash
npm install
```

2. Start the frontend development server:

```bash
npm run dev
```

The frontend will be available at http://localhost:8080

## Step 3: Backend Setup

1. Navigate to the server directory:

```bash
cd server
```

2. Install backend dependencies:

```bash
npm install
```

3. Set up environment variables:
   - Check that the `.env` file exists in the server directory 
   - Ensure it has the following configuration:
   
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/inventrackdb
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=30d
   ```

4. Start the backend server:

```bash
npm run dev
```

The backend will be available at http://localhost:5000

## Step 4: MongoDB Setup

Make sure MongoDB is running locally:

- **For Linux/macOS**:
  ```bash
  mongod --dbpath /path/to/data/directory
  ```

- **For Windows**:
  Run MongoDB Compass or ensure the MongoDB service is running.

- **Alternative**: Use MongoDB Atlas and update the MONGODB_URI in your .env file.

## Step 5: Testing the Application

1. Open your browser and navigate to http://localhost:8080
2. You should be redirected to the login page
3. You can use the mock login functionality during development:
   - Email: any email format (e.g., test@example.com)
   - Password: any password

## Troubleshooting

### Backend Connection Issues

If you see API errors in the console:
- Make sure the backend server is running on port 5000
- Check that CORS is properly configured in the backend
- Verify MongoDB is running and accessible

### Frontend Build Issues

If you encounter build errors:
- Clear the node_modules folder and package-lock.json and reinstall dependencies
- Make sure you're using a compatible Node.js version

### Mock Data

During development, if the backend is not fully set up:
- The application includes mock data for assets, maintenance tasks, and users
- This allows frontend testing without a working backend

## Next Steps

Once your local environment is running:
1. Set up a real user account
2. Create test assets
3. Schedule maintenance tasks
4. Explore the AI insights functionality

For more detailed documentation, see the [LOCAL_SETUP.md](./LOCAL_SETUP.md) and [Project Documentation](./src/docs/ProjectDocumentation.md).


# InvenTrack - Local Development Setup

This guide will help you set up and run InvenTrack on your local machine.

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- MongoDB installed locally or a MongoDB Atlas account

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd inventrack
```

### 2. Setup Backend

```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create .env file (or edit the existing one)
# Make sure it has the following configuration:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/inventrackdb
# NODE_ENV=development
# JWT_SECRET=your_jwt_secret_key_here
# JWT_EXPIRE=30d

# Start the backend server
npm run dev
```

The backend will be available at http://localhost:5000

### 3. Setup Frontend

```bash
# Navigate back to the project root
cd ..

# Install dependencies
npm install

# Start the frontend development server
npm run dev
```

The frontend will be available at http://localhost:8080 (or another port if 8080 is in use)

### 4. MongoDB Setup

Make sure MongoDB is running locally:

- **For Linux/macOS**:
  ```bash
  mongod --dbpath /path/to/data/directory
  ```

- **For Windows**:
  Run MongoDB Compass or ensure the MongoDB service is running.

- **Alternative**: Use MongoDB Atlas and update the MONGODB_URI in your .env file.

### 5. Initial Setup

1. Start both backend and frontend servers
2. Register an admin user through the signup page
3. Use the admin account to add assets, users and maintenance tasks

## Development

- Frontend code is in the `src` directory
- Backend code is in the `server` directory
- MongoDB models are in `server/models`
- API routes are in `server/routes`

## Troubleshooting

- If you encounter connection issues with MongoDB, ensure the MongoDB service is running
- Check that the ports 5000 (backend) and 8080 (frontend) are not being used by other services
- Verify that .env file contains the correct configuration

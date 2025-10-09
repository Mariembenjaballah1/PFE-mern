
# Setup and Installation Guide

## Overview
This guide provides step-by-step instructions for setting up the InvenTrack inventory management system in various environments.

## System Requirements

### Minimum Requirements
- **Node.js**: v16.0 or later
- **npm**: v8.0 or later (or yarn v1.22+)
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 1GB available space
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

### Recommended Development Environment
- **Node.js**: v18.x LTS
- **npm**: v9.x or yarn v3.x
- **RAM**: 16GB
- **Storage**: 5GB available space
- **OS**: Windows 10+, macOS 10.15+, Ubuntu 20.04+

## Quick Start

### 1. Clone the Repository
```bash
# Clone the main repository
git clone https://github.com/your-org/inventrack.git
cd inventrack

# Or download as ZIP and extract
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Application will be available at http://localhost:8080
```

### 3. Backend Setup (Optional for Full Stack)
```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/inventrackdb
# JWT_SECRET=your_jwt_secret_key
# NODE_ENV=development

# Start backend server
npm run dev

# Backend will be available at http://localhost:5000
```

## Detailed Installation

### Prerequisites Installation

#### Node.js and npm
**Using Node Version Manager (Recommended):**
```bash
# Install nvm (Linux/macOS)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install and use Node.js LTS
nvm install --lts
nvm use --lts

# Verify installation
node --version
npm --version
```

**Direct Download:**
- Visit [nodejs.org](https://nodejs.org)
- Download LTS version
- Follow installer instructions

#### MongoDB (For Full Stack Setup)

**Using Docker (Recommended):**
```bash
# Pull and run MongoDB container
docker run -d \
  --name inventrack-mongo \
  -p 27017:27017 \
  -v inventrack-data:/data/db \
  mongo:latest
```

**Direct Installation:**
- **Windows**: Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
- **macOS**: `brew install mongodb-community`
- **Ubuntu**: Follow [MongoDB Ubuntu Installation Guide](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)

### Frontend Installation

#### 1. Install Dependencies
```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

#### 2. Environment Configuration
The frontend uses environment variables for configuration. Create a `.env.local` file:

```bash
# .env.local (optional for frontend-only setup)
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=InvenTrack
VITE_VERSION=1.0.0
```

#### 3. Development Server
```bash
# Start development server
npm run dev

# With specific port
npm run dev -- --port 3000

# With host binding (for network access)
npm run dev -- --host 0.0.0.0
```

#### 4. Build for Production
```bash
# Create production build
npm run build

# Preview production build
npm run preview

# Build with type checking
npm run build && npm run type-check
```

### Backend Installation

#### 1. Navigate to Server Directory
```bash
cd server
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Environment Configuration
Create and configure the environment file:

```bash
# Copy example environment file
cp .env.example .env

# Edit the .env file
nano .env
```

**Environment Variables:**
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/inventrackdb
MONGODB_URI_TEST=mongodb://localhost:27017/inventrackdb_test

# Authentication
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRE=30d

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# API Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

#### 4. Database Setup
```bash
# Start MongoDB (if not using Docker)
mongod --dbpath /path/to/data/directory

# Or start MongoDB service
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

#### 5. Start Backend Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start

# With specific environment
NODE_ENV=production npm start
```

## Database Setup

### MongoDB Configuration

#### 1. Create Database
```javascript
// Connect to MongoDB shell
mongosh

// Create database and collections
use inventrackdb

// Create collections with validation
db.createCollection("assets", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "category", "status"],
      properties: {
        name: { bsonType: "string" },
        category: { bsonType: "string" },
        status: { enum: ["operational", "maintenance", "repair", "retired"] }
      }
    }
  }
})
```

#### 2. Create Indexes
```javascript
// Create indexes for better performance
db.assets.createIndex({ "category": 1 })
db.assets.createIndex({ "status": 1 })
db.assets.createIndex({ "assignedTo": 1 })
db.assets.createIndex({ "project": 1 })
db.assets.createIndex({ "name": "text", "description": "text" })

db.users.createIndex({ "email": 1 }, { unique: true })
db.maintenance.createIndex({ "asset": 1 })
db.maintenance.createIndex({ "scheduledDate": 1 })
```

#### 3. Seed Data (Optional)
```bash
# Run seed script
npm run seed

# Or import sample data
mongoimport --db inventrackdb --collection assets --file ./data/sample-assets.json
```

## Development Setup

### IDE Configuration

#### Visual Studio Code (Recommended)
**Required Extensions:**
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json"
  ]
}
```

**Settings Configuration:**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

#### Git Configuration
```bash
# Configure Git hooks (optional)
npm install -g husky
npx husky install

# Configure commit message format
echo "npx commitlint --edit \$1" > .husky/commit-msg
chmod +x .husky/commit-msg
```

### Testing Setup

#### Install Testing Dependencies
```bash
# Frontend testing
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Backend testing
cd server
npm install --save-dev jest supertest mongodb-memory-server
```

#### Run Tests
```bash
# Frontend tests
npm run test

# Backend tests
cd server
npm run test

# Run all tests with coverage
npm run test:coverage
```

## Production Deployment

### Frontend Deployment

#### Build Optimization
```bash
# Build with optimizations
npm run build

# Analyze bundle size
npm run build:analyze

# Check build output
ls -la dist/
```

#### Deployment Options

**Lovable Platform (Recommended):**
1. Click "Publish" button in Lovable interface
2. Configure custom domain if needed
3. Environment variables are managed through Lovable

**Vercel:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Configure custom domain
vercel domains add yourdomain.com
```

**Netlify:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

**Traditional Web Server:**
```bash
# Build the application
npm run build

# Copy dist/ contents to web server
rsync -av dist/ user@server:/var/www/html/
```

### Backend Deployment

#### Production Environment
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inventrackdb
JWT_SECRET=your_production_jwt_secret
```

#### Process Management
```bash
# Using PM2
npm install -g pm2
pm2 start server.js --name "inventrack-api"
pm2 startup
pm2 save

# Using systemd (Linux)
sudo nano /etc/systemd/system/inventrack.service
sudo systemctl enable inventrack
sudo systemctl start inventrack
```

#### Reverse Proxy (Nginx)
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Docker Setup

### Frontend Dockerfile
```dockerfile
# Frontend Dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Backend Dockerfile
```dockerfile
# Backend Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
EXPOSE 5000

USER node
CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "8080:80"
    depends_on:
      - backend

  backend:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/inventrackdb
    depends_on:
      - mongo

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port
lsof -i :8080  # or :5000

# Kill process
kill -9 <PID>

# Use different port
npm run dev -- --port 3001
```

#### Node Version Issues
```bash
# Check Node version
node --version

# Switch to correct version
nvm use 18
```

#### Dependencies Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### MongoDB Connection Issues
```bash
# Check MongoDB status
systemctl status mongod

# Check connection
mongosh --eval "db.adminCommand('ping')"

# Restart MongoDB
sudo systemctl restart mongod
```

#### Build Errors
```bash
# Clear build cache
rm -rf dist/
rm -rf .vite/

# Rebuild
npm run build
```

### Performance Issues

#### Frontend Performance
```bash
# Analyze bundle size
npm run build:analyze

# Check for large dependencies
npx depcheck

# Optimize images
npm install --save-dev imagemin imagemin-webp
```

#### Backend Performance
```bash
# Monitor CPU and memory
top -p $(pgrep node)

# Check MongoDB performance
db.runCommand({ "currentOp": 1 })

# Analyze slow queries
db.setProfilingLevel(2)
```

### Getting Help

#### Log Files
```bash
# Frontend development logs
# Check browser console and network tab

# Backend logs
tail -f server/logs/app.log

# MongoDB logs
tail -f /var/log/mongodb/mongod.log

# System logs
journalctl -u inventrack -f
```

#### Debug Mode
```bash
# Frontend debug mode
DEBUG=true npm run dev

# Backend debug mode
DEBUG=* npm run dev

# Node.js debugging
node --inspect server.js
```

#### Support Resources
- **Documentation**: Check `/docs` directory
- **Issues**: GitHub issues tracker
- **Community**: Discord/Slack channels
- **Email**: support@inventrack.com

This setup guide should help you get InvenTrack running in any environment. Update the guide as new installation methods or requirements are added.

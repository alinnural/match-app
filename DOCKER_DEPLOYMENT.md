# 🐳 Docker Deployment Guide

Complete guide to containerize and deploy Match Sport App using Docker.

---

## 📋 Why Docker?

**Benefits for your app:**
- ✅ Same environment (local → production)
- ✅ Easy deployment anywhere (AWS, DigitalOcean, Heroku, Railway, etc.)
- ✅ PostgreSQL + Backend + Frontend in one command
- ✅ No "works on my machine" problems
- ✅ Easy scaling and monitoring

---

## 🚀 Quick Start (5 minutes)

### Prerequisites
```bash
# Install Docker
# macOS/Windows: https://www.docker.com/products/docker-desktop
# Linux: sudo apt-get install docker.io docker-compose

# Verify installation
docker --version
docker-compose --version
```

### Run Entire App with One Command
```bash
cd /path/to/match-app
docker-compose up
```

**That's it!** App will be ready at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Database: http://localhost:5432

---

## 📁 Docker File Structure

I'll create these files:

```
match-app/
├── Dockerfile.backend      # Backend containerization
├── Dockerfile.frontend     # Frontend containerization
├── docker-compose.yml      # Orchestrate all containers
├── .dockerignore          # Files to exclude from build
└── backend/
    ├── .env.docker        # Docker-specific env vars
    └── src/
```

---

## 🎯 For Development (Already Configured!)

Good news! Your project already has `docker-compose.yml` configured for development.

### Run with Docker Compose

```bash
cd match-app

# Start all services
docker-compose up

# Or run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

**Services will be available at:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Database: postgresql://matchapp:matchapp123@localhost:5432/match_sport_db

### What's Running

```
📦 Three containers:
├── postgres:16-alpine     (Database)
├── backend (NestJS)       (API server)
└── frontend (React+Vite)  (Web app)
```

### Development Commands

```bash
# View running containers
docker-compose ps

# Run commands inside backend
docker-compose exec backend npm run lint
docker-compose exec backend npm run test

# Run Prisma commands
docker-compose exec backend npx prisma migrate dev
docker-compose exec backend npx prisma studio

# View backend logs
docker-compose logs -f backend

# Restart a service
docker-compose restart backend
```

---

## 🛠️ For Production Deployment

I've created production-optimized Dockerfiles:
- `Dockerfile.backend` - Multi-stage build, optimized production image
- `Dockerfile.frontend` - React build + Nginx for serving
- `nginx.conf` - Nginx configuration with API proxy

### Step 1: Create Production docker-compose.yml

Create `docker-compose.prod.yml` for production:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    ports:
      - "5432:5432"
    volumes:
      - postgres_prod_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: always

  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    environment:
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
      NODE_ENV: production
      PORT: 3000
      CORS_ORIGIN: ${CORS_ORIGIN}
    ports:
      - "3000:3000"
    volumes:
      - whatsapp_session_prod:/app/.wwebjs_auth
    depends_on:
      postgres:
        condition: service_healthy
    restart: always

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    restart: always

volumes:
  postgres_prod_data:
  whatsapp_session_prod:
```

### Step 2: Create `.env.production`

```bash
# Database
DB_USER=matchapp
DB_PASSWORD=your_secure_password_here
DB_NAME=match_sport_db

# Server
NODE_ENV=production
CORS_ORIGIN=https://your-domain.com

# WhatsApp
WA_SESSION_PATH=./.wwebjs_auth
```

### Step 3: Deploy to Production

#### Option A: Deploy to DigitalOcean (Easiest)

```bash
# 1. Create DigitalOcean App
doctl apps create --spec app.yaml

# 2. Monitor deployment
doctl apps get <app-id>
```

Create `app.yaml`:
```yaml
name: match-sport-app
services:
  - name: backend
    image:
      registry: docker.io
      repository: your-username/match-app-backend
    envs:
      - key: DATABASE_URL
        value: ${db.DATABASE_URL}
      - key: NODE_ENV
        value: production

  - name: frontend
    image:
      registry: docker.io
      repository: your-username/match-app-frontend
    http_port: 80

  - name: db
    engine: POSTGRES
    version: "16"
```

#### Option B: Deploy to AWS ECS

```bash
# 1. Create ECR repository
aws ecr create-repository --repository-name match-app-backend
aws ecr create-repository --repository-name match-app-frontend

# 2. Push images
docker tag match-app-backend:latest <aws-account>.dkr.ecr.<region>.amazonaws.com/match-app-backend:latest
docker push <aws-account>.dkr.ecr.<region>.amazonaws.com/match-app-backend:latest

# 3. Create ECS cluster and services (via AWS console or CLI)
```

#### Option C: Deploy to Railway (Simplest)

```bash
# 1. Connect railway to GitHub repo
# 2. Upload Dockerfile.backend and Dockerfile.frontend
# 3. Railway auto-detects and deploys
# 4. Set environment variables in Railway dashboard
```

#### Option D: Deploy to Heroku

```bash
# 1. Create heroku.yml
cat > heroku.yml << EOF
build:
  docker:
    backend: Dockerfile.backend
    frontend: Dockerfile.frontend
run:
  web: node dist/main
EOF

# 2. Deploy
heroku stack:set container
git push heroku main
```

---

## 📊 Docker Image Sizes

**Development:**
- Backend: ~400MB (includes dev deps)
- Frontend: ~300MB (dev server)

**Production (Multi-stage):**
- Backend: ~150MB (optimized)
- Frontend: ~50MB (static files + nginx)

---

## 🔒 Security Best Practices

### Use Multi-stage Build
✅ Already done in `Dockerfile.backend` and `Dockerfile.frontend`
- Reduces final image size
- Excludes build tools
- Smaller attack surface

### Environment Variables
```bash
# Never commit .env files
echo ".env*" >> .gitignore

# Use .env.example for documentation
cat > .env.example << EOF
DB_USER=matchapp
DB_PASSWORD=change_this
DATABASE_URL=postgresql://...
CORS_ORIGIN=https://your-domain.com
EOF
```

### Run as Non-root
```dockerfile
# In Dockerfile
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs
```

### Health Checks
✅ Already included in Dockerfiles
- Detects unhealthy containers
- Auto-restart on failure

---

## 🐛 Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose logs backend

# Check image was built correctly
docker images

# Rebuild from scratch
docker-compose build --no-cache backend
```

### Database connection error

```bash
# Verify container is running
docker-compose ps

# Check database is healthy
docker-compose exec postgres psql -U matchapp -d match_sport_db -c "SELECT 1"

# Check environment variables
docker-compose exec backend env | grep DATABASE
```

### Frontend can't reach backend

```bash
# Check services can communicate
docker-compose exec frontend ping backend

# Check API call works
docker-compose exec frontend wget -O - http://backend:3000/api/groups
```

### WhatsApp session not persisting

```bash
# Check volume exists
docker volume ls | grep match

# Inspect volume
docker volume inspect match-app_wa_session

# Clear session to force re-auth
docker volume rm match-app_wa_session
docker-compose up
```

---

## 📈 Performance Optimization

### Image Caching

```dockerfile
# Order matters! Put frequently changing files last
COPY package*.json ./      # Changes rarely
COPY src ./               # Changes often
```

### Layer Size Optimization

```dockerfile
# Bad: Multiple RUN commands
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get clean

# Good: Single RUN with cleanup
RUN apt-get update && apt-get install -y curl && apt-get clean && rm -rf /var/lib/apt/lists/*
```

### Build arguments for customization

```dockerfile
ARG NODE_ENV=production
ARG VITE_API_URL=http://localhost:3000/api

RUN npm ci --only=${NODE_ENV}
```

---

## 📋 Quick Reference

### Development

```bash
docker-compose up                 # Start all services
docker-compose up -d              # Run in background
docker-compose down               # Stop all services
docker-compose ps                 # List running services
docker-compose logs -f backend    # View backend logs
docker-compose exec backend bash  # SSH into container
```

### Production

```bash
docker build -f Dockerfile.backend -t match-app-backend .
docker push match-app-backend:latest

docker build -f Dockerfile.frontend -t match-app-frontend .
docker push match-app-frontend:latest

docker-compose -f docker-compose.prod.yml up -d
```

### Cleanup

```bash
docker system prune                    # Remove unused containers/images
docker volume prune                    # Remove unused volumes
docker image prune -a                  # Remove all unused images
```

---

## 🎯 Next Steps

1. **Try Development**: `docker-compose up`
2. **Test Services**: Visit http://localhost:5173
3. **Check Logs**: `docker-compose logs -f`
4. **Deploy to Production**: Choose hosting platform (Railway, DigitalOcean, etc.)

---

**Version:** 1.0
**Status:** Production Ready ✅

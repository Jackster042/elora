# Elora E-Commerce Application - Deployment Guide

## Table of Contents
1. [Deployment Overview](#deployment-overview)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Deployment Options](#deployment-options)
4. [Option 1: Vercel (Frontend) + Render/Railway (Backend) - RECOMMENDED](#option-1-vercel-frontend--renderrailway-backend---recommended)
5. [Option 2: Vercel (Full-Stack with Serverless Functions)](#option-2-vercel-full-stack-with-serverless-functions)
6. [Option 3: Netlify + Render](#option-3-netlify--render)
7. [Option 4: Self-Hosted VPS](#option-4-self-hosted-vps)
8. [Environment Variables Setup](#environment-variables-setup)
9. [Post-Deployment Steps](#post-deployment-steps)
10. [Troubleshooting](#troubleshooting)

---

## Deployment Overview

Elora is a MERN stack application consisting of:
- **Frontend**: React + Vite + TypeScript
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas (cloud-hosted)
- **File Storage**: Cloudinary (cloud-hosted)
- **Payment**: PayPal (in demo mode for portfolio)

### Architecture Considerations
- **Frontend**: Static files that can be deployed to any CDN/hosting service
- **Backend**: Node.js API server that needs a persistent runtime environment
- **Database**: Already cloud-hosted on MongoDB Atlas
- **Demo Mode**: No real payment processing, safe for public deployment

---

## Pre-Deployment Checklist

### 1. Code Preparation
- [ ] All features tested locally
- [ ] Demo mode enabled (`PAYMENT_MODE=demo`)
- [ ] Environment variables documented
- [ ] Security measures implemented (rate limiting, validation)
- [ ] CORS configured for production domains
- [ ] API keys and secrets secured

### 2. Database Setup
- [ ] MongoDB Atlas cluster created
- [ ] Database user with appropriate permissions
- [ ] IP whitelist configured (0.0.0.0/0 for cloud deployments)
- [ ] Connection string ready

### 3. External Services
- [ ] Cloudinary account configured
- [ ] API keys obtained
- [ ] PayPal credentials (not needed in demo mode)

### 4. Build Testing
```bash
# Test frontend build
cd client
npm run build

# Test backend
cd ../server
npm start
```

---

## Deployment Options

### Comparison Table

| Option | Frontend | Backend | Cost | Difficulty | Best For |
|--------|----------|---------|------|------------|----------|
| **Option 1** | Vercel | Render/Railway | Free tier available | Easy | **Portfolio projects (RECOMMENDED)** |
| **Option 2** | Vercel | Vercel Serverless | Free tier | Medium | Small-scale apps |
| **Option 3** | Netlify | Render | Free tier available | Easy | Alternative to Vercel |
| **Option 4** | VPS | VPS | ~$5-10/month | Hard | Production apps with control |

---

## Option 1: Vercel (Frontend) + Render/Railway (Backend) - RECOMMENDED

**Best for**: Portfolio projects, separate frontend/backend deployment, scalability

### Why This Option?
- ✅ **Free tier available** for both services
- ✅ **Automatic deployments** from GitHub
- ✅ **SSL certificates** included
- ✅ **Easy to showcase** to employers
- ✅ **Separate scaling** for frontend and backend
- ✅ **Your existing workflow** (most projects on Vercel)

---

### Part A: Deploy Backend to Render

#### Step 1: Prepare Backend for Deployment

1. **Create `render.yaml` in project root** (optional, for infrastructure as code):
```yaml
services:
  - type: web
    name: elora-api
    env: node
    buildCommand: cd server && npm install
    startCommand: cd server && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PAYMENT_MODE
        value: demo
```

2. **Ensure `server/package.json` has start script**:
```json
{
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "engines": {
    "node": "18.x"
  }
}
```

3. **Update CORS in `server/index.js`** to allow your frontend domain:
```javascript
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:5173',
  'https://your-app.vercel.app',  // Add your Vercel URL
  'https://elora-frontend.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

#### Step 2: Deploy to Render

1. **Go to [Render.com](https://render.com/)** and sign up/login
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service**:
   - **Name**: `elora-api`
   - **Root Directory**: `server` (if structure allows) or leave empty
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main` or `master`
   - **Build Command**: `cd server && npm install` (if root) or `npm install`
   - **Start Command**: `cd server && npm start` (if root) or `npm start`
   - **Instance Type**: `Free` (for portfolio)

5. **Add Environment Variables** (see [Environment Variables Setup](#environment-variables-setup)):
   ```
   NODE_ENV=production
   PORT=3001
   MONGO_DB=your_mongo_connection_string
   MONGO_DB_NAME=elora
   JWT_SECRET_KEY=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   PAYMENT_MODE=demo
   ```

6. **Click "Create Web Service"**
7. **Wait for deployment** (first build takes 3-5 minutes)
8. **Note your backend URL**: `https://elora-api.onrender.com`

#### Step 3: Test Backend
```bash
curl https://elora-api.onrender.com/api/health
# Should return server status
```

---

### Part B: Deploy Frontend to Vercel

#### Step 1: Prepare Frontend for Deployment

1. **Update `client/.env.production`** (create if doesn't exist):
```env
VITE_API_URL=https://elora-api.onrender.com
```

2. **Create `vercel.json` in `client` directory**:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

3. **Update API configuration** in `client/src/api/config.ts` (if exists):
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
export default API_URL;
```

#### Step 2: Deploy to Vercel

**Method 1: Vercel CLI (Quick)**
```bash
cd client
npm install -g vercel
vercel login
vercel --prod
```

**Method 2: Vercel Dashboard (Recommended for continuous deployment)**

1. **Go to [Vercel.com](https://vercel.com/)** and login
2. **Click "Add New" → "Project"**
3. **Import your Git repository**
4. **Configure project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Add Environment Variable**:
   ```
   VITE_API_URL=https://elora-api.onrender.com
   ```

6. **Click "Deploy"**
7. **Wait for deployment** (1-2 minutes)
8. **Your app is live**: `https://elora.vercel.app`

#### Step 3: Update Backend CORS

Go back to Render and update the CORS origins with your Vercel URL:
```javascript
const allowedOrigins = [
  'https://elora.vercel.app',
  'https://elora-*.vercel.app'  // For preview deployments
];
```

Redeploy backend for changes to take effect.

---

### Alternative to Render: Railway

**Railway** is similar to Render with slightly better free tier limits.

#### Deploy to Railway

1. **Go to [Railway.app](https://railway.app/)** and sign up
2. **Click "New Project" → "Deploy from GitHub repo"**
3. **Select your repository**
4. **Configure service**:
   - Railway auto-detects Node.js
   - **Root Directory**: `server`
   - **Start Command**: `npm start`

5. **Add Environment Variables** (same as Render)
6. **Deploy**
7. **Get your URL**: `https://elora-api.up.railway.app`

**Railway Advantages**:
- Faster cold starts
- Better free tier ($5 credit/month)
- Simpler dashboard

---

## Option 2: Vercel (Full-Stack with Serverless Functions)

**Best for**: Smaller apps, unified deployment, Vercel-only workflow

### Overview
Deploy both frontend and backend API as Vercel serverless functions.

### Pros & Cons
✅ **Pros**:
- Single platform deployment
- Automatic scaling
- Fast global CDN
- Free tier generous

❌ **Cons**:
- 10-second serverless timeout (free tier)
- Cold starts for API
- More complex setup for Express apps
- Database connections can be tricky

### Implementation Steps

#### 1. Restructure Backend for Serverless

Create `api` folder in project root and convert routes to serverless functions:

**Structure**:
```
elora/
├── client/          # Vite app
├── server/          # Keep for reference
└── api/             # Serverless functions
    ├── auth/
    │   └── login.js
    ├── products/
    │   └── list.js
    └── _middleware.js
```

**Example serverless function** (`api/products/list.js`):
```javascript
import { connectDB } from '../utils/db';
import ProductModel from '../models/ProductModels';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();
    const products = await ProductModel.find({});
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

#### 2. Configure Vercel

**`vercel.json` in project root**:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/client/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

#### 3. Deploy
```bash
vercel --prod
```

**Note**: This approach requires significant refactoring. Only recommended if you want to learn serverless architecture.

---

## Option 3: Netlify + Render

**Best for**: Developers preferring Netlify's UI, similar to Option 1

### Deploy Backend to Render
Follow [Option 1 - Part A](#part-a-deploy-backend-to-render)

### Deploy Frontend to Netlify

1. **Create `client/netlify.toml`**:
```toml
[build]
  command = "npm run build"
  publish = "dist"
  
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  VITE_API_URL = "https://elora-api.onrender.com"
```

2. **Deploy**:
   - Go to [Netlify.com](https://www.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub repository
   - Configure:
     - **Base directory**: `client`
     - **Build command**: `npm run build`
     - **Publish directory**: `client/dist`
   - Add environment variable: `VITE_API_URL`
   - Deploy

---

## Option 4: Self-Hosted VPS

**Best for**: Production apps, full control, learning DevOps

### Providers
- DigitalOcean ($6/month)
- Linode ($5/month)
- AWS Lightsail ($5/month)
- Vultr ($6/month)

### Quick Setup (Ubuntu 22.04)

#### 1. Initial Server Setup
```bash
# SSH into server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PM2 (process manager)
npm install -g pm2

# Install Nginx (reverse proxy)
apt install -y nginx

# Install Certbot (SSL)
apt install -y certbot python3-certbot-nginx
```

#### 2. Deploy Application
```bash
# Clone repository
cd /var/www
git clone https://github.com/yourusername/elora.git
cd elora

# Setup backend
cd server
npm install
pm2 start index.js --name elora-api

# Setup frontend
cd ../client
npm install
npm run build

# Copy build to Nginx
cp -r dist/* /var/www/html/
```

#### 3. Configure Nginx
```bash
nano /etc/nginx/sites-available/elora
```

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/elora /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx

# Setup SSL
certbot --nginx -d yourdomain.com
```

#### 4. Setup Auto-restart
```bash
pm2 startup
pm2 save
```

---

## Environment Variables Setup

### Backend Environment Variables

**Required for all deployments**:

```env
# Server Configuration
NODE_ENV=production
PORT=3001

# Database
MONGO_DB=mongodb+srv://username:password@cluster.mongodb.net/
MONGO_DB_NAME=elora
MONGO_USER=your_username
MONGO_PASSWORD=your_password

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d
JWT_ALGORITHM=HS256

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Payment Configuration
PAYMENT_MODE=demo

# PayPal (NOT NEEDED in demo mode)
# PAY_PAL_MODE=sandbox
# PAY_PAL_CLIENT_ID=
# PAY_PAL_CLIENT_SECRET=
```

### Frontend Environment Variables

```env
VITE_API_URL=https://your-backend-url.com
```

### Generating Secure Keys

```bash
# JWT Secret (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Post-Deployment Steps

### 1. Verify Deployment

**Backend Health Check**:
```bash
curl https://your-backend-url.com/api/health
```

**Frontend**:
- Visit your frontend URL
- Check browser console for errors
- Test user registration/login
- Test adding products to cart
- Test demo payment flow

### 2. Configure Custom Domain (Optional)

**Vercel**:
1. Go to project settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

**Render**:
1. Go to service settings → Custom Domains
2. Add domain and configure DNS

### 3. Setup Monitoring

**Free Monitoring Tools**:
- **UptimeRobot**: Monitors if your site is online
- **LogRocket**: Frontend error tracking
- **Sentry**: Error monitoring for both frontend and backend

**Render Built-in**: Automatic health checks and logs

### 4. Enable Auto-Deploy

Both Vercel and Render support automatic deployments from GitHub:
- Push to `main` branch → Auto-deploy
- Preview deployments for PRs

---

## Troubleshooting

### Common Issues

#### 1. CORS Errors
**Symptom**: "CORS policy" error in browser console

**Solution**:
```javascript
// Backend: Update allowed origins
const allowedOrigins = [
  'https://your-frontend.vercel.app',
  'https://your-frontend-*.vercel.app' // For preview deployments
];
```

#### 2. Environment Variables Not Loading
**Solution**:
- Verify variables are set in hosting platform dashboard
- Redeploy after adding new variables
- Check variable names match exactly (case-sensitive)

#### 3. Build Failures on Vercel
**Solution**:
```bash
# Test build locally first
cd client
npm run build

# Check Vercel build logs for specific errors
```

#### 4. MongoDB Connection Timeout
**Solution**:
- Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for cloud hosting)
- Verify connection string is correct
- Check MongoDB Atlas cluster is running

#### 5. Cold Starts (Render Free Tier)
**Symptom**: First request takes 30+ seconds

**Solution**:
- Render free tier spins down after inactivity
- Consider upgrading to paid tier for production
- Use Railway instead (better free tier)
- Implement a "wake-up" ping service

#### 6. Demo Payment Not Working
**Solution**:
- Verify `PAYMENT_MODE=demo` in environment variables
- Check server logs for payment service initialization
- Ensure demo banner shows on frontend

---

## Cost Comparison

### Free Tier Limits

| Service | Frontend | Backend | Database |
|---------|----------|---------|----------|
| **Vercel** | 100GB bandwidth/month | Serverless only | N/A |
| **Render** | N/A | 750 hours/month | N/A |
| **Railway** | N/A | $5 credit/month | N/A |
| **MongoDB Atlas** | N/A | N/A | 512MB storage |
| **Cloudinary** | 25GB storage | 25GB bandwidth | N/A |

### Recommended for Portfolio
**Total Cost**: **$0/month**
- Frontend: Vercel (free)
- Backend: Render (free) or Railway ($0)
- Database: MongoDB Atlas (free tier)
- Storage: Cloudinary (free tier)

---

## Security Checklist for Production

- [ ] All secrets in environment variables (never in code)
- [ ] HTTPS enabled (automatic with Vercel/Render)
- [ ] CORS properly configured
- [ ] Rate limiting enabled (already implemented)
- [ ] Input validation active (already implemented)
- [ ] MongoDB IP whitelist configured
- [ ] JWT secret is strong (32+ characters)
- [ ] Demo mode enabled (`PAYMENT_MODE=demo`)
- [ ] No sensitive data in logs
- [ ] Error messages don't expose system details

---

## Recommended Deployment Flow

**For Portfolio/Demo (RECOMMENDED)**:
```
1. Deploy Backend to Render (Free)
2. Deploy Frontend to Vercel (Free)
3. Connect custom domain (optional)
4. Enable auto-deploy from GitHub
5. Add monitoring with UptimeRobot
```

**Time to Deploy**: ~30-45 minutes (first time)

---

## Next Steps After Deployment

1. **Add to Portfolio**:
   - Include live demo link
   - Add GitHub repository link
   - Document features and tech stack

2. **Share with Employers**:
   - Demo mode is perfect for showcasing
   - No risk of real payments
   - Full e-commerce functionality visible

3. **Monitor**:
   - Check Render/Vercel logs regularly
   - Monitor MongoDB Atlas usage
   - Watch for errors in production

4. **Iterate**:
   - Collect feedback
   - Fix bugs
   - Add new features
   - Keep updating

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [Railway Documentation](https://docs.railway.app/)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com/)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

---

## Support & Feedback

If you encounter issues during deployment:
1. Check the troubleshooting section above
2. Review hosting platform logs
3. Verify all environment variables
4. Test locally first to isolate issues
5. Check MongoDB Atlas and Cloudinary dashboards

---

**Ready to Deploy?** Follow Option 1 for the smoothest experience with Vercel + Render! 🚀

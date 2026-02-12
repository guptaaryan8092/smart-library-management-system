# Deployment Guide

This guide covers deploying the Smart Library Management System to production.

## Architecture Overview

- **Backend:** Render (Node.js hosting)
- **Frontend:** Vercel (React hosting)
- **Database:** MongoDB Atlas (Cloud database)

## Prerequisites

1. GitHub account (for code repository)
2. Render account (https://render.com)
3. Vercel account (https://vercel.com)
4. MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)

---

## Part 1: Database Setup (MongoDB Atlas)

### 1.1 Create MongoDB Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign in or create account
3. Create a new cluster (Free tier M0 is sufficient)
4. Choose a cloud provider and region
5. Wait for cluster to be created (~3-5 minutes)

### 1.2 Configure Database Access

1. Click "Database Access" in left sidebar
2. Add new database user:
   - Username: `libraryAdmin` (or your choice)
   - Password: Generate secure password
   - User Privileges: Read and write to any database
3. Save the credentials securely

### 1.3 Configure Network Access

1. Click "Network Access" in left sidebar
2. Add IP Address:
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
   - Confirm

### 1.4 Get Connection String

1. Click "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database password
6. Replace `<dbname>` with `libraryManagement`

Example:
```
mongodb+srv://libraryAdmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/libraryManagement?retryWrites=true&w=majority
```

### 1.5 Seed Production Database

1. Update your local `.env` with the Atlas connection string
2. Run the seed script:
```bash
cd server
npm run seed
```
3. Verify data was created in Atlas dashboard

---

## Part 2: Backend Deployment (Render)

### 2.1 Prepare Repository

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. Ensure `.gitignore` includes:
```
node_modules/
.env
*.log
```

### 2.2 Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:

**Settings:**
- **Name:** `library-backend` (or your choice)
- **Environment:** `Node`
- **Region:** Choose closest to your users
- **Branch:** `main`
- **Root Directory:** `server`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Plan:** Free

### 2.3 Add Environment Variables

In Render dashboard, add these environment variables:

```
NODE_ENV=production
PORT=5000
MONGO_URI=<your-mongodb-atlas-connection-string>
JWT_SECRET=<generate-random-64-char-string>
JWT_EXPIRE=24h
FRONTEND_URL=https://your-app.vercel.app
```

**To generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 2.4 Deploy

1. Click "Create Web Service"
2. Wait for deployment (~2-5 minutes)
3. Note your backend URL: `https://library-backend.onrender.com`

### 2.5 Test Backend

Visit: `https://your-backend-url.onrender.com/health`

Should return:
```json
{
  "success": true,
  "message": "Server is running",
  "environment": "production"
}
```

---

## Part 3: Frontend Deployment (Vercel)

### 3.1 Update Frontend Configuration

1. Update `client/.env.production`:
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

2. Commit changes:
```bash
git add client/.env.production
git commit -m "Add production API URL"
git push
```

### 3.2 Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure project:

**Settings:**
- **Framework Preset:** Vite
- **Root Directory:** `client`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### 3.3 Add Environment Variables

In Vercel project settings → Environment Variables:

```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

Make sure to select "Production" environment.

### 3.4 Deploy

1. Click "Deploy"
2. Wait for deployment (~1-2 minutes)
3. Note your frontend URL: `https://your-app.vercel.app`

### 3.5 Update Backend CORS

1. Go back to Render dashboard
2. Update `FRONTEND_URL` environment variable:
```
FRONTEND_URL=https://your-app.vercel.app
```
3. Trigger redeploy

---

## Part 4: Post-Deployment

### 4.1 Test the Application

1. Visit your Vercel URL
2. Login with seeded credentials:
   - Admin: `admin@library.com` / `admin123`
   - User: `user@library.com` / `user123`

### 4.2 Verify Features

- [ ] Login works
- [ ] Dashboard loads
- [ ] Can issue a book
- [ ] Can return a book
- [ ] Fine calculation works
- [ ] Reports load correctly
- [ ] Admin features work

### 4.3 Monitor Logs

**Render Logs:**
- Go to Render dashboard → Your service → Logs
- Monitor for errors

**Vercel Logs:**
- Go to Vercel dashboard → Your project → Deployments → Latest → View Function Logs

---

## Troubleshooting

### Backend Issues

**Problem:** "Application failed to respond"
- Check Render logs for errors
- Verify all environment variables are set
- Ensure MongoDB connection string is correct

**Problem:** CORS errors
- Verify `FRONTEND_URL` matches your Vercel URL exactly
- Check for trailing slashes

### Frontend Issues

**Problem:** "Network Error" or API calls fail
- Verify `VITE_API_URL` is correct
- Check if backend is running (visit /health endpoint)
- Check browser console for CORS errors

**Problem:** 404 on refresh
- Ensure `vercel.json` is in the client directory
- Redeploy if needed

### Database Issues

**Problem:** "MongoServerError: Authentication failed"
- Verify database username and password
- Check if user has correct permissions

**Problem:** "Connection timeout"
- Verify Network Access allows 0.0.0.0/0
- Check connection string format

---

## Maintenance

### Update Application

1. Make changes locally
2. Test thoroughly
3. Commit and push to GitHub
4. Render and Vercel will auto-deploy

### Monitor Usage

- **Render:** Free tier has 750 hours/month
- **Vercel:** Free tier has generous limits
- **MongoDB Atlas:** Free tier has 512MB storage

### Backup Database

1. Go to MongoDB Atlas dashboard
2. Click "..." on your cluster
3. Select "Export Data"
4. Choose format and download

---

## Security Checklist

- [ ] Strong JWT_SECRET (64+ characters)
- [ ] Unique database password
- [ ] CORS restricted to frontend URL only
- [ ] Environment variables not in code
- [ ] `.env` files in `.gitignore`
- [ ] Rate limiting enabled
- [ ] HTTPS enforced (automatic on Render/Vercel)

---

## Cost Estimate

All services offer free tiers sufficient for this application:

- **MongoDB Atlas:** Free (M0 cluster)
- **Render:** Free (with sleep after inactivity)
- **Vercel:** Free (hobby plan)

**Note:** Render free tier services sleep after 15 minutes of inactivity. First request after sleep takes ~30 seconds to wake up.

---

## Support

For issues:
1. Check logs in Render/Vercel dashboards
2. Verify environment variables
3. Test backend health endpoint
4. Check MongoDB Atlas connection

---

## Next Steps

After successful deployment:

1. Share the Vercel URL with users
2. Create additional admin accounts
3. Add real library data
4. Monitor application performance
5. Set up custom domain (optional)

Congratulations! Your application is now live! 🎉

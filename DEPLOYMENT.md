# 🚀 Deployment Guide

Panduan lengkap untuk deploy aplikasi Match Sport ke **Vercel (Frontend)** dan **Railway (Backend)**.

## 📋 Prerequisites

- GitHub account
- Vercel account (gratis): https://vercel.com
- Railway account (gratis): https://railway.app
- PostgreSQL database (Railway menyediakan gratis)

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Push Code ke GitHub

```bash
git add .
git commit -m "Setup deployment configuration"
git push origin main
```

### Step 2: Deploy di Vercel

1. **Login ke Vercel**: https://vercel.com/login
2. **Import Project**:
   - Klik "Add New..." → "Project"
   - Pilih repository GitHub Anda
   - Klik "Import"

3. **Configure Project**:
   - **Framework Preset**: Vite (auto-detect)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto)
   - **Output Directory**: `dist` (auto)
   - **Install Command**: `npm install` (auto)

4. **Environment Variables**:
   - Klik "Environment Variables"
   - Tambahkan:
     ```
     VITE_API_URL = https://your-backend.railway.app/api
     ```
     ⚠️ **Catatan**: Ganti `your-backend.railway.app` dengan URL Railway backend setelah deploy backend

5. **Deploy**:
   - Klik "Deploy"
   - Tunggu build selesai
   - Frontend akan live di: `https://your-app.vercel.app`

### Step 3: Update Environment Variable Setelah Backend Deploy

Setelah backend selesai deploy di Railway:
1. Buka Vercel Dashboard → Project → Settings → Environment Variables
2. Update `VITE_API_URL` dengan URL Railway backend yang sebenarnya
3. Redeploy (otomatis atau manual)

---

## ⚙️ Backend Deployment (Railway)

### Step 1: Setup Railway Project

1. **Login ke Railway**: https://railway.app/login
2. **New Project**:
   - Klik "New Project"
   - Pilih "Deploy from GitHub repo"
   - Pilih repository Anda

### Step 2: Setup PostgreSQL Database

1. **Add Database**:
   - Di Railway dashboard, klik "New" → "Database" → "Add PostgreSQL"
   - Railway akan otomatis create PostgreSQL instance
   - **Copy DATABASE_URL** (akan digunakan nanti)

### Step 3: Deploy Backend Service

1. **Add Service**:
   - Klik "New" → "GitHub Repo"
   - Pilih repository yang sama
   - Railway akan auto-detect Dockerfile

2. **Configure Service**:
   - **Root Directory**: `backend` (jika perlu)
   - **Dockerfile Path**: `backend/Dockerfile.production`
   - Railway akan otomatis detect `railway.json`

3. **Environment Variables**:
   Klik service → Variables tab, tambahkan:

   ```env
   # Database (dari PostgreSQL service)
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   
   # Server
   PORT=3000
   NODE_ENV=production
   
   # CORS (ganti dengan URL Vercel frontend)
   CORS_ORIGIN=https://your-app.vercel.app
   
   # WhatsApp Session
   WA_SESSION_PATH=./.wwebjs_auth
   
   # Optional: Chrome Path (jika perlu)
   # CHROME_PATH=/usr/bin/chromium-browser
   ```

4. **Generate Domain**:
   - Klik service → Settings → Generate Domain
   - Railway akan beri URL: `https://your-backend.railway.app`
   - **Copy URL ini** untuk update `VITE_API_URL` di Vercel

### Step 4: Run Prisma Migrations

Setelah service running, jalankan migration:

1. **Via Railway CLI** (Recommended):
   ```bash
   # Install Railway CLI
   npm i -g @railway/cli
   
   # Login
   railway login
   
   # Link project
   railway link
   
   # Run migration
   railway run npx prisma migrate deploy
   ```

2. **Via Railway Dashboard**:
   - Klik service → Deployments → Latest deployment
   - Klik "..." → "Open Shell"
   - Run: `npx prisma migrate deploy`

### Step 5: Verify Deployment

1. **Check Health**:
   ```bash
   curl https://your-backend.railway.app/api/groups
   ```

2. **Check Logs**:
   - Railway Dashboard → Service → Deployments → View Logs

---

## 🔄 Update Environment Variables

### Frontend (Vercel)

Setelah backend deploy, update `VITE_API_URL`:

1. Vercel Dashboard → Project → Settings → Environment Variables
2. Update: `VITE_API_URL = https://your-backend.railway.app/api`
3. Redeploy (Settings → Deployments → Redeploy)

### Backend (Railway)

Update `CORS_ORIGIN` dengan URL Vercel:

1. Railway Dashboard → Service → Variables
2. Update: `CORS_ORIGIN = https://your-app.vercel.app`
3. Service akan auto-redeploy

---

## 🧪 Testing Deployment

### Frontend Routes
- ✅ `https://your-app.vercel.app/` → Redirect ke `/whatsapp-login`
- ✅ `https://your-app.vercel.app/dashboard` → Load tanpa 404
- ✅ `https://your-app.vercel.app/matches` → Load tanpa 404
- ✅ `https://your-app.vercel.app/kas` → Load tanpa 404
- ✅ `https://your-app.vercel.app/members` → Load tanpa 404

### Backend API
- ✅ `https://your-backend.railway.app/api/groups` → Return data
- ✅ `https://your-backend.railway.app/api/whatsapp/status` → Return status
- ✅ `https://your-backend.railway.app/api/whatsapp/qr` → Return QR code

---

## 🐛 Troubleshooting

### Frontend: 404 Error di Routes

**Problem**: Direct navigation ke `/dashboard` return 404

**Solution**: 
- Pastikan `frontend/vercel.json` ada dan benar
- Check `rewrites` configuration
- Redeploy di Vercel

### Backend: Build Failed

**Problem**: Docker build error

**Solution**:
- Check `backend/Dockerfile.production` exists
- Verify `railway.json` configuration
- Check Railway logs untuk detail error

### Backend: Database Connection Error

**Problem**: `Can't reach database server`

**Solution**:
- Verify `DATABASE_URL` environment variable
- Check PostgreSQL service running di Railway
- Pastikan format: `postgresql://user:pass@host:port/db`

### Backend: WhatsApp Session Error

**Problem**: QR code tidak muncul atau session hilang

**Solution**:
- Check `WA_SESSION_PATH` environment variable
- Verify `.wwebjs_auth` directory exists
- Check Railway logs untuk WhatsApp client errors

### CORS Error

**Problem**: `Access to fetch blocked by CORS policy`

**Solution**:
- Verify `CORS_ORIGIN` di Railway match dengan URL Vercel
- Pastikan tidak ada trailing slash
- Check backend logs untuk CORS errors

---

## 📁 File Structure

```
match-app/
├── frontend/
│   ├── vercel.json          # Vercel configuration
│   └── ...
├── backend/
│   ├── Dockerfile.production # Production Dockerfile
│   ├── .dockerignore        # Docker ignore rules
│   └── ...
├── railway.json              # Railway configuration
└── DEPLOYMENT.md            # This file
```

---

## 🔐 Security Notes

1. **Environment Variables**: Jangan commit `.env` files
2. **Database URL**: Railway auto-generate, jangan hardcode
3. **CORS**: Hanya allow domain production
4. **WhatsApp Session**: Stored di Railway volume (persistent)

---

## 📊 Monitoring

### Vercel
- Dashboard → Analytics untuk traffic
- Logs untuk errors

### Railway
- Dashboard → Metrics untuk CPU/Memory
- Logs untuk application logs
- Deployments untuk deployment history

---

## 🎉 Success!

Setelah semua setup selesai:
- ✅ Frontend live di Vercel
- ✅ Backend live di Railway
- ✅ Database connected
- ✅ WhatsApp bot ready
- ✅ API accessible dari frontend

**Next Steps**:
1. Test semua features
2. Setup custom domain (optional)
3. Monitor logs dan metrics
4. Setup alerts (optional)

---

## 📞 Support

Jika ada masalah:
1. Check logs di Vercel/Railway dashboard
2. Verify environment variables
3. Check GitHub issues
4. Review documentation:
   - Vercel: https://vercel.com/docs
   - Railway: https://docs.railway.app


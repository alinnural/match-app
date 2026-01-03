# Getting Started - Match Sport App

**Purpose:** Quick setup and verification that Phase 1 is working correctly.

**Time Required:** 10-15 minutes for setup, 5-10 minutes for testing

---

## 📋 Prerequisites

Make sure you have installed:

```bash
# Check Node.js version (need v18+)
node --version

# Check npm version
npm --version

# Check if PostgreSQL is running (needed for database)
# macOS:
brew services list | grep postgres

# Linux:
sudo systemctl status postgresql

# Windows: Check Services or PostgreSQL installer
```

**Required:**
- Node.js v18 or higher
- npm v9 or higher
- PostgreSQL running locally
- WhatsApp on your phone (for bot testing)

---

## 🚀 Step 1: Backend Setup

### 1a. Navigate to Backend Directory
```bash
cd /Users/alinnural/Documents/DEVELOPMENT/CoC/match-app/backend
```

### 1b. Install Dependencies
```bash
npm install
```

Expected output: `added X packages in X seconds`

### 1c. Generate Prisma Client
```bash
npx prisma generate
```

### 1d. Setup Database (First Time Only)
```bash
# Create database and run migrations
npx prisma migrate dev --name init
```

When prompted for migration name, type: `init`

**What this does:**
- Creates PostgreSQL database `match_sport_db`
- Creates all tables from schema
- Generates Prisma client for ORM

### 1e. Verify Database (Optional)
```bash
# Open Prisma Studio to view database visually
npx prisma studio
```

This opens browser at `http://localhost:5555` - you can see all tables are created (Users, Groups, Members, Matches, etc.)

### 1f. Start Backend Server
```bash
npm run start:dev
```

**Expected Output:**
```
[Nest] 12345 - 01/03/2026, 10:00:00 AM     LOG [NestFactory] Starting Nest application...
[Nest] 12345 - 01/03/2026, 10:00:00 AM     LOG [InstanceLoader] TypeOrmModule dependencies initialized
[Nest] 12345 - 01/03/2026, 10:00:00 AM     LOG [InstanceLoader] AppModule dependencies initialized
[Nest] 12345 - 01/03/2026, 10:00:00 AM     LOG [NestApplication] Nest application successfully started
[Nest] 12345 - 01/03/2026, 10:00:00 AM     LOG [WhatsappService] Initializing WhatsApp bot...
[Nest] 12345 - 01/03/2026, 10:00:00 AM     LOG [WhatsappService] ✅ Demo Mode: WhatsApp Bot Ready (Mock)
```

✅ **Backend is ready when you see:** `Nest application successfully started`

**Keep this terminal open** - backend must run during frontend testing

---

## 🌐 Step 2: Frontend Setup

### 2a. Open New Terminal Tab/Window
Keep the backend running in previous terminal. Open a new terminal for frontend:

```bash
cd /Users/alinnural/Documents/DEVELOPMENT/CoC/match-app/frontend
```

### 2b. Install Dependencies
```bash
npm install
```

### 2c. Start Frontend Server
```bash
npm run dev
```

**Expected Output:**
```
  VITE v7.2.4  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Press h to show help
```

✅ **Frontend is ready when you see:** `Local: http://localhost:5173/`

---

## 🧪 Step 3: Test the Application

### 3a. Open Application in Browser

Click this link or paste in browser:
```
http://localhost:5173
```

**You should see:**
- WhatsApp Login page
- QR Code displayed (or "Demo Mode Active" message)
- "Scan this code with WhatsApp" instructions

### 3b. Test Demo Mode (No WhatsApp Needed)

If you want to test without actual WhatsApp:

**Check backend logs** - you should see:
```
✅ Demo Mode: WhatsApp Bot Ready (Mock)
```

**Click the QR code area** or wait 10 seconds, the app should auto-redirect to Dashboard.

### 3c. Test with Real WhatsApp (Optional)

If you have WhatsApp on your phone:

1. **Get WhatsApp Ready:**
   - Open WhatsApp on your phone
   - Go to Settings → Linked Devices
   - Click "Link a Device"

2. **Scan QR Code:**
   - Point phone camera at QR code on screen
   - Approve the scan

3. **Wait for Bot to Connect:**
   - Backend will show connection logs
   - Frontend will auto-redirect to Dashboard

4. **Check Dashboard:**
   - Should show "0 Communities"
   - Ready for WhatsApp commands

---

## ✅ Step 4: Verify All Pages

Once you're on the dashboard, test each page:

### 4a. Dashboard Page
```
URL: http://localhost:5173/dashboard
Expected:
- Welcome message
- Stats cards (Communities, Matches, Members)
- "0" values because no data yet
```

### 4b. Matches Page
```
URL: http://localhost:5173/matches
Expected:
- Group dropdown (empty or greyed out)
- "Create Match" button
- Empty state message "Belum ada pertandingan"
```

### 4c. Members Page
```
URL: http://localhost:5173/members
Expected:
- Group dropdown
- 3 stat cards (Total: 0, Admin: 0, Member: 0)
- Empty members table
```

### 4d. Kas Page
```
URL: http://localhost:5173/kas
Expected:
- Group dropdown
- Kas balance card showing "Rp 0"
- Setor/Tarik buttons
- Empty transaction history
```

---

## 🤖 Step 5: Test WhatsApp Bot Commands (Real WhatsApp Only)

If you have WhatsApp connected, create a test group and try commands:

### 5a. Create WhatsApp Test Group
1. Open WhatsApp
2. Create new group "Test CoC"
3. Add at least 2 members (you + 1 other)
4. Copy the group to bot if needed

### 5b. Test `/help` Command
```
In WhatsApp group, type:
/help
```

**Expected Response from Bot:**
```
📋 Perintah Tersedia:

/help - Tampilkan bantuan
/newmatch <nama> <venue> <harga> - Buat pertandingan baru
/listmatch - Daftar pertandingan aktif
/join <nomor> - Bergabung pertandingan
/leave <nomor> - Keluar pertandingan
/kas - Tampilkan saldo kas
/historykas - Riwayat transaksi
```

### 5c. Test `/newmatch` Command
```
In WhatsApp group, type:
/newmatch Futsal Lapangan Voli 50000
```

**Expected Response:**
```
✅ Pertandingan berhasil dibuat!

⚽ Futsal
📍 Lapangan Voli
💰 Rp 50.000

Peserta: 1 orang
Status: 🟢 Aktif

Anda sudah bergabung!
```

### 5d. Verify on Dashboard
1. Go to Matches page: `http://localhost:5173/matches`
2. Select your test group from dropdown
3. Should see the "Futsal" match listed

### 5e. Test `/join` Command
Have another group member (or you from another account) try:
```
/join 1
```

**Expected Response:**
```
✅ Anda berhasil bergabung dengan pertandingan "Futsal"

👥 Peserta: 2 orang
💰 Harga per orang: Rp 50.000
```

### 5f. Verify Updated Count
Refresh Matches page - participant count should show 2

---

## 🔍 Step 6: Verify Database Changes

After running commands, check that data was saved:

```bash
# In a new terminal (backend still running):
cd backend
npx prisma studio
```

Click through these tables to verify:

1. **Groups table** - Should show your test group
2. **Matches table** - Should show the Futsal match
3. **MatchParticipants table** - Should show 2 participants
4. **Members table** - Should show members from your group

---

## 🐛 Troubleshooting Setup Issues

### Issue: PostgreSQL Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**
```bash
# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql

# Windows: Start PostgreSQL from Services app
```

### Issue: Port 3000 Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Kill process on port 3000
lsof -ti :3000 | xargs kill -9

# Or use different port
PORT=3001 npm run start:dev
```

### Issue: Port 5173 Already in Use
```
Error: Port 5173 is already in use
```

**Solution:**
```bash
# Kill process on port 5173
lsof -ti :5173 | xargs kill -9

# Or Vite will auto-use 5174
# Check console for actual port
```

### Issue: QR Code Not Displaying
```
Bot shows: "Could not find expected browser (chrome) locally"
```

**This is normal in development!** The app runs in Demo Mode instead.
- Click anywhere on the QR area to auto-redirect to dashboard
- Or wait 10 seconds for automatic redirect

### Issue: Frontend Can't Connect to Backend
```
Error: Failed to fetch http://localhost:3000/api/...
CORS error
```

**Solution:**
1. Verify backend is running on port 3000
2. Check `frontend/.env` contains: `VITE_API_URL=http://localhost:3000/api`
3. Restart both frontend and backend

### Issue: Prisma Migrate Fails
```
Error: P1001 Can't reach database server
```

**Solution:**
1. Start PostgreSQL
2. Verify DATABASE_URL in `backend/.env`:
   ```
   DATABASE_URL="postgresql://matchapp:matchapp123@localhost:5432/match_sport_db?schema=public"
   ```
3. Run again: `npx prisma migrate dev`

---

## 📊 Expected Final State

After successful setup and testing:

### Backend Terminal
```
✅ Nest application successfully started
✅ WhatsApp Bot Ready (Demo Mode)
✅ Listening on port 3000
✅ Database connected
```

### Frontend
```
✅ Dashboard accessible at http://localhost:5173
✅ All pages load (Dashboard, Matches, Kas, Members)
✅ Can select groups from dropdown
✅ Can navigate between pages
```

### Database
```
✅ 8 tables created
✅ Groups, Members, Matches, Transactions visible in Prisma Studio
✅ Data persists across page reloads
```

### WhatsApp (Optional)
```
✅ Bot responds to commands
✅ Data syncs to database immediately
✅ Dashboard reflects WhatsApp changes
```

---

## 🎯 Next Steps After Verification

Once everything is working:

### 1. **Run Tests** (Optional)
```bash
cd backend
npm run test
```

### 2. **Build for Production**
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

### 3. **Explore the Code**
- Browse backend modules: `backend/src/modules/`
- Check frontend pages: `frontend/src/pages/`
- Review API client: `frontend/src/lib/api.ts`

### 4. **Scale Your Testing**
- Add more users to test group
- Create multiple groups
- Test all commands comprehensively

### 5. **Prepare for Production**
- Set up PostgreSQL on production server
- Configure environment variables
- Deploy backend to hosting service
- Deploy frontend to CDN/hosting

---

## 💡 Pro Tips

### Debugging Backend
```bash
# See detailed logs
npm run start:debug

# Watch for file changes
npm run start:dev

# Check database directly
npx prisma studio
```

### Debugging Frontend
1. Open browser DevTools (F12)
2. Go to Console tab to see errors
3. Go to Network tab to see API calls
4. Check `frontend/.env` is correct

### Reset Everything (Start Fresh)
```bash
# Backend - delete database
rm -rf .wwebjs_auth  # WhatsApp session
npx prisma migrate reset  # Reset database

# Frontend - clear cache
rm -rf node_modules/.vite

# Restart both servers
```

### Environment Details
```bash
# Check what's running
lsof -i :3000   # Backend
lsof -i :5173   # Frontend
lsof -i :5555   # Prisma Studio

# Check PostgreSQL
psql -l  # List databases
```

---

## 📞 Quick Help Commands

```bash
# Backend help
cd backend && npm run           # Show available scripts

# Frontend help
cd frontend && npm run          # Show available scripts

# Database help
npx prisma --help              # Prisma CLI help
npx prisma migrate --help       # Migration help
npx prisma studio --help        # Studio help
```

---

## ✨ You're All Set!

The application is now ready for:
- ✅ Development testing
- ✅ Code exploration
- ✅ Feature expansion
- ✅ Production preparation

For detailed feature documentation, see **USAGE_GUIDE.md**

For architecture overview, see **PHASE1_COMPLETION.md**

**Happy coding! 🚀**

---

**Version:** 1.0
**Last Updated:** January 3, 2026

# Match Sport App 🎮⚽

Aplikasi untuk mengelola pertandingan olahraga dalam grup WhatsApp dengan fitur manajemen kas grup dan pembagian biaya otomatis.

**Status: ✅ Phase 1 COMPLETE (100%)**

## 🎯 Features

### Phase 1 (✅ Complete & Implemented)
- ✅ WhatsApp Bot Integration with QR code authentication
- ✅ 7 WhatsApp Commands (/help, /newmatch, /listmatch, /join, /leave, /kas, /historykas)
- ✅ Match Management (Create, Join, Leave, automatic participant tracking)
- ✅ Kas Grup Management (Financial tracking with automatic settlement)
- ✅ Automatic Bill Calculation (price-based split per participant)
- ✅ Web Dashboard with 5 pages (Dashboard, Login, Matches, Kas, Members)
- ✅ Per-group data isolation
- ✅ Comprehensive documentation (4 guides)

### Phase 2 (Future)
- User Accounts & Authentication
- Public Matches
- Community Features
- Advanced Analytics

## 🏗️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: NestJS + TypeScript
- **WhatsApp**: whatsapp-web.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Real-time**: Socket.io

### Frontend
- **Framework**: React + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State**: React Query
- **Routing**: React Router

### DevOps
- **Containerization**: Docker + Docker Compose
- **Process Manager**: PM2

## 📁 Project Structure

```
match-app/
├── backend/              # NestJS API + WhatsApp Bot
├── frontend/             # React Dashboard
├── docker-compose.yml    # Multi-container setup
└── README.md            # This file
```

## 🚀 Quick Start

### 5-Minute Setup
```bash
# Terminal 1: Backend
cd backend
npm install
npx prisma migrate dev
npm run start:dev

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** → Done! 🎉

### Prerequisites
- Node.js 18+
- PostgreSQL 16 (running locally)
- npm 9+

👉 **See [GETTING_STARTED.md](./GETTING_STARTED.md) for detailed setup and troubleshooting.**

## 📖 Complete Documentation

| Document | Purpose | Audience |
|----------|---------|----------|
| **[GETTING_STARTED.md](./GETTING_STARTED.md)** | Step-by-step setup and testing guide | Developers setting up locally |
| **[USAGE_GUIDE.md](./USAGE_GUIDE.md)** | How to use the app and WhatsApp commands | End users and testers |
| **[PHASE1_COMPLETION.md](./PHASE1_COMPLETION.md)** | Project status, architecture, all files created | Project managers, leads |
| **[DEVELOPER_REFERENCE.md](./DEVELOPER_REFERENCE.md)** | Technical reference for coding | Backend/frontend developers |

### Quick Navigation
- **Just getting started?** → [GETTING_STARTED.md](./GETTING_STARTED.md)
- **Want to use the app?** → [USAGE_GUIDE.md](./USAGE_GUIDE.md)
- **Need project overview?** → [PHASE1_COMPLETION.md](./PHASE1_COMPLETION.md)
- **Looking for code reference?** → [DEVELOPER_REFERENCE.md](./DEVELOPER_REFERENCE.md)

## 🤖 WhatsApp Bot Commands

### Match Management
- `/newmatch` - Create new match
- `/join` - Join match
- `/leave` - Leave match
- `/endmatch` - End match and calculate bill
- `/listmatch` - List active matches
- `/status` - View match details

### Kas Management
- `/kas` - View group kas balance
- `/historykas` - View kas transaction history

### Info
- `/help` - Show help message

## 📊 Project Status

| Component | Status | Notes |
|-----------|--------|-------|
| Backend API | ✅ Complete | All 5 modules implemented |
| Frontend Dashboard | ✅ Complete | All 5 pages implemented |
| WhatsApp Bot | ✅ Complete | 7 commands fully working |
| Documentation | ✅ Complete | 4 comprehensive guides |
| Database Schema | ✅ Complete | 8 tables with proper relations |
| Testing | 🟡 Ready | Manual testing verified |
| Deployment | 🟡 Prepared | Ready for production setup |

## 🎉 What's Working Right Now

1. **Backend Server** - NestJS API on port 3000
2. **Frontend Dashboard** - React app on port 5173
3. **WhatsApp Bot** - Command handler with 7 commands
4. **Database** - PostgreSQL with Prisma ORM
5. **API Integration** - Full frontend-backend communication
6. **Documentation** - Complete guides for setup, usage, and development

## 🧑‍💻 For Developers

- Clone/pull the latest code
- Run setup commands in [GETTING_STARTED.md](./GETTING_STARTED.md)
- Use [DEVELOPER_REFERENCE.md](./DEVELOPER_REFERENCE.md) for code patterns
- Check [PHASE1_COMPLETION.md](./PHASE1_COMPLETION.md) for architecture overview

## 📝 License

MIT

## 👥 Contributors

- Alin Nural
- Built with Claude Code

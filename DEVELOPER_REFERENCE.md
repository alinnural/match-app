# Developer Reference - Match Sport App

**Purpose:** Quick lookup for developers working on the codebase.

**Audience:** Backend developers, frontend developers, DevOps engineers

---

## 📁 Project Structure

```
match-app/
├── backend/                    # NestJS Backend
│   ├── src/
│   │   ├── modules/           # Feature modules
│   │   │   ├── whatsapp/      # WhatsApp bot integration
│   │   │   ├── groups/        # Group management
│   │   │   ├── matches/       # Match management
│   │   │   ├── members/       # Member management
│   │   │   └── kas/           # Financial tracking
│   │   ├── config/            # Configuration files
│   │   ├── app.module.ts      # Root module
│   │   └── main.ts            # Application entry
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── migrations/        # Database migrations
│   ├── .env                   # Environment variables
│   └── package.json           # Dependencies
│
├── frontend/                  # React Frontend
│   ├── src/
│   │   ├── pages/            # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── WhatsAppLogin.tsx
│   │   │   ├── Matches.tsx
│   │   │   ├── Kas.tsx
│   │   │   └── Members.tsx
│   │   ├── components/       # Reusable components
│   │   │   ├── Sidebar.tsx
│   │   │   └── MainLayout.tsx
│   │   ├── lib/             # Utilities
│   │   │   └── api.ts       # API client
│   │   ├── App.tsx          # Router setup
│   │   └── main.tsx         # Entry point
│   ├── .env                 # Environment variables
│   └── package.json         # Dependencies
│
├── USAGE_GUIDE.md           # Complete usage documentation
├── PHASE1_COMPLETION.md     # Phase 1 completion status
├── GETTING_STARTED.md       # Setup and testing guide
└── DEVELOPER_REFERENCE.md   # This file
```

---

## 🔌 Module Architecture

### WhatsApp Module
**Path:** `backend/src/modules/whatsapp/`

**Responsibilities:**
- Bot initialization and authentication
- Message receiving and sending
- Command parsing and routing
- QR code generation

**Key Files:**
- `whatsapp.service.ts` - Core bot logic
- `command-handler.service.ts` - Command routing system
- `commands/base.command.ts` - Command base class
- `commands/*.command.ts` - Individual commands

**Key Methods:**
```typescript
// In whatsapp.service.ts
initialize()        // Start bot
sendMessage()       // Send WhatsApp message
handleMessage()     // Process incoming message

// In command-handler.service.ts
registerCommand()   // Register new command
handleMessage()     // Parse and execute command
```

### Groups Module
**Path:** `backend/src/modules/groups/`

**Responsibilities:**
- Group data management
- Group-member relationships
- Kas balance tracking per group
- Group statistics

**Key Methods:**
```typescript
// In groups.service.ts
createGroup()           // Create new group
getGroup()              // Get group details
getAllGroups()          // List all groups
getGroupByWhatsAppId()  // Get by WhatsApp ID
updateGroupKasBalance() // Update financial balance
```

### Matches Module
**Path:** `backend/src/modules/matches/`

**Responsibilities:**
- Match CRUD operations
- Participant management
- Match status tracking
- Match filtering by group

**Key Methods:**
```typescript
// In matches.service.ts
createMatch()          // Create new match
getMatchById()         // Get match details
getGroupMatches()      // List matches for group
addParticipant()       // Join match
removeParticipant()    // Leave match
endMatch()             // Mark match as completed
isMemberJoined()       // Check if member joined
```

### Members Module
**Path:** `backend/src/modules/members/`

**Responsibilities:**
- Member CRUD operations
- Member auto-creation
- Role management
- Member statistics

**Key Methods:**
```typescript
// In members.service.ts
getOrCreateMember()    // Get or create member
getMember()            // Get member details
getGroupMembers()      // List members in group
updateMember()         // Update member data
getMemberStats()       // Get group member stats
```

### Kas Module
**Path:** `backend/src/modules/kas/`

**Responsibilities:**
- Transaction recording
- Balance tracking
- Settlement calculation
- Transaction history

**Key Methods:**
```typescript
// In kas.service.ts
recordTransaction()     // Record income/expense
getGroupKasBalance()    // Get current balance
getTransactionHistory() // List transactions
calculateSettlement()   // Calculate bill split
applySettlement()       // Create settlement transactions
```

---

## 📡 API Endpoints

### WhatsApp API
```
GET  /api/whatsapp/qr          # Get QR code as base64
GET  /api/whatsapp/status      # Get bot connection status
```

### Groups API
```
GET    /api/groups             # List all groups
GET    /api/groups/:id         # Get group details
POST   /api/groups             # Create group
PUT    /api/groups/:id         # Update group
DELETE /api/groups/:id         # Delete group
```

### Matches API
```
GET    /api/matches            # List matches (all)
POST   /api/matches            # Create match
GET    /api/matches/:id        # Get match details
POST   /api/matches/:id/join   # Join match
POST   /api/matches/:id/leave  # Leave match
POST   /api/matches/:id/end    # End match
GET    /api/groups/:id/matches # List group's matches
```

### Members API
```
GET    /api/members            # List members (all)
GET    /api/groups/:id/members # List group's members
POST   /api/members            # Create member
GET    /api/members/:id        # Get member details
PUT    /api/members/:id        # Update member
DELETE /api/members/:id        # Delete member
```

### Kas API
```
GET    /api/kas/balance/:groupId         # Get group balance
GET    /api/kas/transactions/:groupId    # Get transactions
POST   /api/kas/record                   # Record transaction
POST   /api/kas/settle/:matchId          # Apply settlement
```

---

## 🗄️ Database Schema

### Core Models

**Users**
```prisma
- id (UUID)
- phone (String, unique)
- email (String, unique)
- name (String)
- passwordHash (String)
- isVerified (Boolean)
- createdAt, updatedAt
```

**Groups**
```prisma
- id (UUID)
- waGroupId (String, unique) ← WhatsApp group identifier
- name (String)
- description (String)
- kasBalance (Decimal)
- isPublic (Boolean)
- createdBy (UUID) → User
- createdAt, updatedAt
```

**Members** (Group members, not system users)
```prisma
- id (UUID)
- groupId (UUID) → Group
- userId (UUID) → User
- name (String)
- phone (String)
- role (String: 'admin' | 'member')
- joinedAt (DateTime)
```

**Matches**
```prisma
- id (UUID)
- groupId (UUID) → Group
- name (String)
- venue (String)
- price (Decimal)
- status (String: 'open' | 'closed')
- matchDatetime (DateTime)
- createdAt, updatedAt
```

**MatchParticipants**
```prisma
- id (UUID)
- matchId (UUID) → Match
- memberId (UUID) → Member
- joinedAt (DateTime)
```

**KasTransactions**
```prisma
- id (UUID)
- groupId (UUID) → Group
- type (String: 'income' | 'expense')
- amount (Decimal)
- description (String)
- relatedMatchId (UUID) → Match (optional)
- createdAt (DateTime)
```

---

## 🔐 Data Isolation (Critical!)

**KEY CONCEPT: Per-Group Data Isolation**

Every table (except Users) has a `groupId` field for isolation:

```typescript
// Groups are isolated by WhatsApp ID
const group = await groupsService.getGroupByWhatsAppId(waGroupId);

// All members filtered by group
const members = await membersService.getGroupMembers(groupId);

// All matches filtered by group
const matches = await matchesService.getGroupMatches(groupId);

// All transactions filtered by group
const history = await kasService.getTransactionHistory(groupId);
```

**Rule:** Never query across groups without explicit groupId filter

---

## 🤖 Command System Architecture

### Command Registration
```typescript
// In whatsapp.service.ts
private registerCommands() {
  this.commandHandler.registerCommand('help', new HelpCommand());
  this.commandHandler.registerCommand('newmatch', new NewMatchCommand(matchesService));
  // ... more commands
}
```

### Command Execution Flow
```
WhatsApp Message
      ↓
whatsapp.service.ts (receives message)
      ↓
command-handler.service.ts (parses: /command args)
      ↓
Matches registered command
      ↓
Execute command (newmatch.command.ts, etc)
      ↓
Return response to WhatsApp
```

### Creating New Command
```typescript
// File: backend/src/modules/whatsapp/commands/mycommand.command.ts

import { ICommand } from '../interfaces/command.interface';
import { Message } from 'whatsapp-web.js';

export class MycommandCommand implements ICommand {
  async execute(message: Message, args: string[]): Promise<void> {
    try {
      // Your command logic here
      await message.reply('Response from command');
    } catch (error) {
      await message.reply('❌ Error: ' + error.message);
    }
  }

  getHelpText(): string {
    return '/mycommand - Description of what command does';
  }
}

// Register in whatsapp.service.ts
this.commandHandler.registerCommand('mycommand', new MycommandCommand(...services));
```

---

## 💾 Frontend API Client

### Setup
```typescript
// frontend/src/lib/api.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const client = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});
```

### Usage Pattern
```typescript
// Fetch groups
const response = await groupsAPI.getAllGroups();
setGroups(response.data);

// Create match
const result = await matchesAPI.createMatch({
  name: 'Futsal',
  venue: 'Lapangan Voli',
  price: 50000,
});

// Handle errors
try {
  await groupsAPI.getGroup(groupId);
} catch (error) {
  console.error('Error:', error.response?.data);
}
```

### API Methods (Main)
```typescript
// Groups
groupsAPI.getAllGroups()           // GET /api/groups
groupsAPI.getGroup(id)             // GET /api/groups/:id
groupsAPI.createGroup(data)        // POST /api/groups

// Matches
matchesAPI.getMatches(groupId)     // GET /api/groups/:id/matches
matchesAPI.createMatch(data)       // POST /api/matches
matchesAPI.joinMatch(matchId)      // POST /api/matches/:id/join
matchesAPI.leaveMatch(matchId)     // POST /api/matches/:id/leave

// Members
groupsAPI.getGroupMembers(groupId) // GET /api/groups/:id/members

// Kas
kasAPI.getBalance(groupId)         // GET /api/kas/balance/:groupId
kasAPI.getTransactions(groupId)    // GET /api/kas/transactions/:groupId
```

---

## 🎨 Frontend Component Structure

### Page Pattern
All pages follow same structure:

```typescript
import { useEffect, useState } from 'react';
import { groupsAPI } from '../lib/api';
import MainLayout from '../components/MainLayout';

export default function PageName() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await groupsAPI.getGroup(selectedGroup);
      setData(response.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      {/* Page content */}
    </MainLayout>
  );
}
```

### Tailwind Classes Used
```
Layout:
  - max-w-6xl: Container width
  - flex, flex-col, grid: Layout
  - gap-X: Spacing between items
  - mb-X, px-X, py-X: Margins and padding

Styling:
  - bg-white, bg-gray-50: Background colors
  - text-XXX: Text colors
  - rounded-lg, shadow-sm: Border radius and shadows
  - border border-gray-100: Borders

Components:
  - px-6 py-3: Button/cell padding
  - hover:bg-XXX: Hover effects
  - hover:shadow-md: Shadow on hover
  - divide-y divide-gray-200: Table dividers
```

---

## 🔧 Common Tasks

### Add New WhatsApp Command
1. Create file: `backend/src/modules/whatsapp/commands/newcommand.command.ts`
2. Implement `ICommand` interface
3. Register in `whatsapp.service.ts` → `registerCommands()`
4. Add to `/help` response in help.command.ts

### Add New API Endpoint
1. Add method to service: `backend/src/modules/xxx/xxx.service.ts`
2. Add route to controller: `backend/src/modules/xxx/xxx.controller.ts`
3. Use decorator: `@Get()`, `@Post()`, `@Put()`, `@Delete()`
4. Test with Postman or curl

### Add New Database Table
1. Add model to `backend/prisma/schema.prisma`
2. Run: `npx prisma migrate dev --name add_new_table`
3. Create service in `backend/src/modules/newmodule/`
4. Register module in `app.module.ts`

### Add New Frontend Page
1. Create file: `frontend/src/pages/NewPage.tsx`
2. Add route in `frontend/src/App.tsx`
3. Add navigation in `frontend/src/components/Sidebar.tsx`
4. Fetch data using `groupsAPI` client

### Handle Error in Frontend
```typescript
try {
  const response = await groupsAPI.getGroup(id);
} catch (error) {
  const message = error.response?.data?.message || 'Unknown error';
  console.error('Failed:', message);
  // Show user-friendly error message
}
```

### Debug Database
```bash
# Open visual database browser
npx prisma studio

# Check migrations
npx prisma migrate status

# Reset database (development only!)
npx prisma migrate reset
```

---

## 🚨 Important Patterns

### Always Filter by GroupId
```typescript
// ❌ WRONG - Gets data from all groups
const members = await prisma.member.findMany();

// ✅ CORRECT - Gets data for specific group only
const members = await prisma.member.findMany({
  where: { groupId }
});
```

### Always Validate User Belongs to Group
```typescript
// ❌ WRONG - No ownership check
const match = await prisma.match.findUnique({ where: { id } });

// ✅ CORRECT - Verify group ownership
const group = await prisma.group.findUnique({ where: { id: groupId } });
if (!group) throw new Error('Group not found');

const match = await prisma.match.findUnique({
  where: { id },
  include: { group: true }
});
if (match.groupId !== groupId) throw new Error('Unauthorized');
```

### Handle Async Operations
```typescript
// Always use try-catch in async functions
async function fetchData() {
  try {
    setLoading(true);
    const data = await api.get(...);
    setData(data);
  } catch (error) {
    console.error('Error:', error);
    setError(error.message);
  } finally {
    setLoading(false);
  }
}
```

### Use Decimal for Money
```typescript
// In Prisma schema
kasBalance Decimal @db.Decimal(15, 2)

// In code - always use string or Decimal type
const balance = new Decimal('50000.00');
const total = balance.plus(100000); // Proper math
```

---

## 📊 Performance Considerations

### Database Queries
- Use `select` to fetch only needed fields
- Use `include` for relations
- Add indexes on frequently filtered fields (groupId)
- Use pagination for large lists

### Frontend
- Use React hooks correctly (dependencies array)
- Prevent unnecessary re-renders with useState
- Lazy load data on scroll/pagination
- Cache API responses when appropriate

### WhatsApp Bot
- Implement rate limiting for commands
- Queue large batch operations
- Use demo mode for development (no Chromium needed)

---

## 🧪 Testing Checklist

Before committing changes:

```bash
# Backend
npm run lint              # Check code style
npm run test              # Run unit tests
npm run build             # Check TypeScript compilation

# Frontend
npm run lint              # Check code style
npm run build             # Build production bundle

# Manual Testing
# 1. Start backend: npm run start:dev
# 2. Start frontend: npm run dev
# 3. Test each page loads
# 4. Test API calls work
# 5. Check database changes saved
```

---

## 📚 Documentation Files

- **USAGE_GUIDE.md** - How to use the app (for end users)
- **GETTING_STARTED.md** - Setup and initial testing (for developers)
- **PHASE1_COMPLETION.md** - What's been built and status (for overview)
- **DEVELOPER_REFERENCE.md** - This file (technical reference)

---

## 🆘 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Check PORT not in use, PostgreSQL running, .env configured |
| Frontend can't reach backend | Check VITE_API_URL in .env, backend running on 3000 |
| Database errors | Run `npx prisma generate`, check DATABASE_URL |
| WhatsApp not connecting | Normal - runs in demo mode. Check backend logs |
| Type errors in IDE | Run `npm install`, restart IDE |
| HMR not working | Clear vite cache: `rm -rf node_modules/.vite` |

---

## 🎯 Useful VSCode Extensions

```
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prisma
- Thunder Client (or Postman)
- Git Graph
```

---

## 📖 Resource Links

**Inside Project:**
- Schema: `backend/prisma/schema.prisma`
- Config: `backend/src/config/configuration.ts`
- API client: `frontend/src/lib/api.ts`
- Routes: `frontend/src/App.tsx`

**External:**
- NestJS Docs: https://docs.nestjs.com
- Prisma Docs: https://www.prisma.io/docs
- React Docs: https://react.dev
- Tailwind CSS: https://tailwindcss.com/docs
- React Router: https://reactrouter.com

---

**Version:** 1.0
**Last Updated:** January 3, 2026

Happy coding! 🚀

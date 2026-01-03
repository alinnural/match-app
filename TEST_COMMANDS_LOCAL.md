# 🧪 Testing WhatsApp Commands Locally

Cara test commands tanpa perlu QR code atau WhatsApp connection yang real.

---

## 📍 Step 1: Restart Backend

Pastikan backend sudah diupdate dengan test endpoint:

```bash
cd backend
npm run start:dev
```

Backend akan log:
```
✅ Demo Mode: WhatsApp Bot Ready (Mock)
✅ 5 commands registered
```

---

## 🔧 Step 2: Test Commands via API

Gunakan Postman, curl, atau Thunder Client untuk test.

### Test `/help` Command

**POST** `http://localhost:3000/api/whatsapp/test-command`

**Body:**
```json
{
  "command": "help"
}
```

**Response:**
```json
{
  "success": true,
  "command": "help",
  "args": [],
  "result": "✅ Command \"help\" executed successfully",
  "timestamp": "2026-01-03T16:00:00.000Z"
}
```

---

### Test `/newmatch` Command

Buat match baru dengan nama, venue, dan harga.

**POST** `http://localhost:3000/api/whatsapp/test-command`

**Body:**
```json
{
  "command": "newmatch",
  "args": ["Futsal", "Lapangan Voli", "50000"],
  "groupId": "test-group-001"
}
```

**Expected Response:**
```json
{
  "success": true,
  "command": "newmatch",
  "args": ["Futsal", "Lapangan Voli", "50000"],
  "result": "✅ Command \"newmatch\" executed successfully",
  "timestamp": "2026-01-03T16:00:00.000Z"
}
```

**Check di Backend Log:**
```
🧪 Testing command: /newmatch Futsal Lapangan Voli 50000 (Group: test-group-001)
✅ Pertandingan berhasil dibuat!
```

---

### Test `/listmatch` Command

List semua matches di group.

**POST** `http://localhost:3000/api/whatsapp/test-command`

**Body:**
```json
{
  "command": "listmatch",
  "groupId": "test-group-001"
}
```

---

### Test `/join` Command

Join match by number.

**POST** `http://localhost:3000/api/whatsapp/test-command`

**Body:**
```json
{
  "command": "join",
  "args": ["1"],
  "groupId": "test-group-001"
}
```

---

### Test `/leave` Command

Leave dari match.

**POST** `http://localhost:3000/api/whatsapp/test-command`

**Body:**
```json
{
  "command": "leave",
  "args": ["1"],
  "groupId": "test-group-001"
}
```

---

## 💻 Command Reference untuk Testing

| Command | Args | Example |
|---------|------|---------|
| help | - | `{"command": "help"}` |
| newmatch | [name, venue, price] | `{"command": "newmatch", "args": ["Futsal", "Lapangan", "50000"]}` |
| listmatch | - | `{"command": "listmatch"}` |
| join | [match_number] | `{"command": "join", "args": ["1"]}` |
| leave | [match_number] | `{"command": "leave", "args": ["1"]}` |

---

## 📋 Workflow Testing - Skenario Futsal

Ikuti langkah ini untuk test end-to-end:

### Step 1: Test Help
```bash
POST /api/whatsapp/test-command
{ "command": "help" }
```

### Step 2: Create Match
```bash
POST /api/whatsapp/test-command
{
  "command": "newmatch",
  "args": ["Futsal", "Lapangan Voli", "50000"],
  "groupId": "futsal-group"
}
```

### Step 3: List Matches
```bash
POST /api/whatsapp/test-command
{
  "command": "listmatch",
  "groupId": "futsal-group"
}
```

### Step 4: Join Match
```bash
POST /api/whatsapp/test-command
{
  "command": "join",
  "args": ["1"],
  "groupId": "futsal-group"
}
```

### Step 5: Check Dashboard

1. Buka http://localhost:5173/matches
2. Pilih group "futsal-group" (atau salah satu yang ada)
3. Seharusnya bisa melihat "Futsal" match yang baru dibuat
4. Participant count harus menunjukkan angka yang benar

---

## 🔍 Verify Database

Setelah test commands, verifikasi data di database:

```bash
cd backend
npx prisma studio
```

Check tabel:
- **Groups** - Lihat "test-group-001", "futsal-group"
- **Matches** - Lihat "Futsal" match dengan price 50000
- **MatchParticipants** - Lihat siapa yang join
- **Members** - Lihat members yang auto-created

---

## 🚀 Testing dengan cURL

Jika prefer command line:

### Help Command
```bash
curl -X POST http://localhost:3000/api/whatsapp/test-command \
  -H "Content-Type: application/json" \
  -d '{"command": "help"}'
```

### Create Match
```bash
curl -X POST http://localhost:3000/api/whatsapp/test-command \
  -H "Content-Type: application/json" \
  -d '{
    "command": "newmatch",
    "args": ["Futsal", "Lapangan Voli", "50000"],
    "groupId": "test-group-001"
  }'
```

### List Matches
```bash
curl -X POST http://localhost:3000/api/whatsapp/test-command \
  -H "Content-Type: application/json" \
  -d '{"command": "listmatch", "groupId": "test-group-001"}'
```

---

## 🧬 Test Template (Copy-Paste Ready)

Gunakan template ini untuk test commands lainnya:

```json
{
  "command": "COMMAND_NAME",
  "args": ["arg1", "arg2", "arg3"],
  "groupId": "test-group-123"
}
```

**Contoh konkret untuk setiap command:**

### Help
```json
{
  "command": "help"
}
```

### New Match
```json
{
  "command": "newmatch",
  "args": ["Badminton", "Lapangan Badminton", "75000"]
}
```

### List Match
```json
{
  "command": "listmatch"
}
```

### Join
```json
{
  "command": "join",
  "args": ["2"]
}
```

### Leave
```json
{
  "command": "leave",
  "args": ["1"]
}
```

---

## ⚡ Quick Testing Script

Save ini sebagai `test-commands.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:3000/api/whatsapp/test-command"

echo "🧪 Testing WhatsApp Commands..."

echo ""
echo "1️⃣ Testing /help"
curl -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -d '{"command": "help"}' | jq .

echo ""
echo "2️⃣ Testing /newmatch"
curl -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -d '{
    "command": "newmatch",
    "args": ["Futsal", "Lapangan Voli", "50000"]
  }' | jq .

echo ""
echo "3️⃣ Testing /listmatch"
curl -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -d '{"command": "listmatch"}' | jq .

echo ""
echo "✅ Testing complete!"
```

Run dengan:
```bash
chmod +x test-commands.sh
./test-commands.sh
```

---

## 📊 Expected Test Results

### Success Response Format
```json
{
  "success": true,
  "command": "commandname",
  "args": ["arg1", "arg2"],
  "result": "Command result here",
  "timestamp": "2026-01-03T16:00:00.000Z"
}
```

### Error Response Format
```json
{
  "success": false,
  "error": "Error message here"
}
```

---

## 💡 Tips

1. **Group ID:** Gunakan nama yang konsisten (e.g., "futsal-group", "test-group-001")
2. **Multiple Groups:** Test dengan groupId yang berbeda untuk lihat data isolation
3. **Backend Logs:** Pantau backend terminal untuk melihat command execution
4. **Database Check:** Verify dengan Prisma Studio setelah setiap test
5. **Dashboard Check:** Buka http://localhost:5173 untuk lihat UI reflect data

---

## 🔄 Test Cycle

Recommended testing flow:

1. **Test Command via API** → Verify success response
2. **Check Backend Log** → Verify command executed
3. **Check Database** → Verify data persisted
4. **Check Dashboard** → Verify UI reflects changes

Repeat untuk setiap command.

---

**Last Updated:** January 3, 2026
**Status:** Ready for Local Testing ✅

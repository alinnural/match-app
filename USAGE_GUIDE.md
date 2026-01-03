# 📱 Match Sport App - Complete Usage Guide

## Table of Contents
1. [Setup & Running](#setup--running)
2. [Step-by-Step Workflow](#step-by-step-workflow)
3. [WhatsApp Commands](#whatsapp-commands)
4. [Web Dashboard](#web-dashboard)
5. [Complete Example](#complete-workflow-example)
6. [Key Features](#key-features-explained)
7. [Tips & Tricks](#tips--tricks)
8. [Troubleshooting](#troubleshooting)

---

## Setup & Running

### Prerequisites
- Node.js 18+
- Docker & Docker Compose (optional)
- PostgreSQL running
- WhatsApp installed on mobile phone

### Start Backend Server

```bash
cd backend
npm install
npm run start:dev
```

**Expected Output:**
```
[Nest] 25916  - 01/03/2026, 3:51:52 PM    LOG    [NestApplication] Nest application successfully started
[Nest] 25916  - 01/03/2026, 3:51:53 PM    LOG    [WhatsappService] ✅ Demo Mode: WhatsApp Bot Ready (Mock)
```

Running at: `http://localhost:3000`

### Start Frontend Server

```bash
cd frontend
npm install
npm run dev
```

**Expected Output:**
```
  VITE v7.3.0  ready in 236 ms
  ➜  Local:   http://localhost:5173/
```

Running at: `http://localhost:5173`

---

## Step-by-Step Workflow

### STEP 1: Bot Login dengan QR Code

1. **Buka browser**: `http://localhost:5173`
2. **Halaman WhatsApp Login** muncul dengan QR Code
3. **Di HP Anda**:
   - Buka **WhatsApp**
   - Tap **Settings** → **Linked Devices**
   - Tap **Link a Device**
4. **Scan QR Code** yang ada di layar
5. Bot akan login otomatis ✅
6. Klik **"Lanjut ke Dashboard"** untuk masuk ke dashboard

**Status Check:**
```bash
# Terminal - lihat log bot connected
✅ WhatsApp Bot Connected!
```

### STEP 2: Setup Grup WhatsApp

1. **Buat Grup Baru** di WhatsApp
   - Contoh: "Futsal Crew", "Badminton Squad", dll
2. **Invite Bot** ke grup
   - Cari bot Anda di WhatsApp contacts
   - Masukkan ke grup
3. Bot otomatis akan terdeteksi dan siap menerima perintah

### STEP 3: Gunakan WhatsApp Commands

Di dalam grup WhatsApp, gunakan perintah dengan format `/command`:

---

## WhatsApp Commands

### A. Lihat Semua Perintah

```
/help
```

**Response:**
```
╔════════════════════════════════════════╗
║   🎯 MATCH SPORT BOT - HELP            ║
╚════════════════════════════════════════╝

📋 DAFTAR PERINTAH:

Kelola Pertandingan:
/newmatch - Buat pertandingan baru
/join - Bergabung ke pertandingan
/leave - Keluar dari pertandingan
/listmatch - Daftar pertandingan aktif
/status - Lihat detail pertandingan
/endmatch - Akhiri pertandingan & hitung tagihan
```

### B. Buat Pertandingan Baru

```
/newmatch <nama_olahraga> <lokasi> <harga_per_orang>
```

**Example:**
```
/newmatch Futsal "Lapangan Satrio" 50000
```

**Response:**
```
✅ PERTANDINGAN BARU DIBUAT!

📌 Futsal
📍 Lokasi: Lapangan Satrio
💰 Harga: Rp 50.000
🕐 Waktu: 15:32:45
👥 Peserta: 1 orang (Anda)

Ketik /join untuk bergabung ke pertandingan ini!
```

**What Happens:**
- ✅ Match dibuat di database
- ✅ Anda auto-join sebagai founder
- ✅ Kas balance belum berubah (baru update saat match end)

### C. Lihat Daftar Pertandingan Aktif

```
/listmatch
```

**Response:**
```
📋 DAFTAR PERTANDINGAN

🟢 Aktif:
1. Futsal - Lapangan Satrio
   💰 Rp 50.000
   👥 1 peserta

2. Badminton - GOR Satrio
   💰 Rp 30.000
   👥 2 peserta

✅ Selesai:
• Futsal - Lapangan A
```

### D. Bergabung ke Pertandingan

#### Cara 1: Show daftar terlebih dahulu
```
/join
```

**Response:**
```
📋 DAFTAR PERTANDINGAN AKTIF:

1. Futsal - Lapangan Satrio
   💰 Rp 50.000
   👥 1 peserta

2. Badminton - GOR Satrio
   💰 Rp 30.000
   👥 2 peserta

Ketik /join <nomor> untuk bergabung
Contoh: /join 1
```

#### Cara 2: Langsung pilih nomor
```
/join 1
```

**Response:**
```
✅ BERHASIL BERGABUNG!

📌 Futsal
📍 Lapangan Satrio
💰 Rp 50.000

Ketik /status untuk lihat detail pertandingan
Ketik /leave untuk keluar dari pertandingan
```

### E. Keluar dari Pertandingan

```
/leave
```

**Response (jika ikut multiple matches):**
```
📋 PILIH PERTANDINGAN UNTUK DIKELUAR:

1. Futsal - Lapangan Satrio
2. Badminton - GOR Satrio

Ketik /leave <nomor> untuk keluar
Contoh: /leave 1
```

**Response (kalau hanya ikut 1):**
```
✅ BERHASIL KELUAR DARI PERTANDINGAN!

Futsal - Lapangan Satrio
```

### F. Lihat Saldo Kas Grup

```
/kas
```

**Response:**
```
💰 SALDO KAS GRUP

Balance: Rp 150.000

Ketik /historykas untuk lihat riwayat transaksi
```

### G. Lihat Riwayat Kas

```
/historykas
```

**Response:**
```
📋 RIWAYAT KAS

1. ➕ Rp 50.000 - Futsal (Ahmad) - 3 Jan
2. ➕ Rp 50.000 - Futsal (Budi) - 3 Jan
3. ➕ Rp 50.000 - Futsal (Citra) - 3 Jan
```

---

## Web Dashboard

### Navigation

**Menu:**
- 📊 Dashboard - Overview & statistics
- ⚽ Pertandingan - Match management
- 💰 Kas Grup - Financial tracking
- 👥 Anggota - Member management

### Dashboard Page

**Shows:**
- **Total Komunitas** - Jumlah grup yang terbuat
- **Total Members** - Total anggota di semua grup
- **Total Matches** - Total pertandingan yang pernah dibuat

**Aksi:**
- Click komunitas untuk lihat detail
- 🔄 Refresh button untuk update data

### Pertandingan Page (Matches)

**Informasi per match:**
- Nama pertandingan
- Lokasi (venue)
- Harga per orang
- Status (Aktif/Selesai - green/gray badge)
- Jumlah peserta

**Aksi:**
- **Pilih komunitas** dari dropdown untuk filter
- **"Lihat Detail"** button untuk see full details
- **"Edit"** button untuk edit match (coming soon)

**Kolom:**
```
| Nama Match    | Lokasi         | Harga | Status | Peserta | Aksi  |
|---------------|----------------|-------|--------|---------|-------|
| Futsal        | Lapangan A     | Rp... | Aktif  | 3       | Detail|
| Badminton     | GOR Satrio     | Rp... | Selesai| 5       | Detail|
```

### Kas Page (Financial)

**Big Card (Saldo):**
- Display saldo kas grup dengan warna primary
- Tombol "Setor" dan "Tarik" (functionality coming soon)

**Transaksi Table:**
```
| Tipe  | Deskripsi              | Jumlah        | Tanggal   |
|-------|------------------------|---------------|-----------|
| ➕    | Futsal Match           | + Rp 50.000   | 3 Jan     |
| ➕    | Badminton Match        | + Rp 100.000  | 2 Jan     |
```

**Interpretasi:**
- Green (+) = Money coming in (dari match end)
- Red (-) = Money going out (future feature)

### Members Page

**Statistik Cards:**
- Total Anggota
- Jumlah Admin
- Jumlah Member

**Members Table:**
```
| Nama  | No. HP        | Role   | Bergabung | Aksi      |
|-------|---------------|--------|-----------|-----------|
| Ahmad | 0812xxxxxx    | Member | 3 Jan     | Edit/Hapus|
| Budi  | 0898xxxxxx    | Member | 2 Jan     | Edit/Hapus|
```

**Aksi:**
- **Edit** - Ubah nama, no. HP, atau role
- **Hapus** - Remove dari grup (soft delete)

---

## Complete Workflow Example

### Scenario: Futsal Group Main Futsal

#### Step 1: Create Match (di WhatsApp Group "Futsal Crew")

```
Admin: /newmatch Futsal "Lapangan Satrio" 50000

Bot: ✅ Pertandingan Baru Dibuat!
📌 Futsal
📍 Lokasi: Lapangan Satrio
💰 Harga: Rp 50.000
👥 Peserta: 1 orang (Anda)

Ketik /join untuk bergabung ke pertandingan ini!
```

#### Step 2: Members Join

```
Ahmad: /join
Bot: 📋 Daftar Pertandingan Aktif:
1. Futsal - Lapangan Satrio - 1 peserta

Ahmad: /join 1
Bot: ✅ Berhasil bergabung!

Budi: /join 1
Bot: ✅ Berhasil bergabung!

Citra: /join 1
Bot: ✅ Berhasil bergabung!
```

**Database State:**
- Match: 3 participants (Admin, Ahmad, Budi, Citra)
- Members auto-created: Ahmad, Budi, Citra
- Total cost: Rp 50.000 × 3 = Rp 150.000

#### Step 3: Check Kas Before End

```
Admin: /kas
Bot: 💰 Saldo Kas: Rp 0

(Belum ada transaksi karena match masih aktif)
```

#### Step 4: End Match

```
Admin: /endmatch
Bot: ✅ Pertandingan Selesai!

💳 PEMBAGIAN BIAYA:
- Ahmad: Rp 50.000
- Budi: Rp 50.000
- Citra: Rp 50.000
Total Collected: Rp 150.000
```

#### Step 5: Check Kas After End

```
Admin: /kas
Bot: 💰 Saldo Kas: Rp 150.000

Admin: /historykas
Bot: 📋 Riwayat Kas:
1. ➕ Rp 50.000 - Bill dari pertandingan: Futsal
2. ➕ Rp 50.000 - Bill dari pertandingan: Futsal
3. ➕ Rp 50.000 - Bill dari pertandingan: Futsal
```

#### Step 6: Check Dashboard

Open web dashboard:

**Matches Page:**
- Show 1 selesai (status = done)
- Total peserta: 3

**Kas Page:**
- Saldo: Rp 150.000
- Transaction history: 3 entries

**Members Page:**
- Total anggota: 4 (1 admin + 3 members)
- Ahmad, Budi, Citra visible

---

## Key Features Explained

### ⚽ Matches Management
- **Create**: Start new match dengan harga & lokasi
- **Join**: Members join ke match yang aktif
- **Leave**: Remove diri dari match sebelum selesai
- **End**: Finish match & auto-calculate bills
- **Track**: View semua participants

**Data Stored:**
- Match name, venue, price
- Participant list
- Match status (open/done)
- Creation & end times

### 💰 Kas Management
- **Balance**: Track total group fund
- **Transactions**: Record setiap income/expense
- **History**: View semua past transactions
- **Settlement**: Auto-calculate bill per person

**Formula:**
```
Total Cost = Price per Person × Number of Participants
Amount Per Person = Total Cost / Number of Participants
```

**Example:**
```
Match: Futsal
Price: Rp 50.000
Participants: 4

Total: Rp 50.000 × 4 = Rp 200.000
Per Person: Rp 200.000 / 4 = Rp 50.000
```

### 👥 Members Management
- **Auto-create**: Member dibuat saat first join
- **Roles**: Admin atau Member
- **Stats**: Track matches joined, amount due
- **Manage**: Edit data atau remove dari grup

### 🤖 WhatsApp Bot
- **No UI needed** - Commands via chat
- **Group-based** - Different groups = different data
- **Auto-response** - Bot respond instantly
- **Easy parsing** - Simple `/command` format

### 📊 Web Dashboard
- **Beautiful UI** - Modern design with Tailwind CSS
- **Real-time data** - Fetch dari API
- **Easy navigation** - Sidebar menu
- **Group switching** - Select group untuk filter

---

## Tips & Tricks

✅ **Selalu gunakan `/help` untuk refresh memory tentang commands**

✅ **Bot auto-detects saat ditambahkan ke grup baru**

✅ **Setiap grup isolated - data tidak tercampur ke grup lain**

✅ **Kas auto-diupdate saat match selesai - tidak perlu manual input**

✅ **Members auto-added saat join match pertama kali**

✅ **Dashboard real-time - refresh browser untuk lihat data terbaru**

✅ **Bisa switch grup di dropdown - lihat data per grup**

✅ **Archive atau delete match di dashboard jika sudah tidak diperlukan**

---

## Troubleshooting

### Bot tidak respond?

**Solusi:**
- ✅ Pastikan backend running: `npm run start:dev`
- ✅ Check terminal log untuk error message
- ✅ Bot harus sudah di-invite ke grup
- ✅ Format command harus benar: `/command args`

**Debug:**
```bash
# Terminal backend - lihat log
[WhatsappService] Message from group: Futsal Crew
[WhatsappService] Command executed: newmatch
```

### QR Code tidak muncul?

**Solusi:**
- ✅ Pastikan frontend running: `npm run dev`
- ✅ Refresh browser page
- ✅ Clear browser cache (Ctrl+Shift+Del)
- ✅ Check browser console untuk error (F12 → Console)

### Data tidak muncul di dashboard?

**Solusi:**
- ✅ Database harus sudah di-setup: `npx prisma migrate dev`
- ✅ Refresh browser (Ctrl+R atau Cmd+R)
- ✅ Check network tab (F12 → Network) untuk API errors
- ✅ Pastikan backend jalan dan tidak ada error log

**Check Database:**
```bash
# Terminal backend
npx prisma studio  # Open visual database browser
```

### Members tidak ter-create?

**Solusi:**
- ✅ Member auto-created saat join match pertama kali
- ✅ Atau bisa add manual via dashboard Members page
- ✅ Ensure match sudah dibuat terlebih dahulu sebelum join

### Command tidak diterima?

**Solusi:**
- ✅ Pastikan format benar: `/command arguments`
- ✅ Tidak ada typo di nama command
- ✅ Argument harus separated by space
- ✅ Message harus dalam grup (tidak direct message)

**Contoh Format Benar:**
```
❌ /newmatch Futsal Lapangan Satrio 50000  (harus 3 args)
✅ /newmatch Futsal "Lapangan Satrio" 50000 (quote lokasi)
✅ /join 1 (nomor must exist)
❌ /join A (nomor must be number)
```

---

## Quick Command Reference

```
🎯 MATCH COMMANDS:
/newmatch    - Buat pertandingan baru
/join        - Bergabung ke pertandingan
/leave       - Keluar dari pertandingan
/listmatch   - Daftar pertandingan aktif
/status      - Detail pertandingan (coming soon)
/endmatch    - Akhiri & hitung tagihan (coming soon)

💰 KAS COMMANDS:
/kas         - Lihat saldo kas (coming soon)
/historykas  - Riwayat transaksi (coming soon)

ℹ️ INFO COMMANDS:
/help        - Tampilkan semua perintah
```

---

## API Reference

### Groups API
```
GET  /api/groups                - List all groups
GET  /api/groups/:id            - Get group detail
GET  /api/groups/:id/stats      - Get group statistics
```

### Matches API
```
GET  /api/matches/group/:groupId    - List matches in group
GET  /api/matches/:id               - Get match detail
POST /api/matches/:id/join          - Join match
DELETE /api/matches/:id/leave       - Leave match
POST /api/matches/:id/end           - End match
```

### Kas API
```
GET  /api/kas/groups/:groupId/balance       - Get balance
GET  /api/kas/groups/:groupId/history       - Get transactions
POST /api/kas/transaction                   - Record transaction
GET  /api/kas/matches/:matchId/settlement   - Calculate settlement
POST /api/kas/matches/:matchId/settlement   - Apply settlement
```

### Members API
```
GET  /api/members/group/:groupId   - List group members
GET  /api/members/:id              - Get member detail
PATCH /api/members/:id             - Update member
DELETE /api/members/:id            - Remove member
GET  /api/members/:id/stats        - Get member statistics
```

---

**Enjoy using Match Sport App!** ⚽💰👥

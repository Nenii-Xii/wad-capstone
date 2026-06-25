# WAD Capstone REST API - Tugas Praktikum Mandiri (UTS)

Aplikasi REST API manajemen tugas (*Task Management*) berbasis Node.js + Express yang terintegrasi dengan database MySQL menggunakan Prisma ORM. Aplikasi ini dilengkapi dengan sistem keamanan autentikasi berlapis menggunakan JWT (*Access Token* & *Refresh Token Rotation*), enkripsi password berbasis Argon2id, serta fitur dekomposisi tugas melalui komponen model tambahan yang unik.

---

## 👩‍💻 Profil Mahasiswa
- **Nama:** NENI GALUH PUTRI ANYELER
- **Model Tambahan yang Ditugaskan:** `Subtask` (Bidang: Dekomposisi Tugas)

---

## 🏗️ Fitur & Spesifikasi Teknis

1. **Arsitektur Berbasis Repository Pattern:** Memisahkan logika kueri database (`src/repositories`) dari penanganan logika kontrol aplikasi (`src/controllers`).
2. **Autentikasi & Otorisasi Kokoh (Week 6-7):**
   - Registrasi & Login dengan hashing password menggunakan `argon2`.
   - Penerbitan *Access Token* (masa aktif 15 menit) dan *Refresh Token* (masa aktif 7 hari).
   - Mekanisme **Refresh Token Rotation** dan **Reuse Detection** (jika token lama digunakan kembali, semua sesi turunan otomatis dicabut demi keamanan).
   - Rute API internal dilindungi secara menyeluruh oleh pintu keamanan `authenticate` middleware.
3. **Model Tambahan Unik (`Subtask`):**
   - Mendukung dekomposisi tugas utama menjadi sub-tugas mandiri.
   - Relasi penuh (*Cascade Delete*) terikat langsung ke model `Task` dan model `User`.
4. **Validasi Skema Masukan:** Menggunakan pustaka `Joi` untuk memvalidasi setiap payload request dengan pesan eror yang informatif dalam Bahasa Indonesia.
5. **Dokumentasi Interaktif:** Integrasi penuh Swagger UI yang dapat diakses secara langsung melalui peramban.

---

## 🗺️ Representasi ERD (Entity Relationship Diagram)

Berikut adalah struktur hubungan antartabel di dalam database MySQL yang dikelola oleh Prisma ORM:

- **User (1) ─── 🌌 (N) Task** *(Seorang user dapat memiliki banyak tugas; jika user dihapus, tugas otomatis terhapus / Cascade).*
- **User (1) ─── 🌌 (N) RefreshToken** *(Satu user dapat memiliki banyak token sesi aktif).*
- **User (1) ─── 🌌 (N) Subtask** *(Satu user bertindak sebagai pemilik/pembuat dari banyak subtask).*
- **Category (1) ─── 🌌 (N) Task** *(Kategori mengelompokkan banyak tugas; jika kategori dihapus, kolom relasi di tabel tugas disetel menjadi null / SetNull).*
- **Task (1) ─── 🌌 (N) Subtask** *(Sebuah tugas utama dapat didekomposisi menjadi beberapa sub-tugas; jika tugas utama dihapus, seluruh subtask di bawahnya otomatis ikut terhapus / Cascade).*

---

## 🚀 Panduan Setup & Instalasi Lokal

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi di lingkungan lokal Anda:

### 1. Prasyarat Sistem
- Pastikan **Node.js** (direkomendasikan versi v20+) telah terpasang.
- Jalankan modul **Apache** dan **MySQL** melalui control panel **XAMPP**.

### 2. Kloning & Instalasi Dependensi
Buka terminal Anda, lalu jalankan perintah berikut:
```bash
# Instalasi seluruh modul dependensi sesuai package.json
npm install
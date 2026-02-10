# ⛩️ Anime Quiz App (React + Vite)

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![React](https://img.shields.io/badge/React-18-blue) ![Vite](https://img.shields.io/badge/Vite-5.0-purple) ![Firebase](https://img.shields.io/badge/Firebase-Auth-orange)

Aplikasi kuis interaktif bertema **Anime & Manga** yang dibangun dengan teknologi modern web. Menampilkan desain *Cyberpop* yang estetis, sistem ranking (Leaderboard), dan integrasi API soal otomatis.

---

## ✨ Fitur Utama

### 🎨 Anime & Manga Theme
- **Visual**: Desain futuristik dengan warna *Deep Indigo*, *Neon Pink*, dan *Cyan*.
- **Mascot**: Interaksi seru dengan maskot rubah (🦊) yang bereaksi terhadap jawaban penggunan.
- **Istilah Otaku**: Menggunakan terminologi unik seperti *"Start Mission"*, *"Opening Gate"*, *"Shinobi Rank"*.

### 🎮 Gameplay Interaktif
- **Time Attack**: Soal dibatasi waktu 120 detik (2 menit).
- **Sistem Poin**: Penilaian berdasarkan ketepatan jawaban.
- **Ranking**: Klasifikasi skor mulai dari **Genin** hingga **Hokage (S-Rank)**.
- **Resume Kuis**: Otomatis menyimpan progres jika browser tertutup tidak sengaja.

### 🏆 Leaderboard & Data
- **Global Ranking**: Melihat skor tertinggi dari seluruh pemain.
- **Real-time API**: Soal diambil langsung dari [OpenTDB](https://opentdb.com/) (Kategori: Japanese Anime & Manga).
- **SheetDB Integration**: Menyimpan data skor pemain ke Google Sheets untuk kemudahan manajemen data.

### 🔐 Keamanan
- **Firebase Authentication**: Login aman menggunakan Email & Password.
- **Email Verification**: Wajib verifikasi email sebelum bisa bermain untuk mencegah spam.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: CSS Modules + Glassmorphism Effects + Animations
- **Routing**: React Router DOM v6
- **Backend / Auth**: Firebase Authentication
- **Database (Leaderboard)**: SheetDB (Google Sheets API)
- **Trivia API**: OpenTDB

---

## 🚀 Cara Menjalankan (Local Development)

Ikuti langkah ini untuk menjalankan aplikasi di komputermu:

1.  **Clone Repository**
    ```bash
    git clone https://github.com/USERNAME/REPO_NAME.git
    cd quiz-react
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Jalankan Server**
    ```bash
    npm run dev
    ```
    Buka browser di `http://localhost:5173`.

---

## 🌐 Deployment (Netlify)

Aplikasi ini sudah dikonfigurasi untuk siap deploy ke Netlify.

1.  Push kode ke GitHub.
2.  Buka [Netlify](https://www.netlify.com/) → **"Add new site"** → **"Import an existing project"**.
3.  Pilih Repository GitHub kamu.
4.  Gunakan setting berikut:
    - **Build command**: `npm run build`
    - **Publish directory**: `dist`
5.  Klik **Deploy**!

> **Catatan:** File `public/_redirects` sudah disertakan untuk mencegah error 404 saat refresh halaman (SPA Routing).

---

## 📂 Struktur Project

```
c:\quiz-react\
├── public/              # Aset statis (_redirects, favicon)
├── src/
│   ├── components/      # Komponen UI (Stars, Confetti, Cards)
│   ├── context/         # Global State (AuthContext)
│   ├── hooks/           # Custom Hooks (useQuiz, useTimer)
│   ├── pages/           # Halaman (Home, Quiz, Login, Leaderboard)
│   ├── services/        # API calls (OpenTDB, SheetDB)
│   ├── firebase.js      # Konfigurasi Firebase
│   ├── index.css        # Global Styles
│   ├── main.jsx         # Entry Point
│   └── App.jsx          # Routing Utama
└── README.md            # Dokumentasi ini
```

---

## 📝 Credits

Dibuat dengan ❤️ oleh **Tezow** (Powered by **Antigravity Agent**).
Misi Selesai. **Sasageyo!** ⚔️

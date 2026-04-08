# ShortLink — Frontend

Antarmuka pengguna untuk aplikasi pemendek URL, dibangun dengan **React**, **Vite**, dan **Tailwind CSS**.

---

## Tech Stack

| Teknologi | Kegunaan |
|-----------|----------|
| React 19 | UI library |
| Vite 8 | Build tool & dev server |
| Tailwind CSS v4 | Styling |
| React Router v7 | Client-side routing |
| Redux Toolkit | State management |
| React Redux | Integrasi Redux ke React |
| Lucide React | Icon library |

---

## Struktur Proyek

```
frontend/
├── src/
│   ├── assets/              # Gambar & ikon statis
│   ├── hooks/
│   │   └── useFetch.js      # Custom hook untuk fetching data
│   ├── pages/
│   │   ├── LandingPage.jsx  # Halaman utama / marketing
│   │   ├── LoginPage.jsx    # Halaman login
│   │   ├── Register.jsx     # Halaman registrasi
│   │   └── NotFoundPage.jsx # Halaman 404
│   ├── App.jsx              # Router utama aplikasi
│   ├── main.jsx             # Entry point React
│   └── index.css            # Global styles
├── public/                  # Asset publik
├── index.html
├── vite.config.js
├── eslint.config.js
└── package.json
```

---

## Halaman yang Tersedia

| Path | Halaman | Keterangan |
|------|---------|------------|
| `/` | Dashboard | Halaman dashboard utama |
| `/landing-page` | Landing Page | Halaman marketing aplikasi |
| `/login` | Login | Form login pengguna |
| `/register` | Register | Form registrasi pengguna baru |
| `*` | Not Found | Halaman 404 |

---

## Environment Variables

Buat file `.env` di folder `frontend/`:

```env
VITE_BASE_URL=http://localhost:8888
```

> `VITE_BASE_URL` adalah URL base dari backend API.

---

## Menjalankan Proyek

### Prasyarat
- Node.js 18+
- npm atau yarn

### Development

```bash
cd frontend

# Install dependency
npm install

# Copy env
cp .env.example .env
# Edit VITE_BASE_URL sesuai URL backend kamu

# Jalankan dev server
npm run dev
```

Aplikasi akan berjalan di: **http://localhost:5173**

### Build untuk Production

```bash
npm run build
```

Hasil build akan ada di folder `dist/`.

### Preview Build Production

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

---

## Menghubungkan ke Backend

Custom hook `useFetch` secara otomatis menggunakan `VITE_BASE_URL` dari `.env` untuk memanggil API:

```js
import useFetch from "../hooks/useFetch";

const data = useFetch("/api/links");
```

Pastikan backend sudah berjalan dan CORS dikonfigurasi dengan benar sebelum menjalankan frontend.

---

## Menggunakan Docker

```bash
cd frontend
docker build -t shortlink-frontend .
docker run -p 5173:5173 shortlink-frontend
```
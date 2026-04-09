# 🚀 Koda B6 Final Fase

Fullstack web application built with modern stack for URL shortening and user management.

---

## 📦 Tech Stack

### 🔧 Backend

* Golang (Gin)
* PostgreSQL
* Redis (Caching)
* JWT Authentication

### 🎨 Frontend

* React
* Tailwind CSS
* Redux

---

## ✨ Features

### 🔐 Authentication

* Register & Login
* JWT-based authentication
* Protected routes

### 🔗 Shortlink System

* Create short URLs
* Redirect to original URL
* Track click count

### 👤 User Management

* Get user profile
* Update profile image (upload)
* Email-based lookup

### ⚡ Performance

* Redis caching for links
* Optimized query handling

---

## Project Structure

```
final-fase/
│
├── backend/
│   ├── internal/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── model/
│   │   ├── middleware/
│   │   └── router/
│   └── uploads/
│
├── frontend/
│
├── docker-compose.yml
└── README.md
```

---

## Getting Started

### Run with Docker

```bash
docker-compose up --build
```

---

### Run Backend (Manual)

```bash
cd backend
go run main.go
```

---

### Run Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Image Upload

* Images are stored in:

```
/uploads
```

* Access via:

```
http://localhost:PORT/images/<filename>
```

---

## API Example

### Update User Image

```http
PATCH /api/users/image
```

**Headers:**

```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

---

## Notes

* Make sure `.env` is configured
* `uploads/` should be ignored in `.gitignore`
* Redis must be running for caching

---

## Future Improvements

* Delete old uploaded images
* Rate limiting
* Pagination optimization
* Deploy to cloud (AWS / GCP)

---

## Author

**VirgilIw**

---

## Support

If you like this project, give it a ⭐ on GitHub!

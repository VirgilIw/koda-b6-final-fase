# ShortLink — Backend

REST API for a URL shortener application, built with **Go**, **Gin**, **PostgreSQL**, and **Redis**.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Go + Gin | HTTP framework |
| PostgreSQL (pgx/v5) | Primary database |
| Redis | Caching |
| JWT (golang-jwt/v5) | Authentication |
| Argon2 | Password hashing |
| NanoID | Random slug generation |
| Swagger (swaggo) | API documentation |
| Air | Hot reload for development |
| Docker | Containerization |

---

## Project Structure

```
backend/
├── cmd/
│   └── main.go              # Application entry point
├── internal/
│   ├── config/
│   │   ├── database.go      # PostgreSQL connection
│   │   └── redis.go         # Redis connection
│   ├── controller/          # HTTP handlers
│   │   ├── auth.controller.go
│   │   ├── links.controller.go
│   │   └── user.controller.go
│   ├── di/
│   │   └── container.di.go  # Dependency injection
│   ├── dto/                 # Data Transfer Objects
│   ├── lib/
│   │   ├── jwt.go           # JWT generate & verify
│   │   └── hash.go          # Password hashing
│   ├── middleware/
│   │   ├── auth.middleware.go  # JWT auth guard
│   │   └── cors.middleware.go  # CORS
│   ├── model/               # Database structs
│   ├── repository/          # Database queries
│   ├── router/              # Route definitions
│   └── service/             # Business logic
├── docs/                    # Swagger docs (auto-generated)
├── .env.example
├── .air.toml
├── Dockerfile
└── go.mod
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/login` | Login user |
| POST | `/api/register` | Register new user |

### Links (Requires JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/links` | Create a new short link |
| GET | `/api/links` | Get all short links owned by the user |
| GET | `/r/:slug` | Redirect to the original URL |

### Users (Requires JWT)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/me` | Get currently logged-in user profile |
| GET | `/api/users/email/:email` | Find user by email |

### Documentation
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/swagger/*any` | Swagger UI |

---

## Environment Variables

Create a `.env` file inside the `backend/` folder based on `.env.example`:

```env
PORT=
APP_URL=

DB_HOST=
DB_PORT=
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_NAME=
DB_SSLMODE=

REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=

SECRET_KEY=your_jwt_secret_key
```

---

## Running the Project

### Prerequisites
- Go 1.21+
- PostgreSQL
- Redis

### Development (with Hot Reload)

```bash
cd backend

# Install dependencies
go mod tidy

# Copy env file
cp .env.example .env
# Edit .env to match your local configuration

# Install air (if not already installed)
go install github.com/air-verse/air@latest

# Run
air
```

### Without Hot Reload

```bash
cd backend
go run cmd/main.go
```

### Using Docker

```bash
cd backend
docker build -t shortlink-backend .
docker run -p 8888:8888 --env-file .env shortlink-backend
```

---

## API Documentation

Once the server is running, open Swagger UI at:

```
http://localhost:8888/swagger/index.html
```

Endpoints that require authentication use a **Bearer Token**. Pass the token in the request header:

```
Authorization: Bearer <token>
```

---

## Authentication Flow

1. Register or login to receive a JWT token.
2. Include the token in the `Authorization` header for every protected request.
3. Tokens expire after **1 hour**.

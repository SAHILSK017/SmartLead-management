# Smart Leads Dashboard

A full-stack MERN Lead Management Dashboard with modern architecture, role-based access control, advanced filtering, pagination, and a responsive premium UI.

## Features

- **Authentication System**: Secure JWT-based registration and login with bcrypt password hashing.
- **Role-Based Access Control**: `admin` can create, edit, view, and delete leads. `sales` users cannot delete leads.
- **Lead Management (CRUD)**: Create, Read, Update, and Delete leads.
- **Advanced Filtering & Pagination**: Filter by status and source, debounced search by name/email, sort by date, with backend-driven pagination.
- **CSV Export**: Export filtered leads to a CSV file.
- **Premium UI/UX**: Dark mode support, micro-animations, loading states, empty states, and toast notifications.

## Tech Stack

**Frontend:**
- React.js (Vite)
- TypeScript
- TailwindCSS
- Zustand (State Management)
- TanStack Query (Data Fetching & Caching)
- React Hook Form & Zod (Form Validation)
- Axios

**Backend:**
- Node.js
- Express.js
- TypeScript
- MongoDB + Mongoose
- JSON Web Tokens (JWT)
- bcryptjs
- Zod (Request Validation)
- Helmet & CORS

## Folder Structure

```
smart-lead/
├── backend/                  # Express API
│   ├── src/
│   │   ├── config/           # Environment & DB config
│   │   ├── controllers/      # Route handlers
│   │   ├── middleware/       # Auth, roles, error, validation
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # Express routes
│   │   ├── services/         # Business logic layer
│   │   ├── types/            # Shared interfaces & enums
│   │   ├── utils/            # Helpers (API response, CSV export, AppError)
│   │   └── validations/      # Zod validation schemas
│   └── Dockerfile
├── frontend/                 # React UI
│   ├── src/
│   │   ├── api/              # Axios instance & API calls
│   │   ├── components/       # Reusable UI & Lead components
│   │   ├── hooks/            # Custom hooks (useDebounce, TanStack queries)
│   │   ├── layouts/          # Auth & Dashboard layouts
│   │   ├── pages/            # Login, Register, Dashboard
│   │   ├── routes/           # React Router setup & guards
│   │   ├── store/            # Zustand auth store
│   │   ├── types/            # Shared interfaces
│   │   └── utils/            # Helper functions
│   ├── nginx.conf            # Nginx routing config
│   └── Dockerfile
└── docker-compose.yml        # Multi-container orchestration
```

## Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smartleads
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Setup Instructions

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally or via Atlas

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The app will be running at `http://localhost:5173`.

## Docker Setup

To run the entire stack (MongoDB, Backend, Frontend) via Docker:

```bash
docker-compose up -d --build
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`
- MongoDB: `localhost:27017`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create a new account
- `POST /api/auth/login` - Authenticate and get token
- `GET /api/auth/me` - Get current user profile

### Leads
- `GET /api/leads` - Get all leads (with pagination, filters, search, sorting)
- `GET /api/leads/:id` - Get single lead
- `POST /api/leads` - Create lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead (Admin only)
- `GET /api/leads/export` - Export leads to CSV (respects current filters)

## Deployment Guide

### Backend
1. Set `NODE_ENV=production`.
2. Provide a strong `JWT_SECRET`.
3. Set `CORS_ORIGIN` to your deployed frontend domain.
4. Run `npm run build` and start with `npm start`.

### Frontend
1. Set `VITE_API_BASE_URL` to your production backend URL.
2. Run `npm run build`.
3. Serve the `/dist` directory via Nginx, Vercel, or Netlify.

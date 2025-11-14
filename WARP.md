# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Elora is a minimalist e-commerce platform for fashion enthusiasts with a monorepo structure containing a React/TypeScript frontend and Node.js/Express backend.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, TailwindCSS, Shadcn UI, Redux Toolkit
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT authentication
- **Payments**: PayPal integration
- **File Storage**: Cloudinary for image uploads

## Development Commands

### Root Level
```bash
# Install all dependencies (root, client, and server)
npm install
cd client && npm install
cd ../server && npm install
```

### Client (Frontend)
```bash
cd client

# Development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Lint TypeScript/React code
npm run lint

# Preview production build
npm run preview
```

### Server (Backend)
```bash
cd server

# Production mode
npm start

# Development mode with nodemon (auto-restart)
npm run dev
```

## Environment Configuration

### Backend (.env in server/)
Required environment variables (see `server/.env.example`):
- `PORT` - Server port (default: 3001)
- `MONGO_DB` - MongoDB connection string
- `MONGO_DB_NAME` - Database name
- `MONGO_USER` - MongoDB username
- `MONGO_PASSWORD` - MongoDB password
- `JWT_SECRET_KEY` - Secret for JWT signing
- `JWT_EXPIRES_IN` - Token expiration time
- `JWT_ALGORITHM` - JWT algorithm (e.g., HS256)
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `NODE_ENV` - Environment (development/production/test)

### Frontend (client root)
- `VITE_API_URL` - Backend API URL (default: http://localhost:5173 for dev)

## Architecture

### Backend Architecture (server/)

**MVC Pattern with Express**
- `server.js` - Entry point, MongoDB connection, server lifecycle
- `index.js` - Express app configuration, middleware setup, route registration

**Directory Structure:**
- `config/` - Environment configuration (JWT, Cloudinary)
- `controllers/` - Business logic handlers
- `middlewares/auth/` - JWT authentication middleware (`authMiddleware`)
- `models/` - Mongoose schemas (User, Product, Cart, Order, Address, Review, Feature)
- `routes/` - API route definitions organized by domain:
  - `auth/` - Authentication (register, login, logout, check-auth)
  - `admin/` - Admin operations (products, orders)
  - `shop/` - Shop operations (products, cart, orders, reviews, search)
  - `address/` - User address management
  - `common/` - Feature flags/common resources

**Authentication Flow:**
- JWT tokens stored in HTTP-only cookies
- `authMiddleware` verifies token and attaches user to `req.user`
- Role-based access: `user` vs `admin` roles in User model

**CORS Configuration:**
- Allows requests from `http://localhost:5173` (dev) and production URL
- Credentials enabled for cookie-based auth

### Frontend Architecture (client/)

**React SPA with React Router v7**
- `main.tsx` - Entry point, Redux Provider setup
- `App.tsx` - Router configuration with protected routes

**Directory Structure:**
- `src/api/` - Axios configuration with interceptors
- `src/store/` - Redux Toolkit slices:
  - `store.ts` - Root store configuration
  - `auth-slice/` - Authentication state (login, register, logout, checkAuth)
  - `admin/` - Admin-specific slices (products, orders)
  - `shop/` - Shopping slices (cart, products, address, search, reviews)
  - `order-slice/` - Order management
- `src/pages/` - Route components organized by feature:
  - `auth/` - Login, Register
  - `admin-view/` - Dashboard, Products, Orders, Features
  - `shopping-view/` - Home, Listing, Checkout, Account, Search, PayPal flows
- `src/components/` - Reusable UI components:
  - `auth/` - Auth layout
  - `admin-view/` - Admin-specific components
  - `shopping-view/` - Shopping UI components
  - `common/` - Shared components (check-auth, form, star-rating, footer)
  - `ui/` - Shadcn UI primitives
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utility functions
- `src/config/` - Configuration files

**State Management:**
- Redux Toolkit with async thunks for API calls
- All API calls use configured axios instance with baseURL and credentials
- Authentication state checked on app initialization via `checkAuth` action

**Routing Strategy:**
- Three main route groups: `/auth`, `/admin`, `/shop`
- `CheckAuth` wrapper component handles route protection based on:
  - Authentication status (`isAuthenticated`)
  - User role (`user.role`)
- Unauthorized access redirects to `/unauth-page`

**Path Aliases:**
- `@/` resolves to `client/src/` (configured in vite.config.ts)

### API Communication

**Base Configuration:**
- Axios instance configured in `src/api/config.ts`
- Default baseURL from `VITE_API_URL` env variable
- Credentials enabled globally for cookie-based auth
- All Redux async thunks use this configured axios instance

**API Endpoint Structure:**
- `/api/auth/*` - Authentication endpoints
- `/api/admin/products/*` - Admin product management
- `/api/admin/orders/*` - Admin order management
- `/api/shop/products/*` - Shop product browsing
- `/api/shop/cart/*` - Shopping cart operations
- `/api/shop/order/*` - Order processing
- `/api/shop/address/*` - Address management
- `/api/shop/search/*` - Product search
- `/api/shop/review/*` - Product reviews
- `/api/common/feature/*` - Feature management

## Key Development Patterns

### Adding New Features

**Backend:**
1. Create Mongoose model in `server/models/`
2. Create controller in `server/controllers/`
3. Create routes in `server/routes/`
4. Register routes in `server/index.js`

**Frontend:**
1. Create Redux slice in `src/store/`
2. Add slice to store in `src/store/store.ts` (reducer + RootState interface)
3. Create page component in `src/pages/`
4. Add route in `src/App.tsx`
5. Create reusable components in `src/components/`

### Authentication

- Backend: JWT middleware checks cookies, verifies token, attaches user to request
- Frontend: `checkAuth` dispatched on app load, sets auth state in Redux
- Protected routes use `CheckAuth` component wrapper for authorization

### File Uploads

- Uses Cloudinary for image storage
- Multer middleware handles multipart form data
- Configuration in `server/config/env.config.js`

### PayPal Integration

- PayPal SDK integrated in client
- Success/return pages handle payment completion callbacks
- Order processing includes payment verification

## Code Style

### Frontend
- TypeScript strict mode enabled
- ESLint configuration in `eslint.config.js`
- React hooks rules enforced
- Tailwind CSS for styling with class variance authority
- Functional components with hooks (no class components)

### Backend
- CommonJS module system
- Error handling via Express error middleware
- Async/await for database operations
- Cookie-based JWT authentication

---

## Additional Documentation

### Data Flow & Architecture
For comprehensive documentation on how data flows through the application, see **`DATA_FLOW.md`**:
- Detailed request/response cycles for all major features
- State management patterns and Redux data flow
- Database relationships and query patterns
- Complete user journey scenarios (browsing to purchase, admin workflows)
- Performance considerations and optimization opportunities
- **Future improvement recommendations** with prioritized implementation phases
- Migration guide for upgrading the application

### Key Sections in DATA_FLOW.md:
- Frontend data flow patterns (Redux, API communication)
- Backend request lifecycle and middleware chain
- Authentication and authorization flows
- Cart, order, and payment processing workflows
- Database operations and Mongoose patterns
- Comprehensive upgrade roadmap (RTK Query, caching, testing, monitoring, etc.)

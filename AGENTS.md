# Elora - Agent Guidelines

This document provides guidelines for agentic coding agents operating in the Elora repository.

## Project Overview

Elora is a minimalist e-commerce platform built with:
- **Frontend**: React 19, TypeScript, Vite, TailwindCSS, Shadcn/UI, Redux Toolkit
- **Backend**: Node.js, Express, MongoDB (Mongoose), Cloudinary
- **Payments**: PayPal integration
- **Deployment**: Vercel (frontend), Render (backend)

## Quick Start

### Installation

```bash
# Root dependencies (only vite-plugin-eslint)
npm install

# Client dependencies
cd client && npm install

# Server dependencies
cd server && npm install
```

### Development Commands

**Client (cd client):**
- `npm run dev` - Start Vite development server (http://localhost:5173)
- `npm run build` - Type-check with tsc and build for production
- `npm run lint` - Run ESLint on all TypeScript/TSX files
- `npm run preview` - Preview production build locally

**Server (cd server):**
- `npm run dev` - Start Nodemon development server (http://localhost:3001)
- `npm start` - Start production server with Node
- `npm test` - Placeholder (no tests configured)

### Running a Single Test

No test framework is currently configured. To add tests:
1. Install Jest/Vitest for client and backend
2. Configure test scripts in package.json
3. Add test files alongside components (e.g., `*.test.tsx`)

## Code Style Guidelines

### TypeScript & Types

- Strict mode is enabled in `client/tsconfig.app.json`
- Use interfaces for object shapes (see `client/src/types.ts`)
- Avoid `any` types - use `unknown` or proper type definitions
- Export shared types from `client/src/types.ts`
- Enable `noUnusedLocals` and `noUnusedParameters` in development

### Imports & Path Aliases

- Use `@/` alias for client src imports: `@/components/ui/button`
- Absolute imports with file extensions: `import X from "./utils.ts"`
- Import order grouping:
  1. React imports
  2. Third-party libraries
  3. Components
  4. Config files
  5. Utils/Hooks
  6. Store/Slice imports

Example from `client/src/pages/auth/Login.tsx`:
```typescript
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { loginUser } from "@/store/auth-slice";
```

### React Components

- Use functional components with React hooks
- Use `React.forwardRef` for components accepting refs (see Button)
- Use `class-variance-authority` for component variants
- Base components on Shadcn UI, extend with custom variants
- Component files use PascalCase: `AuthLogin.tsx`

### TailwindCSS & Styling

- Follow Shadcn "new-york" style configured in `components.json`
- Use CSS variables for theming: `hsl(var(--background))`
- Use `cn()` utility from `@/lib/utils` for class merging:
```typescript
import { cn } from "@/lib/utils";
// ...
className={cn(buttonVariants({ variant, size, className }))}
```
- Avoid custom CSS - extend Tailwind theme in `tailwind.config.js`

### Redux State Management

- Use Redux Toolkit with `createSlice` pattern
- Define RootState interface in `client/src/store/store.ts`
- Export `AppDispatch` type for typed dispatch hooks
- Slice structure: `src/store/{feature}/index.ts`
- Store organization: auth, admin, shop, common slices

### Backend Patterns (Node/Express)

- Use CommonJS modules (`require()` syntax) for server
- Mongoose models with Schema definition and timestamps
- Async/await with try-catch error handling
- Consistent response format: `{ message: string, ...data }`
- Use Cloudinary for file uploads

### Naming Conventions

- **Files**: kebab-case (`cart-slice.ts`, `product-routes.js`)
- **Components**: PascalCase (`AuthLogin.tsx`, `Button.tsx`)
- **Functions/Variables**: camelCase (`isAuthenticated`, `getCart`)
- **Constants**: UPPER_SNAKE_CASE
- **Classes**: PascalCase
- **Routes**: kebab-case (`/api/shop/products`, `/api/admin/orders`)

### Error Handling

- Server: Try-catch blocks with console.error + proper HTTP status responses
- Client: Toast notifications via `useToast` hook
- Never expose stack traces in production
- Handle async Redux thunks with `.then()` and `.catch()`

### Database & API

- MongoDB with Mongoose ODM
- REST API routes under `/api/` prefix
- Authentication via JWT tokens
- Payment processing via PayPal SDK
- File uploads via Cloudinary

### Environment Variables

**Client:** Use `VITE_` prefix for env vars
**Server:** Standard variables (see `server/.env.example`)
- Never commit `.env` files to version control
- Use `.env.example` for template

### Before Committing

1. Run `npm run build` in client to check TypeScript errors
2. Run `npm run lint` in client to check code quality
3. Ensure no console.log statements in production code
4. Use descriptive commit messages
5. Create feature branches for changes
6. Never force push to main

## File Structure

```
elora/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── ui/          # Shadcn UI components
│   │   │   ├── auth/        # Auth-related components
│   │   │   ├── admin-view/  # Admin dashboard components
│   │   │   ├── shopping-view/ # Shopping components
│   │   │   └── common/      # Shared components
│   │   ├── pages/           # Route pages
│   │   │   ├── auth/        # Login, Register
│   │   │   ├── admin-view/  # Dashboard, Products, Orders
│   │   │   └── shopping-view/ # Home, Listing, Checkout
│   │   ├── store/           # Redux slices
│   │   │   ├── auth-slice/
│   │   │   ├── admin/
│   │   │   └── shop/
│   │   ├── lib/             # Utilities (utils.ts)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── config/          # Form configs, constants
│   │   └── api/             # API configuration
│   └── ...config files
├── server/                   # Express backend
│   ├── models/              # Mongoose models
│   ├── controllers/         # Route controllers
│   ├── routes/              # Express routes
│   ├── middlewares/         # Custom middleware
│   ├── services/            # Business logic
│   ├── utils/               # Server utilities
│   └── config/              # Server configuration
└── README.md
```

## Additional Notes

- The project uses both TypeScript (client) and JavaScript (server)
- CORS is configured for localhost:5173 and production Vercel deployments
- PayPal supports "demo", "sandbox", and "live" modes
- Health check endpoint available at `/api/health`

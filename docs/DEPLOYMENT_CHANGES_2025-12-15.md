# Elora Deployment Changes (Vercel + Render)
Date: December 15, 2025 (with final commits shortly after midnight local time)

## Goal
Deploy **Option 1** from `docs/DEPLOYMENT_GUIDE.md`: 
- Frontend: Vercel
- Backend: Render

Primary objectives:
- Get successful production builds and deploys
- Fix cross-domain authentication (Vercel ↔ Render)
- Add a simple health endpoint for smoke testing
- Fix TypeScript build errors blocking Vercel builds

## High-level outcomes
- Vercel frontend deployed successfully.
- Render backend deployed successfully.
- `GET /api/health` returns a valid health payload (example):
  - `{ "ok": true, "uptime": ..., "timestamp": ... }`
- Login and protected route flow verified.

## Deployment configuration changes
### Render environment
Added/confirmed:
- `CLIENT_URL=https://<your-vercel-app-domain>`
  - Used by backend CORS allowlist in `server/index.js`
- `NODE_ENV=production`
- Standard backend secrets (MongoDB, JWT, Cloudinary)
- `PAYMENT_MODE=demo`

### Vercel environment
Added/confirmed:
- `VITE_API_URL=https://<your-render-service-domain>`

## Code changes (by area)

### 1) Backend: production cookie auth + health endpoint
Files:
- `server/controllers/auth/authController.js`
- `server/index.js`

Changes:
- Hardened auth cookie settings for production cross-domain deployments:
  - `secure: true` when `NODE_ENV=production`
  - `sameSite: "none"` when `NODE_ENV=production`
  - Added `maxAge` for persistence
- Logout now clears the cookie using matching attributes so it reliably clears in browsers.
- Added `GET /api/health` endpoint for smoke testing and platform health checks.

Why:
- Vercel and Render are different domains, so browser cookie rules require:
  - `SameSite=None` + `Secure=true` for cookies to be sent on XHR/fetch requests.
- The health endpoint provides a fast way to confirm the service is live.


### 2) Backend: auth middleware correctness
File:
- `server/middlewares/auth/authMiddleware.js`

Changes:
- Fixed an auth bug caused by JWT payload field mismatch:
  - JWT payload uses `id`
  - middleware previously attempted `decoded._id`
- Middleware now:
  - Accepts token from either:
    - Cookie (`req.cookies.token`) for browser auth
    - `Authorization: Bearer <token>` fallback (useful if cookies are blocked)
  - Normalizes user id: `decoded.id || decoded._id`
  - Validates that the user still exists in the DB

Why:
- The frontend calls `/api/auth/check-auth` on load; if middleware rejects a valid token, users get logged out on refresh.


### 3) Backend: login response hardening
File:
- `server/controllers/auth/authController.js`

Changes:
- Removed the JWT `token` from the JSON login response.
- Continued to set the JWT as an **HTTP-only cookie**.

Why:
- Cookie-based auth does not require returning a token to the client.
- Returning tokens in JSON increases the chance of accidental exposure (logs, screenshots, copy/paste, etc.).

Notes:
- Keeping minimal user data in the response (e.g. `id`, `role`, `userName`, optionally `email`) is fine.


### 4) Frontend: TypeScript build fixes for Vercel
Files:
- `client/src/components/shopping-view/cart-wrapper.tsx`
- `client/src/components/shopping-view/cart-items-container.tsx`
- `client/src/components/shopping-view/product-details.tsx`
- `client/src/pages/auth/Login.tsx`
- `client/src/pages/auth/Register.tsx`
- `client/src/store/shop/address-slice/index.ts`
- `client/src/store/shop/cart-slice/index.ts`
- `client/src/types.ts`

Main issues fixed:
- TS unused variable errors (TS6133): removed unused imports/vars and unused `catch` params.
- Cart typing mismatch:
  - Backend returns a cart object with `items`, not an array at the top-level.
  - Implemented stronger typing in the cart slice and a `normalizeCart()` helper.
- Optional fields:
  - Made `salePrice` optional on `CartItem` and updated price calculations to safely handle missing values.

Result:
- `npm run build` in `client/` succeeds.


## Verification / Smoke tests performed
Recommended checks (used during deployment):
- Backend health:
  - `GET https://<render-service>/api/health` → `{ ok: true, ... }`
- Login:
  - `POST /api/auth/login` returns success
  - Browser receives an HTTP-only cookie named `token`
- Auth persistence:
  - Refresh the page and confirm `/api/auth/check-auth` stays `200` and session persists
- Protected route:
  - Verify navigation to protected pages (e.g. `/shop/checkout`) works as expected after login


## Relevant commits
(From `git log -5 --oneline`)
- `441dd60` Fix prod auth cookies + add health endpoint
- `50db8a7` Fix TS build errors for Vercel deploy
- `0b3d2b6` Fix auth middleware (use payload id + allow bearer token)
- `e1ce62d` login controller payload change
- `a04ec80` loggin controller update


## Security notes / follow-ups
- Seeing `{ email, password }` in the login request payload is normal for password-based auth.
  - The key requirement is HTTPS (Vercel/Render provide this by default) and avoiding credential logging.
- If a JWT token was ever pasted into chat/logs/screenshots, consider rotating `JWT_SECRET_KEY` in Render to invalidate existing tokens.


## Known build warnings
- Vite chunk size warning (bundle > 500kB after minification) was reported during build.
  - Not a deployment blocker.
  - Optional future improvement: route-level code splitting or manual chunking.

## Troubleshooting
### 1) CORS errors
Symptoms:
- Browser console shows "CORS policy" errors.
- Requests to Render fail before reaching your route handlers.

Checks:
- Render env: `CLIENT_URL` must match your deployed Vercel domain exactly (including `https://`).
- Backend should be redeployed after updating env vars.

Notes:
- `server/index.js` also allows any `*.vercel.app` origin (preview deploys), but your primary domain should still be in `CLIENT_URL`.

### 2) Login succeeds but user becomes logged out after refresh
Symptoms:
- `POST /api/auth/login` returns success.
- Refreshing the page triggers `GET /api/auth/check-auth` which returns `401`.

Checks:
- Confirm `Set-Cookie` is present on login response.
- Confirm the cookie is stored (DevTools → Application → Cookies) and is:
  - `HttpOnly`
  - `Secure` (in production)
  - `SameSite=None` (in production)
- Confirm `/api/auth/check-auth` returns `200`.

Relevant code:
- Cookie settings: `server/controllers/auth/authController.js`
- Middleware decoding: `server/middlewares/auth/authMiddleware.js`

### 3) Cookie not being set / sent (common with cross-domain deployments)
Symptoms:
- Login returns success but subsequent requests behave as unauthenticated.

Checks:
- `NODE_ENV=production` on Render (this enables secure cookie behavior).
- `axios` requests use `withCredentials: true`.
- Browser is not blocking third-party cookies (some privacy settings/extensions can interfere).

### 4) Render cold starts (free tier)
Symptoms:
- First request after inactivity is very slow.

Mitigations:
- Accept it for demo/portfolio use.
- Optionally add an uptime ping (external monitor hitting `/api/health`).
- Consider upgrading Render plan or moving backend to Railway.

### 5) Vercel build failures (TypeScript)
Symptoms:
- Vercel build fails with TS errors like TS6133 / type mismatches.

Fix strategy:
- Run locally: `npm --prefix ./client run build`
- Address type mismatches in Redux state shapes (cart was the main one).

## Rollback / Recovery
### Rollback backend deployment (Render)
Options:
- Use Render dashboard "Rollback" (if available for your plan) to redeploy a previous successful build.
- Or revert the commit(s) in Git and push to trigger a redeploy.

### Rollback frontend deployment (Vercel)
Options:
- Use Vercel "Deployments" to redeploy a previous successful deployment.
- Or revert commit(s) and push.

### Emergency auth reset
If you suspect a JWT was exposed:
- Rotate `JWT_SECRET_KEY` in Render.
- Redeploy backend.
- This invalidates existing sessions and forces users to log in again.

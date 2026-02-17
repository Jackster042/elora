# Elora

My first full-stack application exploring React/Node.js patterns.
Built to understand e-commerce flows before learning distributed systems.

⚠️ **Note**: Payment integration uses basic SDK without idempotency
or distributed transactions (see [Interview Assistant] for production-grade architecture).

![Elora Banner](client/src/assets/banner-1.webp)

## ✨ Features

### Customer Features

- **User Authentication** - Secure JWT-based login and registration
- **Product Browsing** - Browse products by category, brand, and price
- **Product Search** - Full-text search with filters
- **Shopping Cart** - Persistent cart management
- **Checkout Flow** - Seamless checkout with address management
- **PayPal Payments** - Payment integration demo
- **Order Tracking** - View order history and status
- **Product Reviews** - Rate and review purchased products

### Admin Features

- **Dashboard** - Overview of orders and sales
- **Product Management** - CRUD operations for products with image uploads
- **Order Management** - View and update order statuses
- **Feature Management** - Manage homepage featured items
- **Cloudinary Integration** - Image upload and management

## 🛠️ Tech Stack

### Frontend

| Technology      | Purpose          |
| --------------- | ---------------- |
| React 19        | UI Library       |
| TypeScript      | Type Safety      |
| Vite            | Build Tool       |
| TailwindCSS     | Styling          |
| Shadcn/UI       | UI Components    |
| Redux Toolkit   | State Management |
| React Router v7 | Navigation       |
| Lucide React    | Icons            |

### Backend

| Technology | Purpose          |
| ---------- | ---------------- |
| Node.js    | Runtime          |
| Express.js | Web Framework    |
| MongoDB    | Database         |
| Mongoose   | ODM              |
| JWT        | Authentication   |
| Cloudinary | Image Storage    |
| PayPal SDK | Payments         |
| bcryptjs   | Password Hashing |

## 📁 Project Structure

```
elora/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/       # React Components
│   │   │   ├── ui/          # Shadcn UI Components
│   │   │   ├── auth/        # Auth Layout
│   │   │   ├── admin-view/  # Admin Components
│   │   │   ├── shopping-view/# Shopping Components
│   │   │   └── common/      # Shared Components
│   │   ├── pages/           # Route Pages
│   │   │   ├── auth/        # Login, Register
│   │   │   ├── admin-view/  # Dashboard, Products, Orders, Features
│   │   │   └── shopping-view/# Home, Listing, Checkout, Account
│   │   ├── store/           # Redux Slices
│   │   ├── lib/             # Utilities
│   │   ├── hooks/           # Custom Hooks
│   │   └── config/          # Form Configurations
│   └── package.json
├── server/                   # Express Backend
│   ├── models/              # Mongoose Models
│   ├── controllers/         # Route Controllers
│   ├── routes/              # Express Routes
│   ├── middlewares/         # Custom Middleware
│   ├── services/            # Business Logic
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- MongoDB instance (local or cloud)
- Cloudinary account (for image uploads)
- PayPal Developer account (optional, for payments)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd elora
   ```

2. **Install root dependencies**

   ```bash
   npm install
   ```

3. **Install client dependencies**

   ```bash
   cd client && npm install
   ```

4. **Install server dependencies**

   ```bash
   cd ../server && npm install
   ```

5. **Set up environment variables**

   Create a `.env` file in the `server` directory:

   ```env
   PORT=3001
   MONGO_DB=mongodb://localhost:27017/elora
   MONGO_DB_NAME=elora

   JWT_SECRET_KEY=your_jwt_secret
   JWT_EXPIRES_IN=1d
   JWT_ALGORITHM=HS256

   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Payment Mode: "demo" | "sandbox" | "live"
   PAYMENT_MODE=demo

   # PayPal (required for sandbox/live modes)
   PAY_PAL_MODE=sandbox
   PAY_PAL_CLIENT_ID=your_paypal_client_id
   PAY_PAL_CLIENT_SECRET=your_paypal_client_secret

   NODE_ENV=development
   ```

### Running the Application

**Development Mode:**

1. **Start the server** (from `server` directory):

   ```bash
   npm run dev
   ```

   Server runs at: http://localhost:3001

2. **Start the client** (from `client` directory):
   ```bash
   npm run dev
   ```
   Client runs at: http://localhost:5173

**Production Mode:**

1. **Build the client**:

   ```bash
   cd client && npm run build
   ```

2. **Start the server**:
   ```bash
   cd server && npm start
   ```

## 📡 API Endpoints

### Authentication

| Method | Endpoint               | Description       |
| ------ | ---------------------- | ----------------- |
| POST   | `/api/auth/register`   | Register new user |
| POST   | `/api/auth/login`      | Login user        |
| GET    | `/api/auth/check-auth` | Verify JWT token  |
| POST   | `/api/auth/logout`     | Logout user       |

### Products (Shop)

| Method | Endpoint                     | Description       |
| ------ | ---------------------------- | ----------------- |
| GET    | `/api/shop/products/get`     | Get all products  |
| GET    | `/api/shop/products/get/:id` | Get product by ID |
| GET    | `/api/shop/products/search`  | Search products   |

### Cart

| Method | Endpoint                                   | Description      |
| ------ | ------------------------------------------ | ---------------- |
| GET    | `/api/shop/cart/get/:userId`               | Get user cart    |
| POST   | `/api/shop/cart/add`                       | Add to cart      |
| PUT    | `/api/shop/cart/update-cart-item`          | Update cart item |
| DELETE | `/api/shop/cart/delete/:userId/:productId` | Remove from cart |

### Orders (Shop)

| Method | Endpoint                       | Description            |
| ------ | ------------------------------ | ---------------------- |
| GET    | `/api/shop/orders/get/:userId` | Get user orders        |
| POST   | `/api/shop/orders/create`      | Create order           |
| POST   | `/api/shop/orders/capture`     | Capture PayPal payment |

### Address

| Method | Endpoint                        | Description        |
| ------ | ------------------------------- | ------------------ |
| GET    | `/api/shop/address/get/:userId` | Get user addresses |
| POST   | `/api/shop/address/add`         | Add address        |
| PUT    | `/api/shop/address/update/:id`  | Update address     |
| DELETE | `/api/shop/address/delete/:id`  | Delete address     |

### Admin Products

| Method | Endpoint                         | Description      |
| ------ | -------------------------------- | ---------------- |
| GET    | `/api/admin/products/get`        | Get all products |
| POST   | `/api/admin/products/add`        | Add product      |
| PUT    | `/api/admin/products/edit/:id`   | Edit product     |
| DELETE | `/api/admin/products/delete/:id` | Delete product   |

### Admin Orders

| Method | Endpoint                        | Description         |
| ------ | ------------------------------- | ------------------- |
| GET    | `/api/admin/orders/get`         | Get all orders      |
| GET    | `/api/admin/orders/details/:id` | Get order details   |
| PUT    | `/api/admin/orders/update/:id`  | Update order status |

## 🎨 UI Components

Elora uses [Shadcn/UI](https://ui.shadcn.com/) components with custom styling:

- **Avatar** - User avatars
- **Badge** - Status indicators
- **Button** - Various button variants
- **Card** - Content containers
- **Checkbox** - Form checkboxes
- **Dialog** - Modal dialogs
- **Dropdown Menu** - Navigation menus
- **Input** - Form inputs
- **Select** - Dropdown selects
- **Skeleton** - Loading states
- **Tabs** - Tab navigation
- **Toast** - Notifications

## 💳 Payment Modes

⚠️ **Note**: Payment integration uses basic SDK without idempotency
or distributed transactions (see [Interview Assistant](https://github.com/Jackster042/certum-ai) for production-grade architecture).

The application supports three payment modes configured via `PAYMENT_MODE`:

| Mode      | Description                        | Use Case                       |
| --------- | ---------------------------------- | ------------------------------ |
| `demo`    | Mock payment, no real transactions | Development, demos, portfolios |
| `sandbox` | PayPal sandbox environment         | Testing with PayPal            |
| `live`    | Production PayPal payments         | Real transactions              |

## 🔐 Environment Variables

### Client (`.env` in client directory)

```env
VITE_API_URL=http://localhost:3001/api
```

### Server (`.env` in server directory)

See the `.env.example` file in the server directory for all required variables.

## 🧪 Development Commands

**Client:**

```bash
cd client
npm run dev       # Start dev server
npm run build     # Build for production
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

**Server:**

```bash
cd server
npm run dev       # Start with nodemon
npm start         # Start production server
```

## 📱 Screenshots

_Screenshots temporarily removed - updating with new UI soon_

## 🚢 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy

### Backend (Render)

1. Push code to GitHub
2. Create new Web Service on Render
3. Set environment variables
4. Deploy

### Database (MongoDB Atlas)

1. Create cluster on MongoDB Atlas
2. Configure network access
3. Get connection string
4. Add to environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow existing TypeScript patterns
- Use the `cn()` utility for class merging
- Maintain consistent import order
- Write descriptive commit messages

## 🎓 Lessons Learned

Building Elora taught me:

- **Database transactions matter**: Race conditions in inventory taught me to use MongoDB sessions
- **Payment state machines**: The difference between "created" and "captured" requires idempotency keys
- **Type safety**: Migrating from JavaScript to TypeScript caught bugs I didn't know I had

---

<p align="center">Built with ❤️ using React, TypeScript, and Node.js</p>

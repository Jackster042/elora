# Elora

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)]
[![Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://elora.vercel.app)

**A minimalist e-commerce platform for fashion enthusiasts.**  
Elora offers a seamless shopping experience with a focus on UX, global payments via PayPal, and a highly functional cart system.

---

## ✨ Features

- **Minimalist UI**: Clean design for effortless navigation.
- **Global Payments**: PayPal integration for worldwide access.
- **Smart Cart**: Real-time updates, saved sessions, and wishlist support.
- **Responsive**: Works on all devices (mobile/desktop).

---

## 🛠️ Tech Stack

- **Frontend**: React.js, TypeScript, TailwindCSS, Shadcn
- **Backend**: Node.js, Express
- **Database**: MongoDB (with Mongoose ODM)
- **Deployment**: Vercel/Netlify, GitHub Actions (CI/CD)

---

## 🚀 Installation

### Prerequisites

- Node.js `v18+`
- MongoDB Atlas (or local instance)
- PayPal Developer Account (for payments)

### Steps

1. Clone the repo:

   ```bash
   git clone https://github.com/Jackster042/elora.git
   cd elora

   ```

2. Install dependencies:
   npm install
   cd client && npm install

3. Set up environment variables (see Configuration).

---

### ⚙️ Configuration

Create a .env file in the root directory with:

# Backend

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PAYPAL_CLIENT_ID=your_paypal_client_id

# Frontend (if using Vercel)

VITE_API_BASE_URL=http://localhost:5000/api

---

### 📋 Usage

Start the backend: npm run server

Start the frontend: npm run client

Access the app at http://localhost:3000.

---

### 📚 API Documentation

For detailed endpoints, refer to:

Postman Collection (file to be attached later)

---

### 🧪 Testing

Run Postman tests:

Import the Postman collection from docs/.

Execute unit/functional tests via Newman or Postman Runner.

---

### 📜 License

MIT © 2025 [Nemanja Stojanovic](https://github.com/Jackster042)

---

### 🌟 Roadmap (v2)

Stripe integration as a payment alternative.

User reviews/ratings system.

AI-powered recommendation engine.

---

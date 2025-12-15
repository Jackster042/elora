const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

const app = express();

// ROUTES
const authRoutes = require("./routes/auth/auth-routes");
const adminRoutes = require("./routes/admin/productRoutes");
const adminOrderRoutes = require("./routes/admin/orderRoutes");

const cartRoutes = require("./routes/cart/cartRoutes");
const shopRoutes = require("./routes/shop/productRoutes");
const orderRoutes = require("./routes/shop/orderRoutes");
const addressRoutes = require("./routes/address/addressRoutes");
const searchRoutes = require("./routes/shop/searchRoutes");
const reviewRoutes = require("./routes/shop/reviewRoutes");

const featureRoutes = require("./routes/common/featureRoutes");

// MIDDLEWARES
// Dynamic CORS configuration for development and production
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:3001",
  process.env.CLIENT_URL, // Will be set in production
].filter(Boolean); // Remove undefined values

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);

      // Check if origin is in allowed list or matches Vercel preview deployments
      if (allowedOrigins.indexOf(origin) !== -1 || origin.includes("vercel.app")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "X-Requested-With",
      "Accept",
    ],
    exposedHeaders: ["Authorization"],
  })
);

// Explicitly handle OPTIONS requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.options("*", cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check (useful for Render + smoke tests)
app.get("/api/health", (req, res) => {
  return res.status(200).json({
    ok: true,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/admin/products", adminRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

app.use("/api/shop/products", shopRoutes);
app.use("/api/shop/cart", cartRoutes);
app.use("/api/shop/address", addressRoutes);
app.use("/api/shop/order", orderRoutes);
app.use("/api/shop/search", searchRoutes);
app.use("/api/shop/review", reviewRoutes);

app.use("/api/common/feature", featureRoutes);

// 404 HANDLER
app.use("*", (req, res, next) => {
  return next(new Error(`Page ${req.originalUrl} not found`, 404));
});

// ERROR HANDLER
app.use((err, req, res, next) => {
  return res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;

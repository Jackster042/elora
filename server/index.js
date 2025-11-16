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
app.use(
  cors({
    origin: ["https://e-store-client.onrender.com", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control", // Explicitly allow Cache-Control
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

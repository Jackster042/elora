const { Router } = require("express");
const router = Router();

const {
  addToCart,
  getCart,
  updateQuantity,
  removeFromCart,
} = require("../../controllers/shop/cartController");

const { cartOperationsLimiter } = require("../../middleware/rateLimiter");

// Apply rate limiting to cart operations
router.post("/add", cartOperationsLimiter, addToCart);
router.put("/update-cart", cartOperationsLimiter, updateQuantity);
router.get("/get/:userId", getCart);
router.delete("/:userId/:productId", cartOperationsLimiter, removeFromCart);

module.exports = router;

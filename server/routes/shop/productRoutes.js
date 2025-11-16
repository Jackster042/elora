const { Router } = require("express");
const router = Router();

const {
  getFilteredProducts,
  getProductDetails,
} = require("../../controllers/shop/shopController");

const { guestBrowsingLimiter } = require("../../middleware/rateLimiter");

// Apply rate limiting to product browsing
router.get("/get", guestBrowsingLimiter, getFilteredProducts);
router.get("/get/:id", guestBrowsingLimiter, getProductDetails);

module.exports = router;

const { Router } = require("express");
const router = Router();

const {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
} = require("../../controllers/shop/orderController");

const {
  validateCartBeforeCheckout,
  validateCartSize,
  sanitizeCartInput,
} = require("../../middleware/cartValidation");

// Apply validation middleware before order creation
router.post(
  "/create",
  sanitizeCartInput,
  validateCartSize,
  validateCartBeforeCheckout,
  createOrder
);
router.post("/capture", capturePayment);
router.get("/list/:userId", getAllOrdersByUser);
router.get("/details/:id", getOrderDetails);

module.exports = router;

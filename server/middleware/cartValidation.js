const ProductModel = require("../models/ProductModels");

/**
 * Validates cart items before checkout
 * - Checks if products exist
 * - Verifies stock availability
 * - Recalculates prices from server (never trust client)
 * - Ensures data integrity
 */
const validateCartBeforeCheckout = async (req, res, next) => {
  try {
    const { cartItems } = req.body;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty or invalid",
      });
    }

    // Validate each cart item
    const validatedItems = [];
    const errors = [];

    for (const item of cartItems) {
      // Check if product exists
      const product = await ProductModel.findById(item.productId);

      if (!product) {
        errors.push({
          productId: item.productId,
          message: "Product not found or no longer available",
        });
        continue;
      }

      // Check stock availability
      if (product.totalStock < item.quantity) {
        errors.push({
          productId: item.productId,
          title: product.title,
          message: `Only ${product.totalStock} items available in stock`,
          requestedQuantity: item.quantity,
          availableStock: product.totalStock,
        });
        continue;
      }

      // Recalculate price from server (NEVER trust client prices)
      const serverPrice = product.salePrice > 0 ? product.salePrice : product.price;
      
      // Validate item and use server prices
      validatedItems.push({
        productId: product._id,
        title: product.title,
        image: product.image,
        price: serverPrice, // Use server price, not client price
        quantity: item.quantity,
        totalStock: product.totalStock,
      });
    }

    // If there are errors, return them
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Some items in your cart are not available",
        errors,
        validatedItems, // Return items that passed validation
      });
    }

    // Recalculate total amount from server
    const totalAmount = validatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Attach validated data to request for use in controller
    req.validatedCart = {
      items: validatedItems,
      totalAmount,
    };

    next();
  } catch (error) {
    console.error("Cart validation error:", error);
    return res.status(500).json({
      success: false,
      message: "Error validating cart",
    });
  }
};

/**
 * Validates cart size to prevent abuse
 * Limits number of items and total quantity
 */
const validateCartSize = (req, res, next) => {
  const MAX_CART_ITEMS = 50; // Maximum different products
  const MAX_TOTAL_QUANTITY = 100; // Maximum total items

  try {
    const { cartItems } = req.body;

    if (!cartItems || !Array.isArray(cartItems)) {
      return next();
    }

    // Check number of different products
    if (cartItems.length > MAX_CART_ITEMS) {
      return res.status(400).json({
        success: false,
        message: `Cart cannot contain more than ${MAX_CART_ITEMS} different products`,
      });
    }

    // Check total quantity
    const totalQuantity = cartItems.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );

    if (totalQuantity > MAX_TOTAL_QUANTITY) {
      return res.status(400).json({
        success: false,
        message: `Cart cannot contain more than ${MAX_TOTAL_QUANTITY} total items`,
      });
    }

    next();
  } catch (error) {
    console.error("Cart size validation error:", error);
    next(); // Don't block on validation error
  }
};

/**
 * Sanitizes cart input to prevent injection attacks
 */
const sanitizeCartInput = (req, res, next) => {
  try {
    const { cartItems, userId } = req.body;

    // Basic sanitization
    if (userId && typeof userId === 'string') {
      req.body.userId = userId.trim();
    }

    if (cartItems && Array.isArray(cartItems)) {
      req.body.cartItems = cartItems.map(item => ({
        productId: String(item.productId).trim(),
        quantity: Math.max(1, Math.min(999, parseInt(item.quantity) || 1)),
        // Remove any unexpected fields
      }));
    }

    next();
  } catch (error) {
    console.error("Cart sanitization error:", error);
    next(); // Don't block on sanitization error
  }
};

module.exports = {
  validateCartBeforeCheckout,
  validateCartSize,
  sanitizeCartInput,
};

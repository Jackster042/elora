const rateLimit = require('express-rate-limit');

// Rate limiter for guest product browsing
// Allows guests to browse freely but prevents abuse
const guestBrowsingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  // Skip rate limiting for authenticated users (optional)
  skip: (req) => {
    // If you want to skip rate limiting for authenticated users
    return req.user !== undefined;
  },
});

// Stricter rate limiter for expensive operations
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit to 30 requests per window
  message: {
    success: false,
    message: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Very strict limiter for cart operations (add, update, remove)
const cartOperationsLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // 20 operations per minute
  message: {
    success: false,
    message: 'Too many cart operations, please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Authentication limiter to prevent brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 failed attempts per window
  message: {
    success: false,
    message: 'Too many login attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful requests
});

module.exports = {
  guestBrowsingLimiter,
  strictLimiter,
  cartOperationsLimiter,
  authLimiter,
};

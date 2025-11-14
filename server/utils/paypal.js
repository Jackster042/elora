const paypal = require("paypal-rest-sdk");

// PayPal configuration with fallback to sandbox mode for development
paypal.configure({
  mode: process.env.PAY_PAL_MODE || "sandbox", // Default to sandbox if not set
  client_id: process.env.PAY_PAL_CLIENT_ID || "test",
  client_secret: process.env.PAY_PAL_CLIENT_SECRET || "test",
});

module.exports = paypal;

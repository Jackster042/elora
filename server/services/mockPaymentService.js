/**
 * Mock Payment Service
 * Simulates PayPal payment flow for demo/portfolio purposes
 *
 * This service mimics PayPal API responses without making real API calls,
 * allowing the application to demonstrate full e-commerce functionality
 * in a portfolio/demo environment.
 */

const generateOrderId = () => {
  return `DEMO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const generatePaymentId = () => {
  return `PAY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

const generatePayerId = () => {
  return `DEMO-PAYER-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
};

class MockPaymentService {
  /**
   * Create a mock order (simulates PayPal order creation)
   * @param {Object} orderData - Order data including purchase_units, intent, etc.
   * @returns {Promise<Object>} - Mock order creation response
   */
  async createOrder(orderData) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const orderId = generateOrderId();

    console.log("[DEMO MODE] Creating mock PayPal order:", orderId);

    return {
      id: orderId,
      status: "CREATED",
      links: [
        {
          href: `http://demo-payment/${orderId}`,
          rel: "approve",
          method: "GET",
        },
        {
          href: `http://api/orders/${orderId}`,
          rel: "self",
          method: "GET",
        },
      ],
    };
  }

  /**
   * Capture a mock payment (simulates PayPal payment capture)
   * @param {string} orderId - The order ID to capture
   * @returns {Promise<Object>} - Mock capture response
   */
  async capturePayment(orderId) {
    // Simulate realistic API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulate failure scenario if orderId contains 'FAIL'
    if (orderId && orderId.includes("FAIL")) {
      console.log("[DEMO MODE] Simulating payment failure for:", orderId);

      return {
        id: orderId,
        status: "FAILED",
        error: {
          name: "PAYMENT_DECLINED",
          message: "Payment declined - Demo Mode",
          debug_id: `DEBUG-${Math.random().toString(36).substr(2, 9)}`,
        },
      };
    }

    const paymentId = generatePaymentId();
    const payerId = generatePayerId();

    console.log("[DEMO MODE] Capturing mock payment:", orderId);

    // Return structure similar to PayPal capture response
    return {
      id: orderId,
      status: "COMPLETED",
      purchase_units: [
        {
          reference_id: "default",
          payments: {
            captures: [
              {
                id: paymentId,
                status: "COMPLETED",
                amount: {
                  currency_code: "USD",
                  value: "0.00",
                },
                final_capture: true,
                create_time: new Date().toISOString(),
                update_time: new Date().toISOString(),
              },
            ],
          },
        },
      ],
      payer: {
        payer_id: payerId,
        email_address: "demo@example.com",
        name: {
          given_name: "Demo",
          surname: "User",
        },
      },
      create_time: new Date().toISOString(),
      update_time: new Date().toISOString(),
    };
  }

  /**
   * Get mock order details
   * @param {string} orderId - The order ID to retrieve
   * @returns {Promise<Object>} - Mock order details
   */
  async getOrderDetails(orderId) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    console.log("[DEMO MODE] Fetching mock order details:", orderId);

    return {
      id: orderId,
      status: "CREATED",
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: "default",
          amount: {
            currency_code: "USD",
            value: "0.00",
          },
        },
      ],
      create_time: new Date().toISOString(),
      links: [
        {
          href: `http://demo-payment/${orderId}`,
          rel: "approve",
          method: "GET",
        },
      ],
    };
  }
}

module.exports = new MockPaymentService();

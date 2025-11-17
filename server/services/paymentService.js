/**
 * Payment Service Facade
 *
 * This service provides a unified interface for payment processing,
 * automatically switching between mock (demo) and real PayPal integration
 * based on the PAYMENT_MODE environment variable.
 *
 * Usage:
 * - Set PAYMENT_MODE=demo for portfolio/demo deployments
 * - Set PAYMENT_MODE=sandbox for development with real PayPal sandbox
 * - Set PAYMENT_MODE=live for production (not recommended for portfolio)
 */

const paypal = require("../utils/paypal");
const mockPaymentService = require("./mockPaymentService");

const PAYMENT_MODE = process.env.PAYMENT_MODE || "sandbox";

class PaymentService {
  constructor() {
    this.mode = PAYMENT_MODE;
    console.log(
      `[PaymentService] Initialized in ${this.mode.toUpperCase()} mode`
    );
  }

  /**
   * Get the appropriate payment service based on mode
   * @returns {Object} - Payment service instance (mock or real)
   */
  getService() {
    return this.mode === "demo" ? mockPaymentService : paypal;
  }

  /**
   * Create a payment
   * @param {Object} paymentData - Payment data for PayPal
   * @returns {Promise<Object>} - Payment creation response with approvalURL and isDemo flag
   */
  async createPayment(paymentData) {
    if (this.mode === "demo") {
      console.log("[DEMO MODE] Creating mock payment");
      const mockOrder = await mockPaymentService.createOrder(paymentData);

      return {
        approvalURL: null,
        isDemo: true,
        orderId: mockOrder.id,
        status: mockOrder.status,
      };
    }

    // Real PayPal flow
    return new Promise((resolve, reject) => {
      paypal.payment.create(paymentData, (error, payment) => {
        if (error) {
          reject(error);
        } else {
          const approvalURL =
            payment.links.find((link) => link.rel === "approval_url")?.href ||
            null;
          resolve({
            approvalURL,
            isDemo: false,
            paymentId: payment.id,
          });
        }
      });
    });
  }

  /**
   * Create a payment order
   * @param {Object} orderData - Order data for PayPal
   * @returns {Promise<Object>} - Order creation response
   */
  async createOrder(orderData) {
    const service = this.getService();

    if (this.mode === "demo") {
      console.log("[DEMO MODE] Creating mock order");
    }

    return await service.createOrder(orderData);
  }

  /**
   * Capture a payment
   * @param {string} orderId - The order ID to capture
   * @returns {Promise<Object>} - Capture response
   */
  async capturePayment(orderId) {
    const service = this.getService();

    if (this.mode === "demo") {
      console.log("[DEMO MODE] Capturing mock payment");
    }

    return await service.capturePayment(orderId);
  }

  /**
   * Get order details
   * @param {string} orderId - The order ID to retrieve
   * @returns {Promise<Object>} - Order details
   */
  async getOrderDetails(orderId) {
    const service = this.getService();
    return await service.getOrderDetails(orderId);
  }

  /**
   * Check if running in demo mode
   * @returns {boolean} - True if in demo mode
   */
  isDemoMode() {
    return this.mode === "demo";
  }

  /**
   * Get current payment mode
   * @returns {string} - Current mode (demo, sandbox, or live)
   */
  getMode() {
    return this.mode;
  }
}

module.exports = new PaymentService();

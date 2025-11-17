const paymentService = require("../../services/paymentService");
const OrderModel = require("../../models/OrderModel");
const ProductModel = require("../../models/ProductModels");
const CartModel = require("../../models/CartModel");

exports.createOrder = async (req, res) => {
  try {
    /* ORDER STATUS & PAYMENT STATUS NEED TO BE PENDING IN THIS PHASE
         IN THIS PART WE SAVE THE ORDER IN THE DATABASE, BUT ITS NOT COMPLETED YET
         WE NEED TO RETURN THE APPROVAL URL TO THE FRONTEND
         THE FRONTEND WILL REDIRECT THE USER TO THE PAYPAL PAGE
         AFTER THE USER PAID, THE USER WILL BE REDIRECTED TO THE RETURN URL
         WE NEED TO CAPTURE THE PAYMENT IN A DIFFERENT CONTROLLER
         WE NEED TO UPDATE THE ORDER STATUS AND PAYMENT STATUS IN THE DATABASE */

    const {
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
    } = req.body;

    const paymentData = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:5173/shop/paypal-return",
        cancel_url: "http://localhost:5173/shop/paypal-cancel",
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => {
              const price = parseFloat(item.price) || 0;
              return {
                name: item.title,
                sku: item.productId,
                price: price.toFixed(2),
                currency: "USD",
                quantity: item.quantity,
              };
            }),
          },
          amount: {
            total: (parseFloat(totalAmount) || 0).toFixed(2),
            currency: "USD",
          },
          description: "Payment for order",
        },
      ],
    };

    try {
      const paymentResult = await paymentService.createPayment(paymentData);

      const newOrder = new OrderModel({
        userId,
        cartId,
        cartItems,
        addressInfo,
        orderStatus,
        paymentMethod,
        paymentStatus,
        totalAmount,
        orderDate,
        orderUpdateDate,
        paymentId,
        payerId,
        isDemoOrder: paymentResult.isDemo || false,
      });

      await newOrder.save();

      const response = {
        success: true,
        message: "Order created successfully",
        orderId: newOrder._id,
        approvalURL: paymentResult.approvalURL,
        isDemo: paymentResult.isDemo || false,
      };

      console.log('[ORDER CONTROLLER] Sending response:', JSON.stringify(response));
      return res.json(response);
    } catch (error) {
      console.error(error, "error from CREATE PAYMENT - BACKEND");
      return res.status(500).json({
        success: false,
        message: "Error from CREATE PAYMENT - BACKEND",
        error: error.message,
      });
    }
  } catch (error) {
    console.error(error, "error from CREATE ORDER - BACKEND");
    return res.status(500).json({
      success: false,
      message: "Error from CREATE ORDER - BACKEND",
      error: error.message,
    });
  }
};

exports.capturePayment = async (req, res) => {
  try {
    const { orderId, paymentId, payerId } = req.body;

    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Capture payment using payment service (handles both demo and real PayPal)
    if (!order.isDemoOrder) {
      try {
        await paymentService.capturePayment(paymentId, payerId);
      } catch (captureError) {
        console.error(captureError, "Payment capture failed");
        return res.status(500).json({
          success: false,
          message: "Payment capture failed",
          error: captureError.message,
        });
      }
    }

    order.paymentId = paymentId;
    order.payerId = payerId;
    order.paymentStatus = "paid";
    order.orderStatus = "completed";
    order.orderUpdateDate = new Date();

    // UPDATE STOCK QUANTITY IN THE DATABASE AFTER THE PAYMENT IS CAPTURED
    for (let item of order.cartItems) {
      let product = await ProductModel.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found`,
        });
      }

      product.totalStock -= item.quantity;
      await product.save();
    }

    const getCartId = order.cartId;
    await CartModel.findByIdAndDelete(getCartId);

    await order.save();

    return res.json({
      success: true,
      message: "Payment captured successfully",
      data: order,
    });
  } catch (error) {
    console.error(error, "error from CAPTURE PAYMENT - BACKEND");
    return res.status(500).json({
      success: false,
      message: "Error from CAPTURE PAYMENT - BACKEND",
      error: error.message,
    });
  }
};

exports.getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await OrderModel.find({ userId });
    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }
    return res.json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.error(error, "error from GET ALL ORDERS BY USER - BACKEND");
    return res.status(500).json({
      success: false,
      message: "Error from GET ALL ORDERS BY USER - BACKEND",
      error: error.message,
    });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await OrderModel.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
    return res.json({
      success: true,
      message: "Order details fetched successfully",
      data: order,
    });
  } catch (error) {
    console.error(error, "error from GET ALL ORDERS BY USER - BACKEND");
    return res.status(500).json({
      success: false,
      message: "Error from GET ALL ORDERS BY USER - BACKEND",
      error: error.message,
    });
  }
};

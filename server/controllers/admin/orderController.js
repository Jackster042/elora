const OrderModel = require("../../models/OrderModel");

exports.getAllOrdersOfAllUsers = async (req, res) => {
  try {
    const orders = await OrderModel.find({});
    if (!orders) {
      return res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }

    return res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error(error, "error from GET ALL ORDERS OF ALL USERS");
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
exports.getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await OrderModel.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error(error, "error from GET ORDER DETAILS FOR ADMIN");
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await OrderModel.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    console.error(error, "error from UPDATE ORDER STATUS");
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

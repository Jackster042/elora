const ProductModel = require("../../models/ProductModels");
const CartModel = require("../../models/CartModel");
const UserModel = require("../../models/UserModel");

exports.addToCart = async (req, res, next) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const product = await ProductModel.findById(productId);
    if (!product)
      return res
        .status(400)
        .json({ success: false, message: "Product not found!" });

    let cart = await CartModel.findOne({ userId });

    if (!cart) {
      cart = new CartModel({
        userId,
        items: [],
      });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingItemIndex === -1) {
      cart.items.push({ productId, quantity });
    } else {
      cart.items[existingItemIndex].quantity += quantity;
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Item added to cart successfully",
      data: cart,
    });
  } catch (error) {
    console.error(error, "error from addToCart - BACKEND");
    res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
    });
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const cart = await CartModel.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // CHECK IF THE PRODUCT IS IN STOCK
    const validateItems = cart.items.filter(
      (productItem) => productItem.productId
    );

    if (validateItems.length < cart.items.length) {
      cart.items = validateItems;
      await cart.save();
    }

    const populateCartItems = validateItems.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      quantity: item.quantity,
      salePrice: item.productId.salePrice,
    }));

    return res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.error(error, "error from getCart - BACKEND");
    res.status(500).json({
      success: false,
      message: "Failed to get cart",
    });
  }
};

exports.updateQuantity = async (req, res, next) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const cart = await CartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (existingItemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    cart.items[existingItemIndex].quantity = quantity;

    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    return res.status(200).json({
      success: true,
      message: "Quantity updated successfully",
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.error(error, "error from updateQuantity - BACKEND");
    res.status(500).json({
      success: false,
      message: "Failed to update quantity",
    });
  }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    const { userId, productId } = req.params;
    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const cart = await CartModel.findOne({ userId });
    if (!cart)
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });

    // FILTER THE ITEMS THAT ARE NOT THE PRODUCT TO BE REMOVED
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );
    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    return res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (error) {
    console.error(error, "error from removeFromCart - BACKEND");
    res.status(500).json({
      success: false,
      message: "Failed to remove product from cart",
    });
  }
};

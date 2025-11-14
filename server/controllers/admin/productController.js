const { uploadToCloudinary } = require("../../utils/cloudinary");
const ProductModel = require("../../models/ProductModels");
exports.handleImageUpload = async (req, res, next) => {
  try {
    console.log("Upload request received");
    console.log("req.file:", req.file);
    console.log("req.body:", req.body);
    console.log("Content-Type:", req.headers["content-type"]);
    
    // Check if file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // convert the file to base64
    const b64 = Buffer.from(req.file.buffer).toString("base64");

    // convert the base64 to url
    const url = `data:${req.file.mimetype};base64,${b64}`;

    // upload image to cloudinary
    const result = await uploadToCloudinary(url);

    // return the result
    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      result,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Error uploading image",
      error: error.toString(),
    });
  }
};

// ADD PRODUCT
exports.addProduct = async (req, res, next) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    const newProduct = new ProductModel({
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    });

    await newProduct.save();

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: newProduct,
    });
  } catch (error) {
    console.error(error, "error from ADD PRODUCT");
    return res.status(400).json({
      success: false,
      message: "Error adding product",
    });
  }
};

// GET ALL PRODUCTS
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await ProductModel.find({});

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products,
    });
  } catch (error) {
    console.error(error, "error from GET ALL PRODUCTS");
    return res.status(400).json({
      success: false,
      message: "Error fetching products",
    });
  }
};

// EDIT PRODUCT
exports.editProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    const product = await ProductModel.findById(id);
    if (!product)
      return res
        .status(400)
        .json({ success: false, message: "No products with this ID" });

    product.title = title || product.title;
    product.description = description || product.description;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.price = price === "" ? 0 : price || product.price;
    product.salePrice = salePrice === "" ? 0 : salePrice || product.salePrice;
    product.totalStock = totalStock || product.totalStock;
    product.image = image || product.image;
    product.averageReview = averageReview || product.averageReview;

    await product.save();

    return res.status(201).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error(error, "error from EDIT PRODUCT");
    return res.status(400).json({
      success: false,
      message: "Error editing product",
    });
  }
};

// DELETE PRODUCT
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findById(id);
    if (!product)
      return res
        .status(400)
        .json({ success: false, message: "No products with this ID" });

    await product.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error(error, "error from DELETE PRODUCT");
    return res.status(400).json({
      success: false,
      message: "Error deleting product",
    });
  }
};

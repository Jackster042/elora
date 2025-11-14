const AddressModel = require("../../models/AddressModel");

exports.addAddress = async (req, res, next) => {
  try {
    const { userId, address, city, pincode, notes, phone } = req.body;

    if (!userId || !address || !city || !pincode || !phone || !notes)
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });

    const newAddress = new AddressModel({
      userId,
      address,
      city,
      phone,
      pincode,
      notes,
    });

    await newAddress.save();

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      data: newAddress,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.fetchAllAddress = async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!userId)
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });

    const addressList = await AddressModel.find({ userId });

    return res.status(201).json({
      success: true,
      message: "All addresses fetched successfully",
      data: addressList,
    });
  } catch (error) {
    console.error(error, "error from fetchAllAddress controller BACKEND");
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.editAddress = async (req, res, next) => {
  try {
    const { userId, addressId } = req.params;
    const fromData = req.body;

    if (!userId || !addressId)
      return res.status(400).json({
        success: false,
        message: "User ID and Address ID are required",
      });

    const updatedAddress = await AddressModel.findByIdAndUpdate(
      addressId,
      fromData,
      { new: true }
    );

    if (!updatedAddress)
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });

    return res.status(201).json({
      success: true,
      message: "Address updated successfully",
      data: updatedAddress,
    });
  } catch (error) {
    console.error(error, "error from editAddress controller BACKEND");
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

exports.deleteAddress = async (req, res, next) => {
  try {
    const { userId, addressId } = req.params;

    if (!userId || !addressId)
      return res.status(400).json({
        success: false,
        message: "User ID and Address ID are required",
      });

    const deleteAddress = await AddressModel.findOneAndDelete({
      _id: addressId,
      userId,
    });

    if (!deleteAddress)
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });

    return res.status(201).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error(error, "rror from deleteAddress controller BACKEND");
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

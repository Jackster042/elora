const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserModel = require("../../models/UserModel");
const { JWT_SECRET, JWT_OPTIONS } = require("../../config/env.config.js");
const SALT = 12;
// TODO: THIS WILL MOST LIKELY BE TRANSFERRED IN USER MODEL IN V2

//  REGISTER USER
exports.register = async (req, res, next) => {
  const { email, password, userName } = req.body;
  try {
    const user = await UserModel.findOne({ email });

    if (user)
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });

    if (!user) {
      const hashedPassword = await bcrypt.hash(password, SALT);

      const newUser = new UserModel({
        email,
        password: hashedPassword,
        userName,
      });

      const savedUSer = await newUser.save();

      return res.status(201).json({
        success: true,
        message: "User created successfully",
        user: savedUSer,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }
  } catch (error) {
    console.error(error, "error from REGISTER BACKEND");
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//  LOGIN USER
exports.login = async (req, res, next) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const user = await UserModel.findOne({ email: req.body.email }).select(
      "+password"
    );
    if (!user)
      return res
        .status(400)
        .json({ success: false, message: "Don't have an account? Register" });

    const isCorrectPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isCorrectPassword)
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });

    const payload = {
      id: user._id,
      role: user.role,
      email: user.email,
      userName: user.userName,
    };

    const token = jwt.sign(payload, JWT_SECRET, JWT_OPTIONS);

    const { password, __v, ...userData } = user._doc;

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
      })
      .json({
        success: true,
        message: "Logged in successfully",
        user: {
          email: userData.email,
          role: userData.role,
          id: userData._id,
          userName: userData.userName,
        },
        token,
      });
  } catch (error) {
    console.error(error, "error from LOGIN BACKEND");
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//  LOGOUT USER

exports.logout = async (req, res, next) => {
  res
    .clearCookie("token")
    .json({ success: true, message: "Logged out successfully" });
};

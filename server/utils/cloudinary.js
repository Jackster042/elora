const cloudinary = require("cloudinary").v2;
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Always use HTTPS
});

// Use memory storage for multer (we'll upload to cloudinary manually)
const storage = multer.memoryStorage();

// Enhanced upload utility with error handling
// Accepts either a base64 data URL string or a file object with buffer
async function uploadToCloudinary(file) {
  try {
    let dataUrl;

    // Check if input is a string (base64 data URL) or file object
    if (typeof file === "string") {
      // Already a data URL string
      dataUrl = file;
    } else if (file && file.buffer) {
      // File object with buffer - convert to data URL
      dataUrl = `data:${file.mimetype};base64,${file.buffer.toString(
        "base64"
      )}`;
    } else {
      throw new Error("Invalid file format");
    }

    const result = await cloudinary.uploader.upload(dataUrl, {
      folder: "e-store/products",
      resource_type: "auto",
      transformation: [
        { width: 1000, height: 1000, crop: "limit" },
        { quality: "auto:good" },
      ],
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Image upload failed: " + error.message);
  }
}

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

module.exports = {
  cloudinary,
  upload,
  uploadToCloudinary,
  deleteFromCloudinary: async (publicId) => {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Cloudinary delete error:", error);
    }
  },
};

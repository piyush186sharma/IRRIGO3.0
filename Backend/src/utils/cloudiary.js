import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload using BUFFER (not local path)
const uploadOnCloudinary = async (buffer) => {
  try {
    if (!buffer) return null;

    return await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "event-payments",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };

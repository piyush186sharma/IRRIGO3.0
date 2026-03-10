import moduleModelMap from "../utils/moduleModelMap.js";
import { uploadOnCloudinary } from "../utils/cloudiary.js";

export const registerEvent = async (req, res) => {
  try {
    const { module } = req.body;

    /* ================= VALIDATION ================= */

    if (!module) {
      return res.status(400).json({
        success: false,
        message: "Module is required",
      });
    }

    // 1️⃣ Select correct collection based on module
    const Model = moduleModelMap[module];

    if (!Model) {
      return res.status(400).json({
        success: false,
        message: "Invalid module selected",
      });
    }

    /* ================= CLOUDINARY UPLOAD ================= */

    let paymentScreenshot = null;

    if (req.file) {
      const result = await uploadOnCloudinary(req.file.buffer);

      if (!result) {
        return res.status(500).json({
          success: false,
          message: "Failed to upload payment screenshot",
        });
      }

      paymentScreenshot = {
        url: result.secure_url,
        publicId: result.public_id,
      };
    }

    /* ================= SAVE REGISTRATION ================= */

    const registration = await Model.create({
      ...req.body,
      paymentScreenshot, // ✅ Cloudinary data
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      registration,
    });

  } catch (error) {
    console.error("Registration Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

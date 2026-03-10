// import express from "express";
// import multer from "multer";
// import { getRegistrationModel } from "../models/registration.model.js";
// import { uploadOnCloudinary } from "../utils/cloudiary.js";

// const router = express.Router();

// /* ================= MULTER (MEMORY STORAGE) ================= */

// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
//   fileFilter: (req, file, cb) => {
//     const allowed = ["image/jpeg", "image/png", "image/jpg"];
//     if (allowed.includes(file.mimetype)) cb(null, true);
//     else cb(new Error("Only JPG, JPEG, PNG allowed"), false);
//   },
// });

// /* ================= ROUTE ================= */

// router.post(
//   "/",
//   upload.single("paymentScreenshot"),
//   async (req, res) => {
//     try {
//       const { module } = req.body;

//       if (!module) {
//         return res.status(400).json({
//           success: false,
//           message: "Module is required",
//         });
//       }

//       // 🔥 Get model dynamically based on module
//       const Registration = getRegistrationModel(module);

//       /* ================= CLOUDINARY UPLOAD ================= */

//       let paymentScreenshot = null;

//       if (req.file) {
//         const result = await uploadOnCloudinary(req.file.buffer);

//         if (!result) {
//           return res.status(500).json({
//             success: false,
//             message: "Failed to upload payment screenshot",
//           });
//         }

//         paymentScreenshot = {
//           url: result.secure_url,
//           publicId: result.public_id,
//         };
//       }

//       /* ================= SAVE DATA ================= */

//       const registration = await Registration.create({
//         ...req.body,
//         paymentScreenshot,
//       });

//       return res.status(201).json({
//         success: true,
//         message: "Registration successful",
//         registration,
//       });
//     } catch (error) {
//       console.error("Registration Error:", error);

//       return res.status(500).json({
//         success: false,
//         message: error.message || "Internal Server Error",
//       });
//     }
//   }
// );

// export default router;

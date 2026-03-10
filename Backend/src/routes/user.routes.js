
import {Router} from "express";

import { registerUser,loginUser,logoutuser, updateAccountDetails, changeCurrentPassword,dashboard,updateAvatar } from "../controllers/user.controller.js";

import { verifyJWT } from "../Middlewares/auth.middlewares.js";

import {upload} from "../Middlewares/multer.middleware.js"

const router=Router()

router.route("/register").post(registerUser)


router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT,logoutuser)
router.route("/updateAccountDetails").patch(verifyJWT,updateAccountDetails)
router.route("/changePassword").patch(verifyJWT,changeCurrentPassword)
router.route("/updateAvatar").patch(verifyJWT,upload.single([
    "avatar"
]),updateAvatar)
router.route("/dashboard").get(verifyJWT,dashboard)

export default router
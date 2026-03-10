import express from "express";
import {
  saveFarmSetup,
  getFarmConfig
} from "../controllers/farm.controller.js";

import { verifyJWT } from "../Middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/setup", verifyJWT, saveFarmSetup);

router.get("/config", verifyJWT, getFarmConfig);

export default router;
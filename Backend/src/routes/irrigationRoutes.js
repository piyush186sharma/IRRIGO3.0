import express from "express";
import { runIrrigationLogic } from "../controllers/irrigationController.js";

const router = express.Router();

router.get("/run", runIrrigationLogic);

export default router;
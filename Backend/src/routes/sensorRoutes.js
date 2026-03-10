import express from "express";
import { checkSensorAndNotify } from "../controllers/sensorController.js";

const router = express.Router();

router.post("/", checkSensorAndNotify);

export default router;
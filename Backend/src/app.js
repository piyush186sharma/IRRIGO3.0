import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import farmRoutes from "./routes/farm.routes.js";
import sensorRoutes from "./routes/sensorRoutes.js";
import healthcheckRouter from "./routes/healthcheck.routes.js";
import userRouter from "./routes/user.routes.js";

const app = express();

// Rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many requests. Please try again later.",
});

app.use("/api", apiLimiter);

app.use(
  cors({
    origin: [
      "https://irrigo-3-0.vercel.app",
      "http://localhost:8080",
      "https://irrigo-3-0-w3dl7b434-piyushsharmaspsghy-2632s-projects.vercel.app"
    ],
    credentials: true,
  })
);

// Middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Routes
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/farm", farmRoutes);
app.use("/api/v1/mail", sensorRoutes);

export { app };
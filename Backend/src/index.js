import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/database.js";
import { runIrrigationLogic } from "./controllers/irrigationController.js";

dotenv.config({
  path: "./.env"
});

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Up & Running on Port ${PORT}`);

      // 🔥 START REAL-TIME IRRIGATION HERE
      runIrrigationLogic();
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Failed", err);
  });
import mongoose from "mongoose";

const sensorThresholdSchema = new mongoose.Schema({
  Pottasium: { type: Number, required: true },
  Nitrate: { type: Number, required: true },
  soilMoisture: { type: Number, required: true }
  
});

const zoneSchema = new mongoose.Schema({
  zoneNumber: { type: Number, required: true },
  thresholds: { type: sensorThresholdSchema, required: true }
});

const farmConfigSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  numberOfZones: {
    type: Number,
    required: true
  },
  zones: [zoneSchema]
}, { timestamps: true });

export const FarmConfig = mongoose.model("FarmConfig", farmConfigSchema);
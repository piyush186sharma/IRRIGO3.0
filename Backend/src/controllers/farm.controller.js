import { FarmConfig } from "../models/farmConfig.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const saveFarmSetup = asyncHandler(async (req, res) => {
  const { numberOfZones, zones } = req.body;

  console.log("FULL BODY:", JSON.stringify(req.body, null, 2));

  if (!numberOfZones || !zones || !Array.isArray(zones) || zones.length === 0) {
    throw new Error("Zones and thresholds are required");
  }

  const requiredFields = [
    "Nitrate",
    "Potassium",
    "Phosphorus",
    "Ph",
    "Temperature",
    "soilMoisture"
  ];

  zones.forEach((zone) => {
    if (!zone.zoneNumber || !zone.thresholds) {
      throw new Error(`Invalid zone structure`);
    }

    const t = zone.thresholds;

    requiredFields.forEach((field) => {
      if (t[field] === undefined || t[field] === null || isNaN(t[field])) {
        throw new Error(`Invalid thresholds for zone ${zone.zoneNumber}`);
      }
    });
  });

  const userId = req.user._id;

  let farm = await FarmConfig.findOne({ userId });

  if (farm) {
    farm.numberOfZones = numberOfZones;
    farm.zones = zones;
    await farm.save();
  } else {
    farm = await FarmConfig.create({
      userId,
      numberOfZones,
      zones,
    });
  }

  return res.status(200).json({
    success: true,
    message: "Farm setup saved successfully",
    data: farm,
  });
});

export const getFarmConfig = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const farm = await FarmConfig.findOne({ userId });

  if (!farm) {
    return res.status(404).json({
      success: false,
      message: "Farm configuration not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: farm,
  });
});
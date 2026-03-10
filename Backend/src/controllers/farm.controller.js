import { FarmConfig } from "../models/farmConfig.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Save Farm Setup
export const saveFarmSetup = asyncHandler(async (req, res) => {
  const { numberOfZones, zones } = req.body;

  console.log("Request Body:", req.body);

  // Basic validation
  if (!numberOfZones || !zones || !Array.isArray(zones) || zones.length === 0) {
    throw new Error("Zones and thresholds are required");
  }

  // Validate each zone
  zones.forEach((zone) => {
    if (
      !zone.zoneNumber ||
      !zone.thresholds ||
      zone.thresholds.Nitrate === undefined ||
      zone.thresholds.Pottasium === undefined ||
      zone.thresholds.soilMoisture === undefined
    ) {
      throw new Error(`Invalid thresholds for zone ${zone.zoneNumber}`);
    }
  });

  const userId = req.user._id;

  // Check if farm already exists
  let farm = await FarmConfig.findOne({ userId });

  if (farm) {
    // Update existing farm
    farm.numberOfZones = numberOfZones;
    farm.zones = zones;

    await farm.save();
  } else {
    // Create new farm config
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

// Get Farm Config
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
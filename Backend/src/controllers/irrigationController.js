import db from "../config/firebaseAdmin.js";
import { FarmConfig } from "../models/farmConfig.model.js";
import { sendAlertEmail } from "../controllers/sensorController.js";

// 🔥 prevent spam
const alertState = {};

export const runIrrigationLogic = async () => {
    try {
        db.ref("zones").on("value", async (snapshot) => {
            const firebaseZones = snapshot.val();

            const farmConfig = await FarmConfig.findOne().sort({ createdAt: -1 });
            if (!farmConfig) return;

            const zoneMap = {};
            farmConfig.zones.forEach(z => {
                zoneMap[`zone${z.zoneNumber}`] = z;
            });

            for (const zoneName in firebaseZones) {
                const firebaseZone = firebaseZones[zoneName];
                const mongoZone = zoneMap[zoneName];

                if (!mongoZone) continue;
                if (firebaseZone.mode === "manual") continue;

                const humidity = firebaseZone.Humidity;   // ✅ your logic
                const threshold = mongoZone.thresholds.soilMoisture;

                let sprinkler = 0;

                if (humidity < threshold) {
                    sprinkler = 1;

                    // 🔥 send email ONLY once
                    if (!alertState[zoneName]) {
                        alertState[zoneName] = true;

                        await sendAlertEmail(zoneName, firebaseZone, threshold);
                    }

                } else {
                    sprinkler = 0;
                    alertState[zoneName] = false;
                }

                await db.ref(`zones/${zoneName}`).update({
                    Sprinkler: sprinkler
                });
            }

        });

    } catch (error) {
        console.error(error);
    }
};
import db from "../config/firebaseAdmin.js";
import { FarmConfig } from "../models/farmConfig.model.js";

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
                if (firebaseZone.mode === "manual") {
                    continue;
                }
                const moisture = firebaseZone.Humidity;
                const threshold = mongoZone.thresholds.soilMoisture;

                let sprinkler = 0;

                if (moisture < threshold) {
                    sprinkler = 1;
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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Save, Thermometer, Droplets, Leaf } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TopNavbar from "@/components/TopNavbar";

export default function Setup() {
    const navigate = useNavigate();

    const createEmptyThresholds = () => ({
        Nitrogen: "",
        Potassium: "",
        Phosphorus: "",
        Ph: "",
        Temperature: "",
        soilMoisture: ""
    });

    const [zones, setZones] = useState([
        {
            zoneNumber: 1,
            thresholds: createEmptyThresholds()
        }
    ]);

    const addZone = () => {
        setZones([
            ...zones,
            {
                zoneNumber: zones.length + 1,
                thresholds: createEmptyThresholds()
            }
        ]);
    };

    const updateZone = (index, field, value) => {
        const newZones = [...zones];
        newZones[index].thresholds[field] =
            value === "" ? "" : Number(value);
        setZones(newZones);
    };

    const validateZones = () => {
        for (let z of zones) {
            for (let key in z.thresholds) {
                if (z.thresholds[key] === "") {
                    return false;
                }
            }
        }
        return true;
    };

    const saveSetup = async () => {
        if (!validateZones()) {
            alert("Please fill all fields before saving!");
            return;
        }

        const token = localStorage.getItem("accessToken");

        const payload = {
            numberOfZones: zones.length,
            zones: zones
        };

        console.log("Sending payload:", payload);

        try {
            const response = await fetch(
                "https://irrigo3-0.onrender.com/api/v1/farm/setup",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                }
            );

            if (!response.ok) throw new Error("Failed to save");

            alert("Farm setup completed!");
            navigate("/");
        } catch (error) {
            console.error(error);
            alert("Error saving setup");
        }
    };

    const fieldConfig = [
        { key: "Nitrogen", label: "Nitrogen (ppm)", icon: Thermometer },
        { key: "Potassium", label: "Potassium (ppm)", icon: Droplets },
        { key: "Phosphorus", label: "Phosphorus (ppm)", icon: Leaf },
        { key: "Ph", label: "pH Level", icon: Leaf },
        { key: "Temperature", label: "Temperature (°C)", icon: Thermometer },
        { key: "soilMoisture", label: "Soil Moisture (%)", icon: Droplets }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background grid-pattern">
            <TopNavbar />

            <main className="flex-1 overflow-y-auto p-6 max-w-5xl mx-auto w-full">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-foreground">
                        Farm Setup
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Configure zones and sensor thresholds
                    </p>
                </div>

                <div className="space-y-4">
                    {zones.map((zone, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="glow-border">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <div className="h-6 w-6 rounded bg-primary/10 border flex items-center justify-center">
                                            <span className="text-xs text-primary">
                                                {zone.zoneNumber}
                                            </span>
                                        </div>
                                        Zone {zone.zoneNumber}
                                    </CardTitle>
                                </CardHeader>

                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {fieldConfig.map(
                                            ({ key, label, icon: Icon }) => (
                                                <div key={key}>
                                                    <Label className="text-xs flex items-center gap-1">
                                                        <Icon className="h-3 w-3 text-primary" />
                                                        {label}
                                                    </Label>

                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        placeholder="Enter value"
                                                        value={
                                                            zone.thresholds[key]
                                                        }
                                                        onChange={(e) =>
                                                            updateZone(
                                                                index,
                                                                key,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="mt-1"
                                                    />
                                                </div>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="flex gap-3 mt-6">
                    <Button variant="outline" onClick={addZone}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Zone
                    </Button>

                    <Button onClick={saveSetup}>
                        <Save className="h-4 w-4 mr-1" />
                        Save Setup
                    </Button>
                </div>
            </main>
        </div>
    );
}
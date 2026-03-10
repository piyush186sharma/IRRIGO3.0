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

    const [zones, setZones] = useState([
        {
            zoneNumber: 1,
            thresholds: {
                Nitrate: "",
                Pottasium: "",
                soilMoisture: ""
            }
        }
    ]);

    const addZone = () => {
        setZones([
            ...zones,
            {
                zoneNumber: zones.length + 1,
                thresholds: {
                    Nitrate: "",
                    Pottasium: "",
                    soilMoisture: ""
                }
            }
        ]);
    };

    const updateZone = (index, field, value) => {
        const newZones = [...zones];
        newZones[index].thresholds[field] = Number(value);
        setZones(newZones);
    };

    const saveSetup = async () => {
        const token = localStorage.getItem("accessToken");

        const payload = {
            numberOfZones: zones.length,
            zones: zones
        };

        console.log("Sending payload:", payload);

        try {
            const response = await fetch(
                "http://localhost:7000/api/v1/farm/setup",
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
        { key: "Nitrate", label: "Nitrate Threshold", icon: Thermometer, placeholder: "e.g. 35°C" },
        { key: "Pottasium", label: "Pottasium Threshold", icon: Droplets, placeholder: "e.g. 80%" },
        { key: "soilMoisture", label: "Soil Moisture Threshold", icon: Leaf, placeholder: "e.g. 60%" },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background grid-pattern">
            <TopNavbar />

            <main className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">Farm Setup</h1>
                    <p className="text-sm text-muted-foreground mt-1">Configure zones and sensor thresholds</p>
                </div>

                <div className="space-y-4">
                    {zones.map((zone, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <Card className="glow-border">
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                                        <div className="h-6 w-6 rounded bg-primary/10 border border-primary/30 flex items-center justify-center">
                                            <span className="text-xs font-mono text-primary">{zone.zoneNumber}</span>
                                        </div>
                                        Zone {zone.zoneNumber}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {fieldConfig.map(({ key, label, icon: Icon, placeholder }) => (
                                            <div key={key} className="space-y-2">
                                                <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                    <Icon className="h-3.5 w-3.5 text-primary" />
                                                    {label}
                                                </Label>
                                                <Input
                                                    type="number"
                                                    placeholder={placeholder}
                                                    value={zone.thresholds[key]}
                                                    onChange={(e) => updateZone(index, key, e.target.value)}
                                                    className="font-mono text-sm"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="flex items-center gap-3 mt-6">
                    <Button variant="outline" onClick={addZone} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Zone
                    </Button>
                    <Button onClick={saveSetup} className="gap-2">
                        <Save className="h-4 w-4" />
                        Save Setup
                    </Button>
                </div>
            </main>
        </div>
    );
}

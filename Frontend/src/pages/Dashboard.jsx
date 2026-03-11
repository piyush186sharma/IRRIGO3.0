import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Activity, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import ZoneSidebar from "@/components/ZoneSidebar";
import TopNavbar from "@/components/TopNavbar";
import SensorCard from "@/components/SensorCard";
import { sensorMeta, generateZone } from "@/data/sensorData";

const Dashboard = () => {
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [sprinklerOn, setSprinklerOn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFarmConfig = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const res = await fetch(
          "https://irrigo3-0.onrender.com/api/v1/farm/config",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Server error ${res.status}`);
        }

        const result = await res.json();

        if (!result.success) {
          console.error("Farm config not found");
          setLoading(false);
          return;
        }

        const generatedZones = result.data.zones.map((zone) =>
          generateZone(zone.zoneNumber, zone.thresholds)
        );

        setZones(generatedZones);
        setSelectedZone(generatedZones[0]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching farm config:", error);
        setLoading(false);
      }
    };

    fetchFarmConfig();
  }, []);

  if (loading) {
    return <div className="p-6">Loading zones...</div>;
  }

  if (!selectedZone) {
    return <div className="p-6">No zones available</div>;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background grid-pattern">
      <ZoneSidebar
        zones={zones}
        selectedZone={selectedZone}
        onSelectZone={setSelectedZone}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar />

        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedZone.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground tracking-tight">
                    {selectedZone.name}
                  </h2>

                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Updated {selectedZone.lastUpdated}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Activity className="h-3.5 w-3.5 text-primary" />
                      <span>{Object.keys(sensorMeta).length} sensors active</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground px-3 py-1.5 rounded-md bg-secondary border border-border font-mono">
                    LIVE
                  </span>

                  <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse-glow" />
                </div>
              </div>

              <div className="mb-6">
                <Button
                  onClick={() => setSprinklerOn(!sprinklerOn)}
                  variant={sprinklerOn ? "default" : "outline"}
                  className="flex items-center gap-2"
                >
                  <Droplets className="h-4 w-4" />
                  {sprinklerOn ? "Sprinkler On" : "Sprinkler Off"}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {Object.keys(sensorMeta).map((type, i) => (
                  <SensorCard
                    key={type}
                    type={type}
                    reading={selectedZone.sensors[type]}
                    index={i}
                  />
                ))}
              </div>

              <div className="mt-6 rounded-lg border border-border bg-card/50 p-5">
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Zone Health Summary
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.keys(sensorMeta).map((type) => {
                    const reading = selectedZone.sensors[type];
                    const meta = sensorMeta[type];

                    return (
                      <div key={type} className="flex items-center gap-3">
                        <div
                          className={`h-3 w-3 rounded-full ${
                            reading.status === "optimal"
                              ? "bg-primary"
                              : reading.status === "warning"
                              ? "bg-accent"
                              : "bg-destructive"
                          }`}
                        />

                        <div>
                          <p className="text-xs text-muted-foreground">
                            {meta.label}
                          </p>

                          <p className="text-sm font-medium font-mono text-foreground">
                            {reading.value}
                            {reading.unit}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
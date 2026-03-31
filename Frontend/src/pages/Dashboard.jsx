import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Activity, Droplets, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import ZoneSidebar from "@/components/ZoneSidebar";
import TopNavbar from "@/components/TopNavbar";
import SensorCard from "@/components/SensorCard";
import { sensorMeta } from "@/data/sensorData.jsx";
import Loader from "@/components/IrrigoHero.jsx";
import CherryBlossomFall from "@/components/cherryBlossom.jsx";

// 🔥 FIREBASE
import { database } from "../firebase/firebase.js";
import { ref, onValue, set } from "firebase/database";

const Dashboard = () => {
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [sprinklerOn, setSprinklerOn] = useState(false);
  const [mode, setMode] = useState("manual"); // ✅ NEW STATE
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // 🔥 FIREBASE REALTIME LISTENER
  useEffect(() => {
    const zonesRef = ref(database, "zones");

    const unsubscribe = onValue(zonesRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        console.log("No Firebase data");
        setLoading(false);
        return;
      }

      console.log("Zones Data:", data);

      const zonesArray = Object.keys(data).map((key) => {
        const zoneData = data[key];

        return {
          id: key,
          name: key.toUpperCase(),
          lastUpdated: "Just now",
          sprinkler: zoneData.Sprinkler === 1,
          mode: zoneData.mode || "manual", // ✅ READ MODE

          sensors: {
            moisture: {
              value: zoneData.Humidity || 0,
              unit: "%",
              status: "optimal",
              trend: "up",
            },
            ph: {
              value: zoneData.ph || 0,
              unit: "",
              status: "optimal",
              trend: "stable",
            },
            nitrogen: {
              value: zoneData.Nitrogen || 0,
              unit: "ppm",
              status: "optimal",
              trend: "up",
            },
            potassium: {
              value: zoneData.Potassium || 0,
              unit: "ppm",
              status: "optimal",
              trend: "stable",
            },
            rainfall: {
              value: zoneData.Rainfall || 0,
              unit: "mm",
              status: "optimal",
              trend: "stable",
            },
            temperature: {
              value: zoneData.Temperature || 0,
              unit: "°C",
              status: "optimal",
              trend: "up",
            },
            phosphorus: {
              value: zoneData.Phosphorus || 0,
              unit: "ppm",
              status: "optimal",
              trend: "up",
            },
            ec: {
              value: zoneData.EC || 0,
              unit: "",
              status: "optimal",
              trend: "up",
            },
          },
        };
      });

      setZones(zonesArray);

      setSelectedZone((prev) => {
        if (!prev) return zonesArray[0];
        return zonesArray.find((z) => z.id === prev.id) || zonesArray[0];
      });

      setLoading(false);
    });

    return () => unsubscribe(); // ✅ cleanup
  }, []);

  // ✅ Sync sprinkler
  useEffect(() => {
    if (selectedZone) {
      setSprinklerOn(selectedZone.sprinkler);
    }
  }, [selectedZone]);

  // ✅ Sync mode
  useEffect(() => {
    if (selectedZone) {
      setMode(selectedZone.mode || "manual");
    }
  }, [selectedZone]);

  // 🔥 LOADER
  if (loading)
    return (
      <>
        <Loader />
        <CherryBlossomFall />
      </>
    );

  if (!selectedZone) return <div className="p-6">No zones available</div>;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background grid-pattern">

      <CherryBlossomFall />

      {/* Sidebar */}
      <div className="hidden md:flex">
        <ZoneSidebar
          zones={zones}
          selectedZone={selectedZone}
          onSelectZone={setSelectedZone}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <TopNavbar />

        {/* Mobile Dropdown */}
        <div className="md:hidden p-4">
          <div className="relative">
            <Button
              variant="outline"
              className="w-full flex justify-between items-center"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {selectedZone.name}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>

            {dropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg z-50 overflow-hidden">
                {zones.map((zone) => (
                  <button
                    key={zone.id}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-accent/20 ${
                      zone.id === selectedZone.id ? "font-semibold" : ""
                    }`}
                    onClick={() => {
                      setSelectedZone(zone);
                      setDropdownOpen(false);
                    }}
                  >
                    {zone.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedZone.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >

              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">
                    {selectedZone.name}
                  </h2>

                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Updated {selectedZone.lastUpdated}</span>

                    <Activity className="h-3.5 w-3.5 text-primary" />
                    <span>{Object.keys(sensorMeta).length} sensors active</span>
                  </div>
                </div>

                <span className="text-xs px-3 py-1.5 bg-secondary border rounded-md">
                  LIVE
                </span>
              </div>

              {/* 🔥 BUTTONS */}
              <div className="mb-6 flex gap-3">
                {/* Sprinkler */}
                <Button
                  onClick={() => {
                    const newState = !sprinklerOn;
                    setSprinklerOn(newState);

                    set(
                      ref(database, `zones/${selectedZone.id}/Sprinkler`),
                      newState ? 1 : 0
                    );
                  }}
                  variant={sprinklerOn ? "default" : "outline"}
                >
                  <Droplets className="h-4 w-4" />
                  {sprinklerOn ? "Sprinkler On" : "Sprinkler Off"}
                </Button>

                {/* Mode */}
                <Button
                  onClick={() => {
                    const newMode = mode === "manual" ? "auto" : "manual";
                    setMode(newMode);

                    set(
                      ref(database, `zones/${selectedZone.id}/mode`),
                      newMode
                    );
                  }}
                  variant={mode === "auto" ? "default" : "outline"}
                >
                  {mode === "auto" ? "Auto Mode" : "Manual Mode"}
                </Button>
              </div>

              {/* Sensor Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {Object.keys(sensorMeta).map((type, i) => (
                  <SensorCard
                    key={type}
                    type={type}
                    reading={selectedZone.sensors[type]}
                    index={i}
                  />
                ))}
              </div>

            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
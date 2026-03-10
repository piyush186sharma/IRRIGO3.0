import { Droplets, Beaker, Atom, FlaskConical, TrendingUp, TrendingDown, Minus } from "lucide-react";

export const sensorMeta = {
  moisture: { label: "Soil Moisture", icon: Droplets, colorClass: "text-sensor-moisture", bgClass: "bg-sensor-moisture/10", borderClass: "border-sensor-moisture/30" },
  ph: { label: "pH Level", icon: Beaker, colorClass: "text-sensor-ph", bgClass: "bg-sensor-ph/10", borderClass: "border-sensor-ph/30" },
  nitrate: { label: "Nitrate (N)", icon: FlaskConical, colorClass: "text-sensor-nitrate", bgClass: "bg-sensor-nitrate/10", borderClass: "border-sensor-nitrate/30" },
  potassium: { label: "Potassium (K)", icon: Atom, colorClass: "text-sensor-potassium", bgClass: "bg-sensor-potassium/10", borderClass: "border-sensor-potassium/30" },
};

export const TrendIcon = ({ trend }) => {
  if (trend === "up") return <TrendingUp className="h-3.5 w-3.5" />;
  if (trend === "down") return <TrendingDown className="h-3.5 w-3.5" />;
  return <Minus className="h-3.5 w-3.5" />;
};

export const getStatus = (value, threshold) => {
  if (!threshold) return "optimal";

  if (value < threshold * 0.7) return "critical";
  if (value < threshold) return "warning";
  return "optimal";
};

export const generateZone = (id, thresholds = {}) => {

  const moistureValue = +(25 + Math.random() * 45).toFixed(1);
  const nitrateValue = +(10 + Math.random() * 80).toFixed(0);
  const potassiumValue = +(50 + Math.random() * 200).toFixed(0);

  return {
    id,
    name: `Zone ${String.fromCharCode(64 + id)}`,

    sensors: {

      moisture: {
        value: moistureValue,
        unit: "%",
        status: getStatus(moistureValue, thresholds.soilMoisture),
        trend: ["up", "down", "stable"][Math.floor(Math.random() * 3)],
      },

      ph: {
        value: +(5.5 + Math.random() * 2.5).toFixed(1),
        unit: "",
        status: Math.random() > 0.3 ? "optimal" : "warning",
        trend: ["up", "down", "stable"][Math.floor(Math.random() * 3)],
      },

      nitrate: {
        value: nitrateValue,
        unit: "ppm",
        status: getStatus(nitrateValue, thresholds.Nitrate),
        trend: ["up", "down", "stable"][Math.floor(Math.random() * 3)],
      },

      potassium: {
        value: potassiumValue,
        unit: "ppm",
        status: getStatus(potassiumValue, thresholds.Pottasium),
        trend: ["up", "down", "stable"][Math.floor(Math.random() * 3)],
      },

    },

    lastUpdated: `${Math.floor(Math.random() * 10) + 1}m ago`,
  };
};

export const mockZones = Array.from({ length: 2}, (_, i) => generateZone(i + 1));

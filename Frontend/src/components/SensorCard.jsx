import { motion } from "framer-motion";
import { sensorMeta, TrendIcon } from "@/data/sensorData";

const statusColors = {
  optimal: "text-primary",
  warning: "text-accent",
  critical: "text-destructive",
};

const statusLabels = {
  optimal: "Optimal",
  warning: "Warning",
  critical: "Critical",
};

const SensorCard = ({ type, reading, index }) => {
  const meta = sensorMeta[type];
  const Icon = meta.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={`relative overflow-hidden rounded-lg border ${meta.borderClass} ${meta.bgClass} p-5 backdrop-blur-sm`}
    >
      <div className={`absolute -top-10 -right-10 h-24 w-24 rounded-full ${meta.bgClass} opacity-40 blur-2xl`} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`flex items-center gap-2 ${meta.colorClass}`}>
            <Icon className="h-5 w-5" />
            <span className="text-sm font-medium">{meta.label}</span>
          </div>
          <div className={`flex items-center gap-1 text-xs ${statusColors[reading.status]}`}>
            <TrendIcon trend={reading.trend} />
            <span>{statusLabels[reading.status]}</span>
          </div>
        </div>

        <div className="flex items-baseline gap-1.5">
          <span className="font-mono text-3xl font-bold tracking-tight text-foreground">
            {reading.value}
          </span>
          {reading.unit && (
            <span className="text-sm text-muted-foreground">{reading.unit}</span>
          )}
        </div>

        <div className="mt-4 h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((reading.value / (type === "potassium" ? 300 : type === "nitrate" ? 100 : type === "moisture" ? 80 : 9)) * 100, 100)}%` }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
            className={`h-full rounded-full ${meta.colorClass.replace("text-", "bg-")}`}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default SensorCard;

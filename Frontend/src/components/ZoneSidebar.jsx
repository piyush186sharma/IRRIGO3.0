import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ChevronDown, Layers, Leaf } from "lucide-react";

const ZoneSidebar = ({ zones, selectedZone, onSelectZone }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside className="w-72 border-r border-border bg-card/50 backdrop-blur-sm flex flex-col h-full">
      
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center glow-primary">
            <Leaf className="h-5 w-5 text-primary" />
          </div>

          <div>
            <h1 className="text-sm font-bold tracking-tight text-foreground">
              IRRIGO
            </h1>

            <p className="text-[10px] text-muted-foreground tracking-widest uppercase">
              Smart Farm Monitor
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-md bg-secondary border border-border text-sm hover:border-primary/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            <span className="text-foreground font-medium">Farm Zones</span>
          </div>

          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden flex-1"
          >
            <div className="px-3 pb-4 space-y-1">
              
              {zones.map((zone) => {
                const isSelected = selectedZone?.id === zone.id;

                const hasWarning =
                  zone.sensors &&
                  Object.values(zone.sensors).some(
                    (s) => s.status !== "optimal"
                  );

                return (
                  <button
                    key={zone.id}
                    onClick={() => onSelectZone(zone)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all ${
                      isSelected
                        ? "bg-primary/10 border border-primary/30 glow-border"
                        : "hover:bg-secondary border border-transparent"
                    }`}
                  >
                    <MapPin
                      className={`h-4 w-4 ${
                        isSelected ? "text-primary" : "text-muted-foreground"
                      }`}
                    />

                    <span
                      className={
                        isSelected
                          ? "text-foreground font-medium"
                          : "text-muted-foreground"
                      }
                    >
                      {zone.name}
                    </span>

                    {hasWarning && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-accent animate-pulse-glow" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-auto p-4 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
          <span>All sensors online</span>
        </div>
      </div>
    </aside>
  );
};

export default ZoneSidebar;
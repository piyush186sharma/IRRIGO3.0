import { useMemo } from "react";

const CherryBlossomFall = () => {
  const petals = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        size: 10 + Math.random() * 8,
        startX: -5 + Math.random() * 15,
        drift: 20 + Math.random() * 40,
        duration: 4 + Math.random() * 5,
        delay: Math.random() * 6,
        rotation: Math.random() * 360,
        opacity: 0.5 + Math.random() * 0.4,
        hue: 100 + Math.random() * 40,
        sat: 40 + Math.random() * 30,
        light: 30 + Math.random() * 25,
      })),
    []
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        zIndex: 50,
        pointerEvents: "none",
      }}
    >
      {petals.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.startX}vw`,
            top: "-20px",
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            borderRadius: "0 50% 50% 50%",
            background: `hsl(${p.hue}, ${p.sat}%, ${p.light}%)`,
            animation: `blossom-fall ${p.duration}s ${p.delay}s ease-in infinite`,
            "--drift": `${p.drift}vw`,
            "--rot": `${p.rotation}deg`,
            filter: "blur(0.5px)",
          }}
        />
      ))}

      <style>{`
        @keyframes blossom-fall {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(105vh) translateX(var(--drift)) rotate(calc(var(--rot) + 720deg)) scale(0.6);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default CherryBlossomFall;
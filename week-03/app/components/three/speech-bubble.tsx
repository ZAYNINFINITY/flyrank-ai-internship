"use client";

import { Html } from "@react-three/drei";

type SpeechBubbleProps = {
  visible: boolean;
  position: [number, number, number];
  pointerDirection?: "left" | "right";
};

const BUBBLE_STYLE: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 4,
  padding: "6px 14px",
  background: "rgba(239, 233, 218, 0.85)",
  backdropFilter: "blur(4px)",
  WebkitBackdropFilter: "blur(4px)",
  borderRadius: 999,
  border: "1px solid rgba(42, 42, 48, 0.15)",
  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  pointerEvents: "none" as const,
  transition: "opacity 0.2s ease, transform 0.2s ease",
  whiteSpace: "nowrap" as const,
};

const DOT_STYLE: React.CSSProperties = {
  width: 4,
  height: 4,
  background: "#2a2a30",
  borderRadius: "50%",
};

const KEYFRAMES = `
@keyframes sb-bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-3px); }
}
`;

function Dots() {
  return (
    <>
      <style>{KEYFRAMES}</style>
      {[0, 0.15, 0.3].map((delay, i) => (
        <span
          key={i}
          style={{
            ...DOT_STYLE,
            animation: `sb-bounce 1.2s ease-in-out ${delay}s infinite`,
          }}
        />
      ))}
    </>
  );
}

export function SpeechBubble({
  visible,
  position,
  pointerDirection = "left",
}: SpeechBubbleProps) {
  if (!visible) return null;

  const tailStyle: React.CSSProperties =
    pointerDirection === "left"
      ? {
          position: "absolute",
          bottom: -4,
          left: 14,
          width: 0,
          height: 0,
          borderLeft: "4px solid transparent",
          borderRight: "4px solid transparent",
          borderTop: "5px solid rgba(239, 233, 218, 0.85)",
        }
      : {
          position: "absolute",
          bottom: -4,
          right: 14,
          width: 0,
          height: 0,
          borderLeft: "4px solid transparent",
          borderRight: "4px solid transparent",
          borderTop: "5px solid rgba(239, 233, 218, 0.85)",
        };

  return (
    <Html
      position={position}
      center
      distanceFactor={5}
      style={{ zIndex: 60 }}
    >
      <div style={BUBBLE_STYLE}>
        <Dots />
        <div style={tailStyle} />
      </div>
    </Html>
  );
}

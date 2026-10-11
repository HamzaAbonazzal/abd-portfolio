"use client";

import { useEffect } from "react";

type ShapeType = "plus" | "circle" | "triangle" | "dot" | "square";

interface ShapeDef {
  type: ShapeType;
  x: string;
  y: string;
  depth: number;
  delay: number;
  size: number;
}

const SHAPES: ShapeDef[] = [
  { type: "plus", x: "8%", y: "22%", depth: 15, delay: 0, size: 22 },
  { type: "circle", x: "88%", y: "35%", depth: -20, delay: 1, size: 30 },
  { type: "triangle", x: "12%", y: "68%", depth: 12, delay: 2, size: 26 },
  { type: "plus", x: "78%", y: "78%", depth: -18, delay: 0.5, size: 20 },
  { type: "dot", x: "48%", y: "12%", depth: 10, delay: 1.5, size: 8 },
  { type: "square", x: "22%", y: "42%", depth: -14, delay: 0.8, size: 14 },
  { type: "circle", x: "68%", y: "58%", depth: 16, delay: 2.5, size: 22 },
  { type: "dot", x: "92%", y: "12%", depth: -12, delay: 3, size: 6 },
];

export default function DesignerBackground() {
  useEffect(() => {
    let rafId = 0;
    const handleMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        document.documentElement.style.setProperty("--mx", x.toFixed(3));
        document.documentElement.style.setProperty("--my", y.toFixed(3));
      });
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
    >
      {/* ============================================
          Vector Anchor Points + Bezier Curves
          ============================================ */}

      {/* المجموعة العلوية اليمنى */}
      <svg
        className="absolute top-[12%] right-[6%] w-72 h-72 opacity-40 hidden lg:block"
        viewBox="0 0 280 280"
        fill="none"
      >
        {/* Bezier Curve */}
        <path
          d="M 30 130 Q 130 20 240 140"
          stroke="rgba(96, 165, 250, 0.5)"
          strokeWidth="0.8"
          strokeDasharray="4 4"
        />
        <path
          d="M 60 220 Q 160 100 250 200"
          stroke="rgba(52, 211, 153, 0.35)"
          strokeWidth="0.6"
          strokeDasharray="3 5"
        />

        {/* Anchor Point 1 */}
        <g>
          <rect x="24" y="124" width="12" height="12" fill="white" opacity="0.85" />
          <rect x="20" y="120" width="20" height="20" stroke="rgba(96, 165, 250, 0.6)" strokeWidth="0.8" fill="none" />
        </g>

        {/* Anchor Point 2 */}
        <g>
          <rect x="234" y="134" width="12" height="12" fill="white" opacity="0.85" />
          <rect x="230" y="130" width="20" height="20" stroke="rgba(96, 165, 250, 0.6)" strokeWidth="0.8" fill="none" />
        </g>

        {/* Anchor Point 3 */}
        <g>
          <rect x="124" y="14" width="10" height="10" fill="white" opacity="0.7" />
          <rect x="120" y="10" width="18" height="18" stroke="rgba(96, 165, 250, 0.5)" strokeWidth="0.7" fill="none" />
        </g>

        {/* Control handles */}
        <circle cx="130" cy="20" r="3" fill="rgba(96, 165, 250, 0.9)" />
        <circle cx="240" cy="140" r="3" fill="rgba(96, 165, 250, 0.9)" />
      </svg>

      {/* المجموعة السفلية اليسرى */}
      <svg
        className="absolute bottom-[18%] left-[5%] w-56 h-56 opacity-35 hidden lg:block"
        viewBox="0 0 220 220"
        fill="none"
      >
        <path
          d="M 20 130 Q 110 30 200 120"
          stroke="rgba(52, 211, 153, 0.5)"
          strokeWidth="0.7"
          strokeDasharray="3 4"
        />

        {/* Anchor Point A */}
        <g>
          <rect x="15" y="125" width="10" height="10" fill="white" opacity="0.8" />
          <rect x="11" y="121" width="18" height="18" stroke="rgba(52, 211, 153, 0.6)" strokeWidth="0.7" fill="none" />
        </g>

        {/* Anchor Point B */}
        <g>
          <rect x="195" y="115" width="10" height="10" fill="white" opacity="0.8" />
          <rect x="191" y="111" width="18" height="18" stroke="rgba(52, 211, 153, 0.6)" strokeWidth="0.7" fill="none" />
        </g>

        {/* Control */}
        <circle cx="110" cy="30" r="3" fill="rgba(52, 211, 153, 0.9)" />
      </svg>

      {/* ============================================
          Floating Geometric Shapes
          ============================================ */}
      {SHAPES.map((shape, i) => (
        <div
          key={i}
          className="parallax-shape"
          style={
            {
              left: shape.x,
              top: shape.y,
              "--depth": `${shape.depth}px`,
              "--delay": `${shape.delay}s`,
            } as React.CSSProperties
          }
        >
          <ShapeSVG type={shape.type} size={shape.size} />
        </div>
      ))}
    </div>
  );
}

function ShapeSVG({ type, size }: { type: ShapeType; size: number }) {
  if (type === "plus") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="text-primary/40">
        <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "circle") {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" className="text-primary-light/40">
        <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    );
  }

  if (type === "triangle") {
    return (
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none" className="text-accent/35">
        <polygon
          points="14,4 24,22 4,22"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "square") {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className="text-primary/35">
        <rect x="3" y="3" width="14" height="14" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    );
  }

  // dot
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-primary/40"
    />
  );
}
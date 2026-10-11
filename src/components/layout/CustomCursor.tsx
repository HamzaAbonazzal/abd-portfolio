"use client";

import { useEffect, useState } from "react";

export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // لا نفعّل المؤشر المخصص على الأجهزة اللمسية
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const ring = document.getElementById("cursor-ring");
    const dot = document.getElementById("cursor-dot");
    if (!ring || !dot) return;

    let ringX = 0;
    let ringY = 0;
    let dotX = 0;
    let dotY = 0;
    let targetX = 0;
    let targetY = 0;
    let rafId = 0;

    const animate = () => {
      // حركة ناعمة للحلقة (تأخر بسيط)
      ringX += (targetX - ringX) * 0.15;
      ringY += (targetY - ringY) * 0.15;
      // حركة فورية للنقطة
      dotX = targetX;
      dotY = targetY;

      ring.style.transform = `translate3d(${ringX - 20}px, ${ringY - 20}px, 0)`;
      dot.style.transform = `translate3d(${dotX - 2}px, ${dotY - 2}px, 0)`;

      rafId = requestAnimationFrame(animate);
    };

    const handleMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const handleOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const interactive = el.closest(
        "a, button, [role='button'], input, textarea, select, label, [data-cursor='pointer']"
      );
      ring.style.width = interactive ? "56px" : "40px";
      ring.style.height = interactive ? "56px" : "40px";
      ring.style.borderColor = interactive
        ? "rgba(59, 130, 246, 0.9)"
        : "rgba(147, 197, 253, 0.5)";
      ring.style.background = interactive
        ? "rgba(59, 130, 246, 0.12)"
        : "transparent";
    };

    document.documentElement.classList.add("has-custom-cursor");
    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseover", handleOver, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
      cancelAnimationFrame(rafId);
    };
  }, [enabled]);

  return (
    <>
      {/* الحلقة الخارجية */}
      <div
        id="cursor-ring"
        aria-hidden="true"
        className="fixed top-0 left-0 rounded-full border pointer-events-none z-[9999] hidden lg:block"
        style={{
          width: 40,
          height: 40,
          borderColor: "rgba(147, 197, 253, 0.5)",
          borderWidth: 1.5,
          transition:
            "width 0.25s ease, height 0.25s ease, border-color 0.25s ease, background 0.25s ease",
          willChange: "transform",
          mixBlendMode: "screen",
        }}
      />
      {/* النقطة المركزية */}
      <div
        id="cursor-dot"
        aria-hidden="true"
        className="fixed top-0 left-0 w-1 h-1 rounded-full bg-primary pointer-events-none z-[9999] hidden lg:block"
        style={{
          willChange: "transform",
          boxShadow: "0 0 10px rgba(59, 130, 246, 0.8)",
        }}
      />
    </>
  );
}
"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function AmbientEffects() {
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const glowX = useMotionValue(-200);
  const glowY = useMotionValue(-200);

  // Smooth springs for high-end cursor physics
  const cursorX = useSpring(mouseX, { stiffness: 400, damping: 28 });
  const cursorY = useSpring(mouseY, { stiffness: 400, damping: 28 });

  const ambientGlowX = useSpring(glowX, { stiffness: 80, damping: 25 });
  const ambientGlowY = useSpring(glowY, { stiffness: 80, damping: 25 });

  const secondaryGlowX = useSpring(glowX, { stiffness: 60, damping: 20 });
  const secondaryGlowY = useSpring(glowY, { stiffness: 60, damping: 20 });

  useEffect(() => {
    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      glowX.set(e.clientX - 250); // Offset to center of 500px glow
      glowY.set(e.clientY - 250);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("button") ||
        target.closest("a") ||
        target.classList.contains("interactive")
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY, glowX, glowY]);

  if (!mounted) return null;

  return (
    <>
      {/* Immersive Floating Ambient Light Source */}
      <motion.div
        className="pointer-events-none fixed z-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.04)_0%,rgba(45,212,191,0.01)_50%,transparent_100%)] blur-[40px]"
        style={{
          x: ambientGlowX,
          y: ambientGlowY,
        }}
      />
      <motion.div
        className="pointer-events-none fixed z-0 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(45,212,191,0.03)_0%,rgba(212,175,55,0.01)_60%,transparent_100%)] blur-[50px] delay-100"
        style={{
          x: secondaryGlowX,
          y: secondaryGlowY,
          left: -100,
          top: -100,
        }}
      />

    </>
  );
}

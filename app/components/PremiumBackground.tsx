"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

export default function PremiumBackground() {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 70, damping: 22 });
  const springY = useSpring(pointerY, { stiffness: 70, damping: 22 });
  const layerX = useTransform(springX, [-1, 1], [-18, 18]);
  const layerY = useTransform(springY, [-1, 1], [-12, 12]);

  useEffect(() => {
    setMounted(true);
    const handlePointerMove = (event: PointerEvent) => {
      pointerX.set((event.clientX / window.innerWidth - 0.5) * 2);
      pointerY.set((event.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [pointerX, pointerY]);

  if (!mounted) {
    return <div className="fixed inset-0 -z-20 bg-[#061326]" />;
  }

  // Animation variants that automatically respect user preferences
  const orb1Variants = {
    animate: shouldReduceMotion
      ? {}
      : {
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
          scale: [1, 1.1, 0.95, 1],
          transition: {
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut" as const,
          },
        },
  };

  const orb2Variants = {
    animate: shouldReduceMotion
      ? {}
      : {
          x: [0, -50, 30, 0],
          y: [0, 40, -30, 0],
          scale: [1, 0.9, 1.1, 1],
          transition: {
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut" as const,
          },
        },
  };

  const orb3Variants = {
    animate: shouldReduceMotion
      ? {}
      : {
          x: [0, 30, -40, 0],
          y: [0, 50, -20, 0],
          scale: [1, 1.15, 0.9, 1],
          transition: {
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut" as const,
          },
        },
  };

  return (
    <div
      className="fixed inset-0 -z-20 overflow-hidden bg-[#061326]"
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(8,39,78,0.78),rgba(6,19,38,0.98))]" />

      <motion.div
        className="pointer-events-none absolute left-1/2 top-[42%] h-[680px] w-[1100px] -translate-x-1/2 -translate-y-1/2 [perspective:900px]"
        style={{ x: layerX, y: layerY }}
      >
        <div className="absolute inset-0 rounded-[50%] border border-blue-400/10 [transform:rotateX(62deg)_rotateZ(-18deg)] [box-shadow:0_0_80px_rgba(37,99,235,0.08),inset_0_0_80px_rgba(37,99,235,0.05)]" />
        <div className="absolute inset-[10%] rounded-[50%] border border-cyan-300/10 [transform:rotateX(62deg)_rotateZ(-18deg)]" />
        <div className="absolute left-[20%] top-[22%] h-24 w-44 rounded-2xl border border-cyan-300/20 bg-cyan-200/[0.03] shadow-[0_20px_80px_rgba(34,211,238,0.08)] [transform:rotateX(58deg)_rotateY(-16deg)_rotateZ(-18deg)]" />
        <div className="absolute bottom-[18%] right-[18%] h-20 w-36 rounded-2xl border border-blue-300/15 bg-blue-200/[0.03] shadow-[0_20px_80px_rgba(59,130,246,0.08)] [transform:rotateX(58deg)_rotateY(18deg)_rotateZ(-18deg)]" />
      </motion.div>
      
      {/* Blurred gradient orbs */}
      <motion.div
        variants={orb1Variants}
        animate="animate"
        className="absolute -left-20 -top-20 h-[500px] w-[500px] rounded-full bg-violet-600/12 blur-[130px] pointer-events-none"
      />

      <motion.div
        variants={orb2Variants}
        animate="animate"
        className="absolute right-[-100px] top-[150px] h-[600px] w-[600px] rounded-full bg-cyan-600/10 blur-[140px] pointer-events-none"
      />

      <motion.div
        variants={orb3Variants}
        animate="animate"
        className="absolute left-[20%] bottom-[-150px] h-[550px] w-[550px] rounded-full bg-blue-700/10 blur-[120px] pointer-events-none"
      />

      {/* Subtle digital atmosphere grid */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(rgba(125,211,252,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(96,165,250,0.035)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_100%)] pointer-events-none opacity-70"
      />

      {/* Diagonal light streak */}
      <div 
        className="absolute -left-1/4 top-1/4 h-[2px] w-[150%] rotate-[-12deg] bg-gradient-to-r from-transparent via-blue-500/10 to-transparent blur-[1px] pointer-events-none" 
      />
    </div>
  );
}

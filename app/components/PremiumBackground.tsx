"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export default function PremiumBackground() {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="fixed inset-0 -z-20 bg-[#050816]" />;
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
    <div className="fixed inset-0 -z-20 overflow-hidden bg-[#050816]">
      {/* Dynamic ambient dark overlay with noise/depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(15,23,42,0.6),rgba(5,8,22,0.95))]" />
      
      {/* Blurred gradient orbs */}
      <motion.div
        variants={orb1Variants}
        animate="animate"
        className="absolute -left-20 -top-20 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none"
      />

      <motion.div
        variants={orb2Variants}
        animate="animate"
        className="absolute right-[-100px] top-[150px] h-[600px] w-[600px] rounded-full bg-violet-600/10 blur-[140px] pointer-events-none"
      />

      <motion.div
        variants={orb3Variants}
        animate="animate"
        className="absolute left-[20%] bottom-[-150px] h-[550px] w-[550px] rounded-full bg-emerald-600/8 blur-[120px] pointer-events-none"
      />

      {/* Subtle digital atmosphere grid */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.007)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.007)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_100%)] pointer-events-none opacity-40" 
      />

      {/* Diagonal light streak */}
      <div 
        className="absolute -left-1/4 top-1/4 h-[2px] w-[150%] rotate-[-12deg] bg-gradient-to-r from-transparent via-blue-500/10 to-transparent blur-[1px] pointer-events-none" 
      />
    </div>
  );
}

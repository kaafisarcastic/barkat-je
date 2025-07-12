"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import type { ReactNode } from "react";

function RevealTextwithWipe({
  children,
  delay = 0,
  wipeColor = "#000000",
}: {
  children: ReactNode;
  delay?: number;
  wipeColor?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20% 0px" }); // trigger when 20% enters
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("show");
    }
  }, [isInView, controls]);

  return (
    <div ref={ref} className="relative inline-block overflow-hidden">
      {/* Wipe Animation */}
      <motion.span
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { x: "0%" },
          show: {
            x: "100%",
            transition: {
              duration: 0.3,
              delay,
              ease: "easeInOut",
            },
          },
        }}
        style={{
          backgroundColor: wipeColor,
        }}
        className="absolute inset-0 z-10"
      />

      {/* Text Reveal */}
      <motion.span
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0, x: -60 },
          show: {
            opacity: 1,
            x: 0,
            transition: {
              duration: 0.1,
              delay: delay + 0.2,
              ease: "easeOut",
            },
          },
        }}
        className="relative z-20"
      >
        {children}
      </motion.span>
    </div>
  );
}

export default RevealTextwithWipe;

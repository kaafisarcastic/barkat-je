"use client";

import React from "react";
import { motion, useAnimation, Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
type Props = {
  children: React.ReactNode;
  delay?: number;
  from?: "left" | "right";
};

function RevealonScroll({ children, delay = 0, from = "left" }: Props) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);
  const offsetX = from === "left" ? -50 : 50;
  const variants: Variants = {
    hidden: { opacity: 0, x: offsetX },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay,
      },
    },
  };
  //   const variants = {
  //     hidden: { opacity: 0, x: 40, y: 20 },
  //     visible: {
  //       opacity: 1,
  //       y: 0,
  //       transition: {
  //         duration: 0.6,
  //         ease: "easeOut",
  //         delay,
  //       },
  //     },
  //   };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

export default RevealonScroll;

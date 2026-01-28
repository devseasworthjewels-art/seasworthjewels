import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CustomCursor = () => {
  const cursorSize = 30; // Increased from 15 to 30
  const cursorZIndex = 10050; // Keep above all overlays and popups
  const mouse = {
    x: useMotionValue(0),
    y: useMotionValue(0),
  };

  const smoothOptions = { damping: 20, stiffness: 300, mass: 0.5 };
  const smoothMouse = {
    x: useSpring(mouse.x, smoothOptions),
    y: useSpring(mouse.y, smoothOptions),
  };

  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768); // Common breakpoint for tablets and below
    };

    checkIfMobile();

    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  useEffect(() => {
    if (isMobile) return; // Don't set up cursor events for mobile

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      mouse.x.set(clientX - cursorSize / 2);
      mouse.y.set(clientY - cursorSize / 2);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", handleMouseMove);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);

    const interactiveElements = document.querySelectorAll(
      'a, button, input, textarea, select, [role="button"]'
    );

    interactiveElements.forEach((element) => {
      element.addEventListener("mouseenter", () => setIsHovered(true));
      element.addEventListener("mouseleave", () => setIsHovered(false));
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener(
        "mouseenter",
        handleMouseEnter
      );
      document.documentElement.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );

      interactiveElements.forEach((element) => {
        element.removeEventListener("mouseenter", () => setIsHovered(true));
        element.removeEventListener("mouseleave", () => setIsHovered(false));
      });
    };
  }, [mouse.x, mouse.y, isMobile]);

  if (isMobile) {
    return null;
  }

  return (
    <motion.div
      className={`fixed left-0 top-0 rounded-full pointer-events-none z-[10050] mix-blend-difference ${
        isHovered ? "bg-white" : "bg-white"
      }`}
      style={{
        width: cursorSize,
        height: cursorSize,
        x: smoothMouse.x,
        y: smoothMouse.y,
        opacity: isVisible ? 1 : 0,
        scale: isHovered ? 1.8 : 1,
        transition:
          "scale 0.2s ease-out, opacity 0.2s ease-out, background 0.2s ease-out",
        // Ensure cursor stays above all other elements
        position: "fixed",
        willChange: "transform",
        transform: "translateZ(0)",
      }}
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-white/20"
        style={{ zIndex: cursorZIndex }}
        animate={{
          scale: isHovered ? 2.2 : 3.5,
          opacity: isHovered ? 0.4 : 0.25,
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeOut",
        }}
      />
    </motion.div>
  );
};

export default CustomCursor;

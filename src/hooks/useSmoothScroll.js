import { useEffect } from "react";
import Lenis from "lenis";

export const useSmoothScroll = () => {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Expose globally so components can pause/resume if needed
    if (typeof window !== "undefined") {
      window.__lenis = lenis;
    }

    // Animation frame
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    // Start the animation loop
    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      if (typeof window !== "undefined" && window.__lenis === lenis) {
        delete window.__lenis;
      }
      lenis.destroy();
    };
  }, []);
};

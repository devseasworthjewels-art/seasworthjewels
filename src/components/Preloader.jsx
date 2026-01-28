import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";

const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showContent, setShowContent] = useState(true);
  const progressRef = useRef(0);
  const animationRef = useRef();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      y: -50,
      transition: {
        duration: 0.8,
        ease: [0.83, 0, 0.17, 1],
        when: "afterChildren",
      },
    },
  };

  const wordVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.83, 0, 0.17, 1],
      },
    },
    exit: {
      y: -20,
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: [0.83, 0, 0.17, 1],
      },
    },
  };

  // Update progress number smoothly
  useEffect(() => {
    let startTime;
    const duration = 2000; // 2 seconds

    const updateProgress = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const progressPercent = Math.floor(progress * 100);
      progressRef.current = progressPercent;
      setProgress(progressPercent);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
      }
    };

    animationRef.current = requestAnimationFrame(updateProgress);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const progressBarVariants = {
    initial: { width: "0%" },
    animate: {
      width: "100%",
      transition: {
        duration: 2,
        ease: [0.65, 0, 0.35, 1],
      },
    },
  };

  const handleAnimationComplete = () => {
    setIsComplete(true);
    setTimeout(() => {
      setShowContent(false);
      if (onComplete) onComplete();
    }, 800);
  };

  return (
    <AnimatePresence mode="wait">
      {showContent && (
        <motion.div
          className="fixed inset-0 bg-white z-[9999] flex items-center justify-center flex-col px-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onAnimationComplete={handleAnimationComplete}
        >
          <div className="text-center mb-8 overflow-hidden">
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-light tracking-[0.25em] mb-2"
              variants={wordVariants}
            >
              SEASWORTH
            </motion.h1>
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-light tracking-[0.25em]"
              variants={wordVariants}
            >
              JEWELS
            </motion.h1>
          </div>

          <div className="w-full max-w-xs sm:max-w-md">
            <div className="h-px bg-gray-200 w-full relative overflow-hidden">
              <motion.div
                className="h-full bg-gray-900 origin-left"
                variants={progressBarVariants}
                initial="initial"
                animate="animate"
              />
            </div>
            <motion.div
              className="text-right text-sm text-gray-500 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {progress}%
            </motion.div>
          </div>

          <motion.div
            className="absolute bottom-8 text-xs text-gray-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            Handcrafted with excellence
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;

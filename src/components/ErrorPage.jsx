import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const errorMessages = {
  400: {
    title: "400 - Bad Request",
    message: "Your request could not be processed due to invalid input.",
    description: "Please verify your request and try again.",
    icon: "❌",
  },
  401: {
    title: "401 - Unauthorized",
    message: "You need to be logged in to access this page.",
    description: "Please sign in and try again.",
    icon: "🔒",
  },
  403: {
    title: "403 - Forbidden",
    message: "You do not have permission to access this resource.",
    description:
      "Please check your access privileges or contact support if you believe this is an error.",
    icon: "🚫",
  },
  404: {
    title: "404 - Page Not Found",
    message: "The page you are looking for does not exist.",
    description: "The requested URL was not found on this server.",
    icon: "",
  },
  500: {
    title: "500 - Server Error",
    message: "Something went wrong on our end.",
    description: "Our team has been notified. Please try again later.",
    icon: "",
  },
  502: {
    title: "502 - Bad Gateway",
    message: "The server received an invalid response.",
    description: "Please try again in a few moments.",
    icon: "",
  },
  503: {
    title: "503 - Service Unavailable",
    message: "The service is currently unavailable.",
    description: "We are performing maintenance. Please check back soon.",
    icon: "",
  },
  504: {
    title: "504 - Gateway Timeout",
    message: "The server did not respond in time.",
    description: "The connection timed out. Please try again.",
    icon: "",
  },
};

const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gray-100"
          style={{
            width: Math.random() * 20 + 10,
            height: Math.random() * 20 + 10,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: 0.1 + Math.random() * 0.2,
          }}
          animate={{
            y: [0, 100, 0],
            x: [0, Math.random() * 100 - 50, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 15 + Math.random() * 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

const ErrorPage = ({ statusCode = 404 }) => {
  const error = errorMessages[statusCode] || errorMessages["default"];
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden flex items-center justify-center p-4">
      <FloatingElements />

      <AnimatePresence>
        {isVisible && (
          <motion.div
            className="w-full max-w-3xl relative z-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-7xl mb-8"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 10,
                delay: 0.2,
              }}
            >
              {error.icon}
            </motion.div>

            <motion.h1
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {error.title}
            </motion.h1>

            <motion.p
              className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {error.message}
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="space-y-6 mb-8"
            >
              <p className="text-gray-500 max-w-2xl mx-auto">
                {error.description}
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/"
                  className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Return Home
                </Link>

                <a
                  href="mailto:support@seasworthjewels.com"
                  className="px-6 py-3 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Contact Support
                </a>
              </div>
            </motion.div>

            <motion.div
              className="mt-12 pt-6 border-t border-gray-100"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <p className="text-sm text-gray-500">
                Error Code:{" "}
                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-gray-700">
                  {statusCode}
                </span>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ErrorPage;

import { useState, useEffect, lazy, Suspense, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Collections from "./components/Collections.jsx";
import Footer from "./components/Footer.jsx";
import Preloader from "./components/Preloader.jsx";
import CustomCursor from "./components/CustomCursor";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { ProductProvider } from "./contexts/ProductContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";

const Shop = lazy(() => import("./components/Shop.jsx"));
const Contact = lazy(() => import("./components/Contact.jsx"));
const About = lazy(() => import("./components/About.jsx"));
const ProductDetail = lazy(() => import("./components/ProductDetail.jsx"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy.jsx"));
const TermsConditions = lazy(() => import("./components/TermsConditions.jsx"));
const ErrorPage = lazy(() => import("./components/ErrorPage.jsx"));

function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  // Normal scroll listener for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialize Lenis smooth scrolling
  useSmoothScroll();

  // Scroll to top on route change
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle route changes
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (prevPath.current !== location.pathname) {
      window.scrollTo({ top: 0, behavior: "instant" });
      prevPath.current = location.pathname;
    }
  }, [location.pathname]);

  return (
    <CurrencyProvider>
      <ProductProvider>
        {location.pathname === "/" && isLoading ? (
          <Preloader
            onComplete={() => {
              setIsLoading(false);
            }}
          />
        ) : (
          <div className="min-h-screen flex flex-col cursor-none">
            <CustomCursor />
            <Navbar />
            <main className="flex-1">
              <Suspense
                fallback={
                  <div className="p-8 text-center text-sm">Loading...</div>
                }
              >
                <Routes>
                  <Route
                    path="/"
                    element={
                      <>
                        <Hero />
                        <Collections />
                      </>
                    }
                  />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:slug" element={<ProductDetail />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route
                    path="/terms-conditions"
                    element={<TermsConditions />}
                  />
                  {/* Error Pages */}
                  <Route
                    path="/400"
                    element={
                      <Suspense fallback={<div>Loading...</div>}>
                        <ErrorPage statusCode={400} />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/401"
                    element={
                      <Suspense fallback={<div>Loading...</div>}>
                        <ErrorPage statusCode={401} />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/403"
                    element={
                      <Suspense fallback={<div>Loading...</div>}>
                        <ErrorPage statusCode={403} />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/500"
                    element={
                      <Suspense fallback={<div>Loading...</div>}>
                        <ErrorPage statusCode={500} />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/502"
                    element={
                      <Suspense fallback={<div>Loading...</div>}>
                        <ErrorPage statusCode={502} />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/503"
                    element={
                      <Suspense fallback={<div>Loading...</div>}>
                        <ErrorPage statusCode={503} />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/504"
                    element={
                      <Suspense fallback={<div>Loading...</div>}>
                        <ErrorPage statusCode={504} />
                      </Suspense>
                    }
                  />
                  {/* 404 - Catch all unmatched routes */}
                  <Route
                    path="*"
                    element={
                      <Suspense fallback={<div>Loading...</div>}>
                        <ErrorPage statusCode={404} />
                      </Suspense>
                    }
                  />
                </Routes>
                <Footer />
              </Suspense>
            </main>

            {/* Scroll to Top Button */}
            {showScrollTop && (
              <button
                onClick={scrollToTop}
                className="fixed bottom-8 right-8 z-40 w-12 h-12 bg-black/80 hover:bg-black text-white flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="Scroll to top"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
      </ProductProvider>
    </CurrencyProvider>
  );
}
export default App;

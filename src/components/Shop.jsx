import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../css/shop.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { parsePrice, getSortedProducts } from "../utils/shopUtils";
import { useProductContext } from "../contexts/ProductContext";
import { useCurrency } from "../contexts/CurrencyContext";
import Breadcrumb from "./Breadcrumb";
import SEO from "./SEO";

export default function Shop() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sortBy, setSortBy] = useState("default");
  const [activeCategory, setActiveCategory] = useState("Rings");
  const [viewMode, setViewMode] = useState("3"); // "3" or "4" columns
  const [retryCount, setRetryCount] = useState(0);

  // Get products and categories from context
  const {
    getProductsByCategory,
    loading: productsLoading,
    isInitialized,
    error: productsError,
    products: allProducts,
    categories, // Get dynamic categories
  } = useProductContext();

  // Get currency formatting function
  const { formatPrice } = useCurrency();

  // Category mapping - centralized to avoid duplication (useMemo to prevent recreating on every render)
  const categoryMap = useMemo(
    () => ({
      ring: "Rings",
      rings: "Rings",
      necklaces: "Necklaces",
      necklace: "Necklaces",
      bracelets: "Bracelets",
      bracelet: "Bracelets",
      earrings: "Earrings",
      earring: "Earrings",
    }),
    []
  );

  // Reverse mapping for URL parameters
  const categoryToUrlMap = useMemo(
    () => ({
      Rings: "ring",
      Necklaces: "necklaces",
      Bracelets: "bracelets",
      Earrings: "earrings",
    }),
    []
  );

  // Get products based on active category from cached data
  // Only get products if initialized to avoid empty results
  // The activeCategory is already synchronized with URL params via useEffect
  const categoryProducts = isInitialized
    ? getProductsByCategory(activeCategory.toLowerCase())
    : [];

  // No need for additional filtering - activeCategory already matches the URL
  const sortedProducts = getSortedProducts(categoryProducts, sortBy);

  // Show loading state
  const showLoading = !isInitialized && productsLoading;

  // Show error state or empty state
  const hasError = productsError && !productsLoading;
  const isEmpty = isInitialized && sortedProducts.length === 0;

  const productsRef = useRef([]);
  const categoriesStripRef = useRef(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // Debug logging
  useEffect(() => {
    console.log("Shop Debug Info:", {
      isInitialized,
      productsLoading,
      productsError,
      activeCategory,
      totalProducts: allProducts?.length || 0,
      categoryProducts: categoryProducts.length,
      sortedProducts: sortedProducts.length,
      urlCategory: searchParams.get("category"),
    });
  }, [
    isInitialized,
    productsLoading,
    activeCategory,
    categoryProducts.length,
    sortedProducts.length,
    searchParams,
    allProducts,
    productsError,
  ]);

  // Update active category when URL changes
  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      const newCategory = categoryMap[category.toLowerCase()] || "Rings";
      setActiveCategory(newCategory);
    } else {
      // Default to Rings if no category in URL
      setActiveCategory("Rings");
    }
  }, [searchParams]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
  }, []);

  useEffect(() => {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    productsRef.current.forEach((el) => {
      if (!el) return;

      gsap.fromTo(
        el,
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [sortedProducts]);

  const handleDragStart = (clientX) => {
    const strip = categoriesStripRef.current;
    if (!strip) return;
    isDraggingRef.current = true;
    startXRef.current = clientX - strip.offsetLeft;
    scrollLeftRef.current = strip.scrollLeft;
  };

  const handleDragMove = (clientX) => {
    if (!isDraggingRef.current) return;
    const strip = categoriesStripRef.current;
    if (!strip) return;
    const x = clientX - strip.offsetLeft;
    const walk = (x - startXRef.current) * 1.2;
    strip.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleDragEnd = () => {
    isDraggingRef.current = false;
  };

  const onMouseDown = (e) => {
    handleDragStart(e.clientX);
  };

  const onMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    e.preventDefault();
    handleDragMove(e.clientX);
  };

  const onMouseLeave = () => {
    handleDragEnd();
  };

  const onMouseUp = () => {
    handleDragEnd();
  };

  const onTouchStart = (e) => {
    if (!e.touches[0]) return;
    handleDragStart(e.touches[0].clientX);
  };

  const onTouchMove = (e) => {
    if (!e.touches[0]) return;
    handleDragMove(e.touches[0].clientX);
  };

  const onTouchEnd = () => {
    handleDragEnd();
  };

  const scrollStripByDirection = (direction) => {
    const strip = categoriesStripRef.current;
    if (!strip) return;

    const firstCard = strip.querySelector(".shop-category-card");
    if (!firstCard) return;

    const cardWidth = firstCard.offsetWidth + 24;
    const delta = direction === "right" ? cardWidth * 2 : -cardWidth * 2;
    const target = strip.scrollLeft + delta;

    gsap.to(strip, {
      scrollLeft: target,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  useEffect(() => {
    const strip = categoriesStripRef.current;
    if (!strip) return undefined;

    const step = () => {
      const currentStrip = categoriesStripRef.current;
      if (!currentStrip) return;
      if (isDraggingRef.current) return;

      const firstCard = currentStrip.querySelector(".shop-category-card");
      if (!firstCard) return;

      const cardWidth = firstCard.offsetWidth + 24;
      let target = currentStrip.scrollLeft + cardWidth * 2;
      const max = currentStrip.scrollWidth - currentStrip.clientWidth;

      if (target > max) {
        currentStrip.scrollLeft = 0;
        target = cardWidth * 2;
      }

      gsap.to(currentStrip, {
        scrollLeft: target,
        duration: 0.5,
        ease: "power3.out", // start fast, slow down at the end
      });
    };

    // 0.5s animation + ~1.5s pause between moves
    const intervalId = setInterval(step, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // SEO data based on active category
  const categorySEOData = {
    Rings: {
      title: `${activeCategory} - Seasworth Jewels | Custom Engagement & Wedding Rings`,
      description: `Shop exquisite ${activeCategory.toLowerCase()} at Seasworth Jewels. Browse our collection of custom engagement rings, wedding bands, and statement rings crafted with moissanite, diamonds, and precious metals.`,
      keywords: `${activeCategory.toLowerCase()}, engagement rings, wedding rings, custom rings, moissanite rings, diamond rings, gold rings, promise rings, eternity bands, Seasworth Jewels`,
    },
    Necklaces: {
      title: `${activeCategory} - Seasworth Jewels | Luxury Necklaces & Pendants`,
      description: `Discover stunning ${activeCategory.toLowerCase()} at Seasworth Jewels. Shop our collection of elegant necklaces, pendants, and chains in gold, silver, and precious gemstones.`,
      keywords: `${activeCategory.toLowerCase()}, necklaces, pendants, chains, diamond necklaces, gold necklaces, gemstone necklaces, luxury jewelry, Seasworth Jewels`,
    },
    Bracelets: {
      title: `${activeCategory} - Seasworth Jewels | Designer Bracelets & Bangles`,
      description: `Browse beautiful ${activeCategory.toLowerCase()} at Seasworth Jewels. Shop our collection of designer bracelets, bangles, and tennis bracelets in gold, silver, and diamonds.`,
      keywords: `${activeCategory.toLowerCase()}, bracelets, bangles, tennis bracelets, charm bracelets, gold bracelets, diamond bracelets, luxury jewelry, Seasworth Jewels`,
    },
    Earrings: {
      title: `${activeCategory} - Seasworth Jewels | Elegant Earrings & Studs`,
      description: `Shop elegant ${activeCategory.toLowerCase()} at Seasworth Jewels. Discover our collection of earrings, studs, hoops, and drop earrings crafted with diamonds and precious metals.`,
      keywords: `${activeCategory.toLowerCase()}, earrings, studs, hoops, drop earrings, diamond earrings, gold earrings, luxury jewelry, Seasworth Jewels`,
    },
  };

  const currentSEO = categorySEOData[activeCategory] || categorySEOData.Rings;

  // Structured data for product collection
  const shopStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${activeCategory} Collection - Seasworth Jewels`,
    description: currentSEO.description,
    url: `https://seasworthjewels.com/shop?category=${categoryToUrlMap[activeCategory] || "ring"}`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://seasworthjewels.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Shop",
          item: "https://seasworthjewels.com/shop",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: activeCategory,
        },
      ],
    },
    numberOfItems: sortedProducts.length,
  };

  return (
    <div className="shop-page">
      <SEO
        title={currentSEO.title}
        description={currentSEO.description}
        keywords={currentSEO.keywords}
        canonicalUrl={`https://seasworthjewels.com/shop?category=${categoryToUrlMap[activeCategory] || "ring"}`}
        structuredData={shopStructuredData}
      />
      {/* Simple Page Header */}
      <div className="shop-page-header">
        <div className="shop-header-content">
          <Breadcrumb
            items={[{ label: "Home", path: "/" }, { label: "Shop" }]}
          />
        </div>
      </div>

      {/* Categories section */}
      <section className="shop-categories-section">
        <div className="shop-categories-static">
          {categories.map((item) => (
            <div
              key={item.label}
              className={`shop-category-card ${
                activeCategory === item.label ? "shop-category-card-active" : ""
              }`}
              onClick={() => {
                setActiveCategory(item.label);
                // Update URL without page reload
                const url = new URL(window.location);
                const categoryParam = categoryToUrlMap[item.label] || "ring";
                url.searchParams.set("category", categoryParam);
                window.history.pushState({}, "", url);
              }}
            >
              <div className="shop-category-image-wrap">
                <img
                  src={item.image}
                  alt={item.label}
                  className="shop-category-image"
                />
              </div>
              <div className="shop-category-label">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Mobile-only strip with drag-to-scroll */}
        <div
          className="shop-categories-strip"
          ref={categoriesStripRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="shop-categories-track">
            {[...categories, ...categories].map((item, index) => (
              <div
                key={`${item.label}-${index}`}
                className={`shop-category-card ${
                  activeCategory === item.label
                    ? "shop-category-card-active"
                    : ""
                }`}
                onClick={() => {
                  setActiveCategory(item.label);
                  // Update URL without page reload
                  const url = new URL(window.location);
                  const categoryParam = categoryToUrlMap[item.label] || "ring";
                  url.searchParams.set("category", categoryParam);
                  window.history.pushState({}, "", url);
                }}
              >
                <div className="shop-category-image-wrap">
                  <img
                    src={item.image}
                    alt={item.label}
                    className="shop-category-image"
                  />
                </div>
                <div className="shop-category-label">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="shop-products-section">
        <div className="shop-products-header">
          <div className="shop-products-results">
            {showLoading
              ? "Loading..."
              : `Showing ${sortedProducts.length} results`}
          </div>
          <div className="shop-products-controls">
            <span className="shop-products-sort-label">Sort by</span>
            <select
              className="shop-products-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Default sorting</option>
              <option value="price-low-high">Sort by price: low to high</option>
              <option value="price-high-low">Sort by price: high to low</option>
            </select>
            <div className="shop-products-view-icons">
              <button
                type="button"
                className={`shop-view-icon ${
                  viewMode === "3" ? "shop-view-icon-active" : ""
                }`}
                onClick={() => setViewMode("3")}
                aria-label="3 column view"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="3"
                    y="4"
                    width="5"
                    height="6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="9.5"
                    y="4"
                    width="5"
                    height="6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="16"
                    y="4"
                    width="5"
                    height="6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="3"
                    y="13"
                    width="5"
                    height="6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="9.5"
                    y="13"
                    width="5"
                    height="6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="16"
                    y="13"
                    width="5"
                    height="6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </button>
              <button
                type="button"
                className={`shop-view-icon ${
                  viewMode === "4" ? "shop-view-icon-active" : ""
                }`}
                onClick={() => setViewMode("4")}
                aria-label="4 column view"
              >
                ▦
              </button>
            </div>
          </div>
        </div>

        {showLoading ? (
          <div
            className="shop-products-loading"
            style={{
              minHeight: "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            <p style={{ color: "#666", fontSize: "0.9rem" }}>
              Loading products...
            </p>
          </div>
        ) : hasError ? (
          <div
            className="shop-products-error"
            style={{
              minHeight: "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <p
              style={{ color: "#d32f2f", fontSize: "1rem", fontWeight: "500" }}
            >
              ⚠️ Error loading products
            </p>
            <p style={{ color: "#666", fontSize: "0.9rem" }}>
              {productsError || "Something went wrong. Please try again."}
            </p>
            <button
              type="button"
              onClick={() => {
                window.location.reload();
              }}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: "#000",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: "500",
              }}
            >
              Retry
            </button>
          </div>
        ) : isEmpty ? (
          <div
            className="shop-products-empty"
            style={{
              minHeight: "400px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <p style={{ color: "#666", fontSize: "1rem" }}>
              No products found in {activeCategory}.
            </p>
            <p style={{ color: "#999", fontSize: "0.85rem" }}>
              Try selecting a different category or check back later.
            </p>
          </div>
        ) : (
          <div
            className={`shop-products-grid ${
              viewMode === "4" ? "shop-products-grid-4" : ""
            }`}
          >
            {sortedProducts.map((product, index) => (
              <article
                key={product.id}
                className="shop-product-card"
                ref={(el) => {
                  productsRef.current[index] = el;
                }}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "instant" });
                  navigate(`/product/${product.slug}`);
                }}
              >
                <div className="shop-product-image-wrap">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="shop-product-image"
                  />
                </div>
                <div className="shop-product-meta">
                  <div className="shop-product-category">
                    {activeCategory.toUpperCase()}
                  </div>
                  <h3 className="shop-product-name">{product.name}</h3>
                  <div className="shop-product-price">
                    {formatPrice(product.basePrice || product.price || 0)}
                  </div>
                  <button
                    type="button"
                    className="shop-product-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.scrollTo({ top: 0, behavior: "instant" });
                      navigate(`/product/${product.slug}`);
                    }}
                  >
                    VIEW DETAILS
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

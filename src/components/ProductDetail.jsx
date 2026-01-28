import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import whatsappIcon from "../assets/whatsapp.png";
import SearchableSizeDropdown from "./SearchableSizeDropdown";
import EnquiryModal from "./EnquiryModal";
import { submitEnquiry } from "../utils/enquiryService";
import { useProductContext } from "../contexts/ProductContext";
import { useCurrency } from "../contexts/CurrencyContext";
import { getProductImages } from "../services/productService";
import Breadcrumb from "./Breadcrumb";
import SEO from "./SEO";
import "../css/productDetail.css";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { getProductBySlug, fetchProductBySlug, loading, isInitialized } =
    useProductContext();

  // Get currency formatting function
  const { formatPrice: formatPriceUSD } = useCurrency();

  // ============ ALL STATE HOOKS (MUST BE FIRST) ============
  const [product, setProduct] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [metalColor, setMetalColor] = useState("Yellow");
  const [karat, setKarat] = useState("10K");
  const [stoneType, setStoneType] = useState("Moissanite");
  const [diamondShape, setDiamondShape] = useState("Pear");
  const [caratStep, setCaratStep] = useState(1);
  const [size, setSize] = useState("4.5");
  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [showFullscreenGallery, setShowFullscreenGallery] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [enquiryMode, setEnquiryMode] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [containerRect, setContainerRect] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });

  // ============ ALL useEffect HOOKS ============
  // Fetch product when slug changes
  useEffect(() => {
    async function loadProduct() {
      const cachedProduct = getProductBySlug(slug);
      if (cachedProduct) {
        setProduct(cachedProduct);
        setFetchError(null);
        return;
      }

      if (isInitialized) {
        setIsFetching(true);
        try {
          const fetchedProduct = await fetchProductBySlug(slug);
          setProduct(fetchedProduct);
          setFetchError(fetchedProduct ? null : "Product not found");
        } catch (err) {
          console.error("Error loading product:", err);
          setFetchError(err.message || "Failed to load product");
        } finally {
          setIsFetching(false);
        }
      }
    }

    loadProduct();
  }, [slug, getProductBySlug, fetchProductBySlug, isInitialized]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    // Reset to default karat (10K) when product changes
    setKarat("10K");
  }, [slug]);

  // Update gallery images when metal color or product changes
  useEffect(() => {
    const galleryImages = product ? getProductImages(product, metalColor) : [];
    if (product && galleryImages.length > 0) {
      setActiveImage(galleryImages[0]);
    }
  }, [metalColor, product]);

  // Detect if the device is a touch device
  useEffect(() => {
    const checkTouchDevice = () => {
      const isTouch =
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0;
      setIsTouchDevice(isTouch);
    };

    checkTouchDevice();
    window.addEventListener("resize", checkTouchDevice);
    return () => window.removeEventListener("resize", checkTouchDevice);
  }, []);

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const goToPreviousImage = useCallback(() => {
    const galleryImages = product ? getProductImages(product, metalColor) : [];
    setCurrentImageIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  }, [product, metalColor]);

  const goToNextImage = useCallback(() => {
    const galleryImages = product ? getProductImages(product, metalColor) : [];
    setCurrentImageIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  }, [product, metalColor]);

  // Handle keyboard navigation in fullscreen gallery
  useEffect(() => {
    if (!showFullscreenGallery) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        goToPreviousImage();
      } else if (e.key === "ArrowRight") {
        goToNextImage();
      } else if (e.key === "Escape") {
        setShowFullscreenGallery(false);
        document.body.style.overflow = "";
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showFullscreenGallery, goToPreviousImage, goToNextImage]);

  // ============ useCallback HOOKS ============
  const handleMouseEnter = useCallback(
    (e) => {
      if (isTouchDevice) return;

      const container = e.currentTarget;
      const rect = container.getBoundingClientRect();
      const img = container.querySelector("img");

      if (img.complete) {
        setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
      } else {
        img.onload = () => {
          setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
        };
      }

      setContainerRect({
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
      });
      setShowZoom(true);
    },
    [isTouchDevice]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!showZoom || isTouchDevice) return;

      const container = e.currentTarget;
      const rect = container.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const xPercent = Math.min(100, Math.max(0, (x / rect.width) * 100));
      const yPercent = Math.min(100, Math.max(0, (y / rect.height) * 100));

      setZoomPosition({ x: xPercent, y: yPercent });
    },
    [showZoom, isTouchDevice]
  );

  // Initialize defaults when product loads
  useEffect(() => {
    if (product) {
      // Initialize Stone Type
      if (
        product.options?.stoneType?.length > 0 &&
        !product.options.stoneType.includes(stoneType)
      ) {
        setStoneType(product.options.stoneType[0]);
      }

      // Initialize Size
      if (
        product.sizeOptions?.length > 0 &&
        !product.sizeOptions.includes(size)
      ) {
        setSize(product.sizeOptions[0]);
      }
    }
  }, [product, stoneType, size]);

  // ============ PRICE CALCULATION (MUST BE BEFORE CONDITIONAL RETURNS) ============
  // Variable pricing multipliers
  const karatMultipliers = {
    "10K": 0.8,
    "14K": 1.0,
    "18K": 1.3,
  };

  const currentPrice = useMemo(() => {
    console.log(
      "Calculating price for karat:",
      karat,
      "product:",
      product?.name
    );

    // Use basePrice from product (added in migration) or fallback
    const basePrice = product?.basePrice || product?.price || 50000;

    // Normalize karat string: remove 'T' suffix if present (e.g., "14KT" -> "14K")
    const normalizedKarat = karat.replace(/T$/i, "");
    console.log("Normalized karat from", karat, "to", normalizedKarat);

    // 1. Try to use explicit price for the selected karat
    if (product?.prices && product.prices[normalizedKarat]) {
      console.log("Using explicit price:", product.prices[normalizedKarat]);
      return product.prices[normalizedKarat];
    }

    // 2. Fallback to multiplier logic
    const karatMultiplier = karatMultipliers[normalizedKarat] || 1;
    const totalMultiplier = karatMultiplier;
    const calculatedPrice =
      Math.round((basePrice * totalMultiplier) / 100) * 100;

    console.log(
      "Using multiplier logic - base:",
      basePrice,
      "multiplier:",
      totalMultiplier,
      "result:",
      calculatedPrice
    );
    return calculatedPrice;
  }, [karat, product]);

  const formatPrice = (price) => {
    return formatPriceUSD(price);
  };

  // ============ NOW WE CAN DO CONDITIONAL RETURNS ============
  const error = fetchError;
  const galleryImages = product ? getProductImages(product, metalColor) : [];

  // Show loading state if products are still loading or fetching individual product
  if (loading || isFetching || (!product && !error)) {
    return (
      <div
        className="pdp-page pdp-loading"
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        <p style={{ color: "#666", fontSize: "0.9rem" }}>Loading product...</p>
      </div>
    );
  }

  // Show error state
  if (error && !loading && !isFetching) {
    return (
      <div className="pdp-page pdp-not-found">
        <div className="pdp-inner">
          <p>
            {error ? `Error loading product: ${error}` : "Product not found."}
          </p>
          <button
            type="button"
            className="pdp-back-button"
            onClick={() => navigate("/shop")}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#000",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.9rem",
              transition: "all 0.2s ease",
            }}
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  // ============ REST OF THE LOGIC (AFTER ALL HOOKS) ============
  const zoomFactor = 2;

  const metalTypeText = `${karat} ${metalColor} Gold`;

  const handleMouseLeave = () => {
    setShowZoom(false);
  };

  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleShare = async () => {
    const productUrl = window.location.href;
    const shareData = {
      title: product.name,
      text: `Check out this beautiful ${product.name} from Seasworth Jewels!`,
      url: productUrl,
    };

    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare(shareData)
    ) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error sharing:", err);
        }
      }
    }

    try {
      await navigator.clipboard.writeText(productUrl);
      const shareBtn = document.querySelector(".pdp-share-btn");
      if (shareBtn) {
        const originalText =
          shareBtn.querySelector("span")?.textContent || "Share";
        shareBtn.querySelector("span").textContent = "Copied!";
        shareBtn.classList.add("pdp-share-btn-success");
        setTimeout(() => {
          shareBtn.querySelector("span").textContent = originalText;
          shareBtn.classList.remove("pdp-share-btn-success");
        }, 2000);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
      alert(`Share this product:\n${productUrl}`);
    }
  };

  const openFullscreenGallery = (index) => {
    setCurrentImageIndex(index);
    setShowFullscreenGallery(true);
    document.body.style.overflow = "hidden";
  };

  const closeFullscreenGallery = () => {
    setShowFullscreenGallery(false);
    document.body.style.overflow = "";
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      goToNextImage();
    }
    if (isRightSwipe) {
      goToPreviousImage();
    }
  };

  const handleOpenEnquiryModal = (mode) => {
    setEnquiryMode(mode);
    setShowEnquiryModal(true);
  };

  const handleEnquirySubmit = async (customerData) => {
    // OPTIMIZATION: Close modal immediately for better UX
    setShowEnquiryModal(false);

    // Show immediate feedback for Buy Now
    if (enquiryMode === "buynow") {
      setShowConfirmation(true);
    }

    try {
      const customizations = {
        metalColor,
        karat,
        stoneType,
        diamondShape,
        caratStep,
        size,
        quantity,
      };

      const result = await submitEnquiry(
        customerData,
        product,
        customizations,
        enquiryMode
      );

      if (enquiryMode === "whatsapp") {
        const whatsappUrl = `https://wa.me/447833814871?text=${encodeURIComponent(result.whatsappMessage)}`;
        window.open(whatsappUrl, "_blank");
      } else {
        // Confirmation already shown, keep it for 5 seconds
        setTimeout(() => {
          setShowConfirmation(false);
        }, 5000);
      }
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      // Hide confirmation if there was an error
      setShowConfirmation(false);
      alert("Failed to submit enquiry. Please try again.");
    }
  };

  // Product SEO structured data
  const productStructuredData = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description:
          product.description ||
          `${product.name} from Seasworth Jewels. Available in multiple metal types, carat weights, and stone options.`,
        image: galleryImages,
        brand: {
          "@type": "Brand",
          name: "Seasworth Jewels",
        },
        offers: {
          "@type": "Offer",
          url: `https://seasworthjewels.com/product/${slug}`,
          priceCurrency: "USD",
          price: currentPrice,
          availability: "https://schema.org/InStock",
          priceValidUntil: new Date(
            new Date().setFullYear(new Date().getFullYear() + 1)
          )
            .toISOString()
            .split("T")[0],
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.8",
          reviewCount: "147",
        },
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
              name: product.name,
            },
          ],
        },
      }
    : null;

  return (
    <div className="pdp-page">
      {product && (
        <SEO
          title={`${product.name} - Seasworth Jewels | ${stoneType} ${metalColor} Gold Jewelry`}
          description={`Shop ${product.name} at Seasworth Jewels. Available in ${karat} ${metalColor} Gold with ${stoneType} stone. Premium quality jewelry with free shipping and secure checkout.`}
          keywords={`${product.name}, Seasworth Jewels, ${product.category}, ${stoneType} jewelry, ${metalColor} gold, ${karat} gold, custom jewelry, luxury jewelry, buy ${product.name} online`}
          canonicalUrl={`https://seasworthjewels.com/product/${slug}`}
          ogImage={galleryImages[0] || "/original.png"}
          ogType="product"
          structuredData={productStructuredData}
        />
      )}
      <div className="pdp-inner">
        {/* Breadcrumb and Share */}
        <div className="pdp-header-row">
          <Breadcrumb
            items={[
              { label: "Home", path: "/" },
              { label: "Shop", path: "/shop" },
              { label: product.name },
            ]}
          />
          <button
            type="button"
            className="pdp-share-btn"
            aria-label="Share"
            onClick={handleShare}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pdp-share-icon"
            >
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
            <span>Share</span>
          </button>
        </div>

        <div className="pdp-main">
          {/* Left: Gallery */}
          <div className="pdp-gallery">
            <div className="pdp-gallery-container">
              <div
                className={`pdp-gallery-main ${isTouchDevice ? "touch-device" : ""}`}
                onMouseEnter={!isTouchDevice ? handleMouseEnter : undefined}
                onMouseLeave={!isTouchDevice ? handleMouseLeave : undefined}
                onMouseMove={!isTouchDevice ? handleMouseMove : undefined}
                onClick={(e) => {
                  if (isMobile) {
                    e.preventDefault();
                    const currentIndex = galleryImages.findIndex(
                      (img) => img === activeImage
                    );
                    openFullscreenGallery(currentIndex >= 0 ? currentIndex : 0);
                  } else if (isTouchDevice) {
                    e.preventDefault();
                    if (!showZoom) {
                      handleMouseEnter(e);
                    } else {
                      setShowZoom(false);
                    }
                  }
                }}
              >
                <div className="pdp-gallery-main-inner">
                  <img
                    src={activeImage}
                    alt={product.name}
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                </div>
              </div>
              {showZoom && (
                <div
                  className="zoom-view"
                  style={{
                    backgroundImage: `url(${activeImage})`,
                    backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    backgroundSize: `${imageSize.width * zoomFactor}px ${imageSize.height * zoomFactor}px`,
                    backgroundRepeat: "no-repeat",
                    position: "fixed",
                    left: `calc(50% + 220px)`,
                    top: "120px",
                    width: "400px",
                    height: "400px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    overflow: "hidden",
                    zIndex: 1000,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    transform: "translateZ(0)",
                    pointerEvents: "none",
                    display: showZoom ? "block" : "none",
                  }}
                />
              )}
              <div className="pdp-gallery-thumbs">
                {galleryImages.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    className={`pdp-thumb ${activeImage === img ? "pdp-thumb-active" : ""}`}
                    onClick={() => {
                      if (isMobile) {
                        openFullscreenGallery(index);
                      } else {
                        setActiveImage(img);
                      }
                    }}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="pdp-details">
            <h1 className="pdp-title">{product.name}</h1>

            <div className="pdp-price-block">
              <div className="pdp-price-current">
                {formatPrice(currentPrice)}
              </div>
              <div className="pdp-price-row">
                <span className="pdp-price-note">Including All Taxes</span>
              </div>
              <div className="pdp-shipping-line">
                Shipping Charges: <span>Free</span>
              </div>
            </div>

            {/* Metal Type Section */}
            <div className="pdp-section">
              <div className="pdp-label-row">
                <span className="pdp-label">Metal Type:</span>
                <span className="pdp-selected-value">{metalTypeText}</span>
              </div>

              {/* Metal Color Selection */}
              <div className="pdp-metal-color-options">
                <button
                  type="button"
                  className={`pdp-metal-color-btn ${metalColor === "Yellow" ? "pdp-metal-color-btn-active" : ""}`}
                  onClick={() => setMetalColor("Yellow")}
                >
                  <div className="metal-color-circle yellow"></div>
                  <span>Yellow Gold</span>
                </button>
                <button
                  type="button"
                  className={`pdp-metal-color-btn ${metalColor === "Rose" ? "pdp-metal-color-btn-active" : ""}`}
                  onClick={() => setMetalColor("Rose")}
                >
                  <div className="metal-color-circle rose"></div>
                  <span>Rose Gold</span>
                </button>
                <button
                  type="button"
                  className={`pdp-metal-color-btn ${metalColor === "White" ? "pdp-metal-color-btn-active" : ""}`}
                  onClick={() => setMetalColor("White")}
                >
                  <div className="metal-color-circle white"></div>
                  <span>White Gold</span>
                </button>
              </div>

              {/* Karat Selection */}
              <div className="pdp-chip-row">
                {(product.options?.metalKarats || ["10K", "14K", "18K"]).map(
                  (karatOption) => (
                    <button
                      key={karatOption}
                      type="button"
                      className={`pdp-chip ${karat.replace(/T$/i, "") === karatOption.replace(/T$/i, "") ? "pdp-chip-active" : ""}`}
                      onClick={() => {
                        console.log(
                          "Karat clicked:",
                          karatOption,
                          "Current:",
                          karat
                        );
                        setKarat(karatOption);
                      }}
                    >
                      {karatOption}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Variable Pricing Notice */}
            <div className="pdp-variable-pricing-notice">
              <span>Below Customizable options with variable pricing</span>
            </div>

            {/* Carat weight - Conditional Render */}
            {product.options?.caratWeight?.length > 0 && (
              <div className="pdp-section">
                <div className="pdp-label-row">
                  <span className="pdp-label">Carat Weight:</span>
                  <span className="pdp-selected-value">
                    {product.options.caratWeight[caratStep - 1] ||
                      product.options.caratWeight[0]}
                  </span>
                </div>
                <div className="pdp-carat-slider">
                  <input
                    type="range"
                    min="1"
                    max={product.options.caratWeight.length}
                    step="1"
                    value={caratStep}
                    onChange={(e) => setCaratStep(Number(e.target.value))}
                  />
                  <div className="pdp-carat-range-labels">
                    {product.options.caratWeight.map((opt, index) => (
                      <span
                        key={index}
                        className={caratStep === index + 1 ? "active" : ""}
                        onClick={() => setCaratStep(index + 1)}
                        style={{ cursor: "pointer" }}
                      >
                        {opt}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Stone type - Conditional Render */}
            {product.options?.stoneType?.length > 0 && (
              <div className="pdp-section">
                <div className="pdp-label-row">
                  <span className="pdp-label">Stone Type: </span>
                  <span className="pdp-selected-value">{stoneType}</span>
                </div>
                <div className="pdp-chip-row">
                  {product.options.stoneType.map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`pdp-chip ${stoneType === type ? "pdp-chip-active" : ""}`}
                      onClick={() => setStoneType(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size - Conditional Render */}
            {product.sizeOptions?.length > 0 && (
              <div className="pdp-section pdp-size-section">
                <div className="pdp-option">
                  <SearchableSizeDropdown
                    value={size}
                    onChange={setSize}
                    sizes={product.sizeOptions}
                  />
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="pdp-section">
              <div className="pdp-option">
                <label className="pdp-label">Quantity</label>
                <div className="pdp-qty">
                  <button
                    type="button"
                    className="pdp-qty-btn"
                    onClick={decreaseQty}
                  >
                    -
                  </button>
                  <span className="pdp-qty-value">{quantity}</span>
                  <button
                    type="button"
                    className="pdp-qty-btn"
                    onClick={increaseQty}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="pdp-actions">
              <button
                type="button"
                className="pdp-btn whatsapp-btn"
                onClick={() => handleOpenEnquiryModal("whatsapp")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "0.6rem 1.2rem",
                }}
              >
                <img
                  src={whatsappIcon}
                  alt="WhatsApp"
                  style={{
                    width: "24px",
                    height: "24px",
                    objectFit: "contain",
                    filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.1))",
                  }}
                />
                <span>More on WhatsApp</span>
              </button>
              <button
                type="button"
                className="pdp-btn secondary"
                onClick={() => handleOpenEnquiryModal("buynow")}
              >
                Buy Now
              </button>
            </div>

            <div className="pdp-meta-grid">
              <div>
                <span className="pdp-meta-label">Brand:</span> Seasworth Jewels
              </div>
            </div>
          </div>
        </div>

        {/* Lower section */}
        <div className="pdp-lower">
          <div className="pdp-description">
            <h2>Description:</h2>
            <p>
              {product.description ||
                "This stunning piece combines ethical craftsmanship with timeless design. Its refined structure creates a sophisticated accessory that enhances any ensemble with subtle brilliance. Ideal for those who value elegance and sustainability in their jewellery."}
            </p>
          </div>
        </div>
      </div>

      {/* Full-screen Gallery for Mobile */}
      {showFullscreenGallery && (
        <div
          className="pdp-fullscreen-gallery"
          onClick={closeFullscreenGallery}
        >
          <button
            type="button"
            className="pdp-gallery-close"
            onClick={(e) => {
              e.stopPropagation();
              closeFullscreenGallery();
            }}
            aria-label="Close gallery"
          >
            ✕
          </button>

          <div
            className="pdp-gallery-image-container"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <img
              src={galleryImages[currentImageIndex]}
              alt={`${product.name} ${currentImageIndex + 1}`}
              className="pdp-gallery-fullscreen-image"
            />
          </div>

          <button
            type="button"
            className="pdp-gallery-arrow pdp-gallery-arrow-left"
            onClick={(e) => {
              e.stopPropagation();
              goToPreviousImage();
            }}
            aria-label="Previous image"
          >
            ‹
          </button>

          <button
            type="button"
            className="pdp-gallery-arrow pdp-gallery-arrow-right"
            onClick={(e) => {
              e.stopPropagation();
              goToNextImage();
            }}
            aria-label="Next image"
          >
            ›
          </button>

          <div className="pdp-gallery-counter">
            {currentImageIndex + 1} / {galleryImages.length}
          </div>
        </div>
      )}

      {/* Enquiry Modal */}
      {showEnquiryModal && (
        <EnquiryModal
          isOpen={showEnquiryModal}
          onClose={() => setShowEnquiryModal(false)}
          onSubmit={handleEnquirySubmit}
          mode={enquiryMode}
        />
      )}

      {/* Confirmation Message */}
      {showConfirmation && (
        <div className="enquiry-confirmation">
          <div className="enquiry-confirmation-content">
            <div className="enquiry-confirmation-icon">✓</div>
            <p>Thank you! We&apos;ll contact you soon.</p>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useMemo, useState, useRef } from "react";

/**
 * SizeSelector
 *
 * Desktop / laptop:
 *  - Dial-like vertical scroller with a center indicator line.
 *  - User can scroll or click on a size; the size closest to the center is "selected".
 *
 * Mobile:
 *  - Simple number input.
 *  - Shows the nearest available size suggestion as the user types.
 */

const DEFAULT_SIZES = Array.from({ length: 33 }, (_, i) => 8 + i); // 8–40 inclusive

export default function SizeSelector({
  sizes = DEFAULT_SIZES,
  value,
  onChange,
  label = "Size",
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(
    value ?? sizes[Math.floor(sizes.length / 2)] ?? null
  );

  const scrollContainerRef = useRef(null);

  // Keep local + parent value in sync
  useEffect(() => {
    if (value == null) return;
    setInternalValue(value);
  }, [value]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sortedSizes = useMemo(() => [...sizes].sort((a, b) => a - b), [sizes]);

  const handleSelectSize = (size) => {
    setInternalValue(size);
  };

  const nearestSize = (target) => {
    if (!sortedSizes.length || target == null || Number.isNaN(target)) {
      return null;
    }
    let best = sortedSizes[0];
    let bestDiff = Math.abs(sortedSizes[0] - target);
    for (let i = 1; i < sortedSizes.length; i += 1) {
      const diff = Math.abs(sortedSizes[i] - target);
      if (diff < bestDiff) {
        bestDiff = diff;
        best = sortedSizes[i];
      }
    }
    return best;
  };

  // When user scrolls the dial, snap to nearest item & update value
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;

    let closest = null;
    let closestDist = Infinity;

    const items = Array.from(container.querySelectorAll(".size-selector-item"));

    items.forEach((el) => {
      const elRect = el.getBoundingClientRect();
      const elCenter = elRect.top + elRect.height / 2;
      const dist = Math.abs(elCenter - centerY);
      if (dist < closestDist) {
        closestDist = dist;
        closest = el;
      }
    });

    if (closest && closest.dataset.size) {
      const selectedSize = Number(closest.dataset.size);
      if (!Number.isNaN(selectedSize)) {
        handleSelectSize(selectedSize);
      }
    }
  };

  // Mouse wheel handler for desktop – scroll the dial only, not the page
  const handleWheel = (event) => {
    if (isMobile) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    event.preventDefault();
    container.scrollTop += event.deltaY;
    handleScroll();
  };

  // When the popup opens on desktop, scroll so the current size is centered
  useEffect(() => {
    if (!isOpen || isMobile) return;
    const container = scrollContainerRef.current;
    if (!container || internalValue == null) return;

    const activeEl = container.querySelector(
      `.size-selector-item[data-size="${internalValue}"]`
    );
    if (!activeEl) return;

    const containerRect = container.getBoundingClientRect();
    const itemRect = activeEl.getBoundingClientRect();
    const offset =
      itemRect.top -
      containerRect.top -
      containerRect.height / 2 +
      itemRect.height / 2;

    container.scrollTop += offset;
  }, [isOpen, isMobile, internalValue]);

  // Lock background scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    const lenis = window.__lenis;

    if (lenis && typeof lenis.stop === "function") {
      lenis.stop();
    }

    document.body.style.overflow = "hidden";
    return () => {
      if (lenis && typeof lenis.start === "function") {
        lenis.start();
      }
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  // Additionally block page scrolling (including Lenis) while popup is open.
  // Use capture phase so we run before any passive wheel listeners.
  useEffect(() => {
    if (!isOpen || isMobile) return;

    const blockScroll = (event) => {
      // Always prevent default scroll when modal is open.
      // The inner dial handles its own scrollTop updates.
      event.preventDefault();
    };

    document.addEventListener("wheel", blockScroll, {
      passive: false,
      capture: true,
    });
    document.addEventListener("touchmove", blockScroll, {
      passive: false,
      capture: true,
    });

    return () => {
      document.removeEventListener("wheel", blockScroll, { capture: true });
      document.removeEventListener("touchmove", blockScroll, { capture: true });
    };
  }, [isOpen, isMobile]);

  return (
    <>
      {/* Trigger field shown in PDP */}
      <button
        type="button"
        className="size-trigger"
        onClick={() => setIsOpen(true)}
      >
        <span className="size-trigger-label">{label}</span>
        <span className="size-trigger-value">
          {value != null ? value : (internalValue ?? "Select")}
        </span>
      </button>

      {/* Popup overlay */}
      {isOpen && (
        <div className="size-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="size-modal" onClick={(e) => e.stopPropagation()}>
            <div className="size-modal-header">
              <span className="size-modal-title">{label}</span>
              <button
                type="button"
                className="size-modal-close"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* Desktop / laptop: dial style */}
            {!isMobile && (
              <div className="size-modal-body">
                <div className="size-selector-dial">
                  <div className="size-selector-window" onWheel={handleWheel}>
                    <div className="size-selector-center-line" />
                    <div
                      ref={scrollContainerRef}
                      className="size-selector-track"
                      onScroll={handleScroll}
                    >
                      {sortedSizes.map((size) => (
                        <button
                          key={size}
                          type="button"
                          data-size={size}
                          className={`size-selector-item${
                            internalValue === size
                              ? " size-selector-item-active"
                              : ""
                          }`}
                          onClick={() => handleSelectSize(size)}
                        >
                          <span className="size-tick" />
                          <span className="size-value">{size}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile: numeric input with suggestions */}
            {isMobile && (
              <div className="size-modal-body">
                <div className="size-selector-mobile">
                  <div className="size-input-row">
                    <input
                      type="number"
                      className="size-input"
                      placeholder="Enter size"
                      value={internalValue ?? ""}
                      onChange={(e) => {
                        const raw = e.target.value;
                        const num = raw === "" ? null : Number(raw);
                        setInternalValue(num);
                      }}
                    />
                  </div>
                  {internalValue != null && !Number.isNaN(internalValue) && (
                    <div className="size-suggestion">
                      Nearest available size:&nbsp;
                      <span className="size-suggestion-value">
                        {nearestSize(internalValue) ?? "-"}
                      </span>
                    </div>
                  )}
                  {/* Simple filter-style suggestions below input */}
                  <div className="size-suggestion-list">
                    {sortedSizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className={`size-suggestion-pill${
                          internalValue === s
                            ? " size-suggestion-pill-active"
                            : ""
                        }`}
                        onClick={() => setInternalValue(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="size-modal-footer">
              <button
                type="button"
                className="size-select-btn"
                onClick={() => {
                  if (internalValue != null && !Number.isNaN(internalValue)) {
                    const finalSize = isMobile
                      ? (nearestSize(internalValue) ?? internalValue)
                      : internalValue;
                    onChange?.(finalSize);
                  }
                  setIsOpen(false);
                }}
              >
                Select
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

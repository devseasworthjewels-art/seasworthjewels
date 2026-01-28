import { useState, useRef, useEffect } from "react";
import "../css/productDetail.css";

const DEFAULT_SIZES = Array.from({ length: 33 }, (_, i) =>
  (8 + i * 0.5).toFixed(1)
); // 8.0 to 24.0 in 0.5 increments

// Also include common ring sizes from 3.0 to 7.5
const RING_SIZES = Array.from({ length: 10 }, (_, i) =>
  (3.0 + i * 0.5).toFixed(1)
);
const ALL_SIZES = [...RING_SIZES, ...DEFAULT_SIZES];

export default function SearchableSizeDropdown({
  sizes = ALL_SIZES,
  value,
  onChange,
  label = "Size",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSizes, setFilteredSizes] = useState(sizes);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Filter sizes based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSizes(sizes);
    } else {
      const filtered = sizes.filter((size) =>
        size.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSizes(filtered);
    }
  }, [searchTerm, sizes]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Focus input when dropdown opens
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (size) => {
    onChange?.(size);
    setIsOpen(false);
    setSearchTerm("");
  };

  const displayValue = value != null ? value : "";
  const optionsRef = useRef(null);

  return (
    <div className="searchable-size-dropdown" ref={dropdownRef}>
      <div className="searchable-size-wrapper">
        <div className="searchable-size-label-row">
          <span className="searchable-size-label-text">Item Size:</span>
          <span className="searchable-size-value">{displayValue || "4.5"}</span>
        </div>
        <button
          type="button"
          className="searchable-size-trigger"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="searchable-size-label">Dropdown</span>
          <span className="searchable-size-arrow">▼</span>
        </button>
      </div>

      {isOpen && (
        <div className="searchable-size-dropdown-menu">
          <div className="searchable-size-search-container">
            <input
              ref={inputRef}
              type="text"
              className="searchable-size-search-input"
              placeholder="Search size..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          <div className="searchable-size-options" ref={optionsRef}>
            {filteredSizes.length > 0 ? (
              filteredSizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`searchable-size-option ${
                    value === size ? "searchable-size-option-active" : ""
                  }`}
                  onClick={() => handleSelect(size)}
                >
                  {size}
                </button>
              ))
            ) : (
              <div className="searchable-size-no-results">No sizes found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

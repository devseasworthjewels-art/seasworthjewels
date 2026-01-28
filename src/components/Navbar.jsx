import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../css/Nav.css";
import logoBlack from "../assets/SWJ_Logo_Final_Black.png";
import logoWhite from "../assets/SWJ_Logo_Final_White.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isHome = location.pathname === "/";
      const isScrolled = isHome ? window.scrollY > 100 : true;
      setScrolled(isScrolled);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  // Close menu when viewport changes to desktop size (e.g., when dev tools are closed)
  useEffect(() => {
    const handleResize = () => {
      // Close menu if viewport width is above mobile breakpoint (typically 768px)
      if (window.innerWidth >= 768 && open) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.classList.add("menu-open");
      // Add a small delay to ensure the menu is in the DOM before animating
      const timer = setTimeout(() => {
        const menuItems = document.querySelectorAll(".mobile-nav-link");
        menuItems.forEach((item, index) => {
          item.style.transitionDelay = `${0.1 + index * 0.05}s`;
          item.style.transform = "translateX(0)";
          item.style.opacity = "1";
        });
      }, 50);
      return () => clearTimeout(timer);
    } else {
      document.body.classList.remove("menu-open");
      // Reset animations when menu closes
      const menuItems = document.querySelectorAll(".mobile-nav-link");
      menuItems.forEach((item) => {
        item.style.transitionDelay = "0s";
        item.style.transform = "translateX(20px)";
        item.style.opacity = "0";
      });
    }

    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [open]);

  return (
    <>
      <header
        className={`navbar ${scrolled || open ? "navbar-scrolled" : ""} ${open ? "menu-open" : ""}`}
      >
        <div className="nav-container">
          <div className="nav-content">
            {/* Logo */}
            <div className="nav-logo">
              <Link to="/">
                <img
                  src={open ? logoBlack : scrolled ? logoBlack : logoWhite}
                  alt="Seasworth Jewels"
                  className="logo-img"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="nav-menu">
              <Link to="/" className="nav-link">
                HOME
              </Link>
              <Link to="/shop" className="nav-link">
                SHOP
              </Link>
              <Link to="/about" className="nav-link">
                ABOUT US
              </Link>
              <Link to="/contact" className="nav-link">
                CONTACT
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <div className="nav-actions">
              <button
                className="mobile-toggle"
                onClick={() => setOpen(!open)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
              >
                <span className={`hamburger ${open ? "open" : ""}`}>
                  <span className="hamburger-line"></span>
                  <span className="hamburger-line"></span>
                  <span className="hamburger-line"></span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Side Menu */}
      <div
        className={`mobile-side-menu ${open ? "mobile-side-menu-open" : ""}`}
      >
        {/* Overlay */}
        <div
          className="mobile-menu-overlay"
          onClick={() => setOpen(false)}
        ></div>

        {/* Menu Content */}
        <div className="mobile-menu-content">
          {/* Close Button */}
          <button
            className="mobile-close-btn"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Navigation Links */}
          <nav className="mobile-nav-links">
            <Link
              to="/"
              className="mobile-nav-link"
              onClick={() => setOpen(false)}
            >
              <span>HOME</span>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
            <Link
              to="/shop"
              className="mobile-nav-link"
              onClick={() => setOpen(false)}
            >
              <span>SHOP</span>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
            <Link
              to="/about"
              className="mobile-nav-link"
              onClick={() => setOpen(false)}
            >
              <span>ABOUT US</span>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
            <Link
              to="/contact"
              className="mobile-nav-link"
              onClick={() => setOpen(false)}
            >
              <span>CONTACT</span>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </nav>

          {/* Mobile Footer */}
          <div className="mobile-menu-footer">
            <p className="mobile-copyright">
              © 2025–26 Seasworth Jewels. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

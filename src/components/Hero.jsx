import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../css/hero.css";
// Import background image - using rings-bg as hero background
import heroBg from "../assets/rings-bg.jpg";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroRef = useRef(null);

  useEffect(() => {
    const section = heroRef.current;
    if (!section) return;

    // Animate content on load (simple fade up)
    gsap.fromTo(
      section.querySelector(".hero-content"),
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
      }
    );
  }, []);

  return (
    <section ref={heroRef} className="hero-section">
      {/* Background image as img element to prevent mobile zoom issues */}
      <img src={heroBg} alt="" className="hero-bg-img" aria-hidden="true" />
      <div className="hero-container">
        <div className="hero-content">
          {/* Main Title */}
          <div className="hero-title-container">
            <h1 className="hero-title">ETERNAL</h1>
            <h1 className="hero-title">EMBRACE</h1>
          </div>

          {/* Description */}
          <p className="hero-description">
            <strong>Inspired by you. Perfected by seasworth Jewels.</strong>
          </p>

          {/* Buttons */}
          <div className="hero-buttons">
            <Link to="/shop?category=ring" className="hero-btn primary">
              Discover Collection
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../css/collection.css";
// Import background images from assets
import earingsBg from "../assets/earings-bg.jpg";
import nacklaceBg from "../assets/nacklace-bg.jpg";
import nacklaceBg1 from "../assets/bracelets.jpg";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function Collections() {
  const sections = [
    {
      id: "petal-wraps",
      title: ["HEARTLINE ", "GLOW"],
      subtitle: "Timeless Beauty, Thoughtfully Crafted by Seasworth Jewels",
      image: nacklaceBg, // 2nd image: Necklace-bg
      category: "necklaces", // Route to necklaces category
    },
    {
      id: "crystal-cubes",
      title: ["WHISPERING", "LIGHTS"],
      subtitle: "Where Every Sparkle Whispers Love by Seasworth Jewels ",
      image: earingsBg, // 3rd image: necklace-bg1
      category: "earrings", // Route to necklaces category
    },
    {
      id: "sacred-canvas",
      title: ["ENDLESS ", "EMBRACE"],
      subtitle: "Where Two Ends Meet in Infinite Love by Seasworth Jewels",
      image: nacklaceBg1, // 4th image: earings
      category: "bracelets", // Route to bracelets category
    },
  ];

  const sectionRefs = useRef([]);

  useEffect(() => {
    sectionRefs.current.forEach((section) => {
      if (!section) return;

      gsap.fromTo(
        section.querySelector(".collection-content"),
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%", // Trigger when top of section hits 75% of viewport height
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const addToRefs = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  return (
    <div id="collections" className="collections-wrapper">
      {sections.map((section, index) => (
        <section
          key={section.id}
          ref={addToRefs}
          className="collection-section"
        >
          {/* Background image as img element to prevent mobile zoom issues */}
          <img
            src={section.image}
            alt=""
            className="collection-bg-img"
            aria-hidden="true"
          />
          <div className="collection-container">
            <div className="collection-content">
              <div className="collection-title-container">
                {section.title.map((line, index) => (
                  <h2 key={index} className="collection-title">
                    {line}
                  </h2>
                ))}
              </div>
              <p className="collection-subtitle">
                <strong>{section.subtitle}</strong>
              </p>
              <div className="hero-buttons">
                <Link
                  to={`/shop?category=${section.category}`}
                  className="hero-btn primary"
                >
                  Discover Collection
                </Link>
              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "./Hero";
import Collections from "./Collections";
import SEO from "./SEO";
import "../css/home.css";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "JewelryStore",
      "@id": "https://seasworthjewels.com/#organization",
      name: "Seasworth Jewels",
      url: "https://seasworthjewels.com",
      logo: {
        "@type": "ImageObject",
        url: "https://seasworthjewels.com/original.png",
      },
      description:
        "Luxury custom jewelry store specializing in engagement rings, wedding bands, and fine jewelry",
      address: {
        "@type": "PostalAddress",
        streetAddress: "23, Tilak Nagar, Jawahar Road, Amreli",
        addressLocality: "Amreli",
        addressRegion: "Gujarat",
        postalCode: "365601",
        addressCountry: "IN",
      },
      telephone: "+919925990345",
      email: "seasworthjewels@gmail.com",
      priceRange: "$$",
      sameAs: [
        "https://www.instagram.com/seasworthjewels",
        "https://www.facebook.com/seasworthjewels",
      ],
      openingHoursSpecification: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "10:00",
        closes: "20:00",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://seasworthjewels.com/#website",
      url: "https://seasworthjewels.com",
      name: "Seasworth Jewels",
      description: "Luxury Custom Jewelry & Engagement Rings",
      publisher: {
        "@id": "https://seasworthjewels.com/#organization",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: "https://seasworthjewels.com/shop?search={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "WebPage",
      "@id": "https://seasworthjewels.com/#webpage",
      url: "https://seasworthjewels.com",
      name: "Seasworth Jewels - Luxury Custom Jewelry & Engagement Rings",
      isPartOf: {
        "@id": "https://seasworthjewels.com/#website",
      },
      about: {
        "@id": "https://seasworthjewels.com/#organization",
      },
      description:
        "Discover exquisite custom jewelry at Seasworth Jewels. Shop stunning engagement rings, wedding bands, gemstone jewelry, and personalized pieces.",
    },
  ],
};

/**
 * Home page component with stacked scroll sections and scroll‑driven background animation.
 * Each section fills the viewport and slides over the previous one as you scroll.
 */
export default function Home() {
  const sectionsRef = useRef([]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    sectionsRef.current.forEach((section, i) => {
      if (!section) return;
      // Animate the section's background moving up as we scroll past it
      gsap.to(section, {
        y: "-100%",
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
          // Ensure later sections appear above earlier ones
          // by setting higher z-index via CSS (already handled)
        },
      });
    });
    // Cleanup on unmount
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // Helper to attach refs to each section
  const addToRefs = (el) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  return (
    <>
      <SEO
        title="Seasworth Jewels - Luxury Custom Jewelry & Engagement Rings"
        description="Discover exquisite custom jewelry at Seasworth Jewels. Shop stunning engagement rings, wedding bands, gemstone jewelry, and personalized pieces crafted with moissanite, diamonds, and precious metals."
        keywords="Seasworth Jewels, seasworth, jewelry, custom jewelry, engagement rings, wedding rings, moissanite jewelry, diamond jewelry, luxury jewelry, gemstone jewelry, gold jewelry, silver jewelry, customized rings, personalized jewelry, bridal jewelry, fine jewelry, best jewelry store, online jewelry, custom engagement rings"
        canonicalUrl="https://seasworthjewels.com/"
        structuredData={structuredData}
      />
      {/* Section 1 – Hero */}
      <section ref={addToRefs} className="stack-section hero-stack">
        <Hero />
      </section>

      {/* Section 2 – Collections */}
      <section ref={addToRefs} className="stack-section collections-stack">
        <Collections />
      </section>

      {/* Section 3 – Placeholder for further content */}
      <section ref={addToRefs} className="stack-section placeholder-stack">
        <div className="placeholder-content">
          <h2>Explore More</h2>
          <p>Discover our latest designs and exclusive offers.</p>
        </div>
      </section>
    </>
  );
}

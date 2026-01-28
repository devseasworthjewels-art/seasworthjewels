import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "./Breadcrumb";
import SEO from "./SEO";

const About = () => {
  const statsRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [happyCustomers, setHappyCustomers] = useState(0);
  const [heritageYears, setHeritageYears] = useState(0);
  const [handcraftedArt, setHandcraftedArt] = useState(0);
  const [activeReview, setActiveReview] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(1);

  const reviews = [
    {
      title: "The Satisfaction Of Getting My Customize Jewelry",
      body: "All of the pieces a designer produces for a specific category within Tulsiya. They have the best collection of jewellery and at reasonable prices. You can also customise your jewellery as per your need.",
      name: "Shrushti Golakiya",
    },
    {
      title: "Tulsiya Jewels Stands As A Beacon Of Excellence",
      body: "Exquisite craftsmanship and unparalleled elegance define the masterpieces crafted by Tulsiya Jewels. From the moment I laid eyes on their stunning collection, I was captivated by the sheer beauty and attention to detail infused into each piece.",
      name: "Keval Amdavadi",
    },
    {
      title: "Most Memorable Present I Ever Met",
      body: "I received a gift of diamond jewellery from my sister, she has brought it from Tulsiya jewels and its so wonderful and lovely present for me.",
      name: "Maitri Khachariya",
    },
    {
      title: "The Essence Of Love I Witnessed",
      body: "Its not only metal what Tulsiya Jewels provides with but, its a bundle of joy and happiness with a smile on ones face!",
      name: "Juhi Maiyani",
    },
    {
      title: "Perfect Craftsmanship And Finish",
      body: "Every edge, curve and setting feels thoughtfully finished. The detailing on my ring from Tulsiya Jewels looks even better in real life than in the photos.",
      name: "Riya Mehta",
    },
    {
      title: "Jewellery For Everyday Elegance",
      body: "I was looking for something I could wear daily without feeling too heavy or flashy. Their lightweight designs give just the right amount of shine for my office look.",
      name: "Neha Sharma",
    },
    {
      title: "Flawless Service And Support",
      body: "From helping me choose the right design to timely delivery and after-sales support, the entire experience with Tulsiya Jewels was smooth and trustworthy.",
      name: "Aman Verma",
    },
    {
      title: "A Gift That Made The Moment Special",
      body: "I bought a pendant as an anniversary gift and the packaging, presentation, and quality of the piece made the moment unforgettable for both of us.",
      name: "Pooja Patel",
    },
    {
      title: "Designs That Feel Truly Personal",
      body: "I shared a few references and they helped me create a customised design that still feels very much like my own style.",
      name: "Sneha Desai",
    },
    {
      title: "Trusted Quality For Family Occasions",
      body: "We ordered jewellery for a family wedding and everyone loved the finish and shine. It became a talking point at the event.",
      name: "Harshil Shah",
    },
    {
      title: "Exactly As Promised Online",
      body: "The product I received looked exactly like the pictures shown on the website, which gave me a lot of confidence in ordering again.",
      name: "Komal Jain",
    },
    {
      title: "Lightweight Yet Premium",
      body: "Even the bigger statement pieces feel comfortable enough to wear for long hours during functions and celebrations.",
      name: "Meera Iyer",
    },
    {
      title: "Beautiful Packaging And Presentation",
      body: "The unboxing experience felt luxurious. The attention to detail in the packaging made the jewellery feel even more special.",
      name: "Vivek Joshi",
    },
  ];

  // Determine how many slides to show based on screen width (desktop: 3, tablet: 2, mobile: 1)
  useEffect(() => {
    const updateSlidesPerView = () => {
      const width = window.innerWidth;
      // Slightly relaxed breakpoints so typical laptops also see 3 cards
      if (width >= 992) {
        setSlidesPerView(3);
      } else if (width >= 640) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(1);
      }
    };

    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView);

    return () => window.removeEventListener("resize", updateSlidesPerView);
  }, []);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  useEffect(() => {
    if (!statsRef.current || hasAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            const duration = 1500; // ms
            const start = performance.now();

            const animate = (now) => {
              const progress = Math.min((now - start) / duration, 1);

              // Targets: 1000, 1, 2000
              setHappyCustomers(Math.floor(1000 * progress));
              setHeritageYears(Math.max(1, Math.floor(1 * progress))); // stays 1 but animates
              setHandcraftedArt(Math.floor(2000 * progress));

              if (progress < 1) {
                requestAnimationFrame(animate);
              }
            };

            requestAnimationFrame(animate);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(statsRef.current);

    return () => observer.disconnect();
  }, [hasAnimated]);

  // Auto-scroll reviews forward in a loop (1 slide at a time, ~1s)
  useEffect(() => {
    if (!reviews.length) return;

    const interval = setInterval(() => {
      setActiveReview((prev) => {
        const maxIndex = Math.max(reviews.length - slidesPerView, 0);
        if (prev >= maxIndex) {
          // Reached the end, jump back to the first position
          return 0;
        }
        return prev + 1;
      });
    }, 1000); // 1 second per movement

    return () => clearInterval(interval);
  }, [reviews.length, slidesPerView]);

  return (
    <div
      className="about-page bg-white text-gray-900 pt-28 pb-10 px-4 sm:px-6 lg:px-10"
      style={{
        fontFamily:
          "Roboto, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <SEO
        title="About Us - Seasworth Jewels | Our Story & Craftsmanship"
        description="Learn about Seasworth Jewels, a luxury jewelry brand committed to exceptional craftsmanship, timeless designs, and personalized service. Discover our story and meet our founder."
        keywords="about Seasworth Jewels, jewelry brand story, custom jewelry craftsmanship, luxury jewelry maker, jewelry design philosophy, jewelry founder, handcrafted jewelry"
        canonicalUrl="https://seasworthjewels.com/about"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About Seasworth Jewels",
          description:
            "Discover the story, mission, and vision behind Seasworth Jewels",
          url: "https://seasworthjewels.com/about",
        }}
      />
      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto mb-6">
        <Breadcrumb
          items={[{ label: "Home", path: "/" }, { label: "About Us" }]}
        />
      </div>

      {/* Hero: Design Philosophy */}
      <section className="max-w-6xl mx-auto grid gap-10 lg:gap-12 items-stretch mb-16 lg:grid-cols-[1fr,1fr,1fr]">
        {/* Left: Philosophy text */}
        <div className="bg-[#f8ebe6] px-8 py-10 flex flex-col justify-between h-full">
          <div>
            <h1 className="text-3xl sm:text-4xl font-light tracking-[0.25em] uppercase mb-6">
              Our Design
              <br />
              Philosophy
            </h1>
            <p className="text-base text-gray-700 leading-relaxed mb-6">
              At the heart of our craftsmanship is the belief that jewelry is a
              meaningful part of your story. Rooted in artistry and
              individuality, each piece is thoughtfully designed to reflect who
              you are and what you cherish.
            </p>
            <p className="text-base text-gray-700 leading-relaxed">
              From the careful selection of materials to the harmony of comfort
              and elegance, every design is created to stay with
              you—effortlessly, every day, in every moment.
            </p>
          </div>
          <div className="mt-8">
            <Link
              to="/contact"
              className="inline-block border border-black px-6 py-2 text-sm tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-colors cursor-pointer"
            >
              Contact Us
            </Link>
          </div>
        </div>

        {/* Middle: Image */}
        <div className="w-full h-64 sm:h-80 lg:h-full bg-[#f4d9c6] overflow-hidden flex items-center justify-center">
          <img
            src="https://tulsiyajewels.com/wp-content/uploads/2025/01/about-us-2-image-1.jpg"
            alt="Our Design Philosophy"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right: Mission & Vision */}
        <div className="flex flex-col justify-between gap-10 text-sm sm:text-base leading-relaxed lg:min-h-[18rem]">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold tracking-[0.18em] uppercase mb-3">
              Our Mission
            </h3>
            <p className="text-gray-700 leading-7">
              Our approach blends timeless tradition with modern innovation,
              drawing inspiration from nature, culture, and the emotions that
              shape who we are. Every curve, texture, and gemstone is
              intentionally crafted to echo your individuality and tell a story
              that is uniquely yours.
            </p>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold tracking-[0.18em] uppercase mb-3">
              Our Vision
            </h3>
            <p className="text-gray-700 leading-7">
              Our vision is to craft jewelry that connects with the heart -
              pieces that journey with you through life’s milestones and quiet
              moments alike. At Seasworth Jewels, we aspire to create keepsakes
              that embody love, celebration, memory, and the beauty of your
              ever-unfolding story.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-[#f5f5f5] py-10 mb-16" ref={statsRef}>
        <div className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-10 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-light mb-1">
              {happyCustomers.toLocaleString()}+
            </div>
            <p className="text-sm uppercase tracking-[0.2em] text-gray-700">
              Happy Customers
            </p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-light mb-1">
              {heritageYears}+
            </div>
            <p className="text-sm uppercase tracking-[0.2em] text-gray-700">
              Heroic Years
            </p>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-light mb-1">
              {handcraftedArt.toLocaleString()}+
            </div>
            <p className="text-sm uppercase tracking-[0.2em] text-gray-700">
              Hand-Painted Motifs
            </p>
          </div>
        </div>
      </section>

      {/* Quality Products Section */}
      <section className="max-w-6xl mx-auto text-center mb-16">
        <h2 className="text-2xl sm:text-3xl font-light mb-8">
          Quality Products - We Promise!
        </h2>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-10 text-left text-sm sm:text-base">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="w-9 h-9 rounded-full border border-black flex items-center justify-center text-sm mb-4">
              1
            </div>
            <h3 className="font-semibold mb-2">Wise &amp; Perfect Size</h3>
            <p className="text-gray-700 leading-relaxed">
              We pay attention to accurate sizing so every piece feels
              comfortable while enhancing your natural style.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="w-9 h-9 rounded-full border border-black flex items-center justify-center text-sm mb-4">
              2
            </div>
            <h3 className="font-semibold mb-2">
              Nature Quality Timeless Design
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Each collection blends modern refinement with long-lasting
              materials for jewelry that stays beautiful over time.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="w-9 h-9 rounded-full border border-black flex items-center justify-center text-sm mb-4">
              3
            </div>
            <h3 className="font-semibold mb-2">Made With Care, Risk-Free</h3>
            <p className="text-gray-700 leading-relaxed">
              Thoughtfully crafted pieces with careful finishing, so you can
              wear them every day with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Leader Board Section */}
      <section className="max-w-6xl mx-auto text-center mb-0">
        <h2 className="text-2xl sm:text-3xl font-light mb-12">
          The Founder of Seasworth Jewels
        </h2>
        <div className="flex justify-center">
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 lg:w-52 lg:h-52 rounded-full bg-[#fbe2dd] mb-6 flex items-center justify-center overflow-hidden">
              <img
                src="https://tulsiyajewels.com/wp-content/uploads/2025/01/837-1536x1536.jpg"
                alt="Meet Meruliya"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-lg sm:text-xl font-semibold mb-1">
              Meet Meruliya
            </div>
            <div className="text-xs sm:text-sm text-gray-600">CEO</div>
          </div>
        </div>
      </section>

      {/* Customer Review Section */}
      {/* <section className="bg-[#f8ebe6] py-14">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-light text-center mb-10">
            Customer Review
          </h2>

          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out text-sm sm:text-base"
              style={{
                transform: `translateX(-${(activeReview * 100) / slidesPerView}%)`,
              }}
            >
              {reviews.map((review) => (
                <article
                  key={review.title}
                  className="flex-shrink-0 bg-[#f8ebe6] px-1"
                  style={{ flexBasis: `${100 / slidesPerView}%` }}
                >
                  <div className="bg-white border border-gray-200 px-6 py-6 flex flex-col justify-between h-full shadow-sm text-left">
                    <div>
                      <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center mb-4">
                        <span className="text-sm">❝</span>
                      </div>
                      <h3 className="font-semibold mb-2 text-base sm:text-lg">
                        {review.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed mb-4">
                        {review.body}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs sm:text-sm text-gray-600">
                      <span>- {review.name}</span>
                      <span className="text-red-500 text-xs">★★★★★</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default About;

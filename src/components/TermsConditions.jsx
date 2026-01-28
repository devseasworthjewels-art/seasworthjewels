import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "./Breadcrumb";
import SEO from "./SEO";
import "../css/legal.css";

export default function TermsConditions() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="legal-page">
      <SEO
        title="Terms & Conditions - Seasworth Jewels"
        description="Read our Terms & Conditions to understand the rules and regulations for using Seasworth Jewels' website and purchasing our products."
        keywords="terms and conditions, Seasworth Jewels terms, website terms, purchase terms, legal terms"
        canonicalUrl="https://seasworthjewels.com/terms-conditions"
        noindex={true}
      />
      <div className="legal-container">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", path: "/" },
            { label: "Terms & Conditions" },
          ]}
        />

        {/* Header */}
        <div className="legal-header">
          <div className="header-icon">📋</div>
          <h1 className="legal-title">Terms & Conditions</h1>
          <p className="legal-subtitle">Please read these terms carefully</p>
          <div className="brand-name">Seasworth Jewels</div>
        </div>

        {/* Intro */}
        <div className="legal-intro">
          <p>
            Welcome to Seasworth Jewels (&quot;we&quot;, &quot;our&quot;,
            &quot;us&quot;). By accessing, browsing, or making a purchase on our
            website, you agree to comply with and be bound by the following
            Terms and Conditions. Please read them carefully before using our
            services.
          </p>
        </div>

        {/* Content */}
        <div className="legal-content">
          <section className="legal-section">
            <h2 className="section-title">
              <span className="section-number">01</span>
              General Conditions
            </h2>
            <ul className="section-list">
              <li>
                By using this website, you confirm that you are legally capable
                of entering into a binding contract under applicable laws.
              </li>
              <li>
                We reserve the right to refuse service to anyone, at any time,
                for any reason.
              </li>
              <li>
                The content on this website is provided for general
                informational purposes only and may be updated, modified, or
                removed without prior notice.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="section-title">
              <span className="section-number">02</span>
              Products and Pricing
            </h2>
            <ul className="section-list">
              <li>
                All products displayed on the website are subject to
                availability.
              </li>
              <li>
                We make reasonable efforts to accurately display product images,
                descriptions, and details; however, slight variations in color,
                size, or appearance may occur due to photography, lighting, or
                screen settings.
              </li>
              <li>Prices are subject to change without prior notice.</li>
              <li>
                We reserve the right to modify, discontinue, or restrict the
                sale of any product at our sole discretion.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="section-title">
              <span className="section-number">03</span>
              Orders and Payment
            </h2>
            <ul className="section-list">
              <li>
                By placing an order, you agree that all information provided is
                true, accurate, and complete.
              </li>
              <li>
                Full payment must be made at the time of placing the order using
                the payment methods available on our website.
              </li>
              <li>
                We reserve the right to cancel or refuse any order due to
                suspected fraud, incorrect pricing, product unavailability, or
                any other legitimate reason.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="section-title">
              <span className="section-number">04</span>
              Shipping and Delivery
            </h2>
            <ul className="section-list">
              <li>
                Orders are processed and shipped within the estimated timelines
                mentioned on the website.
              </li>
              <li>
                Delivery timelines may vary based on location, courier partners,
                or unforeseen circumstances.
              </li>
              <li>
                Seasworth Jewels shall not be responsible for delays caused by
                logistics partners, natural events, or factors beyond our
                reasonable control.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="section-title">
              <span className="section-number">05</span>
              Returns and Exchanges
            </h2>
            <ul className="section-list">
              <li>
                Returns and exchanges, where applicable, shall be governed by
                our Return Policy.
              </li>
              <li>
                Products must be unused, unworn, and returned in their original
                condition and packaging within the specified timeframe.
              </li>
              <li>
                Customized, engraved, or made-to-order items are non-returnable
                unless found to be defective or damaged upon delivery.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="section-title">
              <span className="section-number">06</span>
              Privacy Policy
            </h2>
            <ul className="section-list">
              <li>
                Your personal information is collected, stored, and used in
                accordance with our Privacy Policy.
              </li>
              <li>
                We are committed to safeguarding your data and maintaining
                strict confidentiality.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="section-title">
              <span className="section-number">07</span>
              Limitation of Liability
            </h2>
            <ul className="section-list">
              <li>
                Seasworth Jewels shall not be liable for any indirect,
                incidental, special, or consequential damages arising from the
                use of our website or products.
              </li>
              <li>
                Our maximum liability, if any, shall be limited to the amount
                paid by you for the purchased product.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="section-title">
              <span className="section-number">08</span>
              Intellectual Property
            </h2>
            <ul className="section-list">
              <li>
                All content on this website, including but not limited to
                images, logos, designs, text, graphics, and trademarks, is the
                exclusive property of Seasworth Jewels.
              </li>
              <li>
                Unauthorized use, reproduction, or distribution of any content
                is strictly prohibited without prior written consent.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="section-title">
              <span className="section-number">09</span>
              Governing Law and Jurisdiction
            </h2>
            <ul className="section-list">
              <li>
                These Terms and Conditions shall be governed by and interpreted
                in accordance with the laws of India.
              </li>
              <li>
                Any disputes shall be subject to the exclusive jurisdiction of
                the courts located in Gujarat, India.
              </li>
            </ul>
          </section>
        </div>

        {/* Back Button */}
        <div className="legal-actions">
          <button
            type="button"
            className="legal-back-btn"
            onClick={() => navigate("/")}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

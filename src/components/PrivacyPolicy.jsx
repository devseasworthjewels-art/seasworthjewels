import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "./Breadcrumb";
import SEO from "./SEO";
import "../css/legal.css";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="legal-page">
      <SEO
        title="Privacy Policy - Seasworth Jewels"
        description="Read our Privacy Policy to understand how Seasworth Jewels collects, uses, and protects your personal information when you use our website or services."
        keywords="privacy policy, data protection, Seasworth Jewels privacy, personal information, data security"
        canonicalUrl="https://seasworthjewels.com/privacy-policy"
        noindex={true}
      />
      <div className="legal-container">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[{ label: "Home", path: "/" }, { label: "Privacy Policy" }]}
        />

        {/* Header */}
        <div className="legal-header">
          <div className="header-icon">🔒</div>
          <h1 className="legal-title">Privacy Policy</h1>
          <p className="legal-subtitle">Your privacy matters to us</p>
          <div className="brand-name">Seasworth Jewels</div>
        </div>

        {/* Intro */}
        <div className="legal-intro">
          <p>
            At Seasworth Jewels, we value your privacy and are committed to
            protecting your personal information. This Privacy Policy explains
            how we collect, use, store, and protect your information when you
            visit our website or interact with us.
          </p>
        </div>

        {/* Content */}
        <div className="legal-content">
          <section className="legal-section">
            <h2 className="section-title">
              <span className="section-number">01</span>
              Information We Collect
            </h2>
            <p className="section-text">
              We collect only the personal information that you voluntarily
              provide to us. Currently, this includes:
            </p>
            <ul className="section-list">
              <li>Name</li>
              <li>Mobile Number</li>
              <li>Email Address</li>
            </ul>
            <p className="section-text">
              You may provide this information when you:
            </p>
            <ul className="section-list">
              <li>Place an order or inquiry</li>
              <li>Sign up for updates or newsletters</li>
              <li>Contact our customer support team</li>
            </ul>
            <p className="section-note">
              <strong>Note:</strong> We do not collect payment card details,
              bank information, or sensitive personal data directly on our
              website.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="section-title">
              <span className="section-number">02</span>
              How We Use Your Information
            </h2>
            <p className="section-text">
              We use the collected information solely for legitimate business
              purposes, including:
            </p>
            <ul className="section-list">
              <li>Processing and managing orders or inquiries</li>
              <li>
                Communicating with you regarding products, services, or support
                requests
              </li>
              <li>Sending updates, offers, or marketing communications</li>
              <li>Improving customer experience and service quality</li>
              <li>Preventing fraud or unauthorized activities</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2 className="section-title">
              <span className="section-number">03</span>
              Information Sharing and Disclosure
            </h2>
            <p className="section-highlight">
              We do not sell, rent, or trade your personal information to third
              parties.
            </p>
            <p className="section-text">
              We may share your information only when necessary, such as:
            </p>
            <ul className="section-list">
              <li>
                With service providers (e.g., email service providers) to
                communicate with you
              </li>
              <li>
                When required by law, legal process, or government authorities
              </li>
              <li>
                To protect the rights, property, or safety of Seasworth Jewels
                or our customers
              </li>
            </ul>
            <p className="section-text">
              All third-party partners are required to maintain the
              confidentiality of your information.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="section-title">
              <span className="section-number">04</span>
              Data Security
            </h2>
            <p className="section-text">
              We implement appropriate technical and organizational security
              measures to protect your personal information, including:
            </p>
            <ul className="section-list">
              <li>Secure storage of customer data</li>
              <li>Restricted access to personal information</li>
              <li>Use of trusted and secure communication tools</li>
              <li>Regular review of data protection practices</li>
            </ul>
            <p className="section-note">
              While we strive to protect your data, no method of transmission
              over the internet is 100% secure.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="section-title">
              <span className="section-number">05</span>
              Your Rights
            </h2>
            <p className="section-text">You have the right to:</p>
            <ul className="section-list">
              <li>Access your personal information</li>
              <li>Request correction of inaccurate or incomplete data</li>
              <li>Request deletion of your personal information</li>
              <li>Opt out of marketing communications at any time</li>
              <li>Withdraw consent for data processing</li>
            </ul>
            <p className="section-text">
              To exercise any of these rights, please contact us using the
              details below.
            </p>
          </section>

          <section className="legal-section">
            <h2 className="section-title">
              <span className="section-number">06</span>
              Changes to This Privacy Policy
            </h2>
            <p className="section-text">
              We may update this Privacy Policy from time to time. Any changes
              will be posted on this page, and significant updates may be
              communicated via email.
            </p>
            <p className="section-text">
              We encourage you to review this policy periodically.
            </p>
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

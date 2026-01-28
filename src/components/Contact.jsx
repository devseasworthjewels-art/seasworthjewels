import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import {
  collection,
  addDoc,
  serverTimestamp,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  sendEmailForm,
  sendQuotaAlert,
  EMAIL_TEMPLATES,
} from "../utils/emailService";
import Breadcrumb from "./Breadcrumb";
import SEO from "./SEO";

const Contact = () => {
  const formRef = useRef(null);
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    terms: "",
  });
  const [isTermsChecked, setIsTermsChecked] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const validateForm = (formData) => {
    const newErrors = {};
    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
      isValid = false;
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = "Subject must be at least 5 characters";
      isValid = false;
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
      isValid = false;
    }

    // Terms and conditions validation
    if (!isTermsChecked) {
      newErrors.terms = "You must accept the terms and conditions";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = formRef.current;
    const formData = {
      name: form.user_name.value,
      email: form.user_email.value,
      subject: form.subject.value,
      message: form.message.value,
    };

    // Validate form
    if (!validateForm(formData)) {
      return;
    }

    setStatus("Sending...");

    try {
      const messageData = {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        createdAt: serverTimestamp(),
        emailSent: true,
      };

      // OPTIMIZATION: Run Firestore save and email sending in parallel
      await Promise.all([
        addDoc(collection(db, "contactMessages"), messageData),
        // Email sending runs in parallel - errors are logged but don't block
        sendEmailForm(EMAIL_TEMPLATES.contact, formRef.current).catch(
          (emailErr) => {
            console.error("Failed to send contact email", emailErr);
            messageData.emailSent = false;
          }
        ),
      ]);

      // OPTIMIZATION: Check quota in background (non-blocking)
      if (messageData.emailSent) {
        checkEmailQuota().catch((countErr) => {
          console.error(
            "Failed to check recent contact message count",
            countErr
          );
        });
      }

      // Trigger confetti effect
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#000000", "#ffffff", "#d1d5db"],
      });

      setStatus("Message sent successfully! 🎉");
      if (formRef.current) {
        formRef.current.reset();
        setIsTermsChecked(false);
      }
    } catch (err) {
      console.error("Email send or Firestore save failed", err);
      setStatus("Something went wrong. Please try again.");
    }
  };

  // Helper function to check email quota (runs in background)
  const checkEmailQuota = async () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const recentMessagesQuery = query(
      collection(db, "contactMessages"),
      where("createdAt", ">=", thirtyDaysAgo)
    );

    const snapshot = await getCountFromServer(recentMessagesQuery);
    const totalMessages = snapshot.data().count;

    if (totalMessages >= 190) {
      await sendQuotaAlert(totalMessages);
    }
  };

  return (
    <div
      className="contact-page bg-white text-gray-900 pt-28 pb-20 px-4 sm:px-6 lg:px-10"
      style={{
        fontFamily:
          "Roboto, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <SEO
        title="Contact Us - Seasworth Jewels | Get in Touch"
        description="Contact Seasworth Jewels for custom jewelry inquiries, product questions, or visit our store in Surat, Gujarat. We're here to help with all your jewelry needs."
        keywords="contact Seasworth Jewels, jewelry store contact, custom jewelry inquiries, Surat jewelry store, jewelry customer service, buy jewelry online"
        canonicalUrl="https://seasworthjewels.com/contact"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact Seasworth Jewels",
          description:
            "Get in touch with Seasworth Jewels for custom jewelry inquiries and support",
          url: "https://seasworthjewels.com/contact",
        }}
      />
      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto mb-6">
        <Breadcrumb
          items={[{ label: "Home", path: "/" }, { label: "Contact" }]}
        />
      </div>

      {/* Page Title & Subtitle */}
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-light tracking-[0.25em] mb-5 uppercase">
          Contact
        </h1>
        <p className="text-base sm:text-lg text-gray-500 max-w-xxl mx-auto">
          Click below to reach us on Google Maps - we’d love to welcome you at
          our store.
        </p>
      </div>

      {/* Map Section */}
      <div className="max-w-5xl mx-auto mb-14 shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <div className="aspect-[16/9] w-full">
          <iframe
            title="Store Location Map"
            src="https://www.google.com/maps?q=21.20484733581543,72.8329086303711&z=17&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      {/* Info Boxes */}
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-10 md:gap-6 text-center mb-14">
        {/* Our Store */}
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 mb-4 bg-white shadow-sm text-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M4 10L12 4l8 6v8H4z" />
              <path d="M9 18v-4h6v4" />
            </svg>
          </div>
          <h3 className="text-sm sm:text-base font-semibold tracking-[0.2em] mb-3 text-gray-800">
            OUR STORE
          </h3>
          <p className="text-base text-gray-600 leading-relaxed">
            Jyoti Diamond, Mahidharpura
            <br />
            Surat,Gujarat - 395003
          </p>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 mb-4 bg-white shadow-sm text-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M5 4h3l2 4-2 1c.7 1.6 2 3 3.6 3.6l1-2 4 2v3c0 .6-.4 1-1 1A11 11 0 0 1 4 6c0-.6.4-1 1-1z" />
            </svg>
          </div>
          <h3 className="text-sm sm:text-base font-semibold tracking-[0.2em] mb-3 text-gray-800">
            CONTACT INFO
          </h3>
          <p className="text-base text-gray-600 leading-relaxed">
            <a
              href="https://wa.me/447833814871"
              target="_blank"
              rel="noopener noreferrer"
              className="contact-text whatsapp-link"
            >
              Office : (+44) 7833 814871
            </a>
            <br />
            <a
              href="mailto:support@seasworthjewels.com"
              className="contact-text"
            >
              Email : support@seasworthjewels.com
            </a>
          </p>
        </div>

        {/* Business Hours */}
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center w-12 h-12 rounded-full border border-gray-300 mb-4 bg-white shadow-sm text-black">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <circle cx="12" cy="13" r="7" />
              <path d="M12 13V9m0 4h3" />
              <path d="M9 3L7 5m8-2l2 2" />
            </svg>
          </div>
          <h3 className="text-sm sm:text-base font-semibold tracking-[0.2em] mb-3 text-gray-800">
            BUSINESS HOURS
          </h3>
          <p className="text-base text-gray-600 leading-relaxed">
            Monday - Saturday
            <br />
            09:00 am - 08:00 pm
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-5xl mx-auto border-t border-gray-200 mb-12" />

      {/* Contact Form Section */}
      <div className="max-w-3xl mx-auto text-center mb-6">
        <h2 className="text-3xl sm:text-4xl font-light mb-4">
          Have a question? Contact us!
        </h2>
      </div>

      <div className="max-w-3xl mx-auto bg-white border border-gray-200 shadow-sm px-6 sm:px-8 py-8">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-6 text-base"
        >
          {/* Name + Email */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder="Name"
                name="user_name"
                className={`border ${errors.name ? "border-red-500" : "border-gray-300"} px-3 py-2 w-full text-sm focus:outline-none focus:border-gray-500 placeholder:text-gray-400`}
                onChange={() => setErrors((prev) => ({ ...prev, name: "" }))}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1 text-left">
                  {errors.name}
                </p>
              )}
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                name="user_email"
                className={`border ${errors.email ? "border-red-500" : "border-gray-300"} px-3 py-2 w-full text-sm focus:outline-none focus:border-gray-500 placeholder:text-gray-400`}
                onChange={() => setErrors((prev) => ({ ...prev, email: "" }))}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 text-left">
                  {errors.email}
                </p>
              )}
            </div>
          </div>

          {/* Subject */}
          <div>
            <input
              type="text"
              placeholder="Subject"
              name="subject"
              className={`border ${errors.subject ? "border-red-500" : "border-gray-300"} px-3 py-2 w-full text-sm focus:outline-none focus:border-gray-500 placeholder:text-gray-400`}
              onChange={() => setErrors((prev) => ({ ...prev, subject: "" }))}
            />
            {errors.subject && (
              <p className="text-red-500 text-xs mt-1 text-left">
                {errors.subject}
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <textarea
              rows="5"
              placeholder="Write Your Message..."
              name="message"
              className={`border ${errors.message ? "border-red-500" : "border-gray-300"} px-3 py-2 w-full text-sm focus:outline-none focus:border-gray-500 placeholder:text-gray-400`}
              onChange={() => setErrors((prev) => ({ ...prev, message: "" }))}
            ></textarea>
            {errors.message && (
              <p className="text-red-500 text-xs mt-1 text-left">
                {errors.message}
              </p>
            )}
          </div>

          {/* Terms */}
          {/* Terms and Conditions */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                checked={isTermsChecked}
                onChange={(e) => {
                  setIsTermsChecked(e.target.checked);
                  setErrors((prev) => ({ ...prev, terms: "" }));
                }}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="font-medium text-gray-700">
                I agree to the{" "}
                <a
                  href="/terms-conditions"
                  className="text-black hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  terms and conditions
                </a>
              </label>
              {errors.terms && (
                <p className="text-red-500 text-xs mt-1">{errors.terms}</p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="mt-2 w-full bg-black text-white text-xs tracking-[0.25em] py-3 uppercase hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={status === "Sending..."}
            >
              {status === "Sending..." ? "Sending..." : "Send Message"}
            </button>
            {status && status !== "Sending..." && (
              <p
                className={`mt-3 text-xs text-center ${
                  status.includes("successfully")
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {status}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;

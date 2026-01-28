import { useState } from "react";
import "../css/enquiryModal.css";

export default function EnquiryModal({
  isOpen,
  onClose,
  product,
  customizations,
  onSubmit,
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email ID is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile Number is required";
    } else if (!/^\d{10}$/.test(formData.mobileNumber.replace(/\D/g, ""))) {
      newErrors.mobileNumber = "Please enter a valid 10-digit mobile number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      setErrors({ submit: "Failed to submit enquiry. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="enquiry-modal-overlay" onClick={onClose}>
      <div className="enquiry-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="enquiry-modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="enquiry-modal-header">
          <h2>Share Your Details</h2>
          <p>We'll get back to you shortly</p>
        </div>

        <form onSubmit={handleSubmit} className="enquiry-form">
          <div
            className={`enquiry-form-group ${errors.fullName ? "error" : ""}`}
          >
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className={errors.fullName ? "enquiry-input-error" : ""}
              disabled={isSubmitting}
            />
            {errors.fullName && (
              <span className="enquiry-error-message">{errors.fullName}</span>
            )}
          </div>

          <div className={`enquiry-form-group ${errors.email ? "error" : ""}`}>
            <label htmlFor="email">Email ID *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={errors.email ? "enquiry-input-error" : ""}
              disabled={isSubmitting}
            />
            {errors.email && (
              <span className="enquiry-error-message">{errors.email}</span>
            )}
          </div>

          <div
            className={`enquiry-form-group ${errors.mobileNumber ? "error" : ""}`}
          >
            <label htmlFor="mobileNumber">Mobile Number *</label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="Enter your 10-digit mobile number"
              className={errors.mobileNumber ? "enquiry-input-error" : ""}
              disabled={isSubmitting}
            />
            {errors.mobileNumber && (
              <span className="enquiry-error-message">
                {errors.mobileNumber}
              </span>
            )}
          </div>

          {errors.submit && (
            <div className="enquiry-submit-error">{errors.submit}</div>
          )}

          <button
            type="submit"
            className="enquiry-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

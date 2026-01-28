import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { sendEmail } from "./emailService";
import { EMAILJS_CONFIG } from "./appConfig";

/**
 * Generate a unique enquiry ID
 */
function generateEnquiryId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ENQ-${timestamp}-${random}`;
}

/**
 * Format customization details for email
 */
function formatCustomizationDetails(customizations) {
  const details = [];

  if (customizations.metalColor) {
    details.push(`Metal Color: ${customizations.metalColor}`);
  }
  if (customizations.karat) {
    details.push(`Metal Carat: ${customizations.karat}`);
  }
  if (customizations.stoneType) {
    details.push(`Stone Type: ${customizations.stoneType}`);
  }
  if (customizations.caratStep) {
    const caratRanges = {
      1: "1.00 - 1.19CT",
      2: "1.20 - 1.49CT",
      3: "2.00 - 2.19CT",
    };
    details.push(
      `Carat Weight: ${caratRanges[customizations.caratStep] || "N/A"}`
    );
  }
  if (customizations.size) {
    details.push(`Size: ${customizations.size}`);
  }
  if (customizations.quantity) {
    details.push(`Quantity: ${customizations.quantity}`);
  }

  return details.length > 0 ? details.join(", ") : "No customizations selected";
}

/**
 * Format WhatsApp message
 */
function formatWhatsAppMessage(customerName, productName, customerEmail) {
  return `Hello, I'm ${customerName}.\nI'm very interested in the ${productName} and would love to know more details.\nEmail: ${customerEmail}\nLooking forward to your response. Thank you.`;
}

/**
 * Format enquiry notification email
 */
function formatEnquiryEmail(enquiryData) {
  const {
    enquiryId,
    createdAt,
    enquiryMode,
    customerName,
    customerEmail,
    customerMobile,
    productName,
    productUrl,
    customizationDetails,
  } = enquiryData;

  return `Hello Team,

A new customer enquiry has been received. Please find the details below:

Enquiry ID: ${enquiryId}
Enquiry Date & Time: ${createdAt}
Enquiry Mode: ${enquiryMode}

Customer Details:
Name: ${customerName}
Email: ${customerEmail}
Mobile: ${customerMobile}

Product Details:
Product Name: ${productName}
Product URL: ${productUrl}

Selected Customization Options:
${customizationDetails}

Please review the enquiry and follow up with the customer accordingly.

Regards,
Website Enquiry System`;
}

/**
 * Submit enquiry to database and send emails
 */
export async function submitEnquiry(
  customerData,
  product,
  customizations,
  enquiryMode
) {
  try {
    // Generate enquiry ID
    const enquiryId = generateEnquiryId();

    // Format customization details
    const customizationDetails = formatCustomizationDetails(customizations);

    // Get current timestamp
    const now = new Date();
    const formattedTimestamp = now.toLocaleString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    // Prepare enquiry data for database
    const enquiryData = {
      enquiryId,
      customerName: customerData.fullName,
      customerEmail: customerData.email,
      customerMobile: customerData.mobileNumber,
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      productCategory: product.category,
      customizations: {
        metalColor: customizations.metalColor,
        karat: customizations.karat,
        stoneType: customizations.stoneType,
        caratStep: customizations.caratStep,
        size: customizations.size,
        quantity: customizations.quantity,
      },
      enquiryMode,
      createdAt: serverTimestamp(),
      createdAtFormatted: formattedTimestamp,
      status: "new",
    };

    // Prepare data for emails (before async operations)
    const productUrl = `${window.location.origin}/product/${product.slug}`;
    const emailData = {
      enquiryId,
      createdAt: formattedTimestamp,
      enquiryMode: enquiryMode === "whatsapp" ? "WhatsApp" : "Buy Now",
      customerName: customerData.fullName,
      customerEmail: customerData.email,
      customerMobile: customerData.mobileNumber,
      productName: product.name,
      productUrl,
      customizationDetails,
    };

    // OPTIMIZATION: Run Firestore save and email sending in parallel
    const enquiriesRef = collection(db, "enquiries");

    const [docRef] = await Promise.all([
      addDoc(enquiriesRef, enquiryData),
      // Email sending runs in parallel - errors are logged but don't block
      sendEnquiryNotificationEmail(emailData).catch((emailError) => {
        console.error("Failed to send enquiry notification email:", emailError);
      }),
    ]);

    return {
      success: true,
      enquiryId,
      docId: docRef.id,
      whatsappMessage: formatWhatsAppMessage(
        customerData.fullName,
        product.name,
        customerData.email
      ),
    };
  } catch (error) {
    console.error("Error submitting enquiry:", error);
    throw new Error("Failed to submit enquiry. Please try again.");
  }
}

/**
 * Send enquiry notification email to business
 */
async function sendEnquiryNotificationEmail(emailData) {
  const emailContent = formatEnquiryEmail(emailData);

  // Send using EmailJS
  const templateId = EMAILJS_CONFIG.templates.enquiryNotification;
  if (!templateId) {
    console.warn("Enquiry notification template ID not configured");
    throw new Error("Email template not configured");
  }

  // Prepare email payload - make sure all variables match EmailJS template
  const emailPayload = {
    to_email: "devseasworthjewels@gmail.com",
    to_name: "Seasworth Jewels Team",
    from_name: emailData.customerName,
    from_email: emailData.customerEmail,
    reply_to: emailData.customerEmail,
    subject: `New Product Enquiry - ${emailData.enquiryId}`,
    message: emailContent,
    // Individual fields for template variables
    enquiry_id: emailData.enquiryId,
    created_at: emailData.createdAt,
    enquiry_mode: emailData.enquiryMode,
    customer_name: emailData.customerName,
    customer_email: emailData.customerEmail,
    customer_mobile: emailData.customerMobile,
    product_name: emailData.productName,
    product_url: emailData.productUrl,
    customization_details: emailData.customizationDetails,
    // Common fields
    name: emailData.customerName,
    email: emailData.customerEmail,
  };

  try {
    const result = await sendEmail(templateId, emailPayload);
    console.log("Enquiry notification email sent successfully:", result);
    return result;
  } catch (error) {
    console.error("Error sending enquiry notification email:", error);
    console.error("Email payload:", emailPayload);
    throw error;
  }
}

/**
 * Get enquiry by ID
 */
export async function getEnquiryById(enquiryId) {
  try {
    const enquiriesRef = collection(db, "enquiries");
    const q = query(enquiriesRef, where("enquiryId", "==", enquiryId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    return querySnapshot.docs[0].data();
  } catch (error) {
    console.error("Error fetching enquiry:", error);
    throw error;
  }
}

/**
 * Get enquiries by customer email
 */
export async function getEnquiriesByEmail(email) {
  try {
    const enquiriesRef = collection(db, "enquiries");
    const q = query(enquiriesRef, where("customerEmail", "==", email));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    throw error;
  }
}

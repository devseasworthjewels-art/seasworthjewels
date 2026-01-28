/**
 * Currency Converter Utility
 * Fetches INR to USD exchange rate and caches it in localStorage
 * Includes IP-based geo-detection for automatic currency selection
 */

const EXCHANGE_RATE_KEY = "inr_to_usd_rate";
const RATE_TIMESTAMP_KEY = "exchange_rate_timestamp";
const USER_COUNTRY_KEY = "user_country_code";
const COUNTRY_TIMESTAMP_KEY = "country_detection_timestamp";
const CACHE_DURATION = 0; // Set to 0 to force re-detection on every reload (useful for VPN testing)

/**
 * Detect user's country based on IP address
 * Uses ip-api.com free service (45 requests per minute limit)
 */
/**
 * Detect user's country based on IP address
 * Uses api.country.is (Reliable, HTTPS supported, free)
 */
async function detectUserCountry() {
  try {
    const response = await fetch("https://api.country.is/");

    if (!response.ok) {
      throw new Error("Failed to detect user country");
    }

    const data = await response.json();
    const countryCode = data.country || "US";

    // Cache the country code
    localStorage.setItem(USER_COUNTRY_KEY, countryCode);
    localStorage.setItem(COUNTRY_TIMESTAMP_KEY, Date.now().toString());

    console.log("User country detected:", countryCode);
    return countryCode;
  } catch (error) {
    console.error("Error detecting user country:", error);
    // Try backup service if first one fails
    try {
      const backupResponse = await fetch("https://ipapi.co/json/");
      if (backupResponse.ok) {
        const backupData = await backupResponse.json();
        return backupData.country_code || "US";
      }
    } catch (e) {
      console.warn("Backup country detection failed", e);
    }
    // Default to US if both fail
    return "US";
  }
}

/**
 * Get user's country from cache or detect if expired/missing
 */
export async function getUserCountry() {
  const cachedCountry = localStorage.getItem(USER_COUNTRY_KEY);
  const timestamp = localStorage.getItem(COUNTRY_TIMESTAMP_KEY);

  // Check if cache exists and is still valid
  if (cachedCountry && timestamp) {
    const age = Date.now() - parseInt(timestamp, 10);

    if (age < CACHE_DURATION) {
      console.log("Using cached user country:", cachedCountry);
      return cachedCountry;
    }
  }

  // Cache is missing or expired, detect country
  console.log("Detecting user country...");
  return await detectUserCountry();
}

/**
 * Check if user is from India based on country code
 */
export function isIndianUser(countryCode) {
  return countryCode === "IN";
}

/**
 * Fetch the current INR to USD exchange rate from API
 * Using exchangerate-api.com (free tier allows 1500 requests/month)
 */
async function fetchExchangeRate() {
  try {
    // Using exchangerate-api.com free API
    const response = await fetch(
      "https://api.exchangerate-api.com/v4/latest/INR"
    );

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rate");
    }

    const data = await response.json();
    const usdRate = data.rates.USD;

    // Store in localStorage with timestamp
    localStorage.setItem(EXCHANGE_RATE_KEY, usdRate.toString());
    localStorage.setItem(RATE_TIMESTAMP_KEY, Date.now().toString());
    localStorage.setItem("is_fallback_rate", "false");

    console.log("Exchange rate fetched and cached:", usdRate);
    return { rate: usdRate, isFallback: false };
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    // Fallback to a default rate if API fails (approximate rate)
    const fallbackRate = 0.012; // 1 INR ≈ 0.012 USD
    localStorage.setItem(EXCHANGE_RATE_KEY, fallbackRate.toString());
    localStorage.setItem(RATE_TIMESTAMP_KEY, Date.now().toString());
    localStorage.setItem("is_fallback_rate", "true");
    return { rate: fallbackRate, isFallback: true };
  }
}

/**
 * Get the exchange rate from cache or fetch if expired/missing
 */
export async function getExchangeRate() {
  const cachedRate = localStorage.getItem(EXCHANGE_RATE_KEY);
  const timestamp = localStorage.getItem(RATE_TIMESTAMP_KEY);
  const isFallback = localStorage.getItem("is_fallback_rate") === "true";

  // Check if cache exists and is still valid
  if (cachedRate && timestamp) {
    const age = Date.now() - parseInt(timestamp, 10);

    if (age < CACHE_DURATION) {
      console.log("Using cached exchange rate:", cachedRate);
      return { rate: parseFloat(cachedRate), isFallback };
    }
  }

  // Cache is missing or expired, fetch new rate
  console.log("Fetching new exchange rate...");
  return await fetchExchangeRate();
}

/**
 * Convert INR amount to USD
 * @param {number} inrAmount - Amount in Indian Rupees
 * @param {number} exchangeRate - INR to USD exchange rate
 * @returns {number} Amount in US Dollars
 */
export function convertINRtoUSD(inrAmount, exchangeRate) {
  if (!inrAmount || !exchangeRate) return 0;
  return inrAmount * exchangeRate;
}

/**
 * Format price in USD
 * @param {number} usdAmount - Amount in US Dollars
 * @returns {string} Formatted price string
 */
export function formatUSD(usdAmount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usdAmount);
}

/**
 * Format price in INR
 * @param {number} inrAmount - Amount in Indian Rupees
 * @returns {string} Formatted price string
 */
export function formatINR(inrAmount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(inrAmount);
}

/**
 * Convert and format INR price to USD
 * @param {number} inrAmount - Amount in Indian Rupees
 * @param {number} exchangeRate - INR to USD exchange rate
 * @returns {string} Formatted USD price string
 */
export function convertAndFormatPrice(inrAmount, exchangeRate) {
  const usdAmount = convertINRtoUSD(inrAmount, exchangeRate);
  return formatUSD(usdAmount);
}

/**
 * Format price based on user's country
 * @param {number} inrAmount - Amount in Indian Rupees (base price)
 * @param {number} exchangeRate - INR to USD exchange rate
 * @param {string} countryCode - User's country code
 * @returns {string} Formatted price string in appropriate currency
 */
export function formatPriceByCountry(inrAmount, exchangeRate, countryCode) {
  if (isIndianUser(countryCode)) {
    return formatINR(inrAmount);
  }
  return convertAndFormatPrice(inrAmount, exchangeRate);
}

/**
 * Initialize exchange rate on app load
 * Call this when the app starts
 */
export async function initializeExchangeRate() {
  try {
    await getExchangeRate();
  } catch (error) {
    console.error("Failed to initialize exchange rate:", error);
  }
}

import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  getExchangeRate,
  getUserCountry,
  formatPriceByCountry,
  formatINR,
  convertAndFormatPrice,
} from "../utils/currencyConverter";

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [exchangeRate, setExchangeRate] = useState(null);
  const [countryCode, setCountryCode] = useState(() => {
    // Try to get from local storage first to prevent flash
    if (typeof window !== "undefined") {
      return localStorage.getItem("user_country_code");
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [isFallbackRate, setIsFallbackRate] = useState(false);

  useEffect(() => {
    async function loadCurrencyData() {
      try {
        // Load exchange rate and country in parallel
        const [rateResult, country] = await Promise.all([
          getExchangeRate(),
          getUserCountry(),
        ]);

        setExchangeRate(rateResult.rate);
        setIsFallbackRate(rateResult.isFallback);
        setCountryCode(country);
      } catch (error) {
        console.error("Error loading currency data:", error);
        // Set fallback values
        setExchangeRate(0.012);
        setIsFallbackRate(true);
        setCountryCode("US");
      } finally {
        setLoading(false);
      }
    }

    loadCurrencyData();
  }, []);

  // Format price based on user's country
  // Indian users see INR, all others see USD
  const formatPrice = (inrAmount) => {
    // 1. If country is India, always show INR (even if rate is missing)
    if (countryCode === "IN") {
      return formatINR(inrAmount);
    }

    // 2. If no exchange rate is available yet (and not India), show placeholder or default
    if (!exchangeRate) {
      return "$0.00";
    }

    // 3. For ALL other countries, force USD conversion
    return convertAndFormatPrice(inrAmount, exchangeRate);
  };

  // Check if user is from India
  const isIndianUser = countryCode === "IN";

  return (
    <CurrencyContext.Provider
      value={{
        exchangeRate,
        loading,
        formatPrice,
        isFallbackRate,
        countryCode,
        isIndianUser,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

CurrencyProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}

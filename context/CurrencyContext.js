import { createContext, useContext, useEffect, useMemo, useState } from "react";

const INR_PER_USD = 94;

const defaultRegion = {
  country: "US",
  locale: "en-US",
  currency: "USD",
  rate: 1 / INR_PER_USD,
};

const indiaRegion = {
  country: "IN",
  locale: "en-IN",
  currency: "INR",
  rate: 1,
};

const countryCurrencyMap = {
  AE: { locale: "en-AE", currency: "AED", rate: 3.67 / INR_PER_USD },
  AU: { locale: "en-AU", currency: "AUD", rate: 1.5 / INR_PER_USD },
  BD: { locale: "bn-BD", currency: "BDT", rate: 117 / INR_PER_USD },
  CA: { locale: "en-CA", currency: "CAD", rate: 1.36 / INR_PER_USD },
  DE: { locale: "de-DE", currency: "EUR", rate: 0.92 / INR_PER_USD },
  ES: { locale: "es-ES", currency: "EUR", rate: 0.92 / INR_PER_USD },
  FR: { locale: "fr-FR", currency: "EUR", rate: 0.92 / INR_PER_USD },
  GB: { locale: "en-GB", currency: "GBP", rate: 0.79 / INR_PER_USD },
  IN: indiaRegion,
  JP: { locale: "ja-JP", currency: "JPY", rate: 157 / INR_PER_USD },
  NP: { locale: "ne-NP", currency: "NPR", rate: 133.4 / INR_PER_USD },
  PK: { locale: "en-PK", currency: "PKR", rate: 278 / INR_PER_USD },
  SG: { locale: "en-SG", currency: "SGD", rate: 1.35 / INR_PER_USD },
  US: defaultRegion,
};

const timeZoneCountryMap = {
  "Asia/Calcutta": "IN",
  "Asia/Kolkata": "IN",
  "Asia/Dubai": "AE",
  "Asia/Dhaka": "BD",
  "Asia/Kathmandu": "NP",
  "Asia/Karachi": "PK",
  "Asia/Singapore": "SG",
  "Asia/Tokyo": "JP",
  "Australia/Sydney": "AU",
  "Europe/Berlin": "DE",
  "Europe/London": "GB",
  "Europe/Madrid": "ES",
  "Europe/Paris": "FR",
  "America/New_York": "US",
  "America/Los_Angeles": "US",
  "America/Toronto": "CA",
};

const countryBounds = [
  { country: "IN", minLat: 6, maxLat: 38, minLng: 68, maxLng: 98 },
  { country: "US", minLat: 24, maxLat: 49.5, minLng: -125, maxLng: -66 },
  { country: "CA", minLat: 42, maxLat: 84, minLng: -141, maxLng: -52 },
  { country: "GB", minLat: 49, maxLat: 61, minLng: -8.5, maxLng: 2 },
  { country: "AE", minLat: 22, maxLat: 27, minLng: 51, maxLng: 57 },
  { country: "AU", minLat: -44, maxLat: -10, minLng: 112, maxLng: 154 },
  { country: "BD", minLat: 20, maxLat: 27, minLng: 88, maxLng: 93 },
  { country: "DE", minLat: 47, maxLat: 55.5, minLng: 5, maxLng: 16 },
  { country: "ES", minLat: 36, maxLat: 44, minLng: -10, maxLng: 4 },
  { country: "FR", minLat: 41, maxLat: 51.5, minLng: -5.5, maxLng: 9.5 },
  { country: "JP", minLat: 24, maxLat: 46, minLng: 123, maxLng: 146 },
  { country: "NP", minLat: 26, maxLat: 31, minLng: 80, maxLng: 89 },
  { country: "PK", minLat: 23, maxLat: 37, minLng: 60, maxLng: 78 },
  { country: "SG", minLat: 1, maxLat: 1.6, minLng: 103.5, maxLng: 104.1 },
];

const CurrencyContext = createContext({
  region: indiaRegion,
  formatPrice: (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(amount || 0)),
});

function getCountryFromLocale(locale) {
  if (!locale) return "";
  const parts = locale.split("-");
  return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : "";
}

function detectRegion() {
  if (typeof window === "undefined") return defaultRegion;

  const locale = navigator.language || "en-US";
  const localeCountry = getCountryFromLocale(locale);
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const country =
    timeZoneCountryMap[timeZone] ||
    (countryCurrencyMap[localeCountry] ? localeCountry : defaultRegion.country);

  return {
    country,
    ...(countryCurrencyMap[country] || defaultRegion),
  };
}

function regionFromCountry(country) {
  return {
    country,
    ...(countryCurrencyMap[country] || defaultRegion),
  };
}

function countryFromCoordinates(latitude, longitude) {
  const match = countryBounds.find(
    (bounds) =>
      latitude >= bounds.minLat &&
      latitude <= bounds.maxLat &&
      longitude >= bounds.minLng &&
      longitude <= bounds.maxLng
  );

  return match?.country || "";
}

export function CurrencyProvider({ children }) {
  const [region, setRegion] = useState(indiaRegion);

  useEffect(() => {
    setRegion(detectRegion());

    if (typeof window === "undefined" || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const country = countryFromCoordinates(
          position.coords.latitude,
          position.coords.longitude
        );

        if (country) {
          setRegion(regionFromCountry(country));
        }
      },
      () => {},
      { enableHighAccuracy: false, maximumAge: 3600000, timeout: 5000 }
    );
  }, []);

  const value = useMemo(() => {
    const formatPrice = (amount) => {
      const convertedAmount = Number(amount || 0) * region.rate;
      const noDecimalCurrencies = ["INR", "JPY", "NPR", "PKR", "BDT"];

      return new Intl.NumberFormat(region.locale, {
        style: "currency",
        currency: region.currency,
        maximumFractionDigits: noDecimalCurrencies.includes(region.currency) ? 0 : 2,
      }).format(convertedAmount);
    };

    return { region, formatPrice };
  }, [region]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}

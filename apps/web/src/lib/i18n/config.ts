// Define the supported locales
export const locales = ["en", "da"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

// Define locale metadata
export const localeNames: Record<Locale, string> = {
  en: "English",
  da: "Danish",
};

// Helper function to check if a string is a valid locale
export const isValidLocale = (locale: string): locale is Locale => {
  return locales.includes(locale as Locale);
};

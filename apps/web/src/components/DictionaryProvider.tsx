"use client";

import { Locale } from "@/lib/i18n/config";
import { Dictionary } from "@/lib/i18n/dictionaries";
import { createContext, ReactNode, useContext } from "react";

type DictionaryContextType = {
  dictionary: Dictionary;
  locale: Locale;
  t: (
    namespace: string,
    key: string,
    params?: Record<string, string | number>,
  ) => string;
};

const DictionaryContext = createContext<DictionaryContextType | undefined>(
  undefined,
);

type DictionaryProviderProps = {
  dictionary: Dictionary;
  locale: Locale;
  children: ReactNode;
};

export function DictionaryProvider({
  dictionary,
  locale,
  children,
}: DictionaryProviderProps) {
  // Utility function to get translations
  const t = (
    namespace: string,
    key: string,
    params?: Record<string, string | number>,
  ) => {
    if (!dictionary[namespace]) {
      console.warn(`Namespace "${namespace}" not found in dictionary`);
      return key;
    }

    if (!dictionary[namespace][key]) {
      console.warn(`Key "${key}" not found in namespace "${namespace}"`);
      return key;
    }

    let translation = dictionary[namespace][key];

    // Replace any parameters in the translation
    if (params && Object.keys(params).length > 0) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        translation = translation.replace(
          new RegExp(`{{\\s*${paramKey}\\s*}}`, "g"),
          String(paramValue),
        );
      });
    }

    return translation;
  };

  return (
    <DictionaryContext.Provider value={{ dictionary, locale, t }}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary() {
  const context = useContext(DictionaryContext);

  if (context === undefined) {
    throw new Error("useDictionary must be used within a DictionaryProvider");
  }

  return context;
}

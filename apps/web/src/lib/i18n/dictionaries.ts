import { cache } from "react";
import "server-only";
import { client } from "../sanity/client";
import { Locale } from "./config";

export type DictionaryEntry = {
  key: string;
  value: string;
};

export type DictionarySection = {
  namespace: string;
  entries: DictionaryEntry[];
};

export type Dictionary = Record<string, Record<string, string>>;

// Wrapped with React's cache function to deduplicate requests
export const getDictionary = cache(
  async (locale: Locale): Promise<Dictionary> => {
    const query = `*[_type == "dictionary" && locale == $locale]{
    namespace,
    entries[] {
      key,
      value
    }
  }`;

    const dictionarySections = await client.fetch<DictionarySection[]>(
      query,
      { locale },
      {
        next: {
          tags: [`dictionary-${locale}`],
          // Cache for 1 hour by default
          revalidate: 3600,
        },
      },
    );

    // Transform data into a more usable format
    const dictionary: Dictionary = {};

    dictionarySections.forEach((section) => {
      if (section.namespace && section.entries) {
        dictionary[section.namespace] = {};
        section.entries.forEach((entry) => {
          if (entry.key && entry.value !== undefined) {
            dictionary[section.namespace][entry.key] = entry.value;
          }
        });
      }
    });

    return dictionary;
  },
);

// Access a translation with namespaces
export const getTranslation = (
  dictionary: Dictionary,
  namespace: string,
  key: string,
  params?: Record<string, string | number>,
): string => {
  // Check if namespace exists
  if (!dictionary[namespace]) {
    console.warn(`Namespace "${namespace}" not found in dictionary`);
    return key;
  }

  // Check if key exists in namespace
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

# Internationalization with Next.js and Sanity

This directory contains the code for the internationalization (i18n) implementation using Next.js and Sanity.

## Structure

- `config.ts`: Configuration for locales, locale metadata, and helpers.
- `dictionaries.ts`: Functions for loading dictionaries from Sanity and accessing translations.

## Adding a New Language

1. Update the `locales` array in `config.ts` to include the new locale code.
2. Add a new locale name to the `localeNames` object.
3. Create new dictionary entries in Sanity Studio for the new locale.

## Using Translations in Your App

### In Server Components

```tsx
import { getDictionary } from "@/lib/i18n/dictionaries";

// Inside a server component
export default async function MyServerComponent({ params: { lang } }) {
  const dictionary = await getDictionary(lang);

  return (
    <div>
      <h1>{dictionary.namespace.key}</h1>
      {/* Or with fallback if the key might not exist */}
      <p>{dictionary.namespace?.key || "Fallback text"}</p>
    </div>
  );
}
```

### In Client Components (Passing Props)

```tsx
// Server component
export default async function Page({ params: { lang } }) {
  const dictionary = await getDictionary(lang);

  return (
    <ClientComponent
      translations={{
        title: dictionary.namespace.title,
        description: dictionary.namespace.description,
      }}
    />
  );
}

// Client component
("use client");

export function ClientComponent({ translations }) {
  return (
    <div>
      <h1>{translations.title}</h1>
      <p>{translations.description}</p>
    </div>
  );
}
```

### In Client Components (Using Context)

```tsx
// In your client component
"use client";

import { useDictionary } from "@/components/DictionaryProvider";

export function MyClientComponent() {
  const { t, locale } = useDictionary();

  return (
    <div>
      <h1>{t("namespace", "key")}</h1>
      {/* With parameters */}
      <p>{t("namespace", "keyWithParams", { name: "Value" })}</p>
    </div>
  );
}
```

## Updating Dictionary Content

1. Go to Sanity Studio
2. Open the "Dictionary" section
3. Create a new dictionary entry with:
   - Namespace (category of translations e.g., "common", "blog", etc.)
   - Locale (language code)
   - Entries (key-value pairs for translations)

## Revalidation

When dictionary content changes in Sanity, you can revalidate the cache by triggering the revalidation webhook:

```
POST /api/revalidate-dictionary
```

Add this as a webhook in your Sanity Studio settings to automatically revalidate when dictionary content changes.

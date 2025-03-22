"use client";

import { Locale, localeNames, locales } from "@/lib/i18n/config";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function LanguageSwitcher() {
  const pathname = usePathname();

  // Remove the first part of the path (the locale) to get the rest of the path
  const restOfPath = pathname.split("/").slice(2).join("/");
  const currentLocale = pathname.split("/")[1] as Locale;

  return (
    <div className="flex space-x-4">
      {locales.map((locale) => (
        <Link
          key={locale}
          href={`/${locale}${restOfPath ? `/${restOfPath}` : ""}`}
          className={`text-sm hover:underline ${currentLocale === locale ? "font-bold" : ""}`}
        >
          {localeNames[locale]}
        </Link>
      ))}
    </div>
  );
}

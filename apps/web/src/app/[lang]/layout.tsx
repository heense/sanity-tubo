import { DictionaryProvider } from "@/components/DictionaryProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Locale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Metadata } from "next";

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const dictionary = await getDictionary(params.lang);

  return {
    title: dictionary.common?.siteTitle || "Multilingual Website",
    description:
      dictionary.common?.siteDescription ||
      "A multilingual website built with Next.js and Sanity",
  };
}

// Generate static params for all supported locales
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(params.lang);

  return (
    <DictionaryProvider dictionary={dictionary} locale={params.lang}>
      <div className="lang-layout">
        <header className="p-4 border-b">
          <div className="container mx-auto flex justify-between items-center">
            <div className="text-xl font-bold">
              {dictionary.common?.siteTitle || "Multilingual Website"}
            </div>
            <LanguageSwitcher />
          </div>
        </header>
        <main className="container mx-auto p-4">{children}</main>
      </div>
    </DictionaryProvider>
  );
}

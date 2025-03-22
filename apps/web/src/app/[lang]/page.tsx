import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

interface HomePageProps {
  params: {
    lang: Locale;
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const dictionary = await getDictionary(params.lang);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">
        {dictionary.home?.title || "Welcome to the multilingual site"}
      </h1>

      <p className="mb-4 text-lg">
        {dictionary.home?.introduction ||
          "This page demonstrates internationalization with Sanity and Next.js."}
      </p>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">
          {dictionary.home?.exampleTitle || "Example Dictionary Usage"}
        </h2>
        <p>
          {dictionary.home?.exampleText ||
            "This text is loaded from the Sanity dictionary for your selected language."}
        </p>
      </div>
    </div>
  );
}

import { ClientDictionaryExample } from "@/components/ClientDictionaryExample";
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

interface ContextPageProps {
  params: {
    lang: Locale;
  };
}

export default async function ContextPage({
  params: { lang },
}: ContextPageProps) {
  const dictionary = await getDictionary(lang);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">
        {dictionary.context?.title || "Dictionary Context Example"}
      </h1>

      <p className="mb-4 text-lg">
        {dictionary.context?.introduction ||
          "This demonstrates using dictionary context in client components."}
      </p>

      <div className="mt-8">
        <ClientDictionaryExample />
      </div>
    </div>
  );
}

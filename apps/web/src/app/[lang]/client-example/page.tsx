import { ClientExample } from "@/components/ClientExample";
import { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

interface ClientPageProps {
  params: {
    lang: Locale;
  };
}

export default async function ClientPage({
  params: { lang },
}: ClientPageProps) {
  const dictionary = await getDictionary(lang);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">
        {dictionary.client?.title || "Client Components Example"}
      </h1>

      <p className="mb-4 text-lg">
        {dictionary.client?.introduction ||
          "This demonstrates using translations in client components."}
      </p>

      <div className="mt-8">
        <ClientExample
          translations={{
            counter: dictionary.client?.counter || "Counter",
            increment: dictionary.client?.increment || "Increment",
            decrement: dictionary.client?.decrement || "Decrement",
            currentCount: dictionary.client?.currentCount || "Current count",
          }}
        />
      </div>
    </div>
  );
}

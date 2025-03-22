"use client";

import { useDictionary } from "./DictionaryProvider";

export function ClientDictionaryExample() {
  const { t, locale } = useDictionary();

  return (
    <div className="p-6 border rounded-lg bg-white shadow-sm">
      <h2 className="text-xl font-semibold mb-4">
        {t("client", "contextTitle")}
      </h2>
      <p className="mb-4">
        {t("client", "currentLocale")}:{" "}
        <span className="font-bold">{locale}</span>
      </p>
      <p className="mb-4">{t("client", "contextExample")}</p>
      <p className="mb-6">
        {t("client", "withParams", {
          type: "parameters",
          feature: "string interpolation",
        })}
      </p>
    </div>
  );
}

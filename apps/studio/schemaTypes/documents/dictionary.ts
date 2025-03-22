import { defineField, defineType } from "sanity";

export default defineType({
  name: "dictionary",
  title: "Dictionary",
  type: "document",
  fields: [
    defineField({
      name: "namespace",
      type: "string",
      title: "Namespace",
      description:
        'Group of related translations (e.g., "common", "header", "footer")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "locale",
      type: "string",
      title: "Language",
      description: "The language code for this dictionary",
      options: {
        list: [
          { title: "English", value: "en" },
          { title: "Danish", value: "da" },
          // Add other languages as needed
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "entries",
      type: "array",
      title: "Dictionary Entries",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "key",
              type: "string",
              title: "Key",
              description: "The key to reference this text in the code",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "value",
              type: "text",
              title: "Value",
              description: "The translated text",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              key: "key",
              value: "value",
            },
            prepare({ key, value }) {
              return {
                title: key,
                subtitle: value,
              };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      namespace: "namespace",
      locale: "locale",
    },
    prepare({ namespace, locale }) {
      return {
        title: `${namespace}`,
        subtitle: `Language: ${locale}`,
      };
    },
  },
});

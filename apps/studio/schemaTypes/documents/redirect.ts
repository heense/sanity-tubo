import { GitFork } from "lucide-react";
import { defineField, defineType } from "sanity";

export const redirect = defineType({
  name: "redirect",
  title: "Redirect",
  type: "document",
  icon: GitFork,
  fields: [
    defineField({
      name: "source",
      type: "string",
      description: "The source path (relative to site root)",
      validation: (Rule) => Rule.required().error("Source path is required"),
    }),
    defineField({
      name: "destination",
      type: "string",
      description:
        "The destination path (relative to site root) or absolute URL",
      validation: (Rule) =>
        Rule.required().error("Destination path is required"),
    }),
    defineField({
      name: "permanent",
      title: "Permanent",
      type: "string",
      description: "Is this a permanent (301) or temporary (302) redirect?",
      options: {
        list: [
          { title: "Permanent (301)", value: "permanent" },
          { title: "Temporary (302)", value: "temporary" },
        ],
        layout: "radio",
      },
      initialValue: "permanent",
      validation: (Rule) => Rule.required().error("Redirect type is required"),
    }),
  ],
  preview: {
    select: {
      source: "source",
      destination: "destination",
      permanent: "permanent",
    },
    prepare({ source, destination, permanent }) {
      return {
        title: source,
        subtitle: `${permanent === "permanent" ? "301" : "302"} → ${destination}`,
      };
    },
  },
});

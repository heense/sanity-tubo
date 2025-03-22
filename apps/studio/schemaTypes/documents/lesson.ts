import { DocumentIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

// Import relevant utilities for slug
import { GROUP } from "../../utils/constant";
import { createSlug, isUnique } from "../../utils/slug";

export default defineType({
  name: "lesson",
  title: "Lesson",
  type: "document",
  icon: DocumentIcon,
  // The language field is important for internationalization to work
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    // Custom slug field
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      description: "The unique part of the URL for this lesson",
      options: {
        source: "title",
        isUnique,
        slugify: createSlug,
      },
      validation: (Rule) => Rule.required().error("A URL slug is required"),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    // Published at field
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      description: "The date and time this lesson was published",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          marks: {
            annotations: [
              {
                name: "link",
                type: "object",
                title: "Link",
                fields: [
                  {
                    name: "href",
                    type: "url",
                    title: "URL",
                  },
                ],
              },
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "difficulty",
      title: "Difficulty Level",
      type: "string",
      options: {
        list: [
          { title: "Beginner", value: "beginner" },
          { title: "Intermediate", value: "intermediate" },
          { title: "Advanced", value: "advanced" },
        ],
        layout: "radio",
      },
    }),
    // Add language field for internationalization
    defineField({
      name: "language",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      slug: "slug.current",
      publishedAt: "publishedAt",
    },
    prepare({ title, slug, publishedAt }) {
      const path = `lessons/${slug}`;
      return {
        title,
        subtitle: publishedAt
          ? new Date(publishedAt).toLocaleDateString()
          : "Draft",
        media: DocumentIcon,
      };
    },
  },
});

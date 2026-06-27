import { defineField, defineType } from "sanity"

export const newsPostSchema = defineType({
  name: "newsPost",
  title: "News / Latest",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      description: "The web address for this post. Click 'Generate' to create one from the title.",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      options: { dateFormat: "MMMM D, YYYY" },
      initialValue: () => new Date().toISOString().slice(0, 10),
    }),
    defineField({ name: "category", title: "Category", description: 'e.g. "Show Recap", "Announcement", "Barn News"', type: "string" }),
    defineField({ name: "coverImage", title: "Cover Image", type: "image", options: { hotspot: true } }),
    defineField({
      name: "excerpt",
      title: "Short Summary",
      description: "A sentence or two shown on the news list and link previews.",
      type: "text",
      rows: 3,
    }),
    defineField({ name: "body", title: "Body", type: "array", of: [{ type: "block" }] }),
  ],
  orderings: [
    { title: "Newest first", name: "dateDesc", by: [{ field: "date", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "date", media: "coverImage" },
  },
})

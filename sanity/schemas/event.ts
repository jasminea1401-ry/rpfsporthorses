import { defineField, defineType } from "sanity"

export const eventSchema = defineType({
  name: "event",
  title: "Events",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Event Name", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "eventType",
      title: "Type",
      type: "string",
      options: { list: ["Show", "Camp", "Clinic", "Open House", "Other"] },
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      options: { dateFormat: "MMMM D, YYYY" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      description: "Optional — for multi-day events like camps.",
      type: "date",
      options: { dateFormat: "MMMM D, YYYY" },
    }),
    defineField({ name: "location", title: "Location", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3 }),
    defineField({
      name: "link",
      title: "Link",
      description: "Optional — registration or info link (e.g. show entry page).",
      type: "url",
    }),
  ],
  orderings: [
    { title: "Soonest first", name: "dateAsc", by: [{ field: "date", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "date", type: "eventType" },
    prepare({ title, subtitle, type }) {
      return { title, subtitle: [type, subtitle].filter(Boolean).join(" · ") }
    },
  },
})

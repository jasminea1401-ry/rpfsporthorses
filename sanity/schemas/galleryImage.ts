import { defineField, defineType } from "sanity"

export const galleryImageSchema = defineType({
  name: "galleryImage",
  title: "Gallery",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "alt", title: "Alt Text", type: "string" }),
    defineField({ name: "caption", title: "Caption", type: "string" }),
    defineField({ name: "category", title: "Category", type: "string", options: { list: ["Show Series", "Regionals", "Lessons/Training", "Others"] } }),
    defineField({ name: "order", title: "Display Order", type: "number" }),
  ],
})

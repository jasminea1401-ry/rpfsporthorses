import { defineField, defineType } from "sanity"

export const lessonHorseSchema = defineType({
  name: "lessonHorse",
  title: "Lesson Horses",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({ name: "photo", title: "Photo", type: "image", options: { hotspot: true } }),
    defineField({ name: "age", title: "Age", description: "e.g. 16", type: "number" }),
    defineField({ name: "height", title: "Height", description: "e.g. 18 hands", type: "string" }),
    defineField({ name: "breed", title: "Breed", description: "e.g. Dutch Harness Horse", type: "string" }),
    defineField({ name: "bio", title: "Bio", type: "text" }),
    defineField({ name: "order", title: "Display Order", type: "number" }),
  ],
  preview: {
    select: { title: "name", subtitle: "breed", media: "photo" },
  },
})

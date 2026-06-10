import { defineField, defineType } from "sanity"

export const trainerSchema = defineType({
  name: "trainer",
  title: "Trainers",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({ name: "photo", title: "Photo", type: "image", options: { hotspot: true } }),
    defineField({ name: "title", title: "Title / Role", type: "string" }),
    defineField({ name: "bio", title: "Biography", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "specialties", title: "Specialties", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "order", title: "Display Order", type: "number" }),
  ],
})

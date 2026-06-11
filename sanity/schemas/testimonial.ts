import { defineField, defineType } from "sanity"

export const testimonialSchema = defineType({
  name: "testimonial",
  title: "Testimonials",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({
      name: "role",
      title: "Role / Detail",
      description: "e.g. \"Adult Amateur Rider\" or \"Parent of student\"",
      type: "string",
    }),
    defineField({ name: "photo", title: "Photo", type: "image", options: { hotspot: true } }),
    defineField({ name: "quote", title: "Testimonial", type: "text" }),
    defineField({
      name: "rating",
      title: "Rating",
      description: "Out of 5 stars",
      type: "number",
      options: { list: [1, 2, 3, 4, 5] },
    }),
    defineField({ name: "order", title: "Display Order", type: "number" }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "photo" },
  },
})

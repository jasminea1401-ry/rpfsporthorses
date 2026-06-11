import { defineField, defineType } from "sanity"

export const galleryAlbumSchema = defineType({
  name: "galleryAlbum",
  title: "Gallery (Bulk Upload)",
  type: "document",
  fields: [
    defineField({
      name: "images",
      title: "Images",
      description:
        "Drag and drop multiple photos here at once to add them to the gallery. After uploading, you can optionally add a caption or category to each photo.",
      type: "array",
      of: [
        defineField({
          name: "photo",
          title: "Photo",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "caption", title: "Caption", type: "string" }),
            defineField({
              name: "category",
              title: "Category",
              type: "string",
              options: { list: ["Show Series", "Regionals", "Lessons/Training", "Others"] },
            }),
            defineField({ name: "alt", title: "Alt Text", type: "string" }),
          ],
        }),
      ],
      options: { layout: "grid" },
    }),
  ],
  preview: {
    select: { images: "images" },
    prepare({ images }) {
      return {
        title: "Gallery (Bulk Upload)",
        subtitle: `${images?.length || 0} photo${images?.length === 1 ? "" : "s"}`,
      }
    },
  },
})

import { defineField, defineType } from "sanity"

export const siteSettingsSchema = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
fields: [
    defineField({ name: "barnName", title: "Barn Name", type: "string" }),
    defineField({ name: "tagline", title: "Tagline", type: "string" }),
    defineField({ name: "logo", title: "Logo", type: "image" }),
    defineField({ name: "phone", title: "Phone Number", type: "string" }),
    defineField({ name: "email", title: "Email Address", type: "string" }),
    defineField({ name: "address", title: "Address", type: "text" }),
    defineField({ name: "facebook", title: "Facebook URL", type: "url" }),
    defineField({ name: "instagram", title: "Instagram URL", type: "url" }),
    defineField({ name: "heroVideo", title: "Hero Video URL", type: "url" }),
    defineField({
      name: "heroImages",
      title: "Hero Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "partnerLogos",
      title: "Partner / Association Logos",
      description: "Logos shown in the scrolling strip on the home page (e.g. NCDCTA, USDF, USEF).",
      type: "array",
      of: [
        defineField({
          name: "logo",
          title: "Logo",
          type: "image",
          fields: [defineField({ name: "name", title: "Organization Name", type: "string" })],
        }),
      ],
    }),
  ],
})

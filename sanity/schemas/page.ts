import { defineField, defineType } from "sanity"

export const pageSchema = defineType({
  name: "page",
  title: "Pages",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Page Title", type: "string" }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" } }),
    defineField({
      name: "hero",
      title: "Hero Section",
      type: "object",
      fields: [
        defineField({
          name: "eyebrow",
          title: "Eyebrow Text",
          description: "Small label shown above the heading, e.g. \"What We Offer\"",
          type: "string",
        }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "subheading", title: "Subheading", type: "text" }),
        defineField({ name: "image", title: "Hero Image", type: "image", options: { hotspot: true } }),
        defineField({ name: "ctaText", title: "Button Text", type: "string" }),
        defineField({ name: "ctaLink", title: "Button Link", type: "string" }),
      ],
    }),
    defineField({
      name: "content",
      title: "Page Content",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt", title: "Alt Text", type: "string" },
            { name: "caption", title: "Caption", type: "string" },
          ],
        },
      ],
    }),
    defineField({
      name: "primarySection",
      title: "Primary Content Section",
      description: "Used for sections like \"Our History\" — eyebrow + heading shown alongside the Page Content above, plus optional side images",
      type: "object",
      group: "additional",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow Text", type: "string" }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({
          name: "images",
          title: "Side Images",
          type: "array",
          of: [{ type: "image", options: { hotspot: true } }],
        }),
      ],
    }),
    defineField({
      name: "cards",
      title: "Info Cards / Features",
      description: "Used for sections like \"Mission & Values\" (title/description cards) or feature lists (icon + short text)",
      type: "array",
      group: "additional",
      of: [
        {
          type: "object",
          name: "card",
          fields: [
            defineField({
              name: "icon",
              title: "Icon (optional)",
              description: "Used when this card is displayed as a small feature item",
              type: "string",
              options: {
                list: [
                  { title: "Clock", value: "Clock" },
                  { title: "User", value: "User" },
                  { title: "Calendar", value: "Calendar" },
                  { title: "Check Circle", value: "CheckCircle" },
                ],
              },
            }),
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text" }),
          ],
          preview: { select: { title: "title", subtitle: "description" } },
        },
      ],
    }),
    defineField({
      name: "stats",
      title: "Stat Blocks",
      description: "Used for stat bars like \"50+ Championships\"",
      type: "array",
      group: "additional",
      of: [
        {
          type: "object",
          name: "stat",
          fields: [
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              options: {
                list: [
                  { title: "Trophy", value: "Trophy" },
                  { title: "Medal", value: "Medal" },
                  { title: "Star", value: "Star" },
                  { title: "Award", value: "Award" },
                ],
              },
            }),
            defineField({ name: "value", title: "Value", description: 'e.g. "50+"', type: "string" }),
            defineField({ name: "label", title: "Label", description: 'e.g. "Championships"', type: "string" }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        },
      ],
    }),
    defineField({
      name: "secondarySection",
      title: "Secondary Section",
      description: "Used for sections like \"The Facility\" — image + heading + bullet list",
      type: "object",
      group: "additional",
      fields: [
        defineField({ name: "eyebrow", title: "Eyebrow Text", type: "string" }),
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "image", title: "Image", type: "image", options: { hotspot: true } }),
        defineField({
          name: "listItems",
          title: "Bullet List Items",
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({ name: "buttonText", title: "Button Text", type: "string" }),
        defineField({ name: "buttonLink", title: "Button Link", type: "string" }),
      ],
    }),
    defineField({
      name: "ctaSection",
      title: "Bottom CTA Section",
      description: "Used for closing call-to-action banners",
      type: "object",
      group: "additional",
      fields: [
        defineField({ name: "heading", title: "Heading", type: "string" }),
        defineField({ name: "description", title: "Description", type: "text" }),
        defineField({ name: "buttonText", title: "Button Text", type: "string" }),
        defineField({ name: "buttonLink", title: "Button Link", type: "string" }),
      ],
    }),
    defineField({ name: "seoTitle", title: "SEO Title", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO Description", type: "text" }),
  ],
  groups: [
    { name: "additional", title: "Additional Sections" },
  ],
})

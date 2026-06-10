import { defineField, defineType } from "sanity"

export const awardSchema = defineType({
  name: "award",
  title: "Awards",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Award Title", type: "string" }),
    defineField({ name: "year", title: "Year", type: "number" }),
    defineField({ name: "show", title: "Show / Event", type: "string" }),
    defineField({ name: "horse", title: "Horse Name", type: "string" }),
    defineField({ name: "rider", title: "Rider Name", type: "string" }),
    defineField({ name: "placement", title: "Placement", type: "string" }),
    defineField({ name: "division", title: "Division / Class", type: "string" }),
    defineField({ name: "photo", title: "Award Photo", type: "image", options: { hotspot: true } }),
    defineField({ name: "description", title: "Description", type: "text" }),
  ],
  orderings: [{ title: "Year (newest first)", name: "yearDesc", by: [{ field: "year", direction: "desc" }] }],
})

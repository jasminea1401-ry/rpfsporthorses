import { defineField, defineType } from "sanity"

export const showTeamMemberSchema = defineType({
  name: "showTeamMember",
  title: "Show Team",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({ name: "photo", title: "Photo", type: "image", options: { hotspot: true } }),
    defineField({ name: "horse", title: "Horse Name", type: "string" }),
    defineField({ name: "horsePhoto", title: "Horse Photo", type: "image", options: { hotspot: true } }),
    defineField({ name: "division", title: "Division", type: "string" }),
    defineField({ name: "bio", title: "Bio", type: "text" }),
    defineField({ name: "achievements", title: "Achievements", type: "array", of: [{ type: "string" }] }),
    defineField({ name: "order", title: "Display Order", type: "number" }),
  ],
})

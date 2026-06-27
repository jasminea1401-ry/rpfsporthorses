import { defineConfig } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"
import { schemaTypes } from "./schemas"

export default defineConfig({
  name: "rpf-sporthorses",
  title: "RPF Sporthorses CMS",
  basePath: "/studio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Site Settings")
              .child(S.document().schemaType("siteSettings").documentId("siteSettings")),
            S.listItem()
              .title("Home Page")
              .child(S.document().schemaType("homePage").documentId("homePage")),
            S.divider(),
            S.documentTypeListItem("page").title("Pages"),
            S.documentTypeListItem("service").title("Services"),
            S.documentTypeListItem("trainer").title("Trainers"),
            S.documentTypeListItem("galleryImage").title("Gallery (Single Photos)"),
            S.listItem()
              .title("Gallery (Bulk Upload)")
              .child(S.document().schemaType("galleryAlbum").documentId("galleryAlbum")),
            S.documentTypeListItem("award").title("Awards"),
            S.documentTypeListItem("showTeamMember").title("Show Team"),
            S.documentTypeListItem("lessonHorse").title("Lesson Horses"),
            S.documentTypeListItem("testimonial").title("Testimonials"),
            S.documentTypeListItem("newsPost").title("News / Latest"),
            S.documentTypeListItem("event").title("Events"),
          ]),
    }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
})

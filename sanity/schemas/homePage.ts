import { defineField, defineType } from "sanity"

export const homePageSchema = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    defineField({
      name: "heroTagline",
      title: "Hero Eyebrow Text",
      description: 'Small text above the headline, e.g. "Raeford, North Carolina"',
      type: "string",
    }),
    defineField({
      name: "heroHeading",
      title: "Hero Headline (white part)",
      description: 'e.g. "RPF" — the rest of the headline is set below in gold',
      type: "string",
    }),
    defineField({
      name: "heroHeadingAccent",
      title: "Hero Headline (gold part)",
      description: 'e.g. "Sporthorses"',
      type: "string",
    }),
    defineField({
      name: "heroDescription",
      title: "Hero Description",
      type: "text",
    }),
    defineField({
      name: "heroPrimaryButtonText",
      title: "Primary Button Text",
      description: 'Links to the Trial booking page, e.g. "Book a Trial Lesson"',
      type: "string",
    }),
    defineField({
      name: "heroSecondaryButtonText",
      title: "Secondary Button Text",
      description: 'Links to the Services page, e.g. "View Our Services"',
      type: "string",
    }),
    defineField({
      name: "highlightsLabel",
      title: "Highlights Section Label",
      description: 'Small label above the highlights heading, e.g. "Why Choose RPF"',
      type: "string",
    }),
    defineField({
      name: "highlightsHeading",
      title: "Highlights Heading",
      description: 'e.g. "Excellence in Every Stride"',
      type: "string",
    }),
    defineField({
      name: "highlights",
      title: "Highlight Cards",
      description: "The 4 cards shown under the hero",
      type: "array",
      of: [
        {
          type: "object",
          name: "highlight",
          fields: [
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              options: {
                list: [
                  { title: "Award / Trophy", value: "Award" },
                  { title: "Users / Trainers", value: "Users" },
                  { title: "Calendar / Scheduling", value: "Calendar" },
                  { title: "Star", value: "Star" },
                  { title: "Heart", value: "Heart" },
                  { title: "Shield", value: "Shield" },
                  { title: "Check Circle", value: "CheckCircle" },
                  { title: "Map Pin", value: "MapPin" },
                ],
              },
            }),
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({ name: "description", title: "Description", type: "text" }),
          ],
          preview: {
            select: { title: "title", subtitle: "description" },
          },
        },
      ],
    }),
    defineField({
      name: "storyLabel",
      title: "Story Section Label",
      description: 'e.g. "Our Story"',
      type: "string",
    }),
    defineField({
      name: "storyHeading",
      title: "Story Heading",
      description: 'e.g. "A Legacy Built on Passion"',
      type: "string",
    }),
    defineField({
      name: "storyContent",
      title: "Story Content",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "storyImage",
      title: "Story Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "storyStatNumber",
      title: "Story Stat Number",
      description: 'e.g. "20+"',
      type: "string",
    }),
    defineField({
      name: "storyStatLabel",
      title: "Story Stat Label",
      description: 'e.g. "Years of Excellence"',
      type: "string",
    }),
    defineField({
      name: "servicesLabel",
      title: "Services Section Label",
      description: 'e.g. "What We Offer"',
      type: "string",
    }),
    defineField({
      name: "servicesHeading",
      title: "Services Section Heading",
      description: 'e.g. "Our Services"',
      type: "string",
    }),
    defineField({
      name: "ctaHeading",
      title: "Bottom CTA Heading",
      description: 'e.g. "Ready to Start Your Journey?"',
      type: "string",
    }),
    defineField({
      name: "ctaDescription",
      title: "Bottom CTA Description",
      type: "text",
    }),
  ],
})

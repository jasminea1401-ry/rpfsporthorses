import { pageSchema } from "./page"
import { trainerSchema } from "./trainer"
import { galleryImageSchema } from "./galleryImage"
import { galleryAlbumSchema } from "./galleryAlbum"
import { awardSchema } from "./award"
import { showTeamMemberSchema } from "./showTeamMember"
import { lessonHorseSchema } from "./lessonHorse"
import { testimonialSchema } from "./testimonial"
import { newsPostSchema } from "./newsPost"
import { eventSchema } from "./event"
import { serviceSchema } from "./service"
import { siteSettingsSchema } from "./siteSettings"
import { homePageSchema } from "./homePage"

export const schemaTypes = [
  siteSettingsSchema,
  homePageSchema,
  pageSchema,
  serviceSchema,
  trainerSchema,
  galleryImageSchema,
  galleryAlbumSchema,
  awardSchema,
  showTeamMemberSchema,
  lessonHorseSchema,
  testimonialSchema,
  newsPostSchema,
  eventSchema,
]

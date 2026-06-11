import { pageSchema } from "./page"
import { trainerSchema } from "./trainer"
import { galleryImageSchema } from "./galleryImage"
import { awardSchema } from "./award"
import { showTeamMemberSchema } from "./showTeamMember"
import { lessonHorseSchema } from "./lessonHorse"
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
  awardSchema,
  showTeamMemberSchema,
  lessonHorseSchema,
]

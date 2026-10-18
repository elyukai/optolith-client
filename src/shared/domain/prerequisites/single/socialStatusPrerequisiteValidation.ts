import { SocialStatusPrerequisite } from "@optolith/database-schema/gen"

/**
 * Checks a single social status prerequisite if it’s matched.
 */
export const checkSocialStatusPrerequisite = (
  caps: {
    getSocialStatus: () => number | undefined
  },
  p: SocialStatusPrerequisite,
): boolean => {
  const currentSocialStatus = caps.getSocialStatus()
  return currentSocialStatus !== undefined && currentSocialStatus >= p.id.social_status
}

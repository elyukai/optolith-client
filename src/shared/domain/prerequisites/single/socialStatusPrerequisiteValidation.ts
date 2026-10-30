import type {
  SocialStatus,
  SocialStatus_ID,
  SocialStatusPrerequisite,
} from "@optolith/database-schema/gen"

/**
 * Checks a single social status prerequisite if it’s matched.
 */
export const checkSocialStatusPrerequisite = (
  caps: {
    socialStatus: SocialStatus_ID | undefined
    getSocialStatusById: (id: SocialStatus_ID) => SocialStatus | undefined
  },
  p: SocialStatusPrerequisite,
): boolean => {
  const currentSocialStatus =
    caps.socialStatus !== undefined ? caps.getSocialStatusById(caps.socialStatus) : undefined
  const requiredSocialStatus = caps.getSocialStatusById(p.id)
  return (
    currentSocialStatus !== undefined &&
    requiredSocialStatus !== undefined &&
    currentSocialStatus.position >= requiredSocialStatus.position
  )
}

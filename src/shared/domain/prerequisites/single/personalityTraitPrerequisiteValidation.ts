import type {
  PersonalityTraitPrerequisite,
  PersonalityTrait_ID,
} from "@optolith/database-schema/gen"

/**
 * Checks a single state prerequisite if it’s matched.
 */
export const checkPersonalityTraitPrerequisite = (
  caps: {
    isPersonalityTraitActive: (id: PersonalityTrait_ID) => boolean
  },
  p: PersonalityTraitPrerequisite,
): boolean => caps.isPersonalityTraitActive(p.id) === p.active

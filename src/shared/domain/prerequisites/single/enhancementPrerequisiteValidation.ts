import type {
  Enhancement,
  Enhancement_ID,
  EnhancementPrerequisite,
  SkillWithEnhancementsIdentifier,
} from "@optolith/database-schema/gen"
import type { CharacterActivatableRatedWithEnhancements } from "../../rated/ratedEntry.ts"

/**
 * Checks a single external enhancement prerequisite if it’s matched.
 */
export const checkEnhancementPrerequisite = (
  caps: {
    getEnhancementById: (id: Enhancement_ID) => Enhancement | undefined
    getSkillWithEnhancementsById: (
      id: SkillWithEnhancementsIdentifier,
    ) =>
      | CharacterActivatableRatedWithEnhancements<SkillWithEnhancementsIdentifier["kind"]>
      | undefined
  },
  p: EnhancementPrerequisite,
): boolean => {
  const { parent: parentId } = caps.getEnhancementById(p.id) ?? {}
  const parent = parentId ? caps.getSkillWithEnhancementsById(parentId) : undefined
  return parent?.activeEnhancements.values().some(e => e.id === p.id) ?? false
}

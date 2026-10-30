import type { RatedIdentifier, RatedPrerequisite } from "@optolith/database-schema/gen"
import type { CharacterAnyRatedEntry } from "../../rated/ratedEntry.ts"

/**
 * Checks a single rated prerequisite if it’s matched.
 */
export const checkRatedPrerequisite = (
  caps: {
    getRatedById: (
      id: RatedIdentifier,
    ) => CharacterAnyRatedEntry<RatedIdentifier["kind"], boolean> | undefined
  },
  p: RatedPrerequisite,
): boolean => (caps.getRatedById(p.id)?.value ?? -1) >= p.value

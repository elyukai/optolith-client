import type { AncestorBloodAdvantagesCache } from "@optolith/database-schema/cache"
import type { Advantage_ID } from "@optolith/database-schema/gen"
import type { CharacterActivatable } from "../../activatable/activatable.ts"

/**
 * Checks a single ancestor blood prerequisite if it’s matched.
 */
export const checkAncestorBloodPrerequisite = (
  caps: {
    activeAdvantages: CharacterActivatable<"Advantage">[]
    ancestorBloodAdvantagesCache: AncestorBloodAdvantagesCache
  },
  source: {
    id: Advantage_ID
  },
): boolean =>
  // check whether no other entry with this prerequisite is active
  caps.activeAdvantages.every(
    x => x.id !== source.id && caps.ancestorBloodAdvantagesCache.includes(x.id),
  )

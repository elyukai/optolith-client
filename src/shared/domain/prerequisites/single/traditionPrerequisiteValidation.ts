import type {
  BlessedTraditionPrerequisite,
  MagicalTraditionPrerequisite,
} from "@optolith/database-schema/gen"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type { CharacterActivatable } from "../../activatable/activatable.ts"

/**
 * Checks a single blessed tradition prerequisite if it’s matched.
 */
export const checkBlessedTraditionPrerequisite = (
  caps: {
    activeBlessedTraditions: CharacterActivatable<"BlessedTradition">[]
  },
  p: BlessedTraditionPrerequisite,
): boolean => {
  const [activeBlessedTradition] = caps.activeBlessedTraditions

  if (activeBlessedTradition === undefined) {
    return false
  }

  if (p.restriction === undefined) {
    return true
  }

  return activeBlessedTradition.dbEntry.type.kind === p.restriction.kind
}

/**
 * Checks a single magical tradition prerequisite if it’s matched.
 */
export const checkMagicalTraditionPrerequisite = (
  caps: {
    activeMagicalTraditions: CharacterActivatable<"MagicalTradition">[]
  },
  p: MagicalTraditionPrerequisite,
): boolean => {
  const { activeMagicalTraditions } = caps

  if (activeMagicalTraditions.length === 0) {
    return false
  }

  switch (p.restriction?.kind) {
    case undefined:
      return true
    case "CanLearnRituals":
      return activeMagicalTraditions.some(t => t.dbEntry.can_learn_rituals)
    case "CanBindFamiliars":
      return activeMagicalTraditions.some(t => t.dbEntry.can_bind_familiars)
    default:
      return assertExhaustive(p.restriction)
  }
}

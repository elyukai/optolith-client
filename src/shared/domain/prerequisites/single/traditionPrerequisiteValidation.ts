import {
  BlessedTraditionPrerequisite,
  MagicalTraditionPrerequisite,
} from "optolith-database-schema/types/prerequisites/single/TraditionPrerequisite"
import { assertExhaustive } from "../../../utils/typeSafety.ts"
import { CombinedActiveBlessedTradition } from "../../activatable/blessedTradition.ts"
import { CombinedActiveMagicalTradition } from "../../activatable/magicalTradition.ts"

/**
 * Checks a single blessed tradition prerequisite if it’s matched.
 */
export const checkBlessedTraditionPrerequisite = (
  caps: {
    getActiveBlessedTradition: () => CombinedActiveBlessedTradition | undefined
  },
  p: BlessedTraditionPrerequisite,
): boolean => {
  const activeBlessedTradition = caps.getActiveBlessedTradition()

  if (activeBlessedTradition === undefined) {
    return false
  }

  switch (p.restriction) {
    case undefined:
      return true
    case "Church":
      return !activeBlessedTradition.static.is_shamanistic
    case "Shamanistic":
      return activeBlessedTradition.static.is_shamanistic
    default:
      return assertExhaustive(p.restriction)
  }
}

/**
 * Checks a single magical tradition prerequisite if it’s matched.
 */
export const checkMagicalTraditionPrerequisite = (
  caps: {
    getActiveMagicalTraditions: () => CombinedActiveMagicalTradition[]
  },
  p: MagicalTraditionPrerequisite,
): boolean => {
  const activeMagicalTraditions = caps.getActiveMagicalTraditions()

  if (activeMagicalTraditions.length === 0) {
    return false
  }

  switch (p.restriction) {
    case undefined:
      return true
    case "CanLearnRituals":
      return activeMagicalTraditions.some(t => t.static.can_learn_rituals)
    case "CanBindFamiliars":
      return activeMagicalTraditions.some(t => t.static.can_bind_familiars)
    default:
      return assertExhaustive(p.restriction)
  }
}

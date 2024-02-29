import { ImprovementCost } from "../adventurePoints/improvementCost.ts"
import { ActivatableRated } from "./ratedEntry.ts"

/**
 * The improvement cost for a curse is always the same.
 */
export const cursesImprovementCost = ImprovementCost.B

/**
 * The improvement cost for a curse is always the same.
 */
export const dominationRitualsImprovementCost = ImprovementCost.B

/**
 * The improvement cost for a curse is always the same.
 */
export const geodeRitualsImprovementCost = ImprovementCost.B

/**
 * Creates an initial dynamic magical action entry.
 */
export const createEmptyDynamicMagicalAction = (id: number): ActivatableRated => ({
  id,
  value: undefined,
  cachedAdventurePoints: {
    general: 0,
    bound: 0,
  },
  dependencies: [],
  boundAdventurePoints: [],
})

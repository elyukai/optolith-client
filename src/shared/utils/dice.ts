import { Dice, DieType } from "optolith-database-schema/types/_Dice"
import { randomIntRange } from "./math.ts"

/**
 * Splits a dice definition into its individual dice.
 */
export const separateDice = (dice: Dice) => Array.from({ length: dice.number }, () => dice.sides)

/**
 * Splits a dice definition into its individual dice.
 */
export const rollDice = (sides: DieType) => randomIntRange(1, sides)

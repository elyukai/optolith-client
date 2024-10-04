import { ImprovementCost as RawImprovementCost } from "optolith-database-schema/types/_ImprovementCost"
import { rangeSafe, sum } from "../../utils/array.ts"
import { Nullish } from "../../utils/nullable.ts"
import { Translate } from "../../utils/translate.ts"
import { assertExhaustive } from "../../utils/typeSafety.ts"
import { LibraryEntryContent } from "../libraryEntry.ts"

/**
 * The cost category of an improvement.
 */
export enum ImprovementCost {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  E = "E",
}

/**
 * Returns the base value for calculating the adventure points for an
 * improvement cost.
 */
const adventureCostBase = (ic: ImprovementCost): number => {
  switch (ic) {
    case ImprovementCost.A:
      return 1
    case ImprovementCost.B:
      return 2
    case ImprovementCost.C:
      return 3
    case ImprovementCost.D:
      return 4
    case ImprovementCost.E:
      return 15
    default:
      return assertExhaustive(ic)
  }
}

/**
 * The highest value that uses the base cost value. Values above this threshold
 * have cost that increase with each value increase.
 */
const constantThresholdValue = (ic: ImprovementCost): number => {
  switch (ic) {
    case ImprovementCost.A:
    case ImprovementCost.B:
    case ImprovementCost.C:
    case ImprovementCost.D:
      return 12
    case ImprovementCost.E:
      return 14
    default:
      return assertExhaustive(ic)
  }
}

/**
 * Returns the multiplier for the base cost value for the given improvement
 * cost. The multiplier is 1 for values below the constant threshold value and
 * increases by 1 for each value above the threshold.
 */
const baseMultiplier = (ic: ImprovementCost, value: number): number =>
  Math.max(1, value - constantThresholdValue(ic) + 1)

/**
 * Returns the adventure points required to increase a value by 1 to the given
 * value.
 */
const adventurePointsValue = (ic: ImprovementCost, value: number): number =>
  adventureCostBase(ic) * baseMultiplier(ic, value)

/**
 * Returns the adventure points required to increase a value from `fromValue` to
 * `toValue` with the given improvement cost `ic`. If the target value is lower
 * than the current value, the result will be negative.
 */
export const adventurePointsForRange = (
  ic: ImprovementCost,
  fromValue: number,
  toValue: number,
): number => {
  if (fromValue === toValue) {
    return 0
  }

  const lowerBound = Math.min(fromValue, toValue) + 1
  const upperBound = Math.max(fromValue, toValue)
  const steps = rangeSafe(lowerBound, upperBound).map(value => adventurePointsValue(ic, value))
  const modifier = fromValue > toValue ? -1 : 1

  return sum(steps) * modifier
}

/**
 * Returns the adventure points required to increase a value from `fromValue` by
 * 1 with the given improvement cost `ic`.
 */
export const adventurePointsForIncrement = (ic: ImprovementCost, fromValue: number): number =>
  adventurePointsValue(ic, fromValue + 1)

/**
 * Returns the adventure points required to decrease a value from `fromValue` by
 * 1 with the given improvement cost `ic`.
 */
export const adventurePointsForDecrement = (ic: ImprovementCost, fromValue: number): number =>
  -adventurePointsValue(ic, fromValue)

/**
 * Returns the adventure points required to activate a skill with the given
 * improvement cost `ic`.
 */
export const adventurePointsForActivation = adventureCostBase

/**
 * Compares two improvement costs. The positivity of the result indicates the
 * relative order of the two costs; a negative result means the first argument
 * is lower than the second.
 */
export const compareImprovementCost = (ic1: ImprovementCost, ic2: ImprovementCost): number => {
  const toInt = (ic: ImprovementCost): number => {
    switch (ic) {
      case ImprovementCost.A:
        return 1
      case ImprovementCost.B:
        return 2
      case ImprovementCost.C:
        return 3
      case ImprovementCost.D:
        return 4
      case ImprovementCost.E:
        return 5
      default:
        return assertExhaustive(ic)
    }
  }

  return toInt(ic1) - toInt(ic2)
}

/**
 * Returns `true` if the two improvement costs are equal.
 */
export const equals = (ic1: ImprovementCost, ic2: ImprovementCost): boolean => ic1 === ic2

/**
 * Returns the name of the passed Improvement Cost.
 */
export const toString = (ic: ImprovementCost): string => {
  switch (ic) {
    case ImprovementCost.A:
      return "A"
    case ImprovementCost.B:
      return "B"
    case ImprovementCost.C:
      return "C"
    case ImprovementCost.D:
      return "D"
    case ImprovementCost.E:
      return "E"
    default:
      return assertExhaustive(ic)
  }
}

/**
 * Converts an improvement cost from the database schema to the domain schema.
 */
export const fromRaw = <T extends RawImprovementCost | undefined>(
  ic: T,
): ImprovementCost | Nullish<T> => {
  switch (ic) {
    case "A":
      return ImprovementCost.A
    case "B":
      return ImprovementCost.B
    case "C":
      return ImprovementCost.C
    case "D":
      return ImprovementCost.D
    case undefined:
      return undefined as Nullish<T>
    default:
      return assertExhaustive(ic)
  }
}

/**
 * Returns the improvement cost as an inline library property.
 */
export const createImprovementCost = (
  translate: Translate,
  improvementCost: RawImprovementCost,
): LibraryEntryContent => ({
  label: translate("Improvement Cost"),
  value: toString(fromRaw(improvementCost)),
})

import { rangeSafe, sum } from "../../utils/array.ts"
import { assertExhaustive } from "../../utils/typeSafety.ts"

export enum ImprovementCost {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  E = "E",
}

const adventureCostBase = (ic: ImprovementCost): number => {
  switch (ic) {
    case ImprovementCost.A: return 1
    case ImprovementCost.B: return 2
    case ImprovementCost.C: return 3
    case ImprovementCost.D: return 4
    case ImprovementCost.E: return 15
    default: return assertExhaustive(ic)
  }
}

const constantThresholdValue = (ic: ImprovementCost): number => {
  switch (ic) {
    case ImprovementCost.A:
    case ImprovementCost.B:
    case ImprovementCost.C:
    case ImprovementCost.D: return 12
    case ImprovementCost.E: return 14
    default: return assertExhaustive(ic)
  }
}

const baseMultiplier = (ic: ImprovementCost, value: number): number =>
  Math.max(1, value - constantThresholdValue(ic) + 1)

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
  toValue: number
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
export const compare = (ic1: ImprovementCost, ic2: ImprovementCost): number => {
  const toInt = (ic: ImprovementCost): number => {
    switch (ic) {
      case ImprovementCost.A: return 1
      case ImprovementCost.B: return 2
      case ImprovementCost.C: return 3
      case ImprovementCost.D: return 4
      case ImprovementCost.E: return 5
      default: return assertExhaustive(ic)
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
    case ImprovementCost.A: return "A"
    case ImprovementCost.B: return "B"
    case ImprovementCost.C: return "C"
    case ImprovementCost.D: return "D"
    case ImprovementCost.E: return "E"
    default: return assertExhaustive(ic)
  }
}

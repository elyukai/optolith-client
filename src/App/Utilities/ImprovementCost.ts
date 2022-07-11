import { range } from "../../Data/Ix"
import { foldr } from "../../Data/List"
import { Pair } from "../../Data/Tuple"
import { assertUnreachable } from "./exhaustiveChecks"

export enum ImprovementCost {
  A,
  B,
  C,
  D,
  E,
}

const getAPCostBaseByIC = (ic: ImprovementCost) => {
  switch (ic) {
    case ImprovementCost.A: return 1
    case ImprovementCost.B: return 2
    case ImprovementCost.C: return 3
    case ImprovementCost.D: return 4
    case ImprovementCost.E: return 15
    default: return assertUnreachable (ic)
  }
}

const getLastSRWithConstantCost = (ic: ImprovementCost) =>
  ic === ImprovementCost.E ? 14 : 12

const getBaseMultiplier = (ic: ImprovementCost, sr: number) =>
  Math.max (1, sr - getLastSRWithConstantCost (ic) + 1)

const getCost = (ic: ImprovementCost, sr: number) =>
  getAPCostBaseByIC (ic) * getBaseMultiplier (ic, sr)

const getAPForBounds = (ic: ImprovementCost, l: number, u: number) =>
  foldr ((sr: number) => (acc: number) => acc + getCost (ic, sr))
        (0)
        (range (Pair (l + 1, u)))


/**
 * `getAPRange ic fromSR toSR` returns the AP cost for the given SR range.
 */
export const getAPForRange = (ic: ImprovementCost, fromSR: number, toSR: number): number => {
  if (fromSR < toSR) {
    return getAPForBounds (ic, fromSR, toSR)
  }
  else if (fromSR > toSR) {
    return getAPForBounds (ic, toSR, fromSR) * -1
  }
  else {
    return 0
  }
}

export const getAPForInc = (ic: ImprovementCost, fromSR: number): number =>
  getCost (ic, fromSR + 1)

export const getAPForDec = (ic: ImprovementCost, fromSR: number): number =>
  getCost (ic, fromSR) * -1

export const getAPForActivatation = getAPCostBaseByIC

/**
 * Returns the name of the passed Improvement Cost.
  */
export const icToStr = (ic: ImprovementCost): string => {
  switch (ic) {
    case ImprovementCost.A: return "A"
    case ImprovementCost.B: return "B"
    case ImprovementCost.C: return "C"
    case ImprovementCost.D: return "D"
    case ImprovementCost.E: return "E"
    default: return assertUnreachable (ic)
  }
}

/**
 * Returns an index used for getting the IC-based cost for an Activatable entry.
  */
export const icToIx = (ic: ImprovementCost): number => {
  switch (ic) {
    case ImprovementCost.A: return 0
    case ImprovementCost.B: return 1
    case ImprovementCost.C: return 2
    case ImprovementCost.D: return 3
    case ImprovementCost.E: return 4
    default: return assertUnreachable (ic)
  }
}

export const strToIcUnsafe = (x: string): ImprovementCost => {
  switch (x) {
    case "A": return ImprovementCost.A
    case "B": return ImprovementCost.B
    case "C": return ImprovementCost.C
    case "D": return ImprovementCost.D
    case "E": return ImprovementCost.E
    default: throw new TypeError (`strToIc: ${x} is not an Improvement Cost`)
  }
}

export const strToIc = (x: "A" | "B" | "C" | "D" | "E"): ImprovementCost => {
  switch (x) {
    case "A": return ImprovementCost.A
    case "B": return ImprovementCost.B
    case "C": return ImprovementCost.C
    case "D": return ImprovementCost.D
    case "E": return ImprovementCost.E
    default: return assertUnreachable (x)
  }
}

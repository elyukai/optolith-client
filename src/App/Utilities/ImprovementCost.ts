import { range } from "../../Data/Ix"
import { foldr } from "../../Data/List"
import { Pair } from "../../Data/Tuple"
import { assertUnreachable } from "./exhaustiveChecks"

export type ImprovementCost =
  | { tag: "A" }
  | { tag: "B" }
  | { tag: "C" }
  | { tag: "D" }
  | { tag: "E" }

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const ImprovementCost = {
  A: { tag: "A" } as ImprovementCost,
  B: { tag: "B" } as ImprovementCost,
  C: { tag: "C" } as ImprovementCost,
  D: { tag: "D" } as ImprovementCost,
  E: { tag: "E" } as ImprovementCost,
}

const getAPCostBaseByIC = (ic: ImprovementCost) => {
  switch (ic.tag) {
    case "A": return 1
    case "B": return 2
    case "C": return 3
    case "D": return 4
    case "E": return 15
    default: return assertUnreachable (ic)
  }
}

const getLastSRWithConstantCost = (ic: ImprovementCost) =>
  ic.tag === "E" ? 14 : 12

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
  switch (ic.tag) {
    case "A": return "A"
    case "B": return "B"
    case "C": return "C"
    case "D": return "D"
    case "E": return "E"
    default: return assertUnreachable (ic)
  }
}

/**
 * Returns an index used for getting the IC-based cost for an Activatable entry.
  */
export const icToIx = (ic: ImprovementCost): number => {
  switch (ic.tag) {
    case "A": return 0
    case "B": return 1
    case "C": return 2
    case "D": return 3
    case "E": return 4
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

/**
 * Negative value means `x1 < x2` and positive value means `x1 > x2`. Comparing
 * the result with `0` mirrors the sign:
 *
 * - `x1 < x2` ≈ `compare(x1, x2) < 0`
 * - `x1 >= x2` ≈ `compare(x1, x2) >= 0`
 * - `x1 === x2` ≈ `compare(x1, x2) === 0`
 */
export const compare = (x1: ImprovementCost, x2: ImprovementCost): number => {
  const toInt = (x: ImprovementCost): number => {
    switch (x.tag) {
      case "A": return 1
      case "B": return 2
      case "C": return 3
      case "D": return 4
      case "E": return 5
      default: return assertUnreachable (x)
    }
  }

  return toInt (x1) - toInt (x2)
}

export const equals = (x1: ImprovementCost, x2: ImprovementCost): boolean => x1.tag === x2.tag

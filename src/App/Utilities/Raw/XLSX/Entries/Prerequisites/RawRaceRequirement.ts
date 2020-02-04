import { fromArray } from "../../../../../../Data/List"
import { Nothing } from "../../../../../../Data/Maybe"
import { RaceRequirement } from "../../../../../Models/Wiki/prerequisites/RaceRequirement"
import { AllRawRequirementObjects } from "../rawTypeHelpers"

export interface RawRaceRequirement {
  id: "RACE"
  value: number | number[]
  active?: boolean
}

export const isRawRaceRequirement =
  (req: AllRawRequirementObjects): req is RawRaceRequirement =>
    req.id === "RACE"
    && (
      // @ts-ignore
      typeof req.value === "number"
      // @ts-ignore
      || (Array.isArray (req.value) && (req.value as any[]) .every (isNumber))
    )
    // @ts-ignore
    && (req.active === undefined || typeof req.active === "boolean")

export const toRaceRequirement =
  (x: RawRaceRequirement) =>
    RaceRequirement ({
      id: Nothing,
      value: Array.isArray (x .value) ? fromArray (x .value) : x .value,
      active: x .active === undefined ? true : x .active,
    })

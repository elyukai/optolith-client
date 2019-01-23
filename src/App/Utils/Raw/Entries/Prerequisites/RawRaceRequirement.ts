import { AllRawRequirementObjects } from "../rawTypeHelpers";

export interface RawRaceRequirement {
  id: "RACE"
  value: number | number[]
}

export const isRawRaceRequirement =
  (req: AllRawRequirementObjects): req is RawRaceRequirement =>
    req.id === "RACE"
    && (
      // @ts-ignore
      typeof req.value === "number"
      // @ts-ignore
      || Array.isArray (req.value) && req.value .every (isNumber)
    )

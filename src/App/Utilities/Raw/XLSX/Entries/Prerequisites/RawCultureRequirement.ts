import { isNumber } from "../../../../typeCheckUtils"
import { AllRawRequirementObjects } from "../rawTypeHelpers"

export interface RawCultureRequirement {
  id: "CULTURE"
  value: number | number[]
}

export const isRawCultureRequirement =
  (req: AllRawRequirementObjects): req is RawCultureRequirement =>
    req.id === "CULTURE"
    && (
      // @ts-ignore
      typeof req.value === "number"
      // @ts-ignore
      || (Array.isArray (req.value) && (req.value as any[]) .every (isNumber))
    )

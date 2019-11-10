import { isNumber } from "../../../../typeCheckUtils";
import { AllRawRequirementObjects } from "../rawTypeHelpers";

export interface RawPactRequirement {
  id: "PACT"
  category: number
  domain?: number | number[]
  level?: number
}

export const isRawPactRequirement =
  (req: AllRawRequirementObjects): req is RawPactRequirement =>
    req.id === "PACT"
    // @ts-ignore
    && typeof req.category === "number"
    && (
      // @ts-ignore
      typeof req.domain === "number"
      // @ts-ignore
      || Array.isArray (req.domain) && req.domain.every (isNumber)
      // @ts-ignore
      || req.domain === undefined
    )
    && (
      // @ts-ignore
      typeof req.level === "number"
      // @ts-ignore
      || req.level === undefined
    )

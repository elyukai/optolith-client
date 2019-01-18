import { AllRawRequirementObjects } from "../rawTypeHelpers";

export interface RawRequirePrimaryAttribute {
  id: "ATTR_PRIMARY"
  value: number
  type: 1 | 2
}

export const isRawPrimaryAttributeRequirement =
  (req: AllRawRequirementObjects): req is RawRequirePrimaryAttribute =>
    req.id === "ATTR_PRIMARY"
    // @ts-ignore
    && typeof req.value === "number"
    // @ts-ignore
    && (typeof req.type === 1 || typeof req.type === 2)

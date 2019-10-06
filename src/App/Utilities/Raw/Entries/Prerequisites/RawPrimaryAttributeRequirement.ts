import { PrimaryAttributeType } from "../../../../Models/Wiki/prerequisites/PrimaryAttributeRequirement";
import { AllRawRequirementObjects } from "../rawTypeHelpers";

export interface RawRequirePrimaryAttribute {
  id: "ATTR_PRIMARY"
  value: number
  type: PrimaryAttributeType
}

export const isRawRequiringPrimaryAttribute =
  (req: AllRawRequirementObjects): req is RawRequirePrimaryAttribute =>
    req.id === "ATTR_PRIMARY"
    // @ts-ignore
    && typeof req.value === "number"
    // @ts-ignore
    && (req.type === 1 || req.type === 2)

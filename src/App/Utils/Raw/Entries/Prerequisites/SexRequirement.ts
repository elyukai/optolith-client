import { Sex } from "../../../../Models/Hero/heroTypeHelpers";
import { AllRawRequirementObjects } from "../rawTypeHelpers";

export interface RawSexRequirement {
  id: "SEX"
  value: Sex
}

export const isRawSexRequirement =
  (req: AllRawRequirementObjects): req is RawSexRequirement =>
    req.id === "SEX"
    // @ts-ignore
    && (typeof req.value === "m" || typeof req.value === "f")

import { fromDefault } from "../../../Data/Record";

export interface SkillOptionalDependency {
  "@@name": "SkillOptionalDependency"
  value: number
  origin: string
}

/**
 * Create a new `SkillOptionalDependency` object.
 */
export const SkillOptionalDependency =
  fromDefault ("SkillOptionalDependency")
              <SkillOptionalDependency> ({
                value: 0,
                origin: "",
              })

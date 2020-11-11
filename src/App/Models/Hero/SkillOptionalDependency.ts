import { fromDefault } from "../../../Data/Record"

export interface SkillOptionalDependency {
  "@@name": "SkillOptionalDependency"
  value: number
  origin: string
}

/**
 * Create a new `SkillOptionalDependency` object.
 */
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SkillOptionalDependency =
  fromDefault ("SkillOptionalDependency")
              <SkillOptionalDependency> ({
                value: 0,
                origin: "",
              })

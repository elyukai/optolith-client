import { fromDefault, Record } from "../../../Data/Record"
import { NumIdName } from "../NumIdName"

export interface SkillGroup {
  "@@name": "SkillGroup"
  id: number
  name: string
  fullName: string
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const SkillGroup =
  fromDefault ("SkillGroup")
              <SkillGroup> ({
                id: 0,
                name: "",
                fullName: "",
              })

export const skillGroupToMediumNumIdName =
  (x: Record<SkillGroup>) => NumIdName ({
                               id: SkillGroup.A.id (x),
                               name: SkillGroup.A.name (x),
                             })

export const skillGroupToLongNumIdName =
  (x: Record<SkillGroup>) => NumIdName ({
                               id: SkillGroup.A.id (x),
                               name: SkillGroup.A.fullName (x),
                             })

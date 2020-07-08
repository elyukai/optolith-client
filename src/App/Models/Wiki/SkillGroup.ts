import { NumIdName } from "../NumIdName"
import { SkillGroup } from "../Skill.gen"

export { SkillGroup }

export const skillGroupToMediumNumIdName =
  (x: SkillGroup): NumIdName => ({
                                  id: x.id,
                                  name: x.name,
                                })

export const skillGroupToLongNumIdName =
  (x: SkillGroup): NumIdName => ({
                                  id: x.id,
                                  name: x.fullName,
                                })

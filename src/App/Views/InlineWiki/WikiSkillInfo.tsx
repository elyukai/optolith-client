import * as React from "react"
import { Record } from "../../../Data/Record"
import { Skill } from "../../Models/Wiki/Skill"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { WikiApplications } from "./Elements/WikiApplications"
import { WikiBotch } from "./Elements/WikiBotch"
import { WikiCriticalSuccess } from "./Elements/WikiCriticalSuccess"
import { WikiEncumbrance } from "./Elements/WikiEncumbrance"
import { WikiFailedCheck } from "./Elements/WikiFailedCheck"
import { WikiImprovementCost } from "./Elements/WikiImprovementCost"
import { WikiQuality } from "./Elements/WikiQuality"
import { WikiSkillCheck } from "./Elements/WikiSkillCheck"
import { WikiSource } from "./Elements/WikiSource"
import { WikiTools } from "./Elements/WikiTools"
import { WikiUses } from "./Elements/WikiUses"
import { WikiBoxTemplate } from "./WikiBoxTemplate"

export interface WikiSkillInfoProps {
  staticData: StaticDataRecord
  x: Record<Skill>
}

const SDA = StaticData.A

export const WikiSkillInfo: React.FC<WikiSkillInfoProps> = props => {
  const { x, staticData } = props

  const advantages = SDA.advantages (staticData)
  const specialAbilities = SDA.specialAbilities (staticData)

  const name = Skill.A.name (x)

  return (
    <WikiBoxTemplate className="skill" title={name}>
      <WikiApplications
        advantages={advantages}
        specialAbilities={specialAbilities}
        staticData={staticData}
        x={x}
        acc={Skill.A}
        showNewApplications
        />
      <WikiUses
        advantages={advantages}
        specialAbilities={specialAbilities}
        staticData={staticData}
        x={x}
        acc={Skill.A}
        />
      <WikiSkillCheck
        staticData={staticData}
        x={x}
        acc={Skill.A}
        />
      <WikiApplications
        advantages={advantages}
        specialAbilities={specialAbilities}
        staticData={staticData}
        x={x}
        acc={Skill.A}
        />
      <WikiEncumbrance staticData={staticData} x={x} acc={Skill.A} />
      <WikiTools staticData={staticData} x={x} acc={Skill.A} />
      <WikiQuality staticData={staticData} x={x} acc={Skill.A} />
      <WikiFailedCheck staticData={staticData} x={x} acc={Skill.A} />
      <WikiCriticalSuccess staticData={staticData} x={x} acc={Skill.A} />
      <WikiBotch staticData={staticData} x={x} acc={Skill.A} />
      <WikiImprovementCost staticData={staticData} x={x} acc={Skill.A} />
      <WikiSource
        staticData={staticData}
        x={x}
        acc={Skill.A}
        />
    </WikiBoxTemplate>
  )
}

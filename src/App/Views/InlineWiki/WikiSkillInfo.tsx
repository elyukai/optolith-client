import * as React from "react"
import { Record } from "../../../Data/Record"
import { L10nRecord } from "../../Models/Wiki/L10n"
import { Skill } from "../../Models/Wiki/Skill"
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel"
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
  l10n: L10nRecord
  wiki: WikiModelRecord
  x: Record<Skill>
}

const WA = WikiModel.A

export const WikiSkillInfo: React.FC<WikiSkillInfoProps> = props => {
  const { l10n, x, wiki } = props

  const advantages = WA.advantages (wiki)
  const attributes = WA.attributes (wiki)
  const books = WA.books (wiki)
  const specialAbilities = WA.specialAbilities (wiki)

  const name = Skill.A.name (x)

  return (
    <WikiBoxTemplate className="skill" title={name}>
      <WikiApplications
        advantages={advantages}
        specialAbilities={specialAbilities}
        l10n={l10n}
        x={x}
        acc={Skill.A}
        showNewApplications
        />
      <WikiUses
        advantages={advantages}
        specialAbilities={specialAbilities}
        l10n={l10n}
        x={x}
        acc={Skill.A}
        />
      <WikiSkillCheck
        attributes={attributes}
        l10n={l10n}
        x={x}
        acc={Skill.A}
        />
      <WikiApplications
        advantages={advantages}
        specialAbilities={specialAbilities}
        l10n={l10n}
        x={x}
        acc={Skill.A}
        />
      <WikiEncumbrance l10n={l10n} x={x} acc={Skill.A} />
      <WikiTools l10n={l10n} x={x} acc={Skill.A} />
      <WikiQuality l10n={l10n} x={x} acc={Skill.A} />
      <WikiFailedCheck l10n={l10n} x={x} acc={Skill.A} />
      <WikiCriticalSuccess l10n={l10n} x={x} acc={Skill.A} />
      <WikiBotch l10n={l10n} x={x} acc={Skill.A} />
      <WikiImprovementCost l10n={l10n} x={x} acc={Skill.A} />
      <WikiSource
        books={books}
        l10n={l10n}
        x={x}
        acc={Skill.A}
        />
    </WikiBoxTemplate>
  )
}

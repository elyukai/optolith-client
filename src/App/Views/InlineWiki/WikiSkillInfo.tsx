import * as React from "react";
import { OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { Advantage } from "../../Models/Wiki/Advantage";
import { Attribute } from "../../Models/Wiki/Attribute";
import { Book } from "../../Models/Wiki/Book";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { Skill } from "../../Models/Wiki/Skill";
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility";
import { WikiApplications } from "./Elements/WikiApplications";
import { WikiBotch } from "./Elements/WikiBotch";
import { WikiCriticalSuccess } from "./Elements/WikiCriticalSuccess";
import { WikiEncumbrance } from "./Elements/WikiEncumbrance";
import { WikiFailedCheck } from "./Elements/WikiFailedCheck";
import { WikiImprovementCost } from "./Elements/WikiImprovementCost";
import { WikiQuality } from "./Elements/WikiQuality";
import { WikiSkillCheck } from "./Elements/WikiSkillCheck";
import { WikiSource } from "./Elements/WikiSource";
import { WikiTools } from "./Elements/WikiTools";
import { WikiBoxTemplate } from "./WikiBoxTemplate";

export interface WikiSkillInfoProps {
  attributes: OrderedMap<string, Record<Attribute>>
  advantages: OrderedMap<string, Record<Advantage>>
  specialAbilities: OrderedMap<string, Record<SpecialAbility>>
  books: OrderedMap<string, Record<Book>>
  x: Record<Skill>
  l10n: L10nRecord
}

export function WikiSkillInfo (props: WikiSkillInfoProps) {
  const { x } = props

  const name = Skill.A.name (x)

  // if (["nl-BE"].includes(l10n.id)) {
  //   return (
  //     <WikiBoxTemplate className="skill" title={name}>
  //       <WikiApplications {...props} showNewApplications />
  //       <WikiSkillCheck {...props} />
  //       <WikiApplications {...props} />
  //       <WikiEncumbrance {...props} />
  //       <WikiImprovementCost {...props} />
  //     </WikiBoxTemplate>
  //   )
  // }

  return (
    <WikiBoxTemplate className="skill" title={name}>
      <WikiApplications {...props} showNewApplications acc={Skill.A} />
      <WikiSkillCheck {...props} acc={Skill.A} />
      <WikiApplications {...props} acc={Skill.A} />
      <WikiEncumbrance {...props} acc={Skill.A} />
      <WikiTools {...props} acc={Skill.A} />
      <WikiQuality {...props} acc={Skill.A} />
      <WikiFailedCheck {...props} acc={Skill.A} />
      <WikiCriticalSuccess {...props} acc={Skill.A} />
      <WikiBotch {...props} acc={Skill.A} />
      <WikiImprovementCost {...props} acc={Skill.A} />
      <WikiSource {...props} acc={Skill.A} />
    </WikiBoxTemplate>
  )
}

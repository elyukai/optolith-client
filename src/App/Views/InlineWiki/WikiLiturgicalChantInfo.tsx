import * as React from "react"
import { map } from "../../../Data/List"
import { joinMaybeList, Maybe } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { LiturgicalChant } from "../../Models/Wiki/LiturgicalChant"
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility"
import { SelectOption } from "../../Models/Wiki/sub/SelectOption"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { pipe_ } from "../../Utilities/pipe"
import { WikiCastingTime } from "./Elements/WikiCastingTime"
import { WikiCost } from "./Elements/WikiCost"
import { WikiDuration } from "./Elements/WikiDuration"
import { WikiEffect } from "./Elements/WikiEffect"
import { getExtensionsForEntry, WikiExtensions } from "./Elements/WikiExtensions"
import { WikiImprovementCost } from "./Elements/WikiImprovementCost"
import { WikiLiturgicalChantTraditions } from "./Elements/WikiLiturgicalChantTraditions"
import { WikiRange } from "./Elements/WikiRange"
import { WikiSkillCheck } from "./Elements/WikiSkillCheck"
import { WikiSource } from "./Elements/WikiSource"
import { WikiTargetCategory } from "./Elements/WikiTargetCategory"
import { WikiBoxTemplate } from "./WikiBoxTemplate"

export interface WikiLiturgicalChantInfoProps {
  staticData: StaticDataRecord
  x: Record<LiturgicalChant>
  liturgicalChantExtensions: Maybe<Record<SpecialAbility>>
}

const LCA = LiturgicalChant.A

export const WikiLiturgicalChantInfo: React.FC<WikiLiturgicalChantInfoProps> = props => {
  const { liturgicalChantExtensions, x, staticData } = props

  const mextensions = getExtensionsForEntry (LCA.id (x)) (liturgicalChantExtensions)

  const add_srcs = pipe_ (mextensions, joinMaybeList, map (SelectOption.A.src))

  return (
    <WikiBoxTemplate className="liturgicalchant" title={LCA.name (x)}>
      <WikiSkillCheck
        staticData={staticData}
        x={x}
        acc={LCA}
        />
      <WikiEffect staticData={staticData} x={x} acc={LCA} />
      <WikiCastingTime staticData={staticData} x={x} acc={LCA} />
      <WikiCost staticData={staticData} x={x} acc={LCA} />
      <WikiRange staticData={staticData} x={x} acc={LCA} />
      <WikiDuration staticData={staticData} x={x} acc={LCA} />
      <WikiTargetCategory staticData={staticData} x={x} acc={LCA} />
      <WikiLiturgicalChantTraditions staticData={staticData} x={x} acc={LCA} />
      <WikiImprovementCost staticData={staticData} x={x} acc={LCA} />
      <WikiSource
        staticData={staticData}
        x={x}
        acc={LCA}
        />
      <WikiExtensions
        staticData={staticData}
        x={x}
        extensions={mextensions}
        acc={LCA}
        />
      <WikiSource
        staticData={staticData}
        x={x}
        addSrcs={add_srcs}
        />
    </WikiBoxTemplate>
  )
}

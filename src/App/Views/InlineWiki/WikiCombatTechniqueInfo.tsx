import * as React from "react"
import { fmap } from "../../../Data/Functor"
import { intercalate } from "../../../Data/List"
import { mapMaybe, Maybe, maybeRNullF } from "../../../Data/Maybe"
import { lookupF } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { Sex } from "../../Models/Hero/heroTypeHelpers"
import { Attribute } from "../../Models/Wiki/Attribute"
import { CombatTechnique } from "../../Models/Wiki/CombatTechnique"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { Markdown } from "../Universal/Markdown"
import { WikiImprovementCost } from "./Elements/WikiImprovementCost"
import { WikiSource } from "./Elements/WikiSource"
import { WikiBoxTemplate } from "./WikiBoxTemplate"
import { WikiProperty } from "./WikiProperty"

export interface WikiCombatTechniqueInfoProps {
  staticData: StaticDataRecord
  x: Record<CombatTechnique>
  sex: Maybe<Sex>
}

const SDA = StaticData.A
const CTA = CombatTechnique.A

export const WikiCombatTechniqueInfo: React.FC<WikiCombatTechniqueInfoProps> = props => {
  const { x, staticData } = props

  const attributes = SDA.attributes (staticData)

  return (
    <WikiBoxTemplate className="combattechnique" title={CTA.name (x)}>
      {maybeRNullF (CTA.special (x))
                   (str => (
                     <Markdown
                       source={
                         `**${translate (staticData) ("inlinewiki.special")}:** ${str}`
                       }
                       />
                   ))}
      <WikiProperty staticData={staticData} title="inlinewiki.primaryattribute">
        {pipe_ (
          x,
          CTA.primary,
          mapMaybe (pipe (lookupF (attributes), fmap (Attribute.A.name))),
          intercalate ("/")
        )}
      </WikiProperty>
      <WikiImprovementCost x={x} staticData={staticData} acc={CTA} />
      <WikiSource
        x={x}
        staticData={staticData}
        acc={CTA}
        />
    </WikiBoxTemplate>
  )
}

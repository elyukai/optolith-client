import * as React from "react"
import { maybeRNullF } from "../../../Data/Maybe"
import { lookup } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { NumIdName } from "../../Models/NumIdName"
import { Cantrip } from "../../Models/Wiki/Cantrip"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { pipe } from "../../Utilities/pipe"
import { Markdown } from "../Universal/Markdown"
import { WikiSource } from "./Elements/WikiSource"
import { WikiBoxTemplate } from "./WikiBoxTemplate"
import { WikiProperty } from "./WikiProperty"

export interface WikiCantripInfoProps {
  staticData: StaticDataRecord
  x: Record<Cantrip>
}

const SDA = StaticData.A
const CA = Cantrip.A

export const WikiCantripInfo: React.FC<WikiCantripInfoProps> = props => {
  const { x, staticData } = props

  return (
    <WikiBoxTemplate className="cantrip" title={CA.name (x)}>
      <Markdown className="no-indent" source={CA.effect (x)} />
      <WikiProperty staticData={staticData} title="inlinewiki.range">
        {CA.range (x)}
      </WikiProperty>
      <WikiProperty staticData={staticData} title="inlinewiki.duration">
        {CA.duration (x)}
      </WikiProperty>
      <WikiProperty staticData={staticData} title="inlinewiki.targetcategory">
        {CA.target (x)}
      </WikiProperty>
      {maybeRNullF (lookup (CA.property (x))
                           (SDA.properties (staticData)))
                   (pipe (
                     NumIdName.A.name,
                     str => (
                       <WikiProperty staticData={staticData} title="inlinewiki.property">
                         {str}
                       </WikiProperty>
                     )
                   ))}
      {maybeRNullF (CA.note (x))
                   (str => (
                     <WikiProperty staticData={staticData} title="inlinewiki.note">
                       {str}
                     </WikiProperty>
                   ))}
      <WikiSource
        x={x}
        staticData={staticData}
        acc={CA}
        />
    </WikiBoxTemplate>
  )
}

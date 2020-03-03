import * as React from "react"
import { maybe } from "../../../Data/Maybe"
import { lookup } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { NumIdName } from "../../Models/NumIdName"
import { Blessing } from "../../Models/Wiki/Blessing"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { Markdown } from "../Universal/Markdown"
import { WikiSource } from "./Elements/WikiSource"
import { WikiBoxTemplate } from "./WikiBoxTemplate"
import { WikiProperty } from "./WikiProperty"

export interface WikiBlessingInfoProps {
  staticData: StaticDataRecord
  x: Record<Blessing>
}

const SDA = StaticData.A
const BA = Blessing.A

export const WikiBlessingInfo: React.FC<WikiBlessingInfoProps> = props => {
  const { x, staticData } = props

  const traditions = maybe ("") (NumIdName.A.name) (lookup (1) (SDA.aspects (staticData)))

  return (
    <WikiBoxTemplate className="blessing" title={BA.name (x)}>
      <Markdown className="no-indent" source={BA.effect (x)} />
      <WikiProperty staticData={staticData} title="inlinewiki.range">
        {BA.range (x)}
      </WikiProperty>
      <WikiProperty staticData={staticData} title="inlinewiki.duration">
        {BA.duration (x)}
      </WikiProperty>
      <WikiProperty staticData={staticData} title="inlinewiki.targetcategory">
        {BA.target (x)}
      </WikiProperty>
      <WikiProperty staticData={staticData} title="inlinewiki.aspect">
        {traditions}
      </WikiProperty>
      <WikiSource
        staticData={staticData}
        x={x}
        acc={BA}
        />
    </WikiBoxTemplate>
  )
}

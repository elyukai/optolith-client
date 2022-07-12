import * as React from "react"
import { Record, RecordIBase } from "../../../../Data/Record"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { icToStr, ImprovementCost } from "../../../Utilities/ImprovementCost"
import { WikiProperty } from "../WikiProperty"

interface Accessors<A extends RecordIBase<any>> {
  ic: (r: Record<A>) => ImprovementCost
}

export interface WikiImprovementCostProps<A extends RecordIBase<any>> {
  x: Record<A>
  acc: Accessors<A>
  staticData: StaticDataRecord
}

type FC = <A extends RecordIBase<any>> (props: WikiImprovementCostProps<A>) => ReturnType<React.FC>

export const WikiImprovementCost: FC = props => {
  const {
    x,
    acc,
    staticData,
  } = props

  return (
    <WikiProperty staticData={staticData} title="inlinewiki.improvementcost">
      {icToStr (acc.ic (x))}
    </WikiProperty>
  )
}

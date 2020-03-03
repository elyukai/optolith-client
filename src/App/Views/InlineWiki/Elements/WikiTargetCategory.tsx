import * as React from "react"
import { Record, RecordIBase } from "../../../../Data/Record"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { WikiProperty } from "../WikiProperty"

interface Accessors<A extends RecordIBase<any>> {
  target: (r: Record<A>) => string
}

export interface WikiTargetCategoryProps<A extends RecordIBase<any>> {
  x: Record<A>
  acc: Accessors<A>
  staticData: StaticDataRecord
}

type FC = <A extends RecordIBase<any>> (props: WikiTargetCategoryProps<A>) => ReturnType<React.FC>

export const WikiTargetCategory: FC = props => {
  const {
    x,
    acc,
    staticData,
  } = props

  return (
    <WikiProperty staticData={staticData} title="inlinewiki.targetcategory">
      {acc.target (x)}
    </WikiProperty>
  )
}

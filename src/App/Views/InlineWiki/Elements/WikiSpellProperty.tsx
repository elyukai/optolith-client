import * as React from "react"
import { maybe } from "../../../../Data/Maybe"
import { lookupF } from "../../../../Data/OrderedMap"
import { Record, RecordIBase } from "../../../../Data/Record"
import { NumIdName } from "../../../Models/NumIdName"
import { StaticData, StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { pipe_ } from "../../../Utilities/pipe"
import { WikiProperty } from "../WikiProperty"

const SDA = StaticData.A
const NINA = NumIdName.A

interface Accessors<A extends RecordIBase<any>> {
  property: (r: Record<A>) => number
}

export interface WikiSpellPropertyProps<A extends RecordIBase<any>> {
  x: Record<A>
  acc: Accessors<A>
  staticData: StaticDataRecord
}

type FC = <A extends RecordIBase<any>> (props: WikiSpellPropertyProps<A>) => ReturnType<React.FC>

export const WikiSpellProperty: FC = props => {
  const {
    x,
    acc,
    staticData,
  } = props

  const property = pipe_ (
                     x,
                     acc.property,
                     lookupF (SDA.properties (staticData)),
                     maybe ("") (NINA.name)
                   )

  return (
    <WikiProperty staticData={staticData} title="inlinewiki.property">
      {property}
    </WikiProperty>
  )
}

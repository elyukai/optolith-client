import * as React from "react"
import { Record, RecordIBase } from "../../../../Data/Record"
import { Category } from "../../../Constants/Categories"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { translate } from "../../../Utilities/I18n"
import { WikiProperty } from "../WikiProperty"

interface Accessors<A extends RecordIBase<any>> {
  range: (r: Record<A>) => string
  rangeNoMod: (r: Record<A>) => boolean
  category: (r: Record<A>) => Category
}

export interface WikiRangeProps<A extends RecordIBase<any>> {
  x: Record<A>
  acc: Accessors<A>
  staticData: StaticDataRecord
}

type FC = <A extends RecordIBase<any>> (props: WikiRangeProps<A>) => ReturnType<React.FC>

export const WikiRange: FC = props => {
  const {
    x,
    acc,
    staticData,
  } = props

  const category = acc.category (x)
  const isNoModAllowed = acc.rangeNoMod (x)

  const modKey =
    category === Category.LITURGICAL_CHANTS
    ? "inlinewiki.youcannotuseamodificationonthischantsrange"
    : "inlinewiki.youcannotuseamodificationonthisspellsrange"

  return (
    <WikiProperty staticData={staticData} title="inlinewiki.range">
      {acc.range (x)}
      {isNoModAllowed ? ` (${translate (staticData) (modKey)})` : ""}
    </WikiProperty>
  )
}

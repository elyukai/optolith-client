import * as React from "react"
import { Record, RecordIBase } from "../../../../Data/Record"
import { Category } from "../../../Constants/Categories"
import { L10nRecord } from "../../../Models/Wiki/L10n"
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
  l10n: L10nRecord
}

type FC = <A extends RecordIBase<any>> (props: WikiRangeProps<A>) => ReturnType<React.FC>

export const WikiRange: FC = props => {
  const {
    x,
    acc,
    l10n,
  } = props

  const category = acc.category (x)
  const isNoModAllowed = acc.rangeNoMod (x)

  const modKey =
    category === Category.LITURGICAL_CHANTS
    ? "inlinewiki.youcannotuseamodificationonthischantsrange"
    : "inlinewiki.youcannotuseamodificationonthisspellsrange"

  return (
    <WikiProperty l10n={l10n} title="inlinewiki.range">
      {acc.range (x)}
      {isNoModAllowed ? ` (${translate (l10n) (modKey)})` : ""}
    </WikiProperty>
  )
}

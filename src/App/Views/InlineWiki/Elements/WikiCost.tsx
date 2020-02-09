import * as React from "react"
import { Record, RecordIBase } from "../../../../Data/Record"
import { Category } from "../../../Constants/Categories"
import { L10nRecord } from "../../../Models/Wiki/L10n"
import { translate } from "../../../Utilities/I18n"
import { WikiProperty } from "../WikiProperty"

interface Accessors<A extends RecordIBase<any>> {
  cost: (r: Record<A>) => string
  costNoMod: (r: Record<A>) => boolean
  category: (r: Record<A>) => Category
}

export interface WikiCostProps<A extends RecordIBase<any>> {
  x: Record<A>
  acc: Accessors<A>
  l10n: L10nRecord
}

type FC = <A extends RecordIBase<any>> (props: WikiCostProps<A>) => ReturnType<React.FC>

export const WikiCost: FC = props => {
  const {
    x,
    acc,
    l10n,
  } = props

  const category = acc.category (x)
  const isNoModAllowed = acc.costNoMod (x)

  const key = category === Category.LITURGICAL_CHANTS ? "inlinewiki.kpcost" : "inlinewiki.aecost"
  const modKey =
    category === Category.LITURGICAL_CHANTS
    ? "inlinewiki.youcannotuseamodificationonthischantscost"
    : "inlinewiki.youcannotuseamodificationonthisspellscost"

  return (
    <WikiProperty l10n={l10n} title={key}>
      {acc.cost (x)}
      {isNoModAllowed ? ` (${translate (l10n) (modKey)})` : ""}
    </WikiProperty>
  )
}

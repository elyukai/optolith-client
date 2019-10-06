import * as React from "react";
import { Record, RecordIBase } from "../../../../Data/Record";
import { Categories } from "../../../Constants/Categories";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { translate } from "../../../Utilities/I18n";
import { WikiProperty } from "../WikiProperty";

interface Accessors<A extends RecordIBase<any>> {
  cost: (r: Record<A>) => string
  costNoMod: (r: Record<A>) => boolean
  category: (r: Record<A>) => Categories
}

export interface WikiCostProps<A extends RecordIBase<any>> {
  x: Record<A>
  acc: Accessors<A>
  l10n: L10nRecord
}

export function WikiCost<A extends RecordIBase<any>> (props: WikiCostProps<A>) {
  const {
    x,
    acc,
    l10n,
  } = props

  const category = acc.category (x)
  const isNoModAllowed = acc.costNoMod (x)

  const key = category === Categories.LITURGIES ? "kpcost" : "aecost"
  const modKey =
    category === Categories.LITURGIES
    ? "youcannotuseamodificationonthischantscost"
    : "youcannotuseamodificationonthisspellscost"

  return (
    <WikiProperty l10n={l10n} title={key}>
      {acc.cost (x)}{isNoModAllowed ? ` (${translate (l10n) (modKey)})` : ""}
    </WikiProperty>
  )
}

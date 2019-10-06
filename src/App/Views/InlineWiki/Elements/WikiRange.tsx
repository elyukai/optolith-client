import * as React from "react";
import { Record, RecordIBase } from "../../../../Data/Record";
import { Categories } from "../../../Constants/Categories";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { translate } from "../../../Utilities/I18n";
import { WikiProperty } from "../WikiProperty";

interface Accessors<A extends RecordIBase<any>> {
  range: (r: Record<A>) => string
  rangeNoMod: (r: Record<A>) => boolean
  category: (r: Record<A>) => Categories
}

export interface WikiRangeProps<A extends RecordIBase<any>> {
  x: Record<A>
  acc: Accessors<A>
  l10n: L10nRecord
}

export function WikiRange<A extends RecordIBase<any>> (props: WikiRangeProps<A>) {
  const {
    x,
    acc,
    l10n,
  } = props

  const category = acc.category (x)
  const isNoModAllowed = acc.rangeNoMod (x)

  const modKey =
    category === Categories.LITURGIES
    ? "youcannotuseamodificationonthischantsrange"
    : "youcannotuseamodificationonthisspellsrange"

  return (
    <WikiProperty l10n={l10n} title="range">
      {acc.range (x)}{isNoModAllowed ? ` (${translate (l10n) (modKey)})` : ""}
    </WikiProperty>
  )
}

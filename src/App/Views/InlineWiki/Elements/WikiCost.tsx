import * as React from "react";
import { Record, RecordBase } from "../../../../Data/Record";
import { Categories } from "../../../Constants/Categories";
import { L10n, L10nRecord } from "../../../Models/Wiki/L10n";
import { WikiProperty } from "../WikiProperty";

interface Accessors<A extends RecordBase> {
  cost: (r: Record<A>) => string
  category: (r: Record<A>) => Categories
}

export interface WikiCostProps<A extends RecordBase> {
  x: Record<A>
  acc: Accessors<A>
  l10n: L10nRecord
}

export function WikiCost<A extends RecordBase> (props: WikiCostProps<A>) {
  const {
    x,
    acc,
    l10n,
  } = props

  let key: keyof L10n = "aecost"

  const category = acc.category (x)

  if (category === Categories.LITURGIES) {
    key = "kpcost"
  }

  return (
    <WikiProperty l10n={l10n} title={key}>
      {acc.cost (x)}
    </WikiProperty>
  )
}

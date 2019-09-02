import * as React from "react";
import { Record, RecordIBase } from "../../../../Data/Record";
import { Categories } from "../../../Constants/Categories";
import { L10n, L10nRecord } from "../../../Models/Wiki/L10n";
import { WikiProperty } from "../WikiProperty";

interface Accessors<A extends RecordIBase<any>> {
  duration: (r: Record<A>) => string
  category: (r: Record<A>) => Categories
  gr: (r: Record<A>) => number
}

export interface WikiDurationProps<A extends RecordIBase<any>> {
  x: Record<A>
  acc: Accessors<A>
  l10n: L10nRecord
}

export function WikiDuration<A extends RecordIBase<any>> (props: WikiDurationProps<A>) {
  const {
    x,
    acc,
    l10n,
  } = props

  let key: keyof L10n = "duration"

  const category = acc.category (x)
  const gr = acc.gr (x)

  if (category === Categories.SPELLS && (gr === 4 || gr === 5)) {
    key = "skill"
  }

  return (
    <WikiProperty l10n={l10n} title={key}>
      {acc.duration (x)}
    </WikiProperty>
  )
}

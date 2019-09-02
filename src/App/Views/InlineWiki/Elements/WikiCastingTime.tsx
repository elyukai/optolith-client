import * as React from "react";
import { Record, RecordIBase } from "../../../../Data/Record";
import { Categories } from "../../../Constants/Categories";
import { L10n, L10nRecord } from "../../../Models/Wiki/L10n";
import { WikiProperty } from "../WikiProperty";

interface Accessors<A extends RecordIBase<any>> {
  castingTime: (r: Record<A>) => string
  category: (r: Record<A>) => Categories
  gr: (r: Record<A>) => number
}

export interface WikiCastingTimeProps<A extends RecordIBase<any>> {
  x: Record<A>
  acc: Accessors<A>
  l10n: L10nRecord
}

export function WikiCastingTime<A extends RecordIBase<any>> (props: WikiCastingTimeProps<A>) {
  const {
    x,
    acc,
    l10n,
  } = props

  let key: keyof L10n = "castingtime"

  const category = acc.category (x)
  const gr = acc.gr (x)

  if (category === Categories.SPELLS &&
      (gr === 2 ||gr === 7 || gr ===10 || gr === 11)
        ) {
    key = "ritualtime"
  }
  else if (category === Categories.SPELLS && (gr === 5 || gr === 6)) {
    key = "lengthoftime"
  }
  else if (category === Categories.LITURGIES && gr === 1) {
    key = "liturgicaltime"
  }
  else if (category === Categories.LITURGIES && gr === 2) {
    key = "ceremonialtime"
  }

  return (
    <WikiProperty l10n={l10n} title={key}>
      {acc.castingTime (x)}
    </WikiProperty>
  )
}

import * as React from "react";
import { Record, RecordBase } from "../../../../Data/Record";
import { Categories } from "../../../Constants/Categories";
import { L10n, L10nRecord } from "../../../Models/Wiki/L10n";
import { WikiProperty } from "../WikiProperty";

interface Accessors<A extends RecordBase> {
  castingTime: (r: Record<A>) => string
  category: (r: Record<A>) => Categories
  gr: (r: Record<A>) => number
}

export interface WikiCastingTimeProps<A extends RecordBase> {
  x: Record<A>
  acc: Accessors<A>
  l10n: L10nRecord
}

export function WikiCastingTime<A extends RecordBase> (props: WikiCastingTimeProps<A>) {
  const {
    x,
    acc,
    l10n,
  } = props

  let key: keyof L10n = "castingtime"

  const category = acc.category (x)
  const gr = acc.gr (x)

  if (category === Categories.SPELLS && gr === 2) {
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

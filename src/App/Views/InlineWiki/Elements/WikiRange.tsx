import * as React from "react";
import { Record, RecordIBase } from "../../../../Data/Record";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { WikiProperty } from "../WikiProperty";

interface Accessors<A extends RecordIBase<any>> {
  range: (r: Record<A>) => string
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

  return (
    <WikiProperty l10n={l10n} title="range">
      {acc.range (x)}
    </WikiProperty>
  )
}

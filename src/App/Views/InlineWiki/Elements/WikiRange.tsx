import * as React from "react";
import { Record, RecordBase } from "../../../../Data/Record";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { WikiProperty } from "../WikiProperty";

interface Accessors<A extends RecordBase> {
  range: (r: Record<A>) => string
}

export interface WikiRangeProps<A extends RecordBase> {
  x: Record<A>
  acc: Accessors<A>
  l10n: L10nRecord
}

export function WikiRange<A extends RecordBase> (props: WikiRangeProps<A>) {
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

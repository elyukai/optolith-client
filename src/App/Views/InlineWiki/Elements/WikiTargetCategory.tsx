import * as React from "react";
import { Record, RecordIBase } from "../../../../Data/Record";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { WikiProperty } from "../WikiProperty";

interface Accessors<A extends RecordIBase<any>> {
  target: (r: Record<A>) => string
}

export interface WikiTargetCategoryProps<A extends RecordIBase<any>> {
  x: Record<A>
  acc: Accessors<A>
  l10n: L10nRecord
}

export function WikiTargetCategory<A extends RecordIBase<any>> (props: WikiTargetCategoryProps<A>) {
  const {
    x,
    acc,
    l10n,
  } = props

  return (
    <WikiProperty l10n={l10n} title="targetcategory">
      {acc.target (x)}
    </WikiProperty>
  )
}

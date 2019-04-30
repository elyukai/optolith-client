import * as React from "react";
import { Record, RecordBase } from "../../../../Data/Record";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { WikiProperty } from "../WikiProperty";

interface Accessors<A extends RecordBase> {
  target: (r: Record<A>) => string
}

export interface WikiTargetCategoryProps<A extends RecordBase> {
  x: Record<A>
  acc: Accessors<A>
  l10n: L10nRecord
}

export function WikiTargetCategory<A extends RecordBase> (props: WikiTargetCategoryProps<A>) {
  const {
    currentObject: {
      target
    },
    locale
  } = props

  return (
    <WikiProperty l10n={locale} title="info.targetcategory">
      {target}
    </WikiProperty>
  )
}

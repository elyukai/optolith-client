import * as React from "react";
import { subscript } from "../../../../Data/List";
import { fromMaybe } from "../../../../Data/Maybe";
import { Record, RecordIBase } from "../../../../Data/Record";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { translate } from "../../../Utilities/I18n";
import { WikiProperty } from "../WikiProperty";

interface Accessors<A extends RecordIBase<any>> {
  property: (r: Record<A>) => number
}

export interface WikiSpellPropertyProps<A extends RecordIBase<any>> {
  x: Record<A>
  acc: Accessors<A>
  l10n: L10nRecord
}

export function WikiSpellProperty<A extends RecordIBase<any>> (props: WikiSpellPropertyProps<A>) {
  const {
    x,
    acc,
    l10n,
  } = props

  return (
    <WikiProperty l10n={l10n} title="property">
      {fromMaybe ("") (subscript (translate (l10n) ("propertylist")) (acc.property (x) - 1))}
    </WikiProperty>
  )
}

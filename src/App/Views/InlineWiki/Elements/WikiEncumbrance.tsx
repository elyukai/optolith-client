import * as React from "react";
import { fromMaybe, Maybe } from "../../../../Data/Maybe";
import { Record, RecordBase } from "../../../../Data/Record";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { translate } from "../../../Utilities/I18n";
import { WikiProperty } from "../WikiProperty";

interface Accessors<A extends RecordBase> {
  encumbrance: (r: Record<A>) => string
  encumbranceDescription: (r: Record<A>) => Maybe<string>
}

export interface WikiEncumbranceProps<A extends RecordBase> {
  x: Record<A>
  acc: Accessors<A>
  l10n: L10nRecord
}

export function WikiEncumbrance<A extends RecordBase> (props: WikiEncumbranceProps<A>) {
  const {
    x,
    acc,
    l10n,
  } = props

  let string = fromMaybe (translate (l10n) ("maybe"))
                         (acc.encumbranceDescription (x))

  const encumbrance = acc.encumbrance (x)

  if (encumbrance === "true") {
    string = translate (l10n) ("yes")
  }
  else if (encumbrance === "false") {
    string = translate (l10n) ("no")
  }

  return (
    <WikiProperty l10n={l10n} title="encumbrance">
      {string}
    </WikiProperty>
  )
}

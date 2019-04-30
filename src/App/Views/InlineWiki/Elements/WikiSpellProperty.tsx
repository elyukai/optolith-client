import * as React from "react";
import { Record, RecordBase } from "../../../../Data/Record";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { translate } from "../../../Utilities/I18n";
import { WikiProperty } from "../WikiProperty";

interface Accessors<A extends RecordBase> {
  property: (r: Record<A>) => number
}

export interface WikiSpellPropertyProps<A extends RecordBase> {
  x: Record<A>
  acc: Accessors<A>
  l10n: L10nRecord
}

export function WikiSpellProperty<A extends RecordBase> (props: WikiSpellPropertyProps<A>) {
  const {
    currentObject: {
      property
    },
    locale
  } = props

  return (
    <WikiProperty l10n={locale} title="info.property">
      {translate(locale, "spells.view.properties")[property - 1]}
    </WikiProperty>
  )
}

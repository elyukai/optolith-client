import * as React from "react";
import { List } from "../../../../Data/List";
import { Record, RecordBase } from "../../../../Data/Record";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { translate } from "../../../Utilities/I18n";
import { WikiProperty } from "../WikiProperty";

interface Accessors<A extends RecordBase> {
  subtradition: (r: Record<A>) => List<number>
  tradition: (r: Record<A>) => List<number>
}

export interface WikiSpellTraditionsProps<A extends RecordBase> {
  x: Record<A>
  acc: Accessors<A>
  l10n: L10nRecord
}

export function WikiSpellTraditions<A extends RecordBase> (props: WikiSpellTraditionsProps<A>) {
  const {
    currentObject: {
      subtradition,
      tradition
    },
    locale
  } = props

  if (subtradition.length > 0) {
    return (
      <WikiProperty l10n={locale} title="info.musictradition">
        {sortStrings(subtradition.map(e => {
          return translate(locale, "musictraditions")[e - 1]
        }), locale.id).intercalate(", ")}
      </WikiProperty>
    )
  }

  return (
    <WikiProperty l10n={locale} title="info.traditions">
      {sortStrings(tradition.filter(e => {
        return e <= translate(locale, "spells.view.traditions").length
      }).map(e => {
        return translate(locale, "spells.view.traditions")[e - 1]
      }), locale.id).intercalate(", ")}
    </WikiProperty>
  )
}

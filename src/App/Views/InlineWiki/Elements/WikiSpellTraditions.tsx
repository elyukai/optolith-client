import * as React from "react";
import { flength, intercalate, List, notNull, subscript } from "../../../../Data/List";
import { bindF, ensure, mapMaybe } from "../../../../Data/Maybe";
import { Record, RecordBase } from "../../../../Data/Record";
import { L10n, L10nRecord } from "../../../Models/Wiki/L10n";
import { translate } from "../../../Utilities/I18n";
import { dec, lte } from "../../../Utilities/mathUtils";
import { pipe, pipe_ } from "../../../Utilities/pipe";
import { sortStrings } from "../../../Utilities/sortBy";
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
    x,
    acc,
    l10n,
  } = props

  const trad = acc.tradition (x)
  const subtrad = acc.subtradition (x)

  if (notNull (subtrad)) {
    return (
      <WikiProperty l10n={l10n} title="musictradition">
        {pipe_ (
          subtrad,
          mapMaybe (pipe (dec, subscript (translate (l10n) ("musictraditions")))),
          sortStrings (L10n.A.id (l10n)),
          intercalate (", ")
        )}
      </WikiProperty>
    )
  }

  const trad_strs = translate (l10n) ("magicaltraditions")

  return (
    <WikiProperty l10n={l10n} title="traditions">
      {pipe_ (
        trad,
        mapMaybe (pipe (
          ensure (lte (flength (trad_strs))),
          bindF (pipe (dec, subscript (trad_strs)))
        )),
        sortStrings (L10n.A.id (l10n)),
        intercalate (", ")
      )}
    </WikiProperty>
  )
}

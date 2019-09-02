import * as React from "react";
import { elem, flength, intercalate, List, subscript } from "../../../../Data/List";
import { bindF, ensure, mapMaybe } from "../../../../Data/Maybe";
import { dec, lte } from "../../../../Data/Num";
import { Record, RecordIBase } from "../../../../Data/Record";
import { L10n, L10nRecord } from "../../../Models/Wiki/L10n";
import { translate } from "../../../Utilities/I18n";
import { pipe, pipe_ } from "../../../Utilities/pipe";
import { sortStrings } from "../../../Utilities/sortBy";
import { WikiProperty } from "../WikiProperty";

interface Accessors<A extends RecordIBase<any>> {
  subtradition: (r: Record<A>) => List<number>
  tradition: (r: Record<A>) => List<number>
}

export interface WikiSpellTraditionsProps<A extends RecordIBase<any>> {
  x: Record<A>
  acc: Accessors<A>
  l10n: L10nRecord
}

export function WikiSpellTraditions<A extends RecordIBase<any>> (props: WikiSpellTraditionsProps<A>) {
  const {
    x,
    acc,
    l10n,
  } = props

  const trad = acc.tradition (x)
  const subtrad = acc.subtradition (x)

  if (elem (16) (trad)) { // Tradition (Animisten)
    return (
      <WikiProperty l10n={l10n} title="tribaltraditions">
        {pipe_ (
          subtrad,
          mapMaybe (pipe (dec, subscript (translate (l10n) ("tribes")))),
          sortStrings (L10n.A.id (l10n)),
          intercalate (", ")
        )}
      </WikiProperty>
    )
  }

  if (elem (7) (trad) || elem (8) (trad)) { // Zauberbarden/Zaubertänzer
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

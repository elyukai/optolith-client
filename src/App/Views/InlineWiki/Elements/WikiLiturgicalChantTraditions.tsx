import * as React from "react";
import { ident } from "../../../../Data/Function";
import { consF, elem, flength, foldr, intercalate, List, subscript } from "../../../../Data/List";
import { fromJust, fromMaybe, isNothing, Just, mapMaybe } from "../../../../Data/Maybe";
import { dec } from "../../../../Data/Num";
import { alter, insert, OrderedMap } from "../../../../Data/OrderedMap";
import { Record, RecordIBase } from "../../../../Data/Record";
import { Aspect, BlessedTradition } from "../../../Constants/Groups";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { translate } from "../../../Utilities/I18n";
import { getAspectsOfTradition, getTraditionOfAspect } from "../../../Utilities/Increasable/liturgicalChantUtils";
import { pipe, pipe_ } from "../../../Utilities/pipe";
import { sortStrings } from "../../../Utilities/sortBy";
import { WikiProperty } from "../WikiProperty";

interface Accessors<A extends RecordIBase<any>> {
  aspects: (r: Record<A>) => List<Aspect>
  tradition: (r: Record<A>) => List<BlessedTradition>
}

export interface WikiLiturgicalChantTraditionsProps<A extends RecordIBase<any>> {
  x: Record<A>
  acc: Accessors<A>
  l10n: L10nRecord
}

export function WikiLiturgicalChantTraditions<A extends RecordIBase<any>>
  (props: WikiLiturgicalChantTraditionsProps<A>) {
  const {
    x,
    acc,
    l10n,
  } = props

  const tradition_strings = translate (l10n) ("blessedtraditions")
  const aspect_strings = translate (l10n) ("aspectlist")

  const curr_traditions = acc.tradition (x)

  return pipe_ (
    x,
    acc.aspects,
    foldr ((asp: Aspect) => {
            const trad = getTraditionOfAspect (asp)

            return trad <= flength (tradition_strings)
              ? alter (pipe (fromMaybe (List<number> ()), consF (asp), Just)) (trad)
              : ident as ident<OrderedMap<number, List<number>>>
          })
          (OrderedMap.empty),
    elem (14) (curr_traditions) ? insert (14) (List ()) : ident,
    OrderedMap.foldrWithKey ((t: number) => (as: List<number>) => {
                              const mmain_trad = subscript (tradition_strings) (t - 1)

                              if (isNothing (mmain_trad)) {
                                return ident as ident<List<string>>
                              }

                              const main_trad = fromJust (mmain_trad)

                              if (flength (getAspectsOfTradition (t)) < 2) {
                                return consF (main_trad)
                              }

                              const mapped_aspects =
                                mapMaybe (pipe (dec, subscript (aspect_strings))) (as)

                              const complete_aspects =
                                intercalate (` ${translate (l10n) ("and")} `)
                                            (sortStrings (l10n) (mapped_aspects))

                              return consF (`${main_trad} (${complete_aspects})`)
                            })
                            (List ()),
    sortStrings (l10n),
    traditions => (
      <WikiProperty l10n={l10n} title="traditions">
        {intercalate (", ") (traditions)}
      </WikiProperty>
    )
  )
}

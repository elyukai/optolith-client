import * as React from "react";
import { fmap } from "../../../../Data/Functor";
import { intercalate, List } from "../../../../Data/List";
import { fromMaybe_, mapMaybe, Maybe } from "../../../../Data/Maybe";
import { lookupF, OrderedMap } from "../../../../Data/OrderedMap";
import { Record, RecordIBase } from "../../../../Data/Record";
import { fst, Pair, snd } from "../../../../Data/Tuple";
import { CombatTechnique } from "../../../Models/Wiki/CombatTechnique";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { ndash } from "../../../Utilities/Chars";
import { translate } from "../../../Utilities/I18n";
import { pipe, pipe_ } from "../../../Utilities/pipe";
import { Markdown } from "../../Universal/Markdown";

interface Accessors<A extends RecordIBase<any>> {
  combatTechniques: (r: Record<A>) => Pair<boolean | List<string>, Maybe<string>>
}

export interface WikiCombatTechniquesProps<A extends RecordIBase<any>> {
  combatTechniques: OrderedMap<string, Record<CombatTechnique>>
  x: Record<A>
  acc: Accessors<A>
  l10n: L10nRecord
}

const CTA = CombatTechnique.A

export function WikiCombatTechniques <A extends RecordIBase<any>> (props: WikiCombatTechniquesProps<A>) {
  const {
    combatTechniques,
    x,
    acc,
    l10n,
  } = props

  const p = acc.combatTechniques (x)

  const str =
    fromMaybe_ (() => {
                 const cts = fst (p)

                 return cts === true
                 ? translate (l10n) ("all")
                 : cts === false
                 ? ndash
                 : pipe_ (
                     cts,
                     mapMaybe (pipe (lookupF (combatTechniques), fmap (CTA.name))),
                     intercalate (", ")
                   )
               })
               (snd (p))

  return (
    <Markdown source={`**${translate (l10n) ("combattechniques")}:** ${str}`} />
  )
}

import * as React from "react";
import { fmap } from "../../../../Data/Functor";
import { intercalate, notNull } from "../../../../Data/List";
import { fromJust, isJust, mapMaybe, Maybe, maybe } from "../../../../Data/Maybe";
import { lookupF, OrderedMap } from "../../../../Data/OrderedMap";
import { Record, RecordIBase } from "../../../../Data/Record";
import { CombatTechnique } from "../../../Models/Wiki/CombatTechnique";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { SpecialAbilityCombatTechniqueGroup, SpecialAbilityCombatTechniques } from "../../../Models/Wiki/SpecialAbility";
import { ndash } from "../../../Utilities/Chars";
import { translate } from "../../../Utilities/I18n";
import { pipe, pipe_ } from "../../../Utilities/pipe";
import { sortStrings } from "../../../Utilities/sortBy";
import { Markdown } from "../../Universal/Markdown";

interface Accessors<A extends RecordIBase<any>> {
  combatTechniques: (r: Record<A>) => Maybe<Record<SpecialAbilityCombatTechniques>>
}

export interface WikiCombatTechniquesProps<A extends RecordIBase<any>> {
  combatTechniques: OrderedMap<string, Record<CombatTechnique>>
  x: Record<A>
  acc: Accessors<A>
  l10n: L10nRecord
}

const CTA = CombatTechnique.A
const SACTA = SpecialAbilityCombatTechniques.A

export function WikiCombatTechniques <A extends RecordIBase<any>> (props: WikiCombatTechniquesProps<A>) {
  const {
    combatTechniques,
    x,
    acc,
    l10n,
  } = props

  return maybe <JSX.Element | null>
               (null)
               ((cts: Record<SpecialAbilityCombatTechniques>) => {
                 const customText = SACTA.customText (cts)
                 const group = SACTA.group (cts)
                 const explicitIds = SACTA.explicitIds (cts)

                 const str =
                   isJust (customText)
                   ? fromJust (customText)
                   : group === SpecialAbilityCombatTechniqueGroup.All
                   ? translate (l10n) ("all")
                   : group === SpecialAbilityCombatTechniqueGroup.Melee
                   ? translate (l10n) ("allmeleecombattechniques")
                   : group === SpecialAbilityCombatTechniqueGroup.Ranged
                   ? translate (l10n) ("allrangedcombattechniques")
                   : group === SpecialAbilityCombatTechniqueGroup.WithParry
                   ? translate (l10n) ("allmeleecombattechniqueswithparry")
                   : group === SpecialAbilityCombatTechniqueGroup.OneHanded
                   ? translate (l10n) ("allmeleecombattechniquesforonehandedweapons")
                   : notNull (explicitIds)
                   ? pipe_ (
                       explicitIds,
                       mapMaybe (pipe (lookupF (combatTechniques), fmap (CTA.name))),
                       sortStrings (l10n),
                       intercalate (", ")
                     )
                   : ndash

                 return (
                   <Markdown
                     source={`**${translate (l10n) ("combattechniques")}:** ${str}`}
                     />
                 )
               })
               (acc.combatTechniques (x))
}

/**
 * This file provides combining functions for displaying `Activatable`
 * entries.
 *
 * @file src/Utilities/activatableActiveUtils.ts
 * @author Lukas Obermann
 * @since 1.1.0
 */

import { fmap } from "../../../Data/Functor"
import { List } from "../../../Data/List"
import { liftM2, liftM4, mapMaybe, Maybe } from "../../../Data/Maybe"
import { lookup, OrderedMap } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { fst, Pair, snd, Tuple } from "../../../Data/Tuple"
import { ActivatableCategory, Category } from "../../Constants/Categories"
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent"
import { ActiveObjectWithId } from "../../Models/ActiveEntries/ActiveObjectWithId"
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel"
import { ActivatableActivationValidation } from "../../Models/View/ActivatableActivationValidationObject"
import { ActivatableCombinedName } from "../../Models/View/ActivatableCombinedName"
import { ActivatableNameCost, ActivatableNameCostSafeCost } from "../../Models/View/ActivatableNameCost"
import { ActiveActivatable } from "../../Models/View/ActiveActivatable"
import { Advantage } from "../../Models/Wiki/Advantage"
import { Disadvantage } from "../../Models/Wiki/Disadvantage"
import { L10nRecord } from "../../Models/Wiki/L10n"
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility"
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel"
import { WikiEntryByCategory, WikiEntryRecordByCategory } from "../../Models/Wiki/wikiTypeHelpers"
import { convertPerTierCostToFinalCost, getCost } from "../AdventurePoints/activatableCostUtils"
import { pipe_ } from "../pipe"
import { getIsRemovalOrChangeDisabled } from "./activatableActiveValidationUtils"
import { getActiveFromState } from "./activatableConvertUtils"
import { getName } from "./activatableNameUtils"

/**
 * Takes an Activatable category and a hero and returns the state slice matching
 * the passed category.
 */
export const getActivatableHeroSliceByCategory =
  (category: ActivatableCategory) =>
  (hero: HeroModelRecord): OrderedMap<string, Record<ActivatableDependent>> =>
    category === Category.ADVANTAGES
    ? HeroModel.A.advantages (hero)
    : category === Category.DISADVANTAGES
    ? HeroModel.A.disadvantages (hero)
    : HeroModel.A.specialAbilities (hero)

type ActivatableWikiSliceByCategory<A extends ActivatableCategory> =
  A extends Category.ADVANTAGES
  ? Record<Advantage>
  : A extends Category.ADVANTAGES
  ? Record<Disadvantage>
  : Record<SpecialAbility>

/**
 * Takes an Activatable category and a hero and returns the state slice matching
 * the passed category.
 */
export const getActivatableWikiSliceByCategory =
  <A extends ActivatableCategory>
  (category: A) =>
  (wiki: WikiModelRecord): OrderedMap<string, ActivatableWikiSliceByCategory<A>> =>
    category === Category.ADVANTAGES
    ? WikiModel.A.advantages (wiki) as OrderedMap<string, ActivatableWikiSliceByCategory<A>>
    : category === Category.DISADVANTAGES
    ? WikiModel.A.disadvantages (wiki) as OrderedMap<string, ActivatableWikiSliceByCategory<A>>
    : WikiModel.A.specialAbilities (wiki) as OrderedMap<string, ActivatableWikiSliceByCategory<A>>

/**
 * Returns name, splitted and combined, as well as the AP you get when removing
 * the ActiveObject.
 * @param obj The ActiveObject with origin id.
 * @param wiki The wiki state.
 * @param state The current hero's state.
 * @param isEntryToAdd If the cost are going to be added or removed from AP left.
 * @param locale The locale-dependent messages.
 */
export const getNameCost =
  (isEntryToAdd: boolean) =>
  (automatic_advantages: List<string>) =>
  (l10n: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (entry: Record<ActiveObjectWithId>): Maybe<Record<ActivatableNameCost>> =>
    liftM2 ((finalCost: Pair<number | List<number>, boolean>) =>
            (naming: Record<ActivatableCombinedName>) =>
             ActivatableNameCost ({
               naming,
               active: entry,
               finalCost: fst (finalCost),
               isAutomatic: snd (finalCost),
             }))
           (getCost (isEntryToAdd) (automatic_advantages) (wiki) (hero) (entry))
           (getName (l10n) (wiki) (entry))

/**
 * Returns name, splitted and combined, as well as the AP you get when removing
 * the ActiveObject.
 * @param obj The ActiveObject with origin id.
 * @param wiki The wiki state.
 * @param l10n The locale-dependent messages.
 */
export const getNameCostForWiki =
  (l10n: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (active: Record<ActiveObjectWithId>): Maybe<Record<ActivatableNameCost>> =>
    liftM2 ((finalCost: Pair<number | List<number>, boolean>) =>
            (naming: Record<ActivatableCombinedName>) =>
             ActivatableNameCost ({
               active,
               naming,
               finalCost: fst (finalCost),
               isAutomatic: snd (finalCost),
             }))
           (getCost (true) (List ()) (wiki) (HeroModel.default) (active))
           (getName (l10n) (wiki) (active))

export const getAllActiveByCategory =
  <T extends ActivatableCategory>
  (category: T) =>
  (addLevelToName: boolean) =>
  (automatic_advantages: List<string>) =>
  (matching_script_and_lang_related: Tuple<[boolean, List<number>, List<number>]>) =>
  (l10n: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord): List<Record<ActiveActivatable<WikiEntryByCategory[T]>>> => {
    type GenericWikiEntry = WikiEntryRecordByCategory[T]

    const convertCost = convertPerTierCostToFinalCost (addLevelToName) (l10n)

    const wiki_slice = getActivatableWikiSliceByCategory (category) (wiki)
    const hero_slice = getActivatableHeroSliceByCategory (category) (hero)

    type Entry = Maybe<Record<ActiveActivatable<WikiEntryByCategory[T]>>>

    return pipe_ (
      hero_slice,
      getActiveFromState,
      mapMaybe ((active: Record<ActiveObjectWithId>): Entry => {
                 const current_id = ActiveObjectWithId.A.id (active)

                 return liftM4 ((nameAndCost: Record<ActivatableNameCostSafeCost>) =>
                                (wiki_entry: GenericWikiEntry) =>
                                (hero_entry: Record<ActivatableDependent>) =>
                                (validation: Record<ActivatableActivationValidation>) =>
                                  ActiveActivatable ({
                                   nameAndCost,
                                   validation,
                                   heroEntry: hero_entry,
                                   wikiEntry: wiki_entry,
                                  }))
                               (fmap (convertCost)
                                     (getNameCost (false)
                                                  (automatic_advantages)
                                                  (l10n)
                                                  (wiki)
                                                  (hero)
                                                  (active)))
                               (lookup (current_id) (wiki_slice) as Maybe<GenericWikiEntry>)
                               (lookup (current_id) (hero_slice))
                               (getIsRemovalOrChangeDisabled (wiki)
                                                             (hero)
                                                             (matching_script_and_lang_related)
                                                             (active)) as Entry
               })
    )
  }

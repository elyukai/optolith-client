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
import { bind, liftM2, mapMaybe, Maybe } from "../../../Data/Maybe"
import { lookup, OrderedMap } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { fst, Pair, snd } from "../../../Data/Tuple"
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
import { SpecialAbility } from "../../Models/Wiki/SpecialAbility"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { WikiEntryByCategory } from "../../Models/Wiki/wikiTypeHelpers"
import { MatchingScriptAndLanguageRelated } from "../../Selectors/activatableSelectors"
import { convertPerTierCostToFinalCost, getCost } from "../AdventurePoints/activatableCostUtils"
import { pipe_ } from "../pipe"
import { getIsRemovalOrChangeDisabled } from "./activatableActiveValidationUtils"
import { getActiveFromState } from "./activatableConvertUtils"
import { getName } from "./activatableNameUtils"

const SDA = StaticData.A
const HA = HeroModel.A

/**
 * Takes an Activatable category and a hero and returns the state slice matching
 * the passed category.
 */
export const getActivatableHeroSliceByCategory =
  (category: ActivatableCategory) =>
  (hero: HeroModelRecord): OrderedMap<string, Record<ActivatableDependent>> =>
    category === Category.ADVANTAGES
    ? HA.advantages (hero)
    : category === Category.DISADVANTAGES
    ? HA.disadvantages (hero)
    : HA.specialAbilities (hero)

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
  (wiki: StaticDataRecord): OrderedMap<string, ActivatableWikiSliceByCategory<A>> =>
    category === Category.ADVANTAGES
    ? SDA.advantages (wiki) as OrderedMap<string, ActivatableWikiSliceByCategory<A>>
    : category === Category.DISADVANTAGES
    ? SDA.disadvantages (wiki) as OrderedMap<string, ActivatableWikiSliceByCategory<A>>
    : SDA.specialAbilities (wiki) as OrderedMap<string, ActivatableWikiSliceByCategory<A>>

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
  (staticData: StaticDataRecord) =>
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
           (getCost (isEntryToAdd) (automatic_advantages) (staticData) (hero) (entry))
           (getName (staticData) (entry))

/**
 * Returns name, splitted and combined, as well as the AP you get when removing
 * the ActiveObject.
 * @param obj The ActiveObject with origin id.
 * @param wiki The wiki state.
 * @param l10n The locale-dependent messages.
 */
export const getNameCostForWiki =
  (staticData: StaticDataRecord) =>
  (active: Record<ActiveObjectWithId>): Maybe<Record<ActivatableNameCost>> =>
    liftM2 ((finalCost: Pair<number | List<number>, boolean>) =>
            (naming: Record<ActivatableCombinedName>) =>
             ActivatableNameCost ({
               active,
               naming,
               finalCost: fst (finalCost),
               isAutomatic: snd (finalCost),
             }))
           (getCost (true) (List ()) (staticData) (HeroModel.default) (active))
           (getName (staticData) (active))

export const getAllActiveByCategory =
  <T extends ActivatableCategory>
  (category: T) =>
  (addLevelToName: boolean) =>
  (automatic_advantages: List<string>) =>
  (matchingScriptAndLanguageRelated: MatchingScriptAndLanguageRelated) =>
  (staticData: StaticDataRecord) =>
  (hero: HeroModelRecord): List<Record<ActiveActivatable<WikiEntryByCategory[T]>>> => {
    const convertCost = convertPerTierCostToFinalCost (addLevelToName) (staticData)

    const wiki_slice = getActivatableWikiSliceByCategory (category) (staticData)
    const hero_slice = getActivatableHeroSliceByCategory (category) (hero)

    type Entry = Maybe<Record<ActiveActivatable<WikiEntryByCategory[T]>>>

    return pipe_ (
      hero_slice,
      getActiveFromState,
      mapMaybe ((active: Record<ActiveObjectWithId>): Entry => {
                 const current_id = ActiveObjectWithId.A.id (active)

                 return bind (lookup (current_id) (wiki_slice)) (staticEntry =>
                 bind (lookup (current_id) (hero_slice)) (characterEntry =>
                  liftM2 ((nameAndCost: Record<ActivatableNameCostSafeCost>) =>
                                (validation: Record<ActivatableActivationValidation>) =>
                                  ActiveActivatable ({
                                   nameAndCost,
                                   validation,
                                   heroEntry: characterEntry,
                                   wikiEntry: staticEntry,
                                  }))
                               (fmap (convertCost)
                                     (getNameCost (false)
                                                  (automatic_advantages)
                                                  (staticData)
                                                  (hero)
                                                  (active)))
                               (getIsRemovalOrChangeDisabled (staticData)
                                                             (hero)
                                                             (matchingScriptAndLanguageRelated)
                                                             (active)) as Entry))
               })
    )
  }

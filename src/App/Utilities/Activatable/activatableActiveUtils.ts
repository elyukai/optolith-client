/**
 * This file provides combining functions for displaying `Activatable`
 * entries.
 *
 * @file src/utils/activatableActiveUtils.ts
 * @author Lukas Obermann
 * @since 1.1.0
 */

import { fmap } from "../../../Data/Functor";
import { List } from "../../../Data/List";
import { liftM2, liftM4, mapMaybe, Maybe, Nothing } from "../../../Data/Maybe";
import { lookup, OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { ActivatableCategory, Categories } from "../../Constants/Categories";
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent";
import { ActiveObjectWithId } from "../../Models/ActiveEntries/ActiveObjectWithId";
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel";
import { ActivatableActivationValidation } from "../../Models/View/ActivatableActivationValidationObject";
import { ActivatableCombinedName } from "../../Models/View/ActivatableCombinedName";
import { ActivatableNameCost, ActivatableNameCostSafeCost } from "../../Models/View/ActivatableNameCost";
import { ActiveActivatable } from "../../Models/View/ActiveActivatable";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { WikiModel, WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { Activatable, WikiEntryByCategory, WikiEntryRecordByCategory } from "../../Models/Wiki/wikiTypeHelpers";
import { convertPerTierCostToFinalCost, getCost } from "../AdventurePoints/activatableCostUtils";
import { pipe_ } from "../pipe";
import { getIsRemovalOrChangeDisabled } from "./activatableActiveValidationUtils";
import { getActiveFromState } from "./activatableConvertUtils";
import { getName } from "./activatableNameUtils";

/**
 * Takes an Activatable category and a hero and returns the state slice matching
 * the passed category.
 */
export const getActivatableHeroSliceByCategory =
  (category: ActivatableCategory) =>
  (hero: HeroModelRecord): OrderedMap<string, Record<ActivatableDependent>> =>
    category === Categories.ADVANTAGES
    ? HeroModel.A_.advantages (hero)
    : category === Categories.DISADVANTAGES
    ? HeroModel.A_.disadvantages (hero)
    : HeroModel.A_.specialAbilities (hero)

/**
 * Takes an Activatable category and a hero and returns the state slice matching
 * the passed category.
 */
export const getActivatableWikiSliceByCategory =
  (category: ActivatableCategory) =>
  (wiki: WikiModelRecord): OrderedMap<string, Activatable> =>
    category === Categories.ADVANTAGES
    ? WikiModel.A_.advantages (wiki)
    : category === Categories.DISADVANTAGES
    ? WikiModel.A_.disadvantages (wiki)
    : WikiModel.A_.specialAbilities (wiki)

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
  (l10n: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (entry: Record<ActiveObjectWithId>): Maybe<Record<ActivatableNameCost>> =>
    liftM2 ((finalCost: number | List<number>) => (name: Record<ActivatableCombinedName>) =>
             ActivatableNameCost ({
              name: ActivatableCombinedName.A_.name (name),
              baseName: ActivatableCombinedName.A_.baseName (name),
              addName: ActivatableCombinedName.A_.addName (name),
              levelName: Nothing,

              id: ActiveObjectWithId.A_.id (entry),
              index: ActiveObjectWithId.A_.index (entry),
              sid: ActiveObjectWithId.A_.sid (entry),
              sid2: ActiveObjectWithId.A_.sid2 (entry),
              tier: ActiveObjectWithId.A_.tier (entry),

              finalCost,
             }))
           (getCost (isEntryToAdd) (wiki) (hero) (entry))
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
  (entry: Record<ActiveObjectWithId>): Maybe<Record<ActivatableNameCost>> =>
    liftM2 ((finalCost: number | List<number>) => (name: Record<ActivatableCombinedName>) =>
             ActivatableNameCost ({
              name: ActivatableCombinedName.A_.name (name),
              baseName: ActivatableCombinedName.A_.baseName (name),
              addName: ActivatableCombinedName.A_.addName (name),
              levelName: Nothing,

              id: ActiveObjectWithId.A_.id (entry),
              index: ActiveObjectWithId.A_.index (entry),
              sid: ActiveObjectWithId.A_.sid (entry),
              sid2: ActiveObjectWithId.A_.sid2 (entry),
              tier: ActiveObjectWithId.A_.tier (entry),

              finalCost,
             }))
           (getCost (false) (wiki) (HeroModel.default) (entry))
           (getName (l10n) (wiki) (entry))

export const getAllActiveByCategory =
  <T extends ActivatableCategory>
  (category: T) =>
  (addLevelToName: boolean) =>
  (l10n: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord): List<Record<ActiveActivatable<WikiEntryByCategory[T]>>> => {
    type GenericWikiEntry = WikiEntryRecordByCategory[T]

    const convertCost = convertPerTierCostToFinalCost (addLevelToName) (l10n)

    const wiki_slice = getActivatableWikiSliceByCategory (category) (wiki)
    const hero_slice = getActivatableHeroSliceByCategory (category) (hero)

    return pipe_ (
      hero_slice,
      getActiveFromState,
      mapMaybe ((active: Record<ActiveObjectWithId>) => {
                 const current_id = ActiveObjectWithId.A_.id (active)

                 return liftM4 ((nameCost: Record<ActivatableNameCostSafeCost>) =>
                                (wiki_entry: GenericWikiEntry) =>
                                (hero_entry: Record<ActivatableDependent>) =>
                                (remove: Record<ActivatableActivationValidation>) =>
                                 ActiveActivatable ({
                                  id: current_id,

                                  sid: ActiveObjectWithId.A_.sid (active),
                                  sid2: ActiveObjectWithId.A_.sid2 (active),
                                  tier: ActiveObjectWithId.A_.tier (active),
                                  cost: ActiveObjectWithId.A_.cost (active),

                                  index: ActiveObjectWithId.A_.index (active),

                                  name: ActivatableNameCost.A_.name (nameCost),
                                  baseName: ActivatableNameCost.A_.baseName (nameCost),
                                  addName: ActivatableNameCost.A_.addName (nameCost),

                                  levelName: Nothing,

                                  finalCost: ActivatableNameCost.A_.finalCost (nameCost) as number,

                                  disabled: ActivatableActivationValidation.A_.disabled (remove),
                                  maxLevel: ActivatableActivationValidation.A_.maxLevel (remove),
                                  minLevel: ActivatableActivationValidation.A_.minLevel (remove),

                                  stateEntry: hero_entry,
                                  wikiEntry: wiki_entry,
                                 }))
                               (fmap (convertCost)
                                     (getNameCost (false) (l10n) (wiki) (hero) (active)))
                               (lookup (current_id) (wiki_slice) as Maybe<GenericWikiEntry>)
                               (lookup (current_id) (hero_slice))
                               (getIsRemovalOrChangeDisabled (wiki) (hero) (active))
               })
    )
  }

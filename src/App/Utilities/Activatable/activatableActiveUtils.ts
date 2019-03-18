/**
 * This file provides combining functions for displaying `Activatable`
 * entries.
 *
 * @file src/utils/activatableActiveUtils.ts
 * @author Lukas Obermann
 * @since 1.1.0
 */

import { Maybe } from "../../../Data/Maybe";
import { OrderedMap } from "../../../Data/OrderedMap";
import { Record } from "../../../Data/Record";
import { ActivatableCategory, Categories } from "../../Constants/Categories";
import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent";
import { ActiveObjectWithId } from "../../Models/ActiveEntries/ActiveObjectWithId";
import { HeroModel, HeroModelRecord } from "../../Models/Hero/HeroModel";
import { ActivatableNameCost } from "../../Models/Hero/heroTypeHelpers";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { WikiModelRecord } from "../../Models/Wiki/WikiModel";
import { convertPerTierCostToFinalCost, getCost } from "../AdventurePoints/activatableCostUtils";
import { getWikiEntry } from "../WikiUtils";
import { getIsRemovalOrChangeDisabled } from "./activatableActiveValidationUtils";
import { getActiveFromState } from "./activatableConvertUtils";
import { getName } from "./activatableNameUtils";

const { advantages, disadvantages, specialAbilities } = HeroModel.A

/**
 * Takes an Activatable category and a hero and returns the state slice matching
 * the passed category.
 */
export const getActivatableStateSliceByCategory =
  (category: ActivatableCategory) =>
  (hero: HeroModelRecord): OrderedMap<string, Record<ActivatableDependent>> =>
    category === Categories.ADVANTAGES
    ? advantages (hero)
    : category === Categories.DISADVANTAGES
    ? disadvantages (hero)
    : specialAbilities (hero)

/**
 * Returns name, splitted and combined, as well as the AP you get when removing
 * the ActiveObject.
 * @param obj The ActiveObject with origin id.
 * @param wiki The wiki state.
 * @param state The current hero's state.
 * @param costToAdd If the cost are going to be added or removed from AP left.
 * @param locale The locale-dependent messages.
 */
export const getNameCost =
  (costToAdd: boolean) =>
  (l10n: L10nRecord) =>
  (wiki: WikiModelRecord) =>
  (hero: HeroModelRecord) =>
  (entry: Record<ActiveObjectWithId>): Maybe<Record<ActivatableNameCost>> =>
  getCost (entry, wiki, hero, costToAdd)
    .bind (
      finalCost => getName (l10n) (wiki) (entry)
        .fmap (
          names => names
            .merge (entry)
            .merge (Record.of ({
              finalCost,
            }))
        )
    )

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
  getCost (obj, wiki)
    .bind (
      finalCost => getName (l10n) (wiki) (entry)
        .fmap (
          names => names
            .merge (obj)
            .merge (Record.of ({
              finalCost,
            }))
        )
    )

export const getAllActiveByCategory =
  <T extends ActivatableCategory>
  (category: T) =>
  (addTierToName: boolean) =>
  (maybeHero: Maybe<Hero>) =>
  (locale: Record<UIMessages>) =>
  (wiki: Record<Wiki.WikiAll>) => {
    type GenericWikiEntry = Wiki.WikiEntryRecordByCategory[T]
    type GenericWikiEntryInterface = RecordInterface<GenericWikiEntry>

    const convertCost = convertPerTierCostToFinalCost (Just (locale), addTierToName)

    return maybeHero.fmap (
      hero => {
        const stateSlice = getActivatableStateSliceByCategory (category) (hero)

        return Maybe.mapMaybe (
          (activeObject: Record<ActiveObjectWithId>) =>
            getNameCost (activeObject, wiki, hero, false, Just (locale))
              .fmap (convertCost)
              .bind (
                nameAndCost => stateSlice.lookup (activeObject.get ("id")).bind (
                  stateEntry => getIsRemovalOrChangeDisabled (activeObject, wiki, hero).bind (
                    isRemovalOrChangeDisabled =>
                      getWikiEntry<GenericWikiEntry> (wiki) (activeObject.get ("id"))
                        .fmap<Record<ActiveViewObject<GenericWikiEntryInterface>>> (
                          wikiEntry => nameAndCost
                            .merge (isRemovalOrChangeDisabled)
                            .merge (
                              Record.of<
                                ActivatableActivationMeta<GenericWikiEntryInterface>
                              > ({
                                stateEntry,
                                wikiEntry:
                                  wikiEntry as any as Record<GenericWikiEntryInterface>,
                                customCost: Maybe.isJust (activeObject.lookup ("cost")),
                              })
                            )
                        )
                  )
                )
              )
        ) (getActiveFromState (stateSlice))
      }
    )
  }

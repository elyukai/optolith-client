/**
 * This file provides combining functions for displaying `Activatable`
 * entries.
 *
 * @file src/utils/activatableActiveUtils.ts
 * @author Lukas Obermann
 * @since 1.1.0
 */

import { ActivatableCategory, Categories } from '../constants/Categories';
import * as Data from '../types/data';
import * as Wiki from '../types/wiki';
import { getIsRemovalOrChangeDisabled } from './activatableActiveValidationUtils';
import { getActiveFromState } from './activatableConvertUtils';
import { convertPerTierCostToFinalCost, getCost } from './activatableCostUtils';
import { getName } from './activatableNameUtils';
import { Just, Maybe, OrderedMap, Record, RecordInterface } from './dataUtils';
import { getWikiEntry } from './WikiUtils';

/**
 * Takes an Activatable category and a hero and returns the state slice matching
 * the passed category.
 */
export const getActivatableStateSliceByCategory = (category: ActivatableCategory) =>
  (hero: Data.Hero): OrderedMap<string, Record<Data.ActivatableDependent>> =>
    category === Categories.ADVANTAGES
    ? hero.get ('advantages')
    : category === Categories.DISADVANTAGES
    ? hero.get ('disadvantages')
    : hero.get ('specialAbilities');

/**
 * Returns name, splitted and combined, as well as the AP you get when removing
 * the ActiveObject.
 * @param obj The ActiveObject with origin id.
 * @param wiki The wiki state.
 * @param state The current hero's state.
 * @param costToAdd If the cost are going to be added or removed from AP left.
 * @param locale The locale-dependent messages.
 */
export const getNameCost = (
  obj: Record<Data.ActiveObjectWithId>,
  wiki: Record<Wiki.WikiAll>,
  state: Record<Data.HeroDependent>,
  costToAdd: boolean,
  locale: Maybe<Record<Data.UIMessages>>
): Maybe<Record<Data.ActivatableNameCost>> =>
  getCost (obj, wiki, state, costToAdd)
    .bind (
      finalCost => getName (obj, wiki, locale)
        .fmap (
          names => names
            .merge (obj)
            .merge (Record.of ({
              finalCost
            }))
        )
    );

/**
 * Returns name, splitted and combined, as well as the AP you get when removing
 * the ActiveObject.
 * @param obj The ActiveObject with origin id.
 * @param wiki The wiki state.
 * @param locale The locale-dependent messages.
 */
export const getNameCostForWiki = (
  obj: Record<Data.ActiveObjectWithId>,
  wiki: Record<Wiki.WikiAll>,
  locale: Maybe<Record<Data.UIMessages>>
): Maybe<Record<Data.ActivatableNameCost>> =>
  getCost (obj, wiki)
    .bind (
      finalCost => getName (obj, wiki, locale)
        .fmap (
          names => names
            .merge (obj)
            .merge (Record.of ({
              finalCost
            }))
        )
    );

export const getAllActiveByCategory = <T extends ActivatableCategory>(category: T) =>
  (addTierToName: boolean) =>
    (maybeHero: Maybe<Data.Hero>) =>
      (locale: Record<Data.UIMessages>) =>
        (wiki: Record<Wiki.WikiAll>) => {
          type GenericWikiEntry = Wiki.WikiEntryRecordByCategory[T];
          type GenericWikiEntryInterface = RecordInterface<GenericWikiEntry>;

          const convertCost = convertPerTierCostToFinalCost (Just (locale), addTierToName);

          return maybeHero.fmap (
            hero => {
              const stateSlice = getActivatableStateSliceByCategory (category) (hero);

              return Maybe.mapMaybe (
                (activeObject: Record<Data.ActiveObjectWithId>) =>
                  getNameCost (activeObject, wiki, hero, false, Just (locale))
                    .fmap (convertCost)
                    .bind (
                      nameAndCost => stateSlice.lookup (activeObject.get ('id')).bind (
                        stateEntry => getIsRemovalOrChangeDisabled (activeObject, wiki, hero).bind (
                          isRemovalOrChangeDisabled =>
                            getWikiEntry<GenericWikiEntry> (
                              wiki,
                              activeObject.get ('id')
                            )
                              .fmap<Record<Data.ActiveViewObject<GenericWikiEntryInterface>>> (
                                wikiEntry => nameAndCost
                                  .merge (isRemovalOrChangeDisabled)
                                  .merge (
                                    Record.of<
                                      Data.ActivatableActivationMeta<GenericWikiEntryInterface>
                                    > ({
                                      stateEntry,
                                      wikiEntry:
                                        wikiEntry as any as Record<GenericWikiEntryInterface>,
                                      customCost: Maybe.isJust (activeObject.lookup ('cost'))
                                    })
                                  )
                              )
                        )
                      )
                    )
              ) (getActiveFromState (stateSlice));
            }
          );
        };

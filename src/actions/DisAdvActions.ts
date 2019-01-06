import * as R from 'ramda';
import { Dispatch } from 'react-redux';
import { ActivatableDependent, ActivateArgs, ActiveObjectWithId, DeactivateArgs, Hero } from '../App/Models/Hero/heroTypeHelpers';
import { Advantage, Disadvantage } from '../App/Models/Wiki/wikiTypeHelpers';
import { getHeroStateItem } from '../App/Utils/heroStateUtils';
import { translate } from '../App/Utils/I18n';
import { isNumber } from '../App/Utils/typeCheckUtils';
import { getWikiEntry } from '../App/Utils/WikiUtils';
import { ActionTypes } from '../constants/ActionTypes';
import { ActivatableCategory, Categories } from '../constants/Categories';
import { AppState } from '../reducers/appReducer';
import { getAdventurePointsObject } from '../selectors/adventurePointsSelectors';
import { getIsInCharacterCreation } from '../selectors/phaseSelectors';
import { getCurrentRace, getCurrentRaceVariant } from '../selectors/rcpSelectors';
import { getCurrentHeroPresent, getWiki } from '../selectors/stateSelectors';
import { AsyncAction } from '../types/actions';
import { UIMessagesObject } from '../types/ui';
import { getNameCost } from '../utils/activatable/activatableActiveUtils';
import { isMagicalOrBlessed } from '../utils/activatable/checkActivatableUtils';
import { convertPerTierCostToFinalCost } from '../utils/adventurePoints/activatableCostUtils';
import { getAreSufficientAPAvailableForDisAdvantage, getDisAdvantagesSubtypeMax, SufficientAPAvailableForDisAdvantage } from '../utils/adventurePoints/adventurePointsUtils';
import { Just, List, Maybe, Record, Tuple } from '../utils/dataUtils';
import { addAlert } from './AlertActions';

/**
 * Advantages and disadvantages might not only be added or removed due to not
 * enough AP but also due to limitations regarding AP spent on advantages,
 * disadvantages or subtypes thereof (blessed, magical). This function ensures
 * that the appropiate error message is displayed if an entry cannot be added or
 * removed.
 *
 * If the addition or removal is valid, the passed `successFn` will be called.
 */
const handleAreSufficientAPAvailableForDisAdvantage =
  (locale: UIMessagesObject) =>
    (successFn: () => void) =>
      (hero: Hero) =>
        (areSufficientAPAvailableForDisAdvantage: Record<SufficientAPAvailableForDisAdvantage>) =>
          (entryType: { isBlessed: boolean; isMagical: boolean }) =>
            (isDisadvantage: boolean) =>
              (dispatch: Dispatch<AppState>) => {
                if (!areSufficientAPAvailableForDisAdvantage.get ('totalValid')) {
                  dispatch (addAlert ({
                    title: translate (locale, 'notenoughap.title'),
                    message: translate (locale, 'notenoughap.content'),
                  }));
                }
                else if (!areSufficientAPAvailableForDisAdvantage.get ('mainValid')) {
                  const type = isDisadvantage
                    ? translate (locale, 'reachedaplimit.disadvantages')
                    : translate (locale, 'reachedaplimit.advantages');

                  if (type) {
                    dispatch (addAlert ({
                      title: translate (locale, 'reachedaplimit.title', type),
                      message: translate (locale, 'reachedaplimit.content', type),
                    }));
                  }
                }
                else if (!areSufficientAPAvailableForDisAdvantage.get ('subValid')) {
                  const type = isDisadvantage
                    ? entryType.isBlessed
                      ? translate (locale, 'reachedcategoryaplimit.blesseddisadvantages')
                      : translate (locale, 'reachedcategoryaplimit.magicaldisadvantages')
                    : entryType.isBlessed
                    ? translate (locale, 'reachedcategoryaplimit.blessedadvantages')
                    : translate (locale, 'reachedcategoryaplimit.magicaladvantages');

                  const ap = getDisAdvantagesSubtypeMax (entryType.isMagical) (hero);

                  if (type) {
                    dispatch (addAlert ({
                      title: translate (locale, 'reachedcategoryaplimit.title', type),
                      message: translate (locale, 'reachedcategoryaplimit.content', ap, type),
                    }));
                  }
                }
                else {
                  successFn ();
                }
              };

interface ActivateArgsWithEntryType extends ActivateArgs {
  isBlessed: boolean;
  isMagical: boolean;
  isDisadvantage: boolean;
  hairColor?: number;
  eyeColor?: number;
  wikiEntry: Record<Advantage> | Record<Disadvantage>;
}

interface AlbinoChangedColor {
  hairColor?: number;
  eyeColor?: number;
}

export interface ActivateDisAdvAction {
  type: ActionTypes.ACTIVATE_DISADV;
  payload: ActivateArgsWithEntryType;
}

/**
 * Add an advantage or disadvantage with the provided activation properties
 * (`args`).
 */
export const addDisAdvantage = (locale: UIMessagesObject) => (args: ActivateArgs): AsyncAction =>
  (dispatch, getState) => {
    const state = getState ();

    const maybeHero = getCurrentHeroPresent (state);

    if (Maybe.isJust (maybeHero)) {
      const hero = Maybe.fromJust (maybeHero);

      const { id, cost, ...other } = args;

      const maybeWikiEntry =
        getWikiEntry<Record<Advantage> | Record<Disadvantage>> (getWiki (state)) (id);

      if (Maybe.isJust (maybeWikiEntry)) {
        const wikiEntry = Maybe.fromJust (maybeWikiEntry);

        const isDisadvantage =
          (wikiEntry.get ('category') as ActivatableCategory) === Categories.DISADVANTAGES;

        const entryType = isMagicalOrBlessed (wikiEntry);

        const areSufficientAPAvailableForDisAdvantage =
          getAreSufficientAPAvailableForDisAdvantage (getIsInCharacterCreation (state))
                                                     (isDisadvantage)
                                                     (entryType)
                                                     (hero)
                                                     (getAdventurePointsObject (
                                                       state,
                                                       { locale }
                                                     ))
                                                     (cost);

        const successFn = () => {
          const color: Record<AlbinoChangedColor> = id === 'DISADV_45' && args.sel === 1
            ? Record.of<AlbinoChangedColor> ({
              hairColor: 24,
              eyeColor: 19,
            })
            : Record.empty ();

          dispatch<ActivateDisAdvAction> ({
            type: ActionTypes.ACTIVATE_DISADV,
            payload: {
              id,
              cost,
              ...other,
              ...entryType,
              isDisadvantage,
              hairColor: color.toObject ().hairColor,
              eyeColor: color.toObject ().eyeColor,
              wikiEntry,
            },
          });
        };

        handleAreSufficientAPAvailableForDisAdvantage (locale)
                                                      (successFn)
                                                      (hero)
                                                      (areSufficientAPAvailableForDisAdvantage)
                                                      (entryType)
                                                      (isDisadvantage)
                                                      (dispatch);
      }
    }
  };

interface DeactivateArgsWithEntryType extends DeactivateArgs {
  isBlessed: boolean;
  isMagical: boolean;
  isDisadvantage: boolean;
  hairColor?: number;
  eyeColor?: number;
  wikiEntry: Record<Advantage> | Record<Disadvantage>;
}

export interface DeactivateDisAdvAction {
  type: ActionTypes.DEACTIVATE_DISADV;
  payload: DeactivateArgsWithEntryType;
}

/**
 * Remove an advantage or disadvantage with the provided activation properties
 * (`args`).
 */
export const removeDisAdvantage = (locale: UIMessagesObject) =>
  (args: DeactivateArgs): AsyncAction =>
    (dispatch, getState) => {
      const state = getState ();

      const maybeHero = getCurrentHeroPresent (state);

      if (Maybe.isJust (maybeHero)) {
        const hero = Maybe.fromJust (maybeHero);

        const negativeCost = args.cost * -1; // the entry should be removed

        const maybeWikiEntry =
          getWikiEntry<Record<Advantage> | Record<Disadvantage>> (getWiki (state)) (args.id);

        const maybeStateEntry =
          getHeroStateItem<Record<ActivatableDependent>> (args.id) (hero);

        if (Maybe.isJust (maybeWikiEntry) && Maybe.isJust (maybeStateEntry)) {
          const wikiEntry = Maybe.fromJust (maybeWikiEntry);
          const stateEntry = Maybe.fromJust (maybeStateEntry);

          const isDisadvantage =
            (wikiEntry.get ('category') as ActivatableCategory) === Categories.DISADVANTAGES;

          const entryType = isMagicalOrBlessed (wikiEntry);

          const areSufficientAPAvailableForDisAdvantage =
            getAreSufficientAPAvailableForDisAdvantage (getIsInCharacterCreation (state))
                                                       (isDisadvantage)
                                                       (entryType)
                                                       (hero)
                                                       (getAdventurePointsObject (
                                                         state,
                                                         { locale })
                                                       )
                                                       (negativeCost);

          const successFn = () => {
            const color: Record<AlbinoChangedColor> =
              args.id === 'DISADV_45'
              && Maybe.elem (1)
                            (stateEntry.get ('active')
                              .subscript (args.index)
                              .bind (active => active.lookup ('sid'))
                              .bind (Maybe.ensure (isNumber)))
              ? Maybe.fromMaybe<Record<AlbinoChangedColor>> (Record.empty ()) (
                getCurrentRace (state)
                  .fmap (
                    race => {
                      const maybeRaceVariant = getCurrentRaceVariant (state);

                      return Record.ofMaybe<AlbinoChangedColor> ({
                        hairColor: race.lookup ('hairColors')
                          .alt (
                            maybeRaceVariant.bind (raceVariant => raceVariant.lookup ('hairColors'))
                          )
                          .bind (List.uncons)
                          .fmap (Tuple.fst),
                        eyeColor: race.lookup ('eyeColors')
                          .alt (
                            maybeRaceVariant.bind (raceVariant => raceVariant.lookup ('eyeColors'))
                          )
                          .bind (List.uncons)
                          .fmap (Tuple.fst),
                      });
                    }
                  )
              )
              : Record.empty ();

            dispatch<DeactivateDisAdvAction> ({
              type: ActionTypes.DEACTIVATE_DISADV,
              payload: {
                ...args,
                cost: negativeCost,
                ...entryType,
                isDisadvantage,
                hairColor: color.toObject ().hairColor,
                eyeColor: color.toObject ().eyeColor,
                wikiEntry,
              },
            });
          };

          handleAreSufficientAPAvailableForDisAdvantage (locale)
                                                        (successFn)
                                                        (hero)
                                                        (areSufficientAPAvailableForDisAdvantage)
                                                        (entryType)
                                                        (isDisadvantage)
                                                        (dispatch);
        }
      }
    };

export interface SetDisAdvTierAction {
  type: ActionTypes.SET_DISADV_TIER;
  payload: {
    id: string;
    index: number;
    tier: number;
    isBlessed: boolean;
    isMagical: boolean;
    isDisadvantage: boolean;
    wikiEntry: Record<Advantage> | Record<Disadvantage>;
  };
}

/**
 * Change the current level of an advantage or disadvantage.
 */
export const setDisAdvantageLevel = (locale: UIMessagesObject) =>
  (id: string) => (index: number) => (level: number): AsyncAction =>
    (dispatch, getState) => {
      const state = getState ();

      const maybeHero = getCurrentHeroPresent (state);

      console.log (id, index, level);

      if (Maybe.isJust (maybeHero)) {
        const hero = Maybe.fromJust (maybeHero);

        const maybeWikiEntry =
          getWikiEntry<Record<Advantage> | Record<Disadvantage>> (getWiki (state)) (id);

        const maybeStateEntry =
          getHeroStateItem<Record<ActivatableDependent>> (id) (hero);

        const maybeActiveObjectWithId = maybeStateEntry
          .fmap (stateEntry => stateEntry.get ('active'))
          .bind (active => active.subscript (index))
          .fmap<Record<ActiveObjectWithId>> (
            activeObject => activeObject.merge (
              Record.of ({
                id,
                index,
              })
            )
          );

        console.log (hero, maybeWikiEntry, maybeStateEntry, maybeActiveObjectWithId);

        if (Maybe.isJust (maybeWikiEntry) && Maybe.isJust (maybeActiveObjectWithId)) {
          const wikiEntry = Maybe.fromJust (maybeWikiEntry);
          const activeObjectWithId = Maybe.fromJust (maybeActiveObjectWithId);

          const wiki = getWiki (state);

          const previousCost = getNameCost (
            activeObjectWithId,
            wiki,
            hero,
            false,
            Just (locale)
          )
            .fmap (convertPerTierCostToFinalCost (Just (locale)))
            .fmap (obj => obj.get ('finalCost'));

          const nextCost = getNameCost (
            activeObjectWithId.insert ('tier') (level),
            wiki,
            hero,
            true,
            Just (locale)
          )
            .fmap (convertPerTierCostToFinalCost (Just (locale)))
            .fmap (obj => obj.get ('finalCost'));

          const maybeCost = Maybe.liftM2 (R.subtract) (nextCost) (previousCost);

          console.log (previousCost, nextCost, maybeCost);

          if (Maybe.isJust (maybeCost)) {
            const cost = Maybe.fromJust (maybeCost);

            const isDisadvantage =
              (wikiEntry.get ('category') as ActivatableCategory) === Categories.DISADVANTAGES;

            const entryType = isMagicalOrBlessed (wikiEntry);

            const areSufficientAPAvailableForDisAdvantage =
              getAreSufficientAPAvailableForDisAdvantage (getIsInCharacterCreation (state))
                                                         (isDisadvantage)
                                                         (entryType)
                                                         (hero)
                                                         (getAdventurePointsObject (
                                                           state,
                                                           { locale })
                                                         )
                                                         (cost);

            const successFn = () => {
              dispatch<SetDisAdvTierAction> ({
                type: ActionTypes.SET_DISADV_TIER,
                payload: {
                  id,
                  tier: level,
                  index,
                  ...entryType,
                  isDisadvantage,
                  wikiEntry,
                },
              });
            };

            handleAreSufficientAPAvailableForDisAdvantage (locale)
                                                          (successFn)
                                                          (hero)
                                                          (areSufficientAPAvailableForDisAdvantage)
                                                          (entryType)
                                                          (isDisadvantage)
                                                          (dispatch);
          }
        }
      }
    };

export interface SwitchDisAdvRatingVisibilityAction {
  type: ActionTypes.SWITCH_DISADV_RATING_VISIBILITY;
}

export const switchRatingVisibility = (): SwitchDisAdvRatingVisibilityAction => ({
  type: ActionTypes.SWITCH_DISADV_RATING_VISIBILITY,
});

export interface SetActiveAdvantagesFilterTextAction {
  type: ActionTypes.SET_ADVANTAGES_FILTER_TEXT;
  payload: {
    filterText: string;
  };
}

export const setActiveAdvantagesFilterText =
  (filterText: string): SetActiveAdvantagesFilterTextAction => ({
    type: ActionTypes.SET_ADVANTAGES_FILTER_TEXT,
    payload: {
      filterText,
    },
  });

export interface SetInactiveAdvantagesFilterTextAction {
  type: ActionTypes.SET_INACTIVE_ADVANTAGES_FILTER_TEXT;
  payload: {
    filterText: string;
  };
}

export const setInactiveAdvantagesFilterText =
  (filterText: string): SetInactiveAdvantagesFilterTextAction => ({
    type: ActionTypes.SET_INACTIVE_ADVANTAGES_FILTER_TEXT,
    payload: {
      filterText,
    },
  });

export interface SetActiveDisadvantagesFilterTextAction {
  type: ActionTypes.SET_DISADVANTAGES_FILTER_TEXT;
  payload: {
    filterText: string;
  };
}

export const setActiveDisadvantagesFilterText =
  (filterText: string): SetActiveDisadvantagesFilterTextAction => ({
    type: ActionTypes.SET_DISADVANTAGES_FILTER_TEXT,
    payload: {
      filterText,
    },
  });

export interface SetInactiveDisadvantagesFilterTextAction {
  type: ActionTypes.SET_INACTIVE_DISADVANTAGES_FILTER_TEXT;
  payload: {
    filterText: string;
  };
}

export const setInactiveDisadvantagesFilterText =
  (filterText: string): SetInactiveDisadvantagesFilterTextAction => ({
    type: ActionTypes.SET_INACTIVE_DISADVANTAGES_FILTER_TEXT,
    payload: {
      filterText,
    },
  });

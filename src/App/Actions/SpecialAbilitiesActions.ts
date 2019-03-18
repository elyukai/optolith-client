import * as R from 'ramda';
import { AsyncAction } from '../../types/actions';
import { ActionTypes } from '../Constants/ActionTypes';
import { ActivatableDependent, ActivateArgs, ActiveObjectWithId, DeactivateArgs } from '../Models/Hero/heroTypeHelpers';
import { SpecialAbility } from '../Models/Wiki/wikiTypeHelpers';
import { getAvailableAdventurePoints } from '../Selectors/adventurePointsSelectors';
import { getIsInCharacterCreation } from '../Selectors/phaseSelectors';
import { getCurrentHeroPresent, getWiki } from '../Selectors/stateSelectors';
import { UIMessagesObject } from '../types/ui';
import { getHeroStateItem } from '../Utilities/heroStateUtils';
import { getWikiEntry } from '../Utilities/WikiUtils';
import { getNameCost } from '../utils/activatable/activatableActiveUtils';
import { convertPerTierCostToFinalCost } from '../utils/adventurePoints/activatableCostUtils';
import { getAreSufficientAPAvailable } from '../utils/adventurePoints/adventurePointsUtils';
import { Just, Maybe, Record } from '../utils/dataUtils';
import { translate } from '../Utils/I18n';
import { addAlert } from './AlertActions';

interface SpecialAbilityActivateArgs extends ActivateArgs {
  wikiEntry: Record<SpecialAbility>;
}

export interface ActivateSpecialAbilityAction {
  type: ActionTypes.ACTIVATE_SPECIALABILITY;
  payload: SpecialAbilityActivateArgs;
}

/**
 * Add a special ability with the provided activation properties (`args`).
 */
export const addSpecialAbility = (locale: UIMessagesObject) => (args: ActivateArgs): AsyncAction =>
  (dispatch, getState) => {
    const state = getState ();

    const maybeHero = getCurrentHeroPresent (state);

    if (Maybe.isJust (maybeHero)) {
      const { id, cost } = args;

      const maybeWikiEntry = getWikiEntry<Record<SpecialAbility>> (getWiki (state)) (id);

      if (Maybe.isJust (maybeWikiEntry)) {
        const wikiEntry = Maybe.fromJust (maybeWikiEntry);

        const areSufficientAPAvailable = getAvailableAdventurePoints (state, { locale })
          .fmap (
            availableAP => getAreSufficientAPAvailable (getIsInCharacterCreation (state))
                                                       (availableAP)
                                                       (cost)
          );

        if (Maybe.elem (true) (areSufficientAPAvailable)) {
          dispatch<ActivateSpecialAbilityAction> ({
            type: ActionTypes.ACTIVATE_SPECIALABILITY,
            payload: {
              ...args,
              wikiEntry,
            },
          });
        }
        else {
          dispatch (addAlert ({
            title: translate (locale, 'notenoughap.title'),
            message: translate (locale, 'notenoughap.content'),
          }));
        }
      }
    }
  };

interface SpecialAbilityDeactivateArgs extends DeactivateArgs {
  wikiEntry: Record<SpecialAbility>;
}

export interface DeactivateSpecialAbilityAction {
  type: ActionTypes.DEACTIVATE_SPECIALABILITY;
  payload: SpecialAbilityDeactivateArgs;
}

/**
 * Remove a special ability with the provided activation properties
 * (`args`).
 */
export const removeSpecialAbility = (args: DeactivateArgs): AsyncAction =>
    (dispatch, getState) => {
      const state = getState ();

      const maybeHero = getCurrentHeroPresent (state);

      if (Maybe.isJust (maybeHero)) {
        const hero = Maybe.fromJust (maybeHero);

        const maybeWikiEntry =
          getWikiEntry<Record<SpecialAbility>> (getWiki (state)) (args.id);

        const maybeStateEntry =
          getHeroStateItem<Record<ActivatableDependent>> (args.id) (hero);

        if (Maybe.isJust (maybeWikiEntry) && Maybe.isJust (maybeStateEntry)) {
          const wikiEntry = Maybe.fromJust (maybeWikiEntry);

          dispatch<DeactivateSpecialAbilityAction> ({
            type: ActionTypes.DEACTIVATE_SPECIALABILITY,
            payload: {
              ...args,
              wikiEntry,
            },
          });
        }
      }
    };

export interface SetSpecialAbilityTierAction {
  type: ActionTypes.SET_SPECIALABILITY_TIER;
  payload: {
    id: string;
    index: number;
    tier: number;
    wikiEntry: Record<SpecialAbility>;
  };
}

/**
 * Change the current level of a special ability.
 */
export const setSpecialAbilityLevel = (locale: UIMessagesObject) =>
  (id: string) => (index: number) => (level: number): AsyncAction =>
    (dispatch, getState) => {
      const state = getState ();

      const maybeHero = getCurrentHeroPresent (state);

      if (Maybe.isJust (maybeHero)) {
        const hero = Maybe.fromJust (maybeHero);

        const maybeWikiEntry =
          getWikiEntry<Record<SpecialAbility>> (getWiki (state)) (id);

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

          if (Maybe.isJust (maybeCost)) {
            const cost = Maybe.fromJust (maybeCost);

            const areSufficientAPAvailable =
              getAvailableAdventurePoints (state, { locale })
                .fmap (
                  availableAP => getAreSufficientAPAvailable (getIsInCharacterCreation (state))
                                                             (availableAP)
                                                             (cost)
                );

            if (Maybe.elem (true) (areSufficientAPAvailable)) {
              dispatch<SetSpecialAbilityTierAction> ({
                type: ActionTypes.SET_SPECIALABILITY_TIER,
                payload: {
                  id,
                  tier: level,
                  index,
                  wikiEntry,
                },
              });
            }
            else {
              dispatch (addAlert ({
                title: translate (locale, 'notenoughap.title'),
                message: translate (locale, 'notenoughap.content'),
              }));
            }
          }
        }
      }
    };

export interface SetSpecialAbilitiesSortOrderAction {
  type: ActionTypes.SET_SPECIALABILITIES_SORT_ORDER;
  payload: {
    sortOrder: string;
  };
}

export const setSpecialAbilitiesSortOrder =
  (sortOrder: string): SetSpecialAbilitiesSortOrderAction => ({
    type: ActionTypes.SET_SPECIALABILITIES_SORT_ORDER,
    payload: {
      sortOrder,
    },
  });

export interface SetActiveSpecialAbilitiesFilterTextAction {
  type: ActionTypes.SET_SPECIAL_ABILITIES_FILTER_TEXT;
  payload: {
    filterText: string;
  };
}

export const setActiveSpecialAbilitiesFilterText =
  (filterText: string): SetActiveSpecialAbilitiesFilterTextAction => ({
    type: ActionTypes.SET_SPECIAL_ABILITIES_FILTER_TEXT,
    payload: {
      filterText,
    },
  });

export interface SetInactiveSpecialAbilitiesFilterTextAction {
  type: ActionTypes.SET_INACTIVE_SPECIAL_ABILITIES_FILTER_TEXT;
  payload: {
    filterText: string;
  };
}

export const setInactiveSpecialAbilitiesFilterText =
  (filterText: string): SetInactiveSpecialAbilitiesFilterTextAction => ({
    type: ActionTypes.SET_INACTIVE_SPECIAL_ABILITIES_FILTER_TEXT,
    payload: {
      filterText,
    },
  });

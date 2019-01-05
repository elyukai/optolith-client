import * as Wiki from '../App/Models/Wiki/wikiTypeHelpers';
import { ActionTypes } from '../constants/ActionTypes';
import { getAvailableAdventurePoints } from '../selectors/adventurePointsSelectors';
import { getIsInCharacterCreation } from '../selectors/phaseSelectors';
import { getSpells, getWikiSpells } from '../selectors/stateSelectors';
import { AsyncAction } from '../types/actions';
import { UIMessagesObject } from '../types/ui';
import { getAreSufficientAPAvailable } from '../utils/adventurePoints/adventurePointsUtils';
import { getIncreaseAP } from '../utils/adventurePoints/improvementCostUtils';
import { Maybe, Nothing, Record } from '../utils/dataUtils';
import { translate } from '../utils/I18n';
import { getAreSufficientAPAvailableForIncrease } from '../utils/IncreasableUtils';
import { addAlert } from './AlertActions';

export interface ActivateSpellAction {
  type: ActionTypes.ACTIVATE_SPELL;
  payload: {
    id: string;
    wikiEntry: Record<Wiki.Spell>;
  };
}

export const addSpell = (locale: UIMessagesObject) => (id: string): AsyncAction =>
  (dispatch, getState) => {
    const state = getState ();
    const wikiSpells = getWikiSpells (state);

    const maybeWikiSpell = wikiSpells.lookup (id);

    if (Maybe.isJust (maybeWikiSpell)) {
      const wikiEntry = Maybe.fromJust (maybeWikiSpell);

      const areSufficientAPAvailableForIncrease = getAvailableAdventurePoints (state, { locale })
        .fmap (
          availableAP => getAreSufficientAPAvailable (getIsInCharacterCreation (state))
                                                     (availableAP)
                                                     (getIncreaseAP (wikiEntry.get ('ic'))
                                                                    (Nothing ()))
        );

      if (Maybe.elem (true) (areSufficientAPAvailableForIncrease)) {
        dispatch<ActivateSpellAction> ({
          type: ActionTypes.ACTIVATE_SPELL,
          payload: {
            id,
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
  };

export interface ActivateCantripAction {
  type: ActionTypes.ACTIVATE_CANTRIP;
  payload: {
    id: string;
  };
}

export const addCantrip = (locale: UIMessagesObject) => (id: string): AsyncAction =>
  (dispatch, getState) => {
    const state = getState ();

    const areSufficientAPAvailableForIncrease = getAvailableAdventurePoints (state, { locale })
      .fmap (
        availableAP => getAreSufficientAPAvailable (getIsInCharacterCreation (state))
                                                   (availableAP)
                                                   (1)
      );

    if (Maybe.elem (true) (areSufficientAPAvailableForIncrease)) {
      dispatch<ActivateCantripAction> ({
        type: ActionTypes.ACTIVATE_CANTRIP,
        payload: {
          id,
        },
      });
    }
    else {
      dispatch (addAlert ({
        title: translate (locale, 'notenoughap.title'),
        message: translate (locale, 'notenoughap.content'),
      }));
    }
  };

export interface DeactivateSpellAction {
  type: ActionTypes.DEACTIVATE_SPELL;
  payload: {
    id: string;
    wikiEntry: Record<Wiki.Spell>;
  };
}

export const removeSpell = (id: string): AsyncAction => (dispatch, getState) => {
  const state = getState ();
  const wikiSpells = getWikiSpells (state);

  const maybeWikiSpell = wikiSpells.lookup (id);

  if (Maybe.isJust (maybeWikiSpell)) {
    const wikiEntry = Maybe.fromJust (maybeWikiSpell);

    dispatch<DeactivateSpellAction> ({
      type: ActionTypes.DEACTIVATE_SPELL,
      payload: {
        id,
        wikiEntry,
      },
    });
  }
};

export interface DeactivateCantripAction {
  type: ActionTypes.DEACTIVATE_CANTRIP;
  payload: {
    id: string;
  };
}

export const removeCantrip = (id: string): DeactivateCantripAction => ({
  type: ActionTypes.DEACTIVATE_CANTRIP,
  payload: {
    id,
  },
});

export interface AddSpellPointAction {
  type: ActionTypes.ADD_SPELL_POINT;
  payload: {
    id: string;
  };
}

export const addSpellPoint = (locale: UIMessagesObject) => (id: string): AsyncAction =>
  (dispatch, getState) => {
    const state = getState ();
    const maybeHeroSpells = getSpells (state);
    const wikiSpells = getWikiSpells (state);

    const areSufficientAPAvailableForIncrease = wikiSpells.lookup (id).bind (
      wikiSpell => getAvailableAdventurePoints (state, { locale }).fmap (
        availableAP => getAreSufficientAPAvailableForIncrease (
          wikiSpell,
          maybeHeroSpells.bind (spells => spells.lookup (id)),
          availableAP,
          getIsInCharacterCreation (state)
        )
      )
    );

    if (Maybe.elem (true) (areSufficientAPAvailableForIncrease)) {
      dispatch<AddSpellPointAction> ({
        type: ActionTypes.ADD_SPELL_POINT,
        payload: {
          id,
        },
      });
    }
    else {
      dispatch (addAlert ({
        title: translate (locale, 'notenoughap.title'),
        message: translate (locale, 'notenoughap.content'),
      }));
    }
  };

export interface RemoveSpellPointAction {
  type: ActionTypes.REMOVE_SPELL_POINT;
  payload: {
    id: string;
  };
}

export const removeSpellPoint = (id: string): RemoveSpellPointAction => ({
  type: ActionTypes.REMOVE_SPELL_POINT,
  payload: {
    id,
  },
});

export interface SetSpellsSortOrderAction {
  type: ActionTypes.SET_SPELLS_SORT_ORDER;
  payload: {
    sortOrder: string;
  };
}

export const setSpellsSortOrder = (sortOrder: string): SetSpellsSortOrderAction => ({
  type: ActionTypes.SET_SPELLS_SORT_ORDER,
  payload: {
    sortOrder,
  },
});

export interface SetActiveSpellsFilterTextAction {
  type: ActionTypes.SET_SPELLS_FILTER_TEXT;
  payload: {
    filterText: string;
  };
}

export const setActiveSpellsFilterText = (filterText: string): SetActiveSpellsFilterTextAction => ({
  type: ActionTypes.SET_SPELLS_FILTER_TEXT,
  payload: {
    filterText,
  },
});

export interface SetInactiveSpellsFilterTextAction {
  type: ActionTypes.SET_INACTIVE_SPELLS_FILTER_TEXT;
  payload: {
    filterText: string;
  };
}

export const setInactiveSpellsFilterText =
  (filterText: string): SetInactiveSpellsFilterTextAction => ({
    type: ActionTypes.SET_INACTIVE_SPELLS_FILTER_TEXT,
    payload: {
      filterText,
    },
  });

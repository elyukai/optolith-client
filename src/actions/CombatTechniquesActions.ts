import { getAreSufficientAPAvailableForIncrease } from '../App/Utils/Increasable/increasableUtils';
import { ActionTypes } from '../constants/ActionTypes';
import { getAvailableAdventurePoints } from '../selectors/adventurePointsSelectors';
import { getIsInCharacterCreation } from '../selectors/phaseSelectors';
import { getCombatTechniques, getWikiCombatTechniques } from '../selectors/stateSelectors';
import { AsyncAction } from '../types/actions';
import { UIMessagesObject } from '../types/ui';
import { Maybe } from '../utils/dataUtils';
import { translate } from '../utils/I18n';
import { addAlert } from './AlertActions';

export interface AddCombatTechniquePointAction {
  type: ActionTypes.ADD_COMBATTECHNIQUE_POINT;
  payload: {
    id: string;
  };
}

export const addCombatTechniquePoint = (locale: UIMessagesObject) => (id: string): AsyncAction =>
  (dispatch, getState) => {
    const state = getState ();
    const maybeHeroCombatTechniques = getCombatTechniques (state);
    const wikiAttributes = getWikiCombatTechniques (state);

    const areSufficientAPAvailableForIncrease = wikiAttributes.lookup (id).bind (
      wikiCombatTechnique => getAvailableAdventurePoints (state, { locale }).fmap (
        availableAP => getAreSufficientAPAvailableForIncrease (
          wikiCombatTechnique,
          maybeHeroCombatTechniques.bind (combatTechniques => combatTechniques.lookup (id)),
          availableAP,
          getIsInCharacterCreation (state)
        )
      )
    );

    if (Maybe.elem (true) (areSufficientAPAvailableForIncrease)) {
      dispatch<AddCombatTechniquePointAction> ({
        type: ActionTypes.ADD_COMBATTECHNIQUE_POINT,
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

export interface RemoveCombatTechniquePointAction {
  type: ActionTypes.REMOVE_COMBATTECHNIQUE_POINT;
  payload: {
    id: string;
  };
}

export const removeCombatTechniquePoint = (id: string): RemoveCombatTechniquePointAction => ({
  type: ActionTypes.REMOVE_COMBATTECHNIQUE_POINT,
  payload: {
    id,
  },
});

export interface SetCombatTechniquesSortOrderAction {
  type: ActionTypes.SET_COMBATTECHNIQUES_SORT_ORDER;
  payload: {
    sortOrder: string;
  };
}

export const setCombatTechniquesSortOrder =
  (sortOrder: string): SetCombatTechniquesSortOrderAction => ({
    type: ActionTypes.SET_COMBATTECHNIQUES_SORT_ORDER,
    payload: {
      sortOrder,
    },
  });

export interface SetCombatTechniquesFilterTextAction {
  type: ActionTypes.SET_COMBAT_TECHNIQUES_FILTER_TEXT;
  payload: {
    filterText: string;
  };
}

export const setCombatTechniquesFilterText =
  (filterText: string): SetCombatTechniquesFilterTextAction => ({
    type: ActionTypes.SET_COMBAT_TECHNIQUES_FILTER_TEXT,
    payload: {
      filterText,
    },
  });

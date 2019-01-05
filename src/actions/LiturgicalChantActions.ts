import { getAreSufficientAPAvailableForIncrease } from '../App/Utils/Increasable/increasableUtils';
import { ActionTypes } from '../constants/ActionTypes';
import { getAvailableAdventurePoints } from '../selectors/adventurePointsSelectors';
import { getIsInCharacterCreation } from '../selectors/phaseSelectors';
import { getLiturgicalChants, getWikiLiturgicalChants } from '../selectors/stateSelectors';
import { AsyncAction } from '../types/actions';
import { UIMessagesObject } from '../types/ui';
import { getAreSufficientAPAvailable } from '../utils/adventurePoints/adventurePointsUtils';
import { getIncreaseAP } from '../utils/adventurePoints/improvementCostUtils';
import { Maybe, Nothing } from '../utils/dataUtils';
import { translate } from '../utils/I18n';
import { addAlert } from './AlertActions';

export interface ActivateLiturgicalChantAction {
  type: ActionTypes.ACTIVATE_LITURGY;
  payload: {
    id: string;
  };
}

export const addLiturgicalChant = (locale: UIMessagesObject) => (id: string): AsyncAction =>
  (dispatch, getState) => {
    const state = getState ();
    const wikiLiturgicalChants = getWikiLiturgicalChants (state);

    const areSufficientAPAvailableForIncrease = wikiLiturgicalChants.lookup (id).bind (
      wikiLiturgicalChant => getAvailableAdventurePoints (state, { locale }).fmap (
        availableAP => getAreSufficientAPAvailable (getIsInCharacterCreation (state))
                                                   (availableAP)
                                                   (getIncreaseAP (wikiLiturgicalChant.get ('ic'))
                                                                  (Nothing ()))
      )
    );

    if (Maybe.elem (true) (areSufficientAPAvailableForIncrease)) {
      dispatch<ActivateLiturgicalChantAction> ({
        type: ActionTypes.ACTIVATE_LITURGY,
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

export interface ActivateBlessingAction {
  type: ActionTypes.ACTIVATE_BLESSING;
  payload: {
    id: string;
  };
}

export const addBlessing = (locale: UIMessagesObject) => (id: string): AsyncAction =>
  (dispatch, getState) => {
    const state = getState ();

    const areSufficientAPAvailableForIncrease = getAvailableAdventurePoints (state, { locale })
      .fmap (
        availableAP => getAreSufficientAPAvailable (getIsInCharacterCreation (state))
                                                   (availableAP)
                                                   (1)
      );

    if (Maybe.elem (true) (areSufficientAPAvailableForIncrease)) {
      dispatch<ActivateBlessingAction> ({
        type: ActionTypes.ACTIVATE_BLESSING,
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

export interface DeactivateLiturgyAction {
  type: ActionTypes.DEACTIVATE_LITURGY;
  payload: {
    id: string;
  };
}

export const removeLiturgicalChant = (id: string): DeactivateLiturgyAction => ({
  type: ActionTypes.DEACTIVATE_LITURGY,
  payload: {
    id,
  },
});

export interface DeactivateBlessingAction {
  type: ActionTypes.DEACTIVATE_BLESSING;
  payload: {
    id: string;
  };
}

export const removeBlessing = (id: string): DeactivateBlessingAction => ({
  type: ActionTypes.DEACTIVATE_BLESSING,
  payload: {
    id,
  },
});

export interface AddLiturgicalChantPointAction {
  type: ActionTypes.ADD_LITURGY_POINT;
  payload: {
    id: string;
  };
}

export const addLiturgicalChantPoint = (locale: UIMessagesObject) => (id: string): AsyncAction =>
  (dispatch, getState) => {
    const state = getState ();
    const maybeHeroLiturgicalChants = getLiturgicalChants (state);
    const wikiLiturgicalChants = getWikiLiturgicalChants (state);

    const areSufficientAPAvailableForIncrease = wikiLiturgicalChants.lookup (id).bind (
      wikiLiturgicalChant => getAvailableAdventurePoints (state, { locale }).fmap (
        availableAP => getAreSufficientAPAvailableForIncrease (
          wikiLiturgicalChant,
          maybeHeroLiturgicalChants.bind (liturgicalChants => liturgicalChants.lookup (id)),
          availableAP,
          getIsInCharacterCreation (state)
        )
      )
    );

    if (Maybe.elem (true) (areSufficientAPAvailableForIncrease)) {
      dispatch<AddLiturgicalChantPointAction> ({
        type: ActionTypes.ADD_LITURGY_POINT,
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

export interface RemoveLiturgicalChantPointAction {
  type: ActionTypes.REMOVE_LITURGY_POINT;
  payload: {
    id: string;
  };
}

export const removeLiturgicalChantPoint = (id: string): RemoveLiturgicalChantPointAction => ({
  type: ActionTypes.REMOVE_LITURGY_POINT,
  payload: {
    id,
  },
});

export interface SetLiturgicalChantsSortOrderAction {
  type: ActionTypes.SET_LITURGIES_SORT_ORDER;
  payload: {
    sortOrder: string;
  };
}

export const setLiturgicalChantsSortOrder =
  (sortOrder: string): SetLiturgicalChantsSortOrderAction => ({
    type: ActionTypes.SET_LITURGIES_SORT_ORDER,
    payload: {
      sortOrder,
    },
  });

export interface SetActiveLiturgicalChantsFilterTextAction {
  type: ActionTypes.SET_LITURGICAL_CHANTS_FILTER_TEXT;
  payload: {
    filterText: string;
  };
}

export const setActiveLiturgicalChantsFilterText =
  (filterText: string): SetActiveLiturgicalChantsFilterTextAction => ({
    type: ActionTypes.SET_LITURGICAL_CHANTS_FILTER_TEXT,
    payload: {
      filterText,
    },
  });

export interface SetInactiveLiturgicalChantsFilterTextAction {
  type: ActionTypes.SET_INACTIVE_LITURGICAL_CHANTS_FILTER_TEXT;
  payload: {
    filterText: string;
  };
}

export const setInactiveLiturgicalChantsFilterText =
  (filterText: string): SetInactiveLiturgicalChantsFilterTextAction => ({
    type: ActionTypes.SET_INACTIVE_LITURGICAL_CHANTS_FILTER_TEXT,
    payload: {
      filterText,
    },
  });

import { fmapF } from "../../Data/Functor";
import { List } from "../../Data/List";
import { bind, bindF, fromJust, isNothing, join, liftM2 } from "../../Data/Maybe";
import { lookup } from "../../Data/OrderedMap";
import { ActionTypes } from "../Constants/ActionTypes";
import { HeroModel } from "../Models/Hero/HeroModel";
import { L10nRecord } from "../Models/Wiki/L10n";
import { LiturgicalChant } from "../Models/Wiki/LiturgicalChant";
import { getAvailableAPMap } from "../Selectors/adventurePointsSelectors";
import { getIsInCharacterCreation } from "../Selectors/phaseSelectors";
import { getCurrentHeroPresent, getLiturgicalChants, getWikiLiturgicalChants } from "../Selectors/stateSelectors";
import { getMissingAP } from "../Utilities/AdventurePoints/adventurePointsUtils";
import { getICMultiplier } from "../Utilities/AdventurePoints/improvementCostUtils";
import { translate, translateP } from "../Utilities/I18n";
import { getAreSufficientAPAvailableForIncrease } from "../Utilities/Increasable/increasableUtils";
import { pipe, pipe_ } from "../Utilities/pipe";
import { SortNames } from "../Views/Universal/SortOptions";
import { ReduxAction } from "./Actions";
import { addAlert } from "./AlertActions";

export interface ActivateLiturgicalChantAction {
  type: ActionTypes.ACTIVATE_LITURGY
  payload: {
    id: string;
  }
}

export const addLiturgicalChant =
  (l10n: L10nRecord) =>
  (id: string): ReduxAction =>
  (dispatch, getState) => {
    const state = getState ()
    const wiki_liturgical_chants = getWikiLiturgicalChants (state)
    const mhero = getCurrentHeroPresent (state)

    const missingAPForInc =
      pipe_ (
        mhero,
        bindF (hero => getAvailableAPMap (HeroModel.A.id (hero)) (state, { l10n, hero })),
        join,
        liftM2 (getMissingAP (getIsInCharacterCreation (state)))
               (fmapF (lookup (id) (wiki_liturgical_chants))
                      (pipe (LiturgicalChant.A.ic, getICMultiplier))),
        join
      )

    if (isNothing (missingAPForInc)) {
      dispatch<ActivateLiturgicalChantAction> ({
        type: ActionTypes.ACTIVATE_LITURGY,
        payload: {
          id,
        },
      })
    }
    else {
      dispatch (addAlert ({
        title: translate (l10n) ("notenoughap"),
        message: translateP (l10n) ("notenoughap.text") (List (fromJust (missingAPForInc))),
      }))
    }
  }

export interface ActivateBlessingAction {
  type: ActionTypes.ACTIVATE_BLESSING
  payload: {
    id: string;
  }
}

export const addBlessing =
  (l10n: L10nRecord) =>
  (id: string): ReduxAction =>
  (dispatch, getState) => {
    const state = getState ()
    const mhero = getCurrentHeroPresent (state)

    const missingAP =
      pipe_ (
        mhero,
        bindF (hero => getAvailableAPMap (HeroModel.A.id (hero)) (state, { l10n, hero })),
        join,
        bindF (getMissingAP (getIsInCharacterCreation (state))
                            (1))
      )

    if (isNothing (missingAP)) {
      dispatch<ActivateBlessingAction> ({
        type: ActionTypes.ACTIVATE_BLESSING,
        payload: {
          id,
        },
      })
    }
    else {
      dispatch (addAlert ({
        title: translate (l10n) ("notenoughap"),
        message: translateP (l10n) ("notenoughap.text") (List (fromJust (missingAP))),
      }))
    }
  }

export interface DeactivateLiturgyAction {
  type: ActionTypes.DEACTIVATE_LITURGY
  payload: {
    id: string;
  }
}

export const removeLiturgicalChant = (id: string): DeactivateLiturgyAction => ({
  type: ActionTypes.DEACTIVATE_LITURGY,
  payload: {
    id,
  },
})

export interface DeactivateBlessingAction {
  type: ActionTypes.DEACTIVATE_BLESSING
  payload: {
    id: string;
  }
}

export const removeBlessing = (id: string): DeactivateBlessingAction => ({
  type: ActionTypes.DEACTIVATE_BLESSING,
  payload: {
    id,
  },
})

export interface AddLiturgicalChantPointAction {
  type: ActionTypes.ADD_LITURGY_POINT
  payload: {
    id: string;
  }
}

export const addLiturgicalChantPoint =
  (l10n: L10nRecord) =>
  (id: string): ReduxAction =>
  (dispatch, getState) => {
    const state = getState ()
    const mhero_liturgical_chants = getLiturgicalChants (state)
    const wiki_liturgical_chants = getWikiLiturgicalChants (state)
    const mhero = getCurrentHeroPresent (state)

    const missingAPForInc =
      pipe_ (
        mhero,
        bindF (hero => getAvailableAPMap (HeroModel.A.id (hero)) (state, { l10n, hero })),
        join,
        liftM2 (getAreSufficientAPAvailableForIncrease (getIsInCharacterCreation (state))
                                                       (bind (mhero_liturgical_chants)
                                                             (lookup (id))))
               (lookup (id) (wiki_liturgical_chants)),
        join
      )

    if (isNothing (missingAPForInc)) {
      dispatch<AddLiturgicalChantPointAction> ({
        type: ActionTypes.ADD_LITURGY_POINT,
        payload: {
          id,
        },
      })
    }
    else {
      dispatch (addAlert ({
        title: translate (l10n) ("notenoughap"),
        message: translateP (l10n) ("notenoughap.text") (List (fromJust (missingAPForInc))),
      }))
    }
  }

export interface RemoveLiturgicalChantPointAction {
  type: ActionTypes.REMOVE_LITURGY_POINT
  payload: {
    id: string;
  }
}

export const removeLiturgicalChantPoint = (id: string): RemoveLiturgicalChantPointAction => ({
  type: ActionTypes.REMOVE_LITURGY_POINT,
  payload: {
    id,
  },
})

export interface SetLiturgicalChantsSortOrderAction {
  type: ActionTypes.SET_LITURGIES_SORT_ORDER
  payload: {
    sortOrder: SortNames;
  }
}

export const setLiturgicalChantsSortOrder =
  (sortOrder: SortNames): SetLiturgicalChantsSortOrderAction => ({
    type: ActionTypes.SET_LITURGIES_SORT_ORDER,
    payload: {
      sortOrder,
    },
  })

export interface SetActiveLiturgicalChantsFilterTextAction {
  type: ActionTypes.SET_LITURGICAL_CHANTS_FILTER_TEXT
  payload: {
    filterText: string;
  }
}

export const setActiveLiturgicalChantsFilterText =
  (filterText: string): SetActiveLiturgicalChantsFilterTextAction => ({
    type: ActionTypes.SET_LITURGICAL_CHANTS_FILTER_TEXT,
    payload: {
      filterText,
    },
  })

export interface SetInactiveLiturgicalChantsFilterTextAction {
  type: ActionTypes.SET_INACTIVE_LITURGICAL_CHANTS_FILTER_TEXT
  payload: {
    filterText: string;
  }
}

export const setInactiveLiturgicalChantsFilterText =
  (filterText: string): SetInactiveLiturgicalChantsFilterTextAction => ({
    type: ActionTypes.SET_INACTIVE_LITURGICAL_CHANTS_FILTER_TEXT,
    payload: {
      filterText,
    },
  })

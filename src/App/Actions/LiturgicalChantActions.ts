import { bind, bindF, fromJust, isJust, isNothing, join, liftM2 } from "../../Data/Maybe"
import { lookup } from "../../Data/OrderedMap"
import { Record } from "../../Data/Record"
import * as ActionTypes from "../Constants/ActionTypes"
import { icFromJs } from "../Constants/Groups"
import { ChantsSortOptions } from "../Models/Config"
import { HeroModel } from "../Models/Hero/HeroModel"
import { LiturgicalChant } from "../Models/Wiki/LiturgicalChant"
import { getAvailableAPMap } from "../Selectors/adventurePointsSelectors"
import { getIsInCharacterCreation } from "../Selectors/phaseSelectors"
import { getCurrentHeroPresent, getLiturgicalChants, getWikiLiturgicalChants } from "../Selectors/stateSelectors"
import { getMissingAP } from "../Utilities/AdventurePoints/adventurePointsUtils"
import { getAPForActivatation } from "../Utilities/IC.gen"
import { getAreSufficientAPAvailableForIncrease } from "../Utilities/Increasable/increasableUtils"
import { pipe_ } from "../Utilities/pipe"
import { ReduxAction } from "./Actions"
import { addNotEnoughAPAlert } from "./AlertActions"

export interface ActivateLiturgicalChantAction {
  type: ActionTypes.ACTIVATE_LITURGY
  payload: {
    id: string
    staticEntry: Record<LiturgicalChant>
  }
}

export const addLiturgicalChant =
  (id: string): ReduxAction<Promise<void>> =>
  async (dispatch, getState) => {
    const state = getState ()
    const wiki_liturgical_chants = getWikiLiturgicalChants (state)
    const mhero = getCurrentHeroPresent (state)

    const maybeStaticLiturgicalChant = lookup (id) (wiki_liturgical_chants)

    if (isJust (maybeStaticLiturgicalChant)) {
      const staticLiturgicalChant = fromJust (maybeStaticLiturgicalChant)

      const missingAPForInc =
        pipe_ (
          mhero,
          bindF (hero => getAvailableAPMap (HeroModel.A.id (hero)) (state, { hero })),
          join,
          bindF (getMissingAP (getIsInCharacterCreation (state))
                              (pipe_ (
                                staticLiturgicalChant,
                                LiturgicalChant.A.ic,
                                icFromJs,
                                getAPForActivatation
                              )))
        )

      if (isNothing (missingAPForInc)) {
        dispatch<ActivateLiturgicalChantAction> ({
          type: ActionTypes.ACTIVATE_LITURGY,
          payload: {
            id,
            staticEntry: staticLiturgicalChant,
          },
        })
      }
      else {
        await dispatch (addNotEnoughAPAlert (fromJust (missingAPForInc)))
      }
    }
  }

export interface ActivateBlessingAction {
  type: ActionTypes.ACTIVATE_BLESSING
  payload: {
    id: string
  }
}

export const addBlessing =
  (id: string): ReduxAction<Promise<void>> =>
  async (dispatch, getState) => {
    const state = getState ()
    const mhero = getCurrentHeroPresent (state)

    const missingAP =
      pipe_ (
        mhero,
        bindF (hero => getAvailableAPMap (HeroModel.A.id (hero)) (state, { hero })),
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
      await dispatch (addNotEnoughAPAlert (fromJust (missingAP)))
    }
  }

export interface DeactivateLiturgyAction {
  type: ActionTypes.DEACTIVATE_LITURGY
  payload: {
    id: string
    staticEntry: Record<LiturgicalChant>
  }
}

export const removeLiturgicalChant =
  (id: string): ReduxAction =>
  (dispatch, getState) => {
    const state = getState ()
    const staticLiturgicalChants = getWikiLiturgicalChants (state)

    const maybeStaticLiturgicalChant = lookup (id) (staticLiturgicalChants)

    if (isJust (maybeStaticLiturgicalChant)) {
      const staticLiturgicalChant = fromJust (maybeStaticLiturgicalChant)

      dispatch<DeactivateLiturgyAction> ({
        type: ActionTypes.DEACTIVATE_LITURGY,
        payload: {
          id,
          staticEntry: staticLiturgicalChant,
        },
      })
    }
  }

export interface DeactivateBlessingAction {
  type: ActionTypes.DEACTIVATE_BLESSING
  payload: {
    id: string
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
    id: string
  }
}

export const addLiturgicalChantPoint =
  (id: string): ReduxAction<Promise<void>> =>
  async (dispatch, getState) => {
    const state = getState ()
    const mhero_liturgical_chants = getLiturgicalChants (state)
    const wiki_liturgical_chants = getWikiLiturgicalChants (state)
    const mhero = getCurrentHeroPresent (state)

    const missingAPForInc =
      pipe_ (
        mhero,
        bindF (hero => getAvailableAPMap (HeroModel.A.id (hero)) (state, { hero })),
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
      await dispatch (addNotEnoughAPAlert (fromJust (missingAPForInc)))
    }
  }

export interface RemoveLiturgicalChantPointAction {
  type: ActionTypes.REMOVE_LITURGY_POINT
  payload: {
    id: string
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
    sortOrder: ChantsSortOptions
  }
}

export const setLiturgicalChantsSortOrder =
  (sortOrder: ChantsSortOptions): SetLiturgicalChantsSortOrderAction => ({
    type: ActionTypes.SET_LITURGIES_SORT_ORDER,
    payload: {
      sortOrder,
    },
  })

export interface SetActiveLiturgicalChantsFilterTextAction {
  type: ActionTypes.SET_LITURGICAL_CHANTS_FILTER_TEXT
  payload: {
    filterText: string
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
  type: ActionTypes.SET_INAC_LCS_FILTER_TEXT
  payload: {
    filterText: string
  }
}

export const setInactiveLiturgicalChantsFilterText =
  (filterText: string): SetInactiveLiturgicalChantsFilterTextAction => ({
    type: ActionTypes.SET_INAC_LCS_FILTER_TEXT,
    payload: {
      filterText,
    },
  })

import { lookup } from "../../Data/IntMap"
import { bindF, fmap, fmapF, fromJust, isNothing, join, liftM2 } from "../../Data/Maybe"
import { curryN } from "../../Data/Tuple/All"
import * as ActionTypes from "../Constants/ActionTypes"
import { getAvailableAPMap } from "../Selectors/adventurePointsSelectors"
import { getIsInCharacterCreation } from "../Selectors/phaseSelectors"
import { getAddedArcaneEnergyPoints, getAddedKarmaPoints, getAddedLifePoints, getCurrentHeroPresent, getWikiAttributes } from "../Selectors/stateSelectors"
import { getMissingAP } from "../Utilities/AdventurePoints/adventurePointsUtils"
import { getAPForInc } from "../Utilities/IC.gen"
import { getAreSufficientAPAvailableForIncrease } from "../Utilities/Increasable/increasableUtils"
import { pipe, pipe_ } from "../Utilities/pipe"
import { VC } from "../Utilities/Variant"
import { ReduxAction } from "./Actions"
import { addNotEnoughAPAlert } from "./AlertActions"

export interface AddAttributePointAction {
  type: ActionTypes.ADD_ATTRIBUTE_POINT
  payload: {
    id: number
  }
}

export const addAttributePoint = (id: number): ReduxAction<Promise<void>> =>
  async (dispatch, getState) => {
    const state = getState ()
    const wiki_attributes = getWikiAttributes (state)
    const mhero = getCurrentHeroPresent (state)
    const mhero_attributes = fmapF (mhero) (hero => hero.attributes)

    const missingAPForInc =
      pipe_ (
        mhero,
        bindF (hero => getAvailableAPMap (hero.id) (state, { hero })),
        join,
        liftM2 (getAreSufficientAPAvailableForIncrease (getIsInCharacterCreation (state))
                                                       (pipe_ (
                                                         mhero_attributes,
                                                         bindF (lookup (id)),
                                                         fmap (VC ("AttributeDependent"))
                                                       )))
               (pipe_ (
                 wiki_attributes,
                 lookup (id),
                 fmap (VC ("Attribute"))
               )),
        join
      )

    if (isNothing (missingAPForInc)) {
      dispatch<AddAttributePointAction> ({
        type: ActionTypes.ADD_ATTRIBUTE_POINT,
        payload: {
          id,
        },
      })
    }
    else {
      await dispatch (addNotEnoughAPAlert (fromJust (missingAPForInc)))
    }
  }

export interface RemoveAttributePointAction {
  type: ActionTypes.REMOVE_ATTRIBUTE_POINT
  payload: {
    id: string
  }
}

export const removeAttributePoint = (id: string): RemoveAttributePointAction => ({
  type: ActionTypes.REMOVE_ATTRIBUTE_POINT,
  payload: {
    id,
  },
})

export interface AddLifePointAction {
  type: ActionTypes.ADD_LIFE_POINT
}

export const addLifePoint: ReduxAction<Promise<void>> =
  async (dispatch, getState) => {
    const state = getState ()
    const mhero = getCurrentHeroPresent (state)

    const missingAP =
      pipe_ (
        mhero,
        bindF (hero => getAvailableAPMap (hero.id) (state, { hero })),
        join,
        liftM2 (pipe (

                 // get AP for added points
                 curryN (getAPForInc) ("D"),

                 // AP are passed to result and result finally gets the available AP
                 getMissingAP (getIsInCharacterCreation (state))
               ))
               (getAddedLifePoints (state)),
        join
      )

    if (isNothing (missingAP)) {
      dispatch<AddLifePointAction> ({
        type: ActionTypes.ADD_LIFE_POINT,
      })
    }
    else {
      await dispatch (addNotEnoughAPAlert (fromJust (missingAP)))
    }
  }

export interface AddArcaneEnergyPointAction {
  type: ActionTypes.ADD_ARCANE_ENERGY_POINT
}

export const addArcaneEnergyPoint: ReduxAction<Promise<void>> =
  async (dispatch, getState) => {
    const state = getState ()
    const mhero = getCurrentHeroPresent (state)

    const missingAP =
      pipe_ (
        mhero,
        bindF (hero => getAvailableAPMap (hero.id) (state, { hero })),
        join,
        liftM2 (pipe (

                 // get AP for added points
                 curryN (getAPForInc) ("D"),

                 // AP are passed to result and result finally gets the available AP
                 getMissingAP (getIsInCharacterCreation (state))
               ))
               (getAddedArcaneEnergyPoints (state)),
        join
      )

    if (isNothing (missingAP)) {
      dispatch<AddArcaneEnergyPointAction> ({
        type: ActionTypes.ADD_ARCANE_ENERGY_POINT,
      })
    }
    else {
      await dispatch (addNotEnoughAPAlert (fromJust (missingAP)))
    }
  }

export interface AddKarmaPointAction {
  type: ActionTypes.ADD_KARMA_POINT
}

export const addKarmaPoint: ReduxAction<Promise<void>> =
  async (dispatch, getState) => {
    const state = getState ()
    const mhero = getCurrentHeroPresent (state)

    const missingAP =
      pipe_ (
        mhero,
        bindF (hero => getAvailableAPMap (hero.id) (state, { hero })),
        join,
        liftM2 (pipe (

                 // get AP for added points
                 curryN (getAPForInc) ("D"),

                 // AP are passed to result and result finally gets the available AP
                 getMissingAP (getIsInCharacterCreation (state))
               ))
               (getAddedKarmaPoints (state)),
        join
      )

    if (isNothing (missingAP)) {
      dispatch<AddKarmaPointAction> ({
        type: ActionTypes.ADD_KARMA_POINT,
      })
    }
    else {
      await dispatch (addNotEnoughAPAlert (fromJust (missingAP)))
    }
  }

export interface RemoveLifePointAction {
  type: ActionTypes.REMOVE_LIFE_POINT
}

export const removeLifePoint = (): RemoveLifePointAction => ({
  type: ActionTypes.REMOVE_LIFE_POINT,
})

export interface RemoveArcaneEnergyPointAction {
  type: ActionTypes.REMOVE_ARCANE_ENERGY_POINT
}

export const removeArcaneEnergyPoint = (): RemoveArcaneEnergyPointAction => ({
  type: ActionTypes.REMOVE_ARCANE_ENERGY_POINT,
})

export interface RemoveKarmaPointAction {
  type: ActionTypes.REMOVE_KARMA_POINT
}

export const removeKarmaPoint = (): RemoveKarmaPointAction => ({
  type: ActionTypes.REMOVE_KARMA_POINT,
})

export interface AddBoughtBackAEPointAction {
  type: ActionTypes.ADD_BOUGHT_BACK_AE_POINT
}

export const addBoughtBackAEPoint: ReduxAction<Promise<void>> =
  async (dispatch, getState) => {
    const state = getState ()
    const mhero = getCurrentHeroPresent (state)

    const missingAP =
      pipe_ (
        mhero,
        bindF (hero => getAvailableAPMap (hero.id) (state, { hero })),
        join,
        bindF (getMissingAP (getIsInCharacterCreation (state))
                            (2))
      )

    if (isNothing (missingAP)) {
      dispatch<AddBoughtBackAEPointAction> ({
        type: ActionTypes.ADD_BOUGHT_BACK_AE_POINT,
      })
    }
    else {
      await dispatch (addNotEnoughAPAlert (fromJust (missingAP)))
    }
  }

export interface AddLostLPPointAction {
  type: ActionTypes.ADD_LOST_LP_POINT
}

export const addLostLPPoint = (): AddLostLPPointAction => ({
  type: ActionTypes.ADD_LOST_LP_POINT,
})

export interface RemoveLostLPPointAction {
  type: ActionTypes.REMOVE_LOST_LP_POINT
}

export const removeLostLPPoint = (): RemoveLostLPPointAction => ({
  type: ActionTypes.REMOVE_LOST_LP_POINT,
})

export interface AddLostLPPointsAction {
  type: ActionTypes.ADD_LOST_LP_POINTS
  payload: {
    value: number
  }
}

export const addLostLPPoints = (value: number): AddLostLPPointsAction => ({
  type: ActionTypes.ADD_LOST_LP_POINTS,
  payload: {
    value,
  },
})

export interface RemoveBoughtBackAEPointAction {
  type: ActionTypes.REMOVE_BOUGHT_BACK_AE_POINT
}

export const removeBoughtBackAEPoint = (): RemoveBoughtBackAEPointAction => ({
  type: ActionTypes.REMOVE_BOUGHT_BACK_AE_POINT,
})

export interface AddLostAEPointAction {
  type: ActionTypes.ADD_LOST_AE_POINT
}

export const addLostAEPoint = (): AddLostAEPointAction => ({
  type: ActionTypes.ADD_LOST_AE_POINT,
})

export interface RemoveLostAEPointAction {
  type: ActionTypes.REMOVE_LOST_AE_POINT
}

export const removeLostAEPoint = (): RemoveLostAEPointAction => ({
  type: ActionTypes.REMOVE_LOST_AE_POINT,
})

export interface AddLostAEPointsAction {
  type: ActionTypes.ADD_LOST_AE_POINTS
  payload: {
    value: number
  }
}

export const addLostAEPoints = (value: number): AddLostAEPointsAction => ({
  type: ActionTypes.ADD_LOST_AE_POINTS,
  payload: {
    value,
  },
})

export interface AddBoughtBackKPPointAction {
  type: ActionTypes.ADD_BOUGHT_BACK_KP_POINT
}

export const addBoughtBackKPPoint: ReduxAction<Promise<void>> =
  async (dispatch, getState) => {
    const state = getState ()
    const mhero = getCurrentHeroPresent (state)

    const missingAP =
      pipe_ (
        mhero,
        bindF (hero => getAvailableAPMap (hero.id) (state, { hero })),
        join,
        bindF (getMissingAP (getIsInCharacterCreation (state))
                            (2))
      )

    if (isNothing (missingAP)) {
      dispatch<AddBoughtBackKPPointAction> ({
        type: ActionTypes.ADD_BOUGHT_BACK_KP_POINT,
      })
    }
    else {
      await dispatch (addNotEnoughAPAlert (fromJust (missingAP)))
    }
  }

export interface RemoveBoughtBackKPPointAction {
  type: ActionTypes.REMOVE_BOUGHT_BACK_KP_POINT
}

export const removeBoughtBackKPPoint = (): RemoveBoughtBackKPPointAction => ({
  type: ActionTypes.REMOVE_BOUGHT_BACK_KP_POINT,
})

export interface AddLostKPPointAction {
  type: ActionTypes.ADD_LOST_KP_POINT
}

export const addLostKPPoint = (): AddLostKPPointAction => ({
  type: ActionTypes.ADD_LOST_KP_POINT,
})

export interface RemoveLostKPPointAction {
  type: ActionTypes.REMOVE_LOST_KP_POINT
}

export const removeLostKPPoint = (): RemoveLostKPPointAction => ({
  type: ActionTypes.REMOVE_LOST_KP_POINT,
})

export interface AddLostKPPointsAction {
  type: ActionTypes.ADD_LOST_KP_POINTS
  payload: {
    value: number
  }
}

export const addLostKPPoints = (value: number): AddLostKPPointsAction => ({
  type: ActionTypes.ADD_LOST_KP_POINTS,
  payload: {
    value,
  },
})

export interface SetAdjustmentIdAction {
  type: ActionTypes.SET_ATTR_ADJUSTMENT_SID
  payload: {
    id: string
  }
}

export const setAdjustmentId = (id: string): SetAdjustmentIdAction => ({
  type: ActionTypes.SET_ATTR_ADJUSTMENT_SID,
  payload: {
    id,
  },
})

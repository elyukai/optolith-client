import { List } from "../../Data/List";
import { bind, bindF, fromJust, isNothing, join, liftM2 } from "../../Data/Maybe";
import { lookup } from "../../Data/OrderedMap";
import { ActionTypes } from "../Constants/ActionTypes";
import { HeroModel } from "../Models/Hero/HeroModel";
import { L10nRecord } from "../Models/Wiki/L10n";
import { getAvailableAPMap } from "../Selectors/adventurePointsSelectors";
import { getIsInCharacterCreation } from "../Selectors/phaseSelectors";
import { getAddedArcaneEnergyPoints, getAddedKarmaPoints, getAddedLifePoints, getAttributes, getCurrentHeroPresent, getWikiAttributes } from "../Selectors/stateSelectors";
import { getMissingAP } from "../Utilities/AdventurePoints/adventurePointsUtils";
import { getIncreaseAP } from "../Utilities/AdventurePoints/improvementCostUtils";
import { translate, translateP } from "../Utilities/I18n";
import { getAreSufficientAPAvailableForIncrease } from "../Utilities/Increasable/increasableUtils";
import { pipe, pipe_ } from "../Utilities/pipe";
import { ReduxAction } from "./Actions";
import { addAlert } from "./AlertActions";

export interface AddAttributePointAction {
  type: ActionTypes.ADD_ATTRIBUTE_POINT
  payload: {
    id: string;
  }
}

export const addAttributePoint = (l10n: L10nRecord) => (id: string): ReduxAction =>
  (dispatch, getState) => {
    const state = getState ()
    const mhero_attributes = getAttributes (state)
    const wiki_attributes = getWikiAttributes (state)
    const mhero = getCurrentHeroPresent (state)

    const missingAPForInc =
      pipe_ (
        mhero,
        bindF (pipe (HeroModel.A.id, hero_id => getAvailableAPMap (hero_id) (state, { l10n }))),
        join,
        liftM2 (getAreSufficientAPAvailableForIncrease (getIsInCharacterCreation (state))
                                                       (bind (mhero_attributes)
                                                             (lookup (id))))
               (lookup (id) (wiki_attributes)),
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
      dispatch (addAlert ({
        title: translate (l10n) ("notenoughap"),
        message: translateP (l10n) ("notenoughap.text") (List (fromJust (missingAPForInc))),
      }))
    }
  }

export interface RemoveAttributePointAction {
  type: ActionTypes.REMOVE_ATTRIBUTE_POINT
  payload: {
    id: string;
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

export const addLifePoint = (l10n: L10nRecord): ReduxAction => (dispatch, getState) => {
  const state = getState ()
  const mhero = getCurrentHeroPresent (state)

  const missingAP =
    pipe_ (
      mhero,
      bindF (pipe (HeroModel.A.id, hero_id => getAvailableAPMap (hero_id) (state, { l10n }))),
      join,
      liftM2 (pipe (
               // get AP for added points
               getIncreaseAP (4),

               // AP are passed to result and result finally gets the available AP
               getMissingAP (getIsInCharacterCreation (state))))
             (getAddedLifePoints (state)),
      join
    )

  if (isNothing (missingAP)) {
    dispatch<AddLifePointAction> ({
      type: ActionTypes.ADD_LIFE_POINT,
    })
  }
  else {
    dispatch (addAlert ({
      title: translate (l10n) ("notenoughap"),
      message: translateP (l10n) ("notenoughap.text") (List (fromJust (missingAP))),
    }))
  }
}

export interface AddArcaneEnergyPointAction {
  type: ActionTypes.ADD_ARCANE_ENERGY_POINT
}

export const addArcaneEnergyPoint = (l10n: L10nRecord): ReduxAction =>
  (dispatch, getState) => {
    const state = getState ()
    const mhero = getCurrentHeroPresent (state)

    const missingAP =
      pipe_ (
        mhero,
        bindF (pipe (HeroModel.A.id, hero_id => getAvailableAPMap (hero_id) (state, { l10n }))),
        join,
        liftM2 (pipe (
                 // get AP for added points
                 getIncreaseAP (4),

                 // AP are passed to result and result finally gets the available AP
                 getMissingAP (getIsInCharacterCreation (state))))
               (getAddedArcaneEnergyPoints (state)),
        join
      )

    if (isNothing (missingAP)) {
      dispatch<AddArcaneEnergyPointAction> ({
        type: ActionTypes.ADD_ARCANE_ENERGY_POINT,
      })
    }
    else {
      dispatch (addAlert ({
        title: translate (l10n) ("notenoughap"),
        message: translateP (l10n) ("notenoughap.text") (List (fromJust (missingAP))),
      }))
    }
  }

export interface AddKarmaPointAction {
  type: ActionTypes.ADD_KARMA_POINT
}

export const addKarmaPoint = (l10n: L10nRecord): ReduxAction => (dispatch, getState) => {
  const state = getState ()
  const mhero = getCurrentHeroPresent (state)

  const missingAP =
    pipe_ (
      mhero,
      bindF (pipe (HeroModel.A.id, hero_id => getAvailableAPMap (hero_id) (state, { l10n }))),
      join,
      liftM2 (pipe (
               // get AP for added points
               getIncreaseAP (4),

               // AP are passed to result and result finally gets the available AP
               getMissingAP (getIsInCharacterCreation (state))))
             (getAddedKarmaPoints (state)),
      join
    )

  if (isNothing (missingAP)) {
    dispatch<AddKarmaPointAction> ({
      type: ActionTypes.ADD_KARMA_POINT,
    })
  }
  else {
    dispatch (addAlert ({
      title: translate (l10n) ("notenoughap"),
      message: translateP (l10n) ("notenoughap.text") (List (fromJust (missingAP))),
    }))
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

export const removeArcaneEnergyPoint = (): RemoveArcaneEnergyPointAction =>  ({
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

export const addBoughtBackAEPoint = (l10n: L10nRecord): ReduxAction =>
  (dispatch, getState) => {
    const state = getState ()
    const mhero = getCurrentHeroPresent (state)

    const missingAP =
      pipe_ (
        mhero,
        bindF (pipe (HeroModel.A.id, hero_id => getAvailableAPMap (hero_id) (state, { l10n }))),
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
      dispatch (addAlert ({
        title: translate (l10n) ("notenoughap"),
        message: translateP (l10n) ("notenoughap.text") (List (fromJust (missingAP))),
      }))
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
    value: number;
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
    value: number;
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

export const addBoughtBackKPPoint = (l10n: L10nRecord): ReduxAction =>
  (dispatch, getState) => {
    const state = getState ()
    const mhero = getCurrentHeroPresent (state)

    const missingAP =
      pipe_ (
        mhero,
        bindF (pipe (HeroModel.A.id, hero_id => getAvailableAPMap (hero_id) (state, { l10n }))),
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
      dispatch (addAlert ({
        title: translate (l10n) ("notenoughap"),
        message: translateP (l10n) ("notenoughap.text") (List (fromJust (missingAP))),
      }))
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
    value: number;
  }
}

export const addLostKPPoints = (value: number): AddLostKPPointsAction => ({
  type: ActionTypes.ADD_LOST_KP_POINTS,
  payload: {
    value,
  },
})

export interface SetAdjustmentIdAction {
  type: ActionTypes.SET_ATTRIBUTE_ADJUSTMENT_SELECTION_ID
  payload: {
    id: string;
  }
}

export const setAdjustmentId = (id: string): SetAdjustmentIdAction => ({
  type: ActionTypes.SET_ATTRIBUTE_ADJUSTMENT_SELECTION_ID,
  payload: {
    id,
  },
})

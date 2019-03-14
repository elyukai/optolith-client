import { ActionTypes } from "../Constants/ActionTypes";
import { L10nRecord } from "../Models/Wiki/L10n";
import { getAvailableAdventurePoints } from "../selectors/adventurePointsSelectors";
import { getIsInCharacterCreation } from "../Selectors/phaseSelectors";
import { getAddedArcaneEnergyPoints, getAddedKarmaPoints, getAddedLifePoints, getAttributes, getWikiAttributes } from "../Selectors/stateSelectors";
import { getIncreaseAP } from "../utils/adventurePoints/improvementCostUtils";
import { getAreSufficientAPAvailableForIncrease } from "../Utils/Increasable/increasableUtils";
import { AsyncAction } from "./Actions";
import { addAlert } from "./AlertActions";

export interface AddAttributePointAction {
  type: ActionTypes.ADD_ATTRIBUTE_POINT
  payload: {
    id: string;
  }
}

export const addAttributePoint = (l10n: L10nRecord) => (id: string): AsyncAction =>
  (dispatch, getState) => {
    const state = getState ()
    const maybeHeroAttributes = getAttributes (state)
    const wikiAttributes = getWikiAttributes (state)

    const areSufficientAPAvailableForIncrease = wikiAttributes.lookup (id).bind (
      wikiAttribute => getAvailableAdventurePoints (state, { locale: l10n }).fmap (
        availableAP => getAreSufficientAPAvailableForIncrease (
          wikiAttribute,
          maybeHeroAttributes.bind (attributes => attributes.lookup (id)),
          availableAP,
          getIsInCharacterCreation (state)
        )
      )
    )

    if (Maybe.elem (true) (areSufficientAPAvailableForIncrease)) {
      dispatch<AddAttributePointAction> ({
        type: ActionTypes.ADD_ATTRIBUTE_POINT,
        payload: {
          id,
        },
      })
    }
    else {
      dispatch (addAlert ({
        title: translate (l10n, "notenoughap.title"),
        message: translate (l10n, "notenoughap.content"),
      }))
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

export const addLifePoint = (locale: UIMessagesObject): AsyncAction => (dispatch, getState) => {
  const state = getState ()

  const areSufficientAPAvailable = getAvailableAdventurePoints (state, { locale })
    .fmap (
      availableAP =>
        getAreSufficientAPAvailable (getIsInCharacterCreation (state))
                                    (availableAP)
                                    (getIncreaseAP (4) (getAddedLifePoints (state)))
    )

  if (Maybe.elem (true) (areSufficientAPAvailable)) {
    dispatch<AddLifePointAction> ({
      type: ActionTypes.ADD_LIFE_POINT,
    })
  }
  else {
    dispatch (addAlert ({
      title: translate (locale, "notenoughap.title"),
      message: translate (locale, "notenoughap.content"),
    }))
  }
}

export interface AddArcaneEnergyPointAction {
  type: ActionTypes.ADD_ARCANE_ENERGY_POINT
}

export const addArcaneEnergyPoint = (locale: UIMessagesObject): AsyncAction =>
  (dispatch, getState) => {
    const state = getState ()

    const areSufficientAPAvailable = getAvailableAdventurePoints (state, { locale })
      .fmap (
        availableAP =>
          getAreSufficientAPAvailable (getIsInCharacterCreation (state))
                                      (availableAP)
                                      (getIncreaseAP (4) (getAddedArcaneEnergyPoints (state)))
      )

    if (Maybe.elem (true) (areSufficientAPAvailable)) {
      dispatch<AddArcaneEnergyPointAction> ({
        type: ActionTypes.ADD_ARCANE_ENERGY_POINT,
      })
    }
    else {
      dispatch (addAlert ({
        title: translate (locale, "notenoughap.title"),
        message: translate (locale, "notenoughap.content"),
      }))
    }
  }

export interface AddKarmaPointAction {
  type: ActionTypes.ADD_KARMA_POINT
}

export const addKarmaPoint = (locale: UIMessagesObject): AsyncAction => (dispatch, getState) => {
  const state = getState ()

  const areSufficientAPAvailable = getAvailableAdventurePoints (state, { locale })
    .fmap (
      availableAP =>
        getAreSufficientAPAvailable (getIsInCharacterCreation (state))
                                    (availableAP)
                                    (getIncreaseAP (4) (getAddedKarmaPoints (state)))
    )

  if (Maybe.elem (true) (areSufficientAPAvailable)) {
    dispatch<AddKarmaPointAction> ({
      type: ActionTypes.ADD_KARMA_POINT,
    })
  }
  else {
    dispatch (addAlert ({
      title: translate (locale, "notenoughap.title"),
      message: translate (locale, "notenoughap.content"),
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

export const addBoughtBackAEPoint = (locale: UIMessagesObject): AsyncAction =>
  (dispatch, getState) => {
    const state = getState ()

    const areSufficientAPAvailable = getAvailableAdventurePoints (state, { locale })
      .fmap (
        availableAP =>
          getAreSufficientAPAvailable (getIsInCharacterCreation (state))
                                      (availableAP)
                                      (2)
      )

    if (Maybe.elem (true) (areSufficientAPAvailable)) {
      dispatch<AddBoughtBackAEPointAction> ({
        type: ActionTypes.ADD_BOUGHT_BACK_AE_POINT,
      })
    }
    else {
      dispatch (addAlert ({
        title: translate (locale, "notenoughap.title"),
        message: translate (locale, "notenoughap.content"),
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

export const addBoughtBackKPPoint = (locale: UIMessagesObject): AsyncAction =>
  (dispatch, getState) => {
    const state = getState ()

    const areSufficientAPAvailable = getAvailableAdventurePoints (state, { locale })
      .fmap (
        availableAP =>
          getAreSufficientAPAvailable (getIsInCharacterCreation (state))
                                      (availableAP)
                                      (2)
      )

    if (Maybe.elem (true) (areSufficientAPAvailable)) {
      dispatch<AddBoughtBackKPPointAction> ({
        type: ActionTypes.ADD_BOUGHT_BACK_KP_POINT,
      })
    }
    else {
      dispatch (addAlert ({
        title: translate (locale, "notenoughap.title"),
        message: translate (locale, "notenoughap.content"),
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
  type: ActionTypes.SET_ATTRIBUTE_ADJUSTMENT_SELECTION_ID
  payload: {
    id: string
  }
}

export const setAdjustmentId = (id: string): SetAdjustmentIdAction => ({
  type: ActionTypes.SET_ATTRIBUTE_ADJUSTMENT_SELECTION_ID,
  payload: {
    id,
  },
})

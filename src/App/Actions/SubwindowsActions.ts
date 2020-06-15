import * as ActionTypes from "../Constants/ActionTypes"
import { EnergyId } from "../Constants/Ids"

export interface OpenEditPermanentEnergyAction {
  type: ActionTypes.OPEN_EDIT_PERMANENT_ENERGY
  payload: {
    energy: EnergyId
  }
}

export const openEditPermanentEnergy =
  (energy: EnergyId): OpenEditPermanentEnergyAction => ({
    type: ActionTypes.OPEN_EDIT_PERMANENT_ENERGY,
    payload: {
      energy,
    },
  })

export interface CloseEditPermanentEnergyAction {
  type: ActionTypes.CLOSE_EDIT_PERMANENT_ENERGY
}

export const closeEditPermanentEnergy = (): CloseEditPermanentEnergyAction => ({
  type: ActionTypes.CLOSE_EDIT_PERMANENT_ENERGY,
})

export interface OpenAddPermanentEnergyLossAction {
  type: ActionTypes.OPEN_ADD_PERMANENT_ENERGY_LOSS
  payload: {
    energy: EnergyId
  }
}

export const openAddPermanentEnergyLoss =
  (energy: EnergyId): OpenAddPermanentEnergyLossAction => ({
    type: ActionTypes.OPEN_ADD_PERMANENT_ENERGY_LOSS,
    payload: {
      energy,
    },
  })

export interface CloseAddPermanentEnergyLossAction {
  type: ActionTypes.CLOSE_ADD_PERMANENT_ENERGY_LOSS
}

export const closeAddPermanentEnergyLoss = (): CloseAddPermanentEnergyLossAction => ({
  type: ActionTypes.CLOSE_ADD_PERMANENT_ENERGY_LOSS,
})

export interface OpenCharacterCreatorAction {
  type: ActionTypes.OPEN_CHARACTER_CREATOR
}

export const openCharacterCreator = (): OpenCharacterCreatorAction => ({
  type: ActionTypes.OPEN_CHARACTER_CREATOR,
})

export interface CloseCharacterCreatorAction {
  type: ActionTypes.CLOSE_CHARACTER_CREATOR
}

export const closeCharacterCreator = (): CloseCharacterCreatorAction => ({
  type: ActionTypes.CLOSE_CHARACTER_CREATOR,
})

export interface OpenSettingsAction {
  type: ActionTypes.OPEN_SETTINGS
}

export const openSettings = (): OpenSettingsAction => ({
  type: ActionTypes.OPEN_SETTINGS,
})

export interface CloseSettingsAction {
  type: ActionTypes.CLOSE_SETTINGS
}

export const closeSettings = (): CloseSettingsAction => ({
  type: ActionTypes.CLOSE_SETTINGS,
})

export interface OpenAddAdventurePointsAction {
  type: ActionTypes.OPEN_ADD_ADVENTURE_POINTS
}

export const openAddAdventurePoints = (): OpenAddAdventurePointsAction => ({
  type: ActionTypes.OPEN_ADD_ADVENTURE_POINTS,
})

export interface CloseAddAdventurePointsAction {
  type: ActionTypes.CLOSE_ADD_ADVENTURE_POINTS
}

export const closeAddAdventurePoints = (): CloseAddAdventurePointsAction => ({
  type: ActionTypes.CLOSE_ADD_ADVENTURE_POINTS,
})

export interface OpenEditCharacterAvatarAction {
  type: ActionTypes.OPEN_EDIT_CHARACTER_AVATAR
}

export const openEditCharacterAvatar = (): OpenEditCharacterAvatarAction => ({
  type: ActionTypes.OPEN_EDIT_CHARACTER_AVATAR,
})

export interface CloseEditCharacterAvatarAction {
  type: ActionTypes.CLOSE_EDIT_CHARACTER_AVATAR
}

export const closeEditCharacterAvatar = (): CloseEditCharacterAvatarAction => ({
  type: ActionTypes.CLOSE_EDIT_CHARACTER_AVATAR,
})

export interface OpenEditPetAvatarAction {
  type: ActionTypes.OPEN_EDIT_PET_AVATAR
}

export const openEditPetAvatar = (): OpenEditPetAvatarAction => ({
  type: ActionTypes.OPEN_EDIT_PET_AVATAR,
})

export interface CloseEditPetAvatarAction {
  type: ActionTypes.CLOSE_EDIT_PET_AVATAR
}

export const closeEditPetAvatar = (): CloseEditPetAvatarAction => ({
  type: ActionTypes.CLOSE_EDIT_PET_AVATAR,
})

export interface OpenAddRemoveMoneyAction {
  type: ActionTypes.OPEN_ADD_REMOVE_MONEY
}

export const openAddRemoveMoney = (): OpenAddRemoveMoneyAction => ({
  type: ActionTypes.OPEN_ADD_REMOVE_MONEY,
})

export interface CloseAddRemoveMoneyAction {
  type: ActionTypes.CLOSE_ADD_REMOVE_MONEY
}

export const closeAddRemoveMoney = (): CloseAddRemoveMoneyAction => ({
  type: ActionTypes.CLOSE_ADD_REMOVE_MONEY,
})

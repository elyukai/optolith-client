import { cnst, ident } from "../../Data/Function"
import { set } from "../../Data/Lens"
import { Just, Maybe, Nothing } from "../../Data/Maybe"
import { Record } from "../../Data/Record"
import { SetTabAction } from "../Actions/LocationActions"
import * as SubwindowsActions from "../Actions/SubwindowsActions"
import { SetUpdateDownloadProgressAction } from "../Actions/UpdateActions"
import * as ActionTypes from "../Constants/ActionTypes"
import { SubWindowsState, SubWindowsStateL } from "../Models/SubWindowsState"

type Action = SetTabAction
            | SetUpdateDownloadProgressAction
            | SubwindowsActions.OpenAddPermanentEnergyLossAction
            | SubwindowsActions.OpenCharacterCreatorAction
            | SubwindowsActions.OpenEditPermanentEnergyAction
            | SubwindowsActions.CloseAddPermanentEnergyLossAction
            | SubwindowsActions.CloseCharacterCreatorAction
            | SubwindowsActions.CloseEditPermanentEnergyAction
            | SubwindowsActions.OpenAddAdventurePointsAction
            | SubwindowsActions.OpenSettingsAction
            | SubwindowsActions.CloseAddAdventurePointsAction
            | SubwindowsActions.CloseSettingsAction
            | SubwindowsActions.OpenEditCharacterAvatarAction
            | SubwindowsActions.OpenEditPetAvatarAction
            | SubwindowsActions.CloseEditCharacterAvatarAction
            | SubwindowsActions.CloseEditPetAvatarAction
            | SubwindowsActions.OpenAddRemoveMoneyAction
            | SubwindowsActions.CloseAddRemoveMoneyAction

export const subwindowsReducer =
  (action: Action): ident<Record<SubWindowsState>> => {
    switch (action.type) {
      case ActionTypes.SET_TAB:
        return cnst (SubWindowsState.default)

      case ActionTypes.OPEN_EDIT_PERMANENT_ENERGY:
        return set (SubWindowsStateL.editPermanentEnergy)
                   (Just (action.payload.energy))

      case ActionTypes.CLOSE_EDIT_PERMANENT_ENERGY:
        return set (SubWindowsStateL.editPermanentEnergy)
                   (Nothing)

      case ActionTypes.OPEN_ADD_PERMANENT_ENERGY_LOSS:
        return set (SubWindowsStateL.addPermanentEnergy)
                   (Just (action.payload.energy))

      case ActionTypes.CLOSE_ADD_PERMANENT_ENERGY_LOSS:
        return set (SubWindowsStateL.addPermanentEnergy)
                   (Nothing)

      case ActionTypes.OPEN_CHARACTER_CREATOR:
        return set (SubWindowsStateL.isCharacterCreatorOpen)
                   (true)

      case ActionTypes.CLOSE_CHARACTER_CREATOR:
        return set (SubWindowsStateL.isCharacterCreatorOpen)
                   (false)

      case ActionTypes.OPEN_ADD_ADVENTURE_POINTS:
        return set (SubWindowsStateL.isAddAdventurePointsOpen)
                   (true)

      case ActionTypes.CLOSE_ADD_ADVENTURE_POINTS:
        return set (SubWindowsStateL.isAddAdventurePointsOpen)
                   (false)

      case ActionTypes.OPEN_SETTINGS:
        return set (SubWindowsStateL.isSettingsOpen)
                   (true)

      case ActionTypes.CLOSE_SETTINGS:
        return set (SubWindowsStateL.isSettingsOpen)
                   (false)

      case ActionTypes.OPEN_EDIT_CHARACTER_AVATAR:
        return set (SubWindowsStateL.isEditCharacterAvatarOpen)
                   (true)

      case ActionTypes.CLOSE_EDIT_CHARACTER_AVATAR:
        return set (SubWindowsStateL.isEditCharacterAvatarOpen)
                   (false)

      case ActionTypes.OPEN_EDIT_PET_AVATAR:
        return set (SubWindowsStateL.isEditPetAvatarOpen)
                   (true)

      case ActionTypes.CLOSE_EDIT_PET_AVATAR:
        return set (SubWindowsStateL.isEditPetAvatarOpen)
                   (false)

      case ActionTypes.SET_UPDATE_DOWNLOAD_PROGRESS:
        return set (SubWindowsStateL.updateDownloadProgress)
                   (Maybe (action.payload))

      case ActionTypes.OPEN_ADD_REMOVE_MONEY:
        return set (SubWindowsStateL.isAddRemoveMoneyOpen)
                   (true)

      case ActionTypes.CLOSE_ADD_REMOVE_MONEY:
        return set (SubWindowsStateL.isAddRemoveMoneyOpen)
                   (false)

      default:
        return ident
    }
  }

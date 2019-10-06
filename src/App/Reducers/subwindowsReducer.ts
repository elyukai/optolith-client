// tslint:disable-next-line:no-implicit-dependencies
import { ProgressInfo } from "builder-util-runtime";
import { cnst, ident } from "../../Data/Function";
import { set } from "../../Data/Lens";
import { Just, Maybe, Nothing } from "../../Data/Maybe";
import { fromDefault, makeLenses, Record } from "../../Data/Record";
import { SetUpdateDownloadProgressAction } from "../Actions/IOActions";
import { SetTabAction } from "../Actions/LocationActions";
import * as SubwindowsActions from "../Actions/SubwindowsActions";
import { ActionTypes } from "../Constants/ActionTypes";
import { EnergyId } from "../Constants/Ids";

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

export interface SubWindowsState {
  "@@name": "SubWindowsState"
  editPermanentEnergy: Maybe<EnergyId>
  addPermanentEnergy: Maybe<EnergyId>
  updateDownloadProgress: Maybe<ProgressInfo>
  isCharacterCreatorOpen: boolean
  isAddAdventurePointsOpen: boolean
  isSettingsOpen: boolean
  isEditCharacterAvatarOpen: boolean
  isEditPetAvatarOpen: boolean
}

export const SubWindowsState =
  fromDefault ("SubWindowsState")
              <SubWindowsState> ({
                editPermanentEnergy: Nothing,
                addPermanentEnergy: Nothing,
                updateDownloadProgress: Nothing,
                isCharacterCreatorOpen: false,
                isAddAdventurePointsOpen: false,
                isSettingsOpen: false,
                isEditCharacterAvatarOpen: false,
                isEditPetAvatarOpen: false,
              })

const SubWindowsStateL = makeLenses (SubWindowsState)

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
        return set (SubWindowsStateL.editPermanentEnergy)
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

      default:
        return ident
    }
  }

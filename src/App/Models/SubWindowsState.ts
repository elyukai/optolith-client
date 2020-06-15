import { ProgressInfo } from "builder-util-runtime"
import { Maybe, Nothing } from "../../Data/Maybe"
import { fromDefault, makeLenses } from "../../Data/Record"
import { EnergyId } from "../Constants/Ids"

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
  isAddRemoveMoneyOpen: boolean
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
                isAddRemoveMoneyOpen: false,
              })

export const SubWindowsStateL = makeLenses (SubWindowsState)

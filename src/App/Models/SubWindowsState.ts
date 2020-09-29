import { ProgressInfo } from "builder-util-runtime"
import { Maybe } from "../../Data/Maybe"
import { EnergyId } from "../Constants/Ids"

export interface SubWindowsState {
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

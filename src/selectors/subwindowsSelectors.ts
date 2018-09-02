import { createMaybeSelector } from '../utils/createMaybeSelector';
import { getAddPermanentEnergy, getArmorZonesEditorInstance, getCurrentAlert, getEditPermanentEnergy, getIsAddAdventurePointsOpen, getIsCharacterCreatorOpen, getIsEditCharacterAvatarOpen, getIsEditPetAvatarOpen, getIsSettingsOpen, getItemEditorInstance, getUpdateDownloadProgress } from './stateSelectors';

export const isDialogOpen = createMaybeSelector (
  getCurrentAlert,
  getUpdateDownloadProgress,
  getAddPermanentEnergy,
  getEditPermanentEnergy,
  getIsAddAdventurePointsOpen,
  getIsCharacterCreatorOpen,
  getIsSettingsOpen,
  getIsEditCharacterAvatarOpen,
  getIsEditPetAvatarOpen,
  getItemEditorInstance,
  getArmorZonesEditorInstance,
  (
    alert,
    updateDownloadProgress,
    addPermanentEnergy,
    editPermanentEnergy,
    isAddAdventurePointsOpen,
    isCharacterCreatorOpen,
    isSettingsOpen,
    isEditCharacterAvatarOpen,
    isEditPetAvatarOpen,
    itemEditorInstance,
    armorZonesEditorInstance
  ) => {
    return typeof alert === 'object'
      || typeof updateDownloadProgress === 'object'
      || typeof addPermanentEnergy === 'string'
      || typeof editPermanentEnergy === 'string'
      || typeof itemEditorInstance === 'object'
      || typeof armorZonesEditorInstance === 'object'
      || isAddAdventurePointsOpen
      || isCharacterCreatorOpen
      || isSettingsOpen
      || isEditCharacterAvatarOpen
      || isEditPetAvatarOpen;
  }
);

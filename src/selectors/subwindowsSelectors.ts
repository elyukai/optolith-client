import { createSelector } from 'reselect';
import { getAddPermanentEnergy, getArmorZonesEditorInstance, getCurrentAlert, getEditPermanentEnergy, getItemEditorInstance, getUpdateDownloadProgress, isAddAdventurePointsOpen, isCharacterCreatorOpen, isEditCharacterAvatarOpen, isEditPetAvatarOpen,
	isSettingsOpen } from './stateSelectors';

export const isDialogOpen = createSelector(
	getCurrentAlert,
	getUpdateDownloadProgress,
	getAddPermanentEnergy,
	getEditPermanentEnergy,
	isAddAdventurePointsOpen,
	isCharacterCreatorOpen,
	isSettingsOpen,
	isEditCharacterAvatarOpen,
	isEditPetAvatarOpen,
	getItemEditorInstance,
	getArmorZonesEditorInstance,
	(alert, updateDownloadProgress, addPermanentEnergy, editPermanentEnergy, isAddAdventurePointsOpen, isCharacterCreatorOpen, isSettingsOpen, isEditCharacterAvatarOpen, isEditPetAvatarOpen, itemEditorInstance, armorZonesEditorInstance) => {
		return typeof alert === 'object' || typeof updateDownloadProgress === 'object' || typeof addPermanentEnergy === 'string' || typeof editPermanentEnergy === 'string' || typeof itemEditorInstance === 'object' || typeof armorZonesEditorInstance === 'object' || isAddAdventurePointsOpen || isCharacterCreatorOpen || isSettingsOpen || isEditCharacterAvatarOpen || isEditPetAvatarOpen;
	}
);

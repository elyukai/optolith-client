import * as ActionTypes from '../constants/ActionTypes';

export interface OpenEditPermanentEnergyAction {
	type: ActionTypes.OPEN_EDIT_PERMANENT_ENERGY;
	payload: {
		energy: 'LP' | 'AE' | 'KP';
	};
}

export function openEditPermanentEnergy(energy: 'LP' | 'AE' | 'KP'): OpenEditPermanentEnergyAction {
	return {
		type: ActionTypes.OPEN_EDIT_PERMANENT_ENERGY,
		payload: {
			energy
		}
	};
}

export interface CloseEditPermanentEnergyAction {
	type: ActionTypes.CLOSE_EDIT_PERMANENT_ENERGY;
}

export function closeEditPermanentEnergy(): CloseEditPermanentEnergyAction {
	return {
		type: ActionTypes.CLOSE_EDIT_PERMANENT_ENERGY
	};
}

export interface OpenAddPermanentEnergyLossAction {
	type: ActionTypes.OPEN_ADD_PERMANENT_ENERGY_LOSS;
	payload: {
		energy: 'LP' | 'AE' | 'KP';
	};
}

export function openAddPermanentEnergyLoss(energy: 'LP' | 'AE' | 'KP'): OpenAddPermanentEnergyLossAction {
	return {
		type: ActionTypes.OPEN_ADD_PERMANENT_ENERGY_LOSS,
		payload: {
			energy
		}
	};
}

export interface CloseAddPermanentEnergyLossAction {
	type: ActionTypes.CLOSE_ADD_PERMANENT_ENERGY_LOSS;
}

export function closeAddPermanentEnergyLoss(): CloseAddPermanentEnergyLossAction {
	return {
		type: ActionTypes.CLOSE_ADD_PERMANENT_ENERGY_LOSS
	};
}

export interface OpenCharacterCreatorAction {
	type: ActionTypes.OPEN_CHARACTER_CREATOR;
}

export function openCharacterCreator(): OpenCharacterCreatorAction {
	return {
		type: ActionTypes.OPEN_CHARACTER_CREATOR
	};
}

export interface CloseCharacterCreatorAction {
	type: ActionTypes.CLOSE_CHARACTER_CREATOR;
}

export function closeCharacterCreator(): CloseCharacterCreatorAction {
	return {
		type: ActionTypes.CLOSE_CHARACTER_CREATOR
	};
}

export interface OpenSettingsAction {
	type: ActionTypes.OPEN_SETTINGS;
}

export function openSettings(): OpenSettingsAction {
	return {
		type: ActionTypes.OPEN_SETTINGS
	};
}

export interface CloseSettingsAction {
	type: ActionTypes.CLOSE_SETTINGS;
}

export function closeSettings(): CloseSettingsAction {
	return {
		type: ActionTypes.CLOSE_SETTINGS
	};
}

export interface OpenAddAdventurePointsAction {
	type: ActionTypes.OPEN_ADD_ADVENTURE_POINTS;
}

export function openAddAdventurePoints(): OpenAddAdventurePointsAction {
	return {
		type: ActionTypes.OPEN_ADD_ADVENTURE_POINTS
	};
}

export interface CloseAddAdventurePointsAction {
	type: ActionTypes.CLOSE_ADD_ADVENTURE_POINTS;
}

export function closeAddAdventurePoints(): CloseAddAdventurePointsAction {
	return {
		type: ActionTypes.CLOSE_ADD_ADVENTURE_POINTS
	};
}

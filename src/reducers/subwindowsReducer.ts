import { ProgressInfo } from 'builder-util-runtime';
import { SetUpdateDownloadProgressAction } from '../actions/IOActions';
import { SetTabAction } from '../actions/LocationActions';
import { CloseAddAdventurePointsAction, CloseAddPermanentEnergyLossAction, CloseCharacterCreatorAction, CloseEditPermanentEnergyAction, CloseSettingsAction, OpenAddAdventurePointsAction, OpenAddPermanentEnergyLossAction, OpenCharacterCreatorAction, OpenEditPermanentEnergyAction, OpenSettingsAction } from '../actions/SubwindowsActions';
import * as ActionTypes from '../constants/ActionTypes';

type Action = SetTabAction | SetUpdateDownloadProgressAction | OpenAddPermanentEnergyLossAction | OpenCharacterCreatorAction | OpenEditPermanentEnergyAction | CloseAddPermanentEnergyLossAction | CloseCharacterCreatorAction | CloseEditPermanentEnergyAction | OpenAddAdventurePointsAction | OpenSettingsAction | CloseAddAdventurePointsAction | CloseSettingsAction;

export interface SubWindowsState {
	editPermanentEnergy?: 'LP' | 'AE' | 'KP';
	addPermanentEnergy?: 'AE' | 'KP';
	updateDownloadProgress?: ProgressInfo;
	isCharacterCreatorOpen: boolean;
	isAddAdventurePointsOpen: boolean;
	isSettingsOpen: boolean;
}

const initialState: SubWindowsState = {
	isCharacterCreatorOpen: false,
	isAddAdventurePointsOpen: false,
	isSettingsOpen: false
};

export function subwindows(state: SubWindowsState = initialState, action: Action): SubWindowsState {
	switch (action.type) {
		case ActionTypes.SET_TAB:
			return initialState;

		case ActionTypes.OPEN_EDIT_PERMANENT_ENERGY:
			return {
				...state,
				editPermanentEnergy: action.payload.energy
			};

		case ActionTypes.CLOSE_EDIT_PERMANENT_ENERGY:
			return {
				...state,
				editPermanentEnergy: undefined
			};

		case ActionTypes.OPEN_ADD_PERMANENT_ENERGY_LOSS:
			return {
				...state,
				editPermanentEnergy: action.payload.energy
			};

		case ActionTypes.CLOSE_ADD_PERMANENT_ENERGY_LOSS:
			return {
				...state,
				editPermanentEnergy: undefined
			};

		case ActionTypes.OPEN_CHARACTER_CREATOR:
			return {
				...state,
				isCharacterCreatorOpen: true
			};

		case ActionTypes.CLOSE_CHARACTER_CREATOR:
			return {
				...state,
				isCharacterCreatorOpen: false
			};

		case ActionTypes.OPEN_ADD_ADVENTURE_POINTS:
			return {
				...state,
				isAddAdventurePointsOpen: true
			};

		case ActionTypes.CLOSE_ADD_ADVENTURE_POINTS:
			return {
				...state,
				isAddAdventurePointsOpen: false
			};

		case ActionTypes.OPEN_SETTINGS:
			return {
				...state,
				isSettingsOpen: true
			};

		case ActionTypes.CLOSE_SETTINGS:
			return {
				...state,
				isSettingsOpen: false
			};

		case ActionTypes.SET_UPDATE_DOWNLOAD_PROGRESS:
			return {
				...state,
				updateDownloadProgress: action.payload
			};

		default:
			return state;
	}
}

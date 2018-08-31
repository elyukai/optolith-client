import { remote } from 'electron';
import { getIsHeroSection } from '../selectors/uilocationSelectors';
import { AsyncAction } from '../types/actions';
import { isDialogOpen } from '../utils/SubwindowsUtils';
import { _saveHero } from './HerolistActions';
import { redo, undo } from './HistoryActions';
import { requestClose } from './IOActions';
import { _setTab } from './LocationActions';
import { openSettings } from './SubwindowsActions';

export function undoAccelerator(): AsyncAction {
	return (dispatch, getState) => {
		if (!isDialogOpen() && getIsHeroSection(getState())) {
			dispatch(undo());
		}
	};
}

export function redoAccelerator(): AsyncAction {
	return (dispatch, getState) => {
		if (!isDialogOpen() && getIsHeroSection(getState())) {
			dispatch(redo());
		}
	};
}

export function saveHeroAccelerator(): AsyncAction {
	return (dispatch, getState) => {
		if (!isDialogOpen() && getIsHeroSection(getState())) {
			dispatch(_saveHero());
		}
	};
}

export function backAccelerator(): AsyncAction {
	return (dispatch, getState) => {
		if (!isDialogOpen() && getIsHeroSection(getState())) {
			dispatch(_setTab('herolist'));
		}
	};
}

export function openSettingsAccelerator(): AsyncAction {
	return dispatch => {
		if (!isDialogOpen()) {
			dispatch(openSettings());
		}
	};
}

export function quitAccelerator(): AsyncAction {
	return dispatch => {
		dispatch(requestClose(() => remote.app.quit()));
	};
}

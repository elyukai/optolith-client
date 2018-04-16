import { remote } from 'electron';
import { isHeroSection } from '../selectors/uilocationSelectors';
import { AsyncAction } from '../types/actions';
import { isDialogOpen } from '../utils/SubwindowsUtils';
import { _saveHero } from './HerolistActions';
import { redo, undo } from './HistoryActions';
import { _setTab } from './LocationActions';
import { openSettings } from './SubwindowsActions';
import { requestClose } from './IOActions';

export function undoAccelerator(): AsyncAction {
	return (dispatch, getState) => {
		if (!isDialogOpen() && isHeroSection(getState())) {
			dispatch(undo());
		}
	};
}

export function redoAccelerator(): AsyncAction {
	return (dispatch, getState) => {
		if (!isDialogOpen() && isHeroSection(getState())) {
			dispatch(redo());
		}
	};
}

export function saveHeroAccelerator(): AsyncAction {
	return (dispatch, getState) => {
		if (!isDialogOpen() && isHeroSection(getState())) {
			dispatch(_saveHero());
		}
	};
}

export function backAccelerator(): AsyncAction {
	return (dispatch, getState) => {
		if (!isDialogOpen() && isHeroSection(getState())) {
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

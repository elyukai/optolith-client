import { ipcRenderer, remote } from 'electron';
import { connect } from 'react-redux';
import { Action, Dispatch } from 'redux';
import * as IOActions from '../actions/IOActions';
import { _setTab } from '../actions/LocationActions';
import { AppState } from '../reducers/app';
import { getMessages } from '../selectors/localeSelectors';
import { getCurrentTab } from '../selectors/stateSelectors';
import { areAnimationsEnabled, getTheme } from '../selectors/uisettingsSelectors';
import { TabId } from '../utils/LocationUtils';
import { App, AppDispatchProps, AppOwnProps, AppStateProps } from '../views/App';

function mapStateToProps(state: AppState) {
	return {
		currentTab: getCurrentTab(state),
		locale: getMessages(state),
		theme: getTheme(state),
		areAnimationsEnabled: areAnimationsEnabled(state),
		platform: remote.process.platform
	};
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
	return {
		minimize() {
			remote.getCurrentWindow().minimize();
		},
		maximize() {
			remote.getCurrentWindow().maximize();
		},
		restore() {
			remote.getCurrentWindow().unmaximize();
		},
		close() {
			dispatch(IOActions.requestClose());
		},
		enterFullscreen() {
			remote.getCurrentWindow().setFullScreen(true);
		},
		leaveFullscreen() {
			remote.getCurrentWindow().setFullScreen(false);
		},
		setTab(id: TabId) {
			dispatch(_setTab(id));
		},
		checkForUpdates() {
			ipcRenderer.send('check-for-updates');
		},
	};
}

export const AppContainer = connect<AppStateProps, AppDispatchProps, AppOwnProps>(mapStateToProps, mapDispatchToProps)(App);

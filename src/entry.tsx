declare global {
	interface Event {
		charCode: number;
	}

	interface EventTarget {
		readonly value: string;
		readonly files: FileList | null;
		readonly result: string;
	}
}

import { ProgressInfo } from 'builder-util-runtime';
import { ipcRenderer, remote } from 'electron';
import { UpdateInfo } from 'electron-updater';
import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';
import { addAlert, addErrorAlert } from './actions/AlertActions';
import { requestClose, requestInitialData, setUpdateDownloadProgress, updateAvailable } from './actions/IOActions';
import { showAbout } from './actions/LocationActions';
import { AppContainer } from './containers/App';
import { app, AppState } from './reducers/app';
import { getLocaleMessages } from './selectors/stateSelectors';
import { _translate } from './utils/I18n';

const store = createStore<AppState>(app, applyMiddleware(ReduxThunk));

store.dispatch(requestInitialData()).then(() => {
	if (remote.process.platform === 'darwin') {
		const { dispatch, getState } = store;
		const locale = getLocaleMessages(getState())!;
		const menu = remote.Menu.buildFromTemplate([
			{
				label: remote.app.getName(),
				submenu: [
					{
						label: _translate(locale, 'mac.aboutapp', remote.app.getName()),
						click: () => dispatch(showAbout())
					},
					{type: 'separator'},
					{role: 'hide'},
					{role: 'hideothers'},
					{role: 'unhide'},
					{type: 'separator'},
					{
						label: _translate(locale, 'mac.quit'),
						click: () => dispatch(requestClose())
					}
				]
			},
			{
				label: _translate(locale, 'edit'),
				submenu: [
					{role: 'cut'},
					{role: 'copy'},
					{role: 'paste'},
					{role: 'delete'},
					{role: 'selectall'}
				]
			},
			{
				label: _translate(locale, 'view'),
				submenu: [
					{role: 'togglefullscreen'}
				]
			},
			{
				role: 'window',
				submenu: [
					{role: 'minimize'},
					{type: 'separator'},
					{role: 'front'}
				]
			}
		]);
		remote.Menu.setApplicationMenu(menu);
	}
});

render(
	<Provider store={store}>
		<AppContainer />
	</Provider>,
	document.querySelector('#bodywrapper')
);

ipcRenderer.addListener('update-available', (_event: Event, info: UpdateInfo) => {
	store.dispatch(updateAvailable(info));
});

ipcRenderer.addListener('download-progress', (_event: Event, progressObj: ProgressInfo) => {
	store.dispatch(setUpdateDownloadProgress(progressObj));
});

ipcRenderer.addListener('auto-updater-error', (_event: Event, err: Error) => {
	store.dispatch(setUpdateDownloadProgress());
	store.dispatch((dispatch, getState) => dispatch(addErrorAlert({
		title: 'Auto Update Error',
		message: `An error occured during auto-update. (${JSON.stringify(err)})`
	}, getLocaleMessages(getState())!)));
});

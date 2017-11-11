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

import { ipcRenderer } from 'electron';
import { UpdateInfo } from 'electron-updater';
import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';
import { addAlert } from './actions/AlertActions';
import { requestInitialData, setUpdateDownloadProgress, updateAvailable } from './actions/IOActions';
import { AppContainer } from './containers/App';
import { ProgressInfo } from './main';
import { app } from './reducers/app';

const store = createStore(app, applyMiddleware(ReduxThunk));

store.dispatch(requestInitialData());

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
	store.dispatch(setUpdateDownloadProgress({ percent: undefined }));
	store.dispatch(addAlert({
		title: 'Auto Update Error',
		message: `An error occured during auto-update. (${JSON.stringify(err)})`
	}));
});

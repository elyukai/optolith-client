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
import { requestInitialData, updateAvailable } from './actions/IOActions';
import { AppContainer } from './containers/App';
import { app } from './reducers/app';

const store = createStore(app, applyMiddleware(ReduxThunk));

store.dispatch(requestInitialData());

render(
	<Provider store={store}>
		<AppContainer />
	</Provider>,
	document.querySelector('#bodywrapper')
);

ipcRenderer.on('update-available', (info: UpdateInfo) => {
	store.dispatch(updateAvailable(info));
});

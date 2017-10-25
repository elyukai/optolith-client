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

import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';
import { requestInitialData } from './actions/FileActions';
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

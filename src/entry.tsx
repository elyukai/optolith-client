declare global {
	interface Event {
		charCode: number;
	}

	interface EventTarget {
		readonly value: string | number;
		readonly files: FileList | null;
		readonly result: string;
	}
}

import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { requestInitialData } from './actions/FileActions';
import { AppContainer } from './containers/App';
import { store } from './stores/AppStore';

store.dispatch(requestInitialData());

render(
	<Provider store={store}>
		<AppContainer />
	</Provider>,
	document.querySelector('#bodywrapper')
);

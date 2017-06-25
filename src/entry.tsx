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
import { store } from './stores/AppStore';
import { loadInitialData } from './utils/FileAPIUtils';
import { Router } from './views/Router';

render(
	<Provider store={store}>
		<Router />
	</Provider>,
	document.querySelector('#bodywrapper')
);

loadInitialData();

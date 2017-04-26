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
import './main.scss';
import { loadInitialData } from './utils/FileAPIUtils';
import { Router } from './views/Router';

render( <Router />, document.querySelector('#bodywrapper') );

loadInitialData();

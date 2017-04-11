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

import { remote } from 'electron';
import * as React from 'react';
import { render } from 'react-dom';
import AppDispatcher from './dispatcher/AppDispatcher';
import './main.scss';
import { loadInitialData } from './utils/FileAPIUtils';
import { getAllData } from './utils/WebAPIUtils';
import Router from './views/Router';

render( <Router />, document.querySelector('#bodywrapper') );

loadInitialData();

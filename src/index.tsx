import { render } from 'react-dom';
import * as React from 'react';
import AppDispatcher from './dispatcher/AppDispatcher';
import Router from './views/Router';
import WebAPIUtils from './utils/WebAPIUtils';

window.onunload = function() {
	// WebAPIUtils.logoutSync();
	AppDispatcher.dispatch({
		actionType: 'LOGOUT_SUCCESS'
	});
};

render( <Router />, document.querySelector('#bodywrapper') );

WebAPIUtils.getAllData();

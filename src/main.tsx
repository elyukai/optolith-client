import { render } from 'react-dom';
import * as React from 'react';
import AppDispatcher from './dispatcher/AppDispatcher';
import Router from './views/Router';
import WebAPIUtils from './utils/WebAPIUtils';
import './main.scss';
import RStore from './stores/RStore';

window.onunload = function() {
	// WebAPIUtils.logoutSync();
	AppDispatcher.dispatch({
		type: 'LOGOUT_SUCCESS'
	});
};

render( <Router />, document.querySelector('#bodywrapper') );

console.log(RStore.getState());

WebAPIUtils.getAllData();

import AppDispatcher from './dispatcher/AppDispatcher';
import React from 'react';
import ReactDOM from 'react-dom';
import Router from './views/Router';
import WebAPIUtils from './utils/WebAPIUtils';
import './Main.scss';

// if (localStorage['lastUrl'] !== '') {
// 	setTimeout(function() {
// 		AppDispatcher.dispatch({
// 			actionType: ActionTypes.LOAD_RAW_INGAME_DATA
// 		});
// 	}, 0);
// }

window.onunload = function() {
	// WebAPIUtils.logoutSync();
	AppDispatcher.dispatch({
		actionType: 'LOGOUT_SUCCESS'
	});
};

ReactDOM.render( <Router />, document.getElementById('bodywrapper') );

WebAPIUtils.getAllData();

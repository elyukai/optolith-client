import AppController from './components/AppController';
import AppDispatcher from './dispatcher/AppDispatcher';
import React from 'react';
import ReactDOM from 'react-dom';
import WebAPIUtils from './utils/WebAPIUtils';

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

ReactDOM.render( <AppController />, document.getElementById('bodywrapper') );

WebAPIUtils.getAllData();

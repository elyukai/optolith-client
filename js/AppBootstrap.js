import AccountActions from './actions/AccountActions';
import AppController from './components/AppController';
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
	AccountActions.logout('end');
};

ReactDOM.render( <AppController />, document.getElementById('bodywrapper') );

WebAPIUtils.getAllData();

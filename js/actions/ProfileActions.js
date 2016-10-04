import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import createDialogNode from '../utils/createDialogNode';
import React from 'react';
import ReactDOM from 'react-dom';
import Selections from '../components/content/rcp/Selections';

var ProfileActions = {
	changeName: function(name) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.UPDATE_HERO_NAME,
			name
		});
	}
};

export default ProfileActions;

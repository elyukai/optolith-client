import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import createOverlay from '../utils/createOverlay';
import ItemEditor from '../views/items/ItemEditor';
import React from 'react';

export default {
	filter: function(text) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.FILTER_ITEMS,
			text
		});
	},
	sort: function(option) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.SORT_ITEMS,
			option
		});
	},
	showItemCreation: function() {
		createOverlay(<ItemEditor create />);
	},
	showItemEditor: function(item) {
		createOverlay(<ItemEditor item={item} />);
	}
};

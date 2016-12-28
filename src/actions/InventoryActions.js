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
	},
	addToList: function(item) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.ADD_ITEM,
			item
		});
	},
	saveItem: function(item) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.SAVE_ITEM,
			item
		});
	},
	removeFromList: function(id) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.REMOVE_ITEM,
			id
		});
	}
};

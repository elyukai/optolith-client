import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import createOverlay from '../utils/createOverlay';
import HeroCreation from '../components/content/herolist/HeroCreation';
import React from 'react';
import reactAlert from '../utils/reactAlert';
import ReactDOM from 'react-dom';
import WebAPIUtils from '../utils/WebAPIUtils';

var HerolistActions = {
	refresh: function() {
		WebAPIUtils.getHeroes();
	},
	filter: function(text) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.FILTER_HEROLIST,
			text
		});
	},
	sort: function(option) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.SORT_HEROLIST,
			option
		});
	},
	load: function(id) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.CLEAR_HERO
		});
		WebAPIUtils.loadHero(id);
	},
	showHeroCreation: function() {
		createOverlay(<HeroCreation />);
	},
	createNewHero: function(options) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.CREATE_NEW_HERO,
			...options
		});
	}
};

export default HerolistActions;

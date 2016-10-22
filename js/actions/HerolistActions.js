import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import createOverlay from '../utils/createOverlay';
import ELStore from '../stores/ELStore';
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
		if (ELStore.getStartID() !== 'EL_0') {
			reactAlert(
				'Nicht gespeicherter Held',
				'Du hast offenbar bereits einen Helden geöffnet, der noch nicht vollständig gespeichert wurde. Möchtest du trotzdem fortfahren oder vorher den anderen Helden speichern, damit keine Änderungen verloren gehen?',
				[
					{
						label: 'Laden',
						onClick: this.loadFx.bind(null, id)
					},
					{
						label: 'Abbrechen'
					}
				]
			);
		} else {
			this.loadFx(id);
		}
	},
	loadFx: function(id) {
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

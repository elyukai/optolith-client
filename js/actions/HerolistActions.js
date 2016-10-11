import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import createDialogNode from '../utils/createDialogNode';
import HeroCreation from '../components/content/herolist/HeroCreation';
import React from 'react';
import reactAlert from '../utils/reactAlert';
import ReactDOM from 'react-dom';
import WebAPIUtils from '../utils/WebAPIUtils';

var HerolistActions = {
	refresh: function() {
		AppDispatcher.dispatch({
			actionType: ActionTypes.WAIT_START
		});
		WebAPIUtils.getHeroes().then(function(callback) {
			if ( callback == 'false' ) {
				reactAlert('Da hat etwas nicht geklappt', 'Dies darf nicht passieren! Melde dies bitte als Fehler! Wir versuchen, das Problem schnellstmöglich zu beheben!');
				AppDispatcher.dispatch({
					actionType: ActionTypes.WAIT_END
				});
			} else {
				AppDispatcher.dispatch({
					actionType: ActionTypes.RECEIVE_RAW_HEROLIST,
					raw: callback
				});
			}
		}).catch(function(){
			AppDispatcher.dispatch({
				actionType: ActionTypes.WAIT_END
			});	
		});
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
		WebAPIUtils.loadHero(id);
	},
	showHeroCreation: function() {
		var node = createDialogNode();
		ReactDOM.render( <HeroCreation node={node} />, node );
	},
	createNewHero: function(options) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.CREATE_NEW_HERO,
			...options
		});
	}
};

export default HerolistActions;

import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import saveHero from '../utils/saveHero';

var TabActions = {
	openTab: function(tab) {

		AppDispatcher.dispatch({
			actionType: ActionTypes.SHOW_TAB,
			tab
		});

	},
	showSection: function(section) {

		AppDispatcher.dispatch({
			actionType: ActionTypes.SHOW_TAB_SECTION,
			section
		});

	},
	openHero: function(id) {

		AppDispatcher.dispatch({
			actionType: ActionTypes.RECEIVE_RAW_HERO_STRING,
			data: WebAPIUtils.getHero(id)
		});
		
	},
	saveHero: function() {
		saveHero();
	},
	clearCurrentHero: function() {

		AppDispatcher.dispatch({
			actionType: ActionTypes.CLEAR_HERO
		});
		
	},
	deleteCurrentHero: function() {
		
		WebAPIUtils.deleteHero(PaneStore.getUser().id, ControllerStore.getHeroCore().id)
		.then(function(callback) {
			if ( callback == 'false' ) {
				
				reactAlert('Da hat etwas nicht geklappt', 'Dies darf nicht passieren! Melde dies bitte als Fehler! Wir versuchen, das Problem schnellstmöglich zu beheben!');
		
				AppDispatcher.dispatch({
					actionType: ActionTypes.SET_SECTION,
					data: { section: 'list' }
				});
				
			} else if ( callback == 'true' ) {


				AppDispatcher.dispatch({
					actionType: ActionTypes.CLEAR_HERO
				});
				
			}
		})
		.catch(function(){
	
			AppDispatcher.dispatch({
				actionType: ActionTypes.SET_SECTION,
				data: { section: 'list' }
			});
				
		});
		
	}
};

export default TabActions;

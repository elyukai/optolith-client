import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import WebAPIUtils from '../utils/WebAPIUtils';
import reactAlert from '../utils/reactAlert';

var HeroActions = {
	create: function(heroname) {
		
		AppDispatcher.dispatch({
			actionType: ActionTypes.WAIT_START
		});
		
		WebAPIUtils.createNewHero(heroname)
		.then(function(callback) {
			if ( callback == 'false' ) {
				
				reactAlert('Da hat etwas nicht geklappt', 'Dies darf nicht passieren! Melde dies bitte als Fehler! Wir versuchen, das Problem schnellstmöglich zu beheben!');
		
				AppDispatcher.dispatch({
					actionType: ActionTypes.WAIT_END
				});
				
			} else {

				AppDispatcher.dispatch({
					actionType: ActionTypes.CREATE_HERO,
					heroid: callback,
					heroname
				});
				
			}
		})
		.catch(function(){
	
			AppDispatcher.dispatch({
				actionType: ActionTypes.WAIT_END
			});
				
		});
		
	},
	load: function(id) {
		
		AppDispatcher.dispatch({
			actionType: ActionTypes.WAIT_START
		});
		
		WebAPIUtils.getHero(id).then(function(callback) {
			if ( callback == 'false' ) {
				
				reactAlert('Da hat etwas nicht geklappt', 'Dies darf nicht passieren! Melde dies bitte als Fehler! Wir versuchen, das Problem schnellstmöglich zu beheben!');
		
				AppDispatcher.dispatch({
					actionType: ActionTypes.WAIT_END
				});
				
			} else {

				AppDispatcher.dispatch({
					actionType: ActionTypes.RECEIVE_HERO,
					id
				});
				
			}
		}).catch(function(){
	
			AppDispatcher.dispatch({
				actionType: ActionTypes.WAIT_END
			});
				
		});
		
	},
	save: function() {
		
	},
	clear: function() {

		AppDispatcher.dispatch({
			actionType: ActionTypes.CLEAR_HERO
		});
		
	},
	nextPhase: function() {
		
		AppDispatcher.dispatch({
			actionType: ActionTypes.INCREASE_PHASE
		});
		
	},
	rename: function(event) {
		
		AppDispatcher.dispatch({
			actionType: ActionTypes.UPDATE_HERONAME,
			heroname: event.target.value
		});
		
	}
};

export default HeroActions;

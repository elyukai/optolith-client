import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import reactAlert from '../utils/reactAlert';
import saveHero from '../utils/saveHero';
import AccountStore from '../stores/AccountStore';

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
	saveHero: function() {
		let currentAccountID = AccountStore.getID();
		if (currentAccountID === null) {
			reactAlert('Speichern nicht möglich', 'Um einen Charakter zu speichern, musst du angemeldet sein. Dein Fortschritt geht jedoch nicht verloren. Du kannst den Charakter nach der Anmeldung speichern, solange du diese Seite nicht verlässt oder neu lädst.');
		} else {
			saveHero();
		}
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

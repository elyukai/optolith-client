import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';
import HerolistStore from '../stores/core/HerolistStore';
import reactAlert from '../utils/reactAlert';

var ServerActions = {
	connectionError: function(error) {
		reactAlert('Verbindung nicht möglich', `Die App konnte keine Verbindung zum Server herstellen. Bitte überprüfe deine Internetverbindung! ${error}`);
		AppDispatcher.dispatch({
			actionType: ActionTypes.WAIT_END
		});
	},
	receiveLists: function(raw) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.RECEIVE_RAW_LISTS,
			...raw
		});
	},
	registrationSuccess: function() {
		AppDispatcher.dispatch({
			actionType: ActionTypes.REGISTRATION_SUCCESS
		});
	},
	receiveUser: function(raw) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.LOGIN_SUCCESS,
			raw
		});
	},
	loadHeroSuccess: function(id, data) {
		var short = HerolistStore.get(id);
		AppDispatcher.dispatch({
			actionType: ActionTypes.RECEIVE_HERO,
			...(Object.assign({}, short, data))
		});
	},
	saveHeroSuccess: function() {
		AppDispatcher.dispatch({
			actionType: ActionTypes.SAVE_HERO_SUCCESS
		});
	}
};

export default ServerActions;

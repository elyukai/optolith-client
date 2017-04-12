import * as ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

export const receiveInitialData = (payload: Raw) => AppDispatcher.dispatch<ReceiveInitialDataAction>({
	type: ActionTypes.RECEIVE_INITIAL_DATA,
	payload
});

export const receiveImportedHero = (data: RawHero) => AppDispatcher.dispatch<ReceiveImportedHeroAction>({
	type: ActionTypes.RECEIVE_IMPORTED_HERO,
	payload: {
		data
	}
});

import * as ActionTypes from '../constants/ActionTypes';
import { Action, AppDispatcher } from '../dispatcher/AppDispatcher';
import { Raw, RawHero } from '../types/rawdata.d';

export interface ReceiveInitialDataAction extends Action {
	type: ActionTypes.RECEIVE_INITIAL_DATA;
	payload: Raw;
}

export const receiveInitialData = (payload: Raw) => AppDispatcher.dispatch<ReceiveInitialDataAction>({
	type: ActionTypes.RECEIVE_INITIAL_DATA,
	payload
});

export interface ReceiveImportedHeroAction extends Action {
	type: ActionTypes.RECEIVE_IMPORTED_HERO;
	payload: {
		data: RawHero;
	};
}

export const receiveImportedHero = (data: RawHero) => AppDispatcher.dispatch<ReceiveImportedHeroAction>({
	type: ActionTypes.RECEIVE_IMPORTED_HERO,
	payload: {
		data
	}
});

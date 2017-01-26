/// <reference path="../data.d.ts" />

import AppDispatcher from '../dispatcher/AppDispatcher';
import Store from './Store';
import * as ActionTypes from '../constants/ActionTypes';

// EL = Experience Level

let _byId: { [id: string]: ExperienceLevel } = {};
let _allIds: string[];
let _start = 'EL_0';

function _init(el: { [id: string]: ExperienceLevel }) {
	_byId = el;
}

function _update(el: string) {
	_start = el;
}

function _clear() {
	_start = 'EL_0';
}

class ELStoreStatic extends Store {

	get(id: string) {
		return _byId[id];
	}

	getAll() {
		return _byId;
	}

	getStartID() {
		return _start;
	}

	getStart() {
		return this.get(this.getStartID());
	}

}

const ELStore = new ELStoreStatic(action => {

	switch( action.type ) {

		case ActionTypes.CREATE_NEW_HERO:
			_update(action.el);
			break;

		case ActionTypes.CLEAR_HERO:
			_clear();
			break;

		case ActionTypes.RECEIVE_HERO:
			_update(action.el);
			break;

		case ActionTypes.RECEIVE_RAW_LISTS:
			_init(action.el);
			break;

		default:
			return true;
	}

	ELStore.emitChange();

	return true;

});

export default ELStore;

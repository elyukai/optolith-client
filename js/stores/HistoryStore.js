import AppDispatcher from '../dispatcher/AppDispatcher';
import CultureStore from './rcp/CultureStore';
import ELStore from './ELStore';
import { EventEmitter } from 'events';
import ListStore from '../stores/ListStore';
import RaceStore from './rcp/RaceStore';
import ProfessionStore from './rcp/ProfessionStore';
import ProfessionVariantStore from './rcp/ProfessionVariantStore';
import ActionTypes from '../constants/ActionTypes';
import reactAlert from '../utils/reactAlert';
import reqPurchase from '../utils/reqPurchase';

var _history = [];

function _add(obj) {
	_history.push(obj);
}

function _clear() {
	_history = [];
}

function _updateAll(array) {
	_history = array;
}

function _assignRCP(selections) {
	// if (!selections.useCulturePackage) {
	// 	_used -= _rcp[1];
	// }

	// if (selections.buyLiteracy) {
	// 	const culture = CultureStore.getCurrent();
	// 	let id = culture.literacy.length > 1 ? selections.litc : culture.literacy[0];
	// 	_used += ListStore.get('SA_28').sel[id - 1][2];
	// }

	// let p = ProfessionStore.getCurrent();
	// if (p) {
	// 	let apCosts = reqPurchase(p.req);
	// 	_used += apCosts;
	// }
}

var HistoryStore = Object.assign({}, EventEmitter.prototype, {

	emitChange: function() {
		this.emit('change');
	},

	addChangeListener: function(callback) {
		this.on('change', callback);
	},

	removeChangeListener: function(callback) {
		this.removeListener('change', callback);
	},

	get: function(index) {
		return _history[index];
	},

	getAll: function() {
		return _history;
	}

});

HistoryStore.dispatchToken = AppDispatcher.register( function( payload ) {

	switch( payload.actionType ) {

		case ActionTypes.CLEAR_HERO:
			_clear();
			break;

		case ActionTypes.RECEIVE_HERO:
			_updateAll(payload.history);
			break;

		case ActionTypes.ASSIGN_RCP_ENTRIES:
			_assignRCP(payload.selections);
			break;
			
		case ActionTypes.CREATE_NEW_HERO:
			_clear();
			break;

		default:
			return true;
	}

	HistoryStore.emitChange();

	return true;

});

export default HistoryStore;

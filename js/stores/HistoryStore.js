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
var _lastSaveIndex = -1;

function _add(actionType, costs = 0, previousState = null, options) {
	_history.push({
		actionType,
		costs,
		previousState,
		options
	});
}

function _clear() {
	_history = [];
}

function _resetSaveIndex() {
	_lastSaveIndex = _history.length - 1;
}

function _updateAll(array) {
	_history = array;
	_lastSaveIndex = _history.length - 1;
}

function _assignRCP(selections) {
	let race = RaceStore.getCurrent();
	_add(ActionTypes.SELECT_RACE, race.ap, undefined, race.id);
	let culture = CultureStore.getCurrent();
	_add(ActionTypes.SELECT_CULTURE, culture.ap, undefined, race.id);
	let profession = ProfessionStore.getCurrent() || { id: 'P_0', ap: 0 };
	_add(ActionTypes.SELECT_PROFESSION, profession.ap, undefined, profession.id);
	let professionVariant = ProfessionVariantStore.getCurrent();
	if (professionVariant) {
		_add(ActionTypes.SELECT_PROFESSION_VARIANT, professionVariant.ap, undefined, professionVariant.id);
	}

	let { attrSel, useCulturePackage, lang, buyLiteracy, litc, cantrips, combattech, curses, langLitc, spec } = selections;

	_add('SELECT_ATTRIBUTE_MOD', undefined, undefined, attrSel);
	_add('PURCHASE_CULTURE_PACKAGE', undefined, undefined, useCulturePackage);
	if (lang !== 0) {
		_add('SELECT_MOTHER_TONGUE', undefined, undefined, lang);
	}
	_add('PURCHASE_MAIN_LITERACY', undefined, undefined, buyLiteracy);
	if (spec[0] !== null || spec[1] !== '') {
		_add('SELECT_SKILL_SPECIALISATION', undefined, undefined, spec);
	}
	if (litc !== 0) {
		_add('SELECT_MAIN_LITERACY', undefined, undefined, litc);
	}
	if (cantrips.size > 0) {
		_add('SELECT_CANTRIPS', undefined, undefined, Array.from(cantrips));
	}
	if (combattech.size > 0) {
		_add('SELECT_COMBAT_TECHNIQUES', undefined, undefined, Array.from(combattech));
	}
	if (curses.size > 0) {
		_add('SELECT_CURSES', undefined, undefined, Array.from(curses));
	}
	if (langLitc.size > 0) {
		_add('SELECT_LANGUAGES_AND_LITERACIES', undefined, undefined, Array.from(langLitc));
	}
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
			_resetSaveIndex();
			break;

		case ActionTypes.RECEIVE_HERO:
			_clear();
			_updateAll(payload.history);
			_resetSaveIndex();
			break;

		case ActionTypes.ASSIGN_RCP_ENTRIES:
			_assignRCP(payload.selections);
			_resetSaveIndex();
			break;

		case ActionTypes.FINALIZE_CHARACTER_CREATION:
			_resetSaveIndex();
			break;
			
		case ActionTypes.CREATE_NEW_HERO:
			_clear();
			_resetSaveIndex();
			break;
			
		case ActionTypes.SAVE_HERO_SUCCESS:
			_resetSaveIndex();
			break;

		default:
			return true;
	}

	HistoryStore.emitChange();

	return true;

});

export default HistoryStore;

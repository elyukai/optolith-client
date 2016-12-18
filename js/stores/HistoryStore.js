import AppDispatcher from '../dispatcher/AppDispatcher';
import CultureStore from './CultureStore';
import ELStore from './ELStore';
import Store from './Store';
import { get } from '../stores/ListStore';
import RaceStore from './RaceStore';
import RequirementsStore from './RequirementsStore';
import ProfessionStore from './ProfessionStore';
import ProfessionVariantStore from './ProfessionVariantStore';
import ActionTypes from '../constants/ActionTypes';

var _history = [];
var _lastSaveIndex = -1;

function _add(actionType, cost = 0, options = {}, prevState = {}) {
	_history.push({
		actionType,
		cost,
		options,
		prevState
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
	let el = ELStore.getStart();
	_add(ActionTypes.SELECT_EXPERIENCE_LEVEL, -el.ap, { id: el.id });
	let race = RaceStore.getCurrent();
	_add(ActionTypes.SELECT_RACE, race.ap, { id: race.id });
	let culture = CultureStore.getCurrent();
	_add(ActionTypes.SELECT_CULTURE, culture.ap, { id: culture.id });
	let profession = ProfessionStore.getCurrent();
	_add(ActionTypes.SELECT_PROFESSION, profession.ap, { id: profession.id });
	let professionVariant = ProfessionVariantStore.getCurrent();
	if (professionVariant) {
		_add(ActionTypes.SELECT_PROFESSION_VARIANT, professionVariant.ap, { id: professionVariant.id });
	}

	let { attrSel, useCulturePackage, lang, buyLiteracy, litc, cantrips, combattech, curses, langLitc, spec } = selections;

	_add('SELECT_ATTRIBUTE_MOD', 0, { id: attrSel });
	_add('PURCHASE_CULTURE_PACKAGE', 0, { buy: useCulturePackage });
	if (lang !== 0) {
		_add('SELECT_MOTHER_TONGUE', 0, { id: lang });
	}
	_add('PURCHASE_MAIN_SCRIPT', 0, { buy: buyLiteracy });
	if (spec && (spec[0] !== null || spec[1] !== '')) {
		_add('SELECT_SKILL_SPECIALISATION', 0, { id: spec });
	}
	if (litc !== 0) {
		_add('SELECT_MAIN_LITERACY', 0, { id: litc });
	}
	if (cantrips.size > 0) {
		_add('SELECT_CANTRIPS', 0, { list: Array.from(cantrips) });
	}
	if (combattech.size > 0) {
		_add('SELECT_COMBAT_TECHNIQUES', 0, { list: Array.from(combattech) });
	}
	if (curses.size > 0) {
		_add('SELECT_CURSES', 0, { list: Array.from(curses) });
	}
	if (langLitc.size > 0) {
		_add('SELECT_LANGUAGES_AND_LITERACIES', 0, { list: Array.from(langLitc) });
	}
}

class _HistoryStore extends Store {

	get(index) {
		return _history[index];
	}

	getAll() {
		return _history;
	}

	isUndoAvailable() {
		return _lastSaveIndex < _history.length - 1;
	}

	getUndo() {
		let lastIndex = _history.length - 1;
		if (_lastSaveIndex < lastIndex) {
			return _history[_history.length - 1];
		}
		return false;
	}

}

const HistoryStore = new _HistoryStore();

HistoryStore.dispatchToken = AppDispatcher.register(payload => {

	AppDispatcher.waitFor([RequirementsStore.dispatchToken]);

	if (payload.undoAction && HistoryStore.isUndoAvailable()) {
		_history.splice(_history.length - 1, 1);
	}
	else {
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

			case ActionTypes.ADD_ATTRIBUTE_POINT:
			case ActionTypes.ADD_TALENT_POINT:
			case ActionTypes.ADD_COMBATTECHNIQUE_POINT:
			case ActionTypes.ADD_SPELL_POINT:
			case ActionTypes.ADD_LITURGY_POINT:
				if (RequirementsStore.isValid()) {
					const id = payload.id;
					const oldValue = get(id).value;
					const newValue = oldValue + 1;
					const cost = RequirementsStore.getCurrentCost();
					_add(payload.actionType, cost, { id, value: newValue }, { value: oldValue });
				}
				break;

			case ActionTypes.REMOVE_ATTRIBUTE_POINT:
			case ActionTypes.REMOVE_TALENT_POINT:
			case ActionTypes.REMOVE_COMBATTECHNIQUE_POINT:
			case ActionTypes.REMOVE_SPELL_POINT:
			case ActionTypes.REMOVE_LITURGY_POINT:
				if (RequirementsStore.isValid()) {
					const id = payload.id;
					const oldValue = get(id).value;
					const newValue = oldValue - 1;
					const cost = RequirementsStore.getCurrentCost();
					_add(payload.actionType, cost, { id, value: newValue }, { value: oldValue });
				}
				break;

			case ActionTypes.ACTIVATE_DISADV:
			case ActionTypes.ACTIVATE_SPECIALABILITY:
				if (RequirementsStore.isValid()) {
					const id = payload.id;
					const oldValue = get(id).value;
					const newValue = oldValue - 1;
					const cost = RequirementsStore.getCurrentCost();
					_add(payload.actionType, cost, { id, value: newValue }, { value: oldValue });
				}
				break;

			case ActionTypes.DEACTIVATE_DISADV:
			case ActionTypes.DEACTIVATE_SPECIALABILITY:
				if (RequirementsStore.isValid()) {
					const id = payload.id;
					const oldValue = get(id).value;
					const newValue = oldValue - 1;
					const cost = RequirementsStore.getCurrentCost();
					_add(payload.actionType, cost, { id, value: newValue }, { value: oldValue });
				}
				break;

			case ActionTypes.UPDATE_DISADV_TIER:
			case ActionTypes.UPDATE_SPECIALABILITY_TIER:
				if (RequirementsStore.isValid()) {
					const { id, sid, tier } = payload;
					let oldValue;
					switch (id) {
						case 'DISADV_1':
						case 'SA_30':
							get(id).active.some(e => {
								if (e[0] === sid) {
									oldValue = e[1];
									return true;
								}
								return false;
							});
							break;
						default:
							oldValue = get(id).tier;
							break;
					}
					const newValue = tier;
					const cost = RequirementsStore.getCurrentCost();
					_add(payload.actionType, cost, { id, tier: newValue, sid }, { tier: oldValue });
				}
				break;

			case ActionTypes.ADD_ADVENTURE_POINTS:
				_add(payload.actionType, 0, { value: payload.value });
				break;

			default:
				return true;
		}
	}

	HistoryStore.emitChange();

	return true;

});

export default HistoryStore;

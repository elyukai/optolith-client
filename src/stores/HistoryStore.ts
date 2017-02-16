import { get } from '../stores/ListStore';
import * as ActionTypes from '../constants/ActionTypes';
import * as secondaryAttributes from '../utils/secondaryAttributes';
import AppDispatcher from '../dispatcher/AppDispatcher';
import APStore from './APStore';
import AttributeStore from './AttributeStore';
import CultureStore from './CultureStore';
import ELStore from './ELStore';
import ListStore from './ListStore';
import ProfessionStore from './ProfessionStore';
import ProfessionVariantStore from './ProfessionVariantStore';
import RaceStore from './RaceStore';
import RequirementsStore from './RequirementsStore';
import Store from './Store';

type Action = ReceiveHeroDataAction | ActivateSpellAction | ActivateLiturgyAction | DeactivateSpellAction | DeactivateLiturgyAction | AddAttributePointAction | AddTalentPointAction | AddCombatTechniquePointAction | AddSpellPointAction | AddLiturgyPointAction | AddArcaneEnergyPointAction | AddKarmaPointAction | AddLifePointAction | RemoveAttributePointAction | RemoveTalentPointAction | RemoveCombatTechniquePointAction | RemoveSpellPointAction | RemoveLiturgyPointAction | ActivateDisAdvAction | SetDisAdvTierAction | DeactivateDisAdvAction | ActivateSpecialAbilityAction | SetSpecialAbilityTierAction | DeactivateSpecialAbilityAction | AddAdventurePointsAction | SelectRaceAction | SelectCultureAction | SelectProfessionAction | SelectProfessionVariantAction | CreateHeroAction | EndHeroCreationAction | SetSelectionsAction;

interface HistoryPayload {
	id?: string | number;
	activeObject?: ActiveObject;
	index?: number;
	list?: (string | [string, number])[];
	buy?: boolean;
}

interface HistoryPrevState {

}

interface HistoryObject {
	type: string;
	cost: number;
	payload: HistoryPayload;
	prevState: HistoryPrevState;
}

let _history: HistoryObject[] = [];
let _lastSaveIndex = -1;

function _add(type: string, cost = 0, payload: HistoryPayload = {}, prevState: HistoryPrevState = {}) {
	_history.push({
		type,
		cost,
		payload,
		prevState
	});
}

function _clear() {
	_history = [];
}

function _resetSaveIndex() {
	_lastSaveIndex = _history.length - 1;
}

function _updateAll(array: HistoryObject[]) {
	_history = array;
	_lastSaveIndex = _history.length - 1;
}

function _assignRCP(selections: Selections) {
	const el = ELStore.getStart();
	_add('SELECT_EXPERIENCE_LEVEL', -el.ap, { id: el.id });
	const race = RaceStore.getCurrent();
	_add(ActionTypes.SELECT_RACE, race.ap, { id: race.id });
	const culture = CultureStore.getCurrent();
	_add(ActionTypes.SELECT_CULTURE, culture.ap, { id: culture.id });
	const profession = ProfessionStore.getCurrent();
	_add(ActionTypes.SELECT_PROFESSION, profession.ap, { id: profession.id });
	const professionVariant = ProfessionVariantStore.getCurrent();
	if (professionVariant) {
		_add(ActionTypes.SELECT_PROFESSION_VARIANT, professionVariant.ap, { id: professionVariant.id });
	}

	const { attrSel, useCulturePackage, lang, buyLiteracy, litc, cantrips, combattech, curses, langLitc, spec } = selections;

	_add('SELECT_ATTRIBUTE_MOD', 0, { id: attrSel });
	_add('PURCHASE_CULTURE_PACKAGE', 0, { buy: useCulturePackage });
	if (lang !== 0) {
		_add('SELECT_MOTHER_TONGUE', 0, { id: lang });
	}
	_add('PURCHASE_MAIN_SCRIPT', 0, { buy: buyLiteracy });
	if (spec) {
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

class HistoryStoreStatic extends Store {

	get(index: number) {
		return _history[index];
	}

	getAll() {
		return _history;
	}

	isUndoAvailable() {
		return _lastSaveIndex < _history.length - 1;
	}

	getUndo() {
		const lastIndex = _history.length - 1;
		if (_lastSaveIndex < lastIndex) {
			return _history[_history.length - 1];
		}
		return false;
	}

}

const HistoryStore = new HistoryStoreStatic((action: Action) => {
	AppDispatcher.waitFor([RequirementsStore.dispatchToken]);
	if (action.undo && HistoryStore.isUndoAvailable()) {
		_history.splice(_history.length - 1, 1);
	}
	else {
		switch( action.type ) {
			case ActionTypes.RECEIVE_HERO_DATA:
				_clear();
				_updateAll(action.payload.data.history);
				_resetSaveIndex();
				break;

			case ActionTypes.ASSIGN_RCP_OPTIONS:
				_assignRCP(action.payload);
				_resetSaveIndex();
				break;

			case ActionTypes.END_HERO_CREATION:
				_resetSaveIndex();
				break;

			case ActionTypes.CREATE_HERO:
				_clear();
				_resetSaveIndex();
				break;

			// case ActionTypes.RECEIVE_HERO_SAVE:
			// 	_resetSaveIndex();
			// 	break;

			case ActionTypes.ACTIVATE_SPELL:
			case ActionTypes.ACTIVATE_LITURGY:
			case ActionTypes.DEACTIVATE_SPELL:
			case ActionTypes.DEACTIVATE_LITURGY:
				if (RequirementsStore.isValid()) {
					AppDispatcher.waitFor([ListStore.dispatchToken]);
					const cost = RequirementsStore.getCurrentCost();
					_add(action.type, cost, action.payload);
				}
				break;

			case ActionTypes.ADD_ATTRIBUTE_POINT:
			case ActionTypes.ADD_TALENT_POINT:
			case ActionTypes.ADD_COMBATTECHNIQUE_POINT:
			case ActionTypes.ADD_SPELL_POINT:
			case ActionTypes.ADD_LITURGY_POINT:
				if (RequirementsStore.isValid()) {
					AppDispatcher.waitFor([ListStore.dispatchToken]);
					const id = action.payload.id;
					const oldValue = (get(id) as IncreasableInstances).value;
					const cost = RequirementsStore.getCurrentCost();
					_add(action.type, cost, action.payload, { value: oldValue });
				}
				break;

			case ActionTypes.ADD_ARCANE_ENERGY_POINT:
				if (RequirementsStore.isValid()) {
					AppDispatcher.waitFor([AttributeStore.dispatchToken]);
					const oldValue = secondaryAttributes.get('AE').add;
					const cost = RequirementsStore.getCurrentCost();
					_add(action.type, cost, {}, { value: oldValue });
				}
				break;

			case ActionTypes.ADD_KARMA_POINT:
				if (RequirementsStore.isValid()) {
					AppDispatcher.waitFor([AttributeStore.dispatchToken]);
					const oldValue = secondaryAttributes.get('KP').add;
					const cost = RequirementsStore.getCurrentCost();
					_add(action.type, cost, {}, { value: oldValue });
				}
				break;

			case ActionTypes.ADD_LIFE_POINT:
				if (RequirementsStore.isValid()) {
					AppDispatcher.waitFor([AttributeStore.dispatchToken]);
					const oldValue = secondaryAttributes.get('LP').add;
					const cost = RequirementsStore.getCurrentCost();
					_add(action.type, cost, {}, { value: oldValue });
				}
				break;

			case ActionTypes.REMOVE_ATTRIBUTE_POINT:
			case ActionTypes.REMOVE_TALENT_POINT:
			case ActionTypes.REMOVE_COMBATTECHNIQUE_POINT:
			case ActionTypes.REMOVE_SPELL_POINT:
			case ActionTypes.REMOVE_LITURGY_POINT:
				if (RequirementsStore.isValid()) {
					AppDispatcher.waitFor([ListStore.dispatchToken]);
					const id = action.payload.id;
					const oldValue = (get(id) as IncreasableInstances).value;
					const cost = RequirementsStore.getCurrentCost();
					_add(action.type, cost, action.payload, { value: oldValue });
				}
				break;

			case ActionTypes.ACTIVATE_DISADV:
			case ActionTypes.ACTIVATE_SPECIALABILITY:
				if (RequirementsStore.isValid()) {
					AppDispatcher.waitFor([ListStore.dispatchToken]);
					const id = action.payload.id;
					const instance = get(id) as ActivatableInstances;
					const index = instance.active.length - 1;
					const newValue = instance.active[index];
					const cost = RequirementsStore.getCurrentCost();
					_add(action.type, cost, { id, activeObject: newValue, index });
				}
				break;

			case ActionTypes.DEACTIVATE_DISADV:
			case ActionTypes.DEACTIVATE_SPECIALABILITY:
				if (RequirementsStore.isValid()) {
					const id = action.payload.id;
					const instance = get(id) as ActivatableInstances;
					const index = action.payload.index;
					const newValue = instance.active[index];
					const cost = RequirementsStore.getCurrentCost();
					_add(action.type, cost, { id, activeObject: newValue, index });
				}
				break;

			case ActionTypes.SET_DISADV_TIER:
			case ActionTypes.SET_SPECIALABILITY_TIER:
				if (RequirementsStore.isValid()) {
					AppDispatcher.waitFor([ListStore.dispatchToken]);
					const instance = get(action.payload.id) as ActivatableInstances;
					const oldValue = instance.active[action.payload.index].tier;
					_add(action.type, RequirementsStore.getCurrentCost(), action.payload, { tier: oldValue });
				}
				break;

			case ActionTypes.ADD_ADVENTURE_POINTS:
				AppDispatcher.waitFor([APStore.dispatchToken]);
				_add(action.type, 0, action.payload, { value: APStore.getTotal()});
				break;

			default:
				return true;
		}
	}

	HistoryStore.emitChange();
	return true;
});

export default HistoryStore;

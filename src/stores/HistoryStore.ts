import * as ActionTypes from '../constants/ActionTypes';
import { Action, AppDispatcher } from '../dispatcher/AppDispatcher';
import { get } from '../stores/ListStore';
import { ActivatableInstance, HistoryObject, HistoryPayload, HistoryPrevState, IncreasableInstance, Selections } from '../types/data.d';
import * as secondaryAttributes from '../utils/secondaryAttributes';
import { APStore } from './APStore';
import { AttributeStore } from './AttributeStore';
import { CultureStore } from './CultureStore';
import { ELStore } from './ELStore';
import { ListStore } from './ListStore';
import { ProfessionStore } from './ProfessionStore';
import { ProfessionVariantStore } from './ProfessionVariantStore';
import { RaceStore } from './RaceStore';
import { RequirementsStore } from './RequirementsStore';
import { Store } from './Store';

class HistoryStoreStatic extends Store {
	readonly dispatchToken: string;
	private history: HistoryObject[] = [];
	private lastSaveIndex = -1;

	constructor() {
		super();
		this.dispatchToken = AppDispatcher.register((action: Action) => {
			AppDispatcher.waitFor([RequirementsStore.dispatchToken]);
			if (action.undo && HistoryStore.isUndoAvailable()) {
				this.history.splice(this.history.length - 1, 1);
			}
			else {
				switch (action.type) {
					case ActionTypes.RECEIVE_HERO_DATA:
						this.clear();
						this.updateAll(action.payload.data.history);
						this.resetSaveIndex();
						break;

					case ActionTypes.ASSIGN_RCP_OPTIONS:
						this.assignRCP(action.payload);
						this.resetSaveIndex();
						break;

					case ActionTypes.END_HERO_CREATION:
						this.resetSaveIndex();
						break;

					case ActionTypes.CREATE_HERO:
						this.clear();
						this.resetSaveIndex();
						break;

					case ActionTypes.SAVE_HERO:
						this.resetSaveIndex();
						break;

					case ActionTypes.ACTIVATE_SPELL:
					case ActionTypes.ACTIVATE_LITURGY:
					case ActionTypes.DEACTIVATE_SPELL:
					case ActionTypes.DEACTIVATE_LITURGY:
						if (RequirementsStore.isValid()) {
							AppDispatcher.waitFor([ListStore.dispatchToken]);
							const cost = RequirementsStore.getCurrentCost();
							this.add(action.type, cost, action.payload);
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
							const oldValue = (get(id) as IncreasableInstance).value;
							const cost = RequirementsStore.getCurrentCost();
							this.add(action.type, cost, action.payload, { value: oldValue });
						}
						break;

					case ActionTypes.ADD_ARCANE_ENERGY_POINT:
						if (RequirementsStore.isValid()) {
							AppDispatcher.waitFor([AttributeStore.dispatchToken]);
							const oldValue = secondaryAttributes.get('AE').add;
							const cost = RequirementsStore.getCurrentCost();
							this.add(action.type, cost, {}, { value: oldValue });
						}
						break;

					case ActionTypes.ADD_KARMA_POINT:
						if (RequirementsStore.isValid()) {
							AppDispatcher.waitFor([AttributeStore.dispatchToken]);
							const oldValue = secondaryAttributes.get('KP').add;
							const cost = RequirementsStore.getCurrentCost();
							this.add(action.type, cost, {}, { value: oldValue });
						}
						break;

					case ActionTypes.ADD_LIFE_POINT:
						if (RequirementsStore.isValid()) {
							AppDispatcher.waitFor([AttributeStore.dispatchToken]);
							const oldValue = secondaryAttributes.get('LP').add;
							const cost = RequirementsStore.getCurrentCost();
							this.add(action.type, cost, {}, { value: oldValue });
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
							const oldValue = (get(id) as IncreasableInstance).value;
							const cost = RequirementsStore.getCurrentCost();
							this.add(action.type, cost, action.payload, { value: oldValue });
						}
						break;

					case ActionTypes.ACTIVATE_DISADV:
					case ActionTypes.ACTIVATE_SPECIALABILITY:
						if (RequirementsStore.isValid()) {
							AppDispatcher.waitFor([ListStore.dispatchToken]);
							const id = action.payload.id;
							const instance = get(id) as ActivatableInstance;
							const index = instance.active.length - 1;
							const newValue = instance.active[index];
							const cost = RequirementsStore.getCurrentCost();
							this.add(action.type, cost, { id, activeObject: newValue, index });
						}
						break;

					case ActionTypes.DEACTIVATE_DISADV:
					case ActionTypes.DEACTIVATE_SPECIALABILITY:
						if (RequirementsStore.isValid()) {
							const id = action.payload.id;
							const instance = get(id) as ActivatableInstance;
							const index = action.payload.index;
							const newValue = instance.active[index];
							const cost = RequirementsStore.getCurrentCost();
							this.add(action.type, cost, { id, activeObject: newValue, index });
						}
						break;

					case ActionTypes.SET_DISADV_TIER:
					case ActionTypes.SET_SPECIALABILITY_TIER:
						if (RequirementsStore.isValid()) {
							AppDispatcher.waitFor([ListStore.dispatchToken]);
							const instance = get(action.payload.id) as ActivatableInstance;
							const oldValue = instance.active[action.payload.index].tier;
							this.add(action.type, RequirementsStore.getCurrentCost(), action.payload, { tier: oldValue });
						}
						break;

					case ActionTypes.ADD_ADVENTURE_POINTS:
						AppDispatcher.waitFor([APStore.dispatchToken]);
						this.add(action.type, 0, action.payload, { value: APStore.getTotal()});
						break;

					case ActionTypes.ADD_BOUGHT_BACK_AE_POINT:
					case ActionTypes.ADD_BOUGHT_BACK_KP_POINT:
					case ActionTypes.REMOVE_BOUGHT_BACK_AE_POINT:
					case ActionTypes.REMOVE_BOUGHT_BACK_KP_POINT:
						if (RequirementsStore.isValid()) {
							this.add(action.type, RequirementsStore.getCurrentCost());
						}
						break;

					case ActionTypes.ADD_LOST_AE_POINT:
					case ActionTypes.ADD_LOST_KP_POINT:
					case ActionTypes.REMOVE_LOST_AE_POINT:
					case ActionTypes.REMOVE_LOST_KP_POINT:
						if (RequirementsStore.isValid()) {
							this.add(action.type);
						}
						break;

					case ActionTypes.ADD_LOST_AE_POINTS: {
						const oldValue = AttributeStore.getAddEnergies().permanentAE.lost;
						this.add(action.type, RequirementsStore.getCurrentCost(), action.payload, { value: oldValue });
						break;
					}

					case ActionTypes.ADD_LOST_AE_POINTS: {
						const oldValue = AttributeStore.getAddEnergies().permanentKP.lost;
						this.add(action.type, RequirementsStore.getCurrentCost(), action.payload, { value: oldValue });
						break;
					}

					default:
						return true;
				}
			}
			this.emitChange();
			return true;
		});
	}

	get(index: number) {
		return this.history[index];
	}

	getAll() {
		return this.history;
	}

	isUndoAvailable() {
		return this.lastSaveIndex < this.history.length - 1;
	}

	getUndo(): Action | undefined {
		const lastIndex = this.history.length - 1;
		if (this.lastSaveIndex < lastIndex) {
			return this.history[this.history.length - 1];
		}
		return undefined;
	}

	private add(type: string, cost = 0, payload: HistoryPayload = {}, prevState: HistoryPrevState = {}) {
		this.history.push({
			type,
			cost,
			payload,
			prevState,
		});
	}

	private clear() {
		this.history = [];
	}

	private resetSaveIndex() {
		this.lastSaveIndex = this.history.length - 1;
	}

	private updateAll(array: HistoryObject[]) {
		this.history = array;
		this.lastSaveIndex = this.history.length - 1;
	}

	private assignRCP(selections: Selections) {
		const el = ELStore.getStart();
		this.add('SELECT_EXPERIENCE_LEVEL', -el.ap, { id: el.id });
		const race = RaceStore.getCurrent();
		this.add(ActionTypes.SELECT_RACE, race!.ap, { id: race!.id });
		const culture = CultureStore.getCurrent();
		this.add(ActionTypes.SELECT_CULTURE, culture!.ap, { id: culture!.id });
		const profession = ProfessionStore.getCurrent();
		this.add(ActionTypes.SELECT_PROFESSION, profession!.ap, { id: profession!.id });
		const professionVariant = ProfessionVariantStore.getCurrent();
		if (professionVariant) {
			this.add(ActionTypes.SELECT_PROFESSION_VARIANT, professionVariant.ap, { id: professionVariant.id });
		}

		const { attrSel, useCulturePackage, lang, buyLiteracy, litc, cantrips, combattech, curses, langLitc, spec } = selections;

		this.add('SELECT_ATTRIBUTE_MOD', 0, { id: attrSel });
		this.add('PURCHASE_CULTURE_PACKAGE', 0, { buy: useCulturePackage });
		if (lang !== 0) {
			this.add('SELECT_MOTHER_TONGUE', 0, { id: lang });
		}
		this.add('PURCHASE_MAIN_SCRIPT', 0, { buy: buyLiteracy });
		if (spec) {
			this.add('SELECT_SKILL_SPECIALISATION', 0, { id: spec });
		}
		if (litc !== 0) {
			this.add('SELECT_MAIN_LITERACY', 0, { id: litc });
		}
		if (cantrips.size > 0) {
			this.add('SELECT_CANTRIPS', 0, { list: Array.from(cantrips) });
		}
		if (combattech.size > 0) {
			this.add('SELECT_COMBAT_TECHNIQUES', 0, { list: Array.from(combattech) });
		}
		if (curses.size > 0) {
			this.add('SELECT_CURSES', 0, { list: Array.from(curses) });
		}
		if (langLitc.size > 0) {
			this.add('SELECT_LANGUAGES_AND_LITERACIES', 0, { list: Array.from(langLitc) });
		}
	}
}

export const HistoryStore = new HistoryStoreStatic();

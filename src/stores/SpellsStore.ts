import { last } from 'lodash';
import { ReceiveInitialDataAction } from '../actions/FileActions';
import { UndoTriggerActions } from '../actions/HistoryActions';
import { ActivateSpellAction, AddSpellPointAction, DeactivateSpellAction, RemoveSpellPointAction, SetSpellsSortOrderAction } from '../actions/SpellsActions';
import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';
import { AppDispatcher } from '../dispatcher/AppDispatcher';
import { AdvantageInstance, CantripInstance, DisadvantageInstance, SpecialAbilityInstance, SpellInstance } from '../types/data.d';
import { getSids, isActive } from '../utils/ActivatableUtils';
import { validate } from '../utils/RequirementUtils';
import { isOwnTradition } from '../utils/SpellUtils';
import { ELStore } from './ELStore';
import { get, getAllByCategory, ListStore } from './ListStore';
import { PhaseStore } from './PhaseStore';
import { Store } from './Store';

type Action = ActivateSpellAction | DeactivateSpellAction | AddSpellPointAction | RemoveSpellPointAction | SetSpellsSortOrderAction | UndoTriggerActions | ReceiveInitialDataAction;

class SpellsStoreStatic extends Store {
	private readonly category = Categories.SPELLS;
	private sortOrder = 'name';
	readonly dispatchToken: string;

	constructor() {
		super();
		this.dispatchToken = AppDispatcher.register((action: Action) => {
			AppDispatcher.waitFor([ListStore.dispatchToken]);
			if (action.undo) {
				switch (action.type) {
					case ActionTypes.ACTIVATE_SPELL:
					case ActionTypes.DEACTIVATE_SPELL:
					case ActionTypes.ADD_SPELL_POINT:
					case ActionTypes.REMOVE_SPELL_POINT:
						break;

					default:
						return true;
				}
			}
			else {
				switch (action.type) {
					case ActionTypes.RECEIVE_INITIAL_DATA:
						this.updateSortOrder(action.payload.config.spellsSortOrder);
						break;

					case ActionTypes.ACTIVATE_SPELL:
					case ActionTypes.DEACTIVATE_SPELL:
					case ActionTypes.ADD_SPELL_POINT:
					case ActionTypes.REMOVE_SPELL_POINT:
						break;

					case ActionTypes.SET_SPELLS_SORT_ORDER:
						this.updateSortOrder(action.payload.sortOrder);
						break;

					default:
						return true;
				}
			}
			this.emitChange();
			return true;
		});
	}

	getAll() {
		return getAllByCategory(this.category) as SpellInstance[];
	}

	getAllForView() {
		const tradition = get('SA_86') as SpecialAbilityInstance;
		const allEntries = getAllByCategory(Categories.CANTRIPS, Categories.SPELLS) as (CantripInstance | SpellInstance)[];
		const areMaxUnfamiliar = this.areMaxUnfamiliar();
		const lastTraditionId = last(getSids(tradition));
		if (lastTraditionId === 8) {
			const activeSpells = this.getActiveSpellsNumber(allEntries);
			let maxSpells = 3;
			const bonusEntry = get('ADV_58') as AdvantageInstance;
			const penaltyEntry = get('DISADV_59') as DisadvantageInstance;
			if (isActive(bonusEntry)) {
				const tier = bonusEntry.active[0].tier;
				if (tier) {
					maxSpells += tier;
				}
			}
			else if (isActive(penaltyEntry)) {
				const tier = penaltyEntry.active[0].tier;
				if (tier) {
					maxSpells += tier;
				}
			}
			return allEntries.filter(entry => {
				return entry.category === Categories.CANTRIPS || entry.gr === 1 && activeSpells <= maxSpells && (entry.active === true || validate(entry.reqs, entry.id) && (isOwnTradition(entry) || !areMaxUnfamiliar));
			});
		}
		else if (lastTraditionId === 6 || lastTraditionId === 7) {
			const tradition = get('SA_86') as SpecialAbilityInstance;
			const subtradition = last(tradition.active).sid2;
			if (typeof subtradition === 'number') {
				return allEntries.filter(entry => {
					return entry.category === Categories.CANTRIPS || entry.subtradition.includes(subtradition);
				});
			}
			return [];
		}
		return allEntries.filter(entry => {
			return entry.category === Categories.CANTRIPS || entry.active === true || validate(entry.reqs, entry.id) && (isOwnTradition(entry) || entry.gr < 3 && !areMaxUnfamiliar);
		});
	}

	getActiveSpellsNumber(list: (CantripInstance | SpellInstance)[] = getAllByCategory(Categories.SPELLS) as SpellInstance[]) {
		return list.reduce((n, entry) => {
			if (entry.category === Categories.SPELLS && entry.value > 0) {
				return n + 1;
			}
			return n;
		}, 0);
	}

	getAllCantrips() {
		return getAllByCategory(Categories.CANTRIPS) as CantripInstance[];
	}

	getForSave() {
		const list: { [id: string]: number } = {};
		this.getAll().forEach(e => {
			const { active, id, value } = e;
			if (active) {
				list[id] = value;
			}
		});
		return list;
	}

	getCantripsForSave() {
		const list: string[] = [];
		this.getAllCantrips().forEach(e => {
			const { active, id } = e;
			if (active) {
				list.push(id);
			}
		});
		return list;
	}

	getPropertyCounter() {
		return this.getAll().filter(e => e.value >= 10).reduce((a, b) => {
			if (!a.has(b.property)) {
				a.set(b.property, 1);
			} else {
				a.set(b.property, a.get(b.property) + 1);
			}
			return a;
		}, new Map());
	}

	areMaxUnfamiliar() {
		const phase = PhaseStore.get() < 3;
		if (!phase) {
			return false;
		}
		const max = ELStore.getStart().maxUnfamiliarSpells;
		const SA_86 = get('SA_86') as SpecialAbilityInstance;
		const unfamiliarSpells = this.getAll().reduce((n, e) => {
			const unknownTradition = !e.tradition.some(e => e === 1 || e === (getSids(SA_86)[0] as number) + 1);
			return unknownTradition && e.gr < 3 && e.active ? n + 1 : n;
		}, 0);
		return unfamiliarSpells >= max;
	}

	isActivationDisabled() {
		const maxSpellsLiturgies = ELStore.getStart().maxSpellsLiturgies;
		return PhaseStore.get() < 3 && this.getAll().filter(e => e.gr < 3 && e.active).length >= maxSpellsLiturgies;
	}

	getSortOrder() {
		return this.sortOrder;
	}

	private updateSortOrder(option: string) {
		this.sortOrder = option;
	}
}

export const SpellsStore = new SpellsStoreStatic();

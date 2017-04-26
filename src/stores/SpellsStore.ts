import { ReceiveInitialDataAction } from '../actions/FileActions';
import { UndoTriggerActions } from '../actions/HistoryActions';
import { ActivateSpellAction, AddSpellPointAction, DeactivateSpellAction, RemoveSpellPointAction, SetSpellsSortOrderAction } from '../actions/SpellsActions';
import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';
import { AppDispatcher } from '../dispatcher/AppDispatcher';
import { CantripInstance, SpecialAbilityInstance, SpellInstance } from '../types/data.d';
import { getSids } from '../utils/ActivatableUtils';
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
		const max = ELStore.getStart().maxUnfamiliarSpells;
		const SA_86 = get('SA_86') as SpecialAbilityInstance;
		const unfamiliarSpells = this.getAll().filter(e => {
			const unknownTradition = !e.tradition.some(e => e === 1 || e === (getSids(SA_86)[0] as number) + 1);
			return unknownTradition && e.gr < 3 && e.active;
		});
		return phase && unfamiliarSpells.length >= max;
	}

	isActivationDisabled() {
		const maxSpellsLiturgies = ELStore.getStart().maxSpellsLiturgies;
		return PhaseStore.get() < 3 && this.getAll().filter(e => e.gr < 3 && e.active).length >= maxSpellsLiturgies;
	}

	getGroupNames() {
		return ['Spruch', 'Ritual', 'Fluch', 'Lied'];
	}

	getPropertyNames() {
		return ['Antimagie', 'Dämonisch', 'Einfluss', 'Elementar', 'Heilung', 'Hellsicht', 'Illusion', 'Sphären', 'Objekt', 'Telekinese', 'Verwandlung'];
	}

	getTraditionNames() {
		return ['Allgemein', 'Gildenmagier', 'Hexen', 'Elfen', 'Druiden', 'Scharlatane', 'Zauberbarden', 'Zaubertänzer', 'Intuitive Zauberer', 'Meistertalentierte', 'Qabalyamagier', 'Kristallomanten', 'Geoden', 'Alchimisten', 'Schelme'];
	}

	getSortOrder() {
		return this.sortOrder;
	}

	private updateSortOrder(option: string) {
		this.sortOrder = option;
	}
}

export const SpellsStore = new SpellsStoreStatic();

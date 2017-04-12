import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';
import AppDispatcher from '../dispatcher/AppDispatcher';
import APStore from '../stores/APStore';
import ELStore from '../stores/ELStore';
import { get, getAllByCategory } from './ListStore';
import Store from './Store';

type Action = ReceiveHeroDataAction | SelectRaceAction | SelectCultureAction | SelectProfessionAction | SetProfessionsSortOrderAction | SetProfessionsVisibilityFilterAction | ReceiveInitialDataAction | CreateHeroAction;

class ProfessionStoreStatic extends Store {
	private readonly category: PROFESSIONS = Categories.PROFESSIONS;
	private currentId: string | null = null;
	private sortOrder = 'name';
	private visibilityFilter = 'common';
	readonly dispatchToken: string;

	constructor() {
		super();
		this.dispatchToken = AppDispatcher.register((action: Action) => {
			switch (action.type) {
				case ActionTypes.RECEIVE_INITIAL_DATA:
					this.sortOrder = action.payload.config.professionsSortOrder;
					this.visibilityFilter = action.payload.config.professionsVisibilityFilter;
					break;

				case ActionTypes.RECEIVE_HERO_DATA:
					this.updateCurrentID(action.payload.data.p);
					break;

				case ActionTypes.CREATE_HERO:
				case ActionTypes.SELECT_RACE:
				case ActionTypes.SELECT_CULTURE:
					this.updateCurrentID(null);
					break;

				case ActionTypes.SELECT_PROFESSION:
					AppDispatcher.waitFor([APStore.dispatchToken]);
					this.updateCurrentID(action.payload.id);
					break;

				case ActionTypes.SET_PROFESSIONS_SORT_ORDER:
					this.updateSortOrder(action.payload.sortOrder);
					break;

				case ActionTypes.SET_PROFESSIONS_VISIBILITY_FILTER:
					this.updateView(action.payload.filter);
					break;

				default:
					return true;
			}
			this.emitChange();
			return true;
		});
	}

	getAll() {
		return getAllByCategory(this.category) as ProfessionInstance[];
	}

	getAllValid() {
		const allEntries = getAllByCategory(this.category) as ProfessionInstance[];
		return allEntries.filter(e => {
			const requires = e.requires;
			return !requires.some(d => {
				if (typeof d.id === 'string') {
					const entry = get(d.id);
					if (entry.category === Categories.ATTRIBUTES && entry.value > ELStore.getStart().maxAttributeValue) {
						return true;
					}
					return false;
				}
				return false;
			});
		});
	}

	getCurrentId() {
		return this.currentId;
	}

	getCurrent() {
		return this.currentId !== null ? get(this.currentId) as ProfessionInstance : undefined;
	}

	getCurrentName() {
		const current = this.getCurrent();
		return current ? current.name : undefined;
	}

	getSortOrder() {
		return this.sortOrder;
	}

	areAllVisible() {
		return this.visibilityFilter;
	}

	private updateCurrentID(id: string | null) {
		this.currentId = id;
	}

	private updateSortOrder(option: string) {
		this.sortOrder = option;
	}

	private updateView(view: string) {
		this.visibilityFilter = view;
	}
}

const ProfessionStore = new ProfessionStoreStatic();

export default ProfessionStore;

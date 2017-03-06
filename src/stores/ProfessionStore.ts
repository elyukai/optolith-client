import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';
import AppDispatcher from '../dispatcher/AppDispatcher';
import APStore from '../stores/APStore';
import { get, getAllByCategory } from './ListStore';
import Store from './Store';

type Action = ReceiveHeroDataAction | SelectRaceAction | SelectCultureAction | SelectProfessionAction | SetProfessionsSortOrderAction | SetProfessionsVisibilityFilterAction;

class ProfessionStoreStatic extends Store {
	private readonly category: PROFESSIONS = Categories.PROFESSIONS;
	private currentId: string | null = null;
	private sortOrder = 'name';
	private showAll = 'common';
	readonly dispatchToken: string;

	constructor() {
		super();
		this.dispatchToken = AppDispatcher.register((action: Action) => {
			switch (action.type) {
				case ActionTypes.RECEIVE_HERO_DATA:
					this.updateCurrentID(action.payload.data.p);
					break;

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
		return this.showAll;
	}

	private updateCurrentID(id: string | null) {
		this.currentId = id;
	}

	private updateSortOrder(option: string) {
		this.sortOrder = option;
	}

	private updateView(view: string) {
		this.showAll = view;
	}
}

const ProfessionStore = new ProfessionStoreStatic();

export default ProfessionStore;

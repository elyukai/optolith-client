import { SelectCultureAction } from '../actions/CultureActions';
import { ReceiveInitialDataAction } from '../actions/FileActions';
import { CreateHeroAction, LoadHeroAction } from '../actions/HerolistActions';
import { SelectProfessionAction, SetProfessionsGroupVisibilityFilterAction, SetProfessionsSortOrderAction, SetProfessionsVisibilityFilterAction, SwitchProfessionsExpansionVisibilityFilterAction } from '../actions/ProfessionActions';
import { SelectRaceAction } from '../actions/RaceActions';
import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';
import { AppDispatcher } from '../dispatcher/AppDispatcher';
import { APStore } from '../stores/APStore';
import { ELStore } from '../stores/ELStore';
import { ProfessionInstance } from '../types/data.d';
import { validate } from '../utils/RequirementUtils';
import { get, getAllByCategory } from './ListStore';
import { Store } from './Store';

type Action = LoadHeroAction | SelectRaceAction | SelectCultureAction | SelectProfessionAction | SetProfessionsSortOrderAction | SetProfessionsVisibilityFilterAction | ReceiveInitialDataAction | CreateHeroAction | SetProfessionsGroupVisibilityFilterAction | SwitchProfessionsExpansionVisibilityFilterAction;

class ProfessionStoreStatic extends Store {
	private readonly category = Categories.PROFESSIONS;
	private currentId?: string;
	private sortOrder = 'name';
	private visibilityFilter = 'common';
	private groupVisibilityFilter = 0;
	private expansionVisibilityFilter = false;
	readonly dispatchToken: string;

	constructor() {
		super();
		this.dispatchToken = AppDispatcher.register((action: Action) => {
			switch (action.type) {
				case ActionTypes.RECEIVE_INITIAL_DATA:
					this.sortOrder = action.payload.config.professionsSortOrder;
					this.visibilityFilter = action.payload.config.professionsVisibilityFilter;
					this.groupVisibilityFilter = action.payload.config.professionsGroupVisibilityFilter;
					this.expansionVisibilityFilter = action.payload.config.professionsFromExpansionsVisibility;
					break;

				case ActionTypes.LOAD_HERO:
					this.updateCurrentID(action.payload.data.p);
					break;

				case ActionTypes.CREATE_HERO:
				case ActionTypes.SELECT_RACE:
				case ActionTypes.SELECT_CULTURE:
					this.updateCurrentID(undefined);
					break;

				case ActionTypes.SELECT_PROFESSION:
					AppDispatcher.waitFor([APStore.dispatchToken]);
					this.updateCurrentID(action.payload.id);
					break;

				case ActionTypes.SET_PROFESSIONS_SORT_ORDER:
					this.updateSortOrder(action.payload.sortOrder);
					break;

				case ActionTypes.SET_PROFESSIONS_VISIBILITY_FILTER:
					this.updateVisibilityFilter(action.payload.filter);
					break;

				case ActionTypes.SET_PROFESSIONS_GROUP_VISIBILITY_FILTER:
					this.updateGroupVisibilityFilter(action.payload.filter);
					break;

				case ActionTypes.SWITCH_PROFESSIONS_EXPANSION_VISIBILITY_FILTER:
					this.updateExpansionVisibilityFilter();
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
			return validate(e.dependencies, e.id) && !requires.some(d => {
				if (typeof d.id === 'string') {
					const entry = get(d.id);
					if (typeof entry !== 'undefined' && entry.category === Categories.ATTRIBUTES && entry.value > ELStore.getStart().maxAttributeValue) {
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
		return this.currentId !== undefined ? get(this.currentId) as ProfessionInstance : undefined;
	}

	getCurrentName() {
		const current = this.getCurrent();
		return current ? current.name : undefined;
	}

	getSortOrder() {
		return this.sortOrder;
	}

	getVisibilityFilter() {
		return this.visibilityFilter;
	}

	getGroupVisibilityFilter() {
		return this.groupVisibilityFilter;
	}

	getExpansionVisibilityFilter() {
		return this.expansionVisibilityFilter;
	}

	private updateCurrentID(id?: string) {
		this.currentId = id;
	}

	private updateSortOrder(option: string) {
		this.sortOrder = option;
	}

	private updateVisibilityFilter(filter: string) {
		this.visibilityFilter = filter;
	}

	private updateGroupVisibilityFilter(filter: number) {
		this.groupVisibilityFilter = filter;
	}

	private updateExpansionVisibilityFilter() {
		this.expansionVisibilityFilter = !this.expansionVisibilityFilter;
	}
}

export const ProfessionStore = new ProfessionStoreStatic();

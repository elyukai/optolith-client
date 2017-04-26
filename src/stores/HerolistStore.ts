import { ReceiveImportedHeroAction, ReceiveInitialDataAction } from '../actions/FileActions';
import { CreateHeroAction, DeleteHeroAction, LoadHeroAction, SaveHeroAction, SetHerolistSortOrderAction, SetHerolistVisibilityFilterAction } from '../actions/HerolistActions';
import * as ActionTypes from '../constants/ActionTypes';
import { AppDispatcher } from '../dispatcher/AppDispatcher';
import { Hero, HeroForSave, ItemInstance, User } from '../types/data.d';
import { RawHerolist, RawHeroNew } from '../types/rawdata.d';
import { alert } from '../utils/alert';
import * as FileAPIUtils from '../utils/FileAPIUtils';
import { Store } from './Store';

type Action = SetHerolistSortOrderAction | SetHerolistVisibilityFilterAction | CreateHeroAction | LoadHeroAction | SaveHeroAction | DeleteHeroAction | ReceiveInitialDataAction | ReceiveImportedHeroAction;

class HerolistStoreStatic extends Store {
	private byHeroId: { [id: string]: Hero} = {};
	private allHeroIds: string[] = [];
	private byUserId: { [id: string]: User} = {};
	private allUserIds: string[] = [];
	private currentId?: string;
	private sortOrder = 'name';
	private view = 'all';
	readonly dispatchToken: string;

	constructor() {
		super();
		this.dispatchToken = AppDispatcher.register((action: Action) => {
			switch (action.type) {
				case ActionTypes.CREATE_HERO:
					this.currentId = undefined;
					break;

				case ActionTypes.LOAD_HERO:
					this.currentId = action.payload.data.id;
					break;

				case ActionTypes.SAVE_HERO:
					this.saveHero(action.payload.data);
					break;

				case ActionTypes.DELETE_HERO:
					this.deleteHero(action.payload.id);
					break;

				case ActionTypes.SET_HEROLIST_SORT_ORDER:
					this.updateSortOrder(action.payload.sortOrder);
					break;

				case ActionTypes.SET_HEROLIST_VISIBILITY_FILTER:
					this.updateView(action.payload.filterOption);
					break;

				case ActionTypes.RECEIVE_INITIAL_DATA:
					this.updateHeroes(action.payload.heroes);
					break;

				case ActionTypes.RECEIVE_IMPORTED_HERO:
					this.importHero(action.payload.data);
					break;

				default:
					return true;
			}
			this.emitChange();
			return true;
		});
	}

	get(id: string) {
		return this.byHeroId[id];
	}

	getUser(id: string) {
		return this.byUserId[id];
	}

	getAll() {
		return this.allHeroIds.map(e => this.byHeroId[e]);
	}

	getSortOrder() {
		return this.sortOrder;
	}

	getView() {
		return this.view;
	}

	getCurrentId() {
		return this.currentId;
	}

	getForSave(id: string) {
		const { player: playerId, ...hero } = this.byHeroId[id];
		const raw: RawHeroNew = {
			...hero,
			id,
			dateCreated: hero.dateCreated.toJSON(),
			dateModified: hero.dateModified.toJSON(),
		};
		if (playerId) {
			raw.player = this.byUserId[playerId];
		}
		return raw;
	}

	getAllForSave() {
		return this.byHeroId;
	}

	private updateSortOrder(option: string) {
		this.sortOrder = option;
	}

	private updateView(view: string) {
		this.view = view;
	}

	private updateHeroes(heroes: RawHerolist) {
		this.byHeroId = {};
		this.byUserId = {};
		if (Array.isArray(heroes)) {
			heroes.forEach(hero => {
				const { id, player, pv, spells, chants, belongings, ...other } = hero;
				const { items, ...otherBelongings } = belongings;
				const newId = `H_${new Date(hero.dateCreated).valueOf()}`;
				const newLiturgies: { [id: string]: number; } = {};
				const newBlessings: string[] = [];
				const newCantrips: string[] = [];
				const newSpells: { [id: string]: number; } = {};
				const newItems: { [id: string]: ItemInstance } = {};
				for (const id in chants) {
					if (chants.hasOwnProperty(id)) {
						const number = Number.parseInt(id.split('_')[1]);
						if (number > 40) {
							newBlessings.push(`BLESSING_${number - 40}`);
						}
						else {
							newLiturgies[id] = chants[id] as number;
						}
					}
				}
				for (const id in spells) {
					if (spells.hasOwnProperty(id)) {
						const number = Number.parseInt(id.split('_')[1]);
						if (number > 67) {
							newCantrips.push(`CANTRIP_${number - 67}`);
						}
						else {
							newSpells[id] = spells[id] as number;
						}
					}
				}
				for (const id in items) {
					if (items.hasOwnProperty(id)) {
						const { ammunition, ...other } = items[id];
						newItems[id] = {
							...other,
							ammunition: typeof ammunition === 'string' ? ammunition : undefined
						};
					}
				}
				this.byHeroId[newId] = {
					...other,
					id: newId,
					pv: typeof pv === 'string' ? pv : undefined,
					spells: newSpells,
					liturgies: newLiturgies,
					cantrips: newCantrips,
					blessings: newBlessings,
					belongings: {
						...otherBelongings,
						items: newItems
					},
					pets: {},
					dateCreated: new Date(hero.dateCreated),
					dateModified: new Date(hero.dateModified),
				};
				if (player) {
					this.byHeroId[newId].player = player.id;
					this.byUserId[player.id] = player;
				}
			});
		}
		else {
			Object.keys(heroes).forEach(key => {
				const hero = heroes[key];
				const { id, player, ...other } = hero;
				this.byHeroId[id] = {
					...other,
					id,
					dateCreated: new Date(hero.dateCreated),
					dateModified: new Date(hero.dateModified),
				};
				if (player) {
					this.byHeroId[id].player = player.id;
					this.byUserId[player.id] = player;
				}
			});
		}
		this.allHeroIds = Object.keys(this.byHeroId);
		this.allUserIds = Object.keys(this.byUserId);
	}

	private saveHero(data: HeroForSave) {
		const id = this.currentId;
		if (typeof id === 'string') {
			const player = this.byHeroId[id].player;
			this.byHeroId[id] = {
				...data,
				id
			};
			if (player) {
				this.byHeroId[id].player = player;
			}
		}
		else {
			const newId = this.getNewId();
			this.byHeroId[newId] = {
				...data,
				id: newId,
				dateCreated: new Date(),
				dateModified: new Date()
			};
			this.allHeroIds.push(newId);
		}
		FileAPIUtils.saveAll();
		alert('Alles gespeichert');
	}

	private deleteHero(id: string) {
		delete this.byHeroId[id];
		this.allHeroIds.splice(this.allHeroIds.findIndex(e => e === id), 1);
		FileAPIUtils.saveAll();
	}

	private importHero(hero: RawHeroNew) {
		const newId = this.getNewId();
		const { player, ...other } = hero;
		this.byHeroId[newId] = {
			...other,
			newId,
			dateCreated: new Date(hero.dateCreated),
			dateModified: new Date(hero.dateModified),
		};
		if (player) {
			this.byHeroId[newId].player = player.id;
			this.byUserId[player.id] = player;
			this.allUserIds.push(player.id);
		}
		this.allHeroIds.push(newId);
		FileAPIUtils.saveAll();
	}

	private getNewId() {
		const newIdNumber = Date.now();
		return `HI_${newIdNumber}`;
	}
}

export const HerolistStore = new HerolistStoreStatic();

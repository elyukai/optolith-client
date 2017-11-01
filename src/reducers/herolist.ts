import { CreateHeroAction, DeleteHeroAction, DuplicateHeroAction, LoadHeroAction, SaveHeroAction } from '../actions/HerolistActions';
import { ReceiveImportedHeroAction, ReceiveInitialDataAction } from '../actions/IOActions';
import * as ActionTypes from '../constants/ActionTypes';
import { Hero, User } from '../types/data.d';
import { removeListItem, setListItem } from '../utils/ListUtils';
import { convertHero } from '../utils/VersionUtils';

type Action = CreateHeroAction | LoadHeroAction | SaveHeroAction | DeleteHeroAction | ReceiveInitialDataAction | ReceiveImportedHeroAction | DuplicateHeroAction;

export interface HerolistState {
	heroes: Map<string, Hero>;
	users: Map<string, User>;
	currentId?: string;
}

const initialState: HerolistState = {
	heroes: new Map(),
	users: new Map()
};

export function herolist(state: HerolistState = initialState, action: Action): HerolistState {
	switch (action.type) {
		case ActionTypes.CREATE_HERO:
			return { ...state, currentId: undefined };

		case ActionTypes.LOAD_HERO:
			return { ...state, currentId: action.payload.data.id };

		case ActionTypes.SAVE_HERO: {
			const { id, ...other } = action.payload.data;
			return {
				...state,
				currentId: id,
				heroes: setListItem(state.heroes, id, {
					...other,
					id
				})
			};
		}

		case ActionTypes.DELETE_HERO: {
			const { id } = action.payload;
			const hero = state.heroes.get(id);
			const heroes = removeListItem(state.heroes, id);
			let users = state.users;
			if (hero && hero.player && [...heroes.values()].every(e => e.player !== hero.player)) {
				users = removeListItem(users, hero.player);
			}
			return { ...state, heroes, users };
		}

		case ActionTypes.RECEIVE_INITIAL_DATA: {
			const { heroes: rawHeroes } = action.payload;
			const heroes = new Map<string, Hero>();
			const users = new Map<string, User>();
			for (const [key, hero] of Object.entries(rawHeroes)) {
				const { player, ...other } = hero;
				const finalHero: Hero = {
					...other,
					id: key,
					dateCreated: new Date(hero.dateCreated),
					dateModified: new Date(hero.dateModified),
				};
				if (player) {
					finalHero.player = player.id;
					users.set(player.id, player);
				}
				heroes.set(key, convertHero(finalHero));
			}
			return { ...state, heroes, users };
		}

		case ActionTypes.RECEIVE_IMPORTED_HERO: {
			const { data, player } = action.payload;
			let users = state.users;
			if (player) {
				data.player = player.id;
				users = setListItem(users, player.id, player);
			}
			const heroes = setListItem(state.heroes, data.id, data);
			return { ...state, heroes, users };
		}

		case ActionTypes.DUPLICATE_HERO: {
			const { id, newId } = action.payload;
			const hero = state.heroes.get(id);
			if (hero) {
				const heroes = setListItem(state.heroes, newId, { ...hero, id: newId });
				return { ...state, heroes };
			}
			return state;
		}

		default:
			return state;
	}
}

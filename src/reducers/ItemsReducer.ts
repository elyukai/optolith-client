/// <reference path="../data.d.ts" />
/// <reference path="../raw.d.ts" />

import * as ActionTypes from '../constants/ActionTypes';
import * as Categories from '../constants/Categories';
import { AddItemAction, RemoveItemAction, SetItemAction } from '../actions/InventoryActions';
import { ReceiveDataTablesAction, ReceiveHeroDataAction } from '../actions/ServerActions';

type Action = ReceiveDataTablesAction | ReceiveHeroDataAction |AddItemAction | RemoveItemAction | SetItemAction;

export interface ItemsState {
	readonly templatesById: {
		[id: string]: ItemInstance;
	};
	readonly templates: string[];

	readonly byId: {
		[id: string]: ItemInstance;
	};
	readonly allIds: string[];
}

function init({ id, name, price, weight, number, where, gr, combatTechnique, damageDiceNumber, damageDiceSides, damageFlat, damageBonus, at, pa, reach, length, stp, range, reloadTime, ammunition, pro, enc, addPenalties, template }: RawItem): ItemInstance {
	return {
		id,
		name,
		price,
		weight,
		number,
		gr,

		combatTechnique,
		damageDiceNumber,
		damageDiceSides,
		damageFlat,
		damageBonus,
		at,
		pa,
		reach,
		length,
		stp,
		range,
		reloadTime,
		ammunition,
		pro,
		enc,
		addPenalties,

		where,
		template,
		isTemplateLocked: true
	}
}

const initialState = <ItemsState>{};

export default (state: ItemsState = initialState, action: Action): ItemsState => {
	switch (action.type) {
		case ActionTypes.RECEIVE_DATA_TABLES: {
			const templatesById: { [id: string]: ItemInstance } = {};
			const templates: string[] = [];
			for (const id in action.payload.data.races) {
				templatesById[id] = init(action.payload.data.items[id]);
				templates.push(id);
			}
			return { ...state, templatesById, templates };
		}

		case ActionTypes.RECEIVE_HERO_DATA: {
			const byId: { [id: string]: ItemInstance } = {};
			const allIds: string[] = [];
			for (const id in action.payload.data.items) {
				byId[id] = action.payload.data.items[id];
				allIds.push(id);
			}
			return { ...state, byId, allIds };
		}

		case ActionTypes.ADD_ITEM: {
			const allIds = state.allIds;
			const length = allIds.length;
			const id = 'ITEM_' + (allIds[length - 1] ? allIds[length - 1].split('_')[1] + 1 : 1);
			return {
				...state,
				byId: { ...state.byId, [id]: action.payload.data },
				allIds: [ ...state.allIds, id ]
			}
		}

		case ActionTypes.SET_ITEM:
			return {
				...state,
				byId: { ...state.byId, [action.payload.id]: action.payload.data }
			}

		case ActionTypes.REMOVE_ITEM: {
			const { [action.payload.id]: deletedItem, ...rest } = state.byId;
			return {
				...state,
				byId: rest,
				allIds: state.allIds.filter(e => !action.payload.id)
			}
		}

		default:
			return state;
	}
}

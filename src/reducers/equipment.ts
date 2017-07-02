import { AddArmorZonesAction, AddItemAction, RemoveArmorZonesAction, RemoveItemAction, SetArmorZonesAction, SetDucatesAction, SetHellersAction, SetItemAction, SetKreutzersAction, SetSilverthalersAction } from '../actions/EquipmentActions';
import { ReceiveInitialDataAction } from '../actions/FileActions';
import { CreateHeroAction, LoadHeroAction } from '../actions/HerolistActions';
import * as ActionTypes from '../constants/ActionTypes';
import { ArmorZonesInstance, ItemInstance, ToListById } from '../types/data.d';
import { mergeIntoList, removeListItem, setListItem } from '../utils/ListUtils';

type Action = AddItemAction | RemoveItemAction | SetItemAction | LoadHeroAction | SetDucatesAction | SetSilverthalersAction | SetHellersAction | SetKreutzersAction | ReceiveInitialDataAction | AddArmorZonesAction | RemoveArmorZonesAction | SetArmorZonesAction | CreateHeroAction;

export interface EquipmentState {
	items: Map<string, ItemInstance>;
	itemTemplates: Map<string, ItemInstance>;
	armorZones: Map<string, ArmorZonesInstance>;
	purse: {
		d: string;
		h: string;
		k: string;
		s: string;
	};
}

const initialState: EquipmentState = {
	items: new Map(),
	itemTemplates: new Map(),
	armorZones: new Map(),
	purse: {
		d: '0',
		h: '0',
		k: '0',
		s: '0',
	}
};

export function equipment(state: EquipmentState = initialState, action: Action): EquipmentState {
	switch (action.type) {
		case ActionTypes.RECEIVE_INITIAL_DATA:
			throw new Error();

		case ActionTypes.CREATE_HERO:
			return clear();

		case ActionTypes.SET_DUCATES:
			return { ...state, purse: { ...state.purse, d: action.payload.value } };

		case ActionTypes.SET_SILVERTHALERS:
			return { ...state, purse: { ...state.purse, s: action.payload.value } };

		case ActionTypes.SET_HELLERS:
			return { ...state, purse: { ...state.purse, h: action.payload.value } };

		case ActionTypes.SET_KREUTZERS:
			return { ...state, purse: { ...state.purse, k: action.payload.value } };

		case ActionTypes.ADD_ITEM:
		case ActionTypes.SET_ITEM: {
			const { data, id } = action.payload;
			return { ...state, items: setListItem(state.items, id, { ...data, id }) };
		}

		case ActionTypes.REMOVE_ITEM: {
			const { id } = action.payload;
			return {
				...state,
				items: removeListItem(state.items, action.payload.id),
				armorZones: mergeIntoList(state.armorZones, new Map([...state.armorZones].filter(([_, obj]) => {
					return obj.head === id || obj.torso === id || obj.leftArm === id || obj.rightArm === id || obj.leftLeg === id || obj.rightLeg === id;
				}).map(([key, obj]): [string, ArmorZonesInstance] => {
					if (obj.head === id) {
						obj.head = undefined;
					}
					if (obj.torso === id) {
						obj.torso = undefined;
					}
					if (obj.leftArm === id) {
						obj.leftArm = undefined;
					}
					if (obj.rightArm === id) {
						obj.rightArm = undefined;
					}
					if (obj.leftLeg === id) {
						obj.leftLeg = undefined;
					}
					if (obj.rightLeg === id) {
						obj.rightLeg = undefined;
					}
					return [key, obj];
				})))
			};
		}

		case ActionTypes.ADD_ARMOR_ZONES:
		case ActionTypes.SET_ARMOR_ZONES: {
			const { data, id } = action.payload;
			return { ...state, armorZones: setListItem(state.armorZones, id, { ...data, id }) };
		}

		case ActionTypes.REMOVE_ARMOR_ZONES:
			return { ...state, armorZones: removeListItem(state.armorZones, action.payload.id) };

		case ActionTypes.LOAD_HERO:
			const { belongings: { items, purse, armorZones } } = action.payload.data;
			const itemsMap = new Map<string, ItemInstance>();
			const armorZonesMap = new Map<string, ArmorZonesInstance>();
			for (const id in items) {
				if (items.hasOwnProperty(id)) {
					itemsMap.set(id, items[id]);
				}
			}
			for (const id in armorZones) {
				if (armorZones.hasOwnProperty(id)) {
					armorZonesMap.set(id, armorZones[id]);
				}
			}
			return {
				...state,
				items: itemsMap,
				armorZones: armorZonesMap,
				purse
			};

		default:
			return state;
	}
}

function clear(): EquipmentState {
	return {
		items: new Map(),
		itemTemplates: new Map(),
		armorZones: new Map(),
		purse: {
			d: '0',
			h: '0',
			k: '0',
			s: '0'
		}
	};
}

export function getForSave(state: EquipmentState) {
	const { armorZones, items, purse } = state;
	const itemsObj: ToListById<ItemInstance> = {};
	for (const [id, item] of items) {
		itemsObj[id] = item;
	}
	const armorZonesObj: ToListById<ArmorZonesInstance> = {};
	for (const [id, item] of armorZones) {
		armorZonesObj[id] = item;
	}
	return {
		items: itemsObj,
		armorZones: armorZonesObj,
		purse
	};
}

import { AddArmorZonesAction, AddItemAction, RemoveArmorZonesAction, RemoveItemAction, SetArmorZonesAction, SetDucatesAction, SetHellersAction, SetItemAction, SetItemsSortOrderAction, SetKreutzersAction, SetSilverthalersAction } from '../actions/EquipmentActions';
import { ReceiveInitialDataAction } from '../actions/FileActions';
import { LoadHeroAction } from '../actions/HerolistActions';
import * as ActionTypes from '../constants/ActionTypes';
import { AppDispatcher } from '../dispatcher/AppDispatcher';
import { ArmorZonesInstance, Hero, ItemInstance } from '../types/data.d';
import { RawItem } from '../types/rawdata.d';
import { initItem } from '../utils/InitUtils';
import { Store } from './Store';

type Action = AddItemAction | RemoveItemAction | SetItemAction | SetItemsSortOrderAction | LoadHeroAction | SetDucatesAction | SetSilverthalersAction | SetHellersAction | SetKreutzersAction | ReceiveInitialDataAction | AddArmorZonesAction | RemoveArmorZonesAction | SetArmorZonesAction;

class EquipmentStoreStatic extends Store {
	private itemsById: { [id: string]: ItemInstance } = {};
	private items: string[] = [];
	private itemTemplatesById: { [id: string]: ItemInstance } = {};
	private itemTemplates: string[] = [];
	private armorZonesById: { [id: string]: ArmorZonesInstance } = {};
	private armorZones: string[] = [];
	private sortOrder = 'name';
	private purse = {
		d: '0',
		h: '0',
		k: '0',
		s: '0',
	};
	readonly dispatchToken: string;

	constructor() {
		super();
		this.dispatchToken = AppDispatcher.register((action: Action) => {
			switch (action.type) {
				case ActionTypes.RECEIVE_INITIAL_DATA:
					this.updateSortOrder(action.payload.config.equipmentSortOrder);
					this.init(action.payload.tables.items);
					break;

				case ActionTypes.SET_ITEMS_SORT_ORDER:
					this.sortOrder = action.payload.sortOrder;
					break;

				case ActionTypes.SET_DUCATES:
					this.purse.d = action.payload.value;
					break;

				case ActionTypes.SET_SILVERTHALERS:
					this.purse.s = action.payload.value;
					break;

				case ActionTypes.SET_HELLERS:
					this.purse.h = action.payload.value;
					break;

				case ActionTypes.SET_KREUTZERS:
					this.purse.k = action.payload.value;
					break;

				case ActionTypes.ADD_ITEM:
					this.addItem(action.payload.data, 'ITEM_' + (this.items[this.items.length - 1] ? this.items[this.items.length - 1].split('_')[1] + 1 : 1));
					break;

				case ActionTypes.SET_ITEM:
					this.saveItem(action.payload.id, action.payload.data);
					break;

				case ActionTypes.REMOVE_ITEM:
					this.removeItem(action.payload.id);
					break;

				case ActionTypes.ADD_ARMOR_ZONES:
					this.addArmorZones(action.payload.data, 'ARMORZONES_' + (this.armorZones[this.armorZones.length - 1] ? this.armorZones[this.armorZones.length - 1].split('_')[1] + 1 : 1));
					break;

				case ActionTypes.SET_ARMOR_ZONES:
					this.saveArmorZones(action.payload.id, action.payload.data);
					break;

				case ActionTypes.REMOVE_ARMOR_ZONES:
					this.removeArmorZones(action.payload.id);
					break;

				case ActionTypes.LOAD_HERO:
					this.updateAll(action.payload.data);
					break;

				default:
					return true;
			}
			this.emitChange();
			return true;
		});
	}

	get(id: string) {
		return this.itemsById[id];
	}

	getArmorZones(id: string) {
		return this.armorZonesById[id];
	}

	getAll() {
		return this.items.map(e => this.itemsById[e]);
	}

	getAllById() {
		return this.itemsById;
	}

	getTemplate(id: string) {
		return this.itemTemplatesById[id];
	}

	getAllTemplates() {
		return this.itemTemplates.map(e => this.itemTemplatesById[e]);
	}

	getAllArmorZones() {
		return this.armorZones.map(e => this.armorZonesById[e]);
	}

	getAllArmorZonesById() {
		return this.armorZonesById;
	}

	getSortOrder() {
		return this.sortOrder;
	}

	getPurse() {
		return this.purse;
	}

	getTotalPriceAndWeight() {
		const items = this.getAll();
		const armorZones = this.getAllArmorZones();

		const itemsResult = items.reduce((n, i) => ({
			price: i.price && i.forArmorZoneOnly ? n.price + i.price : n.price,
			weight:  i.weight && i.forArmorZoneOnly ? n.weight + i.weight : n.weight
		}), { price: 0, weight: 0 });

		const armorZonesResult = armorZones.reduce((n, i) => {
			const headArmor: ItemInstance | undefined = i.head ? (this.getTemplate(i.head) || this.get(i.head)) : undefined;
			const torsoArmor: ItemInstance | undefined = i.torso ? (this.getTemplate(i.torso) || this.get(i.torso)) : undefined;
			const leftArmArmor: ItemInstance | undefined = i.leftArm ? (this.getTemplate(i.leftArm) || this.get(i.leftArm)) : undefined;
			const rightArmArmor: ItemInstance | undefined = i.rightArm ? (this.getTemplate(i.rightArm) || this.get(i.rightArm)) : undefined;
			const leftLegArmor: ItemInstance | undefined = i.leftLeg ? (this.getTemplate(i.leftLeg) || this.get(i.leftLeg)) : undefined;
			const rightLegArmor: ItemInstance | undefined = i.rightLeg ? (this.getTemplate(i.rightLeg) || this.get(i.rightLeg)) : undefined;
			const headPrice = headArmor !== undefined ? (headArmor.price || 0) : 0;
			const headWeight = headArmor !== undefined ? (headArmor.weight || 0) : 0;
			const torsoPrice = torsoArmor !== undefined ? (torsoArmor.price || 0) : 0;
			const torsoWeight = torsoArmor !== undefined ? (torsoArmor.weight || 0) : 0;
			const leftArmPrice = leftArmArmor !== undefined ? (leftArmArmor.price || 0) : 0;
			const leftArmWeight = leftArmArmor !== undefined ? (leftArmArmor.weight || 0) : 0;
			const rightArmPrice = rightArmArmor !== undefined ? (rightArmArmor.price || 0) : 0;
			const rightArmWeight = rightArmArmor !== undefined ? (rightArmArmor.weight || 0) : 0;
			const leftLegPrice = leftLegArmor !== undefined ? (leftLegArmor.price || 0) : 0;
			const leftLegWeight = leftLegArmor !== undefined ? (leftLegArmor.weight || 0) : 0;
			const rightLegPrice = rightLegArmor !== undefined ? (rightLegArmor.price || 0) : 0;
			const rightLegWeight = rightLegArmor !== undefined ? (rightLegArmor.weight || 0) : 0;
			return {
				price: n.price + headPrice * 0.1 + torsoPrice * 0.5 + leftArmPrice * 0.1 + rightArmPrice * 0.1 + leftLegPrice * 0.1 + rightLegPrice * 0.1,
				weight: n.weight + headWeight * 0.1 + torsoWeight * 0.5 + leftArmWeight * 0.1 + rightArmWeight * 0.1 + leftLegWeight * 0.1 + rightLegWeight * 0.1
			};
		}, { price: 0, weight: 0 });

		return {
			price: Math.floor((itemsResult.price + armorZonesResult.price) * 100) / 100,
			weight: Math.floor((itemsResult.weight + armorZonesResult.weight) * 100) / 100
		};
	}

	private init(raw: { [id: string]: RawItem }) {
		for (const id in raw) {
			if (raw.hasOwnProperty(id)) {
				this.itemTemplatesById[id] = initItem({ ...raw[id], amount: 1, isTemplateLocked: true });
				this.itemTemplates.push(id);
			}
		}
	}

	private updateAll(hero: Hero) {
		const { belongings: { items, purse, armorZones } } = hero;
		for (const id in items) {
			if (items.hasOwnProperty(id)) {
				this.itemsById[id] = items[id];
				this.items.push(id);
			}
		}
		for (const id in armorZones) {
			if (armorZones.hasOwnProperty(id)) {
				this.armorZonesById[id] = armorZones[id];
				this.armorZones.push(id);
			}
		}
		this.purse = purse;
	}

	private updateSortOrder(option: string) {
		this.sortOrder = option;
	}

	private addItem(raw: ItemInstance, id: string) {
		this.itemsById[id] = { ...raw, id };
		this.items.push(id);
	}

	private saveItem(id: string, item: ItemInstance) {
		this.itemsById[id] = item;
	}

	private removeItem(id: string) {
		delete this.itemsById[id];
		this.items.some((e, i) => {
			if (e === id) {
				this.items.splice(i, 1);
				return true;
			}
			return false;
		});
	}

	private addArmorZones(raw: ArmorZonesInstance, id: string) {
		this.armorZonesById[id] = { ...raw, id };
		this.armorZones.push(id);
	}

	private saveArmorZones(id: string, item: ArmorZonesInstance) {
		this.armorZonesById[id] = item;
	}

	private removeArmorZones(id: string) {
		delete this.armorZonesById[id];
		this.armorZones.some((e, i) => {
			if (e === id) {
				this.armorZones.splice(i, 1);
				return true;
			}
			return false;
		});
	}
}

export const EquipmentStore = new EquipmentStoreStatic();

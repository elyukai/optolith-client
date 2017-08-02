import { AddArmorZonesAction, AddItemAction, RemoveArmorZonesAction, RemoveItemAction, SetArmorZonesAction, SetDucatesAction, SetHellersAction, SetItemAction, SetItemsSortOrderAction, SetKreutzersAction, SetSilverthalersAction } from '../actions/EquipmentActions';
import { ReceiveInitialDataAction } from '../actions/FileActions';
import { CreateHeroAction, LoadHeroAction } from '../actions/HerolistActions';
import * as ActionTypes from '../constants/ActionTypes';

import { ArmorZonesEditorInstance, ArmorZonesInstance, Hero, ItemInstance, ToListById } from '../types/data.d';
import { RawItem, RawLocale } from '../types/rawdata.d';
import { getNewId } from '../utils/IDUtils';
import { initItem } from '../utils/InitUtils';
import { LocaleStore } from './LocaleStore';
import { Store } from './Store';

type Action = AddItemAction | RemoveItemAction | SetItemAction | SetItemsSortOrderAction | LoadHeroAction | SetDucatesAction | SetSilverthalersAction | SetHellersAction | SetKreutzersAction | ReceiveInitialDataAction | AddArmorZonesAction | RemoveArmorZonesAction | SetArmorZonesAction | CreateHeroAction;

class EquipmentStoreStatic extends Store {
	private items = new Map<string, ItemInstance>();
	private itemTemplates = new Map<string, ItemInstance>();
	private armorZones = new Map<string, ArmorZonesInstance>();
	private sortOrder = 'name';
	private purse = {
		d: '0',
		h: '0',
		k: '0',
		s: '0',
	};
	readonly dispatchToken: string;

	get(id: string) {
		return this.items.get(id);
	}

	/**
	 * Inserts the template properties if a template is locked.
	 * @param item The original item instance.
	 */
	getFullItem(item: ItemInstance) {
		const { isTemplateLocked, template, where, amount, id } = item;
		const activeTemplate = typeof template === 'string' && this.getTemplate(template);
		return isTemplateLocked && activeTemplate ? { ...activeTemplate, where, amount, id } : item;
	}

	getArmorZones(id: string) {
		return this.armorZones.get(id);
	}

	getAll() {
		return [...this.items.values()];
	}

	getAllById() {
		return this.items;
	}

	getAllForSave() {
		const obj: ToListById<ItemInstance> = {};
		for (const [id, item] of this.items) {
			obj[id] = item;
		}
		return obj;
	}

	getTemplate(id: string) {
		return this.itemTemplates.get(id);
	}

	getAllTemplates() {
		return [...this.itemTemplates.values()];
	}

	getAllArmorZones() {
		return [...this.armorZones.values()];
	}

	getAllArmorZonesById() {
		return this.armorZones;
	}

	getAllArmorZonesForSave() {
		const obj: ToListById<ArmorZonesInstance> = {};
		for (const [id, item] of this.armorZones) {
			obj[id] = item;
		}
		return obj;
	}

	getSortOrder() {
		return this.sortOrder;
	}

	getPurse() {
		return this.purse;
	}

	getEncumbranceZoneTiers() {
		return [0, 0, 1, 1, 2, 2, 3, 4, 5, 6, 7, 8];
	}

	getZoneArmor(id?: string) {
		if (id) {
			return this.getTemplate(id) || this.get(id);
		}
		return;
	}

	getProtectionAndWeight(item: ArmorZonesInstance) {
		const headArmor = this.getZoneArmor(item.head);
		const torsoArmor = this.getZoneArmor(item.torso);
		const leftArmArmor = this.getZoneArmor(item.leftArm);
		const rightArmArmor = this.getZoneArmor(item.rightArm);
		const leftLegArmor = this.getZoneArmor(item.leftLeg);
		const rightLegArmor = this.getZoneArmor(item.rightLeg);
		const headWeight = headArmor !== undefined ? (headArmor.weight || 0) : 0;
		const headArmorValue = headArmor !== undefined ? (headArmor.pro || 0) : 0;
		const torsoWeight = torsoArmor !== undefined ? (torsoArmor.weight || 0) : 0;
		const torsoArmorValue = torsoArmor !== undefined ? (torsoArmor.pro || 0) : 0;
		const leftArmWeight = leftArmArmor !== undefined ? (leftArmArmor.weight || 0) : 0;
		const leftArmArmorValue = leftArmArmor !== undefined ? (leftArmArmor.pro || 0) : 0;
		const rightArmWeight = rightArmArmor !== undefined ? (rightArmArmor.weight || 0) : 0;
		const rightArmArmorValue = rightArmArmor !== undefined ? (rightArmArmor.pro || 0) : 0;
		const leftLegWeight = leftLegArmor !== undefined ? (leftLegArmor.weight || 0) : 0;
		const leftLegArmorValue = leftLegArmor !== undefined ? (leftLegArmor.pro || 0) : 0;
		const rightLegWeight = rightLegArmor !== undefined ? (rightLegArmor.weight || 0) : 0;
		const rightLegArmorValue = rightLegArmor !== undefined ? (rightLegArmor.pro || 0) : 0;
		return {
			pro: headArmorValue * 1 + torsoArmorValue * 5 + (leftArmArmorValue + rightArmArmorValue + leftLegArmorValue + rightLegArmorValue) * 2,
			weight: torsoWeight * 0.5 + (headWeight + leftArmWeight + rightArmWeight + leftLegWeight + rightLegWeight) * 0.1
		};
	}

	getTotalPriceAndWeight() {
		const items = this.getAll();
		const armorZones = this.getAllArmorZones();

		const itemsResult = items.reduce((n, i) => {
			const { amount = 1, forArmorZoneOnly, gr, price, weight } = i;
			const finalPrice = typeof price === 'number' && amount * price;
			const finalWeight = typeof weight === 'number' && amount * weight;
			return {
				price: finalPrice && !forArmorZoneOnly ? n.price + finalPrice : n.price,
				weight: finalWeight && gr !== 4 ? n.weight + finalWeight : n.weight
			};
		}, { price: 0, weight: 0 });

		const armorZonesResult = armorZones.reduce((n, i) => {
			const headArmor = this.getZoneArmor(i.head);
			const torsoArmor = this.getZoneArmor(i.torso);
			const leftArmArmor = this.getZoneArmor(i.leftArm);
			const rightArmArmor = this.getZoneArmor(i.rightArm);
			const leftLegArmor = this.getZoneArmor(i.leftLeg);
			const rightLegArmor = this.getZoneArmor(i.rightLeg);
			const headPrice = headArmor !== undefined ? (headArmor.price || 0) : 0;
			const torsoPrice = torsoArmor !== undefined ? (torsoArmor.price || 0) : 0;
			const leftArmPrice = leftArmArmor !== undefined ? (leftArmArmor.price || 0) : 0;
			const rightArmPrice = rightArmArmor !== undefined ? (rightArmArmor.price || 0) : 0;
			const leftLegPrice = leftLegArmor !== undefined ? (leftLegArmor.price || 0) : 0;
			const rightLegPrice = rightLegArmor !== undefined ? (rightLegArmor.price || 0) : 0;
			return {
				price: n.price + torsoPrice * 0.5 + (headPrice + leftArmPrice + rightArmPrice + leftLegPrice + rightLegPrice) * 0.1,
			};
		}, { price: 0 });

		return {
			price: Math.floor((itemsResult.price + armorZonesResult.price) * 100) / 100,
			weight: Math.floor(itemsResult.weight * 100) / 100
		};
	}

	private init(raw: { [id: string]: RawItem }, rawlocale: RawLocale) {
		for (const id in raw) {
			if (raw.hasOwnProperty(id)) {
				const result = initItem(raw[id], rawlocale.items);
				if (result) {
					this.itemTemplates.set(id, {...result, amount: 1, isTemplateLocked: true});
				}
			}
		}
	}

	private updateAll(hero: Hero) {
		const { belongings: { items, purse, armorZones } } = hero;
		for (const id in items) {
			if (items.hasOwnProperty(id)) {
				this.items.set(id, items[id]);
			}
		}
		for (const id in armorZones) {
			if (armorZones.hasOwnProperty(id)) {
				this.armorZones.set(id, armorZones[id]);
			}
		}
		this.purse = purse;
	}

	private updateSortOrder(option: string) {
		this.sortOrder = option;
	}

	private addItem(raw: ItemInstance, id: string) {
		this.items.set(id, { ...raw, id });
	}

	private saveItem(id: string, item: ItemInstance) {
		this.items.set(id, item);
	}

	private removeItem(id: string) {
		this.items.delete(id);
		this.armorZones.forEach(obj => {
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
			if (obj.head === id || obj.torso === id || obj.leftArm === id || obj.rightArm === id || obj.leftLeg === id || obj.rightLeg === id) {
				this.saveArmorZones(obj.id, obj);
			}
		});
	}

	private addArmorZones(raw: ArmorZonesEditorInstance, id: string) {
		this.armorZones.set(id, { ...raw, id });
	}

	private saveArmorZones(id: string, item: ArmorZonesInstance) {
		this.armorZones.set(id, item);
	}

	private removeArmorZones(id: string) {
		this.armorZones.delete(id);
	}

	private clear() {
		this.items.clear();
		this.armorZones.clear();
	}

	private getNewItemId() {
		return `ITEM_${getNewId([...this.items.keys()])}`;
	}

	private getNewArmorZoneId() {
		return `ARMORZONES_${getNewId([...this.armorZones.keys()])}`;
	}
}

export const EquipmentStore = new EquipmentStoreStatic();

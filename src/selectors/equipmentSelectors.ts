import { createSelector } from 'reselect';
import { AppState } from '../reducers/app';
import { EquipmentState } from '../reducers/equipment';
import { ArmorZonesInstance, CombatTechniqueInstance, ItemInstance, ToListById } from '../types/data.d';
import { Armor, ArmorZone, Item, MeleeWeapon, RangedWeapon, ShieldOrParryingWeapon } from '../types/view.d';
import { getAt, getPa } from '../utils/CombatTechniqueUtils';
import { sortObjects } from '../utils/FilterSortUtils';
import { convertPrimaryAttributeToArray } from '../utils/ItemUtils';
import { getCombatTechniques } from './combatTechniquesSelectors';
import { get as getInstance, getDependent } from './dependentInstancesSelectors';
import { getHigherParadeValues } from './rulesSelectors';
import { getLocaleMessages } from './stateSelectors';

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

export const getEquipmentState = (state: AppState) => state.currentHero.present.equipment;
export const getItemsState = (state: AppState) => state.currentHero.present.equipment.items;
export const getItemTemplatesState = (state: AppState) => state.currentHero.present.equipment.itemTemplates;
export const getArmorZonesState = (state: AppState) => state.currentHero.present.equipment.armorZones;
export const getPurse = (state: AppState) => state.currentHero.present.equipment.purse;

export function get(state: EquipmentState, id: string) {
	return state.items.get(id);
}

export function getTemplate(state: EquipmentState, id: string) {
	return state.itemTemplates.get(id);
}

export function getZoneArmor(state: EquipmentState, id?: string) {
	if (id) {
		return getTemplate(state, id) || get(state, id);
	}
	return;
}

export function getZoneArmorFn(state: EquipmentState) {
	return (id?: string) => {
		if (id) {
			return getTemplate(state, id) || get(state, id);
		}
		return;
	};
}

export function getFullItem(items: Map<string, ItemInstance>, templates: Map<string, ItemInstance>, id: string) {
	if (items.has(id)) {
		const item = items.get(id)!;
		const { isTemplateLocked, template, where, amount, loss } = item;
		const activeTemplate = typeof template === 'string' && templates.get(template);
		return isTemplateLocked && activeTemplate ? { ...activeTemplate, where, amount, loss, id } : item;
	}
	return templates.get(id)!;
}

export const getTemplates = createSelector(
	getItemTemplatesState,
	templates => [...templates.values()]
);

export const getSortedTemplates = createSelector(
	getTemplates,
	getLocaleMessages,
	(templates, locale) => sortObjects(templates, locale!.id)
);

export const getItems = createSelector(
	getItemsState,
	getItemTemplatesState,
	(items, templates) => [...items.values()].map(e => getFullItem(items, templates, e.id))
);

export const getArmorZoneInstances = createSelector(
	getArmorZonesState,
	armorZones => [...armorZones.values()]
);

export const getAllItems = createSelector(
	getItemsState,
	getArmorZonesState,
	getItemTemplatesState,
	(items, armorZones, templates) => {
		const rawItems = [...items.values()];
		const rawArmorZones = [...armorZones.values()];
		const mappedItems = rawItems.filter(e => e.forArmorZoneOnly !== true).map(({ id }) => {
			const {
				name,
				amount,
				price,
				weight,
				where,
				gr
			} = getFullItem(items, templates, id);
			return {
				id,
				name,
				amount,
				price,
				weight,
				where,
				gr
			} as Item;
		});
		const mappedArmorZones = rawArmorZones.map(item => {
			const {
				id,
				name,
				head,
				torso,
				leftArm,
				rightArm,
				leftLeg,
				rightLeg
			} = item;
			const headArmor = head ? getFullItem(items, templates, head) : undefined;
			const torsoArmor = torso ? getFullItem(items, templates, torso) : undefined;
			const leftArmArmor = leftArm ? getFullItem(items, templates, leftArm) : undefined;
			const rightArmArmor = rightArm ? getFullItem(items, templates, rightArm) : undefined;
			const leftLegArmor = leftLeg ? getFullItem(items, templates, leftLeg) : undefined;
			const rightLegArmor = rightLeg ? getFullItem(items, templates, rightLeg) : undefined;
			const priceTotal = getPriceTotal(headArmor, leftArmArmor, leftLegArmor, rightArmArmor, rightLegArmor, torsoArmor);
			const weightTotal = getWeightTotal(headArmor, leftArmArmor, leftLegArmor, rightArmArmor, rightLegArmor, torsoArmor);
			return {
				id,
				name,
				amount: 1,
				price: priceTotal,
				weight: weightTotal,
				gr: 4
			} as Item;
		});
		return [...mappedArmorZones, ...mappedItems];
	}
);

export const getTotalPrice = createSelector(
	[ getAllItems ],
	items => items.reduce((sum, { amount, price = 0 }) => sum + price * amount, 0)
);

export const getTotalWeight = createSelector(
	[ getAllItems ],
	items => items.reduce((sum, { amount, weight = 0 }) => sum + weight * amount, 0)
);

export const getMeleeWeapons = createSelector(
	getItemsState,
	getDependent,
	getHigherParadeValues,
	getItemTemplatesState,
	(items, dependent, higherParadeValues, templates) => {
		const rawItems = [...items.values()];
		const filteredItems = rawItems.filter(item => {
			return (item.gr === 1 || item.improvisedWeaponGroup === 1) && item.combatTechnique !== 'CT_10';
		});
		return filteredItems.map(({ id }) => {
			const {
				name,
				combatTechnique,
				damageBonus,
				damageDiceNumber,
				damageDiceSides,
				damageFlat: damageFlatBase,
				at: atMod,
				pa: paMod,
				reach,
				stabilityMod,
				loss,
				weight,
				improvisedWeaponGroup,
				isTwoHandedWeapon
			} = getFullItem(items, templates, id);
			const combatTechniqueInstance = getInstance(dependent, combatTechnique!) as CombatTechniqueInstance;
			const atBase = getAt(dependent, combatTechniqueInstance);
			const at = atBase + (atMod || 0);
			const paBase = getPa(dependent, combatTechniqueInstance);
			const pa = paBase && paBase + (atMod || 0) + higherParadeValues;
			const primaryAttributeIds = damageBonus && typeof damageBonus.primary === 'string' ? convertPrimaryAttributeToArray(damageBonus.primary) : combatTechniqueInstance.primary;
			const primaryAttributes = primaryAttributeIds.map(attr => dependent.attributes.get(attr)!);
			const damageThresholds = damageBonus && damageBonus.threshold || 0;
			const damageFlatBonus = Math.max(...(Array.isArray(damageThresholds) ? primaryAttributes.map((e, index) => e.value - damageThresholds[index]) : primaryAttributes.map(e => e.value - damageThresholds)), 0);
			const damageFlat = damageFlatBase! + damageFlatBonus;
			return {
				id,
				name,
				combatTechnique: combatTechniqueInstance.name,
				primary: primaryAttributes.map(e => e.short),
				primaryBonus: damageThresholds,
				damageDiceNumber,
				damageDiceSides,
				damageFlat,
				atMod,
				at,
				paMod,
				pa,
				reach,
				bf: combatTechniqueInstance.bf + (stabilityMod || 0),
				loss,
				weight,
				isImprovisedWeapon: typeof improvisedWeaponGroup === 'number',
				isTwoHandedWeapon
			} as MeleeWeapon;
		});
	}
);

export const getRangedWeapons = createSelector(
	getItemsState,
	getCombatTechniques,
	getDependent,
	getItemTemplatesState,
	(items, combatTechniques, dependent, templates) => {
		const rawItems = [...items.values()];
		const filteredItems = rawItems.filter(item => {
			return item.gr === 2 || item.improvisedWeaponGroup === 2;
		});
		return filteredItems.map(({ id }) => {
			const {
				name,
				combatTechnique,
				reloadTime,
				damageDiceNumber,
				damageDiceSides,
				damageFlat,
				range,
				stabilityMod,
				loss,
				weight,
				ammunition: ammunitionId
			} = getFullItem(items, templates, id);
			const combatTechniqueInstance = combatTechniques.get(combatTechnique!)!;
			const at = getAt(dependent, combatTechniqueInstance);
			const ammunitionInstance = typeof ammunitionId === 'string' && items.get(ammunitionId);
			const ammunition = ammunitionInstance ? ammunitionInstance.name : undefined;
			return {
				id,
				name,
				combatTechnique: combatTechniqueInstance.name,
				reloadTime,
				damageDiceNumber,
				damageDiceSides,
				damageFlat,
				at,
				range,
				bf: combatTechniqueInstance.bf + (stabilityMod || 0),
				loss,
				weight,
				ammunition
			} as RangedWeapon;
		});
	}
);

export const getStabilityByArmorTypeId = (id: number) => [4, 5, 6, 8, 9, 13, 12, 11, 10][id - 1];

export const getEncumbranceZoneTier = (pro: number) => [0, 0, 1, 1, 2, 2, 3, 4, 5, 6, 7, 8][pro - 1];

export const getArmors = createSelector(
	getItemsState,
	getItemTemplatesState,
	(items, templates) => {
		const rawItems = [...items.values()];
		const filteredItems = rawItems.filter(item => item.gr === 4);
		return filteredItems.map(({ id }) => {
			const {
				name,
				armorType,
				stabilityMod,
				loss,
				pro,
				enc,
				addPenalties,
				movMod,
				iniMod,
				weight,
				where
			} = getFullItem(items, templates, id);
			return {
				id,
				name,
				st: armorType && getStabilityByArmorTypeId(armorType) + (stabilityMod || 0),
				loss,
				pro,
				enc,
				mov: (addPenalties ? -1 : 0) + (movMod ? movMod : 0),
				ini: (addPenalties ? -1 : 0) + (iniMod ? iniMod : 0),
				weight,
				where
			} as Armor;
		});
	}
);

export const getArmorZones = createSelector(
	getArmorZonesState,
	getItemsState,
	getItemTemplatesState,
	(armorZones, items, templates) => {
		const rawItems = [...armorZones.values()];
		return rawItems.map(item => {
			const {
				id,
				name,
				head,
				leftArm,
				leftLeg,
				rightArm,
				rightLeg,
				torso
			} = item;
			const headArmor = head ? getFullItem(items, templates, head) : undefined;
			const torsoArmor = torso ? getFullItem(items, templates, torso) : undefined;
			const leftArmArmor = leftArm ? getFullItem(items, templates, leftArm) : undefined;
			const rightArmArmor = rightArm ? getFullItem(items, templates, rightArm) : undefined;
			const leftLegArmor = leftLeg ? getFullItem(items, templates, leftLeg) : undefined;
			const rightLegArmor = rightLeg ? getFullItem(items, templates, rightLeg) : undefined;
			const proTotal = getProtectionTotal(headArmor, leftArmArmor, leftLegArmor, rightArmArmor, rightLegArmor, torsoArmor);
			const weightTotal = getWeightTotal(headArmor, leftArmArmor, leftLegArmor, rightArmArmor, rightLegArmor, torsoArmor);
			return {
				id,
				name,
				head: headArmor ? headArmor.pro : undefined,
				leftArm: leftArmArmor ? leftArmArmor.pro : undefined,
				leftLeg: leftLegArmor ? leftLegArmor.pro : undefined,
				rightArm: rightArmArmor ? rightArmArmor.pro : undefined,
				rightLeg: rightLegArmor ? rightLegArmor.pro : undefined,
				torso: torsoArmor ? torsoArmor.pro : undefined,
				enc: getEncumbranceZoneTier(proTotal),
				addPenalties: [1, 3, 5].includes(proTotal),
				weight: weightTotal
			} as ArmorZone;
		});
	}
);

export const getShieldsAndParryingWeapons = createSelector(
	getItemsState,
	getCombatTechniques,
	getItemTemplatesState,
	(items, combatTechniques, templates) => {
		const rawItems = [...items.values()];
		const filteredItems = rawItems.filter(e => e.gr === 1 && (e.combatTechnique === 'CT_10' || e.isParryingWeapon));
		return filteredItems.map(({ id }) => {
			const {
				name,
				stp,
				combatTechnique,
				stabilityMod,
				loss,
				at,
				pa,
				weight
			} = getFullItem(items, templates, id);
			const combatTechniqueInstance = combatTechniques.get(combatTechnique!)!;
			return {
				id,
				name,
				stp,
				bf: combatTechniqueInstance.bf + (stabilityMod || 0),
				loss,
				atMod: at,
				paMod: pa,
				weight
			} as ShieldOrParryingWeapon;
		});
	}
);

function getProtectionTotal(head?: ItemInstance, leftArm?: ItemInstance, leftLeg?: ItemInstance, rightArm?: ItemInstance, rightLeg?: ItemInstance, torso?: ItemInstance) {
	const getProtection = (item?: ItemInstance) => item ? (item.pro || 0) : 0;
	return Math.ceil((getProtection(head) * 1 + getProtection(torso) * 5 + (getProtection(leftArm) + getProtection(rightArm) + getProtection(leftLeg) + getProtection(rightLeg)) * 2) / 14);
}

function getWeightTotal(head?: ItemInstance, leftArm?: ItemInstance, leftLeg?: ItemInstance, rightArm?: ItemInstance, rightLeg?: ItemInstance, torso?: ItemInstance) {
	const getWeight = (item?: ItemInstance) => item ? (item.weight || 0) : 0;
	return Math.floor((getWeight(torso) * 0.5 + (getWeight(head) + getWeight(leftArm) + getWeight(rightArm) + getWeight(leftLeg) + getWeight(rightLeg)) * 0.1) * 100) / 100;
}

function getPriceTotal(head?: ItemInstance, leftArm?: ItemInstance, leftLeg?: ItemInstance, rightArm?: ItemInstance, rightLeg?: ItemInstance, torso?: ItemInstance) {
	const getPrice = (item?: ItemInstance) => item ? (item.price || 0) : 0;
	return Math.floor((getPrice(torso) * 0.5 + (getPrice(head) + getPrice(leftArm) + getPrice(rightArm) + getPrice(leftLeg) + getPrice(rightLeg)) * 0.1) * 100) / 100;
}

export function getProtectionAndWeight(item: ArmorZonesInstance, getZoneArmor: (id?: string | undefined) => ItemInstance | undefined) {
	const headArmor = getZoneArmor(item.head);
	const torsoArmor = getZoneArmor(item.torso);
	const leftArmArmor = getZoneArmor(item.leftArm);
	const rightArmArmor = getZoneArmor(item.rightArm);
	const leftLegArmor = getZoneArmor(item.leftLeg);
	const rightLegArmor = getZoneArmor(item.rightLeg);
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

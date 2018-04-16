import { ItemEditorInstance, ItemInstance, SourceLink } from '../types/data.d';

export function convertToEdit(item: ItemInstance): ItemEditorInstance {
	const { note: _, rules: _1, advantage: _2, disadvantage: _3, src: _4, ...otherProperties } = item;

	return {
		...otherProperties,
		amount: typeof item.amount === 'number' ? item.amount.toString() : '',
		at: typeof item.at === 'number' ? item.at.toString() : '',
		damageBonus: item.damageBonus ? Array.isArray(item.damageBonus.threshold) ? { ...item.damageBonus, threshold: item.damageBonus.threshold.map(e => e.toString()) } : { ...item.damageBonus, threshold: item.damageBonus.threshold.toString() } : { threshold: '' },
		damageDiceNumber: typeof item.damageDiceNumber === 'number' ? item.damageDiceNumber.toString() : '',
		damageFlat: typeof item.damageFlat === 'number' ? item.damageFlat.toString() : '',
		enc: typeof item.enc === 'number' ? item.enc.toString() : '',
		length: typeof item.length === 'number' ? item.length.toString() : '',
		pa: typeof item.pa === 'number' ? item.pa.toString() : '',
		price: typeof item.price === 'number' ? item.price.toString() : '',
		pro: typeof item.pro === 'number' ? item.pro.toString() : '',
		range: (item.range ? item.range.map(e => e.toString()) : ['', '', '']) as [string, string, string],
		reloadTime: typeof item.reloadTime === 'number' ? item.reloadTime.toString() : '',
		stp: typeof item.stp === 'number' ? item.stp.toString() : '',
		weight: typeof item.weight === 'number' ? item.weight.toString() : '',
		movMod: typeof item.movMod === 'number' ? item.movMod.toString() : '',
		iniMod: typeof item.iniMod === 'number' ? item.iniMod.toString() : '',
		stabilityMod: typeof item.stabilityMod === 'number' ? item.stabilityMod.toString() : '',
	};
}

export function convertToSave(item: ItemEditorInstance): ItemInstance {
	const { movMod, iniMod, stabilityMod, improvisedWeaponGroup, ...other } = item;
	const add: {
		movMod?: number;
		iniMod?: number;
		stabilityMod?: number;
		improvisedWeaponGroup?: number;
	} = {};
	if (movMod && Number.parseInt(movMod.replace(/\,/, '.')) > 0) {
		add.movMod = Number.parseInt(movMod.replace(/\,/, '.'));
	}
	if (iniMod && Number.parseInt(iniMod.replace(/\,/, '.')) > 0) {
		add.iniMod = Number.parseInt(iniMod.replace(/\,/, '.'));
	}
	if (stabilityMod && !Number.isNaN(Number.parseInt(stabilityMod.replace(/\,/, '.')))) {
		add.stabilityMod = Number.parseInt(stabilityMod.replace(/\,/, '.'));
	}
	if (typeof improvisedWeaponGroup === 'number') {
		add.improvisedWeaponGroup = improvisedWeaponGroup;
	}
	return {
		...other,
		amount: item.amount ? Number.parseInt(item.amount.replace(/\,/, '.')) : 1,
		at: item.at ? Number.parseInt(item.at.replace(/\,/, '.')) : 0,
		damageBonus: (Array.isArray(item.damageBonus.threshold) ? item.damageBonus.threshold.every(e => e.length > 0) : item.damageBonus.threshold.length > 0) ? Array.isArray(item.damageBonus.threshold) ? { ...item.damageBonus, threshold: item.damageBonus.threshold.map(e => Number.parseInt(e)) } : { ...item.damageBonus, threshold: Number.parseInt(item.damageBonus.threshold) } : undefined,
		damageDiceNumber: item.damageDiceNumber ? Number.parseInt(item.damageDiceNumber.replace(/\,/, '.')) : 0,
		damageFlat: item.damageFlat ? Number.parseInt(item.damageFlat.replace(/\,/, '.')) : 0,
		enc: item.enc ? Number.parseInt(item.enc.replace(/\,/, '.')) : 0,
		length: item.length ? Number.parseFloat(item.length.replace(/\,/, '.')) : 0,
		pa: item.pa ? Number.parseInt(item.pa.replace(/\,/, '.')) : 0,
		price: item.price ? Number.parseFloat(item.price.replace(/\,/, '.')) : 0,
		pro: item.pro ? Number.parseInt(item.pro.replace(/\,/, '.')) : 0,
		range: item.range.map(e => e ? Number.parseInt(e.replace(/\,/, '.')) : 0) as [number, number, number],
		reloadTime: item.reloadTime ? Number.parseInt(item.reloadTime.replace(/\,/, '.')) : 0,
		stp: item.stp ? Number.parseInt(item.stp.replace(/\,/, '.')) : 0,
		weight: item.weight ? Number.parseFloat(item.weight.replace(/\,/, '.')) : 0,
		...add
	};
}

export function containsNaN(item: ItemInstance): string[] | false {
	const keys = Object.keys(item) as (keyof ItemInstance)[];
	const arrayFilter = (value: [number, number, number] | SourceLink[]): value is [number, number, number] => value.length === 0 || typeof value[0] === 'number';
	const filtered = keys.filter(e => {
		const element = item[e];
		if (Array.isArray(element)) {
			return !arrayFilter(element) || element.every(i => Number.isNaN(i));
		}
		else if (typeof element === 'number') {
			return Number.isNaN(element);
		}
		return false;
	});
	if (filtered.length === 0) {
		return false;
	}
	return filtered;
}

export function convertPrimaryAttributeToArray(id: string): string[] {
	const [attr, ...ids] = id.split(/_/);
	return ids.map(e => `${attr}_${e}`);
}

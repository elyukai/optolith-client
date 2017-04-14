export function convertToEdit(item: ItemInstance): ItemEditorInstance {
	return {
		...item,
		amount: item.amount ? item.amount.toString() : '',
		at: item.at ? item.at.toString() : '',
		damageBonus: item.damageBonus ? item.damageBonus.toString() : '',
		damageDiceNumber: item.damageDiceNumber ? item.damageDiceNumber.toString() : '',
		damageFlat: item.damageFlat ? item.damageFlat.toString() : '',
		enc: item.enc ? item.enc.toString() : '',
		length: item.length ? item.length.toString() : '',
		pa: item.pa ? item.pa.toString() : '',
		price: item.price ? item.price.toString() : '',
		pro: item.pro ? item.pro.toString() : '',
		range: item.range ? item.range.map(e => e.toString()) : ['', '', ''] as [string, string, string],
		reloadTime: item.reloadTime ? item.reloadTime.toString() : '',
		stp: item.stp ? item.stp.toString() : '',
		weight: item.weight ? item.weight.toString() : '',
		addMOVPenalty: item.addMOVPenalty ? item.addMOVPenalty.toString() : '',
		addINIPenalty: item.addINIPenalty ? item.addINIPenalty.toString() : '',
		stabilityMod: item.stabilityMod ? item.stabilityMod.toString() : '',
	};
}

export function convertToSave(item: ItemEditorInstance): ItemInstance {
	const { addMOVPenalty, addINIPenalty, stabilityMod, improvisedWeaponGroup, ...other } = item;
	const add: {
		addGSPenalty?: number;
		addINIPenalty?: number;
		stabilityMod?: number;
		improvisedWeaponGroup?: number;
	} = {};
	if (addMOVPenalty && Number.parseInt(addMOVPenalty.replace(/\,/, '.')) > 0) {
		add.addGSPenalty = Number.parseInt(addMOVPenalty.replace(/\,/, '.'));
	}
	if (addINIPenalty && Number.parseInt(addINIPenalty.replace(/\,/, '.')) > 0) {
		add.addINIPenalty = Number.parseInt(addINIPenalty.replace(/\,/, '.'));
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
		damageBonus: item.damageBonus ? Number.parseInt(item.damageBonus.replace(/\,/, '.')) : 0,
		damageDiceNumber: item.damageDiceNumber ? Number.parseInt(item.damageDiceNumber.replace(/\,/, '.')) : 0,
		damageFlat: item.damageFlat ? Number.parseInt(item.damageFlat.replace(/\,/, '.')) : 0,
		enc: item.enc ? Number.parseInt(item.enc.replace(/\,/, '.')) : 0,
		length: item.length ? Number.parseFloat(item.length.replace(/\,/, '.')) : 0,
		pa: item.pa ? Number.parseInt(item.pa.replace(/\,/, '.')) : 0,
		price: item.price ? Number.parseFloat(item.price.replace(/\,/, '.')) : 0,
		pro: item.pro ? Number.parseInt(item.pro.replace(/\,/, '.')) : 0,
		range: item.range.map(e => e ? Number.parseInt(e.replace(/\,/, '.')) : 0),
		reloadTime: item.reloadTime ? Number.parseInt(item.reloadTime.replace(/\,/, '.')) : 0,
		stp: item.stp ? Number.parseInt(item.stp.replace(/\,/, '.')) : 0,
		weight: item.weight ? Number.parseFloat(item.weight.replace(/\,/, '.')) : 0,
		...add
	};
}

export function containsNaN(item: ItemInstance): string[] | false {
	const keys = Object.keys(item);
	const filtered = keys.filter((e: keyof ItemInstance) => {
		const element = item[e];
		if (Array.isArray(element)) {
			return element.every(i => Number.isNaN(i));
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

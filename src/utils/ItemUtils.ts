export const convertToEdit = (item: ItemInstance) => ({
	...item,
	at: item.at.toString(),
	damageBonus: item.damageBonus.toString(),
	damageDiceNumber: item.damageDiceNumber.toString(),
	damageFlat: item.damageFlat.toString(),
	enc: item.enc.toString(),
	length: item.length.toString(),
	amount: item.amount.toString(),
	pa: item.pa.toString(),
	price: item.price.toString(),
	pro: item.pro.toString(),
	range: item.range.map(e => e.toString()),
	reloadTime: item.reloadTime.toString(),
	stp: item.stp.toString(),
	weight: item.weight.toString()
});

export const convertToSave = (item: ItemEditorInstance) => ({
	...item,
	at: Number.parseInt(item.at.replace(/\,/, '.')),
	damageBonus: Number.parseInt(item.damageBonus.replace(/\,/, '.')),
	damageDiceNumber: Number.parseInt(item.damageDiceNumber.replace(/\,/, '.')),
	damageFlat: Number.parseInt(item.damageFlat.replace(/\,/, '.')),
	enc: Number.parseInt(item.enc.replace(/\,/, '.')),
	length: Number.parseInt(item.length.replace(/\,/, '.')),
	amount: Number.parseInt(item.amount.replace(/\,/, '.')),
	pa: Number.parseInt(item.pa.replace(/\,/, '.')),
	price: Number.parseInt(item.price.replace(/\,/, '.')),
	pro: Number.parseInt(item.pro.replace(/\,/, '.')),
	range: item.range.map(e => Number.parseInt(e.replace(/\,/, '.'))),
	reloadTime: Number.parseInt(item.reloadTime.replace(/\,/, '.')),
	stp: Number.parseInt(item.stp.replace(/\,/, '.')),
	weight: Number.parseInt(item.weight.replace(/\,/, '.'))
});

export const containsNaN = (item: ItemInstance) => {
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
};

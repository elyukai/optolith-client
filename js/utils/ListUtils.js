import SpellsStore from '../stores/SpellsStore';

export const filter = (list, filterText, addProperty) => {
	if (filterText !== '') {
		filterText = filterText.toLowerCase();
		return list.filter(obj => obj.name.toLowerCase().match(filterText) && (!addProperty || obj[addProperty].toLowerCase().match(filterText)));
	}
	return list;
};

export const sortByName = (a,b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0;

var SEX;

export const sortByNameSex = (a,b) => {
	let an = a.name[SEX] || a.name;
	let bn = b.name[SEX] || b.name;
	return an < bn ? -1 : an > bn ? 1 : 0;
};

export const sortByCost = (a,b) => a.ap < b.ap ? -1 : a.ap > b.ap ? 1 : sortByName(a,b);

export const sortByCostSex = (a,b) => a.ap < b.ap ? -1 : a.ap > b.ap ? 1 : sortByNameSex(a,b);

export const sortByGroup = (a,b) => a.gr < b.gr ? -1 : a.gr > b.gr ? 1 : sortByName(a,b);

export const sortByIC = (a,b) => a.ic < b.ic ? -1 : a.ic > b.ic ? 1 : sortByName(a,b);

export const sortByProperty = (a,b) => {
	const PROPERTIES = SpellsStore.getPropertyNames();
	let ap = PROPERTIES[a.property - 1];
	let bp = PROPERTIES[b.property - 1];
	return ap < bp ? -1 : ap > bp ? 1 : sortByName(a,b);
};

export const sortByAspect = (a,b) => {
	return a.aspect < b.aspect ? -1 : a.aspect > b.aspect ? 1 : sortByName(a,b);
};

export const sortByPrice = (a,b) => a.price < b.price ? -1 : a.price > b.price ? 1 : sortByName(a,b);

export const sortByWeight = (a,b) => a.weight < b.weight ? -1 : a.weight > b.weight ? 1 : sortByName(a,b);

export const sort = (list, sortOrder) => {
	let sort;
	switch (sortOrder) {
		case 'name':
			sort = sortByName;
			break;
		case 'cost':
			sort = sortByCost;
			break;
		case 'group':
			sort = sortByGroup;
			break;
		case 'ic':
			sort = sortByIC;
			break;
		case 'property':
			sort = sortByProperty;
			break;
		case 'aspect':
			sort = sortByAspect;
			break;
		case 'price':
			sort = sortByPrice;
			break;
		case 'weight':
			sort = sortByWeight;
			break;
		
		default:
			return list;
	}
	return list.sort(sort);
};

export const sortSex = (list, sortOrder, sex) => {
	let sort;
	switch (sortOrder) {
		case 'name':
			sort = sortByNameSex;				
			break;
		case 'cost':
			sort = sortByCostSex;				
			break;
		
		default:
			return list;
	}
	SEX = sex;
	return list.sort(sort);
};

export const filterAndSort = (list, filterText, sortOrder, sex) => {
	if (sex) {
		return sortSex(filter(list, filterText), sortOrder, sex);		
	}
	return sort(filter(list, filterText), sortOrder);
};

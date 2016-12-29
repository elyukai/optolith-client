import AttributeStore from '../stores/AttributeStore';
import { get, getPrimaryAttrID } from '../stores/ListStore';

export interface SecondaryAttribute {
	id: string;
	short: string;
	name: string;
	calc: string;
	base?: number;
	add?: number;
	mod?: number;
	value: number | string;
	maxAdd?: number;
	currentAdd?: number;
}

const baseValues = () => AttributeStore.getBaseValues();

export const getLP = (): SecondaryAttribute => {
	let base = baseValues().le + get('CON').value * 2;
	let mod = 0;
	let add = baseValues().leAdd;
	let value;
	if (get('ADV_25').active) {
		mod += get('ADV_25').tier;
	}
	else if (get('DISADV_28').active) {
		mod -= get('DISADV_28').tier;
	}
	value = base + mod + add;
	return {
		id: 'LP',
		short: 'LE',
		name: 'Lebensenergie',
		calc: '(GW der Spezies + KO + KO)',
		base,
		mod,
		value,
		maxAdd: get('CON').value,
		currentAdd: add
	};
};

export const getAE = (): SecondaryAttribute => {
	let primary = getPrimaryAttrID(1);
	let base = 0;
	let mod = 0;
	let add = baseValues().aeAdd;
	let value: string | number = '-';
	if (primary !== 'ATTR_0') {
		base = 20 + get(primary).value;
	}
	if (get('ADV_23').active) {
		mod += get('ADV_23').tier;
	}
	else if (get('DISADV_26').active) {
		mod -= get('DISADV_26').tier;
	}
	value = primary !== 'ATTR_0' ? base + mod + add : value;
	return {
		id: 'AE',
		short: 'AE',
		name: 'Astralenergie',
		calc: '(20 durch Zauberer + Leiteigenschaft)',
		base,
		mod,
		add,
		value,
		maxAdd: (get(primary) || {}).value,
		currentAdd: add
	};
};

export const getKP = (): SecondaryAttribute => {
	let primary = getPrimaryAttrID(2);
	let base = 0;
	let mod = 0;
	let add = baseValues().keAdd;
	let value: string | number = '-';
	if (primary !== 'ATTR_0') {
		base = 20 + get(primary).value;
	}
	if (get('ADV_24').active) {
		mod += get('ADV_24').tier;
	}
	else if (get('DISADV_27').active) {
		mod -= get('DISADV_27').tier;
	}
	value = primary !== 'ATTR_0' ? base + mod + add : value;
	return {
		id: 'KP',
		short: 'KE',
		name: 'Karmaenergie',
		calc: '(20 durch Geweiht + Leiteigenschaft)',
		base,
		mod,
		add,
		value,
		maxAdd: (get(primary) || {}).value,
		currentAdd: add
	};
};

export const getSPI = (): SecondaryAttribute => {
	let base = baseValues().sk + Math.round((get('COU').value + get('SGC').value + get('INT').value) / 6);
	let mod = 0;
	let value;
	if (get('ADV_26').active) {
		mod++;
	}
	else if (get('DISADV_29').active) {
		mod--;
	}
	value = base + mod;
	return {
		id: 'SPI',
		short: 'SK',
		name: 'Seelenkraft',
		calc: '(GW der Spezies + (MU + KL + IN)/6)',
		base,
		mod,
		value
	};
};

export const getTOU = (): SecondaryAttribute => {
	let base = baseValues().zk + Math.round((get('CON').value * 2 + get('STR').value) / 6);
	let mod = 0;
	let value;
	if (get('ADV_27').active) {
		mod++;
	}
	else if (get('DISADV_30').active) {
		mod--;
	}
	value = base + mod;
	return {
		id: 'TOU',
		short: 'ZK',
		name: 'Zähigkeit',
		calc: '(GW der Spezies + (KO + KO + KK)/6)',
		base,
		mod,
		value
	};
};

export const getDO = (): SecondaryAttribute => ({
	id: 'DO',
	short: 'AW',
	name: 'Ausweichen',
	calc: '(GE/2)',
	value: Math.round(get('AGI').value / 2)
});

export const getINI = (): SecondaryAttribute => ({
	id: 'INI',
	short: 'INI',
	name: 'Initiative',
	calc: '(MU + GE)/2',
	value: Math.round((get('COU').value + get('AGI').value) / 2)
});

export const getMOV = (): SecondaryAttribute => {
	let value = baseValues().gs;
	if (get('DISADV_51').active.includes(3)) {
		value = Math.round(value / 2);
	}
	return {
		id: 'MOV',
		short: 'GS',
		name: 'Geschwindigkeit',
		calc: '(GW der Spezies, mögl. Einbeinig)',
		value
	};
};

const _get = (id: string): SecondaryAttribute => {
	switch (id) {
		case 'LP':
			return getLP();
		case 'AE':
			return getAE();
		case 'KP':
			return getKP();
		case 'SPI':
			return getSPI();
		case 'TOU':
			return getTOU();
		case 'DO':
			return getDO();
		case 'INI':
			return getINI();
		case 'MOV':
			return getMOV();
	}
};

export { _get as get };

export const getAll = (): SecondaryAttribute[] => [
	getLP(),
	getAE(),
	getKP(),
	getSPI(),
	getTOU(),
	getDO(),
	getINI(),
	getMOV()
];

export default getAll;

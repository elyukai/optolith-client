import AttributeStore from '../stores/AttributeStore';
import RaceStore from '../stores/RaceStore';
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

const PRIMARY = (id: string) => get(id) as Attribute;
const COU = () => get('COU') as Attribute;
const SGC = () => get('SGC') as Attribute;
const INT = () => get('INT') as Attribute;
const AGI = () => get('AGI') as Attribute;
const CON = () => get('CON') as Attribute;
const STR = () => get('STR') as Attribute;

type ids = 'LP' | 'AE' | 'KP' | 'SPI' | 'TOU' | 'DO' | 'INI' | 'MOV';

const addEnergies = () => AttributeStore.getAddEnergies();

export const getLP = (): SecondaryAttribute => {
	const base = RaceStore.getCurrent().lp + CON().value * 2;
	let mod = 0;
	const add = addEnergies().lp;
	if (get('ADV_25').active) {
		mod += get('ADV_25').tier;
	}
	else if (get('DISADV_28').active) {
		mod -= get('DISADV_28').tier;
	}
	const value = base + mod + add;
	return {
		id: 'LP',
		short: 'LE',
		name: 'Lebensenergie',
		calc: '(GW der Spezies + KO + KO)',
		base,
		mod,
		value,
		maxAdd: CON().value,
		currentAdd: add
	};
};

export const getAE = (): SecondaryAttribute => {
	const primary = getPrimaryAttrID(1);
	let base = 0;
	let mod = 0;
	const add = addEnergies().ae;
	if (primary !== 'ATTR_0') {
		base = 20 + PRIMARY(primary).value;
	}
	if (get('ADV_23').active) {
		mod += get('ADV_23').tier;
	}
	else if (get('DISADV_26').active) {
		mod -= get('DISADV_26').tier;
	}
	const value = primary !== 'ATTR_0' ? base + mod + add : '-';
	return {
		id: 'AE',
		short: 'AE',
		name: 'Astralenergie',
		calc: '(20 durch Zauberer + Leiteigenschaft)',
		base,
		mod,
		add,
		value,
		maxAdd: (PRIMARY(primary) || {}).value,
		currentAdd: add
	};
};

export const getKP = (): SecondaryAttribute => {
	const primary = getPrimaryAttrID(2);
	let base = 0;
	let mod = 0;
	const add = addEnergies().kp;
	if (primary !== 'ATTR_0') {
		base = 20 + PRIMARY(primary).value;
	}
	if (get('ADV_24').active) {
		mod += get('ADV_24').tier;
	}
	else if (get('DISADV_27').active) {
		mod -= get('DISADV_27').tier;
	}
	const value = primary !== 'ATTR_0' ? base + mod + add : '-';
	return {
		id: 'KP',
		short: 'KE',
		name: 'Karmaenergie',
		calc: '(20 durch Geweiht + Leiteigenschaft)',
		base,
		mod,
		add,
		value,
		maxAdd: (PRIMARY(primary) || {}).value,
		currentAdd: add
	};
};

export const getSPI = (): SecondaryAttribute => {
	const base = RaceStore.getCurrent().spi + Math.round((COU().value + SGC().value + INT().value) / 6);
	let mod = 0;
	if (get('ADV_26').active) {
		mod++;
	}
	else if (get('DISADV_29').active) {
		mod--;
	}
	const value = base + mod;
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
	const base = RaceStore.getCurrent().tou + Math.round((CON().value * 2 + STR().value) / 6);
	let mod = 0;
	if (get('ADV_27').active) {
		mod++;
	}
	else if (get('DISADV_30').active) {
		mod--;
	}
	const value = base + mod;
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
	value: Math.round(AGI().value / 2)
});

export const getINI = (): SecondaryAttribute => ({
	id: 'INI',
	short: 'INI',
	name: 'Initiative',
	calc: '(MU + GE)/2',
	value: Math.round((COU().value + AGI().value) / 2)
});

export const getMOV = (): SecondaryAttribute => {
	let value = RaceStore.getCurrent().mov;
	if ((get('DISADV_51') as Disadvantage).active.includes(3)) {
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

const _get = (id: ids): SecondaryAttribute => {
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

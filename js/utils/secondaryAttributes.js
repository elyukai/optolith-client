import AttributeStore from '../stores/AttributeStore';
import { get, getPrimaryAttrID } from '../stores/ListStore';

const baseValues = () => AttributeStore.getBaseValues();

export const getLP = () => {
	let value = baseValues().le + get('CON').value * 2 + baseValues().leAdd;
	if (get('ADV_25').active) {
		value += get('ADV_25').tier;
	}
	else if (get('DISADV_28').active) {
		value -= get('DISADV_28').tier;
	}
	return {
		id: 'LP',
		label: 'LE',
		value,
		maxAdd: get('CON'),
		currentAdd: baseValues().leAdd
	};
};

export const getAE = () => {
	let primary = getPrimaryAttrID(1);
	let value;
	if (primary === 'ATTR_0') {
		value = '-';
	}
	else {
		value = 20 + get(primary).value + baseValues().aeAdd;
		if (get('ADV_23').active) {
			value += get('ADV_23').tier;
		}
		else if (get('DISADV_26').active) {
			value -= get('DISADV_26').tier;
		}
	}
	return {
		id: 'AE',
		label: 'AE',
		value,
		maxAdd: get(primary),
		currentAdd: baseValues().aeAdd
	};
};

export const getKP = () => {
	let primary = getPrimaryAttrID(2);
	let value;
	if (primary === 'ATTR_0') {
		value = '-';
	}
	else {
		value = 20 + get(primary).value + baseValues().keAdd;
		if (get('ADV_24').active) {
			value += get('ADV_24').tier;
		}
		else if (get('DISADV_27').active) {
			value -= get('DISADV_27').tier;
		}
	}
	return {
		id: 'KP',
		label: 'KE',
		value,
		maxAdd: get(primary),
		currentAdd: baseValues().keAdd
	};
};

export const getSPI = () => {
	let value = baseValues().sk + Math.round((get('COU').value + get('SGC').value + get('INT').value) / 6);
	if (get('ADV_26').active) {
		value++;
	}
	else if (get('DISADV_29').active) {
		value--;
	}
	return {
		id: 'SPI',
		label: 'SK',
		value
	};
};

export const getTOU = () => {
	let value = baseValues().zk + Math.round((get('CON').value * 2 + get('STR').value) / 6);
	if (get('ADV_27').active) {
		value++;
	}
	else if (get('DISADV_30').active) {
		value--;
	}
	return {
		id: 'TOU',
		label: 'ZK',
		value
	};
};

export const getDO = () => ({
	id: 'DO',
	label: 'AW',
	value: Math.round(get('AGI').value / 2)
});

export const getINI = () => ({
	id: 'INI',
	label: 'INI',
	value: Math.round((get('COU').value + get('AGI').value) / 2)
});

export const getMOV = () => ({
	id: 'MOV',
	label: 'GS',
	value: baseValues().gs
});

const _get = id => {
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

export const getAll = () => [
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

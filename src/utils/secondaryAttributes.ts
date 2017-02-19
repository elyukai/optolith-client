import AttributeStore from '../stores/AttributeStore';
import RaceStore from '../stores/RaceStore';
import { get, getPrimaryAttrID } from '../stores/ListStore';

const PRIMARY = (id: string) => get(id) as AttributeInstance;
const COU = () => get('COU') as AttributeInstance;
const SGC = () => get('SGC') as AttributeInstance;
const INT = () => get('INT') as AttributeInstance;
const AGI = () => get('AGI') as AttributeInstance;
const CON = () => get('CON') as AttributeInstance;
const STR = () => get('STR') as AttributeInstance;

type ids = 'LP' | 'AE' | 'KP' | 'SPI' | 'TOU' | 'DO' | 'INI' | 'MOV';

const addEnergies = () => AttributeStore.getAddEnergies();

export const getLP = (): Energy => {
	const base = RaceStore.getCurrent().lp + CON().value * 2;
	let mod = 0;
	const add = addEnergies().lp;
	const increaseObject = (get('ADV_25') as AdvantageInstance).active[0];
	const decreaseObject = (get('DISADV_28') as DisadvantageInstance).active[0];
	if (increaseObject) {
		mod += increaseObject.tier!;
	}
	else if (decreaseObject) {
		mod -= decreaseObject.tier!;
	}
	const value = base + mod + add;
	return {
		id: 'LP',
		short: 'LE',
		name: 'Lebensenergie',
		calc: '(GW der Spezies + KO + KO)',
		add,
		base,
		mod,
		value,
		maxAdd: CON().value,
		currentAdd: add
	};
};

export const getAE = (): EnergyWithLoss => {
	const primary = getPrimaryAttrID(1);
	let base = 0;
	let mod = 0;
	const add = addEnergies().ae;
	const permanentLost = addEnergies().permanentAE.lost;
	const permanentRedeemed = addEnergies().permanentAE.redeemed;
	if (primary !== 'ATTR_0') {
		base = 20 + PRIMARY(primary).value;
	}
	const increaseObject = (get('ADV_23') as AdvantageInstance).active[0];
	const decreaseObject = (get('DISADV_26') as DisadvantageInstance).active[0];
	if (increaseObject) {
		mod += increaseObject.tier!;
	}
	else if (decreaseObject) {
		mod -= decreaseObject.tier!;
	}
	const value = primary !== 'ATTR_0' ? base + mod + add + permanentRedeemed - permanentLost : '-';
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
		currentAdd: add,
		permanentLost,
		permanentRedeemed
	};
};

export const getKP = (): EnergyWithLoss => {
	const primary = getPrimaryAttrID(2);
	let base = 0;
	let mod = 0;
	const add = addEnergies().kp;
	const permanentLost = addEnergies().permanentKP.lost;
	const permanentRedeemed = addEnergies().permanentKP.redeemed;
	if (primary !== 'ATTR_0') {
		base = 20 + PRIMARY(primary).value;
	}
	const increaseObject = (get('ADV_24') as AdvantageInstance).active[0];
	const decreaseObject = (get('DISADV_27') as DisadvantageInstance).active[0];
	if (increaseObject) {
		mod += increaseObject.tier!;
	}
	else if (decreaseObject) {
		mod -= decreaseObject.tier!;
	}
	const value = primary !== 'ATTR_0' ? base + mod + add + permanentRedeemed - permanentLost : '-';
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
		currentAdd: add,
		permanentLost,
		permanentRedeemed
	};
};

export const getSPI = (): SecondaryAttribute => {
	const base = RaceStore.getCurrent().spi + Math.round((COU().value + SGC().value + INT().value) / 6);
	let mod = 0;
	const increaseObject = (get('ADV_26') as AdvantageInstance).active[0];
	const decreaseObject = (get('DISADV_29') as DisadvantageInstance).active[0];
	if (increaseObject) {
		mod++;
	}
	else if (decreaseObject) {
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
	const increaseObject = (get('ADV_27') as AdvantageInstance).active[0];
	const decreaseObject = (get('DISADV_30') as DisadvantageInstance).active[0];
	if (increaseObject) {
		mod++;
	}
	else if (decreaseObject) {
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
	if ((get('DISADV_51') as DisadvantageInstance).active.includes(3)) {
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

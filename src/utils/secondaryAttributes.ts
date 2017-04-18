import AttributeStore from '../stores/AttributeStore';
import { get, getPrimaryAttrID } from '../stores/ListStore';
import RaceStore from '../stores/RaceStore';

const PRIMARY = (id: string) => get(id) as AttributeInstance;
const COU = () => get('COU') as AttributeInstance;
const SGC = () => get('SGC') as AttributeInstance;
const INT = () => get('INT') as AttributeInstance;
const AGI = () => get('AGI') as AttributeInstance;
const CON = () => get('CON') as AttributeInstance;
const STR = () => get('STR') as AttributeInstance;

type ids = 'LP' | 'AE' | 'KP' | 'SPI' | 'TOU' | 'DO' | 'INI' | 'MOV';

const addEnergies = () => AttributeStore.getAddEnergies();

export function getLP(): Energy {
	const base = RaceStore.getCurrent()!.lp + CON().value * 2;
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
		add,
		base,
		calc: '(GW der Spezies + KO + KO)',
		currentAdd: add,
		id: 'LP',
		maxAdd: CON().value,
		mod,
		name: 'Lebensenergie',
		short: 'LE',
		value,
	};
}

export function getAE(): EnergyWithLoss {
	const primary = getPrimaryAttrID(1);
	let base = 0;
	let mod = 0;
	const add = addEnergies().ae;
	const permanentLost = addEnergies().permanentAE.lost;
	const permanentRedeemed = addEnergies().permanentAE.redeemed;
	if (primary) {
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
	const value = primary ? base + mod + add + permanentRedeemed - permanentLost : '-';
	return {
		add,
		base,
		calc: '(20 durch Zauberer + Leiteigenschaft)',
		currentAdd: add,
		id: 'AE',
		maxAdd: (primary ? PRIMARY(primary) : { value: 0 }).value,
		mod,
		name: 'Astralenergie',
		permanentLost,
		permanentRedeemed,
		short: 'AE',
		value,
	};
}

export function getKP(): EnergyWithLoss {
	const primary = getPrimaryAttrID(2);
	let base = 0;
	let mod = 0;
	const add = addEnergies().kp;
	const permanentLost = addEnergies().permanentKP.lost;
	const permanentRedeemed = addEnergies().permanentKP.redeemed;
	if (primary) {
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
	const value = primary ? base + mod + add + permanentRedeemed - permanentLost : '-';
	return {
		add,
		base,
		calc: '(20 durch Geweiht + Leiteigenschaft)',
		currentAdd: add,
		id: 'KP',
		maxAdd: (primary ? PRIMARY(primary) : { value: 0 }).value,
		mod,
		name: 'Karmaenergie',
		permanentLost,
		permanentRedeemed,
		short: 'KE',
		value,
	};
}

export function getSPI(): SecondaryAttribute {
	const base = RaceStore.getCurrent()!.spi + Math.round((COU().value + SGC().value + INT().value) / 6);
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
		base,
		calc: '(GW der Spezies + (MU + KL + IN)/6)',
		id: 'SPI',
		mod,
		name: 'Seelenkraft',
		short: 'SK',
		value,
	};
}

export function getTOU(): SecondaryAttribute {
	const base = RaceStore.getCurrent()!.tou + Math.round((CON().value * 2 + STR().value) / 6);
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
		base,
		calc: '(GW der Spezies + (KO + KO + KK)/6)',
		id: 'TOU',
		mod,
		name: 'Zähigkeit',
		short: 'ZK',
		value,
	};
}

export function getDO(): SecondaryAttribute {
	const base = Math.round(AGI().value / 2);
	const value = base;
	return {
		calc: '(GE/2)',
		id: 'DO',
		name: 'Ausweichen',
		short: 'AW',
		base,
		value
	};
}

export function getINI(): SecondaryAttribute {
	const base = Math.round((COU().value + AGI().value) / 2);
	const value = base;
	return {
		calc: '(MU + GE)/2',
		id: 'INI',
		name: 'Initiative',
		short: 'INI',
		base,
		value
	};
}

export function getMOV(): SecondaryAttribute {
	const base = RaceStore.getCurrent()!.mov;
	let value = base;
	if ((get('DISADV_51') as DisadvantageInstance).active.includes(3)) {
		value = Math.round(value / 2);
	}
	return {
		calc: '(GW der Spezies, mögl. Einbeinig)',
		id: 'MOV',
		name: 'Geschwindigkeit',
		short: 'GS',
		base,
		value
	};
}

function _get(id: ids): SecondaryAttribute {
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
}

export { _get as get };

export function getAll(): SecondaryAttribute[] {
	return [
		getLP(),
		getAE(),
		getKP(),
		getSPI(),
		getTOU(),
		getDO(),
		getINI(),
		getMOV(),
	];
}

export default getAll;

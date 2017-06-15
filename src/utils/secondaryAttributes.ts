import { last } from 'lodash';
import { AttributeStore } from '../stores/AttributeStore';
import { get, getPrimaryAttrID } from '../stores/ListStore';
import { RaceStore } from '../stores/RaceStore';
import { AdvantageInstance, AttributeInstance, DisadvantageInstance, Energy, EnergyWithLoss, SecondaryAttribute, SpecialAbilityInstance } from '../types/data.d';
import { isActive } from './ActivatableUtils';
import { getLocale, translate } from './I18n';

const PRIMARY = (id: string) => get(id) as AttributeInstance;
const COU = () => get('COU') as AttributeInstance;
const SGC = () => get('SGC') as AttributeInstance;
const INT = () => get('INT') as AttributeInstance;
const AGI = () => get('AGI') as AttributeInstance;
const CON = () => get('CON') as AttributeInstance;
const STR = () => get('STR') as AttributeInstance;

type ids = 'LP' | 'AE' | 'KP' | 'SPI' | 'TOU' | 'DO' | 'INI' | 'MOV' | 'WS';

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
		calc: translate('secondaryattributes.lp.calc'),
		currentAdd: add,
		id: 'LP',
		maxAdd: CON().value,
		mod,
		name: translate('secondaryattributes.lp.name'),
		short: translate('secondaryattributes.lp.short'),
		value,
	};
}

export function getAE(): EnergyWithLoss {
	const lastTradition = last((get('SA_86') as SpecialAbilityInstance).active);
	const primary = getPrimaryAttrID(1);
	let base = 0;
	let mod = 0;
	let maxAdd = 0;
	const add = addEnergies().ae;
	const permanentLost = addEnergies().permanentAE.lost;
	const permanentRedeemed = addEnergies().permanentAE.redeemed;
	if (primary && (lastTradition === 6 || lastTradition === 7)) {
		maxAdd = Math.round(PRIMARY(primary).value / 2);
	}
	else if (primary) {
		maxAdd = PRIMARY(primary).value;
	}
	if (maxAdd > 0) {
		base = 20 + maxAdd;
	}
	else if (isActive(get('ADV_50') as AdvantageInstance) && typeof lastTradition === 'number') {
		base = 20;
	}
	const increaseObject = (get('ADV_23') as AdvantageInstance).active[0];
	const decreaseObject = (get('DISADV_26') as DisadvantageInstance).active[0];
	if (increaseObject && increaseObject.tier) {
		mod += increaseObject.tier;
	}
	else if (decreaseObject && decreaseObject.tier) {
		mod -= decreaseObject.tier;
	}
	const value = primary ? base + mod + add + permanentRedeemed - permanentLost : '-';
	return {
		add,
		base,
		calc: translate('secondaryattributes.ae.calc'),
		currentAdd: add,
		id: 'AE',
		maxAdd,
		mod,
		name: translate('secondaryattributes.ae.name'),
		permanentLost,
		permanentRedeemed,
		short: translate('secondaryattributes.ae.short'),
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
	if (increaseObject && increaseObject.tier) {
		mod += increaseObject.tier;
	}
	else if (decreaseObject && decreaseObject.tier) {
		mod -= decreaseObject.tier;
	}
	const value = primary ? base + mod + add + permanentRedeemed - permanentLost : '-';
	return {
		add,
		base,
		calc: translate('secondaryattributes.kp.calc'),
		currentAdd: add,
		id: 'KP',
		maxAdd: primary ? PRIMARY(primary).value : 0,
		mod,
		name: translate('secondaryattributes.kp.name'),
		permanentLost,
		permanentRedeemed,
		short: translate('secondaryattributes.kp.short'),
		value,
	};
}

export function getSPI(): SecondaryAttribute {
	const base = RaceStore.getCurrent()!.spi + Math.round((COU().value + SGC().value + INT().value) / 6);
	let mod = 0;
	const increaseObject = isActive(get('ADV_26') as AdvantageInstance);
	const decreaseObject = isActive(get('DISADV_29') as DisadvantageInstance);
	if (increaseObject) {
		mod++;
	}
	else if (decreaseObject) {
		mod--;
	}
	const value = base + mod;
	return {
		base,
		calc: translate('secondaryattributes.spi.calc'),
		id: 'SPI',
		mod,
		name: translate('secondaryattributes.spi.name'),
		short: translate('secondaryattributes.spi.short'),
		value,
	};
}

export function getTOU(): SecondaryAttribute {
	const base = RaceStore.getCurrent()!.tou + Math.round((CON().value * 2 + STR().value) / 6);
	let mod = 0;
	const increaseObject = isActive(get('ADV_27') as AdvantageInstance);
	const decreaseObject = isActive(get('DISADV_30') as DisadvantageInstance);
	if (increaseObject) {
		mod++;
	}
	else if (decreaseObject) {
		mod--;
	}
	const value = base + mod;
	return {
		base,
		calc: translate('secondaryattributes.tou.calc'),
		id: 'TOU',
		mod,
		name: translate('secondaryattributes.tou.name'),
		short: translate('secondaryattributes.tou.short'),
		value,
	};
}

export function getDO(): SecondaryAttribute {
	const base = Math.round(AGI().value / 2);
	const value = base;
	return {
		calc: translate('secondaryattributes.do.calc'),
		id: 'DO',
		name: translate('secondaryattributes.do.name'),
		short: translate('secondaryattributes.do.short'),
		base,
		value
	};
}

export function getINI(): SecondaryAttribute {
	const base = Math.round((COU().value + AGI().value) / 2);
	const value = base;
	return {
		calc: translate('secondaryattributes.ini.calc'),
		id: 'INI',
		name: translate('secondaryattributes.ini.name'),
		short: translate('secondaryattributes.ini.short'),
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
		calc: translate('secondaryattributes.mov.calc'),
		id: 'MOV',
		name: translate('secondaryattributes.mov.name'),
		short: translate('secondaryattributes.mov.short'),
		base,
		value
	};
}

export function getWS(): SecondaryAttribute {
	const base = Math.floor(CON().value / 2);
	let value = base;
	if (isActive(get('DISADV_54') as DisadvantageInstance)) {
		value++;
	}
	else if (isActive(get('DISADV_56') as DisadvantageInstance)) {
		value++;
	}
	return {
		calc: translate('secondaryattributes.ws.calc'),
		id: 'WS',
		name: translate('secondaryattributes.ws.name'),
		short: translate('secondaryattributes.ws.short'),
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
		case 'WS':
			return getWS();
	}
}

export { _get as get };

export function getAll(): SecondaryAttribute[] {
	const locale = getLocale();
	if (locale === 'de-DE') {
		return [
			getLP(),
			getAE(),
			getKP(),
			getSPI(),
			getTOU(),
			getDO(),
			getINI(),
			getMOV(),
			getWS()
		];
	}
	return [
		getLP(),
		getAE(),
		getKP(),
		getSPI(),
		getTOU(),
		getDO(),
		getINI(),
		getMOV()
	];
}

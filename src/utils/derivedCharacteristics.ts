import { last } from 'lodash';
import { CurrentHeroInstanceState } from '../reducers/currentHero';
import { get } from '../selectors/dependentInstancesSelectors';
import { AdvantageInstance, AttributeInstance, DisadvantageInstance, Energy, EnergyWithLoss, RaceInstance, SecondaryAttribute, SpecialAbilityInstance } from '../types/data.d';
import { getSids, isActive } from './ActivatableUtils';
import { getPrimaryAttributeId } from './AttributeUtils';
import { getLocale, translate } from './I18n';

const PRIMARY = (state: CurrentHeroInstanceState, id: string) => get(state.dependent, id) as AttributeInstance;
const COU = (state: CurrentHeroInstanceState) => get(state.dependent, 'ATTR_1') as AttributeInstance;
const SGC = (state: CurrentHeroInstanceState) => get(state.dependent, 'ATTR_2') as AttributeInstance;
const INT = (state: CurrentHeroInstanceState) => get(state.dependent, 'ATTR_3') as AttributeInstance;
const AGI = (state: CurrentHeroInstanceState) => get(state.dependent, 'ATTR_6') as AttributeInstance;
const CON = (state: CurrentHeroInstanceState) => get(state.dependent, 'ATTR_7') as AttributeInstance;
const STR = (state: CurrentHeroInstanceState) => get(state.dependent, 'ATTR_8') as AttributeInstance;

export type DCIds = 'LP' | 'AE' | 'KP' | 'SPI' | 'TOU' | 'DO' | 'INI' | 'MOV' | 'WS';

export function getLP(state: CurrentHeroInstanceState): Energy {
	const base = (get(state.dependent, state.rcp.race!) as RaceInstance).lp + CON(state).value * 2;
	let mod = 0;
	const add = state.energies.addedLifePoints;
	const increaseObject = (get(state.dependent, 'ADV_25') as AdvantageInstance).active[0];
	const decreaseObject = (get(state.dependent, 'DISADV_28') as DisadvantageInstance).active[0];
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
		maxAdd: CON(state).value,
		mod,
		name: translate('secondaryattributes.lp.name'),
		short: translate('secondaryattributes.lp.short'),
		value,
	};
}

export function getAE(state: CurrentHeroInstanceState): EnergyWithLoss {
	const lastTradition = last((get(state.dependent, 'SA_86') as SpecialAbilityInstance).active);
	const primary = getPrimaryAttributeId(state.dependent, 1);
	let base = 0;
	let mod = 0;
	let maxAdd = 0;
	const {
		addedArcaneEnergy: add,
		permanentArcaneEnergy: {
			lost: permanentLost,
			redeemed: permanentRedeemed
		}
	} = state.energies;
	if (primary && (lastTradition === 6 || lastTradition === 7)) {
		maxAdd = Math.round(PRIMARY(state, primary).value / 2);
	}
	else if (primary) {
		maxAdd = PRIMARY(state, primary).value;
	}
	if (maxAdd > 0) {
		base = 20 + maxAdd;
	}
	else if (isActive(get(state.dependent, 'ADV_50') as AdvantageInstance) && typeof lastTradition === 'number') {
		base = 20;
	}
	const increaseObject = (get(state.dependent, 'ADV_23') as AdvantageInstance).active[0];
	const decreaseObject = (get(state.dependent, 'DISADV_26') as DisadvantageInstance).active[0];
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

export function getKP(state: CurrentHeroInstanceState): EnergyWithLoss {
	const primary = getPrimaryAttributeId(state.dependent, 2);
	let base = 0;
	let mod = 0;
	const {
		addedKarmaPoints: add,
		permanentKarmaPoints: {
			lost: permanentLost,
			redeemed: permanentRedeemed
		}
	} = state.energies;
	if (primary) {
		base = 20 + PRIMARY(state, primary).value;
	}
	const increaseObject = (get(state.dependent, 'ADV_24') as AdvantageInstance).active[0];
	const decreaseObject = (get(state.dependent, 'DISADV_27') as DisadvantageInstance).active[0];
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
		maxAdd: primary ? PRIMARY(state, primary).value : 0,
		mod,
		name: translate('secondaryattributes.kp.name'),
		permanentLost,
		permanentRedeemed,
		short: translate('secondaryattributes.kp.short'),
		value,
	};
}

export function getSPI(state: CurrentHeroInstanceState): SecondaryAttribute {
	const base = (get(state.dependent, state.rcp.race!) as RaceInstance).spi + Math.round((COU(state).value + SGC(state).value + INT(state).value) / 6);
	let mod = 0;
	const increaseObject = isActive(get(state.dependent, 'ADV_26') as AdvantageInstance);
	const decreaseObject = isActive(get(state.dependent, 'DISADV_29') as DisadvantageInstance);
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

export function getTOU(state: CurrentHeroInstanceState): SecondaryAttribute {
	const base = (get(state.dependent, state.rcp.race!) as RaceInstance).tou + Math.round((CON(state).value * 2 + STR(state).value) / 6);
	let mod = 0;
	const increaseObject = isActive(get(state.dependent, 'ADV_27') as AdvantageInstance);
	const decreaseObject = isActive(get(state.dependent, 'DISADV_30') as DisadvantageInstance);
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

export function getDO(state: CurrentHeroInstanceState): SecondaryAttribute {
	const base = Math.round(AGI(state).value / 2);
	let mod = 0;
	if (isActive(get(state.dependent, 'SA_78') as DisadvantageInstance)) {
		mod += 3;
	}
	else if (isActive(get(state.dependent, 'SA_77') as DisadvantageInstance)) {
		mod += 2;
	}
	else if (isActive(get(state.dependent, 'SA_76') as DisadvantageInstance)) {
		mod += 1;
	}
	const value = base + mod;
	return {
		calc: translate('secondaryattributes.do.calc'),
		id: 'DO',
		name: translate('secondaryattributes.do.name'),
		short: translate('secondaryattributes.do.short'),
		base,
		mod,
		value
	};
}

export function getINI(state: CurrentHeroInstanceState): SecondaryAttribute {
	const base = Math.round((COU(state).value + AGI(state).value) / 2);
	let value = base;
	if (isActive(get(state.dependent, 'SA_58') as SpecialAbilityInstance)) {
		value += 3;
	}
	else if (isActive(get(state.dependent, 'SA_57') as SpecialAbilityInstance)) {
		value += 2;
	}
	else if (isActive(get(state.dependent, 'SA_56') as SpecialAbilityInstance)) {
		value += 1;
	}
	return {
		calc: translate('secondaryattributes.ini.calc'),
		id: 'INI',
		name: translate('secondaryattributes.ini.name'),
		short: translate('secondaryattributes.ini.short'),
		base,
		value
	};
}

export function getMOV(state: CurrentHeroInstanceState): SecondaryAttribute {
	let base = (get(state.dependent, state.rcp.race!) as RaceInstance).mov;
	let mod = 0;
	if (isActive(get(state.dependent, 'ADV_9') as AdvantageInstance)) {
		mod = 1;
	}
	if (getSids(get(state.dependent, 'DISADV_51') as DisadvantageInstance).includes(3)) {
		base = Math.round(base / 2);
	}
	const value = base + mod;
	return {
		calc: translate('secondaryattributes.mov.calc'),
		id: 'MOV',
		name: translate('secondaryattributes.mov.name'),
		short: translate('secondaryattributes.mov.short'),
		base,
		mod,
		value
	};
}

export function getWS(state: CurrentHeroInstanceState): SecondaryAttribute {
	const base = Math.floor(CON(state).value / 2);
	let value = base;
	if (isActive(get(state.dependent, 'DISADV_54') as DisadvantageInstance)) {
		value++;
	}
	else if (isActive(get(state.dependent, 'DISADV_56') as DisadvantageInstance)) {
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

function _get(state: CurrentHeroInstanceState, id: DCIds): SecondaryAttribute {
	switch (id) {
		case 'LP':
			return getLP(state);
		case 'AE':
			return getAE(state);
		case 'KP':
			return getKP(state);
		case 'SPI':
			return getSPI(state);
		case 'TOU':
			return getTOU(state);
		case 'DO':
			return getDO(state);
		case 'INI':
			return getINI(state);
		case 'MOV':
			return getMOV(state);
		case 'WS':
			return getWS(state);
	}
}

export { _get as get };

export function getAll(state: CurrentHeroInstanceState): SecondaryAttribute[] {
	const locale = getLocale();
	if (locale === 'de-DE') {
		return [
			getLP(state),
			getAE(state),
			getKP(state),
			getSPI(state),
			getTOU(state),
			getDO(state),
			getINI(state),
			getMOV(state),
			getWS(state)
		];
	}
	return [
		getLP(state),
		getAE(state),
		getKP(state),
		getSPI(state),
		getTOU(state),
		getDO(state),
		getINI(state),
		getMOV(state)
	];
}

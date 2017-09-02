import { last } from 'lodash';
import { CurrentHeroInstanceState } from '../reducers/currentHero';
import { get } from '../selectors/dependentInstancesSelectors';
import { AttributeInstance, Energy, EnergyWithLoss, SecondaryAttribute } from '../types/data.d';
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
	const base = state.dependent.races.get(state.rcp.race!)!.lp + CON(state).value * 2;
	let mod = 0;
	const add = state.energies.addedLifePoints;
	const increaseObject = state.dependent.advantages.get('ADV_25')!.active[0];
	const decreaseObject = state.dependent.disadvantages.get('DISADV_28')!.active[0];
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
	const lastTradition = last(state.dependent.specialAbilities.get('SA_86')!.active);
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
	if (primary !== undefined && lastTradition !== undefined && (lastTradition.sid === 6 || lastTradition.sid === 7)) {
		maxAdd = Math.round(PRIMARY(state, primary).value / 2);
	}
	else if (primary !== undefined) {
		maxAdd = PRIMARY(state, primary).value;
	}
	if (maxAdd > 0) {
		base = 20 + maxAdd;
	}
	else if (lastTradition !== undefined) {
		base = 20;
	}
	const increaseObject = state.dependent.advantages.get('ADV_23')!.active[0];
	const decreaseObject = state.dependent.disadvantages.get('DISADV_26')!.active[0];
	if (increaseObject && increaseObject.tier) {
		mod += increaseObject.tier;
	}
	else if (decreaseObject && decreaseObject.tier) {
		mod -= decreaseObject.tier;
	}
	const value = base > 0 ? base + mod + add + permanentRedeemed - permanentLost : undefined;
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
	const increaseObject = state.dependent.advantages.get('ADV_24')!.active[0];
	const decreaseObject = state.dependent.disadvantages.get('DISADV_27')!.active[0];
	if (increaseObject && increaseObject.tier) {
		mod += increaseObject.tier;
	}
	else if (decreaseObject && decreaseObject.tier) {
		mod -= decreaseObject.tier;
	}
	const value = primary ? base + mod + add + permanentRedeemed - permanentLost : undefined;
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
	const base = state.dependent.races.get(state.rcp.race!)!.spi + Math.round((COU(state).value + SGC(state).value + INT(state).value) / 6);
	let mod = 0;
	const increaseObject = isActive(state.dependent.advantages.get('ADV_26'));
	const decreaseObject = isActive(state.dependent.disadvantages.get('DISADV_29'));
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
	const base = state.dependent.races.get(state.rcp.race!)!.tou + Math.round((CON(state).value * 2 + STR(state).value) / 6);
	let mod = 0;
	const increaseObject = isActive(state.dependent.advantages.get('ADV_27'));
	const decreaseObject = isActive(state.dependent.disadvantages.get('DISADV_30'));
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
	if (isActive(state.dependent.specialAbilities.get('SA_78'))) {
		mod += 3;
	}
	else if (isActive(state.dependent.specialAbilities.get('SA_77'))) {
		mod += 2;
	}
	else if (isActive(state.dependent.specialAbilities.get('SA_76'))) {
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
	let mod = 0;
	if (isActive(state.dependent.specialAbilities.get('SA_58'))) {
		mod += 3;
	}
	else if (isActive(state.dependent.specialAbilities.get('SA_57'))) {
		mod += 2;
	}
	else if (isActive(state.dependent.specialAbilities.get('SA_56'))) {
		mod += 1;
	}
	const value = base + mod;
	return {
		calc: translate('secondaryattributes.ini.calc'),
		id: 'INI',
		name: translate('secondaryattributes.ini.name'),
		short: translate('secondaryattributes.ini.short'),
		base,
		mod,
		value
	};
}

export function getMOV(state: CurrentHeroInstanceState): SecondaryAttribute {
	let base = state.dependent.races.get(state.rcp.race!)!.mov;
	let mod = 0;
	if (isActive(state.dependent.advantages.get('ADV_9'))) {
		mod = 1;
	}
	if (getSids(state.dependent.disadvantages.get('DISADV_51')!).includes(3)) {
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
	if (isActive(state.dependent.disadvantages.get('DISADV_54'))) {
		value++;
	}
	else if (isActive(state.dependent.disadvantages.get('DISADV_56'))) {
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

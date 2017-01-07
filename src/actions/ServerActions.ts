import * as ActionTypes from '../constants/ActionTypes';
import { RawRace } from '../reducers/RacesReducer';
import { Hero } from '../reducers/HerolistReducer';

export interface RawCore {
	id: string;
	name: string | { m: string, f: string };
}

export interface RawAdvantage extends RawCore {
	name: string;
	ap: number | number[] | string;
	tiers: number | null;
	max: false | number | null;
	sel: string[] | [string, number][];
	input: string;
	req: any[][];
}

export interface RawAttribute extends RawCore {
	name: string;
	short: string;
}

export interface RawCombatTechnique extends RawCore {
	name: string;
	skt: number;
	leit: string[];
	gr: number;
}

export interface RawCulture extends RawCore {
	name: string;
	ap: number;
	lang: string[];
	literacy: string[];
	social: number[];
	typ_prof: string[];
	typ_adv: string[];
	typ_dadv: string[];
	untyp_adv: string[];
	untyp_dadv: string[];
	typ_talents: string[];
	untyp_talents: string[];
	talents: [string, number][];
}

export interface RawDisadvantage extends RawAdvantage {}

export interface RawLiturgy extends RawCore {
	name: string;
	check: [string, string, string];
	skt: number;
	trad: number[];
	aspc: number[];
	gr: number;
}

export interface RawProfession extends RawCore {
	subname: string | { m: string, f: string };
	ap: number;
	pre_req: [string, any][];
	req: any[][];
	sel: any[][];
	sa: (string | number | boolean)[][];
	combattech: [string, number][];
	talents: [string, number][];
	spells: [string, number | null][];
	chants: [string, number | null][];
	typ_adv: string[];
	typ_dadv: string[];
	untyp_adv: string[];
	untyp_dadv: string[];
	vars: string[];
}

export interface RawProfessionVariant extends RawCore {
	subname: string | { m: string, f: string };
	ap: number;
	pre_req: [string, any][];
	req: any[][];
	sel: any[][];
	sa: (string | number | boolean)[][];
	combattech: [string, number][];
	talents: [string, number][];
}

export interface RawSpecialAbility extends RawCore {
	name: string;
	ap: number | number[] | string;
	max: false | number | null;
	sel: string[] | [string, number][];
	input: string;
	req: any[][];
	gr: number;
}

export interface RawSpell extends RawCore {
	name: string;
	check: [string, string, string];
	skt: number;
	trad: number[];
	merk: number;
	gr: number;
}

export interface RawTalent extends RawCore {
	name: string;
	check: [string, string, string];
	skt: number;
	be: 'true' | 'false' | 'evtl';
	gr: number;
	spec: string[];
	spec_input: string | null;
}

export interface RawData {
	adv: { [id: string]: RawAdvantage };
	attributes: { [id: string]: RawAttribute };
	combattech: { [id: string]: RawCombatTechnique };
	cultures: { [id: string]: RawCulture };
	disadv: { [id: string]: RawDisadvantage };
	liturgies: { [id: string]: RawLiturgy };
	professions: { [id: string]: RawProfession };
	professionVariants: { [id: string]: RawProfessionVariant };
	races: { [id: string]: RawRace };
	specialabilities: { [id: string]: RawSpecialAbility };
	spells: { [id: string]: RawSpell };
	talents: { [id: string]: RawTalent };
}

export interface ReceiveDataTablesAction {
	type: ActionTypes.RECEIVE_DATA_TABLES;
	payload: {
		data: RawData;
		pending?: boolean
	};
}

export const receiveDataTables = (data: RawData): ReceiveDataTablesAction => ({
	type: ActionTypes.RECEIVE_DATA_TABLES,
	payload: {
		data,
		pending: false
	}
});

export interface ReceiveHeroDataAction {
	type: ActionTypes.RECEIVE_HERO_DATA;
	payload: {
		data: Hero;
		pending?: boolean
	};
}

export const receiveHeroData = (data: Hero): ReceiveHeroDataAction => ({
	type: ActionTypes.RECEIVE_HERO_DATA,
	payload: {
		data,
		pending: false
	}
});

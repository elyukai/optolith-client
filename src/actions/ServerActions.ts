import { RECEIVE_DATA_TABLES, RECEIVE_HERO_DATA } from '../constants/ActionTypes';
import { Hero } from '../reducers/HerolistReducer';

export interface RawRace {
	id: string;
	name: string;
	ap: number;
	le: number;
	sk: number;
	zk: number;
	gs: number;
	attr: number[][];
	attr_sel: [number, number[]];
	typ_cultures: string[];
	auto_adv: string[][];
	imp_adv: (string | number)[][];
	imp_dadv: (string | number)[][];
	typ_adv: string[];
	typ_dadv: string[];
	untyp_adv: string[];
	untyp_dadv: string[];
	hair: number[];
	eyes: number[];
	size: (number | number[])[];
	weight: (number | number[])[];
}

export interface RawCulture {
	id: string;
	name: string;
	ap: number;
	lang: number[];
	literacy: number[];
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

export interface RawProfession {
	id: string;
	name: string | { m: string, f: string };
	subname: string | { m: string, f: string };
	ap: number;
	pre_req: [string, any][];
	req: any[][];
	sel: (string | string[] | number[])[][];
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

export interface RawProfessionVariant {
	id: string;
	name: string | { m: string, f: string };
	subname: string | { m: string, f: string };
	ap: number;
	pre_req: [string, any][];
	req: any[][];
	sel: any[][];
	sa: (string | number | boolean)[][];
	combattech: [string, number][];
	talents: [string, number][];
}

export interface RawAdvantage {
	id: string;
	name: string;
	ap: number | number[] | string;
	tiers: number | null;
	max: false | number | null;
	sel: string[] | [string, number][];
	input: string;
	req: any[][];
}

export interface RawAttribute {
	id: string;
	name: string;
	short: string;
}

export interface RawCombatTechnique {
	id: string;
	name: string;
	skt: number;
	leit: string[];
	gr: number;
}

export interface RawDisadvantage extends RawAdvantage {}

export interface RawLiturgy {
	id: string;
	name: string;
	check: [number, number, number];
	skt: number;
	trad: number[];
	aspc: number[];
	gr: number;
}

export interface RawSpecialAbility {
	id: string;
	name: string;
	ap: number | number[] | string;
	max: false | number | null;
	sel: string[] | [string, number][];
	input: string;
	req: any[][];
	gr: number;
}

export interface RawSpell {
	id: string;
	name: string;
	check: [number, number, number];
	skt: number;
	trad: number[];
	merk: number[];
	gr: number;
}

export interface RawTalent {
	id: string;
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
	type: RECEIVE_DATA_TABLES;
	payload: {
		data: RawData;
		pending?: boolean
	};
}

export const receiveDataTables = (data: RawData): ReceiveDataTablesAction => ({
	type: RECEIVE_DATA_TABLES,
	payload: {
		data,
		pending: false
	}
});

export interface ReceiveHeroDataAction {
	type: RECEIVE_HERO_DATA;
	payload: {
		data: Hero;
		pending?: boolean
	};
}

export const receiveHeroData = (data: Hero): ReceiveHeroDataAction => ({
	type: RECEIVE_HERO_DATA,
	payload: {
		data,
		pending: false
	}
});

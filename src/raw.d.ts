/// <reference path="./data.d.ts" />

declare interface RawRace {
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

declare interface RawCulture {
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

declare interface RawProfession {
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

declare interface RawProfessionVariant {
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

declare interface RawAdvantage {
	id: string;
	name: string;
	ap: number | number[] | string;
	tiers: number | null;
	max: false | number | null;
	sel: string[] | [string, number][];
	input: string;
	req: any[][];
}

declare interface RawAttribute {
	id: string;
	name: string;
	short: string;
}

declare interface RawCombatTechnique {
	id: string;
	name: string;
	skt: number;
	leit: string[];
	gr: number;
}

declare interface RawDisadvantage extends RawAdvantage {}

declare interface RawLiturgy {
	id: string;
	name: string;
	check: [number, number, number];
	skt: number;
	trad: number[];
	aspc: number[];
	gr: number;
}

declare interface RawSpecialAbility {
	id: string;
	name: string;
	ap: number | number[] | string;
	max: false | number | null;
	sel: string[] | [string, number][];
	input: string;
	req: any[][];
	gr: number;
}

declare interface RawSpell {
	id: string;
	name: string;
	check: [number, number, number];
	skt: number;
	trad: number[];
	merk: number[];
	gr: number;
}

declare interface RawTalent {
	id: string;
	name: string;
	check: [string, string, string];
	skt: number;
	be: 'true' | 'false' | 'evtl';
	gr: number;
	spec: string[];
	spec_input: string | null;
}

declare interface RawItem {
	id: string;
	name: string;
	price: string;
	weight: string;
	number: string;
	where: string;
	gr: number;
	combatTechnique: string;
	damageDiceNumber: string;
	damageDiceSides: string;
	damageFlat: string;
	damageBonus: string;
	at: string;
	pa: string;
	reach: string;
	length: string;
	stp: string;
	range: string[];
	reloadTime: string;
	ammunition: string;
	pro: string;
	enc: string;
	addPenalties: boolean;
	template: string;
}

declare interface RawExperienceLevel {
	id: string;
	name: string;
	ap: number;
	max_attr: number;
	max_skill: number;
	max_combattech: number;
	max_attrsum: number;
	max_spells_liturgies: number;
	max_unfamiliar_spells: number;
}

declare interface RawData {
	adv: { [id: string]: RawAdvantage };
	attributes: { [id: string]: RawAttribute };
	combattech: { [id: string]: RawCombatTechnique };
	cultures: { [id: string]: RawCulture };
	disadv: { [id: string]: RawDisadvantage };
	el: { [id: string]: RawExperienceLevel };
	items: { [id: string]: RawItem };
	liturgies: { [id: string]: RawLiturgy };
	professions: { [id: string]: RawProfession };
	professionVariants: { [id: string]: RawProfessionVariant };
	races: { [id: string]: RawRace };
	specialabilities: { [id: string]: RawSpecialAbility };
	spells: { [id: string]: RawSpell };
	talents: { [id: string]: RawTalent };
}

declare interface HeroDataRest {
	pers: {
		family: string;
		placeofbirth: string;
		dateofbirth: string;
		age: string;
		haircolor: number;
		eyecolor: number;
		size: string;
		weight: string;
		title: string;
		socialstatus: number;
		characteristics: string;
		otherinfo: string;
	};
	items: {
		[id: string]: Item
	}
}

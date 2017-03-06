/// <reference path="./data.d.ts" />

interface RawHero {
	readonly clientVersion: string;
	readonly dateCreated: Date;
	readonly dateModified: Date;
	readonly player?: {
		readonly id: string;
		readonly displayName: string;
	};
	readonly id: string;
	readonly phase: number;
	readonly name: string;
	readonly avatar: string;
	readonly ap: {
		readonly total: number;
		readonly spent: number;
		readonly adv: [number, number, number];
		readonly disadv: [number, number, number];
	};
	readonly el: string;
	readonly r: string;
	readonly c: string;
	readonly p: string;
	readonly pv: string | null;
	readonly sex: 'm' | 'f';
}

interface RawHerolist {
	[id: string]: RawHero;
}

interface RawRace {
	id: string;
	name: string;
	ap: number;
	le: number;
	sk: number;
	zk: number;
	gs: number;
	attr: [number, number][];
	attr_sel: [number, number[]];
	typ_cultures: string[];
	auto_adv: string[];
	autoAdvCost: [number, number, number];
	imp_adv: string[];
	imp_dadv: string[];
	typ_adv: string[];
	typ_dadv: string[];
	untyp_adv: string[];
	untyp_dadv: string[];
	hair: number[];
	eyes: number[];
	size: (number | [number, number])[];
	weight: (number | [number, number])[];
}

interface RawCulture {
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

interface RawProfession {
	id: string;
	name: string | { m: string, f: string };
	subname: string | { m: string, f: string };
	ap: number;
	pre_req: ProfessionDependencyObject[];
	req: RequirementObject[];
	sel: ProfessionSelections;
	sa: RequirementObject[];
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

interface RawProfessionVariant {
	id: string;
	name: string | { m: string, f: string };
	ap: number;
	pre_req: ProfessionDependencyObject[];
	req: RequirementObject[];
	sel: ProfessionSelections;
	sa: RequirementObject[];
	combattech: [string, number][];
	talents: [string, number][];
}

interface RawAdvantage {
	id: string;
	name: string;
	ap: number | number[] | string;
	tiers: number | null;
	max: number | null;
	sel: SelectionObject[];
	input: string;
	req: ('RCP' | RequirementObject)[];
}

interface RawAttribute {
	id: string;
	name: string;
	short: string;
}

interface RawCombatTechnique {
	id: string;
	name: string;
	skt: number;
	leit: string[];
	gr: number;
}

interface RawDisadvantage extends RawAdvantage {}

interface RawLiturgy {
	id: string;
	name: string;
	check: [number, number, number, string | never];
	skt: number;
	trad: number[];
	aspc: number[];
	gr: number;
}

interface RawSpecialAbility {
	id: string;
	name: string;
	ap: number | number[] | string;
	max: number | null;
	sel: SelectionObject[];
	input: string;
	req: ('RCP' | RequirementObject)[];
	gr: number;
}

interface RawSpell {
	id: string;
	name: string;
	check: [number, number, number, string | never];
	skt: number;
	trad: number[];
	merk: number;
	gr: number;
}

interface RawTalent {
	id: string;
	name: string;
	check: [string, string, string];
	skt: number;
	be: 'true' | 'false' | 'evtl';
	gr: number;
	spec: string[];
	spec_input: string | null;
}

interface RawItem {
	id: string;
	name: string;
	price: number;
	weight: number;
	number: number;
	where: string;
	gr: number;
	combatTechnique: string;
	damageDiceNumber: number;
	damageDiceSides: number;
	damageFlat: number;
	damageBonus: number;
	at: number;
	pa: number;
	reach: number;
	length: number;
	stp: number;
	range: [number, number, number];
	reloadTime: number;
	ammunition: string | null;
	pro: number;
	enc: number;
	addPenalties: boolean;
	template: string;
	isParryingWeapon: boolean;
}

interface RawExperienceLevel {
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

interface RawData {
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

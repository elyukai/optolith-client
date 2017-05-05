import * as Data from './data.d';

export interface RawHero {
	clientVersion: string;
	phase: number;
	name: string;
	avatar: string;
	ap: Data.AdventurePoints;
	el: string;
	r: string;
	c: string;
	p: string;
	professionName?: string;
	pv: string | null;
	sex: 'm' | 'f';
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
		 cultureAreaKnowledge: string;
	};
	activatable: {
		 [id: string]: Data.ActiveObject[];
	};
	attr: {
		 values: [string, number, number][];
		 lp: number;
		 ae: number;
		 kp: number;
		 permanentAE: {
			lost: number;
			redeemed: number;
		};
		 permanentKP: {
			lost: number;
			redeemed: number;
		};
	};
	talents: {
		 [id: string]: number;
	};
	ct: {
		 [id: string]: number;
	};
	spells: {
		 [id: string]: number | null;
	};
	chants: {
		 [id: string]: number | null;
	};
	belongings: {
		 items: {
			 [id: string]: Data.ItemInstanceOld;
		};
		 equipment: object;
		 pet: object;
		 purse: {
			 d: string;
			 s: string;
			 h: string;
			 k: string;
		};
	};
	rules: Data.Rules;
	history: Data.HistoryObject[];
	pets: Data.PetInstance[];
	id: string;
	dateCreated: string;
	dateModified: string;
	player?: Data.User;
}

export interface RawHeroNew extends Data.HeroBase {
	readonly id: string;
	readonly dateCreated: string;
	readonly dateModified: string;
	player?: Data.User;
}

export type RawHerolist = RawHero[] | Data.ToListById<RawHeroNew>;

export interface RawRaceLocale {
	id: string;
	name: string;
}

export interface RawRace {
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

export interface RawCultureLocale {
	id: string;
	name: string;
}

export interface RawCulture {
	id: string;
	name: string;
	ap: number;
	lang: number[];
	literacy: number[];
	social: number[];
	typ_prof: Data.TypicalProfession[];
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
	pre_req: Data.ProfessionDependencyObject[];
	req: Data.RequirementObject[];
	sel: Data.ProfessionSelections;
	sa: Data.RequirementObject[];
	combattech: [string, number][];
	talents: [string, number][];
	spells: [string, number][];
	chants: [string, number][];
	blessings: string[];
	typ_adv: string[];
	typ_dadv: string[];
	untyp_adv: string[];
	untyp_dadv: string[];
	vars: string[];
	gr: number;
	sgr: number;
	src: {
		id: string;
		page?: string;
	}
}

export interface RawProfessionVariant {
	id: string;
	name: string | { m: string, f: string };
	ap: number;
	pre_req: Data.ProfessionDependencyObject[];
	req: Data.RequirementObject[];
	sel: Data.ProfessionSelections;
	sa: Data.RequirementObject[];
	combattech: [string, number][];
	talents: [string, number][];
}

export interface RawAdvantage {
	id: string;
	name: string;
	ap: number | number[] | string;
	tiers?: number;
	max?: number;
	sel?: Data.SelectionObject[];
	input?: string;
	req: ('RCP' | Data.RequirementObject)[];
}

export interface RawAttribute {
	id: string;
}

export interface RawAttributeLocale {
	id: string;
	name: string;
	short: string;
}

export interface RawCombatTechnique {
	id: string;
	name: string;
	skt: number;
	leit: string[];
	bf: number;
	gr: number;
}

export interface RawDisadvantage extends RawAdvantage {}

export interface RawLiturgy {
	id: string;
	name: string;
	check: [number, number, number, string | never];
	skt: number;
	trad: number[];
	aspc: number[];
	gr: number;
}

export interface RawBlessing {
	id: string;
	name: string;
	aspc: number[];
	trad: number[];
	reqs: Data.RequirementObject[];
}

export interface RawSpecialAbility {
	id: string;
	name: string;
	ap: number | number[] | string;
	max?: number;
	sel?: Data.SelectionObject[];
	input?: string;
	req: ('RCP' | Data.RequirementObject)[];
	gr: number;
}

export interface RawSpell {
	id: string;
	name: string;
	check: [number, number, number, string | never];
	skt: number;
	trad: number[];
	merk: number;
	gr: number;
}

export interface RawCantrip {
	id: string;
	name: string;
	merk: number;
	trad: number[];
	reqs: Data.RequirementObject[];
}

export interface RawTalent {
	id: string;
	check: [string, string, string];
	skt: number;
	be: 'true' | 'false' | 'maybe';
	gr: number;
	name: string;
	spec: string[];
	spec_input?: string;
}

export interface RawTalentLocale {
	id: string;
	name: string;
	spec: string[];
	spec_input?: string;
}

export interface RawItem {
	id: string;
	name: string;
	price: number;
	weight: number;
	where: string;
	template: string;
	imp: number;
	gr: number;
	combatTechnique?: string;
	damageDiceNumber?: number;
	damageDiceSides?: number;
	damageFlat?: number;
	damageBonus?: number;
	at?: number;
	pa?: number;
	reach?: number;
	length?: number;
	stp?: number;
	range?: [number, number, number];
	reloadTime?: number;
	ammunition?: string;
	pro?: number;
	enc?: number;
	addPenalties?: boolean;
	isParryingWeapon?: boolean;
	isTwoHandedWeapon?: boolean;
}

export interface RawExperienceLevelLocale {
	id: string;
	name: string;
}

export interface RawExperienceLevel {
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

export interface RawTables {
	adv: Data.ToListById<RawAdvantage>;
	attributes: Data.ToListById<RawAttribute>;
	blessings: Data.ToListById<RawBlessing>;
	cantrips: Data.ToListById<RawCantrip>;
	combattech: Data.ToListById<RawCombatTechnique>;
	cultures: Data.ToListById<RawCulture>;
	disadv: Data.ToListById<RawDisadvantage>;
	el: Data.ToListById<RawExperienceLevel>;
	items: Data.ToListById<RawItem>;
	liturgies: Data.ToListById<RawLiturgy>;
	professions: Data.ToListById<RawProfession>;
	professionVariants: Data.ToListById<RawProfessionVariant>;
	races: Data.ToListById<RawRace>;
	specialabilities: Data.ToListById<RawSpecialAbility>;
	spells: Data.ToListById<RawSpell>;
	talents: Data.ToListById<RawTalent>;
}

export interface RawLocale {
	ui: Data.UILocale;
	el: Data.ToListById<RawExperienceLevelLocale>;
	attributes: Data.ToListById<RawAttributeLocale>;
	races: Data.ToListById<RawRaceLocale>;
	cultures: Data.ToListById<RawCultureLocale>;
	talents: Data.ToListById<RawTalentLocale>;
}

export type RawLocaleList = Data.ToListById<RawLocale>;

export interface Config {
	herolistSortOrder: string;
	herolistVisibilityFilter: string;
	racesSortOrder: string;
	racesValueVisibility: boolean;
	culturesSortOrder: string;
	culturesVisibilityFilter: string;
	culturesValueVisibility: boolean;
	professionsSortOrder: string;
	professionsVisibilityFilter: string;
	professionsGroupVisibilityFilter: number;
	professionsFromExpansionsVisibility: boolean;
	advantagesDisadvantagesCultureRatingVisibility: boolean;
	talentsSortOrder: string;
	talentsCultureRatingVisibility: boolean;
	combatTechniquesSortOrder: string;
	specialAbilitiesSortOrder: string;
	spellsSortOrder: string;
	spellsUnfamiliarVisibility: boolean;
	liturgiesSortOrder: string;
	equipmentSortOrder: string;
	equipmentGroupVisibilityFilter: number;
	sheetCheckAttributeValueVisibility?: boolean;
	enableActiveItemHints: boolean;
	locale?: string;
}

export interface Raw {
	config: Config;
	heroes: RawHerolist;
	tables: RawTables;
	locales: Data.ToListById<RawLocale>;
}

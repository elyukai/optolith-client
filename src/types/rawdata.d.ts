import * as Data from './data.d';
import * as Reusable from './reusable.d';
import * as UI from './ui.d';

export interface RawHero extends Data.HeroBase {
	readonly id: string;
	readonly dateCreated: string;
	readonly dateModified: string;
	player?: Data.User;
}

export type RawHerolist = Data.ToListById<RawHero>;

export interface RawRace {
	id: string;
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
	src: string[];
}

export interface RawRaceLocale {
	id: string;
	name: string;
	attributeAdjustments: string;
	automaticAdvantages: string;
	stronglyRecommendedAdvantages: string;
	stronglyRecommendedDisadvantages: string;
	commonAdvantages: string;
	commonDisadvantages: string;
	uncommonAdvantages: string;
	uncommonDisadvantages: string;
	src: number[];
}

export interface RawCulture {
	id: string;
	ap: number;
	lang: number[];
	literacy: number[];
	social: number[];
	typ_prof: Data.CommonProfession[];
	typ_adv: string[];
	typ_dadv: string[];
	untyp_adv: string[];
	untyp_dadv: string[];
	typ_talents: string[];
	untyp_talents: string[];
	talents: [string, number][];
	src: string[];
}

export interface RawCultureLocale {
	id: string;
	name: string;
	areaKnowledgeShort: string;
	areaKnowledge: string;
	commonMundaneProfessions?: string;
	commonMagicProfessions?: string;
	commonBlessedProfessions?: string;
	commonAdvantages?: string;
	commonDisadvantages?: string;
	uncommonAdvantages?: string;
	uncommonDisadvantages?: string;
	commonNames: string;
	src: number[];
}

export interface RawProfession {
	id: string;
	ap: number;
	apOfActivatables: number;
	pre_req: Data.ProfessionDependencyObject[];
	req: (Reusable.ProfessionRequiresActivatableObject | Reusable.ProfessionRequiresIncreasableObject)[];
	sel: Data.ProfessionSelections;
	sa: Reusable.ProfessionRequiresActivatableObject[];
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
	src: string[];
}

export interface RawProfessionLocale {
	id: string;
	name: string | { m: string, f: string };
	subname?: string | { m: string, f: string };
	req: (Reusable.ProfessionRequiresActivatableObject | Reusable.ProfessionRequiresIncreasableObject)[];
	src: number[];
}

export interface RawProfessionVariant {
	id: string;
	ap: number;
	apOfActivatables: number;
	pre_req: Data.ProfessionDependencyObject[];
	req: (Reusable.ProfessionRequiresActivatableObject | Reusable.ProfessionRequiresIncreasableObject)[];
	sel: Data.ProfessionSelections;
	sa: Reusable.ProfessionRequiresActivatableObject[];
	combattech: [string, number][];
	talents: [string, number][];
	spells: [string, number][];
	chants: [string, number][];
}

export interface RawProfessionVariantLocale {
	id: string;
	name: string | { m: string, f: string };
	precedingText?: string;
	concludingText?: string;
}

export interface RawAdvantage {
	id: string;
	ap: number | number[] | string;
	tiers?: number;
	max?: number;
	sel?: Data.SelectionObject[];
	req: ('RCP' | Reusable.AllRequirementTypes)[];
}

export interface RawAdvantageLocale {
	id: string;
	name: string;
	sel?: Data.SelectionObject[];
	input?: string;
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
	skt: number;
	leit: string[];
	bf: number;
	gr: number;
}

export interface RawCombatTechniqueLocale {
	id: string;
	name: string;
}

export interface RawDisadvantage extends RawAdvantage {}

export interface RawDisadvantageLocale extends RawAdvantageLocale {}

export interface RawLiturgy {
	id: string;
	check: [string, string, string];
	mod?: "SPI" | "TOU";
	skt: number;
	trad: number[];
	aspc: number[];
	gr: number;
	src: string[];
}

export interface RawLiturgyLocale {
	id: string;
	name: string;
	effect: string;
	castingtime: string;
	castingtimeShort: string;
	kpcost: string;
	kpcostShort: string;
	range: string;
	rangeShort: string;
	duration: string;
	durationShort: string;
	target: string;
	src: number[];
}

export interface RawBlessing {
	id: string;
	aspc: number[];
	trad: number[];
	req: Reusable.AllRequirementTypes[];
	src: string[];
}

export interface RawBlessingLocale {
	id: string;
	name: string;
	effect: string;
	range: string;
	duration: string;
	target: string;
	src: number[];
}

export interface RawSpecialAbility {
	id: string;
	ap: number | number[] | string;
	tiers?: number;
	max?: number;
	sel?: Data.SelectionObject[];
	req: ('RCP' | Reusable.AllRequirementTypes | (number | 'RCP' | Reusable.AllRequirementTypes)[])[];
	gr: number;
	extended?: (string | string[])[];
}

export interface RawSpecialAbilityLocale {
	id: string;
	name: string;
	sel?: Data.SelectionObject[];
	input?: string;
}

export interface RawSpell {
	id: string;
	check: [string, string, string];
	mod?: "SPI" | "TOU";
	skt: number;
	trad: number[];
	subtrad: number[];
	merk: number;
	gr: number;
	req: Reusable.AllRequirementTypes[];
	src: string[];
}

export interface RawSpellLocale {
	id: string;
	name: string;
	effect: string;
	castingtime: string;
	castingtimeShort: string;
	aecost: string;
	aecostShort: string;
	range: string;
	rangeShort: string;
	duration: string;
	durationShort: string;
	target: string;
	src: number[];
}

export interface RawCantrip {
	id: string;
	merk: number;
	trad: number[];
	req: Reusable.AllRequirementTypes[];
	src: string[];
}

export interface RawCantripLocale {
	id: string;
	name: string;
	effect: string;
	range: string;
	duration: string;
	target: string;
	note?: string;
	src: number[];
}

export interface RawTalent {
	id: string;
	check: [string, string, string];
	skt: number;
	be: 'true' | 'false' | 'maybe';
	gr: number;
	name: string;
}

export interface RawTalentLocale {
	id: string;
	name: string;
	spec: Data.Application[];
	spec_input?: string;
	tools?: string;
	quality?: string;
	failed?: string;
	critical?: string;
	botch?: string;
	src?: string;
}

export interface RawItem {
	id: string;
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
	primaryThreshold?: {
		primary?: string;
		threshold: number | number[];
	};
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

export interface RawItemLocale {
	id: string;
	name: string;
}

export interface RawExperienceLevelLocale {
	id: string;
	name: string;
}

export interface RawExperienceLevel {
	id: string;
	ap: number;
	maxAttributeValue: number;
	maxSkillRating: number;
	maxCombatTechniqueRating: number;
	maxTotalAttributeValues: number;
	maxSpellsLiturgies: number;
	maxUnfamiliarSpells: number;
}

export interface RawTables {
	advantages: Data.ToListById<RawAdvantage>;
	attributes: Data.ToListById<RawAttribute>;
	blessings: Data.ToListById<RawBlessing>;
	cantrips: Data.ToListById<RawCantrip>;
	combattech: Data.ToListById<RawCombatTechnique>;
	cultures: Data.ToListById<RawCulture>;
	disadvantages: Data.ToListById<RawDisadvantage>;
	el: Data.ToListById<RawExperienceLevel>;
	items: Data.ToListById<RawItem>;
	liturgies: Data.ToListById<RawLiturgy>;
	professions: Data.ToListById<RawProfession>;
	professionvariants: Data.ToListById<RawProfessionVariant>;
	races: Data.ToListById<RawRace>;
	specialabilities: Data.ToListById<RawSpecialAbility>;
	spells: Data.ToListById<RawSpell>;
	talents: Data.ToListById<RawTalent>;
}

export interface RawLocale {
	ui: UI.UIMessages;
	books: Data.ToListById<Data.Book>;
	el: Data.ToListById<RawExperienceLevelLocale>;
	attributes: Data.ToListById<RawAttributeLocale>;
	races: Data.ToListById<RawRaceLocale>;
	cultures: Data.ToListById<RawCultureLocale>;
	professions: Data.ToListById<RawProfessionLocale>;
	professionvariants: Data.ToListById<RawProfessionVariantLocale>;
	advantages: Data.ToListById<RawAdvantageLocale>;
	disadvantages: Data.ToListById<RawDisadvantageLocale>;
	talents: Data.ToListById<RawTalentLocale>;
	combattech: Data.ToListById<RawCombatTechniqueLocale>;
	spells: Data.ToListById<RawSpellLocale>;
	cantrips: Data.ToListById<RawCantripLocale>;
	liturgies: Data.ToListById<RawLiturgyLocale>;
	blessings: Data.ToListById<RawBlessingLocale>;
	specialabilities: Data.ToListById<RawSpecialAbilityLocale>;
	items: Data.ToListById<RawItemLocale>;
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
	theme?: string;
}

export interface Raw {
	config: Config;
	heroes: RawHerolist;
	tables: RawTables;
	locales: Data.ToListById<RawLocale>;
}

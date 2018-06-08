import { StringKeyObject } from '../utils/collectionUtils';
import * as Data from './data.d';
import * as Reusable from './reusable.d';
import * as UI from './ui.d';
import * as Wiki from './wiki.d';

export interface HeroBaseForHerolist {
}

export interface RawHero {
	readonly id: string;
  readonly name: string;
  readonly avatar?: string;
  readonly ap: {
    total: number;
    spent: number;
  };
  readonly r?: string;
  readonly rv?: string;
  readonly c?: string;
  readonly p?: string;
  professionName?: string;
  readonly pv?: string;
  readonly sex: 'm' | 'f';
	readonly dateCreated: string;
	readonly dateModified: string;
	player?: Data.User;
	rules: RawRules;
  readonly clientVersion: string;
  readonly phase: number;
  readonly el: string;
  readonly pers: {
    family?: string;
    placeofbirth?: string;
    dateofbirth?: string;
    age?: string;
    haircolor?: number;
    eyecolor?: number;
    size?: string;
    weight?: string;
    title?: string;
    socialstatus?: number;
    characteristics?: string;
    otherinfo?: string;
    cultureAreaKnowledge?: string;
  };
  readonly activatable: StringKeyObject<Data.ActiveObject[]>;
  readonly attr: {
    values: [string, number, number][];
    lp: number;
    ae: number;
    kp: number;
    permanentLP?: {
      lost: number;
    };
    permanentAE: {
      lost: number;
      redeemed: number;
    };
    permanentKP: {
      lost: number;
      redeemed: number;
    };
  };
  readonly talents: StringKeyObject<number>;
  readonly ct: StringKeyObject<number>;
  readonly spells: StringKeyObject<number>;
  readonly cantrips: string[];
  readonly liturgies: StringKeyObject<number>;
  readonly blessings: string[];
  readonly belongings: {
    items: StringKeyObject<Data.ItemInstance>;
    armorZones: StringKeyObject<Data.ArmorZonesInstance>;
    purse: {
      d: string;
      s: string;
      h: string;
      k: string;
    };
  };
  readonly pets?: StringKeyObject<Data.PetInstance>;
}

export interface RawRules {
	higherParadeValues: number;
	attributeValueLimit: boolean;
	enableAllRuleBooks: boolean;
	enabledRuleBooks: string[];
	enableLanguageSpecializations: boolean;
}

export type RawHerolist = StringKeyObject<RawHero>;

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
	hair?: number[];
	eyes?: number[];
	size?: (number | [number, number])[];
	weight: (number | [number, number])[];
	vars: string[];
	src: string[];
}

export interface RawRaceVariant {
	id: string;
	typ_cultures: string[];
	typ_adv: string[];
	typ_dadv: string[];
	untyp_adv: string[];
	untyp_dadv: string[];
	hair?: number[];
	eyes?: number[];
	size?: (number | [number, number])[];
}

export interface RawRaceLocale {
	id: string;
	name: string;
	attributeAdjustments: string;
	automaticAdvantages: string;
	stronglyRecommendedAdvantages: string;
	stronglyRecommendedDisadvantages: string;
	commonAdvantages?: string;
	commonDisadvantages?: string;
	uncommonAdvantages?: string;
	uncommonDisadvantages?: string;
	src: number[];
}

export interface RawRaceVariantLocale {
	id: string;
	name: string;
	commonAdvantages?: string;
	commonDisadvantages?: string;
	uncommonAdvantages?: string;
	uncommonDisadvantages?: string;
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
	pre_req: Wiki.ProfessionDependencyObject[];
	req: (Reusable.ProfessionRequiresActivatableObject | Reusable.ProfessionRequiresIncreasableObject)[];
	sel: Wiki.ProfessionSelections;
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
	prerequisitesStart?: string;
	prerequisitesEnd?: string;
	twelveBlessingsAdd?: string;
	suggestedAdvantages?: string;
	suggestedDisadvantages?: string;
	unsuitableAdvantages?: string;
	unsuitableDisadvantages?: string;
	src: number[];
}

export interface RawProfessionVariant {
	id: string;
	ap: number;
	apOfActivatables: number;
	pre_req: Wiki.ProfessionDependencyObject[];
	req: (Reusable.ProfessionRequiresActivatableObject | Reusable.ProfessionRequiresIncreasableObject)[];
	sel: Wiki.ProfessionVariantSelections;
	sa: Reusable.ProfessionRequiresActivatableObject[];
	combattech: [string, number][];
	talents: [string, number][];
	spells: [string, number][];
	chants: [string, number][];
	blessings: string[];
}

export interface RawProfessionVariantLocale {
	id: string;
	name: string | { m: string, f: string };
	precedingText?: string;
	fullText?: string;
	concludingText?: string;
}

export interface RawAdvantage {
	id: string;
	ap: number | number[] | string;
	tiers?: number;
	max?: number;
	sel?: Wiki.SelectionObject[];
	req: ('RCP' | Reusable.AllRequirementTypes)[];
	reqIndex: string[];
	gr: number;
	src: string[];
}

export interface RawAdvantageLocale {
	id: string;
	name: string;
	sel?: Wiki.SelectionObject[];
	input?: string;
	rules: string;
	range?: string;
	actions?: string;
	apValue?: string;
	apValueAppend?: string;
	req?: string;
	/**
	 * 0-based index as key!
	 */
	reqIndex: {
		[key: number]: string;
	};
	reqStart?: string;
	reqEnd?: string;
	src: number[];
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
	src: string[];
}

export interface RawCombatTechniqueLocale {
	id: string;
	name: string;
	special?: string;
	src: number[];
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
	sel?: Wiki.SelectionObject[];
	req: ('RCP' | Reusable.AllRequirementTypes | (number | 'RCP' | Reusable.AllRequirementTypes)[])[];
	gr: number;
	subgr?: number;
	extended?: (string | string[])[];
	property?: number;
	aspect?: number;
	reqIndex: string[];
	src: string[];
}

export interface RawSpecialAbilityLocale {
	id: string;
	name: string;
	sel?: Wiki.SelectionObject[];
	input?: string;
	nameInWiki?: string;
	rules?: string;
	effect?: string;
	volume?: string;
	penalty?: string;
	combatTechniques?: string;
	aeCost?: string;
	protectiveCircle?: string;
	wardingCircle?: string;
	bindingCost?: string;
	property?: string;
	aspect?: string;
	apValue?: string;
	apValueAppend?: string;
	req?: string;
	/**
	 * 0-based index as key!
	 */
	reqIndex: {
		[key: number]: string;
	};
	reqStart?: string;
	reqEnd?: string;
	src: number[];
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
	applications?: {
		id: number;
		prerequisites: Reusable.AllRequirementTypes[];
	}[];
}

export interface RawTalentLocale {
	id: string;
	name: string;
	spec: {
		id: number;
		name: string;
	}[];
	spec_input?: string;
	tools?: string;
	quality: string;
	failed: string;
	critical: string;
	botch: string;
	src: string;
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
	src: string[];
}

export interface RawItemLocale {
	id: string;
	name: string;
	note?: string;
	rules?: string;
	advantage?: string;
	disadvantage?: string;
	src: number[];
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
	advantages: StringKeyObject<RawAdvantage>;
	attributes: StringKeyObject<RawAttribute>;
	blessings: StringKeyObject<RawBlessing>;
	cantrips: StringKeyObject<RawCantrip>;
	combattech: StringKeyObject<RawCombatTechnique>;
	cultures: StringKeyObject<RawCulture>;
	disadvantages: StringKeyObject<RawDisadvantage>;
	el: StringKeyObject<RawExperienceLevel>;
	items: StringKeyObject<RawItem>;
	liturgies: StringKeyObject<RawLiturgy>;
	professions: StringKeyObject<RawProfession>;
	professionvariants: StringKeyObject<RawProfessionVariant>;
	races: StringKeyObject<RawRace>;
	racevariants: StringKeyObject<RawRaceVariant>;
	specialabilities: StringKeyObject<RawSpecialAbility>;
	spells: StringKeyObject<RawSpell>;
	talents: StringKeyObject<RawTalent>;
}

export interface RawLocale {
	ui: UI.UIMessages;
	books: StringKeyObject<Wiki.Book>;
	el: StringKeyObject<RawExperienceLevelLocale>;
	attributes: StringKeyObject<RawAttributeLocale>;
	races: StringKeyObject<RawRaceLocale>;
	racevariants: StringKeyObject<RawRaceVariantLocale>;
	cultures: StringKeyObject<RawCultureLocale>;
	professions: StringKeyObject<RawProfessionLocale>;
	professionvariants: StringKeyObject<RawProfessionVariantLocale>;
	advantages: StringKeyObject<RawAdvantageLocale>;
	disadvantages: StringKeyObject<RawDisadvantageLocale>;
	talents: StringKeyObject<RawTalentLocale>;
	combattech: StringKeyObject<RawCombatTechniqueLocale>;
	spells: StringKeyObject<RawSpellLocale>;
	cantrips: StringKeyObject<RawCantripLocale>;
	liturgies: StringKeyObject<RawLiturgyLocale>;
	blessings: StringKeyObject<RawBlessingLocale>;
	specialabilities: StringKeyObject<RawSpecialAbilityLocale>;
	items: StringKeyObject<RawItemLocale>;
}

export type RawLocaleList = StringKeyObject<RawLocale>;

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
	enableEditingHeroAfterCreationPhase?: boolean;
	meleeItemTemplatesCombatTechniqueFilter?: string;
	rangedItemTemplatesCombatTechniqueFilter?: string;
	enableAnimations?: boolean;
}

export interface Raw {
	config?: Config;
	heroes?: RawHerolist;
	tables: RawTables;
	locales: StringKeyObject<RawLocale>;
}

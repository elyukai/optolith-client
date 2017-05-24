import * as DetailedData from './detaileddata.d';
import * as Categories from '../constants/Categories';

export interface AdventurePoints {
	total: number;
	spent: number;
	adv: [number, number, number];
	disadv: [number, number, number];
}

export type ToListById<T> = {
	[id: string]: T;
};

export type ToOptionalKeys<T> = {
	[K in keyof T]?: T[K];
};

export type ToList<T> = T[];

export interface HeroBase {
	readonly clientVersion: string;
	readonly phase: number;
	readonly name: string;
	readonly avatar?: string;
	readonly ap: AdventurePoints;
	readonly el: string;
	readonly r: string;
	readonly c: string;
	readonly p: string;
	professionName?: string;
	readonly pv?: string;
	readonly sex: 'm' | 'f';
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
	readonly activatable: ToListById<ActiveObject[]>;
	readonly attr: {
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
	readonly talents: ToListById<number>;
	readonly ct: ToListById<number>;
	readonly spells: ToListById<number>;
	readonly cantrips: string[];
	readonly liturgies: ToListById<number>;
	readonly blessings: string[];
	readonly belongings: {
		items: ToListById<ItemInstance>;
		armorZones: ToListById<ArmorZonesInstance>;
		equipment: object;
		pet: object;
		purse: {
			d: string;
			s: string;
			h: string;
			k: string;
		};
	};
	readonly rules: Rules;
	readonly history: HistoryObject[];
	readonly pets: ToListById<PetInstance>;
}

export interface Hero extends HeroBase {
	readonly id?: string;
	readonly dateCreated: Date;
	readonly dateModified: Date;
	player?: string;
}

export interface HeroForSave extends HeroBase {
	id?: string;
	dateCreated: Date;
	dateModified: Date;
}

export interface User {
	id: string;
	displayName: string;
}

export interface RaceInstance {
	readonly id: string;
	readonly name: string;
	readonly ap: number;
	readonly lp: number;
	readonly spi: number;
	readonly tou: number;
	readonly mov: number;
	readonly attributes: [number, string][];
	readonly attributeSelection: [number, string[]];
	readonly typicalCultures: string[];
	readonly autoAdvantages: string[];
	readonly automaticAdvantagesCost: [number, number, number];
	readonly importantAdvantages: string[];
	readonly importantDisadvantages: string[];
	readonly typicalAdvantages: string[];
	readonly typicalDisadvantages: string[];
	readonly untypicalAdvantages: string[];
	readonly untypicalDisadvantages: string[];
	readonly hairColors: number[];
	readonly eyeColors: number[];
	readonly size: (number | [number, number])[];
	readonly weight: (number | [number, number])[];
	readonly category: Categories.RACES;
}

export interface TypicalProfessionObject {
	list: (string | number)[];
	reverse: boolean;
}

export type TypicalProfession = boolean | TypicalProfessionObject;

export interface CultureInstance {
	readonly id: string;
	readonly name: string;
	readonly ap: number;
	readonly languages: number[];
	readonly scripts: number[];
	readonly socialTiers: number[];
	readonly typicalProfessions: TypicalProfession[];
	readonly typicalAdvantages: string[];
	readonly typicalDisadvantages: string[];
	readonly untypicalAdvantages: string[];
	readonly untypicalDisadvantages: string[];
	readonly typicalTalents: string[];
	readonly untypicalTalents: string[];
	readonly talents: [string, number][];
	readonly category: Categories.CULTURES;
}

export interface SpecialisationSelection {
	id: 'SPECIALISATION';
	sid: string | string[];
}

export interface LanguagesScriptsSelection {
	id: 'LANGUAGES_SCRIPTS';
	value: number;
}

export interface CombatTechniquesSelection {
	id: 'COMBAT_TECHNIQUES';
	active?: boolean;
	amount: number;
	value: number;
	sid: string[];
}

export interface CombatTechniquesSecondSelection {
	id: 'COMBAT_TECHNIQUES_SECOND';
	active?: boolean;
	amount: number;
	value: number;
	sid: string[];
}

export interface CantripsSelection {
	id: 'CANTRIPS';
	amount: number;
	value: number;
	sid: string[];
}

export interface CursesSelection {
	id: 'CURSES';
	value: number;
}

export type ProfessionSelectionIds = 'SPECIALISATION' | 'LANGUAGES_SCRIPTS' | 'COMBAT_TECHNIQUES' | 'COMBAT_TECHNIQUES_SECOND' | 'CANTRIPS' | 'CURSES';
export type ProfessionSelection = SpecialisationSelection | LanguagesScriptsSelection | CombatTechniquesSelection | CombatTechniquesSecondSelection | CantripsSelection | CursesSelection;
export type ProfessionSelections = ProfessionSelection[];

export interface Selections {
	attrSel: string;
	useCulturePackage: boolean;
	lang: number;
	buyLiteracy: boolean;
	litc: number;
	cantrips: Set<string>;
	combattech: Set<string>;
	combatTechniquesSecond: Set<string>;
	curses: Map<string, number>;
	langLitc: Map<string, number>;
	spec: string | number;
	specTalentId?: string;
	map: Map<ProfessionSelectionIds, ProfessionSelection>;
}

export interface ProfessionNameForSexes {
	m: string;
	f: string;
}

export interface ProfessionInstance {
	readonly id: string;
	readonly name: string | ProfessionNameForSexes;
	readonly subname?: string | ProfessionNameForSexes;
	readonly ap: number;
	readonly dependencies: ProfessionDependencyObject[];
	readonly requires: RequirementObject[];
	readonly selections: ProfessionSelections;
	readonly specialAbilities: RequirementObject[];
	readonly combatTechniques: [string, number][];
	readonly talents: [string, number][];
	readonly spells: [string, number][];
	readonly liturgies: [string, number][];
	readonly blessings: string[];
	readonly typicalAdvantages: string[];
	readonly typicalDisadvantages: string[];
	readonly untypicalAdvantages: string[];
	readonly untypicalDisadvantages: string[];
	readonly variants: string[];
	readonly category: Categories.PROFESSIONS;
	readonly gr: number;
	/**
	 * Divides the groups into smaller subgroups, e.g. "Mage", "Blessed One of the Twelve Gods" or "Fighter".
	 */
	readonly subgr: number;
	readonly src: {
		id: string;
		page?: number;
	};
}

export interface ProfessionVariantInstance {
	readonly id: string;
	readonly name: string | ProfessionNameForSexes;
	readonly ap: number;
	readonly dependencies: ProfessionDependencyObject[];
	readonly requires: RequirementObject[];
	readonly selections: ProfessionSelections;
	readonly specialAbilities: RequirementObject[];
	readonly combatTechniques: [string, number][];
	readonly talents: [string, number][];
	readonly category: Categories.PROFESSION_VARIANTS;
}

export interface ActiveObject {
	sid?: string | number;
	sid2?: string | number;
	tier?: number;
}

export interface ActiveViewObject {
	id: string;
	name: string;
	tier?: number;
	tiers?: number;
	cost: number;
	disabled: boolean;
	index: number;
	gr?: number;
}

export interface DeactiveViewObject {
	id: string;
	name: string;
	cost?: string | number | number[];
	input?: string | undefined;
	tiers?: number | undefined;
	sel?: SelectionObject[];
	gr?: number;
}

export type SetTierObject = ActiveObject;

export interface ActivateArgs {
	id: string;
	sel?: string | number;
	sel2?: string | number;
	input?: string;
	tier?: number;
	cost: number;
}

export interface UndoExtendedActivateArgs extends ActivateArgs {
	index?: number;
	activeObject?: ActiveObject;
}

export interface DeactivateArgs {
	id: string;
	index: number;
	cost: number;
}

export interface UndoExtendedDeactivateArgs extends DeactivateArgs {
	activeObject?: ActiveObject;
}

export interface ActivateObject {
	sel?: string | number;
	sel2?: string | number;
	input?: string;
	tier?: number;
}

export interface SelectionObject {
	id: string | number;
	name: string;
	cost?: number;
}

export interface ActivatableRequirementObject {
	id: string;
	active: boolean;
	sid?: string | number;
	sid2?: string | number;
}

export interface IncreasableRequirementObject {
	id: string;
	value: number;
	type?: 1 | 2;
}

export interface RequirementObject {
	id: string | string[];
	active?: boolean;
	sid?: string | number | number[];
	sid2?: string | number;
	tier?: number;
	value?: number;
	type?: 1 | 2;
}

export interface SkillOptionalDependency {
	value: number;
	origin: string;
}

export interface SexRequirement {
	id: 'SEX';
	value: 'm' | 'f';
}

export interface RaceRequirement {
	id: 'RACE';
	value: number | number[];
}

export interface CultureRequirement {
	id: 'CULTURE';
	value: number | number[];
}

export type ProfessionDependencyObject = SexRequirement | RaceRequirement | CultureRequirement;
export type AllRequirementObjects = 'RCP' | RequirementObject | ProfessionDependencyObject;

// export interface ProfessionDependencyObject {
// 	id: string;
// 	value: string | string[];
// }

export interface DependencyObject {
	origin?: string;
	active?: boolean;
	sid?: string | number | number[];
	sid2?: string | number;
	tier?: number;
}

export interface ValidationObject extends ActiveObject {
	id: string;
	active: boolean | number;
}

export interface ProfessionDependencyCost {
	total: number;
	adv: [number, number, number];
	disadv: [number, number, number];
}

export type AllDependency = ActivatableInstanceDependency | AttributeInstanceDependency | CombatTechniqueInstanceDependency | SpellInstanceDependency | TalentInstanceDependency;

export type ActivatableInstanceDependency = boolean | DependencyObject;

interface ActivatableInstanceBaseInInit {
	readonly id: string;
	readonly name: string;
	readonly cost: string | number | number[];
	readonly input?: string;
	readonly max?: number;
	readonly reqs: ('RCP' | RequirementObject)[];
	readonly tiers?: number;
	sel?: SelectionObject[];
	dependencies: ActivatableInstanceDependency[];
	active: ActiveObject[];
	gr: number;
}

export interface AdvantageInstanceInInit extends ActivatableInstanceBaseInInit {
	readonly category: Categories.ADVANTAGES;
}

export interface AdvantageInstance extends AdvantageInstanceInInit {
	readonly sel?: SelectionObject[];
}

export interface DisadvantageInstanceInInit extends ActivatableInstanceBaseInInit {
	readonly category: Categories.DISADVANTAGES;
}

export interface DisadvantageInstance extends DisadvantageInstanceInInit {
	readonly sel?: SelectionObject[];
}

export interface SpecialAbilityInstanceInInit extends ActivatableInstanceBaseInInit {
	readonly category: Categories.SPECIAL_ABILITIES;
}

export interface SpecialAbilityInstance extends SpecialAbilityInstanceInInit {
	readonly sel?: SelectionObject[];
}

export type AttributeInstanceDependency = number | SkillOptionalDependency;

export interface AttributeInstance {
	readonly category: Categories.ATTRIBUTES;
	readonly ic: number;
	readonly id: string;
	readonly name: string;
	readonly short: string;
	dependencies: AttributeInstanceDependency[];
	mod: number;
	value: number;
}

export type CombatTechniqueInstanceDependency = number;

export interface CombatTechniqueInstance {
	readonly category: Categories.COMBAT_TECHNIQUES;
	readonly gr: number;
	readonly ic: number;
	readonly id: string;
	readonly name: string;
	readonly bf: number;
	readonly primary: string[];
	dependencies: CombatTechniqueInstanceDependency[];
	value: number;
}

export type LiturgyInstanceDependency = SpellInstanceDependency;

export interface LiturgyInstance {
	readonly aspects: number[];
	readonly category: Categories.LITURGIES;
	readonly check: string[];
	readonly gr: number;
	readonly ic: number;
	readonly id: string;
	readonly name: string;
	readonly tradition: number[];
	active: boolean;
	dependencies: LiturgyInstanceDependency[];
	value: number;
}

export interface BlessingInstance {
	readonly id: string;
	readonly name: string;
	readonly aspects: number[];
	readonly tradition: number[];
	readonly reqs: RequirementObject[];
	readonly category: Categories.BLESSINGS;
	active: boolean;
}

export type SpellInstanceDependency = number | boolean | SkillOptionalDependency;

export interface SpellInstance {
	readonly category: Categories.SPELLS;
	readonly check: string[];
	readonly gr: number;
	readonly ic: number;
	readonly id: string;
	readonly name: string;
	readonly property: number;
	readonly tradition: number[];
	readonly reqs: RequirementObject[];
	active: boolean;
	dependencies: SpellInstanceDependency[];
	value: number;
}

export interface CantripInstance {
	readonly id: string;
	readonly name: string;
	readonly property: number;
	readonly tradition: number[];
	readonly reqs: RequirementObject[];
	readonly category: Categories.CANTRIPS;
	active: boolean;
}

export type TalentInstanceDependency = number | SkillOptionalDependency;

export interface Application {
	id: number;
	name: string;
}

export interface TalentInstance {
	readonly category: Categories.TALENTS;
	readonly check: string[];
	readonly encumbrance: string;
	readonly gr: number;
	readonly ic: number;
	readonly id: string;
	readonly name: string;
	readonly applications?: Application[];
	readonly applicationsInput?: string;
	readonly tools?: string;
	readonly quality?: string;
	readonly failed?: string;
	readonly critical?: string;
	readonly botch?: string;
	readonly src?: string;
	dependencies: TalentInstanceDependency[];
	value: number;
}

export interface ItemInstanceOld {
	id: string;
	name: string;
	ammunition?: string | null;
	combatTechnique: string;
	damageDiceSides: number;
	gr: number;
	isParryingWeapon: boolean;
	isTemplateLocked: boolean;
	reach: number;
	template: string;
	where: string;
	isTwoHandedWeapon: boolean;
	improvisedWeaponGroup?: number;
	at: number;
	addINIPenalty?: number;
	addMOVPenalty?: number;
	damageBonus: number;
	damageDiceNumber: number;
	damageFlat: number;
	enc: number;
	length: number;
	amount: number;
	pa: number;
	price: number;
	pro: number;
	range: [number, number, number];
	reloadTime: number;
	stp: number;
	weight: number;
	stabilityMod?: number;
}

export interface ItemBaseInstance {
	id: string;
	name: string;
	ammunition?: string;
	combatTechnique?: string;
	damageDiceSides?: number;
	gr: number;
	isParryingWeapon?: boolean;
	isTemplateLocked: boolean;
	reach?: number;
	template?: string;
	where?: string;
	isTwoHandedWeapon?: boolean;
	improvisedWeaponGroup?: number;
	loss?: number;
	forArmorZoneOnly?: boolean;
	addPenalties?: boolean;
	armorType?: number;
}

export interface ItemInstance extends ItemBaseInstance {
	at?: number;
	iniMod?: number;
	movMod?: number;
	damageBonus?: number;
	damageDiceNumber?: number;
	damageFlat?: number;
	enc?: number;
	length?: number;
	amount: number;
	pa?: number;
	price: number;
	pro?: number;
	range?: [number, number, number];
	reloadTime?: number;
	stp?: number;
	weight?: number;
	stabilityMod?: number;
}

export interface ItemEditorInstance extends ItemBaseInstance {
	at: string;
	iniMod: string;
	movMod: string;
	damageBonus: string;
	damageDiceNumber: string;
	damageFlat: string;
	enc: string;
	length: string;
	amount: string;
	pa: string;
	price: string;
	pro: string;
	range: [string, string, string];
	reloadTime: string;
	stp: string;
	weight: string;
	stabilityMod: string;
}

export interface ArmorZonesBaseInstance {
	name: string;
	head?: string;
	headLoss?: number;
	leftArm?: string;
	leftArmLoss?: number;
	rightArm?: string;
	rightArmLoss?: number;
	torso?: string;
	torsoLoss?: number;
	leftLeg?: string;
	leftLegLoss?: number;
	rightLeg?: string;
	rightLegLoss?: number;
}

export interface ArmorZonesInstance extends ArmorZonesBaseInstance {
	id: string;
}

export interface ArmorZonesEditorInstance extends ArmorZonesBaseInstance {
	id?: string;
}

export type Instance = AbilityInstanceExtended | RaceInstance | CultureInstance | ProfessionInstance | ProfessionVariantInstance;
export type InstanceInInit = AbilityInstanceInInit | RaceInstance | CultureInstance | ProfessionInstance | ProfessionVariantInstance | BlessingInstance | CantripInstance;
export type AbilityInstance = ActivatableInstance | IncreasableInstance;
export type AbilityInstanceExtended = ActivatableInstance | IncreasableInstance | BlessingInstance | CantripInstance;
export type AbilityInstanceInInit = ActivatableInstanceInInit | IncreasableInstance;
export type ActivatableInstance = AdvantageInstance | DisadvantageInstance | SpecialAbilityInstance;
export type ActivatableInstanceInInit = AdvantageInstanceInInit | DisadvantageInstanceInInit | SpecialAbilityInstanceInInit;
export type IncreasableInstance = AttributeInstance | TalentInstance | CombatTechniqueInstance | SpellInstance | LiturgyInstance;

export type IncreasableNonactiveInstance = AttributeInstance | TalentInstance | CombatTechniqueInstance;
export type SkillInstance = SpellInstance | LiturgyInstance | TalentInstance;
export type SkillishInstance = SpellInstance | LiturgyInstance | TalentInstance | CombatTechniqueInstance;
export type ActivatableSkillishInstance = SpellInstance | LiturgyInstance | CantripInstance | BlessingInstance;

export interface SecondaryAttribute {
	id: string;
	short: string;
	name: string;
	calc: string;
	base?: number;
	add?: number;
	mod?: number;
	value: number | string;
	maxAdd?: number;
	currentAdd?: number;
	permanentLost?: number;
	permanentRedeemed?: number;
}

export interface Energy extends SecondaryAttribute {
	base: number;
	add: number;
	mod: number;
	maxAdd: number;
	currentAdd: number;
}

export interface EnergyWithLoss extends Energy {
	permanentLost: number;
	permanentRedeemed: number;
}

export interface ExperienceLevel {
	id: string;
	name: string;
	ap: number;
	maxAttributeValue: number;
	maxSkillRating: number;
	maxCombatTechniqueRating: number;
	maxTotalAttributeValues: number;
	maxSpellsLiturgies: number;
	maxUnfamiliarSpells: number;
}

export interface Rules {
	higherParadeValues: number;
	attributeValueLimit: boolean;
}

export interface HistoryPayload {
	id?: string | number;
	activeObject?: ActiveObject;
	index?: number;
	list?: (string | [string, number])[];
	buy?: boolean;
}

export interface HistoryObject {
	type: string;
	cost: number;
	payload: HistoryPayload;
	prevState: HistoryPrevState;
}

export interface HistoryPrevState {

}

export interface HistoryObject {
	type: string;
	cost: number;
	payload: HistoryPayload;
	prevState: HistoryPrevState;
}

export interface LanguagesSelectionListItem {
	id: string;
	name: string;
	native?: boolean;
}

export interface ScriptsSelectionListItem {
	id: string;
	name: string;
	cost: number;
	native?: boolean;
}

export type InputTextEvent =  React.FormEvent<HTMLInputElement>;
export type InputKeyEvent =  React.KeyboardEvent<HTMLInputElement>;

export interface SubTab {
	id: string;
	label: string;
	disabled?: boolean;
	// element: JSX.Element;
}

interface PetBaseInstance {
	id?: string;
	name: string;
	avatar?: string;
}

export interface PetInstance extends PetBaseInstance {
	size?: string;
	type?: string;
	attack?: string;
	dp?: string;
	reach?: string;
	actions?: string;
	talents?: string;
	skills?: string;
	notes?: string;
	spentAp?: string;
	totalAp?: string;
	cou?: string;
	sgc?: string;
	int?: string;
	cha?: string;
	dex?: string;
	agi?: string;
	con?: string;
	str?: string;
	lp?: string;
	ae?: string;
	spi?: string;
	tou?: string;
	pro?: string;
	ini?: string;
	mov?: string;
	at?: string;
	pa?: string;
}

export interface PetEditorInstance extends PetBaseInstance {
	size: string;
	type: string;
	attack: string;
	dp: string;
	reach: string;
	actions: string;
	talents: string;
	skills: string;
	notes: string;
	spentAp: string;
	totalAp: string;
	cou: string;
	sgc: string;
	int: string;
	cha: string;
	dex: string;
	agi: string;
	con: string;
	str: string;
	lp: string;
	ae: string;
	spi: string;
	tou: string;
	pro: string;
	ini: string;
	mov: string;
	at: string;
	pa: string;
}

export interface UILocale {
	"titlebar.tabs.home": string;
	"titlebar.tabs.homeintro": string;
	"titlebar.tabs.news": string;
	"titlebar.tabs.lastchanges": string;
	"titlebar.tabs.heroes": string;
	"titlebar.tabs.groups": string;
	"titlebar.tabs.customrules": string;
	"titlebar.tabs.wiki": string;
	"titlebar.tabs.about": string;
	"titlebar.tabs.imprint": string;
	"titlebar.tabs.thirdpartylicenses": string;
	"titlebar.tabs.profile": string;
	"titlebar.tabs.profileoverview": string;
	"titlebar.tabs.charactersheet": string;
	"titlebar.tabs.rules": string;
	"titlebar.tabs.racecultureprofession": string;
	"titlebar.tabs.race": string;
	"titlebar.tabs.culture": string;
	"titlebar.tabs.profession": string;
	"titlebar.tabs.attributes": string;
	"titlebar.tabs.advantagesdisadvantages": string;
	"titlebar.tabs.advantages": string;
	"titlebar.tabs.disadvantages": string;
	"titlebar.tabs.skills": string;
	"titlebar.tabs.talents": string;
	"titlebar.tabs.combattechniques": string;
	"titlebar.tabs.specialabilities": string;
	"titlebar.tabs.spells": string;
	"titlebar.tabs.liturgies": string;
	"titlebar.tabs.belongings": string;
	"titlebar.tabs.equipment": string;
	"titlebar.tabs.zonearmor": string;
	"titlebar.tabs.pets": string;
	"titlebar.actions.login": string;
	"titlebar.actions.logout": string;
	"titlebar.view.adventurepoints": string;
	"titlebar.adventurepoints.title": string;
	"titlebar.adventurepoints.total": string;
	"titlebar.adventurepoints.spent": string;
	"titlebar.adventurepoints.subprefix": string;
	"titlebar.adventurepoints.advantages": string;
	"titlebar.adventurepoints.advantagesmagic": string;
	"titlebar.adventurepoints.advantagesblessed": string;
	"titlebar.adventurepoints.disadvantages": string;
	"titlebar.adventurepoints.disadvantagesmagic": string;
	"titlebar.adventurepoints.disadvantagesblessed": string;
	"options.filtertext": string;
	"options.sortorder.alphabetically": string;
	"options.sortorder.ap": string;
	"options.sortorder.group": string;
	"options.sortorder.improvementcost": string;
	"options.sortorder.property": string;
	"options.sortorder.aspect": string;
	"options.sortorder.location": string;
	"options.sortorder.cost": string;
	"options.showactivated": string;
	"options.none": string;
	"actions.save": string;
	"homeintro.title": string;
	"homeintro.text": string;
	"heroes.actions.create": string;
	"heroes.actions.import": string;
	"heroes.options.filter.all": string;
	"heroes.options.filter.own": string;
	"heroes.options.filter.shared": string;
	"heroes.view.unsavedhero.title": string;
	"heroes.warnings.unsavedactions.title": string;
	"heroes.warnings.unsavedactions.text": string;
	"herocreation.title": string;
	"herocreation.actions.start": string;
	"herocreation.options.nameofhero": string;
	"herocreation.options.selectsex": string;
	"herocreation.options.selectsex.male": string;
	"herocreation.options.selectsex.female": string;
	"herocreation.options.selectexperiencelevel": string;
	"imprint.title": string;
	"profileoverview.view.male": string;
	"profileoverview.view.female": string;
	"profileoverview.view.editprofessionname": string;
	"profileoverview.view.personaldata": string;
	"profileoverview.view.advantages": string;
	"profileoverview.view.disadvantages": string;
	"profileoverview.actions.addadventurepoints": string;
	"profileoverview.actions.endherocreation": string;
	"addadventurepoints.title": string;
	"addadventurepoints.actions.add": string;
	"addadventurepoints.actions.cancel": string;
	"addadventurepoints.options.adventurepoints": string;
	"changeheroavatar.title": string;
	"changeheroavatar.actions.change": string;
	"changeheroavatar.options.selectfile": string;
	"changeheroavatar.warnings.invalidfile": string;
	"personaldata.family": string;
	"personaldata.placeofbirth": string;
	"personaldata.dateofbirth": string;
	"personaldata.age": string;
	"personaldata.haircolor": string;
	"personaldata.eyecolor": string;
	"personaldata.size": string;
	"personaldata.weight": string;
	"personaldata.title": string;
	"personaldata.socialstatus": string;
	"personaldata.characteristics": string;
	"personaldata.otherinfo": string;
	"personaldata.cultureareaknowledge": string;
	"socialstatus": string[];
	"haircolors": string[];
	"eyecolors": string[];
	"settings.title": string;
	"settings.options.language": string;
	"settings.options.defaultlanguage": string;
	"settings.actions.close": string;
	"charactersheet.title": string;
	"charactersheet.actions.printtopdf": string;
	"charactersheet.options.showattributevalues": string;
	"charactersheet.main.title": string;
	"charactersheet.main.heroname": string;
	"charactersheet.main.race": string;
	"charactersheet.main.culture": string;
	"charactersheet.main.profession": string;
	"charactersheet.main.family": string;
	"charactersheet.main.placeofbirth": string;
	"charactersheet.main.dateofbirth": string;
	"charactersheet.main.sex": string;
	"charactersheet.main.age": string;
	"charactersheet.main.haircolor": string;
	"charactersheet.main.eyecolor": string;
	"charactersheet.main.size": string;
	"charactersheet.main.weight": string;
	"charactersheet.main.herotitle": string;
	"charactersheet.main.socialstatus": string;
	"charactersheet.main.characteristics": string;
	"charactersheet.main.otherinfo": string;
	"charactersheet.main.experiencelevel": string;
	"charactersheet.main.totalap": string;
	"charactersheet.main.apcollected": string;
	"charactersheet.main.apspent": string;
	"charactersheet.main.avatar": string;
	"charactersheet.main.advantages": string;
	"charactersheet.main.disadvantages": string;
	"charactersheet.main.generalspecialabilites": string;
	"charactersheet.main.fatepoints": string;
	"charactersheet.main.headers.value": string;
	"charactersheet.main.headers.bonuspenalty": string;
	"charactersheet.main.headers.bonus": string;
	"charactersheet.main.headers.bought": string;
	"charactersheet.main.headers.max": string;
	"charactersheet.main.headers.current": string;
	"charactersheet.main.subheaders.basestat": string;
	"charactersheet.main.subheaders.permanent": string;
	"charactersheet.gamestats.title": string;
	"charactersheet.gamestats.skills.title": string;
	"charactersheet.gamestats.skills.headers.skill": string;
	"charactersheet.gamestats.skills.headers.check": string;
	"charactersheet.gamestats.skills.headers.enc": string;
	"charactersheet.gamestats.skills.headers.ic": string;
	"charactersheet.gamestats.skills.headers.sr": string;
	"charactersheet.gamestats.skills.headers.r": string;
	"charactersheet.gamestats.skills.headers.notes": string;
	"charactersheet.gamestats.skills.enc.yes": string;
	"charactersheet.gamestats.skills.enc.no": string;
	"charactersheet.gamestats.skills.enc.maybe": string;
	"charactersheet.gamestats.skills.subheaders.physical": string;
	"charactersheet.gamestats.skills.subheaders.physicalpages": string;
	"charactersheet.gamestats.skills.subheaders.social": string;
	"charactersheet.gamestats.skills.subheaders.socialpages": string;
	"charactersheet.gamestats.skills.subheaders.nature": string;
	"charactersheet.gamestats.skills.subheaders.naturepages": string;
	"charactersheet.gamestats.skills.subheaders.knowledge": string;
	"charactersheet.gamestats.skills.subheaders.knowledgepages": string;
	"charactersheet.gamestats.skills.subheaders.craft": string;
	"charactersheet.gamestats.skills.subheaders.craftpages": string;
	"charactersheet.gamestats.languages.title": string;
	"charactersheet.gamestats.languages.native": string;
	"charactersheet.gamestats.knownscripts.title": string;
	"charactersheet.gamestats.routinechecks.title": string;
	"charactersheet.gamestats.routinechecks.texts.first": string;
	"charactersheet.gamestats.routinechecks.texts.second": string;
	"charactersheet.gamestats.routinechecks.texts.third": string;
	"charactersheet.gamestats.routinechecks.texts.fourth": string;
	"charactersheet.gamestats.routinechecks.headers.checkmod": string;
	"charactersheet.gamestats.routinechecks.headers.neededsr": string;
	"charactersheet.gamestats.routinechecks.from": string;
	"charactersheet.gamestats.qualitylevels.title": string;
	"charactersheet.gamestats.qualitylevels.headers.skillpoints": string;
	"charactersheet.gamestats.qualitylevels.headers.qualitylevel": string;
	"charactersheet.attributemodifiers.title": string;
	"charactersheet.combat.title": string;
	"charactersheet.combat.combattechniques.title": string;
	"charactersheet.combat.combattechniques.headers.name": string;
	"charactersheet.combat.combattechniques.headers.primaryattribute": string;
	"charactersheet.combat.combattechniques.headers.ic": string;
	"charactersheet.combat.combattechniques.headers.ctr": string;
	"charactersheet.combat.combattechniques.headers.atrc": string;
	"charactersheet.combat.combattechniques.headers.pa": string;
	"charactersheet.combat.lifepoints.title": string;
	"charactersheet.combat.lifepoints.labels.max": string;
	"charactersheet.combat.lifepoints.labels.current": string;
	"charactersheet.combat.lifepoints.labels.pain1": string;
	"charactersheet.combat.lifepoints.labels.pain2": string;
	"charactersheet.combat.lifepoints.labels.pain3": string;
	"charactersheet.combat.lifepoints.labels.pain4": string;
	"charactersheet.combat.lifepoints.labels.dying": string;
	"charactersheet.combat.closecombatweapons.title": string;
	"charactersheet.combat.headers.weapon": string;
	"charactersheet.combat.headers.combattechnique": string;
	"charactersheet.combat.headers.damagebonus": string;
	"charactersheet.combat.headers.dp": string;
	"charactersheet.combat.headers.atpamod": string;
	"charactersheet.combat.headers.reach": string;
	"charactersheet.combat.headers.reachlabels": string[],
	"charactersheet.combat.headers.bf": string,
	"charactersheet.combat.headers.loss": string,
	"charactersheet.combat.headers.at": string;
	"charactersheet.combat.headers.pa": string;
	"charactersheet.combat.headers.weight": string;
	"charactersheet.combat.headers.weightunit": string;
	"charactersheet.combat.rangedcombatweapons.title": string;
	"charactersheet.combat.headers.reloadtime": string;
	"charactersheet.combat.headers.rangebrackets": string;
	"charactersheet.combat.headers.rangedcombat": string;
	"charactersheet.combat.headers.ammunition": string;
	"charactersheet.combat.armor.title": string;
	"charactersheet.combat.headers.armor": string;
	"charactersheet.combat.headers.st": string;
	"charactersheet.combat.headers.pro": string;
	"charactersheet.combat.headers.enc": string;
	"charactersheet.combat.headers.addpenalties": string;
	"charactersheet.combat.headers.where": string;
	"charactersheet.combat.shieldparryingweapon.title": string;
	"charactersheet.combat.headers.shieldparryingweapon": string;
	"charactersheet.combat.headers.structurepoints": string;
	"charactersheet.combat.combatspecialabilities.title": string;
	"charactersheet.combat.conditionsstates.conditions": string;
	"charactersheet.combat.conditionsstates.conditions.animosity": string;
	"charactersheet.combat.conditionsstates.conditions.encumbrance": string;
	"charactersheet.combat.conditionsstates.conditions.intoxicated": string;
	"charactersheet.combat.conditionsstates.conditions.stupor": string;
	"charactersheet.combat.conditionsstates.conditions.rapture": string;
	"charactersheet.combat.conditionsstates.conditions.fear": string;
	"charactersheet.combat.conditionsstates.conditions.paralysis": string;
	"charactersheet.combat.conditionsstates.conditions.pain": string;
	"charactersheet.combat.conditionsstates.conditions.confusion": string;
	"charactersheet.combat.conditionsstates.states": string;
	"charactersheet.combat.conditionsstates.states.immobilized": string;
	"charactersheet.combat.conditionsstates.states.unconscious": string;
	"charactersheet.combat.conditionsstates.states.blind": string;
	"charactersheet.combat.conditionsstates.states.bloodlust": string;
	"charactersheet.combat.conditionsstates.states.burning": string;
	"charactersheet.combat.conditionsstates.states.cramped": string;
	"charactersheet.combat.conditionsstates.states.bound": string;
	"charactersheet.combat.conditionsstates.states.incapacitated": string;
	"charactersheet.combat.conditionsstates.states.diseased": string;
	"charactersheet.combat.conditionsstates.states.prone": string;
	"charactersheet.combat.conditionsstates.states.misfortune": string;
	"charactersheet.combat.conditionsstates.states.rage": string;
	"charactersheet.combat.conditionsstates.states.mute": string;
	"charactersheet.combat.conditionsstates.states.deaf": string;
	"charactersheet.combat.conditionsstates.states.surprised": string;
	"charactersheet.combat.conditionsstates.states.badsmell": string;
	"charactersheet.combat.conditionsstates.states.invisible": string;
	"charactersheet.combat.conditionsstates.states.poisoned": string;
	"charactersheet.combat.conditionsstates.states.petrified": string;
	"charactersheet.belongings.title": string;
	"charactersheet.belongings.equipment.title": string;
	"charactersheet.belongings.equipment.headers.item": string;
	"charactersheet.belongings.equipment.headers.number": string;
	"charactersheet.belongings.equipment.headers.price": string;
	"charactersheet.belongings.equipment.headers.weight": string;
	"charactersheet.belongings.equipment.headers.carriedwhere": string;
	"charactersheet.belongings.equipment.footers.total": string;
	"charactersheet.belongings.purse.title": string;
	"charactersheet.belongings.purse.labels.ducats": string;
	"charactersheet.belongings.purse.labels.silverthalers": string;
	"charactersheet.belongings.purse.labels.halers": string;
	"charactersheet.belongings.purse.labels.kreutzers": string;
	"charactersheet.belongings.purse.labels.gems": string;
	"charactersheet.belongings.purse.labels.jewelry": string;
	"charactersheet.belongings.purse.labels.other": string;
	"charactersheet.belongings.carryingcapacity.title": string;
	"charactersheet.belongings.carryingcapacity.calc": string;
	"charactersheet.belongings.carryingcapacity.label": string;
	"charactersheet.belongings.animal.title": string;
	"charactersheet.spells.title": string;
	"charactersheet.spells.headers.aemax": string;
	"charactersheet.spells.headers.aecurrent": string;
	"charactersheet.spells.spellslist.title": string;
	"charactersheet.spells.spellslist.headers.spellritual": string;
	"charactersheet.spells.spellslist.headers.check": string;
	"charactersheet.spells.spellslist.headers.sr": string;
	"charactersheet.spells.spellslist.headers.cost": string;
	"charactersheet.spells.spellslist.headers.castingtime": string;
	"charactersheet.spells.spellslist.headers.range": string;
	"charactersheet.spells.spellslist.headers.duration": string;
	"charactersheet.spells.spellslist.headers.property": string;
	"charactersheet.spells.spellslist.headers.ic": string;
	"charactersheet.spells.spellslist.headers.effect": string;
	"charactersheet.spells.spellslist.headers.page": string;
	"charactersheet.spells.traditionsproperties.labels.primaryattribute": string;
	"charactersheet.spells.traditionsproperties.labels.properties": string;
	"charactersheet.spells.traditionsproperties.labels.tradition": string;
	"charactersheet.spells.magicalspecialabilities.title": string;
	"charactersheet.spells.cantrips.title": string;
	"charactersheet.chants.title": string;
	"charactersheet.chants.headers.kpmax": string;
	"charactersheet.chants.headers.kpcurrent": string;
	"charactersheet.chants.chantslist.title": string;
	"charactersheet.chants.chantslist.headers.liturgyceremony": string;
	"charactersheet.chants.chantslist.headers.check": string;
	"charactersheet.chants.chantslist.headers.sr": string;
	"charactersheet.chants.chantslist.headers.cost": string;
	"charactersheet.chants.chantslist.headers.castingtime": string;
	"charactersheet.chants.chantslist.headers.range": string;
	"charactersheet.chants.chantslist.headers.duration": string;
	"charactersheet.chants.chantslist.headers.property": string;
	"charactersheet.chants.chantslist.headers.ic": string;
	"charactersheet.chants.chantslist.headers.effect": string;
	"charactersheet.chants.chantslist.headers.page": string;
	"charactersheet.chants.traditionsaspects.labels.primaryattribute": string;
	"charactersheet.chants.traditionsaspects.labels.aspects": string;
	"charactersheet.chants.traditionsaspects.labels.tradition": string;
	"charactersheet.chants.blessedspecialabilities.title": string;
	"charactersheet.chants.blessings.title": string;
	"rules.rulebase": string;
	"rules.optionalrules": string;
	"rules.optionalrules.maximumattributescores": string;
	"rules.optionalrules.higherdefensestats": string;
	"secondaryattributes.lp.name": string;
	"secondaryattributes.lp.short": string;
	"secondaryattributes.lp.calc": string;
	"secondaryattributes.ae.name": string;
	"secondaryattributes.ae.short": string;
	"secondaryattributes.ae.calc": string;
	"secondaryattributes.kp.name": string;
	"secondaryattributes.kp.short": string;
	"secondaryattributes.kp.calc": string;
	"secondaryattributes.spi.name": string;
	"secondaryattributes.spi.short": string;
	"secondaryattributes.spi.calc": string;
	"secondaryattributes.tou.name": string;
	"secondaryattributes.tou.short": string;
	"secondaryattributes.tou.calc": string;
	"secondaryattributes.do.name": string;
	"secondaryattributes.do.short": string;
	"secondaryattributes.do.calc": string;
	"secondaryattributes.ini.name": string;
	"secondaryattributes.ini.short": string;
	"secondaryattributes.ini.calc": string;
	"secondaryattributes.mov.name": string;
	"secondaryattributes.mov.short": string;
	"secondaryattributes.mov.calc": string;
	"secondaryattributes.ws.name": string;
	"secondaryattributes.ws.short": string;
	"secondaryattributes.ws.calc": string;
	"rcp.actions.select": string;
	"rcp.actions.next": string;
	"races.options.showvalues": string;
	"cultures.options.allcultures": string;
	"cultures.options.commoncultures": string;
	"cultures.options.showculturalpackagevalues": string;
	"professions.options.allprofessions": string;
	"professions.options.commonprofessions": string;
	"professions.options.allprofessiongroups": string;
	"professions.options.mundaneprofessions": string;
	"professions.options.magicalprofessions": string;
	"professions.options.blessedprofessions": string;
	"professions.options.alwaysshowprofessionsfromextensions": string;
	"professions.options.novariant": string;
	"professions.ownprofession": string;
	"rcpselections.labels.selectattributeadjustment": string;
	"rcpselections.labels.buyculturalpackage": string;
	"rcpselections.labels.selectnativetongue": string;
	"rcpselections.labels.buyscript": string;
	"rcpselections.labels.selectscript": string;
	"rcpselections.labels.onecantrip": string;
	"rcpselections.labels.twocantrips": string;
	"rcpselections.labels.fromthefollowinglist": string;
	"rcpselections.labels.one": string;
	"rcpselections.labels.two": string;
	"rcpselections.labels.more": string;
	"rcpselections.labels.ofthefollowingcombattechniques": string;
	"rcpselections.labels.cursestotaling": string;
	"rcpselections.labels.languagesandliteracytotaling": string;
	"rcpselections.labels.left": string;
	"rcpselections.labels.applicationforskillspecialization": string;
	"rcpselections.actions.complete": string;
	"attributes.view.attributetotal": string;
	"attributes.tooltips.modifier": string;
	"attributes.tooltips.bought": string;
	"attributes.tooltips.losttotal": string;
	"attributes.tooltips.boughtback": string;
	"attributes.pae.name": string;
	"attributes.pae.short": string;
	"attributes.pkp.name": string;
	"attributes.pkp.short": string;
	"advantages.options.common": string;
	"disadvantages.options.common": string;
	"activatable.view.afraidof": string;
	"activatable.view.immunityto": string;
	"skills.options.commoninculture": string;
	"skills.view.groups": string[];
	"info.applications": string;
	"info.encumbrance": string;
	"info.tools": string;
	"info.quality": string;
	"info.failedcheck": string;
	"info.criticalsuccess": string;
	"info.botch": string;
	"info.improvementcost": string;
	"view.commoninculture": string;
	"view.uncommoninculture": string;
	"combattechniques.view.groups": string[];
	"actions.addtolist": string;
	"specialabilities.view.groups": string[];
	"spells.view.groups": string[];
	"spells.view.cantrip": string;
	"spells.view.properties": string[];
	"spells.view.traditions": string[];
	"liturgies.view.groups": string[];
	"liturgies.view.blessing": string;
	"liturgies.view.aspects": string[];
	"equipment.actions.create": string;
	"equipment.view.purse": string;
	"equipment.view.ducates": string;
	"equipment.view.silverthalers": string;
	"equipment.view.hellers": string;
	"equipment.view.kreutzers": string;
	"equipment.view.initialstartingwealth": string;
	"equipment.view.carringandliftingcapactity": string;
	"equipment.view.price": string;
	"equipment.view.weight": string;
	"equipment.view.groups": string[];
	"equipment.view.armortypes": string[];
	"equipment.view.dice": string[];
	"equipment.view.list.ammunitionsubtitle": string;
	"equipment.view.list.weight": string;
	"equipment.view.list.weightunit": string;
	"equipment.view.list.price": string;
	"equipment.view.list.priceunit": string;
	"equipment.view.list.combattechnique": string;
	"equipment.view.list.damage": string;
	"equipment.view.list.dice": string;
	"equipment.view.list.primaryattributedamagethreshold": string;
	"equipment.view.list.atpamod": string;
	"equipment.view.list.reach": string;
	"equipment.view.list.reachlabels": string[];
	"equipment.view.list.length": string;
	"equipment.view.list.lengthunit": string;
	"equipment.view.list.reloadtime": string;
	"equipment.view.list.reloadtimeunit": string;
	"equipment.view.list.range": string;
	"equipment.view.list.ammunition": string;
	"equipment.view.list.pro": string;
	"equipment.view.list.enc": string;
	"equipment.view.list.additionalpenalties": string;
	"itemeditor.titleedit": string;
	"itemeditor.titlecreate": string;
	"itemeditor.options.number": string;
	"itemeditor.options.name": string;
	"itemeditor.options.price": string;
	"itemeditor.options.weight": string;
	"itemeditor.options.carriedwhere": string;
	"itemeditor.options.gr": string;
	"itemeditor.options.grhint": string;
	"itemeditor.options.improvisedweapon": string;
	"itemeditor.options.improvisedweapongr": string;
	"itemeditor.options.template": string;
	"itemeditor.options.combattechnique": string;
	"itemeditor.options.damagethreshold": string;
	"itemeditor.options.damage": string;
	"itemeditor.options.damagedice": string;
	"itemeditor.options.bfmod": string;
	"itemeditor.options.weaponloss": string;
	"itemeditor.options.reach": string;
	"itemeditor.options.reachshort": string;
	"itemeditor.options.reachmedium": string;
	"itemeditor.options.reachlong": string;
	"itemeditor.options.atpamod": string;
	"itemeditor.options.structurepoints": string;
	"itemeditor.options.length": string;
	"itemeditor.options.parryingweapon": string;
	"itemeditor.options.twohandedweapon": string;
	"itemeditor.options.reloadtime": string;
	"itemeditor.options.rangeclose": string;
	"itemeditor.options.rangemedium": string;
	"itemeditor.options.rangefar": string;
	"itemeditor.options.ammunition": string;
	"itemeditor.options.pro": string;
	"itemeditor.options.enc": string;
	"itemeditor.options.armortype": string;
	"itemeditor.options.stabilitymod": string;
	"itemeditor.options.armorloss": string;
	"itemeditor.options.zonesonly": string;
	"itemeditor.options.movmod": string;
	"itemeditor.options.inimod": string;
	"itemeditor.options.additionalpenalties": string;
	"zonearmor.actions.create": string;
	"zonearmoreditor.titleedit": string;
	"zonearmoreditor.titlecreate": string;
	"zonearmoreditor.options.name": string;
	"zonearmoreditor.options.loss": string;
	"zonearmoreditor.options.head": string;
	"zonearmoreditor.options.torso": string;
	"zonearmoreditor.options.leftarm": string;
	"zonearmoreditor.options.rightarm": string;
	"zonearmoreditor.options.leftleg": string;
	"zonearmoreditor.options.rightleg": string;
	"pet.name": string;
	"pet.sizecategory": string;
	"pet.type": string;
	"pet.apspent": string;
	"pet.totalap": string;
	"pet.ap": string;
	"pet.lp": string;
	"pet.ae": string;
	"pet.spi": string;
	"pet.tou": string;
	"pet.pro": string;
	"pet.ini": string;
	"pet.mov": string;
	"pet.attack": string;
	"pet.at": string;
	"pet.pa": string;
	"pet.dp": string;
	"pet.reach": string;
	"pet.reachshort": string;
	"pet.reachmedium": string;
	"pet.reachlong": string;
	"pet.actions": string;
	"pet.skills": string;
	"pet.specialabilities": string;
	"pet.notes": string;
	"avatarchange.title": string;
	"avatarchange.actions.selectfile": string;
	"avatarchange.actions.change": string;
	"avatarchange.dialog.image": string;
	"avatarchange.view.invalidfile": string;
	"fileapi.error.title": string;
	"fileapi.error.message.code": string;
	"fileapi.error.message.loadtables": string;
	"fileapi.error.message.loadl10ns": string;
	"fileapi.error.message.saveconfig": string;
	"fileapi.error.message.saveheroes": string;
	"fileapi.exporthero.title": string;
	"fileapi.exporthero.success": string;
	"fileapi.error.message.exporthero": string;
	"fileapi.printcharactersheettopdf.title": string;
	"fileapi.printcharactersheettopdf.success": string;
	"fileapi.error.message.printcharactersheettopdf": string;
	"fileapi.error.message.printcharactersheettopdfpreparation": string;
	"fileapi.error.message.importhero": string;
}

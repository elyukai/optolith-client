import { Action } from 'redux';
import * as DetailedData from './detaileddata.d';
import * as Reusable from './reusable.d';
import * as Categories from '../constants/Categories';

export interface InstanceByCategory {
	'ADVANTAGES': AdvantageInstance;
	'ATTRIBUTES': AttributeInstance;
	'BLESSINGS': BlessingInstance;
	'CANTRIPS': CantripInstance;
	'COMBAT_TECHNIQUES': CombatTechniqueInstance;
	'CULTURES': CultureInstance;
	'DISADVANTAGES': DisadvantageInstance;
	'LITURGIES': LiturgyInstance;
	'PROFESSIONS': ProfessionInstance;
	'PROFESSION_VARIANTS': ProfessionVariantInstance;
	'RACES': RaceInstance;
	'SPECIAL_ABILITIES': SpecialAbilityInstance;
	'SPELLS': SpellInstance;
	'TALENTS': TalentInstance;
}

export type InstanceWithGroups = CombatTechniqueInstance | LiturgyInstance | SpecialAbilityInstance | SpellInstance | TalentInstance;

export interface AdventurePoints {
	total: number;
	spent: number;
	adv: [number, number, number];
	disadv: [number, number, number];
}

export interface Book {
	id: string;
	short: string;
	name: string;
}

export interface ToListById<T> {
	[id: string]: T;
}

export type ToOptionalKeys<T> = {
	[K in keyof T]?: T[K];
};

export type SMap<T> = Map<string, T>;

export interface HeroBaseForHerolist {
	readonly name: string;
	readonly avatar?: string;
	readonly ap: AdventurePoints;
	readonly r: string;
	readonly c: string;
	readonly p: string;
	professionName?: string;
	readonly pv?: string;
	readonly sex: 'm' | 'f';
}

export interface HeroBase extends HeroBaseForHerolist {
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
	readonly activatable: ToListById<ActiveObject[]>;
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
	readonly talents: ToListById<number>;
	readonly ct: ToListById<number>;
	readonly spells: ToListById<number>;
	readonly cantrips: string[];
	readonly liturgies: ToListById<number>;
	readonly blessings: string[];
	readonly belongings: {
		items: ToListById<ItemInstance>;
		armorZones: ToListById<ArmorZonesInstance>;
		purse: {
			d: string;
			s: string;
			h: string;
			k: string;
		};
	};
	readonly rules: Rules;
	readonly pets?: ToListById<PetInstance>;
}

export interface Hero extends HeroBase {
	readonly id: string;
	readonly dateCreated: Date;
	readonly dateModified: Date;
	player?: string;
}

export interface HeroForSave extends HeroBase {
	id?: string;
	dateCreated?: Date;
	dateModified?: Date;
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
	readonly attributeAdjustments: [number, string][];
	readonly attributeAdjustmentsSelection: [number, string[]];
	readonly attributeAdjustmentsText: string;
	readonly commonCultures: string[];
	readonly automaticAdvantages: string[];
	readonly automaticAdvantagesCost: [number, number, number];
	readonly automaticAdvantagesText: string;
	readonly stronglyRecommendedAdvantages: string[];
	readonly stronglyRecommendedAdvantagesText: string;
	readonly stronglyRecommendedDisadvantages: string[];
	readonly stronglyRecommendedDisadvantagesText: string;
	readonly commonAdvantages: string[];
	readonly commonAdvantagesText: string;
	readonly commonDisadvantages: string[];
	readonly commonDisadvantagesText: string;
	readonly uncommonAdvantages: string[];
	readonly uncommonAdvantagesText: string;
	readonly uncommonDisadvantages: string[];
	readonly uncommonDisadvantagesText: string;
	readonly hairColors: number[];
	readonly eyeColors: number[];
	readonly size: (number | [number, number])[];
	readonly weight: (number | [number, number])[];
	readonly category: Categories.RACES;
	readonly src: SourceLink[];
}

export interface SourceLink {
	id: string;
	page: number;
}

export interface CommonProfessionObject {
	list: (string | number)[];
	reverse: boolean;
}

export type CommonProfession = boolean | CommonProfessionObject;

export interface CultureInstance {
	readonly id: string;
	readonly name: string;
	readonly ap: number;
	readonly languages: number[];
	readonly scripts: number[];
	readonly socialTiers: number[];
	readonly typicalProfessions: CommonProfession[];
	readonly typicalAdvantages: string[];
	readonly typicalDisadvantages: string[];
	readonly untypicalAdvantages: string[];
	readonly untypicalDisadvantages: string[];
	readonly typicalTalents: string[];
	readonly untypicalTalents: string[];
	readonly talents: [string, number][];
	readonly category: Categories.CULTURES;
	readonly src: SourceLink[];
	areaKnowledgeShort: string;
	areaKnowledge: string;
	commonMundaneProfessions?: string;
	commonMagicProfessions?: string;
	commonBlessedProfessions?: string;
	commonAdvantages?: string;
	commonDisadvantages?: string;
	uncommonAdvantages?: string;
	uncommonDisadvantages?: string;
	/**
	 * Markdown supported.
	 */
	commonNames: string;
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
	sid: string[];
}

export interface CursesSelection {
	id: 'CURSES';
	value: number;
}

export interface SkillsSelection {
	id: 'SKILLS';
	/**
	 * If specified, only choose from skills of the specified group.
	 */
	gr?: number;
	/**
	 * The AP value the user can spend.
	 */
	value: number;
}

export type ProfessionSelectionIds = 'SPECIALISATION' | 'LANGUAGES_SCRIPTS' | 'COMBAT_TECHNIQUES' | 'COMBAT_TECHNIQUES_SECOND' | 'CANTRIPS' | 'CURSES' | 'SKILLS';
export type ProfessionSelection = SpecialisationSelection | LanguagesScriptsSelection | CombatTechniquesSelection | CombatTechniquesSecondSelection | CantripsSelection | CursesSelection | SkillsSelection;
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
	skills: Map<string, number>;
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
	readonly apOfActivatables: number;
	readonly dependencies: ProfessionDependencyObject[];
	readonly requires: (Reusable.ProfessionRequiresActivatableObject | Reusable.ProfessionRequiresIncreasableObject)[];
	readonly selections: ProfessionSelections;
	readonly specialAbilities: Reusable.ProfessionRequiresActivatableObject[];
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
	readonly src: SourceLink[];
}

export interface ProfessionVariantInstance {
	readonly id: string;
	readonly name: string | ProfessionNameForSexes;
	readonly ap: number;
	readonly apOfActivatables: number;
	readonly dependencies: ProfessionDependencyObject[];
	readonly requires: (Reusable.ProfessionRequiresActivatableObject | Reusable.ProfessionRequiresIncreasableObject)[];
	readonly selections: ProfessionSelections;
	readonly specialAbilities: Reusable.ProfessionRequiresActivatableObject[];
	readonly combatTechniques: [string, number][];
	readonly talents: [string, number][];
	readonly spells: [string, number][];
	readonly liturgies: [string, number][];
	precedingText?: string;
	concludingText?: string;
	readonly category: Categories.PROFESSION_VARIANTS;
}

export interface ActiveObject {
	sid?: string | number;
	sid2?: string | number;
	tier?: number;
	cost?: number;
}

export interface ActiveObjectName extends ActiveObject {
	name: string;
}

export interface ActiveObjectWithId extends ActiveObject {
	id: string;
	index: number;
}

export interface ActivatableNameCost extends ActiveObjectWithId {
	combinedName: string;
	baseName: string;
	addName: string | undefined;
	currentCost: number | number[];
}

export interface ActivatableNameCostActive extends ActivatableNameCost {
	active: boolean;
}

export interface ActivatableNameCostEvalTier extends ActivatableNameCost {
	currentCost: number;
	tierName?: string;
}

export interface ActiveViewObject {
	id: string;
	index: number;
	name: string;
	tier?: number;
	minTier?: number;
	maxTier?: number;
	cost: number;
	disabled: boolean;
	gr?: number;
	instance: ActivatableInstance;
	customCost?: boolean;
	tierName?: string;
}

export interface DeactiveViewObject {
	id: string;
	name: string;
	cost?: string | number | number[];
	input?: string;
	tiers?: number;
	minTier?: number;
	maxTier?: number;
	sel?: SelectionObject[];
	gr?: number;
	instance: ActivatableInstance;
	customCostDisabled?: boolean;
}

export type SetTierObject = ActiveObject;

export interface ActivateArgs {
	id: string;
	sel?: string | number;
	sel2?: string | number;
	input?: string;
	tier?: number;
	cost: number;
	customCost?: number;
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
	cost?: number;
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

export type ProfessionDependencyObject = Reusable.SexRequirement | Reusable.RaceRequirement | Reusable.CultureRequirement;
export type AllRequirementObjects = Reusable.CultureRequirement | Reusable.RaceRequirement | Reusable.RequiresActivatableObject | Reusable.RequiresIncreasableObject | Reusable.RequiresPrimaryAttribute | Reusable.SexRequirement;
export type AllRequirements = 'RCP' | Reusable.CultureRequirement | Reusable.RaceRequirement | Reusable.RequiresActivatableObject | Reusable.RequiresIncreasableObject | Reusable.RequiresPrimaryAttribute | Reusable.SexRequirement;

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
	readonly reqs: ('RCP' | Reusable.AllRequirementTypes)[] | Map<number, ('RCP' | Reusable.AllRequirementTypes)[]>;
	readonly tiers?: number;
	sel?: SelectionObject[];
	dependencies: ActivatableInstanceDependency[];
	active: ActiveObject[];
	gr?: number;
}

export interface AdvantageInstanceInInit extends ActivatableInstanceBaseInInit {
	readonly category: Categories.ADVANTAGES;
	gr?: undefined;
	rules: string;
	range?: string;
	actions?: string;
	apValue?: string;
	apValueAppend?: string;
}

export interface AdvantageInstance extends AdvantageInstanceInInit {
	readonly sel?: SelectionObject[];
}

export interface DisadvantageInstanceInInit extends ActivatableInstanceBaseInInit {
	readonly category: Categories.DISADVANTAGES;
	gr?: undefined;
	rules: string;
	range?: string;
	actions?: string;
	apValue?: string;
	apValueAppend?: string;
}

export interface DisadvantageInstance extends DisadvantageInstanceInInit {
	readonly sel?: SelectionObject[];
}

export interface SpecialAbilityInstanceInInit extends ActivatableInstanceBaseInInit {
	readonly category: Categories.SPECIAL_ABILITIES;
	readonly extended?: (string | string[])[];
	gr: number;
}

export interface SpecialAbilityInstance extends SpecialAbilityInstanceInInit {
	readonly sel?: SelectionObject[];
}

export interface StyleDependency {
	/**
	 * The extended special ability or list of available special abilities.
	 */
	id: string | string[];
	/**
	 * If a ability meets a given id, the id, otherwise `undefined`.
	 */
	active?: string;
	/**
	 * The style's id.
	 */
	origin: string;
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

export interface AttributeInstanceDerived extends AttributeInstance {
	isDecreasable: boolean;
	isIncreasable: boolean;
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
	readonly check: [string, string, string];
	readonly checkmod?: "SPI" | "TOU";
	readonly gr: number;
	readonly ic: number;
	readonly id: string;
	readonly name: string;
	readonly tradition: number[];
	active: boolean;
	dependencies: LiturgyInstanceDependency[];
	value: number;
	readonly effect: string;
	readonly castingTime: string;
	readonly castingTimeShort: string;
	readonly cost: string;
	readonly costShort: string;
	readonly range: string;
	readonly rangeShort: string;
	readonly duration: string;
	readonly durationShort: string;
	readonly target: string;
	readonly src: SourceLink[];
}

export interface BlessingInstance {
	readonly id: string;
	readonly name: string;
	readonly aspects: number[];
	readonly tradition: number[];
	readonly reqs: Reusable.AllRequirementTypes[];
	readonly category: Categories.BLESSINGS;
	active: boolean;
	dependencies: boolean[];
	readonly effect: string;
	readonly range: string;
	readonly duration: string;
	readonly target: string;
	readonly src: SourceLink[];
}

export type SpellInstanceDependency = number | boolean | SkillOptionalDependency;

export interface SpellInstance {
	readonly category: Categories.SPELLS;
	readonly check: [string, string, string];
	readonly checkmod?: "SPI" | "TOU";
	readonly gr: number;
	readonly ic: number;
	readonly id: string;
	readonly name: string;
	readonly property: number;
	readonly tradition: number[];
	readonly subtradition: number[];
	readonly reqs: Reusable.AllRequirementTypes[];
	active: boolean;
	dependencies: SpellInstanceDependency[];
	value: number;
	readonly effect: string;
	readonly castingTime: string;
	readonly castingTimeShort: string;
	readonly cost: string;
	readonly costShort: string;
	readonly range: string;
	readonly rangeShort: string;
	readonly duration: string;
	readonly durationShort: string;
	readonly target: string;
	readonly src: SourceLink[];
}

export interface SkillExtension extends SelectionObject {
	target: string;
	tier: 1 | 2 | 3;
	effect: string;
}

export interface CantripInstance {
	readonly id: string;
	readonly name: string;
	readonly property: number;
	readonly tradition: number[];
	readonly reqs: Reusable.AllRequirementTypes[];
	readonly category: Categories.CANTRIPS;
	active: boolean;
	dependencies: boolean[];
	readonly effect: string;
	readonly range: string;
	readonly duration: string;
	readonly target: string;
	readonly note?: string;
	readonly src: SourceLink[];
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
	damageBonus?: {
		primary?: string;
		threshold: number | number[];
	};
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
	damageBonus: {
		primary?: string;
		threshold: string | string[];
	};
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
export type AllInstancesList = Map<string, Instance>;

export type IncreasableNonactiveInstance = AttributeInstance | TalentInstance | CombatTechniqueInstance;
export type SkillInstance = SpellInstance | LiturgyInstance | TalentInstance;
export type SkillishInstance = SpellInstance | LiturgyInstance | TalentInstance | CombatTechniqueInstance;
export type ActivatableSkillInstance = SpellInstance | LiturgyInstance;
export type CantripBlessingInstances = CantripInstance | BlessingInstance;
export type ActivatableSkillishInstance = ActivatableSkillInstance | CantripBlessingInstances;

export interface SecondaryAttribute<I = string> {
	id: I;
	short: string;
	name: string;
	calc: string;
	base: number;
	add?: number;
	mod?: number;
	value: number | undefined;
	maxAdd?: number;
	currentAdd?: number;
	permanentLost?: number;
	permanentRedeemed?: number;
}

export interface Energy<I = string> extends SecondaryAttribute<I> {
	base: number;
	add: number;
	mod: number;
	maxAdd: number;
	currentAdd: number;
	permanentLost: number;
}

export interface EnergyWithLoss<I = string> extends Energy<I> {
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

export interface AlertButtonCore {
	autoWidth?: boolean;
	children?: React.ReactNode;
	className?: string;
	disabled?: boolean;
	flat?: boolean;
	fullWidth?: boolean;
	label: string | undefined;
	primary?: boolean;
}

export interface AlertButton extends AlertButtonCore {
	dispatchOnClick?: Action;
}

export interface ViewAlertButton extends AlertButtonCore {
	onClick?(): void;
}

export interface Alert {
	message: string;
	title?: string;
	buttons?: AlertButton[];
	confirm?: [Action | undefined, Action | undefined];
	confirmYesNo?: boolean;
	onClose?(): void;
}

export { UIMessages } from './ui.d';

/// <reference path="./constants/Categories.d.ts" />

declare interface AdventurePoints {
	total: number;
	spent: number;
	adv: [number, number, number];
	disadv: [number, number, number];
}

interface HeroBase {
	readonly clientVersion: string;
	readonly player?: string;
	readonly phase: number;
	readonly name: string;
	readonly avatar: string;
	readonly ap: AdventurePoints;
	readonly el: string;
	readonly r: string;
	readonly c: string;
	readonly p: string;
	readonly pv: string | null;
	readonly sex: 'm' | 'f';
}

interface Hero extends HeroBase {
	readonly id: string;
	readonly dateCreated: Date;
	readonly dateModified: Date;
}

interface User {
	id: string;
	displayName: string;
}

interface HeroRest {
	readonly pers: {
		readonly family: string;
		readonly placeofbirth: string;
		readonly dateofbirth: string;
		readonly age: string;
		readonly haircolor: number;
		readonly eyecolor: number;
		readonly size: string;
		readonly weight: string;
		readonly title: string;
		readonly socialstatus: number;
		readonly characteristics: string;
		readonly otherinfo: string;
	};
	readonly activatable: {
		readonly [id: string]: ActiveObject[];
	};
	readonly disadv: {
		readonly ratingVisible: boolean;
	};
	readonly attr: {
		readonly values: [string, number, number][];
		readonly lp: number;
		readonly ae: number;
		readonly kp: number;
		readonly permanentAE: {
			lost: number;
			redeemed: number;
		};
		readonly permanentKP: {
			lost: number;
			redeemed: number;
		};
	};
	readonly talents: {
		readonly active: {
			readonly [id: string]: number;
		};
		readonly ratingVisible: boolean;
	};
	readonly ct: {
		readonly active: {
			readonly [id: string]: number;
		};
	};
	readonly spells: {
		readonly active: {
			readonly [id: string]: number | null;
		};
	};
	readonly chants: {
		readonly active: {
			readonly [id: string]: number | null;
		};
	};
	readonly inventory: {
		readonly items: {
			readonly [id: string]: ItemInstance;
		};
		readonly equipment: object;
		readonly purse: {
			readonly d: string;
			readonly s: string;
			readonly h: string;
			readonly k: string;
		};
	};
	readonly history: HistoryObject[];
}

interface RaceInstance {
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
	readonly category: RACES;
}

interface CultureInstance {
	readonly id: string;
	readonly name: string;
	readonly ap: number;
	readonly languages: number[];
	readonly scripts: number[];
	readonly socialTiers: number[];
	readonly typicalProfessions: string[];
	readonly typicalAdvantages: string[];
	readonly typicalDisadvantages: string[];
	readonly untypicalAdvantages: string[];
	readonly untypicalDisadvantages: string[];
	readonly typicalTalents: string[];
	readonly untypicalTalents: string[];
	readonly talents: [string, number][];
	readonly category: CULTURES;
}

interface SpecialisationSelection {
	id: 'SPECIALISATION';
	sid: string;
}

interface LanguagesScriptsSelection {
	id: 'LANGUAGES_SCRIPTS';
	value: number;
}

interface CombatTechniquesSelection {
	id: 'COMBAT_TECHNIQUES';
	active?: boolean;
	amount: number;
	value: number;
	sid: string[];
}

interface CantripsSelection {
	id: 'CANTRIPS';
	amount: number;
	value: number;
	sid: string[];
}

interface CursesSelection {
	id: 'CURSES';
	value: number;
}

type ProfessionSelectionIds = 'SPECIALISATION' | 'LANGUAGES_SCRIPTS' | 'COMBAT_TECHNIQUES' | 'CANTRIPS' | 'CURSES';
type ProfessionSelection = SpecialisationSelection | LanguagesScriptsSelection | CombatTechniquesSelection | CantripsSelection | CursesSelection;
type ProfessionSelections = ProfessionSelection[];

interface ProfessionNameForSexes {
	m: string;
	f: string;
}

interface ProfessionInstance {
	readonly id: string;
	readonly name: string | ProfessionNameForSexes;
	readonly subname: string | ProfessionNameForSexes;
	readonly ap: number;
	readonly dependencies: ProfessionDependencyObject[];
	readonly requires: RequirementObject[];
	readonly selections: ProfessionSelections;
	readonly specialAbilities: RequirementObject[];
	readonly combatTechniques: [string, number][];
	readonly talents: [string, number][];
	readonly spells: [string, number | null][];
	readonly liturgies: [string, number | null][];
	readonly typicalAdvantages: string[];
	readonly typicalDisadvantages: string[];
	readonly untypicalAdvantages: string[];
	readonly untypicalDisadvantages: string[];
	readonly variants: string[];
	readonly category: PROFESSIONS;
}

interface ProfessionVariantInstance {
	readonly id: string;
	readonly name: string | ProfessionNameForSexes;
	readonly ap: number;
	readonly dependencies: ProfessionDependencyObject[];
	readonly requires: RequirementObject[];
	readonly selections: ProfessionSelections;
	readonly specialAbilities: RequirementObject[];
	readonly combatTechniques: [string, number][];
	readonly talents: [string, number][];
	readonly category: PROFESSION_VARIANTS;
}

interface ActiveObject {
	sid?: string | number;
	sid2?: string | number;
	tier?: number;
}

interface ActiveViewObject {
	id: string;
	active: ActiveObject;
	index: number;
	gr?: number;
}

type SetTierObject = ActiveObject;

interface ActivateObject {
	sel?: string | number;
	sel2?: string | number;
	input?: string;
	tier?: number;
}

interface SelectionObject {
	id: string | number;
	name: string;
	cost?: number;
}

interface ActivatableRequirementObject {
	id: string;
	active: boolean;
	sid?: string | number;
	sid2?: string | number;
}

interface IncreasableRequirementObject {
	id: string;
	value: number;
	type?: 1 | 2;
}

interface RequirementObject {
	id: string;
	active?: boolean;
	sid?: string | number | number[];
	sid2?: string | number;
	tier?: number;
	value?: number;
	type?: 1 | 2;
}

interface ProfessionDependencyObject {
	id: string;
	value: string | string[];
}

interface DependencyObject {
	sid?: string | number;
	sid2?: string | number;
}

interface ValidationObject extends ActiveObject {
	id: string;
	active: boolean | number;
}

interface AdvantageInstance {
	readonly id: string;
	readonly name: string;
	readonly cost: string | number | number[];
	readonly input: string | null;
	readonly max: number | null;
	readonly reqs: ('RCP' | RequirementObject)[];
	readonly tiers?: number | null;
	readonly sel: SelectionObject[];
	readonly gr: number;
	readonly category: ADVANTAGES;
	dependencies: (boolean | ActiveObject)[];
	active: ActiveObject[];
	readonly sid: (string | number)[];
	readonly dsid: (string | number | boolean | undefined)[];
	getSelectionItem(id: string | number): SelectionObject | undefined;
	addDependencies(adds?: RequirementObject[], sel?: string | undefined): void;
	removeDependencies(adds?: RequirementObject[], sel?: string | undefined): void;
	addDependency(dependency: boolean | ActiveObject): void;
	removeDependency(dependency: boolean | ActiveObject): boolean;
	readonly isMultiselect: boolean;
	readonly isActive: boolean;
	readonly isActivatable: boolean;
	readonly isDeactivatable: boolean;
	activate(args: ActivateArgs): void;
	deactivate(index: number): void;
	setTier(index: number, tier: number): void;
	reset(): void;
}

interface DisadvantageInstance {
	readonly id: string;
	readonly name: string;
	readonly cost: string | number | number[];
	readonly input: string | null;
	readonly max: number | null;
	readonly reqs: ('RCP' | RequirementObject)[];
	readonly tiers?: number | null;
	readonly sel: SelectionObject[];
	readonly gr: number;
	readonly category: DISADVANTAGES;
	dependencies: (boolean | ActiveObject)[];
	active: ActiveObject[];
	readonly sid: (string | number)[];
	readonly dsid: (string | number | boolean | undefined)[];
	getSelectionItem(id: string | number): SelectionObject | undefined;
	addDependencies(adds?: RequirementObject[], sel?: string | undefined): void;
	removeDependencies(adds?: RequirementObject[], sel?: string | undefined): void;
	addDependency(dependency: boolean | ActiveObject): void;
	removeDependency(dependency: boolean | ActiveObject): boolean;
	readonly isMultiselect: boolean;
	readonly isActive: boolean;
	readonly isActivatable: boolean;
	readonly isDeactivatable: boolean;
	activate(args: ActivateArgs): void;
	deactivate(index: number): void;
	setTier(index: number, tier: number): void;
	reset(): void;
}

interface SpecialAbilityInstance {
	readonly id: string;
	readonly name: string;
	readonly cost: string | number | number[];
	readonly input: string | null;
	readonly max: number | false | null;
	readonly reqs: ('RCP' | RequirementObject)[];
	readonly tiers?: number | null;
	readonly sel: SelectionObject[];
	readonly gr: number;
	readonly category: SPECIAL_ABILITIES;
	dependencies: (boolean | ActiveObject)[];
	active: ActiveObject[];
	readonly sid: (string | number)[];
	readonly dsid: (string | number | boolean | undefined)[];
	getSelectionItem(id: string | number): SelectionObject | undefined;
	addDependencies(adds?: RequirementObject[], sel?: string | undefined): void;
	removeDependencies(adds?: RequirementObject[], sel?: string | undefined): void;
	addDependency(dependency: boolean | ActiveObject): void;
	removeDependency(dependency: boolean | ActiveObject): boolean;
	readonly isMultiselect: boolean;
	readonly isActive: boolean;
	readonly isActivatable: boolean;
	readonly isDeactivatable: boolean;
	activate(args: ActivateArgs): void;
	deactivate(index: number): void;
	setTier(index: number, tier: number): void;
	reset(): void;
}

interface AttributeInstance {
	readonly id: string;
	readonly name: string;
	readonly ic: number;
	readonly category: ATTRIBUTES;
	readonly short: string;
	dependencies: (boolean | ActiveObject)[];
	value: number;
	mod: number;
	readonly isIncreasable: boolean;
	readonly isDecreasable: boolean;
	addDependency(dependency: boolean | ActiveObject): void;
	removeDependency(dependency: boolean | ActiveObject): boolean;
	set(value: number): void;
	add(value: number): void;
	remove(value: number): void;
	addPoint(): void;
	removePoint(): void;
	reset(): void;
}

interface CombatTechniqueInstance {
	readonly id: string;
	readonly name: string;
	readonly ic: number;
	readonly gr: number;
	readonly primary: string[];
	readonly category: COMBAT_TECHNIQUES;
	dependencies: (boolean | ActiveObject)[];
	value: number;
	readonly at: number;
	readonly pa: number | string;
	readonly isIncreasable: boolean;
	readonly isDecreasable: boolean;
	addDependency(dependency: boolean | ActiveObject): void;
	removeDependency(dependency: boolean | ActiveObject): boolean;
	set(value: number): void;
	add(value: number): void;
	remove(value: number): void;
	addPoint(): void;
	removePoint(): void;
	reset(): void;
}

interface LiturgyInstance {
	readonly id: string;
	readonly name: string;
	readonly gr: number;
	readonly check: string[];
	readonly tradition: number[];
	readonly aspect: number[];
	readonly category: LITURGIES;
	readonly ic: number;
	dependencies: (boolean | ActiveObject)[];
	value: number;
	active: boolean;
	readonly isOwnTradition: boolean;
	readonly isIncreasable: boolean;
	readonly isDecreasable: boolean;
	addDependency(dependency: boolean | ActiveObject): void;
	removeDependency(dependency: boolean | ActiveObject): boolean;
	set(value: number): void;
	add(value: number): void;
	remove(value: number): void;
	addPoint(): void;
	removePoint(): void;
	reset(): void;
}

interface SpellInstance {
	readonly id: string;
	readonly name: string;
	readonly gr: number;
	readonly check: string[];
	readonly tradition: number[];
	readonly property: number;
	readonly category: SPELLS;
	readonly ic: number;
	dependencies: (boolean | ActiveObject)[];
	value: number;
	active: boolean;
	readonly isOwnTradition: boolean;
	readonly isIncreasable: boolean;
	readonly isDecreasable: boolean;
	addDependency(dependency: boolean | ActiveObject): void;
	removeDependency(dependency: boolean | ActiveObject): boolean;
	set(value: number): void;
	add(value: number): void;
	remove(value: number): void;
	addPoint(): void;
	removePoint(): void;
	reset(): void;
}

interface TalentInstance {
	readonly id: string;
	readonly name: string;
	readonly gr: number;
	readonly category: TALENTS;
	readonly ic: number;
	readonly check: string[];
	readonly encumbrance: string;
	readonly specialisation: string[] | null;
	readonly specialisationInput: string | null;
	dependencies: (boolean | ActiveObject)[];
	value: number;
	readonly isIncreasable: boolean;
	readonly isDecreasable: boolean;
	readonly isTyp: boolean;
	readonly isUntyp: boolean;
	addDependency(dependency: boolean | ActiveObject): void;
	removeDependency(dependency: boolean | ActiveObject): boolean;
	set(value: number): void;
	add(value: number): void;
	remove(value: number): void;
	addPoint(): void;
	removePoint(): void;
	reset(): void;
}

interface ItemBaseInstance {
	id: string;
	name: string;
	addPenalties: boolean;
	ammunition: string | null;
	combatTechnique: string;
	damageDiceSides: number;
	gr: number;
	isParryingWeapon: boolean;
	isTemplateLocked: boolean;
	reach: number;
	template: string;
	where: string;
}

interface ItemInstance extends ItemBaseInstance {
	at: number;
	damageBonus: number;
	damageDiceNumber: number;
	damageFlat: number;
	enc: number;
	gr: number;
	length: number;
	amount: number;
	pa: number;
	price: number;
	pro: number;
	range: [number, number, number];
	reloadTime: number;
	stp: number;
	weight: number;
}

interface ItemEditorInstance extends ItemBaseInstance {
	at: string;
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
}

type IncreasableInstances = AttributeInstance | TalentInstance | CombatTechniqueInstance | SpellInstance | LiturgyInstance;
type ActivatableInstances = AdvantageInstance | DisadvantageInstance | SpecialAbilityInstance;

interface SecondaryAttribute {
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

interface Energy extends SecondaryAttribute {
	base: number;
	add: number;
	mod: number;
	maxAdd: number;
	currentAdd: number;
}

interface EnergyWithLoss extends Energy {
	permanentLost: number;
	permanentRedeemed: number;
}

interface ExperienceLevel {
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

interface HistoryPayload {
	id?: string | number;
	activeObject?: ActiveObject;
	index?: number;
	list?: (string | [string, number])[];
	buy?: boolean;
}

interface HistoryPrevState {

}

interface HistoryObject {
	type: string;
	cost: number;
	payload: HistoryPayload;
	prevState: HistoryPrevState;
}

interface LanguagesScriptsSelectionListItem {
	id: string;
	name: string;
	cost?: number;
	disabled: boolean;
}

interface HeroSave extends HeroBase {
	id: string | null;
	dateCreated: string;
	dateModified: string;
}

interface SaveData extends HeroSave, HeroRest {}

type InputTextEvent =  React.FormEvent<HTMLInputElement>;
type InputKeyEvent =  React.KeyboardEvent<HTMLInputElement>;

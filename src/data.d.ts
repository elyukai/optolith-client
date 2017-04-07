/// <reference path="./constants/Categories.d.ts" />

interface AdventurePoints {
	total: number;
	spent: number;
	adv: [number, number, number];
	disadv: [number, number, number];
}

type ToListById<T> = {
	[id: string]: T;
};

type ToOptionalKeys<T> = {
	[K in keyof T]?: T[K];
};

type ToList<T> = T[];

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
	professionName?: string;
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
		readonly cultureAreaKnowledge: string;
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
	readonly belongings: {
		readonly items: {
			readonly [id: string]: ItemInstance;
		};
		readonly equipment: object;
		readonly pet: object;
		readonly purse: {
			readonly d: string;
			readonly s: string;
			readonly h: string;
			readonly k: string;
		};
	};
	readonly rules: Rules;
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
	sid: string | string[];
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

interface CombatTechniquesSecondSelection {
	id: 'COMBAT_TECHNIQUES_SECOND';
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

type ProfessionSelectionIds = 'SPECIALISATION' | 'LANGUAGES_SCRIPTS' | 'COMBAT_TECHNIQUES' | 'COMBAT_TECHNIQUES_SECOND' | 'CANTRIPS' | 'CURSES';
type ProfessionSelection = SpecialisationSelection | LanguagesScriptsSelection | CombatTechniquesSelection | CombatTechniquesSecondSelection | CantripsSelection | CursesSelection;
type ProfessionSelections = ProfessionSelection[];

interface Selections {
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
	name: string;
	tier?: number;
	tiers?: number;
	cost: number;
	disabled: boolean;
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
	id: string | string[];
	active?: boolean;
	sid?: string | number | number[];
	sid2?: string | number;
	tier?: number;
	value?: number;
	type?: 1 | 2;
}

interface SkillOptionalDependency {
	value: number;
	origin: string;
}

interface ProfessionDependencyObject {
	id: string;
	value: string | string[];
}

interface DependencyObject extends ActiveObject {
	origin?: string;
	active?: boolean;
}

interface ValidationObject extends ActiveObject {
	id: string;
	active: boolean | number;
}

interface ProfessionDependencyCost {
	total: number;
	adv: [number, number, number];
	disadv: [number, number, number];
}

type AllDependency = ActivatableInstanceDependency | AttributeInstanceDependency | CombatTechniqueInstanceDependency | SpellInstanceDependency | TalentInstanceDependency;

type ActivatableInstanceDependency = boolean | DependencyObject;

interface AdvantageInstanceInInit {
	readonly id: string;
	readonly name: string;
	readonly cost: string | number | number[];
	readonly input: string | null;
	readonly max: number | null;
	readonly reqs: ('RCP' | RequirementObject)[];
	readonly tiers: number | null;
	sel: SelectionObject[];
	readonly category: ADVANTAGES;
	dependencies: ActivatableInstanceDependency[];
	active: ActiveObject[];
}

interface AdvantageInstance extends AdvantageInstanceInInit {
	readonly sel: SelectionObject[];
}

interface DisadvantageInstanceInInit {
	readonly id: string;
	readonly name: string;
	readonly cost: string | number | number[];
	readonly input: string | null;
	readonly max: number | null;
	readonly reqs: ('RCP' | RequirementObject)[];
	readonly tiers: number | null;
	sel: SelectionObject[];
	readonly category: DISADVANTAGES;
	dependencies: ActivatableInstanceDependency[];
	active: ActiveObject[];
}

interface DisadvantageInstance extends DisadvantageInstanceInInit {
	readonly sel: SelectionObject[];
}

interface SpecialAbilityInstanceInInit {
	readonly id: string;
	readonly name: string;
	readonly cost: string | number | number[];
	readonly input: string | null;
	readonly max: number | false | null;
	readonly reqs: ('RCP' | RequirementObject)[];
	sel: SelectionObject[];
	readonly gr: number;
	readonly category: SPECIAL_ABILITIES;
	dependencies: ActivatableInstanceDependency[];
	active: ActiveObject[];
}

interface SpecialAbilityInstance extends SpecialAbilityInstanceInInit {
	readonly sel: SelectionObject[];
}

type AttributeInstanceDependency = number | SkillOptionalDependency;

interface AttributeInstance {
	readonly category: ATTRIBUTES;
	readonly ic: number;
	readonly id: string;
	readonly name: string;
	readonly short: string;
	dependencies: AttributeInstanceDependency[];
	mod: number;
	value: number;
}

type CombatTechniqueInstanceDependency = number;

interface CombatTechniqueInstance {
	readonly category: COMBAT_TECHNIQUES;
	readonly gr: number;
	readonly ic: number;
	readonly id: string;
	readonly name: string;
	readonly primary: string[];
	dependencies: CombatTechniqueInstanceDependency[];
	value: number;
}

type LiturgyInstanceDependency = SpellInstanceDependency;

interface LiturgyInstance {
	readonly aspects: number[];
	readonly category: LITURGIES;
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

type SpellInstanceDependency = number | boolean | SkillOptionalDependency;

interface SpellInstance {
	readonly category: SPELLS;
	readonly check: string[];
	readonly gr: number;
	readonly ic: number;
	readonly id: string;
	readonly name: string;
	readonly property: number;
	readonly tradition: number[];
	active: boolean;
	dependencies: SpellInstanceDependency[];
	value: number;
}

type TalentInstanceDependency = number | SkillOptionalDependency;

interface TalentInstance {
	readonly category: TALENTS;
	readonly check: string[];
	readonly encumbrance: string;
	readonly gr: number;
	readonly ic: number;
	readonly id: string;
	readonly name: string;
	readonly specialisation: string[] | null;
	readonly specialisationInput: string | null;
	dependencies: TalentInstanceDependency[];
	value: number;
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

type Instance = AbilityInstance | RaceInstance | CultureInstance | ProfessionInstance | ProfessionVariantInstance;
type InstanceInInit = AbilityInstanceInInit | RaceInstance | CultureInstance | ProfessionInstance | ProfessionVariantInstance;
type AbilityInstance = ActivatableInstance | IncreasableInstance;
type AbilityInstanceInInit = ActivatableInstanceInInit | IncreasableInstance;
type ActivatableInstance = AdvantageInstance | DisadvantageInstance | SpecialAbilityInstance;
type ActivatableInstanceInInit = AdvantageInstanceInInit | DisadvantageInstanceInInit | SpecialAbilityInstanceInInit;
type IncreasableInstance = AttributeInstance | TalentInstance | CombatTechniqueInstance | SpellInstance | LiturgyInstance;

type IncreasableNonactiveInstance = AttributeInstance | TalentInstance | CombatTechniqueInstance;
type SkillishInstance = SpellInstance | LiturgyInstance | TalentInstance | CombatTechniqueInstance;

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

interface Rules {
	higherParadeValues: number;
	attributeValueLimit: boolean;
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

interface SubTab {
	id: string;
	label: string;
	disabled?: boolean;
	// element: JSX.Element;
}

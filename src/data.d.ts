/// <reference path="./constants/Categories.d.ts" />

interface Hero {
	readonly clientVersion: string;
	readonly dateCreated: Date;
	readonly dateModified: Date;
	readonly player?: string;
	readonly id: string;
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
	readonly disadv: {
		readonly showRating: boolean;
		readonly active: {
			readonly [id: string]: ({
				sid?: string | number, tier?: number
			} | (string | number)[])[];
		};
	};
	readonly items: {
		readonly [id: string]: ItemInstance;
	};
	readonly attr: {
		readonly values: [string, number, number][];
		readonly lp: number;
		readonly ae: number;
		readonly kp: number;
	};
	readonly talents: {
		readonly active: {
			readonly [id: string]: number;
		};
		readonly talentRating: boolean;
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
	readonly sa: {
		readonly active: {
			readonly [id: string]: ({
				sid?: string | number, tier?: number
			} | (string | number)[])[];
		};
	};
	readonly history: never[];
}

interface RaceInstance {
	readonly id: string;
	readonly name: string;
	readonly ap: number;
	readonly lp: number;
	readonly spi: number;
	readonly tou: number;
	readonly mov: number;
	readonly attributes: (string | number)[][];
	readonly attributeSelection: [number, string[]];
	readonly typicalCultures: string[];
	readonly autoAdvantages: (string | number)[][];
	readonly importantAdvantages: (string | number)[][];
	readonly importantDisadvantages: (string | number)[][];
	readonly typicalAdvantages: string[];
	readonly typicalDisadvantages: string[];
	readonly untypicalAdvantages: string[];
	readonly untypicalDisadvantages: string[];
	readonly hairColors: number[];
	readonly eyeColors: number[];
	readonly size: (number | number[])[];
	readonly weight: (number | number[])[];
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
	readonly talents: (string | number)[][];
	readonly category: CULTURES;
}

interface ProfessionInstance {
	readonly id: string;
	readonly name: string | { m: string, f: string };
	readonly subname: string | { m: string, f: string };
	readonly ap: number;
	readonly dependencies: (string | number | boolean)[][];
	readonly requires: (string | number | boolean)[][];
	readonly selections: (string | string[] | number[])[][];
	readonly specialAbilities: (string | number | boolean)[][];
	readonly combatTechniques: (string | number)[][];
	readonly talents: (string | number)[][];
	readonly spells: (string | number)[][];
	readonly liturgies: (string | number)[][];
	readonly typicalAdvantages: string[];
	readonly typicalDisadvantages: string[];
	readonly untypicalAdvantages: string[];
	readonly untypicalDisadvantages: string[];
	readonly variants: string[];
	readonly category: PROFESSIONS;
}

interface ProfessionVariantInstance {
	readonly id: string;
	readonly name: string | { m: string, f: string };
	readonly ap: number;
	readonly dependencies: (string | number | boolean)[][];
	readonly requires: (string | number | boolean)[][];
	readonly selections: (string | string[] | number[])[][];
	readonly specialAbilities: (string | number | boolean)[][];
	readonly combatTechniques: (string | number)[][];
	readonly talents: (string | number)[][];
	readonly category: PROFESSION_VARIANTS;
}

interface ActiveObject {
	sid?: string | number;
	sid2?: string | number;
	tier?: number;
}

type SetTierObject = ActiveObject;

interface ActivateObject {
	sel?: string | number;
	sel2?: string | number;
	input?: string;
	tier?: number;
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
	readonly reqs: [string, string | number | boolean, string | number | boolean | undefined][];
	readonly tiers?: number | null;
	readonly sel: (string | number)[][];
	readonly gr: number;
	readonly category: ADVANTAGES;
	dependencies: (boolean | ActiveObject)[];
	active: ActiveObject[];
	readonly sid: (string | number)[];
	addDependency(dependency: boolean | ActiveObject): void;
	removeDependency(dependency: boolean | ActiveObject): boolean;
	readonly isMultiselect: boolean;
	readonly isActive: boolean;
	readonly isActivatable: boolean;
	readonly isDeactivatable: boolean;
	activate(args: ActivateArgs): void;
	deactivate(index: number): void;
	setTier(args: SetTierObject): void;
	reset(): void;
}

interface DisadvantageInstance {
	readonly id: string;
	readonly name: string;
	readonly cost: string | number | number[];
	readonly input: string | null;
	readonly max: number | null;
	readonly reqs: [string, string | number | boolean, string | number | boolean | undefined][];
	readonly tiers?: number | null;
	readonly sel: (string | number)[][];
	readonly gr: number;
	readonly category: DISADVANTAGES;
	dependencies: (boolean | ActiveObject)[];
	active: ActiveObject[];
	readonly sid: (string | number)[];
	addDependency(dependency: boolean | ActiveObject): void;
	removeDependency(dependency: boolean | ActiveObject): boolean;
	readonly isMultiselect: boolean;
	readonly isActive: boolean;
	readonly isActivatable: boolean;
	readonly isDeactivatable: boolean;
	activate(args: ActivateArgs): void;
	deactivate(index: number): void;
	setTier(args: SetTierObject): void;
	reset(): void;
}

interface SpecialAbilityInstance {
	readonly id: string;
	readonly name: string;
	readonly cost: string | number | number[];
	readonly input: string | null;
	readonly max: number | false | null;
	readonly reqs: [string, string | number | boolean, string | number | boolean | undefined][];
	readonly tiers?: number | null;
	readonly sel: (string | number | boolean | [string, number][] | null)[][];
	readonly gr: number;
	readonly category: SPECIAL_ABILITIES;
	dependencies: (boolean | ActiveObject)[];
	active: ActiveObject[];
	readonly sid: (string | number)[];
	addDependency(dependency: boolean | ActiveObject): void;
	removeDependency(dependency: boolean | ActiveObject): boolean;
	readonly isMultiselect: boolean;
	readonly isActive: boolean;
	readonly isActivatable: boolean;
	readonly isDeactivatable: boolean;
	activate(args: ActivateArgs): void;
	deactivate(index: number): void;
	setTier(args: SetTierObject): void;
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
	readonly specialisation: string[];
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

interface ItemInstance {
	id: string;
	name: string;
	addPenalties: boolean;
	ammunition: string | null;
	at: string;
	combatTechnique: string;
	damageBonus: string;
	damageDiceNumber: string;
	damageDiceSides: string;
	damageFlat: string;
	enc: string;
	gr: number;
	isTemplateLocked: boolean;
	length: string;
	number: string;
	pa: string;
	price: string;
	pro: string;
	range: string[];
	reach: string;
	reloadTime: string;
	stp: string;
	template: string;
	weight: string;
	where: string;
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

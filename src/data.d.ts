declare namespace Categories {
	export type ADVANTAGES = 'ADVANTAGES';
	export type ATTRIBUTES = 'ATTRIBUTES';
	export type COMBAT_TECHNIQUES = 'COMBAT_TECHNIQUES';
	export type CULTURES = 'CULTURES';
	export type DISADVANTAGES = 'DISADVANTAGES';
	export type LITURGIES = 'LITURGIES';
	export type PROFESSION_VARIANTS = 'PROFESSION_VARIANTS';
	export type PROFESSIONS = 'PROFESSIONS';
	export type RACES = 'RACES';
	export type SPECIAL_ABILITIES = 'SPECIAL_ABILITIES';
	export type SPELLS = 'SPELLS';
	export type TALENTS = 'TALENTS';
}

declare interface Advantage {
	readonly id: string;
	readonly name: string;
	dependencies: (string | number | boolean)[];
	readonly cost: string | number | number[];
	readonly input: string | null;
	readonly max: number | false | null;
	readonly reqs: [string, string | number | boolean, string | number | boolean | undefined][];
	readonly tiers?: number | null;
	readonly sel: (string | number | boolean)[][];
	readonly gr: number;
	readonly category: Categories.ADVANTAGES;
	active: boolean | (string | number | boolean | (string | number | boolean)[])[];
	tier?: number;
	sid?: number | string | boolean;
}

declare interface Disadvantage {
	readonly id: string;
	readonly name: string;
	dependencies: (string | number | boolean)[];
	readonly cost: string | number | number[];
	readonly input: string | null;
	readonly max: number | false | null;
	readonly reqs: [string, string | number | boolean, string | number | boolean | undefined][];
	readonly tiers?: number | null;
	readonly sel: (string | number | boolean)[][];
	readonly gr: number;
	readonly category: Categories.DISADVANTAGES;
	active: boolean | (string | number | boolean | (string | number | boolean)[])[];
	tier?: number;
	sid?: number | string | boolean;
}

declare interface SpecialAbility {
	readonly id: string;
	readonly name: string;
	dependencies: (string | number | boolean)[];
	readonly cost: string | number | number[];
	readonly input: string | null;
	readonly max: number | false | null;
	readonly reqs: [string, string | number | boolean, string | number | boolean | undefined][];
	readonly tiers?: number | null;
	readonly sel: (string | number | boolean | [string, number][] | null)[][];
	readonly gr: number;
	readonly category: Categories.SPECIAL_ABILITIES;
	active: boolean | (string | number | boolean | (string | number | boolean)[])[];
	tier?: number;
	sid?: number | string | boolean;
}

declare interface Attribute {
	readonly id: string;
	readonly name: string;
	dependencies: (string | number | boolean)[];
	short: string;
	value: number;
	mod: number;
	readonly ic: number;
	readonly category: Categories.ATTRIBUTES;
}

declare interface CombatTechnique {
	readonly id: string;
	readonly name: string;
	dependencies: (string | number | boolean)[];
	value: number;
	readonly ic: number;
	readonly gr: number;
	readonly primary: string[];
	readonly category: Categories.COMBAT_TECHNIQUES;
}

declare interface Liturgy {
	readonly id: string;
	readonly name: string;
	dependencies: (string | number | boolean)[];
	value: number;
	ic: number;
	readonly gr: number;
	readonly check: string[];
	readonly tradition: number[];
	readonly aspect: number[];
	active: boolean;
	readonly category: Categories.LITURGIES;
}

declare interface Spell {
	readonly id: string;
	readonly name: string;
	dependencies: (string | number | boolean)[];
	value: number;
	ic: number;
	readonly gr: number;
	readonly check: string[];
	readonly tradition: number[];
	readonly property: number[];
	active: boolean;
	readonly category: Categories.SPELLS;
}

declare interface Talent {
	readonly id: string;
	readonly name: string;
	dependencies: (string | number | boolean)[];
	value: number;
	ic: number;
	readonly gr: number;
	check: string[];
	enc: string;
	spec: string[];
	spec_input: string | null;
	readonly category: Categories.TALENTS;
}

declare interface Item {
	id: string;
	name: string;
	addPenalties: boolean;
	ammunition: string;
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

declare interface ExperienceLevel {
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

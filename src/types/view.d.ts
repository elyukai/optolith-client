export { UIMessages } from './ui.d';

export interface Race {
	id: string;
	name: string;
	ap: number;
	lp: number;
	spi: number;
	tou: number;
	mov: number;
	attributeAdjustments: string;
	commonCultures: string[];
	automaticAdvantages: string;
	stronglyRecommendedAdvantages: string;
	stronglyRecommendedDisadvantages: string;
	commonAdvantages: string;
	commonDisadvantages: string;
	uncommonAdvantages: string;
	uncommonDisadvantages: string;
	src: {
		id: string;
		page: number;
	};
}

export interface Increasable {
	name: string;
	value: number;
}

export interface Culture {
	id: string;
	name: string;
	culturalPackageAp: number;
	culturalPackageSkills: Increasable[];
}

export interface NameBySex {
	m: string;
	f: string;
}

export interface Profession {
	id: string;
	name: string | NameBySex;
	subname?: string | NameBySex;
	ap: number;
	combatTechniques: Increasable[];
	physicalSkills: Increasable[];
	socialSkills: Increasable[];
	natureSkills: Increasable[];
	knowledgeSkills: Increasable[];
	craftSkills: Increasable[];
	variants: ProfessionVariant[];
}

export interface ProfessionVariant {
	id: string;
	name: string | NameBySex;
	ap: number;
	combatTechniques: Increasable[];
	skills: Increasable[];
}

export interface Attribute {
	id: string;
	name: string;
	short: string;
	value: number;
}

export interface AttributeWithRequirements extends Attribute {
	max?: number;
	min: number;
}

export interface CombatTechnique {
	id: string;
	name: string;
	value: number;
	primary: string[];
	ic: number;
	gr: number;
	at: number;
	pa?: number;
}

export interface CombatTechniqueWithRequirements extends CombatTechnique {
	max: number;
	min: number;
}

export interface Liturgy {
	id: string;
	name: string;
	value: number;
	check: [string, string, string];
	checkmod?: 'SPI' | 'TOU';
	ic: number;
	aspects: number[];
}

export interface Spell {
	id: string;
	name: string;
	value: number;
	check: [string, string, string];
	checkmod?: 'SPI' | 'TOU';
	ic: number;
	property: number;
	traditions?: number[];
}

export interface Item {
	id: string;
	name: string;
	amount: number;
	price: number;
	weight?: number;
	where?: number;
	gr: number;
}

export interface MeleeWeapon {
	id: string;
	name: string;
	combatTechnique: string;
	primary: string[];
	primaryBonus?: number;
	damageDiceNumber?: number;
	damageDiceSides?: number;
	damageFlat: number;
	atMod?: number;
	at: number;
	paMod?: number;
	pa?: number;
	reach?: number;
	bf: number;
	loss?: number;
	weight?: number;
	isImprovisedWeapon: boolean;
	isTwoHandedWeapon: boolean;
}

export interface RangedWeapon {
	id: string;
	name: string;
	combatTechnique: string;
	reloadTime?: number;
	damageDiceNumber?: number;
	damageDiceSides?: number;
	damageFlat?: number;
	at: number;
	range?: [number, number, number];
	bf: number;
	loss?: number;
	weight?: number;
	ammunition?: string;
}

export interface Armor {
	id: string;
	name: string;
	st?: number;
	loss?: number;
	pro?: number;
	enc?: number;
	mov: number;
	ini: number;
	weight?: number;
	where?: string;
}

export interface ArmorZone {
	id: string;
	name: string;
	head?: number;
	leftArm?: number;
	leftLeg?: number;
	rightArm?: number;
	rightLeg?: number;
	torso?: number;
	enc: number;
	addPenalties: boolean;
	weight: number;
}

export interface ShieldOrParryingWeapon {
	id: string;
	name: string;
	stp?: number;
	bf: number;
	loss?: number;
	atMod?: number;
	paMod?: number;
	weight?: number;
}

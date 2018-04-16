import { Categories } from '../constants/Categories';
import { ActivatableNameCostActive, ProfessionSelections, SourceLink, ProfessionDependencyObject, LiturgyInstance, SpellInstance } from './data.d';
import { ProfessionRequiresIncreasableObject, ProfessionRequiresActivatableObject } from './reusable.d';
import { ProfessionVariantSelections } from './wiki';

export { Book } from './data.d';
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
	commonAdvantages?: string;
	commonDisadvantages?: string;
	uncommonAdvantages?: string;
	uncommonDisadvantages?: string;
	variants: RaceVariant[];
	src: SourceLink[];
	category: Categories.RACES;
}

export interface RaceVariant {
	id: string;
	name: string;
	commonCultures: string[];
	commonAdvantages?: string;
	commonDisadvantages?: string;
	uncommonAdvantages?: string;
	uncommonDisadvantages?: string;
}

export interface Increasable {
	name: string;
	value: number;
	previous?: number;
}

export interface IncreasableId {
	id: string;
	value: number;
	previous?: number;
}

export interface Culture {
	id: string;
	name: string;
	areaKnowledgeShort: string;
	areaKnowledge: string;
	language: number[];
	script: number[];
	socialStatus: number[];
	commonMundaneProfessions?: string;
	commonMagicProfessions?: string;
	commonBlessedProfessions?: string;
	commonAdvantages?: string;
	commonDisadvantages?: string;
	uncommonAdvantages?: string;
	uncommonDisadvantages?: string;
	commonSkills: string[];
	uncommonSkills: string[];
	/**
	 * Markdown supported.
	 */
	commonNames: string;
	culturalPackageAdventurePoints: number;
	culturalPackageSkills: Increasable[];
	src: SourceLink[];
	category: Categories.CULTURES;
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
	prerequisites: (ActivatableNameCostActive | ProfessionRequiresIncreasableObject)[];
	prerequisitesModel: (ProfessionRequiresActivatableObject | ProfessionRequiresIncreasableObject)[];
	specialAbilities: ActivatableNameCostActive[];
	selections: ProfessionSelections;
	combatTechniques: Increasable[];
	physicalSkills: Increasable[];
	socialSkills: Increasable[];
	natureSkills: Increasable[];
	knowledgeSkills: Increasable[];
	craftSkills: Increasable[];
	spells: IncreasableId[];
	liturgicalChants: IncreasableId[];
	blessings: string[];
	variants: ProfessionVariant[];
	src: SourceLink[];
	dependencies: ProfessionDependencyObject[];
	prerequisitesStart?: string;
	prerequisitesEnd?: string;
	twelveBlessingsAdd?: string;
	suggestedAdvantagesText?: string;
	suggestedDisadvantagesText?: string;
	unsuitableAdvantagesText?: string;
	unsuitableDisadvantagesText?: string;
	category: Categories.PROFESSIONS;
	gr: number;
	subgr: number;
}

export interface ProfessionVariant {
	id: string;
	name: string | NameBySex;
	ap: number;
	dependencies: ProfessionDependencyObject[];
	prerequisites: (ActivatableNameCostActive | ProfessionRequiresIncreasableObject)[];
	prerequisitesModel: (ProfessionRequiresActivatableObject | ProfessionRequiresIncreasableObject)[];
	selections: ProfessionVariantSelections;
	specialAbilities: ActivatableNameCostActive[];
	combatTechniques: Increasable[];
	skills: Increasable[];
	spells: IncreasableId[];
	liturgicalChants: IncreasableId[];
	blessings: string[];
	concludingText: string | undefined;
	fullText: string | undefined;
	precedingText: string | undefined;
}

export interface Attribute {
	id: string;
	name: string;
	short: string;
	value: number;
	category: Categories.ATTRIBUTES;
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
	category: Categories.COMBAT_TECHNIQUES;
	special?: string;
	src: SourceLink[];
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
	category: Categories.LITURGIES;
}

export interface LiturgicalChantWithRequirements extends LiturgyInstance {
	isIncreasable: boolean;
	isDecreasable: boolean;
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
	effect: string;
	castingTime: string;
	castingTimeShort: string;
	cost: string;
	costShort: string;
	range: string;
	rangeShort: string;
	duration: string;
	durationShort: string;
	target: string;
	src: SourceLink[];
	category: Categories.SPELLS;
}

export interface SpellWithRequirements extends SpellInstance {
	isIncreasable: boolean;
	isDecreasable: boolean;
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
	primaryBonus: number | number[];
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

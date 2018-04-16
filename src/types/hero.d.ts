import { PrimaryAttributeDamageThreshold } from "./wiki";

export interface Hero {
	id: string;
	name: string;
	meta: HeroMeta;
	rcp: HeroRaceCultureProfession;
	personal: HeroPersonalData;
	values: HeroValues;
	belongings: HeroBelongings;
	settings: HeroSettings;
}

export interface HeroMeta {
	clientVersion: string;
	dateCreated: Date;
	dateModified: Date;
	phase: number;
	owner?: string;
}

export interface HeroRaceCultureProfession {
	race: string;
	raceVariant?: string;
	culture: string;
	profession: string;
	professionName?: string;
	professionVariant?: string;
}

export interface HeroPersonalData {
	sex: 'm' | 'f';
	avatar?: string;
	family?: string;
	placeOfBirth?: string;
	dateOfBirth?: string;
	age?: string;
	hairColor?: number;
	eyeColor?: number;
	size?: string;
	weight?: string;
	title?: string;
	socialStatus?: number;
	characteristics?: string;
	otherInfo?: string;
	cultureAreaKnowledge?: string;
}

export interface HeroValues {
	adventurePoints: HeroAdventurePoints;
	advantages: Map<string, ActivatableDependent>;
	disadvantages: Map<string, ActivatableDependent>;
	specialAbilities: Map<string, ActivatableDependent>;
	attributes: Map<string, AttributeDependent>;
	energies: {
		lp: number;
		ae: number;
		kp: number;
		permanentLifePoints: {
			lost: number;
		};
		permanentArcaneEnergyPoints: {
			lost: number;
			redeemed: number;
		};
		permanentKarmaPoints: {
			lost: number;
			redeemed: number;
		};
	};
	talents: Map<string, SkillDependent>;
	ct: Map<string, SkillDependent>;
	spells: Map<string, ActivatableSkillDependent>;
	cantrips: Set<string>;
	liturgies: Map<string, ActivatableSkillDependent>;
	blessings: Set<string>;
}

export interface HeroBelongings {
	items: Map<string, Item>;
	armorZones: Map<string, ArmorZones>;
	purse: Purse;
	pets: Map<string, Pet>;
}

export interface HeroSettings {
	el: string;
	rules: Rules;
}

export interface HeroAdventurePoints {
	total: number;
	spent: number;
	adv: DisAdvAdventurePoints;
	disadv: DisAdvAdventurePoints;
}

export interface DisAdvAdventurePoints extends Array<number> {
	/**
	 * Spent AP for Advantages/Disadvantages in total.
	 */
	0: number;
	/**
	 * Spent AP for magical Advantages/Disadvantages.
	 */
	1: number;
	/**
	 * Spent AP for blessed Advantages/Disadvantages.
	 */
	2: number;
}

export interface ActivatableDependent {
	id: string;
	active: ActiveObject[];
	dependencies: (boolean | DependencyObject)[];
}

export interface AttributeDependent {
	id: string;
	value: number;
	mod: number;
	dependencies: number | SkillOptionalDependency[];
}

export interface SkillDependent {
	id: string;
	value: number;
	dependencies: number | SkillOptionalDependency[];
}

export interface ActivatableSkillDependent {
	id: string;
	value: number;
	active: boolean;
	dependencies: number | boolean | SkillOptionalDependency[];
}

export interface SkillOptionalDependency {
	value: number;
	origin: string;
}

export interface ActiveObject {
	sid?: string | number;
	sid2?: string | number;
	tier?: number;
	cost?: number;
}

export interface DependencyObject {
	origin?: string;
	active?: boolean;
	sid?: string | number | number[];
	sid2?: string | number;
	tier?: number;
}

export interface ArmorZonesBase {
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

export interface ArmorZones extends ArmorZonesBase {
	id: string;
}

export interface ItemBase {
	id: string;
	name: string;
	addPenalties?: boolean;
	ammunition?: string;
	amount?: number;
	armorType?: number;
	at?: number;
	combatTechnique?: string;
	damageBonus?: PrimaryAttributeDamageThreshold;
	damageDiceNumber?: number;
	damageDiceSides?: number;
	damageFlat?: number;
	enc?: number;
	forArmorZoneOnly?: boolean;
	gr: number;
	improvisedWeaponGroup?: number;
	iniMod?: number;
	isParryingWeapon?: boolean;
	isTemplateLocked: boolean;
	isTwoHandedWeapon?: boolean;
	length?: number;
	loss?: number;
	movMod?: number;
	pa?: number;
	price?: number;
	pro?: number;
	range?: [number, number, number];
	reach?: number;
	reloadTime?: number;
	stabilityMod?: number;
	stp?: number;
	template?: string;
	weight?: number;
	where?: string;
	note?: string;
	rules?: string;
	advantage?: string;
	disadvantage?: string;
}

export interface Item extends ItemBase {
	id: string;
}

export interface Purse {
  d: string;
  h: string;
  k: string;
  s: string;
}

export interface Rules {
	higherParadeValues: number;
	attributeValueLimit: boolean;
	enableAllRuleBooks: boolean;
	enabledRuleBooks: Set<string>;
}

export interface Pet {
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

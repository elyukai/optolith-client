/* TypeScript file generated from Hero.re by genType. */
/* eslint-disable import/first */


import {activatableAndSkillId as Ids_activatableAndSkillId} from '../../../src/App/Constants/Ids.gen';

import {activatableId as Ids_activatableId} from '../../../src/App/Constants/Ids.gen';

import {hitZoneArmorZoneItemId as Ids_hitZoneArmorZoneItemId} from '../../../src/App/Constants/Ids.gen';

import {list} from '../../../src/shims/ReasonPervasives.shim';

import {maybe as Maybe_maybe} from '../../../src/Data/Maybe.gen';

import {oneOrMany as GenericHelpers_oneOrMany} from '../../../src/App/Utilities/GenericHelpers.gen';

import {selectOptionId as Ids_selectOptionId} from '../../../src/App/Constants/Ids.gen';

import {t as IntMap_t} from '../../../src/shims/IntMap.gen';

import {t as IntSet_t} from '../../../src/shims/IntSet.gen';

// tslint:disable-next-line:interface-over-type-literal
export type phase = "Outline" | "Definition" | "Advancement";
export type Phase = phase;

// tslint:disable-next-line:interface-over-type-literal
export type sex = "Male" | "Female";
export type Sex = sex;

// tslint:disable-next-line:interface-over-type-literal
export type baseOrWithVariant = 
    { tag: "Base"; value: number }
  | { tag: "WithVariant"; value: [number, number] };
export type BaseOrWithVariant = baseOrWithVariant;

// tslint:disable-next-line:interface-over-type-literal
export type Rules_activeRule = { readonly id: number; readonly options: list<number> };
export type ActiveRule = Rules_activeRule;

// tslint:disable-next-line:interface-over-type-literal
export type Rules_t = {
  readonly areAllPublicationsActive: boolean; 
  readonly activePublications: list<string>; 
  readonly activeFocusRules: list<Rules_activeRule>; 
  readonly activeOptionalRules: list<Rules_activeRule>
};
export type Rules = Rules_t;

// tslint:disable-next-line:interface-over-type-literal
export type personalData = {
  readonly family: Maybe_maybe<string>; 
  readonly placeOfBirth: Maybe_maybe<string>; 
  readonly dateOfBirth: Maybe_maybe<string>; 
  readonly age: Maybe_maybe<string>; 
  readonly hairColor: Maybe_maybe<number>; 
  readonly eyeColor: Maybe_maybe<number>; 
  readonly size: Maybe_maybe<string>; 
  readonly weight: Maybe_maybe<string>; 
  readonly title: Maybe_maybe<string>; 
  readonly socialStatus: Maybe_maybe<number>; 
  readonly characteristics: Maybe_maybe<string>; 
  readonly otherInfo: Maybe_maybe<string>; 
  readonly cultureAreaKnowledge: Maybe_maybe<string>
};
export type PersonalData = personalData;

// tslint:disable-next-line:interface-over-type-literal
export type Activatable_option = 
    { tag: "Generic"; value: number }
  | { tag: "Skill"; value: number }
  | { tag: "CombatTechnique"; value: number }
  | { tag: "Spell"; value: number }
  | { tag: "Cantrip"; value: number }
  | { tag: "LiturgicalChant"; value: number }
  | { tag: "Blessing"; value: number }
  | { tag: "CustomInput"; value: string };

// tslint:disable-next-line:interface-over-type-literal
export type Activatable_single = {
  readonly options: list<Activatable_option>; 
  readonly level: Maybe_maybe<number>; 
  readonly customCost: Maybe_maybe<number>
};
export type ActivatableSingle = Activatable_single;

// tslint:disable-next-line:interface-over-type-literal
export type Activatable_dependency = {
  readonly source: Ids_activatableId; 
  readonly target: GenericHelpers_oneOrMany<Ids_activatableId>; 
  readonly active: boolean; 
  readonly options: list<GenericHelpers_oneOrMany<Ids_selectOptionId>>; 
  readonly level: Maybe_maybe<number>
};
export type ActivatableDependency = Activatable_dependency;

// tslint:disable-next-line:interface-over-type-literal
export type Activatable_t = {
  readonly id: number; 
  readonly active: list<Activatable_single>; 
  readonly dependencies: list<Activatable_dependency>
};
export type Activatable = Activatable_t;

// tslint:disable-next-line:interface-over-type-literal
export type Attribute_dependency = {
  readonly source: Ids_activatableId; 
  readonly target: GenericHelpers_oneOrMany<number>; 
  readonly value: Maybe_maybe<number>
};
export type AttributeDependency = Attribute_dependency;

// tslint:disable-next-line:interface-over-type-literal
export type Attribute_t = {
  readonly id: number; 
  readonly value: number; 
  readonly dependencies: list<Attribute_dependency>
};
export type Attribute = Attribute_t;

// tslint:disable-next-line:interface-over-type-literal
export type Energies_permanentEnergyLoss = { readonly lost: number };
export type PermanentEnergyLoss = Energies_permanentEnergyLoss;

// tslint:disable-next-line:interface-over-type-literal
export type Energies_permanentEnergyLossAndBoughtBack = { readonly lost: number; readonly boughtBack: number };
export type PermanentEnergyLossAndBoughtBack = Energies_permanentEnergyLossAndBoughtBack;

// tslint:disable-next-line:interface-over-type-literal
export type Energies_t = {
  readonly addedLifePoints: number; 
  readonly addedArcaneEnergyPoints: number; 
  readonly addedKarmaPoints: number; 
  readonly permanentLifePoints: Energies_permanentEnergyLoss; 
  readonly permanentArcaneEnergyPoints: Energies_permanentEnergyLossAndBoughtBack; 
  readonly permanentKarmaPoints: Energies_permanentEnergyLossAndBoughtBack
};
export type Energies = Energies_t;

// tslint:disable-next-line:interface-over-type-literal
export type ActivatableSkill_value = 
    "Inactive"
  | { tag: "Active"; value: number };

// tslint:disable-next-line:interface-over-type-literal
export type ActivatableSkill_dependency = {
  readonly source: Ids_activatableAndSkillId; 
  readonly target: GenericHelpers_oneOrMany<number>; 
  readonly value: ActivatableSkill_value
};
export type ActivatableSkillDependency = ActivatableSkill_dependency;

// tslint:disable-next-line:interface-over-type-literal
export type ActivatableSkill_t = {
  readonly id: number; 
  readonly value: ActivatableSkill_value; 
  readonly dependencies: list<ActivatableSkill_dependency>
};
export type ActivatableSkill = ActivatableSkill_t;

// tslint:disable-next-line:interface-over-type-literal
export type Skill_dependency = {
  readonly source: Ids_activatableId; 
  readonly target: GenericHelpers_oneOrMany<number>; 
  readonly value: number
};
export type SkillDependency = Skill_dependency;

// tslint:disable-next-line:interface-over-type-literal
export type Skill_t = {
  readonly id: number; 
  readonly value: number; 
  readonly dependencies: list<Skill_dependency>
};
export type Skill = Skill_t;

// tslint:disable-next-line:interface-over-type-literal
export type Item_mundaneItem = { readonly structurePoints: Maybe_maybe<GenericHelpers_oneOrMany<number>> };
export type MundaneItem = Item_mundaneItem;

// tslint:disable-next-line:interface-over-type-literal
export type Item_primaryAttributeDamageThreshold = 
    { tag: "SameAttribute"; value: number }
  | { tag: "AgilityStrength"; value: [number, number] }
  | { tag: "DifferentAttribute"; value: [number, number] };
export type PrimaryAttributeDamageThreshold = Item_primaryAttributeDamageThreshold;

// tslint:disable-next-line:interface-over-type-literal
export type Item_damage = {
  readonly amount: number; 
  readonly sides: number; 
  readonly flat: Maybe_maybe<number>
};
export type Damage = Item_damage;

// tslint:disable-next-line:interface-over-type-literal
export type Item_meleeWeapon = {
  readonly combatTechnique: number; 
  readonly damage: Item_damage; 
  readonly primaryAttributeDamageThreshold: Maybe_maybe<Item_primaryAttributeDamageThreshold>; 
  readonly at: Maybe_maybe<number>; 
  readonly pa: Maybe_maybe<number>; 
  readonly reach: Maybe_maybe<number>; 
  readonly length: Maybe_maybe<number>; 
  readonly structurePoints: Maybe_maybe<GenericHelpers_oneOrMany<number>>; 
  readonly breakingPointRatingMod: Maybe_maybe<number>; 
  readonly isParryingWeapon: boolean; 
  readonly isTwoHandedWeapon: boolean; 
  readonly isImprovisedWeapon: boolean; 
  readonly damaged: Maybe_maybe<number>
};
export type MeleeWeapon = Item_meleeWeapon;

// tslint:disable-next-line:interface-over-type-literal
export type Item_rangedWeapon = {
  readonly combatTechnique: number; 
  readonly damage: Maybe_maybe<Item_damage>; 
  readonly length: Maybe_maybe<number>; 
  readonly range: [number, number, number]; 
  readonly reloadTime: GenericHelpers_oneOrMany<number>; 
  readonly ammunition: Maybe_maybe<number>; 
  readonly isImprovisedWeapon: boolean; 
  readonly damaged: Maybe_maybe<number>
};
export type RangedWeapon = Item_rangedWeapon;

// tslint:disable-next-line:interface-over-type-literal
export type Item_armor = {
  readonly protection: number; 
  readonly encumbrance: number; 
  readonly hasAdditionalPenalties: boolean; 
  readonly iniMod: Maybe_maybe<number>; 
  readonly movMod: Maybe_maybe<number>; 
  readonly sturdinessMod: Maybe_maybe<number>; 
  readonly armorType: number; 
  readonly wear: Maybe_maybe<number>; 
  readonly isHitZoneArmorOnly: Maybe_maybe<boolean>
};
export type Armor = Item_armor;

// tslint:disable-next-line:interface-over-type-literal
export type Item_special = 
    { tag: "MundaneItem"; value: Item_mundaneItem }
  | { tag: "MeleeWeapon"; value: Item_meleeWeapon }
  | { tag: "RangedWeapon"; value: Item_rangedWeapon }
  | { tag: "CombinedWeapon"; value: [Item_meleeWeapon, Item_rangedWeapon] }
  | { tag: "Armor"; value: Item_armor };
export type Special = Item_special;

// tslint:disable-next-line:interface-over-type-literal
export type Item_t = {
  readonly id: number; 
  readonly amount: Maybe_maybe<number>; 
  readonly price: Maybe_maybe<number>; 
  readonly weight: Maybe_maybe<number>; 
  readonly template: Maybe_maybe<number>; 
  readonly isTemplateLocked: boolean; 
  readonly carriedWhere: Maybe_maybe<string>; 
  readonly special: Maybe_maybe<Item_special>; 
  readonly gr: number
};
export type Item = Item_t;

// tslint:disable-next-line:interface-over-type-literal
export type hitZoneArmor = {
  readonly id: number; 
  readonly name: string; 
  readonly head: Maybe_maybe<Ids_hitZoneArmorZoneItemId>; 
  readonly headWear: Maybe_maybe<number>; 
  readonly leftArm: Maybe_maybe<Ids_hitZoneArmorZoneItemId>; 
  readonly leftArmWear: Maybe_maybe<number>; 
  readonly rightArm: Maybe_maybe<Ids_hitZoneArmorZoneItemId>; 
  readonly rightArmWear: Maybe_maybe<number>; 
  readonly torso: Maybe_maybe<Ids_hitZoneArmorZoneItemId>; 
  readonly torsoWear: Maybe_maybe<number>; 
  readonly leftLeg: Maybe_maybe<Ids_hitZoneArmorZoneItemId>; 
  readonly leftLegWear: Maybe_maybe<number>; 
  readonly rightLeg: Maybe_maybe<Ids_hitZoneArmorZoneItemId>; 
  readonly rightLegWear: Maybe_maybe<number>
};
export type HitZoneArmor = hitZoneArmor;

// tslint:disable-next-line:interface-over-type-literal
export type purse = {
  readonly ducats: number; 
  readonly silverthalers: number; 
  readonly halers: number; 
  readonly kreutzers: number
};
export type Purse = purse;

// tslint:disable-next-line:interface-over-type-literal
export type pet = {
  readonly id: number; 
  readonly name: string; 
  readonly avatar: Maybe_maybe<string>; 
  readonly size: Maybe_maybe<string>; 
  readonly type: Maybe_maybe<string>; 
  readonly attack: Maybe_maybe<string>; 
  readonly dp: Maybe_maybe<string>; 
  readonly reach: Maybe_maybe<string>; 
  readonly actions: Maybe_maybe<string>; 
  readonly skills: Maybe_maybe<string>; 
  readonly abilities: Maybe_maybe<string>; 
  readonly notes: Maybe_maybe<string>; 
  readonly spentAp: Maybe_maybe<string>; 
  readonly totalAp: Maybe_maybe<string>; 
  readonly cou: Maybe_maybe<string>; 
  readonly sgc: Maybe_maybe<string>; 
  readonly int: Maybe_maybe<string>; 
  readonly cha: Maybe_maybe<string>; 
  readonly dex: Maybe_maybe<string>; 
  readonly agi: Maybe_maybe<string>; 
  readonly con: Maybe_maybe<string>; 
  readonly str: Maybe_maybe<string>; 
  readonly lp: Maybe_maybe<string>; 
  readonly ae: Maybe_maybe<string>; 
  readonly spi: Maybe_maybe<string>; 
  readonly tou: Maybe_maybe<string>; 
  readonly pro: Maybe_maybe<string>; 
  readonly ini: Maybe_maybe<string>; 
  readonly mov: Maybe_maybe<string>; 
  readonly at: Maybe_maybe<string>; 
  readonly pa: Maybe_maybe<string>
};
export type Pet = pet;

// tslint:disable-next-line:interface-over-type-literal
export type Pact_domain = 
    { tag: "Predefined"; value: number }
  | { tag: "Custom"; value: string };
export type PactDomain = Pact_domain;

// tslint:disable-next-line:interface-over-type-literal
export type Pact_t = {
  readonly category: number; 
  readonly level: number; 
  readonly type: number; 
  readonly domain: Pact_domain; 
  readonly name: string
};
export type Pact = Pact_t;

// tslint:disable-next-line:interface-over-type-literal
export type styleDependency = {
  readonly id: GenericHelpers_oneOrMany<number>; 
  readonly active: Maybe_maybe<number>; 
  readonly origin: number
};
export type StyleDependency = styleDependency;

// tslint:disable-next-line:interface-over-type-literal
export type TransferUnfamiliar_id = 
    "Spells"
  | "LiturgicalChants"
  | { tag: "Spell"; value: number }
  | { tag: "LiturgicalChant"; value: number };
export type TransferUnfamiliarId = TransferUnfamiliar_id;

// tslint:disable-next-line:interface-over-type-literal
export type TransferUnfamiliar_t = { readonly id: TransferUnfamiliar_id; readonly srcId: number };
export type TransferUnfamiliar = TransferUnfamiliar_t;

// tslint:disable-next-line:interface-over-type-literal
export type t = {
  readonly name: string; 
  readonly dateCreated: Date; 
  readonly dateModified: Date; 
  readonly adventurePointsTotal: number; 
  readonly experienceLevel: number; 
  readonly sex: sex; 
  readonly phase: phase; 
  readonly locale: string; 
  readonly avatar: Maybe_maybe<string>; 
  readonly race: Maybe_maybe<number>; 
  readonly raceVariant: Maybe_maybe<baseOrWithVariant>; 
  readonly culture: Maybe_maybe<number>; 
  readonly isCulturalPackageActive: boolean; 
  readonly profession: Maybe_maybe<baseOrWithVariant>; 
  readonly professionName: Maybe_maybe<string>; 
  readonly rules: Rules_t; 
  readonly personalData: personalData; 
  readonly advantages: IntMap_t<Activatable_t>; 
  readonly disadvantages: IntMap_t<Activatable_t>; 
  readonly specialAbilities: IntMap_t<Activatable_t>; 
  readonly attributes: IntMap_t<Attribute_t>; 
  readonly attributeAdjustmentSelected: number; 
  readonly energies: Energies_t; 
  readonly skills: IntMap_t<Skill_t>; 
  readonly combatTechniques: IntMap_t<Skill_t>; 
  readonly spells: IntMap_t<ActivatableSkill_t>; 
  readonly liturgicalChants: IntMap_t<ActivatableSkill_t>; 
  readonly cantrips: IntSet_t; 
  readonly blessings: IntSet_t; 
  readonly items: list<Item_t>; 
  readonly hitZoneArmors: list<hitZoneArmor>; 
  readonly purse: purse; 
  readonly pets: list<pet>; 
  readonly pact: Maybe_maybe<Pact_t>; 
  readonly combatStyleDependencies: list<styleDependency>; 
  readonly magicalStyleDependencies: list<styleDependency>; 
  readonly blessedStyleDependencies: list<styleDependency>; 
  readonly skillStyleDependencies: list<styleDependency>; 
  readonly socialStatusDependencies: list<number>; 
  readonly transferredUnfamiliarSpells: list<TransferUnfamiliar_t>
};
export type Hero = t;

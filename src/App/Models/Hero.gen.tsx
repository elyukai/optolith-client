/* TypeScript file generated from Hero.re by genType. */
/* eslint-disable import/first */


import {activatableAndSkillId as Ids_activatableAndSkillId} from '../../../src/App/Constants/Ids.gen';

import {activatableId as Ids_activatableId} from '../../../src/App/Constants/Ids.gen';

import {activatableSkillId as Ids_activatableSkillId} from '../../../src/App/Constants/Ids.gen';

import {hitZoneArmorZoneItemId as Ids_hitZoneArmorZoneItemId} from '../../../src/App/Constants/Ids.gen';

import {list} from '../../../src/shims/ReasonPervasives.shim';

import {maybe as Maybe_maybe} from '../../../src/Data/Maybe.gen';

import {oneOrMany as GenericHelpers_oneOrMany} from '../../../src/App/Utilities/GenericHelpers.gen';

import {selectOptionId as Ids_selectOptionId} from '../../../src/App/Constants/Ids.gen';

import {skillId as Ids_skillId} from '../../../src/App/Constants/Ids.gen';

import {t as IntMap_t} from '../../../src/shims/IntMap.gen';

import {t as IntSet_t} from '../../../src/shims/IntSet.gen';

import {t as Sex_t} from './Sex.gen';

// tslint:disable-next-line:interface-over-type-literal
export type Phase_t = "Outline" | "Definition" | "Advancement";
export type Phase = Phase_t;

// tslint:disable-next-line:interface-over-type-literal
export type RaceCultureProfession_baseOrWithVariant = 
    { tag: "Base"; value: number }
  | { tag: "WithVariant"; value: [number, number] };
export type BaseOrWithVariant = RaceCultureProfession_baseOrWithVariant;

// tslint:disable-next-line:interface-over-type-literal
export type Rules_higherParadeValuesConfig = "Two" | "Four";
export type HigherParadeValuesConfig = Rules_higherParadeValuesConfig;

// tslint:disable-next-line:interface-over-type-literal
export type Rules_optionalRulesConfig = { readonly higherParadeValues: Maybe_maybe<Rules_higherParadeValuesConfig> };
export type OptionalRulesConfig = Rules_optionalRulesConfig;

// tslint:disable-next-line:interface-over-type-literal
export type Rules_t = {
  readonly areAllPublicationsActive: boolean; 
  readonly activePublications: list<string>; 
  readonly activeFocusRules: list<number>; 
  readonly activeOptionalRules: list<number>; 
  readonly optionalRules: Rules_optionalRulesConfig
};
export type Rules = Rules_t;

// tslint:disable-next-line:interface-over-type-literal
export type PersonalData_t = {
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
export type PersonalData = PersonalData_t;

// tslint:disable-next-line:interface-over-type-literal
export type Activatable_Single_t = { readonly options: list<Ids_selectOptionId>; readonly level: Maybe_maybe<number> };
export type ActivatableSingle = Activatable_Single_t;

// tslint:disable-next-line:interface-over-type-literal
export type Activatable_Single_CustomCost_t = {
  readonly options: list<Ids_selectOptionId>; 
  readonly level: Maybe_maybe<number>; 
  readonly customCost: Maybe_maybe<number>
};

// tslint:disable-next-line:interface-over-type-literal
export type Activatable_Dependency_t = {
  readonly source: Ids_activatableId; 
  readonly target: GenericHelpers_oneOrMany<Ids_activatableId>; 
  readonly active: boolean; 
  readonly options: list<GenericHelpers_oneOrMany<Ids_selectOptionId>>; 
  readonly level: Maybe_maybe<number>
};
export type ActivatableDependency = Activatable_Dependency_t;

// tslint:disable-next-line:interface-over-type-literal
export type DisAdvantage_t = {
  readonly id: number; 
  readonly active: list<Activatable_Single_CustomCost_t>; 
  readonly dependencies: list<Activatable_Dependency_t>
};
export type DisAdvantage = DisAdvantage_t;

// tslint:disable-next-line:interface-over-type-literal
export type SpecialAbility_t = {
  readonly id: number; 
  readonly active: list<Activatable_Single_t>; 
  readonly dependencies: list<Activatable_Dependency_t>
};
export type SpecialAbility = SpecialAbility_t;

// tslint:disable-next-line:interface-over-type-literal
export type Attribute_Dependency_t = {
  readonly source: Ids_activatableId; 
  readonly target: GenericHelpers_oneOrMany<number>; 
  readonly value: Maybe_maybe<number>
};
export type AttributeDependency = Attribute_Dependency_t;

// tslint:disable-next-line:interface-over-type-literal
export type Attribute_t = {
  readonly id: number; 
  readonly value: number; 
  readonly dependencies: list<Attribute_Dependency_t>
};
export type Attribute = Attribute_t;

// tslint:disable-next-line:interface-over-type-literal
export type Energies_permanentEnergyLoss = { readonly lost: number; readonly redeemed: number };
export type PermanentEnergyLoss = Energies_permanentEnergyLoss;

// tslint:disable-next-line:interface-over-type-literal
export type Energies_permanentEnergyLossAndBoughtBack = { readonly lost: number; readonly redeemed: number };
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
export type ActivatableSkill_Dependency_t = {
  readonly source: Ids_activatableAndSkillId; 
  readonly target: GenericHelpers_oneOrMany<Ids_activatableSkillId>; 
  readonly value: Maybe_maybe<number>
};

// tslint:disable-next-line:interface-over-type-literal
export type ActivatableSkill_t = {
  readonly id: number; 
  readonly value: Maybe_maybe<number>; 
  readonly dependencies: list<ActivatableSkill_Dependency_t>
};
export type ActivatableSkill = ActivatableSkill_t;

// tslint:disable-next-line:interface-over-type-literal
export type Skill_Dependency_t = {
  readonly source: Ids_activatableId; 
  readonly target: GenericHelpers_oneOrMany<Ids_skillId>; 
  readonly value: number
};

// tslint:disable-next-line:interface-over-type-literal
export type Skill_t = {
  readonly id: number; 
  readonly value: Maybe_maybe<number>; 
  readonly dependencies: list<Skill_Dependency_t>
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
  readonly closeRange: number; 
  readonly mediumRange: number; 
  readonly farRange: number; 
  readonly reloadTime: GenericHelpers_oneOrMany<number>; 
  readonly ammunition: Maybe_maybe<number>; 
  readonly isImprovisedWeapon: boolean; 
  readonly damaged: Maybe_maybe<number>
};
export type RangedWeapon = Item_rangedWeapon;

// tslint:disable-next-line:interface-over-type-literal
export type Item_combinedWeapon = { readonly melee: Item_meleeWeapon; readonly ranged: Item_rangedWeapon };
export type CombinedWeapon = Item_combinedWeapon;

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
  | { tag: "CombinedWeapon"; value: Item_combinedWeapon }
  | { tag: "MeleeWeapon"; value: Item_meleeWeapon }
  | { tag: "RangedWeapon"; value: Item_rangedWeapon }
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
export type HitZoneArmor_t = {
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
export type HitZoneArmor = HitZoneArmor_t;

// tslint:disable-next-line:interface-over-type-literal
export type Purse_t = {
  readonly ducats: number; 
  readonly silverthalers: number; 
  readonly halers: number; 
  readonly kreutzers: number
};
export type Purse = Purse_t;

// tslint:disable-next-line:interface-over-type-literal
export type Pet_t = {
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
export type Pet = Pet_t;

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
export type Styles_Dependency_t = {
  readonly id: GenericHelpers_oneOrMany<number>; 
  readonly active: Maybe_maybe<number>; 
  readonly origin: number
};
export type StyleDependency = Styles_Dependency_t;

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
  readonly sex: Sex_t; 
  readonly phase: Phase_t; 
  readonly locale: string; 
  readonly avatar: Maybe_maybe<string>; 
  readonly race: Maybe_maybe<number>; 
  readonly raceVariant: Maybe_maybe<RaceCultureProfession_baseOrWithVariant>; 
  readonly culture: Maybe_maybe<number>; 
  readonly isCulturalPackageActive: boolean; 
  readonly profession: Maybe_maybe<RaceCultureProfession_baseOrWithVariant>; 
  readonly professionName: Maybe_maybe<string>; 
  readonly rules: Rules_t; 
  readonly personalData: PersonalData_t; 
  readonly advantages: IntMap_t<DisAdvantage_t>; 
  readonly disadvantages: IntMap_t<DisAdvantage_t>; 
  readonly specialAbilities: IntMap_t<SpecialAbility_t>; 
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
  readonly hitZoneArmors: list<HitZoneArmor_t>; 
  readonly purse: Purse_t; 
  readonly pets: list<Pet_t>; 
  readonly pact: Maybe_maybe<Pact_t>; 
  readonly combatStyleDependencies: list<Styles_Dependency_t>; 
  readonly magicalStyleDependencies: list<Styles_Dependency_t>; 
  readonly blessedStyleDependencies: list<Styles_Dependency_t>; 
  readonly skillStyleDependencies: list<Styles_Dependency_t>; 
  readonly socialStatusDependencies: list<number>; 
  readonly transferredUnfamiliarSpells: list<TransferUnfamiliar_t>
};
export type Hero = t;

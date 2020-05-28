/* TypeScript file generated from Hero.re by genType. */
/* eslint-disable import/first */


import {activatableAndSkillId as Ids_activatableAndSkillId} from '../../../src/App/Constants/Ids.gen';

import {activatableId as Ids_activatableId} from '../../../src/App/Constants/Ids.gen';

import {hitZoneArmorZoneItemId as Ids_hitZoneArmorZoneItemId} from '../../../src/App/Constants/Ids.gen';

import {list} from '../../../src/shims/ReasonPervasives.shim';

import {oneOrMany as GenericHelpers_oneOrMany} from '../../../src/App/Utilities/GenericHelpers.gen';

import {phase as Id_phase} from '../../../src/App/Constants/Id.gen';

import {selectOptionId as Ids_selectOptionId} from '../../../src/App/Constants/Ids.gen';

import {t as Ley_IntMap_t} from '../../../src/Data/Ley_IntMap.gen';

import {t as Ley_IntSet_t} from '../../../src/Data/Ley_IntSet.gen';

import {t as Ley_StrSet_t} from '../../../src/Data/Ley_StrSet.gen';

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
  readonly activePublications: Ley_StrSet_t; 
  readonly activeFocusRules: Ley_IntMap_t<Rules_activeRule>; 
  readonly activeOptionalRules: Ley_IntMap_t<Rules_activeRule>
};
export type Rules = Rules_t;

// tslint:disable-next-line:interface-over-type-literal
export type personalData = {
  readonly family?: string; 
  readonly placeOfBirth?: string; 
  readonly dateOfBirth?: string; 
  readonly age?: string; 
  readonly hairColor?: number; 
  readonly eyeColor?: number; 
  readonly size?: string; 
  readonly weight?: string; 
  readonly title?: string; 
  readonly socialStatus?: number; 
  readonly characteristics?: string; 
  readonly otherInfo?: string; 
  readonly cultureAreaKnowledge?: string
};
export type PersonalData = personalData;

// tslint:disable-next-line:interface-over-type-literal
export type Activatable_parameter = 
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
  readonly options: list<Activatable_parameter>; 
  readonly level?: number; 
  readonly customCost?: number
};
export type ActivatableSingle = Activatable_single;

// tslint:disable-next-line:interface-over-type-literal
export type Activatable_dependency = {
  readonly source: Ids_activatableId; 
  readonly target: GenericHelpers_oneOrMany<Ids_activatableId>; 
  readonly active: boolean; 
  readonly options: list<GenericHelpers_oneOrMany<Ids_selectOptionId>>; 
  readonly level?: number
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
  readonly value?: number
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
export type Item_mundaneItem = { readonly structurePoints?: GenericHelpers_oneOrMany<number> };
export type MundaneItem = Item_mundaneItem;

// tslint:disable-next-line:interface-over-type-literal
export type Item_newAttribute = { readonly attribute: number; readonly threshold: number };
export type NewAttribute = Item_newAttribute;

// tslint:disable-next-line:interface-over-type-literal
export type Item_agilityStrength = { readonly agility: number; readonly strength: number };
export type AgilityStrength = Item_agilityStrength;

// tslint:disable-next-line:interface-over-type-literal
export type Item_primaryAttributeDamageThreshold = 
    { tag: "DefaultAttribute"; value: number }
  | { tag: "DifferentAttribute"; value: Item_newAttribute }
  | { tag: "AgilityStrength"; value: Item_agilityStrength };
export type PrimaryAttributeDamageThreshold = Item_primaryAttributeDamageThreshold;

// tslint:disable-next-line:interface-over-type-literal
export type Item_damage = {
  readonly amount: number; 
  readonly sides: number; 
  readonly flat?: number
};
export type Damage = Item_damage;

// tslint:disable-next-line:interface-over-type-literal
export type Item_meleeWeapon = {
  readonly combatTechnique: number; 
  readonly damage: Item_damage; 
  readonly primaryAttributeDamageThreshold?: Item_primaryAttributeDamageThreshold; 
  readonly at?: number; 
  readonly pa?: number; 
  readonly reach?: number; 
  readonly length?: number; 
  readonly structurePoints?: GenericHelpers_oneOrMany<number>; 
  readonly breakingPointRatingMod?: number; 
  readonly isParryingWeapon: boolean; 
  readonly isTwoHandedWeapon: boolean; 
  readonly isImprovisedWeapon: boolean; 
  readonly damaged?: number
};
export type MeleeWeapon = Item_meleeWeapon;

// tslint:disable-next-line:interface-over-type-literal
export type Item_rangedWeapon = {
  readonly combatTechnique: number; 
  readonly damage?: Item_damage; 
  readonly length?: number; 
  readonly range: [number, number, number]; 
  readonly reloadTime: GenericHelpers_oneOrMany<number>; 
  readonly ammunition?: number; 
  readonly isImprovisedWeapon: boolean; 
  readonly damaged?: number
};
export type RangedWeapon = Item_rangedWeapon;

// tslint:disable-next-line:interface-over-type-literal
export type Item_armor = {
  readonly protection: number; 
  readonly encumbrance: number; 
  readonly hasAdditionalPenalties: boolean; 
  readonly iniMod?: number; 
  readonly movMod?: number; 
  readonly sturdinessMod?: number; 
  readonly armorType: number; 
  readonly wear?: number; 
  readonly isHitZoneArmorOnly?: boolean
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
  readonly name: string; 
  readonly amount?: number; 
  readonly price?: number; 
  readonly weight?: number; 
  readonly template?: number; 
  readonly isTemplateLocked: boolean; 
  readonly carriedWhere?: string; 
  readonly special?: Item_special; 
  readonly gr: number
};
export type Item = Item_t;

// tslint:disable-next-line:interface-over-type-literal
export type hitZoneArmor = {
  readonly id: number; 
  readonly name: string; 
  readonly head?: Ids_hitZoneArmorZoneItemId; 
  readonly headWear?: number; 
  readonly leftArm?: Ids_hitZoneArmorZoneItemId; 
  readonly leftArmWear?: number; 
  readonly rightArm?: Ids_hitZoneArmorZoneItemId; 
  readonly rightArmWear?: number; 
  readonly torso?: Ids_hitZoneArmorZoneItemId; 
  readonly torsoWear?: number; 
  readonly leftLeg?: Ids_hitZoneArmorZoneItemId; 
  readonly leftLegWear?: number; 
  readonly rightLeg?: Ids_hitZoneArmorZoneItemId; 
  readonly rightLegWear?: number
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
  readonly avatar?: string; 
  readonly size?: string; 
  readonly type?: string; 
  readonly attack?: string; 
  readonly dp?: string; 
  readonly reach?: string; 
  readonly actions?: string; 
  readonly skills?: string; 
  readonly abilities?: string; 
  readonly notes?: string; 
  readonly spentAp?: string; 
  readonly totalAp?: string; 
  readonly cou?: string; 
  readonly sgc?: string; 
  readonly int?: string; 
  readonly cha?: string; 
  readonly dex?: string; 
  readonly agi?: string; 
  readonly con?: string; 
  readonly str?: string; 
  readonly lp?: string; 
  readonly ae?: string; 
  readonly spi?: string; 
  readonly tou?: string; 
  readonly pro?: string; 
  readonly ini?: string; 
  readonly mov?: string; 
  readonly at?: string; 
  readonly pa?: string
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
  readonly active?: number; 
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
  readonly phase: Id_phase; 
  readonly locale: string; 
  readonly avatar?: string; 
  readonly race?: number; 
  readonly raceVariant?: baseOrWithVariant; 
  readonly culture?: number; 
  readonly isCulturalPackageActive: boolean; 
  readonly profession?: baseOrWithVariant; 
  readonly professionName?: string; 
  readonly rules: Rules_t; 
  readonly personalData: personalData; 
  readonly advantages: Ley_IntMap_t<Activatable_t>; 
  readonly disadvantages: Ley_IntMap_t<Activatable_t>; 
  readonly specialAbilities: Ley_IntMap_t<Activatable_t>; 
  readonly attributes: Ley_IntMap_t<Attribute_t>; 
  readonly attributeAdjustmentSelected: number; 
  readonly energies: Energies_t; 
  readonly skills: Ley_IntMap_t<Skill_t>; 
  readonly combatTechniques: Ley_IntMap_t<Skill_t>; 
  readonly spells: Ley_IntMap_t<ActivatableSkill_t>; 
  readonly liturgicalChants: Ley_IntMap_t<ActivatableSkill_t>; 
  readonly cantrips: Ley_IntSet_t; 
  readonly blessings: Ley_IntSet_t; 
  readonly items: Ley_IntMap_t<Item_t>; 
  readonly hitZoneArmors: Ley_IntMap_t<hitZoneArmor>; 
  readonly purse: purse; 
  readonly pets: Ley_IntMap_t<pet>; 
  readonly pact?: Pact_t; 
  readonly combatStyleDependencies: list<styleDependency>; 
  readonly magicalStyleDependencies: list<styleDependency>; 
  readonly blessedStyleDependencies: list<styleDependency>; 
  readonly skillStyleDependencies: list<styleDependency>; 
  readonly socialStatusDependencies: list<number>; 
  readonly transferredUnfamiliarSpells: list<TransferUnfamiliar_t>
};
export type Hero = t;

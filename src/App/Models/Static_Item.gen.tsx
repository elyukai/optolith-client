/* TypeScript file generated from Static_Item.re by genType. */
/* eslint-disable import/first */


import {list} from '../../../src/shims/ReasonPervasives.shim';

import {oneOrMany as GenericHelpers_oneOrMany} from '../../../src/App/Utilities/GenericHelpers.gen';

import {t as Static_Erratum_t} from './Static_Erratum.gen';

import {t as Static_SourceRef_t} from './Static_SourceRef.gen';

// tslint:disable-next-line:interface-over-type-literal
export type info = {
  readonly note?: string; 
  readonly rules?: string; 
  readonly advantage?: string; 
  readonly disadvantage?: string; 
  readonly src: list<Static_SourceRef_t>; 
  readonly errata: list<Static_Erratum_t>
};
export type ItemInfo = info;

// tslint:disable-next-line:interface-over-type-literal
export type mundaneItem = { readonly structurePoints?: GenericHelpers_oneOrMany<number> };
export type MundaneItem = mundaneItem;

// tslint:disable-next-line:interface-over-type-literal
export type newAttribute = { readonly attribute: number; readonly threshold: number };
export type NewAttribute = newAttribute;

// tslint:disable-next-line:interface-over-type-literal
export type agilityStrength = { readonly agility: number; readonly strength: number };
export type AgilityStrength = agilityStrength;

// tslint:disable-next-line:interface-over-type-literal
export type primaryAttributeDamageThreshold = 
    { tag: "DefaultAttribute"; value: number }
  | { tag: "DifferentAttribute"; value: newAttribute }
  | { tag: "AgilityStrength"; value: agilityStrength };
export type PrimaryAttributeDamageThreshold = primaryAttributeDamageThreshold;

// tslint:disable-next-line:interface-over-type-literal
export type damage = {
  readonly amount: number; 
  readonly sides: number; 
  readonly flat?: number
};
export type Damage = damage;

// tslint:disable-next-line:interface-over-type-literal
export type meleeWeapon = {
  readonly combatTechnique: number; 
  readonly damage: damage; 
  readonly primaryAttributeDamageThreshold?: primaryAttributeDamageThreshold; 
  readonly at?: number; 
  readonly pa?: number; 
  readonly reach?: number; 
  readonly length?: number; 
  readonly structurePoints?: GenericHelpers_oneOrMany<number>; 
  readonly isParryingWeapon: boolean; 
  readonly isTwoHandedWeapon: boolean; 
  readonly isImprovisedWeapon: boolean
};
export type MeleeWeapon = meleeWeapon;

// tslint:disable-next-line:interface-over-type-literal
export type rangedWeapon = {
  readonly combatTechnique: number; 
  readonly damage?: damage; 
  readonly length?: number; 
  readonly range: [number, number, number]; 
  readonly reloadTime: GenericHelpers_oneOrMany<number>; 
  readonly ammunition?: number; 
  readonly isImprovisedWeapon: boolean
};
export type RangedWeapon = rangedWeapon;

// tslint:disable-next-line:interface-over-type-literal
export type armor = {
  readonly protection: number; 
  readonly encumbrance: number; 
  readonly hasAdditionalPenalties: boolean; 
  readonly armorType: number
};
export type Armor = armor;

// tslint:disable-next-line:interface-over-type-literal
export type special = 
    { tag: "MundaneItem"; value: mundaneItem }
  | { tag: "MeleeWeapon"; value: meleeWeapon }
  | { tag: "RangedWeapon"; value: rangedWeapon }
  | { tag: "CombinedWeapon"; value: [meleeWeapon, rangedWeapon] }
  | { tag: "Armor"; value: armor };
export type ItemSpecial = special;

// tslint:disable-next-line:interface-over-type-literal
export type t = {
  readonly id: number; 
  readonly name: string; 
  readonly price?: number; 
  readonly weight?: number; 
  readonly special?: special; 
  readonly info: list<info>; 
  readonly gr: number
};
export type Item = t;

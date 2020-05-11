/* TypeScript file generated from Static_Prerequisites.re by genType. */
/* eslint-disable import/first */


import {IntMap_t as Ley_IntMap_t} from '../../../src/Data/Ley.gen';

import {list} from '../../../src/shims/ReasonPervasives.shim';

import {oneOrMany as GenericHelpers_oneOrMany} from '../../../src/App/Utilities/GenericHelpers.gen';

import {selectOptionId as Ids_selectOptionId} from '../../../src/App/Constants/Ids.gen';

import {sex as Hero_sex} from './Hero.gen';

// tslint:disable-next-line:interface-over-type-literal
export type sex = Hero_sex;
export type SexPrerequisite = sex;

// tslint:disable-next-line:interface-over-type-literal
export type race = { readonly id: GenericHelpers_oneOrMany<number>; readonly active: boolean };
export type RacePrerequisite = race;

// tslint:disable-next-line:interface-over-type-literal
export type culture = GenericHelpers_oneOrMany<number>;
export type CulturePrerequisite = culture;

// tslint:disable-next-line:interface-over-type-literal
export type socialStatus = number;
export type SocialPrerequisite = socialStatus;

// tslint:disable-next-line:interface-over-type-literal
export type pact = {
  readonly category: number; 
  readonly domain?: GenericHelpers_oneOrMany<number>; 
  readonly level?: number
};
export type PactPrerequisite = pact;

// tslint:disable-next-line:interface-over-type-literal
export type primaryAttributeType = "Magical" | "Blessed";

// tslint:disable-next-line:interface-over-type-literal
export type primaryAttribute = { readonly value: number; readonly scope: primaryAttributeType };
export type PrimaryAttributePrerequisite = primaryAttribute;

// tslint:disable-next-line:interface-over-type-literal
export type activatableId = 
    { tag: "Advantage"; value: number }
  | { tag: "Disadvantage"; value: number }
  | { tag: "SpecialAbility"; value: number };

// tslint:disable-next-line:interface-over-type-literal
export type activatable = {
  readonly id: activatableId; 
  readonly active: boolean; 
  readonly sid?: Ids_selectOptionId; 
  readonly sid2?: Ids_selectOptionId; 
  readonly level?: number
};
export type ActivatablePrerequisite = activatable;

// tslint:disable-next-line:interface-over-type-literal
export type activatableSkillId = 
    { tag: "Spell"; value: number }
  | { tag: "LiturgicalChant"; value: number };

// tslint:disable-next-line:interface-over-type-literal
export type activatableSkill = { readonly id: activatableSkillId; readonly active: boolean };
export type ActivatableSkillPrerequisite = activatableSkill;

// tslint:disable-next-line:interface-over-type-literal
export type activatableMultiEntry = {
  readonly id: list<activatableId>; 
  readonly active: boolean; 
  readonly sid?: Ids_selectOptionId; 
  readonly sid2?: Ids_selectOptionId; 
  readonly level?: number
};
export type ActivatableMultiEntryPrerequisite = activatableMultiEntry;

// tslint:disable-next-line:interface-over-type-literal
export type activatableMultiSelect = {
  readonly id: activatableId; 
  readonly active: boolean; 
  readonly sid: list<Ids_selectOptionId>; 
  readonly sid2?: Ids_selectOptionId; 
  readonly level?: number
};
export type ActivatableMultiSelectPrerequisite = activatableMultiSelect;

// tslint:disable-next-line:interface-over-type-literal
export type increasableId = 
    { tag: "Attribute"; value: number }
  | { tag: "Skill"; value: number }
  | { tag: "CombatTechnique"; value: number }
  | { tag: "Spell"; value: number }
  | { tag: "LiturgicalChant"; value: number };

// tslint:disable-next-line:interface-over-type-literal
export type increasable = { readonly id: increasableId; readonly value: number };
export type IncreasablePrerequisite = increasable;

// tslint:disable-next-line:interface-over-type-literal
export type increasableMultiEntry = { readonly id: list<increasableId>; readonly value: number };
export type IncreasableMultiEntryPrerequisite = increasableMultiEntry;

// tslint:disable-next-line:interface-over-type-literal
export type tProfession = {
  readonly sex?: sex; 
  readonly race?: race; 
  readonly culture?: culture; 
  readonly activatable: list<activatable>; 
  readonly increasable: list<increasable>
};
export type PrerequisitesForProfession = tProfession;

// tslint:disable-next-line:interface-over-type-literal
export type t = {
  readonly sex?: sex; 
  readonly race?: race; 
  readonly culture?: culture; 
  readonly pact?: pact; 
  readonly social?: socialStatus; 
  readonly primaryAttribute?: primaryAttribute; 
  readonly activatable: list<activatable>; 
  readonly activatableMultiEntry: list<activatableMultiEntry>; 
  readonly activatableMultiSelect: list<activatableMultiSelect>; 
  readonly increasable: list<increasable>; 
  readonly increasableMultiEntry: list<increasableMultiEntry>
};
export type Prerequisites = t;

// tslint:disable-next-line:interface-over-type-literal
export type tWithLevel = {
  readonly sex?: sex; 
  readonly race?: race; 
  readonly culture?: culture; 
  readonly pact?: pact; 
  readonly social?: socialStatus; 
  readonly primaryAttribute?: primaryAttribute; 
  readonly activatable: list<activatable>; 
  readonly activatableMultiEntry: list<activatableMultiEntry>; 
  readonly activatableMultiSelect: list<activatableMultiSelect>; 
  readonly increasable: list<increasable>; 
  readonly increasableMultiEntry: list<increasableMultiEntry>; 
  readonly levels: Ley_IntMap_t<t>
};
export type PrerequisitesWithLevels = tWithLevel;

// tslint:disable-next-line:interface-over-type-literal
export type tWithLevelDisAdv = {
  readonly commonSuggestedByRCP: boolean; 
  readonly sex?: sex; 
  readonly race?: race; 
  readonly culture?: culture; 
  readonly pact?: pact; 
  readonly social?: socialStatus; 
  readonly primaryAttribute?: primaryAttribute; 
  readonly activatable: list<activatable>; 
  readonly activatableMultiEntry: list<activatableMultiEntry>; 
  readonly activatableMultiSelect: list<activatableMultiSelect>; 
  readonly increasable: list<increasable>; 
  readonly increasableMultiEntry: list<increasableMultiEntry>; 
  readonly levels: Ley_IntMap_t<t>
};
export type PrerequisitesForDisAdvWithLevels = tWithLevelDisAdv;

// tslint:disable-next-line:interface-over-type-literal
export type overridePrerequisite = 
    "Hide"
  | { tag: "ReplaceWith"; value: string };
export type OverridePrerequisite = overridePrerequisite;

// tslint:disable-next-line:interface-over-type-literal
export type tIndex = {
  readonly sex?: overridePrerequisite; 
  readonly race?: overridePrerequisite; 
  readonly culture?: overridePrerequisite; 
  readonly pact?: overridePrerequisite; 
  readonly social?: overridePrerequisite; 
  readonly primaryAttribute?: overridePrerequisite; 
  readonly activatable: Ley_IntMap_t<overridePrerequisite>; 
  readonly activatableMultiEntry: Ley_IntMap_t<overridePrerequisite>; 
  readonly activatableMultiSelect: Ley_IntMap_t<overridePrerequisite>; 
  readonly increasable: Ley_IntMap_t<overridePrerequisite>; 
  readonly increasableMultiEntry: Ley_IntMap_t<overridePrerequisite>
};
export type OverridePrerequisites = tIndex;

// tslint:disable-next-line:interface-over-type-literal
export type tIndexWithLevel = {
  readonly sex?: overridePrerequisite; 
  readonly race?: overridePrerequisite; 
  readonly culture?: overridePrerequisite; 
  readonly pact?: overridePrerequisite; 
  readonly social?: overridePrerequisite; 
  readonly primaryAttribute?: overridePrerequisite; 
  readonly activatable: Ley_IntMap_t<overridePrerequisite>; 
  readonly activatableMultiEntry: Ley_IntMap_t<overridePrerequisite>; 
  readonly activatableMultiSelect: Ley_IntMap_t<overridePrerequisite>; 
  readonly increasable: Ley_IntMap_t<overridePrerequisite>; 
  readonly increasableMultiEntry: Ley_IntMap_t<overridePrerequisite>; 
  readonly levels: Ley_IntMap_t<tIndex>
};
export type OverridePrerequisitesWithLevels = tIndexWithLevel;

/* TypeScript file generated from Static_Prerequisites.re by genType. */
/* eslint-disable import/first */


import {list} from '../../../src/shims/ReasonPervasives.shim';

import {oneOrMany as GenericHelpers_oneOrMany} from '../../../src/App/Utilities/GenericHelpers.gen';

import {selectOptionId as Ids_selectOptionId} from '../../../src/App/Constants/Ids.gen';

import {sex as Hero_sex} from './Hero.gen';

import {t as IntMap_t} from '../../../src/shims/IntMap.gen';

import {t as Maybe_t} from '../../../src/Data/Maybe.gen';

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
  readonly domain: Maybe_t<GenericHelpers_oneOrMany<number>>; 
  readonly level: Maybe_t<number>
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
  readonly sid: Maybe_t<Ids_selectOptionId>; 
  readonly sid2: Maybe_t<Ids_selectOptionId>; 
  readonly level: Maybe_t<number>
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
  readonly sid: Maybe_t<Ids_selectOptionId>; 
  readonly sid2: Maybe_t<Ids_selectOptionId>; 
  readonly level: Maybe_t<number>
};
export type ActivatableMultiEntryPrerequisite = activatableMultiEntry;

// tslint:disable-next-line:interface-over-type-literal
export type activatableMultiSelect = {
  readonly id: activatableId; 
  readonly active: boolean; 
  readonly sid: list<Ids_selectOptionId>; 
  readonly sid2: Maybe_t<Ids_selectOptionId>; 
  readonly level: Maybe_t<number>
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
  readonly sex: Maybe_t<sex>; 
  readonly race: Maybe_t<race>; 
  readonly culture: Maybe_t<culture>; 
  readonly activatable: list<activatable>; 
  readonly increasable: list<increasable>
};
export type PrerequisitesForProfession = tProfession;

// tslint:disable-next-line:interface-over-type-literal
export type t = {
  readonly sex: Maybe_t<sex>; 
  readonly race: Maybe_t<race>; 
  readonly culture: Maybe_t<culture>; 
  readonly pact: Maybe_t<pact>; 
  readonly social: Maybe_t<socialStatus>; 
  readonly primaryAttribute: Maybe_t<primaryAttribute>; 
  readonly activatable: list<activatable>; 
  readonly activatableMultiEntry: list<activatableMultiEntry>; 
  readonly activatableMultiSelect: list<activatableMultiSelect>; 
  readonly increasable: list<increasable>; 
  readonly increasableMultiEntry: list<increasableMultiEntry>
};
export type Prerequisites = t;

// tslint:disable-next-line:interface-over-type-literal
export type tWithLevel = {
  readonly sex: Maybe_t<sex>; 
  readonly race: Maybe_t<race>; 
  readonly culture: Maybe_t<culture>; 
  readonly pact: Maybe_t<pact>; 
  readonly social: Maybe_t<socialStatus>; 
  readonly primaryAttribute: Maybe_t<primaryAttribute>; 
  readonly activatable: list<activatable>; 
  readonly activatableMultiEntry: list<activatableMultiEntry>; 
  readonly activatableMultiSelect: list<activatableMultiSelect>; 
  readonly increasable: list<increasable>; 
  readonly increasableMultiEntry: list<increasableMultiEntry>; 
  readonly levels: IntMap_t<t>
};
export type PrerequisitesWithLevels = tWithLevel;

// tslint:disable-next-line:interface-over-type-literal
export type tWithLevelDisAdv = {
  readonly commonSuggestedByRCP: boolean; 
  readonly sex: Maybe_t<sex>; 
  readonly race: Maybe_t<race>; 
  readonly culture: Maybe_t<culture>; 
  readonly pact: Maybe_t<pact>; 
  readonly social: Maybe_t<socialStatus>; 
  readonly primaryAttribute: Maybe_t<primaryAttribute>; 
  readonly activatable: list<activatable>; 
  readonly activatableMultiEntry: list<activatableMultiEntry>; 
  readonly activatableMultiSelect: list<activatableMultiSelect>; 
  readonly increasable: list<increasable>; 
  readonly increasableMultiEntry: list<increasableMultiEntry>; 
  readonly levels: IntMap_t<t>
};
export type PrerequisitesForDisAdvWithLevels = tWithLevelDisAdv;

// tslint:disable-next-line:interface-over-type-literal
export type overridePrerequisite = 
    "Hide"
  | { tag: "ReplaceWith"; value: string };
export type OverridePrerequisite = overridePrerequisite;

// tslint:disable-next-line:interface-over-type-literal
export type tIndex = {
  readonly sex: Maybe_t<overridePrerequisite>; 
  readonly race: Maybe_t<overridePrerequisite>; 
  readonly culture: Maybe_t<overridePrerequisite>; 
  readonly pact: Maybe_t<overridePrerequisite>; 
  readonly social: Maybe_t<overridePrerequisite>; 
  readonly primaryAttribute: Maybe_t<overridePrerequisite>; 
  readonly activatable: IntMap_t<overridePrerequisite>; 
  readonly activatableMultiEntry: IntMap_t<overridePrerequisite>; 
  readonly activatableMultiSelect: IntMap_t<overridePrerequisite>; 
  readonly increasable: IntMap_t<overridePrerequisite>; 
  readonly increasableMultiEntry: IntMap_t<overridePrerequisite>
};
export type OverridePrerequisites = tIndex;

// tslint:disable-next-line:interface-over-type-literal
export type tIndexWithLevel = {
  readonly sex: Maybe_t<overridePrerequisite>; 
  readonly race: Maybe_t<overridePrerequisite>; 
  readonly culture: Maybe_t<overridePrerequisite>; 
  readonly pact: Maybe_t<overridePrerequisite>; 
  readonly social: Maybe_t<overridePrerequisite>; 
  readonly primaryAttribute: Maybe_t<overridePrerequisite>; 
  readonly activatable: IntMap_t<overridePrerequisite>; 
  readonly activatableMultiEntry: IntMap_t<overridePrerequisite>; 
  readonly activatableMultiSelect: IntMap_t<overridePrerequisite>; 
  readonly increasable: IntMap_t<overridePrerequisite>; 
  readonly increasableMultiEntry: IntMap_t<overridePrerequisite>; 
  readonly levels: IntMap_t<tIndex>
};
export type OverridePrerequisitesWithLevels = tIndexWithLevel;

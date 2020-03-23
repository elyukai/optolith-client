/* TypeScript file generated from Static.re by genType. */
/* eslint-disable import/first */


import {oneOrManyArr as GenericHelpers_oneOrManyArr} from '../../../src/App/Utilities/GenericHelpers.gen';

import {selectOptionId as Ids_selectOptionId} from '../../../src/App/Constants/Ids.gen';

// tslint:disable-next-line:interface-over-type-literal
export type SourceRef_t = { readonly id: string; readonly page: [number, number] };
export type SourceRef = SourceRef_t;

// tslint:disable-next-line:interface-over-type-literal
export type Erratum_t = { readonly date: Date; readonly description: string };
export type Erratum = Erratum_t;

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_SexPrerequisite_sex = "Male" | "Female";
export type Sex = Prerequisites_SexPrerequisite_sex;

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_SexPrerequisite_t = Prerequisites_SexPrerequisite_sex;
export type SexPrerequisite = Prerequisites_SexPrerequisite_t;

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_RacePrerequisite_raceId = GenericHelpers_oneOrManyArr<number>;

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_RacePrerequisite_t = { readonly id: Prerequisites_RacePrerequisite_raceId; readonly active: boolean };
export type RacePrerequisite = Prerequisites_RacePrerequisite_t;

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_CulturePrerequisite_cultureId = GenericHelpers_oneOrManyArr<number>;

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_CulturePrerequisite_t = Prerequisites_CulturePrerequisite_cultureId;
export type CulturePrerequisite = Prerequisites_CulturePrerequisite_t;

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_SocialPrerequisite_t = number;
export type SocialPrerequisite = Prerequisites_SocialPrerequisite_t;

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_PactPrerequisite_t = {
  readonly category: number; 
  readonly domain?: GenericHelpers_oneOrManyArr<number>; 
  readonly level?: number
};
export type PactPrerequisite = Prerequisites_PactPrerequisite_t;

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_PrimaryAttributePrerequisite_primaryAttributeType = "Magical" | "Blessed";

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_PrimaryAttributePrerequisite_t = { readonly value: number; readonly scope: Prerequisites_PrimaryAttributePrerequisite_primaryAttributeType };
export type PrimaryAttributePrerequisite = Prerequisites_PrimaryAttributePrerequisite_t;

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_ActivatablePrerequisite_id = 
    { tag: "Advantage"; value: number }
  | { tag: "Disadvantage"; value: number }
  | { tag: "SpecialAbility"; value: number };

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_ActivatablePrerequisite_t = {
  readonly id: Prerequisites_ActivatablePrerequisite_id; 
  readonly active: boolean; 
  readonly sid?: Ids_selectOptionId; 
  readonly sid2?: Ids_selectOptionId; 
  readonly tier?: number
};
export type ActivatablePrerequisite = Prerequisites_ActivatablePrerequisite_t;

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_ActivatableSkillPrerequisite_id = 
    { tag: "Spell"; value: number }
  | { tag: "LiturgicalChant"; value: number };

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_ActivatableSkillPrerequisite_t = { readonly id: Prerequisites_ActivatableSkillPrerequisite_id; readonly active: boolean };
export type ActivatableSkillPrerequisite = Prerequisites_ActivatableSkillPrerequisite_t;

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_ActivatableMultiEntryPrerequisite_t = {
  readonly id: Prerequisites_ActivatablePrerequisite_id[]; 
  readonly active: boolean; 
  readonly sid?: Ids_selectOptionId; 
  readonly sid2?: Ids_selectOptionId; 
  readonly tier?: number
};
export type ActivatableMultiEntryPrerequisite = Prerequisites_ActivatableMultiEntryPrerequisite_t;

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_ActivatableMultiSelectPrerequisite_t = {
  readonly id: Prerequisites_ActivatablePrerequisite_id; 
  readonly active: boolean; 
  readonly sid: Ids_selectOptionId[]; 
  readonly sid2?: Ids_selectOptionId; 
  readonly tier?: number
};
export type ActivatableMultiSelectPrerequisite = Prerequisites_ActivatableMultiSelectPrerequisite_t;

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_IncreasablePrerequisite_id = 
    { tag: "Attribute"; value: number }
  | { tag: "Skill"; value: number }
  | { tag: "CombatTechnique"; value: number }
  | { tag: "Spell"; value: number }
  | { tag: "LiturgicalChant"; value: number };

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_IncreasablePrerequisite_t = { readonly id: Prerequisites_IncreasablePrerequisite_id; readonly value: number };
export type IncreasablePrerequisite = Prerequisites_IncreasablePrerequisite_t;

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_IncreasableMultiEntryPrerequisite_t = { readonly id: Prerequisites_IncreasablePrerequisite_id[]; readonly value: number };
export type IncreasableMultiEntryPrerequisite = Prerequisites_IncreasableMultiEntryPrerequisite_t;

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_t = {
  readonly sex?: Prerequisites_SexPrerequisite_t; 
  readonly race?: Prerequisites_RacePrerequisite_t; 
  readonly culture?: Prerequisites_CulturePrerequisite_t; 
  readonly pact?: Prerequisites_PactPrerequisite_t; 
  readonly social?: Prerequisites_SocialPrerequisite_t; 
  readonly primaryAttribute?: Prerequisites_PrimaryAttributePrerequisite_t; 
  readonly activatable: Prerequisites_ActivatablePrerequisite_t[]; 
  readonly activatableMultiEntry: Prerequisites_ActivatableMultiEntryPrerequisite_t[]; 
  readonly activatableMultiSelect: Prerequisites_ActivatableMultiSelectPrerequisite_t[]; 
  readonly increasable: Prerequisites_IncreasablePrerequisite_t[]; 
  readonly increasableMultiEntry: Prerequisites_IncreasableMultiEntryPrerequisite_t[]
};
export type Prerequisites = Prerequisites_t;

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_overridePrerequisite = 
    "Hide"
  | { tag: "ReplaceWith"; value: string };
export type OverridePrerequisite = Prerequisites_overridePrerequisite;

// tslint:disable-next-line:interface-over-type-literal
export type Patron_Category_t = {
  readonly id: number; 
  readonly name: string; 
  readonly primaryPatronCultures: number[]
};
export type PatronCategory = Patron_Category_t;

// tslint:disable-next-line:interface-over-type-literal
export type Patron_t = {
  readonly id: number; 
  readonly name: string; 
  readonly category: number; 
  readonly skills: [number, number, number]; 
  readonly limitedToCultures: number[]; 
  readonly isLimitedToCulturesReverse?: boolean
};
export type Patron = Patron_t;

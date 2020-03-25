/* TypeScript file generated from Static.re by genType. */
/* eslint-disable import/first */


import {list} from '../../../src/shims/ReasonPervasives.shim';

import {oneOrMany as GenericHelpers_oneOrMany} from '../../../src/App/Utilities/GenericHelpers.gen';

import {selectOptionId as Ids_selectOptionId} from '../../../src/App/Constants/Ids.gen';

import {t as Maybe_t} from '../../../src/Data/Maybe.gen';

// tslint:disable-next-line:interface-over-type-literal
export type SourceRef_t = { readonly id: string; readonly page: [number, number] };
export type SourceRef = SourceRef_t;

// tslint:disable-next-line:interface-over-type-literal
export type Erratum_t = { readonly date: Date; readonly description: string };
export type Erratum = Erratum_t;

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_Sex_sex = "Male" | "Female";
export type Sex = Prerequisites_Sex_sex;

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_Sex_t = Prerequisites_Sex_sex;
export type SexPrerequisite = Prerequisites_Sex_t;

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_Race_raceId = GenericHelpers_oneOrMany<number>;

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_Race_t = { readonly id: Prerequisites_Race_raceId; readonly active: boolean };
export type RacePrerequisite = Prerequisites_Race_t;

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_Culture_cultureId = GenericHelpers_oneOrMany<number>;

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_Culture_t = Prerequisites_Culture_cultureId;
export type CulturePrerequisite = Prerequisites_Culture_t;

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_SocialStatus_t = number;
export type SocialPrerequisite = Prerequisites_SocialStatus_t;

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_Pact_t = {
  readonly category: number; 
  readonly domain: Maybe_t<GenericHelpers_oneOrMany<number>>; 
  readonly level: Maybe_t<number>
};
export type PactPrerequisite = Prerequisites_Pact_t;

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_PrimaryAttribute_primaryAttributeType = "Magical" | "Blessed";

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_PrimaryAttribute_t = { readonly value: number; readonly scope: Prerequisites_PrimaryAttribute_primaryAttributeType };
export type PrimaryAttributePrerequisite = Prerequisites_PrimaryAttribute_t;

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_Activatable_id = 
    { tag: "Advantage"; value: number }
  | { tag: "Disadvantage"; value: number }
  | { tag: "SpecialAbility"; value: number };

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_Activatable_t = {
  readonly id: Prerequisites_Activatable_id; 
  readonly active: boolean; 
  readonly sid: Maybe_t<Ids_selectOptionId>; 
  readonly sid2: Maybe_t<Ids_selectOptionId>; 
  readonly tier: Maybe_t<number>
};
export type ActivatablePrerequisite = Prerequisites_Activatable_t;

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_ActivatableSkill_id = 
    { tag: "Spell"; value: number }
  | { tag: "LiturgicalChant"; value: number };

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_ActivatableSkill_t = { readonly id: Prerequisites_ActivatableSkill_id; readonly active: boolean };
export type ActivatableSkillPrerequisite = Prerequisites_ActivatableSkill_t;

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_ActivatableMultiEntry_t = {
  readonly id: list<Prerequisites_Activatable_id>; 
  readonly active: boolean; 
  readonly sid: Maybe_t<Ids_selectOptionId>; 
  readonly sid2: Maybe_t<Ids_selectOptionId>; 
  readonly tier: Maybe_t<number>
};
export type ActivatableMultiEntryPrerequisite = Prerequisites_ActivatableMultiEntry_t;

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_ActivatableMultiSelect_t = {
  readonly id: Prerequisites_Activatable_id; 
  readonly active: boolean; 
  readonly sid: list<Ids_selectOptionId>; 
  readonly sid2: Maybe_t<Ids_selectOptionId>; 
  readonly tier: Maybe_t<number>
};
export type ActivatableMultiSelectPrerequisite = Prerequisites_ActivatableMultiSelect_t;

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_Increasable_id = 
    { tag: "Attribute"; value: number }
  | { tag: "Skill"; value: number }
  | { tag: "CombatTechnique"; value: number }
  | { tag: "Spell"; value: number }
  | { tag: "LiturgicalChant"; value: number };

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_Increasable_t = { readonly id: Prerequisites_Increasable_id; readonly value: number };
export type IncreasablePrerequisite = Prerequisites_Increasable_t;

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_IncreasableMultiEntry_t = { readonly id: list<Prerequisites_Increasable_id>; readonly value: number };
export type IncreasableMultiEntryPrerequisite = Prerequisites_IncreasableMultiEntry_t;

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_t = {
  readonly sex: Maybe_t<Prerequisites_Sex_t>; 
  readonly race: Maybe_t<Prerequisites_Race_t>; 
  readonly culture: Maybe_t<Prerequisites_Culture_t>; 
  readonly pact: Maybe_t<Prerequisites_Pact_t>; 
  readonly social: Maybe_t<Prerequisites_SocialStatus_t>; 
  readonly primaryAttribute: Maybe_t<Prerequisites_PrimaryAttribute_t>; 
  readonly activatable: list<Prerequisites_Activatable_t>; 
  readonly activatableMultiEntry: list<Prerequisites_ActivatableMultiEntry_t>; 
  readonly activatableMultiSelect: list<Prerequisites_ActivatableMultiSelect_t>; 
  readonly increasable: list<Prerequisites_Increasable_t>; 
  readonly increasableMultiEntry: list<Prerequisites_IncreasableMultiEntry_t>
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
  readonly isLimitedToCulturesReverse: Maybe_t<boolean>
};
export type Patron = Patron_t;

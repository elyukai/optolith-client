/* TypeScript file generated from Prerequisites.re by genType. */
/* eslint-disable import/first */


import {list} from '../../../../src/shims/ReasonPervasives.shim';

import {selectOptionId as Ids_selectOptionId} from '../../../../src/App/Constants/Ids.gen';

// tslint:disable-next-line:interface-over-type-literal
export type oneOrMany<a> = 
    { tag: "Single"; value: a }
  | { tag: "OneOf"; value: list<a> };

// tslint:disable-next-line:interface-over-type-literal
export type SexPrerequisite_sex = "Male" | "Female";

// tslint:disable-next-line:interface-over-type-literal
export type SexPrerequisite_t = SexPrerequisite_sex;

// tslint:disable-next-line:interface-over-type-literal
export type RacePrerequisite_raceId = oneOrMany<string>;

// tslint:disable-next-line:interface-over-type-literal
export type RacePrerequisite_t = { readonly id: RacePrerequisite_raceId; readonly active: boolean };

// tslint:disable-next-line:interface-over-type-literal
export type CulturePrerequisite_cultureId = oneOrMany<string>;

// tslint:disable-next-line:interface-over-type-literal
export type CulturePrerequisite_t = CulturePrerequisite_cultureId;

// tslint:disable-next-line:interface-over-type-literal
export type SocialPrerequisite_t = number;

// tslint:disable-next-line:interface-over-type-literal
export type PactPrerequisite_t = {
  readonly id: list<string>; 
  readonly value: number; 
  readonly category: number; 
  readonly domain?: oneOrMany<number>; 
  readonly level?: number
};

// tslint:disable-next-line:interface-over-type-literal
export type PrimaryAttributePrerequisite_primaryAttributeType = "Magical" | "Blessed";

// tslint:disable-next-line:interface-over-type-literal
export type PrimaryAttributePrerequisite_t = { readonly value: number; readonly scope: PrimaryAttributePrerequisite_primaryAttributeType };

// tslint:disable-next-line:interface-over-type-literal
export type ActivatablePrerequisite_t = {
  readonly id: string; 
  readonly active: boolean; 
  readonly sid?: Ids_selectOptionId; 
  readonly sid2?: Ids_selectOptionId; 
  readonly tier?: number
};

// tslint:disable-next-line:interface-over-type-literal
export type ActivatableMultiEntryPrerequisite_t = {
  readonly id: list<string>; 
  readonly active: boolean; 
  readonly sid?: Ids_selectOptionId; 
  readonly sid2?: Ids_selectOptionId; 
  readonly tier?: number
};

// tslint:disable-next-line:interface-over-type-literal
export type ActivatableMultiSelectPrerequisite_t = {
  readonly id: string; 
  readonly active: boolean; 
  readonly sid: list<Ids_selectOptionId>; 
  readonly sid2?: Ids_selectOptionId; 
  readonly tier?: number
};

// tslint:disable-next-line:interface-over-type-literal
export type IncreasablePrerequisite_t = { readonly id: string; readonly value: number };

// tslint:disable-next-line:interface-over-type-literal
export type IncreasableMultiEntryPrerequisite_t = { readonly id: list<string>; readonly value: number };

// tslint:disable-next-line:interface-over-type-literal
export type professionDependency = 
    { tag: "Sex"; value: SexPrerequisite_t }
  | { tag: "Race"; value: RacePrerequisite_t }
  | { tag: "Culture"; value: CulturePrerequisite_t };

// tslint:disable-next-line:interface-over-type-literal
export type professionPrerequisite = 
    { tag: "Activatable"; value: ActivatablePrerequisite_t }
  | { tag: "Increasable"; value: IncreasablePrerequisite_t };

// tslint:disable-next-line:interface-over-type-literal
export type t = 
    { tag: "Activatable"; value: ActivatablePrerequisite_t }
  | { tag: "Increasable"; value: IncreasablePrerequisite_t }
  | { tag: "PrimaryAttribute"; value: PrimaryAttributePrerequisite_t }
  | { tag: "Sex"; value: SexPrerequisite_t }
  | { tag: "Race"; value: RacePrerequisite_t }
  | { tag: "Culture"; value: CulturePrerequisite_t }
  | { tag: "Pact"; value: PactPrerequisite_t }
  | { tag: "Social"; value: SocialPrerequisite_t };

// tslint:disable-next-line:interface-over-type-literal
export type tDisAdv = 
    "CommonSuggestedByRCP"
  | { tag: "Activatable"; value: ActivatablePrerequisite_t }
  | { tag: "Increasable"; value: IncreasablePrerequisite_t }
  | { tag: "PrimaryAttribute"; value: PrimaryAttributePrerequisite_t }
  | { tag: "Sex"; value: SexPrerequisite_t }
  | { tag: "Race"; value: RacePrerequisite_t }
  | { tag: "Culture"; value: CulturePrerequisite_t }
  | { tag: "Pact"; value: PactPrerequisite_t }
  | { tag: "Social"; value: SocialPrerequisite_t };

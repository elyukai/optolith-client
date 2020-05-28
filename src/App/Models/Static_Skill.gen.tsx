/* TypeScript file generated from Static_Skill.re by genType. */
/* eslint-disable import/first */


import {activatable as Static_Prerequisites_activatable} from './Static_Prerequisites.gen';

import {list} from '../../../src/shims/ReasonPervasives.shim';

import {t as IC_t} from '../../../src/App/Utilities/IC.gen';

import {t as Ley_IntMap_t} from '../../../src/Data/Ley_IntMap.gen';

import {t as Static_Erratum_t} from './Static_Erratum.gen';

import {t as Static_SourceRef_t} from './Static_SourceRef.gen';

// tslint:disable-next-line:interface-over-type-literal
export type application = {
  readonly id: number; 
  readonly name: string; 
  readonly prerequisite?: Static_Prerequisites_activatable
};
export type Application = application;

// tslint:disable-next-line:interface-over-type-literal
export type use = {
  readonly id: number; 
  readonly name: string; 
  readonly prerequisite: Static_Prerequisites_activatable
};
export type Use = use;

// tslint:disable-next-line:interface-over-type-literal
export type encumbrance = 
    "True"
  | "False"
  | { tag: "Maybe"; value: (null | undefined | string) };
export type Encumbrance = encumbrance;

// tslint:disable-next-line:interface-over-type-literal
export type t = {
  readonly id: number; 
  readonly name: string; 
  readonly check: [number, number, number]; 
  readonly encumbrance: encumbrance; 
  readonly gr: number; 
  readonly ic: IC_t; 
  readonly applications: Ley_IntMap_t<application>; 
  readonly applicationsInput?: string; 
  readonly uses: Ley_IntMap_t<use>; 
  readonly tools?: string; 
  readonly quality: string; 
  readonly failed: string; 
  readonly critical: string; 
  readonly botch: string; 
  readonly src: list<Static_SourceRef_t>; 
  readonly errata: list<Static_Erratum_t>
};
export type Skill = t;

// tslint:disable-next-line:interface-over-type-literal
export type group = {
  readonly id: number; 
  readonly name: string; 
  readonly fullName: string
};
export type SkillGroup = group;

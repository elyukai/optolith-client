/* TypeScript file generated from Skill.re by genType. */
/* eslint-disable import/first */


import {ActivatablePrerequisite_t as Prerequisites_ActivatablePrerequisite_t} from './Prerequisites.gen';

import {list} from '../../../../src/shims/ReasonPervasives.shim';

import {t as Erratum_t} from './Erratum.gen';

import {t as IC_t} from '../../../../src/App/Utilities/IC.gen';

import {t as SourceRef_t} from './SourceRef.gen';

// tslint:disable-next-line:interface-over-type-literal
export type Application_t = {
  readonly id: number; 
  readonly name: string; 
  readonly prerequisite?: Prerequisites_ActivatablePrerequisite_t
};
export type Application = Application_t;

// tslint:disable-next-line:interface-over-type-literal
export type Use_t = {
  readonly id: number; 
  readonly name: string; 
  readonly prerequisite: Prerequisites_ActivatablePrerequisite_t
};
export type Use = Use_t;

// tslint:disable-next-line:interface-over-type-literal
export type encumbrance = "True" | "False" | "Maybe";

// tslint:disable-next-line:interface-over-type-literal
export type t = {
  readonly id: string; 
  readonly name: string; 
  readonly check: list<string>; 
  readonly encumbrance: encumbrance; 
  readonly encumbranceDescription?: string; 
  readonly gr: number; 
  readonly ic: IC_t; 
  readonly applications: list<Application_t>; 
  readonly applicationsInput?: string; 
  readonly uses: list<Use_t>; 
  readonly tools?: string; 
  readonly quality: string; 
  readonly failed: string; 
  readonly critical: string; 
  readonly botch: string; 
  readonly src: list<SourceRef_t>; 
  readonly errata: list<Erratum_t>
};
export type Skill = t;

/* TypeScript file generated from SelectOption.re by genType. */
/* eslint-disable import/first */


import {Application_t as Skill_Application_t} from './Skill.gen';

import {list} from '../../../../src/shims/ReasonPervasives.shim';

import {selectOptionId as Ids_selectOptionId} from '../../../../src/App/Constants/Ids.gen';

import {t as Erratum_t} from './Erratum.gen';

import {t as SourceRef_t} from './SourceRef.gen';

// tslint:disable-next-line:interface-over-type-literal
export type t = {
  readonly id: Ids_selectOptionId; 
  readonly name: string; 
  readonly cost?: number; 
  readonly prerequisites?: void; 
  readonly description?: string; 
  readonly isSecret?: boolean; 
  readonly languages?: list<number>; 
  readonly continent?: number; 
  readonly isExtinct?: boolean; 
  readonly specializations?: list<string>; 
  readonly specializationInput?: string; 
  readonly gr?: number; 
  readonly level?: number; 
  readonly target?: string; 
  readonly applications?: list<Skill_Application_t>; 
  readonly applicationInput?: string; 
  readonly src: list<SourceRef_t>; 
  readonly errata: list<Erratum_t>
};
export type SelectOption = t;

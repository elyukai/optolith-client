/* TypeScript file generated from Static_Condition.re by genType. */
/* eslint-disable import/first */


import {list} from '../../../src/shims/ReasonPervasives.shim';

import {t as Static_Erratum_t} from './Static_Erratum.gen';

import {t as Static_SourceRef_t} from './Static_SourceRef.gen';

// tslint:disable-next-line:interface-over-type-literal
export type t = {
  readonly id: number; 
  readonly name: string; 
  readonly description?: string; 
  readonly levelColumnDescription?: string; 
  readonly levelDescriptions: [string, string, string, string]; 
  readonly src: list<Static_SourceRef_t>; 
  readonly errata: list<Static_Erratum_t>
};
export type Condition = t;

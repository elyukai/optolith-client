/* TypeScript file generated from Static_Cantrip.re by genType. */
/* eslint-disable import/first */


import {activatable as Static_Prerequisites_activatable} from './Static_Prerequisites.gen';

import {list} from '../../../src/shims/ReasonPervasives.shim';

import {t as Ley_IntSet_t} from '../../../src/Data/Ley_IntSet.gen';

import {t as Static_Erratum_t} from './Static_Erratum.gen';

import {t as Static_SourceRef_t} from './Static_SourceRef.gen';

// tslint:disable-next-line:interface-over-type-literal
export type t = {
  readonly id: number; 
  readonly name: string; 
  readonly effect: string; 
  readonly range: string; 
  readonly duration: string; 
  readonly target: string; 
  readonly property: number; 
  readonly traditions: Ley_IntSet_t; 
  readonly activatablePrerequisites?: list<Static_Prerequisites_activatable>; 
  readonly src: list<Static_SourceRef_t>; 
  readonly errata: list<Static_Erratum_t>
};
export type Cantrip = t;

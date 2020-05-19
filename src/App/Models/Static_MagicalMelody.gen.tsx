/* TypeScript file generated from Static_MagicalMelody.re by genType. */
/* eslint-disable import/first */


import {IntMap_t as Ley_IntMap_t} from '../../../src/Data/Ley.gen';

import {IntSet_t as Ley_IntSet_t} from '../../../src/Data/Ley.gen';

import {list} from '../../../src/shims/ReasonPervasives.shim';

import {t as IC_t} from '../../../src/App/Utilities/IC.gen';

import {t as Static_Erratum_t} from './Static_Erratum.gen';

import {t as Static_SourceRef_t} from './Static_SourceRef.gen';

// tslint:disable-next-line:interface-over-type-literal
export type t = {
  readonly id: number; 
  readonly name: string; 
  readonly nameByTradition: Ley_IntMap_t<string>; 
  readonly check: [number, number, number]; 
  readonly effect: string; 
  readonly duration: string; 
  readonly durationShort: string; 
  readonly aeCost: string; 
  readonly aeCostShort: string; 
  readonly skill?: number; 
  readonly musictraditions: Ley_IntSet_t; 
  readonly property: number; 
  readonly ic: IC_t; 
  readonly src: list<Static_SourceRef_t>; 
  readonly errata: list<Static_Erratum_t>
};
export type MagicalMelody = t;

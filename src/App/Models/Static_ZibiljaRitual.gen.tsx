/* TypeScript file generated from Static_ZibiljaRitual.re by genType. */
/* eslint-disable import/first */


import {list} from '../../../src/shims/ReasonPervasives.shim';

import {t as CheckModifier_t} from './CheckModifier.gen';

import {t as IC_t} from '../../../src/App/Utilities/IC.gen';

import {t as Static_Erratum_t} from './Static_Erratum.gen';

import {t as Static_SourceRef_t} from './Static_SourceRef.gen';

// tslint:disable-next-line:interface-over-type-literal
export type t = {
  readonly id: number; 
  readonly name: string; 
  readonly check: [number, number, number]; 
  readonly checkMod?: CheckModifier_t; 
  readonly effect: string; 
  readonly ritualTime: string; 
  readonly ritualTimeShort: string; 
  readonly ritualTimeNoMod: boolean; 
  readonly aeCost: string; 
  readonly aeCostShort: string; 
  readonly aeCostNoMod: boolean; 
  readonly range: string; 
  readonly rangeShort: string; 
  readonly rangeNoMod: boolean; 
  readonly duration: string; 
  readonly durationShort: string; 
  readonly durationNoMod: boolean; 
  readonly target: string; 
  readonly property: number; 
  readonly ic: IC_t; 
  readonly src: list<Static_SourceRef_t>; 
  readonly errata: list<Static_Erratum_t>
};
export type ZibiljaRitual = t;

/* TypeScript file generated from Static_Spell.re by genType. */
/* eslint-disable import/first */


import {activatable as Static_Prerequisites_activatable} from './Static_Prerequisites.gen';

import {increasable as Static_Prerequisites_increasable} from './Static_Prerequisites.gen';

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
  readonly castingTime: string; 
  readonly castingTimeShort: string; 
  readonly castingTimeNoMod: boolean; 
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
  readonly traditions: list<number>; 
  readonly ic: IC_t; 
  readonly activatablePrerequisites?: list<Static_Prerequisites_activatable>; 
  readonly increasablePrerequisites?: list<Static_Prerequisites_increasable>; 
  readonly gr: number; 
  readonly src: list<Static_SourceRef_t>; 
  readonly errata: list<Static_Erratum_t>
};
export type Spell = t;

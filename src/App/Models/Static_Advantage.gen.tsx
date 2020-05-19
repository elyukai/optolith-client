/* TypeScript file generated from Static_Advantage.re by genType. */
/* eslint-disable import/first */


import {list} from '../../../src/shims/ReasonPervasives.shim';

import {map as Static_SelectOption_map} from './Static_SelectOption.gen';

import {tIndexWithLevel as Static_Prerequisites_tIndexWithLevel} from './Static_Prerequisites.gen';

import {tWithLevelDisAdv as Static_Prerequisites_tWithLevelDisAdv} from './Static_Prerequisites.gen';

import {t as Static_Erratum_t} from './Static_Erratum.gen';

import {t as Static_SourceRef_t} from './Static_SourceRef.gen';

// tslint:disable-next-line:interface-over-type-literal
export type cost = 
    { tag: "Flat"; value: number }
  | { tag: "PerLevel"; value: list<number> };
export type ApValue = cost;

// tslint:disable-next-line:interface-over-type-literal
export type t = {
  readonly id: number; 
  readonly name: string; 
  readonly nameInWiki?: string; 
  readonly noMaxAPInfluence: boolean; 
  readonly isExclusiveToArcaneSpellworks: boolean; 
  readonly levels?: number; 
  readonly max?: number; 
  readonly rules: string; 
  readonly selectOptions: Static_SelectOption_map; 
  readonly input?: string; 
  readonly range?: string; 
  readonly actions?: string; 
  readonly prerequisites: Static_Prerequisites_tWithLevelDisAdv; 
  readonly prerequisitesText?: string; 
  readonly prerequisitesTextIndex: Static_Prerequisites_tIndexWithLevel; 
  readonly prerequisitesTextStart?: string; 
  readonly prerequisitesTextEnd?: string; 
  readonly apValue?: cost; 
  readonly apValueText?: string; 
  readonly apValueTextAppend?: string; 
  readonly gr: number; 
  readonly src: list<Static_SourceRef_t>; 
  readonly errata: list<Static_Erratum_t>
};
export type Advantage = t;

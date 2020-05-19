/* TypeScript file generated from Static_SpecialAbility.re by genType. */
/* eslint-disable import/first */


import {cost as Static_Advantage_cost} from './Static_Advantage.gen';

import {list} from '../../../src/shims/ReasonPervasives.shim';

import {map as Static_SelectOption_map} from './Static_SelectOption.gen';

import {oneOrMany as GenericHelpers_oneOrMany} from '../../../src/App/Utilities/GenericHelpers.gen';

import {tIndexWithLevel as Static_Prerequisites_tIndexWithLevel} from './Static_Prerequisites.gen';

import {tWithLevel as Static_Prerequisites_tWithLevel} from './Static_Prerequisites.gen';

import {t as Static_Erratum_t} from './Static_Erratum.gen';

import {t as Static_SourceRef_t} from './Static_SourceRef.gen';

// tslint:disable-next-line:interface-over-type-literal
export type combatTechniques = 
    "All"
  | "Melee"
  | "Ranged"
  | "MeleeWithParry"
  | "OneHandedMelee"
  | { tag: "List"; value: list<number> };
export type ApplicableCombatTechniques = combatTechniques;

// tslint:disable-next-line:interface-over-type-literal
export type t = {
  readonly id: number; 
  readonly name: string; 
  readonly nameInWiki?: string; 
  readonly levels?: number; 
  readonly max?: number; 
  readonly rules?: string; 
  readonly effect?: string; 
  readonly selectOptions: Static_SelectOption_map; 
  readonly input?: string; 
  readonly penalty?: string; 
  readonly combatTechniques?: combatTechniques; 
  readonly combatTechniquesText?: string; 
  readonly aeCost?: string; 
  readonly protectiveCircle?: string; 
  readonly wardingCircle?: string; 
  readonly volume?: string; 
  readonly bindingCost?: string; 
  readonly property?: number; 
  readonly propertyText?: string; 
  readonly aspect?: number; 
  readonly brew?: number; 
  readonly extended?: list<GenericHelpers_oneOrMany<number>>; 
  readonly prerequisites: Static_Prerequisites_tWithLevel; 
  readonly prerequisitesText?: string; 
  readonly prerequisitesTextIndex: Static_Prerequisites_tIndexWithLevel; 
  readonly prerequisitesTextStart?: string; 
  readonly prerequisitesTextEnd?: string; 
  readonly apValue?: Static_Advantage_cost; 
  readonly apValueText?: string; 
  readonly apValueTextAppend?: string; 
  readonly gr: number; 
  readonly subgr?: number; 
  readonly src: list<Static_SourceRef_t>; 
  readonly errata: list<Static_Erratum_t>
};
export type SpecialAbilities = t;

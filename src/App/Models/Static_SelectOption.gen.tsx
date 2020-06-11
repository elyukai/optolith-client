/* TypeScript file generated from Static_SelectOption.re by genType. */
/* eslint-disable import/first */


import {list} from '../../../src/shims/ReasonPervasives.shim';

import {selectOptionId as Ids_selectOptionId} from '../../../src/App/Constants/Ids.gen';

import {t as Static_Blessing_t} from './Static_Blessing.gen';

import {t as Static_Cantrip_t} from './Static_Cantrip.gen';

import {t as Static_CombatTechnique_t} from './Static_CombatTechnique.gen';

import {t as Static_Erratum_t} from './Static_Erratum.gen';

import {t as Static_LiturgicalChant_t} from './Static_LiturgicalChant.gen';

import {t as Static_Prerequisites_t} from './Static_Prerequisites.gen';

import {t as Static_Skill_t} from './Static_Skill.gen';

import {t as Static_SourceRef_t} from './Static_SourceRef.gen';

import {t as Static_Spell_t} from './Static_Spell.gen';

// tslint:disable-next-line:interface-over-type-literal
export type wikiEntry = 
    { tag: "Blessing"; value: Static_Blessing_t }
  | { tag: "Cantrip"; value: Static_Cantrip_t }
  | { tag: "CombatTechnique"; value: Static_CombatTechnique_t }
  | { tag: "LiturgicalChant"; value: Static_LiturgicalChant_t }
  | { tag: "Skill"; value: Static_Skill_t }
  | { tag: "Spell"; value: Static_Spell_t };
export type SelectOptionStaticEntry = wikiEntry;

// tslint:disable-next-line:interface-over-type-literal
export type t = {
  readonly id: Ids_selectOptionId; 
  readonly name: string; 
  readonly cost?: number; 
  readonly prerequisites: Static_Prerequisites_t; 
  readonly description?: string; 
  readonly isSecret?: boolean; 
  readonly languages?: list<number>; 
  readonly continent?: number; 
  readonly isExtinct?: boolean; 
  readonly specializations?: list<string>; 
  readonly specializationInput?: string; 
  readonly animalGr?: number; 
  readonly animalLevel?: number; 
  readonly enhancementTarget?: number; 
  readonly enhancementLevel?: number; 
  readonly wikiEntry?: wikiEntry; 
  readonly src: list<Static_SourceRef_t>; 
  readonly errata: list<Static_Erratum_t>
};
export type SelectOption = t;

// tslint:disable-next-line:interface-over-type-literal
export type Ord_t = Ids_selectOptionId;

// tslint:disable-next-line:interface-over-type-literal
export type SelectOptionMap_key = Ord_t;

// tslint:disable-next-line:interface-over-type-literal
export type SelectOptionMap_t<a> = __Papply_unsupported_genType___t<a>;

// tslint:disable-next-line:interface-over-type-literal
export type map = SelectOptionMap_t<t>;
export type SelectOptionMap = map;

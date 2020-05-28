/* TypeScript file generated from Static_Culture.re by genType. */
/* eslint-disable import/first */


import {list} from '../../../src/shims/ReasonPervasives.shim';

import {t as Ley_IntMap_t} from '../../../src/Data/Ley_IntMap.gen';

// tslint:disable-next-line:interface-over-type-literal
export type frequencyException = 
    { tag: "Single"; value: number }
  | { tag: "Group"; value: number };
export type FrequencyException = frequencyException;

// tslint:disable-next-line:interface-over-type-literal
export type t = {
  readonly id: number; 
  readonly name: string; 
  readonly language: list<number>; 
  readonly script?: list<number>; 
  readonly areaKnowledge: string; 
  readonly areaKnowledgeShort: string; 
  readonly socialStatus: list<number>; 
  readonly commonMundaneProfessionsAll: boolean; 
  readonly commonMundaneProfessionsExceptions?: list<frequencyException>; 
  readonly commonMundaneProfessionsText?: string; 
  readonly commonMagicProfessionsAll: boolean; 
  readonly commonMagicProfessionsExceptions?: list<frequencyException>; 
  readonly commonMagicProfessionsText?: string; 
  readonly commonBlessedProfessionsAll: boolean; 
  readonly commonBlessedProfessionsExceptions?: list<frequencyException>; 
  readonly commonBlessedProfessionsText?: string; 
  readonly commonAdvantages?: list<number>; 
  readonly commonAdvantagesText?: string; 
  readonly commonDisadvantages?: list<number>; 
  readonly commonDisadvantagesText?: string; 
  readonly uncommonAdvantages?: list<number>; 
  readonly uncommonAdvantagesText?: string; 
  readonly uncommonDisadvantages?: list<number>; 
  readonly uncommonDisadvantagesText?: string; 
  readonly commonSkills: list<number>; 
  readonly uncommonSkills?: list<number>; 
  readonly commonNames: string; 
  readonly culturalPackageCost: number; 
  readonly culturalPackageSkills: Ley_IntMap_t<number>
};
export type Culture = t;

/* TypeScript file generated from Static_Race.re by genType. */
/* eslint-disable import/first */


import {list} from '../../../src/shims/ReasonPervasives.shim';

import {t as Dice_t} from '../../../src/App/Utilities/Dice.gen';

import {t as Ley_IntMap_t} from '../../../src/Data/Ley_IntMap.gen';

import {t as Ley_IntSet_t} from '../../../src/Data/Ley_IntSet.gen';

import {t as Static_Erratum_t} from './Static_Erratum.gen';

import {t as Static_SourceRef_t} from './Static_SourceRef.gen';

// tslint:disable-next-line:interface-over-type-literal
export type variant = {
  readonly id: number; 
  readonly name: string; 
  readonly commonCultures: Ley_IntSet_t; 
  readonly commonAdvantages: list<number>; 
  readonly commonAdvantagesText?: string; 
  readonly commonDisadvantages: list<number>; 
  readonly commonDisadvantagesText?: string; 
  readonly uncommonAdvantages: list<number>; 
  readonly uncommonAdvantagesText?: string; 
  readonly uncommonDisadvantages: list<number>; 
  readonly uncommonDisadvantagesText?: string; 
  readonly hairColors: list<number>; 
  readonly eyeColors: list<number>; 
  readonly sizeBase: number; 
  readonly sizeRandom: list<Dice_t>
};
export type RaceVariant = variant;

// tslint:disable-next-line:interface-over-type-literal
export type withVariants = { readonly variants: Ley_IntMap_t<variant> };
export type RaceWithVariantsOptions = withVariants;

// tslint:disable-next-line:interface-over-type-literal
export type withoutVariants = {
  readonly commonCultures: Ley_IntSet_t; 
  readonly hairColors: list<number>; 
  readonly eyeColors: list<number>; 
  readonly sizeBase: number; 
  readonly sizeRandom: list<Dice_t>
};
export type RaceWithoutVariantsOptions = withoutVariants;

// tslint:disable-next-line:interface-over-type-literal
export type variantOptions = 
    { tag: "WithVariants"; value: withVariants }
  | { tag: "WithoutVariants"; value: withoutVariants };
export type RaceVariantOptions = variantOptions;

// tslint:disable-next-line:interface-over-type-literal
export type t = {
  readonly id: number; 
  readonly name: string; 
  readonly cost: number; 
  readonly lp: number; 
  readonly spi: number; 
  readonly tou: number; 
  readonly mov: number; 
  readonly attributeAdjustments: Ley_IntMap_t<number>; 
  readonly attributeAdjustmentsSelectionValue: number; 
  readonly attributeAdjustmentsSelectionList: Ley_IntSet_t; 
  readonly attributeAdjustmentsText: string; 
  readonly automaticAdvantages: list<number>; 
  readonly automaticAdvantagesText?: string; 
  readonly stronglyRecommendedAdvantages: list<number>; 
  readonly stronglyRecommendedAdvantagesText?: string; 
  readonly stronglyRecommendedDisadvantages: list<number>; 
  readonly stronglyRecommendedDisadvantagesText?: string; 
  readonly commonAdvantages: list<number>; 
  readonly commonAdvantagesText?: string; 
  readonly commonDisadvantages: list<number>; 
  readonly commonDisadvantagesText?: string; 
  readonly uncommonAdvantages: list<number>; 
  readonly uncommonAdvantagesText?: string; 
  readonly uncommonDisadvantages: list<number>; 
  readonly uncommonDisadvantagesText?: string; 
  readonly weightBase: number; 
  readonly weightRandom: list<Dice_t>; 
  readonly variantOptions: variantOptions; 
  readonly src: list<Static_SourceRef_t>; 
  readonly errata: list<Static_Erratum_t>
};
export type Race = t;

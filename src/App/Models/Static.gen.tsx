/* TypeScript file generated from Static.re by genType. */
/* eslint-disable import/first */


import {t as IntMap_t} from '../../../src/Data/IntMap.gen';

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_overridePrerequisite = 
    "Hide"
  | { tag: "ReplaceWith"; value: string };
export type OverridePrerequisite = Prerequisites_overridePrerequisite;

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_tIndex = {
  readonly sex?: Prerequisites_overridePrerequisite; 
  readonly race?: Prerequisites_overridePrerequisite; 
  readonly culture?: Prerequisites_overridePrerequisite; 
  readonly pact?: Prerequisites_overridePrerequisite; 
  readonly social?: Prerequisites_overridePrerequisite; 
  readonly primaryAttribute?: Prerequisites_overridePrerequisite; 
  readonly activatable: IntMap_t<Prerequisites_overridePrerequisite>; 
  readonly activatableMultiEntry: IntMap_t<Prerequisites_overridePrerequisite>; 
  readonly activatableMultiSelect: IntMap_t<Prerequisites_overridePrerequisite>; 
  readonly increasable: IntMap_t<Prerequisites_overridePrerequisite>; 
  readonly increasableMultiEntry: IntMap_t<Prerequisites_overridePrerequisite>
};

// tslint:disable-next-line:interface-over-type-literal
export type Prerequisites_tIndexWithLevel = {
  readonly sex?: Prerequisites_overridePrerequisite; 
  readonly race?: Prerequisites_overridePrerequisite; 
  readonly culture?: Prerequisites_overridePrerequisite; 
  readonly pact?: Prerequisites_overridePrerequisite; 
  readonly social?: Prerequisites_overridePrerequisite; 
  readonly primaryAttribute?: Prerequisites_overridePrerequisite; 
  readonly activatable: IntMap_t<Prerequisites_overridePrerequisite>; 
  readonly activatableMultiEntry: IntMap_t<Prerequisites_overridePrerequisite>; 
  readonly activatableMultiSelect: IntMap_t<Prerequisites_overridePrerequisite>; 
  readonly increasable: IntMap_t<Prerequisites_overridePrerequisite>; 
  readonly increasableMultiEntry: IntMap_t<Prerequisites_overridePrerequisite>; 
  readonly levels: IntMap_t<Prerequisites_tIndex>
};

// tslint:disable-next-line:interface-over-type-literal
export type Patron_Category_t = {
  readonly id: number; 
  readonly name: string; 
  readonly primaryPatronCultures: number[]
};
export type PatronCategory = Patron_Category_t;

// tslint:disable-next-line:interface-over-type-literal
export type Patron_t = {
  readonly id: number; 
  readonly name: string; 
  readonly category: number; 
  readonly skills: [number, number, number]; 
  readonly limitedToCultures: number[]; 
  readonly isLimitedToCulturesReverse?: boolean
};
export type Patron = Patron_t;

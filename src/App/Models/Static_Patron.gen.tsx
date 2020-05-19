/* TypeScript file generated from Static_Patron.re by genType. */
/* eslint-disable import/first */


import {list} from '../../../src/shims/ReasonPervasives.shim';

// tslint:disable-next-line:interface-over-type-literal
export type category = {
  readonly id: number; 
  readonly name: string; 
  readonly primaryPatronCultures: list<number>
};
export type PatronCategory = category;

// tslint:disable-next-line:interface-over-type-literal
export type t = {
  readonly id: number; 
  readonly name: string; 
  readonly category: number; 
  readonly skills: [number, number, number]; 
  readonly limitedToCultures: list<number>; 
  readonly isLimitedToCulturesReverse: boolean
};
export type Patron = t;

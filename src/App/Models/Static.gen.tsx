/* TypeScript file generated from Static.re by genType. */
/* eslint-disable import/first */


import {t as Maybe_t} from '../../../src/Data/Maybe.gen';

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
  readonly isLimitedToCulturesReverse: Maybe_t<boolean>
};
export type Patron = Patron_t;

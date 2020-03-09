/* TypeScript file generated from Patron.re by genType. */
/* eslint-disable import/first */


// tslint:disable-next-line:interface-over-type-literal
export type Category_t = {
  readonly id: number; 
  readonly name: string; 
  readonly primaryPatronCultures: number[]
};
export type PatronCategory = Category_t;

// tslint:disable-next-line:interface-over-type-literal
export type t = {
  readonly id: number; 
  readonly name: string; 
  readonly category: number; 
  readonly skills: [number, number, number]; 
  readonly limitedToCultures: number[]; 
  readonly isLimitedToCulturesReverse?: boolean
};
export type Patron = t;

/* TypeScript file generated from Either.re by genType. */
/* eslint-disable import/first */


// tslint:disable-next-line:interface-over-type-literal
export type t<l,r> = 
    { tag: "Left"; value: l }
  | { tag: "Right"; value: r };
export type Either<l,r> = t<l,r>;

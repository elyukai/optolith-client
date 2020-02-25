/* TypeScript file generated from SourceRef.re by genType. */
/* eslint-disable import/first */


// tslint:disable-next-line:interface-over-type-literal
export type pages = 
    { tag: "Page"; value: number }
  | { tag: "Pages"; value: [number, number] };

// tslint:disable-next-line:interface-over-type-literal
export type t = { readonly id: string; readonly page: pages };

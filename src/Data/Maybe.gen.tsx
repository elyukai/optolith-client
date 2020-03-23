/* TypeScript file generated from Maybe.rei by genType. */
/* eslint-disable import/first */


// tslint:disable-next-line:interface-over-type-literal
export type t<a> = "Nothing" | { tag: "Just"; value: a };
export type Maybe<a> = t<a>;

// tslint:disable-next-line:interface-over-type-literal
export type maybe<a> = t<a>;
export type Maybe_<a> = maybe<a>;

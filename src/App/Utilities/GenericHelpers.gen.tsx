/* TypeScript file generated from GenericHelpers.re by genType. */
/* eslint-disable import/first */


import {list} from '../../../src/shims/ReasonPervasives.shim';

// tslint:disable-next-line:interface-over-type-literal
export type oneOrMany<a> = 
    { tag: "One"; value: a }
  | { tag: "Many"; value: list<a> };
export type OneOrMany<a> = oneOrMany<a>;

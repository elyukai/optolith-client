/* TypeScript file generated from IC.re by genType. */
/* eslint-disable import/first */


const $$toRE998253360: { [key: string]: any } = {"A": 0, "B": 1, "C": 2, "D": 3, "E": 4};

// tslint:disable-next-line:no-var-requires
const Curry = require('bs-platform/lib/js/curry.js');

// tslint:disable-next-line:no-var-requires
const ICBS = require('./IC.bs');

// tslint:disable-next-line:interface-over-type-literal
export type t = "A" | "B" | "C" | "D" | "E";

/** 
 * `getAPRange ic fromSR toSR` returns the AP cost for the given SR range.
  */
export const getAPForRange: (ic:t, fromSR:number, toSR:number) => number = function (Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(ICBS.getAPForRange, $$toRE998253360[Arg1], Arg2, Arg3);
  return result
};

export const getAPForInc: (ic:t, fromSR:number) => number = function (Arg1: any, Arg2: any) {
  const result = Curry._2(ICBS.getAPForInc, $$toRE998253360[Arg1], Arg2);
  return result
};

export const getAPForDec: (ic:t, fromSR:number) => number = function (Arg1: any, Arg2: any) {
  const result = Curry._2(ICBS.getAPForDec, $$toRE998253360[Arg1], Arg2);
  return result
};

export const getAPForActivatation: (_1:t) => number = function (Arg1: any) {
  const result = ICBS.getAPForActivatation($$toRE998253360[Arg1]);
  return result
};

/** 
 * Returns the name of the passed Improvement Cost.
  */
export const icToStr: (ic:t) => string = function (Arg1: any) {
  const result = ICBS.icToStr($$toRE998253360[Arg1]);
  return result
};

/** 
 * Returns an index used for getting the IC-based cost for an Activatable entry.
  */
export const icToIx: (ic:t) => number = function (Arg1: any) {
  const result = ICBS.icToIx($$toRE998253360[Arg1]);
  return result
};

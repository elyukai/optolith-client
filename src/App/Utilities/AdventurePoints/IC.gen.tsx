/* TypeScript file generated from IC.re by genType. */
/* eslint-disable import/first */


const $$toJS998253360: { [key: string]: any } = {"0": "A", "1": "B", "2": "C", "3": "D", "4": "E"};

const $$toRE998253360: { [key: string]: any } = {"A": 0, "B": 1, "C": 2, "D": 3, "E": 4};

// tslint:disable-next-line:no-var-requires
const Curry = require('bs-platform/lib/es6/curry.js');

// tslint:disable-next-line:no-var-requires
const ICBS = require('./IC.bs');

// tslint:disable-next-line:interface-over-type-literal
export type ic = "A" | "B" | "C" | "D" | "E";

/** 
 * `getAPRange ic fromSR toSR` returns the AP cost for the given SR range.
  */
export const getAPForRange: (ic:ic, fromSR:number, toSR:number) => number = function (Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(ICBS.getAPForRange, $$toRE998253360[Arg1], Arg2, Arg3);
  return result
};

export const intToIc: (ic:number) => (null | undefined | ic) = function (Arg1: any) {
  const result = ICBS.intToIc(Arg1);
  return (result == null ? result : $$toJS998253360[result])
};

export const icToStr: (ic:ic) => string = function (Arg1: any) {
  const result = ICBS.icToStr($$toRE998253360[Arg1]);
  return result
};

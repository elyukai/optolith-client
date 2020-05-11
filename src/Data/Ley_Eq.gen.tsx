/* TypeScript file generated from Ley_Eq.re by genType. */
/* eslint-disable import/first */


// tslint:disable-next-line:no-var-requires
const Curry = require('bs-platform/lib/js/curry.js');

// tslint:disable-next-line:no-var-requires
const Ley_EqBS = require('./Ley_Eq.bs');

export const equals: <T1>(_1:T1, _2:T1) => boolean = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_EqBS.equals, Arg1, Arg2);
  return result
};

export const notEquals: <T1>(_1:T1, _2:T1) => boolean = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_EqBS.notEquals, Arg1, Arg2);
  return result
};

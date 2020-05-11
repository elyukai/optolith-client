/* TypeScript file generated from IO.rei by genType. */
/* eslint-disable import/first */


// tslint:disable-next-line:no-var-requires
const Curry = require('bs-platform/lib/js/curry.js');

// tslint:disable-next-line:no-var-requires
const IOBS = require('./IO.bs');

export const Functor_fmap: <T1,T2>(_1:((_1:T1) => T2), _2:Promise<T1>) => Promise<T2> = function <T1,T2>(Arg1: any, Arg2: any) {
  const result = Curry._2(IOBS.Functor.fmap, Arg1, Arg2);
  return result
};

export const Functor_fmapF: <T1,T2>(_1:Promise<T1>, _2:((_1:T1) => T2)) => Promise<T2> = function <T1,T2>(Arg1: any, Arg2: any) {
  const result = Curry._2(IOBS.Functor.fmapF, Arg1, Arg2);
  return result
};

export const Functor: { fmapF: <T1,T2>(_1:Promise<T1>, _2:((_1:T1) => T2)) => Promise<T2>; fmap: <T1,T2>(_1:((_1:T1) => T2), _2:Promise<T1>) => Promise<T2> } = IOBS.Functor

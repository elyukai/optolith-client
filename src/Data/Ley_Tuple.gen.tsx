/* TypeScript file generated from Ley_Tuple.re by genType. */
/* eslint-disable import/first */


// tslint:disable-next-line:no-var-requires
const Curry = require('bs-platform/lib/js/curry.js');

// tslint:disable-next-line:no-var-requires
const Ley_TupleBS = require('./Ley_Tuple.bs');

export const Bifunctor_bimap: <T1,T2,T3,T4>(f:((_1:T1) => T2), g:((_1:T3) => T4), param:[T1, T3]) => [T2, T4] = function <T1,T2,T3,T4>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_TupleBS.Bifunctor.bimap, Arg1, Arg2, Arg3);
  return result
};

export const Bifunctor_first: <T1,T2,T3>(f:((_1:T1) => T2), param:[T1, T3]) => [T2, T3] = function <T1,T2,T3>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_TupleBS.Bifunctor.first, Arg1, Arg2);
  return result
};

export const Bifunctor_second: <T1,T2,T3>(f:((_1:T1) => T2), param:[T3, T1]) => [T3, T2] = function <T1,T2,T3>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_TupleBS.Bifunctor.second, Arg1, Arg2);
  return result
};

/** 
 * Extract the first component of a pair.
  */
export const fst: <T1,T2>(param:[T1, T2]) => T1 = Ley_TupleBS.fst;

/** 
 * Extract the second component of a pair.
  */
export const snd: <T1,T2>(param:[T1, T2]) => T2 = Ley_TupleBS.snd;

/** 
 * Swap the components of a pair.
  */
export const swap: <T1,T2>(param:[T1, T2]) => [T2, T1] = Ley_TupleBS.swap;

export const Bifunctor: {
  first: <T1,T2,T3>(f:((_1:T1) => T2), param:[T1, T3]) => [T2, T3]; 
  second: <T1,T2,T3>(f:((_1:T1) => T2), param:[T3, T1]) => [T3, T2]; 
  bimap: <T1,T2,T3,T4>(f:((_1:T1) => T2), g:((_1:T3) => T4), param:[T1, T3]) => [T2, T4]
} = Ley_TupleBS.Bifunctor

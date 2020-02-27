/* TypeScript file generated from Ix.re by genType. */
/* eslint-disable import/first */


// tslint:disable-next-line:no-var-requires
const Curry = require('bs-platform/lib/es6/curry.js');

// tslint:disable-next-line:no-var-requires
const IxBS = require('./Ix.bs');

import {list} from '../../src/shims/ReasonPervasives.shim';

/** 
 * The list of values in the subrange defined by a bounding pair.
 *
 * The first argument `(l,u)` is a pair specifying the lower and upper bounds of
 * a contiguous subrange of values.
  */
export const range: (param:[number, number]) => list<number> = IxBS.range;

/** 
 * Returns `True` the given subscript lies in the range defined the bounding
 * pair.
 *
 * The first argument `(l,u)` is a pair specifying the lower and upper bounds of
 * a contiguous subrange of values.
  */
export const inRange: <T1>(param:[T1, T1], x:T1) => boolean = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(IxBS.inRange, Arg1, Arg2);
  return result
};

/** 
 * The position of a subscript in the subrange.
 *
 * The first argument `(l,u)` is a pair specifying the lower and upper bounds of
 * a contiguous subrange of values.
 *
 * @raise [Invalid_argument] if index out of range.
  */
export const index: (p:[number, number], x:number) => number = function (Arg1: any, Arg2: any) {
  const result = Curry._2(IxBS.index, Arg1, Arg2);
  return result
};

/** 
 * The size of the subrange defined by a bounding pair.
 *
 * The first argument `(l,u)` is a pair specifying the lower and upper bounds of
 * a contiguous subrange of values.
  */
export const rangeSize: (param:[number, number]) => number = IxBS.rangeSize;

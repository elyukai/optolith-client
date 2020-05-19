/* TypeScript file generated from Ley_Ix.re by genType. */
/* eslint-disable import/first */


// tslint:disable-next-line:no-var-requires
const Curry = require('bs-platform/lib/es6/curry.js');

// tslint:disable-next-line:no-var-requires
const Ley_IxBS = require('./Ley_Ix.bs');

import {list} from '../../src/shims/ReasonPervasives.shim';

/** 
 * The list of values in the subrange defined by a bounding pair.
 *
 * The first argument `(l,u)` is a pair specifying the lower and upper bounds of
 * a contiguous subrange of values.
  */
export const range: (param:[number, number]) => list<number> = Ley_IxBS.range;

/** 
 * Returns `True` the given subscript lies in the range defined the bounding
 * pair.
 *
 * The first argument `(l,u)` is a pair specifying the lower and upper bounds of
 * a contiguous subrange of values.
  */
export const inRange: (param:[number, number], x:number) => boolean = function (Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_IxBS.inRange, Arg1, Arg2);
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
  const result = Curry._2(Ley_IxBS.index, Arg1, Arg2);
  return result
};

/** 
 * The size of the subrange defined by a bounding pair.
 *
 * The first argument `(l,u)` is a pair specifying the lower and upper bounds of
 * a contiguous subrange of values.
  */
export const rangeSize: (param:[number, number]) => number = Ley_IxBS.rangeSize;

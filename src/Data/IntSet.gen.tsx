/* TypeScript file generated from IntSet.rei by genType. */
/* eslint-disable import/first */


const $$toJS1024164449: { [key: string]: any } = {"0": "Nothing"};

// tslint:disable-next-line:no-var-requires
const Curry = require('bs-platform/lib/js/curry.js');

// tslint:disable-next-line:no-var-requires
const IntSetBS = require('./IntSet.bs');

import {list} from '../../src/shims/ReasonPervasives.shim';

import {t as $$t} from '../shims/IntSet.shim';

import {t as Maybe_t} from './Maybe.gen';

// tslint:disable-next-line:interface-over-type-literal
export type key = number;

// tslint:disable-next-line:interface-over-type-literal
export type t = $$t;

// tslint:disable-next-line:interface-over-type-literal
export type intset = t;
export type IntSet = intset;

export const Foldable_foldr: <a>(_1:((_1:key, _2:a) => a), _2:a, _3:t) => a = function <a>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(IntSetBS.Foldable.foldr, Arg1, Arg2, Arg3);
  return result
};

export const Foldable_foldl: <a>(_1:((_1:a, _2:key) => a), _2:a, _3:t) => a = function <a>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(IntSetBS.Foldable.foldl, Arg1, Arg2, Arg3);
  return result
};

export const Foldable_toList: (_1:t) => list<key> = IntSetBS.Foldable.toList;

export const Foldable_null: (_1:t) => boolean = IntSetBS.Foldable.null;

export const Foldable_length: (_1:t) => number = IntSetBS.Foldable.length;

export const Foldable_elem: (_1:key, _2:t) => boolean = function (Arg1: any, Arg2: any) {
  const result = Curry._2(IntSetBS.Foldable.elem, Arg1, Arg2);
  return result
};

export const Foldable_sum: (_1:t) => number = IntSetBS.Foldable.sum;

export const Foldable_product: (_1:t) => number = IntSetBS.Foldable.product;

export const Foldable_maximum: (_1:t) => number = IntSetBS.Foldable.maximum;

export const Foldable_minimum: (_1:t) => number = IntSetBS.Foldable.minimum;

export const Foldable_concatMap: (_1:((_1:key) => t), _2:t) => t = function (Arg1: any, Arg2: any) {
  const result = Curry._2(IntSetBS.Foldable.concatMap, Arg1, Arg2);
  return result
};

export const Foldable_any: (_1:((_1:key) => boolean), _2:t) => boolean = function (Arg1: any, Arg2: any) {
  const result = Curry._2(IntSetBS.Foldable.any, Arg1, Arg2);
  return result
};

export const Foldable_all: (_1:((_1:key) => boolean), _2:t) => boolean = function (Arg1: any, Arg2: any) {
  const result = Curry._2(IntSetBS.Foldable.all, Arg1, Arg2);
  return result
};

export const Foldable_notElem: (_1:key, _2:t) => boolean = function (Arg1: any, Arg2: any) {
  const result = Curry._2(IntSetBS.Foldable.notElem, Arg1, Arg2);
  return result
};

export const Foldable_find: (_1:((_1:key) => boolean), _2:t) => Maybe_t<key> = function (Arg1: any, Arg2: any) {
  const result = Curry._2(IntSetBS.Foldable.find, Arg1, Arg2);
  return typeof(result) === 'object'
    ? {tag:"Just", value:result[0]}
    : $$toJS1024164449[result]
};

export const empty: t = IntSetBS.empty;

export const singleton: (_1:key) => t = IntSetBS.singleton;

export const fromList: (_1:list<key>) => t = IntSetBS.fromList;

export const insert: (_1:key, _2:t) => t = function (Arg1: any, Arg2: any) {
  const result = Curry._2(IntSetBS.insert, Arg1, Arg2);
  return result
};

export const sdelete: (_1:key, _2:t) => t = function (Arg1: any, Arg2: any) {
  const result = Curry._2(IntSetBS.delete, Arg1, Arg2);
  return result
};

export const toggle: (_1:key, _2:t) => t = function (Arg1: any, Arg2: any) {
  const result = Curry._2(IntSetBS.toggle, Arg1, Arg2);
  return result
};

export const member: (_1:key, _2:t) => boolean = function (Arg1: any, Arg2: any) {
  const result = Curry._2(IntSetBS.member, Arg1, Arg2);
  return result
};

export const notMember: (_1:key, _2:t) => boolean = function (Arg1: any, Arg2: any) {
  const result = Curry._2(IntSetBS.notMember, Arg1, Arg2);
  return result
};

export const size: (_1:t) => number = IntSetBS.size;

/** 
 * Excludes the items from both sets.
  */
export const union: (_1:t, _2:t) => t = function (Arg1: any, Arg2: any) {
  const result = Curry._2(IntSetBS.union, Arg1, Arg2);
  return result
};

/** 
 * Excludes the items in the second set from the first.
  */
export const difference: (_1:t, _2:t) => t = function (Arg1: any, Arg2: any) {
  const result = Curry._2(IntSetBS.difference, Arg1, Arg2);
  return result
};

export const filter: (_1:((_1:key) => boolean), _2:t) => t = function (Arg1: any, Arg2: any) {
  const result = Curry._2(IntSetBS.filter, Arg1, Arg2);
  return result
};

export const map: (_1:((_1:key) => key), _2:t) => t = function (Arg1: any, Arg2: any) {
  const result = Curry._2(IntSetBS.map, Arg1, Arg2);
  return result
};

export const elems: (_1:t) => list<key> = IntSetBS.elems;

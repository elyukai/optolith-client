/* TypeScript file generated from Ley_StrSet.rei by genType. */
/* eslint-disable import/first */


// tslint:disable-next-line:no-var-requires
const Curry = require('bs-platform/lib/js/curry.js');

// tslint:disable-next-line:no-var-requires
const Ley_StrSetBS = require('./Ley_StrSet.bs');

import {list} from '../../src/shims/ReasonPervasives.shim';

import {t as $$t} from '../shims/StrSet.shim';

// tslint:disable-next-line:interface-over-type-literal
export type key = string;

// tslint:disable-next-line:interface-over-type-literal
export type t = $$t;

// tslint:disable-next-line:interface-over-type-literal
export type strset = t;
export type StrSet = strset;

export const Foldable_foldr: <a>(_1:((_1:key, _2:a) => a), _2:a, _3:t) => a = function <a>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_StrSetBS.Foldable.foldr, Arg1, Arg2, Arg3);
  return result
};

export const Foldable_foldl: <a>(_1:((_1:a, _2:key) => a), _2:a, _3:t) => a = function <a>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_StrSetBS.Foldable.foldl, Arg1, Arg2, Arg3);
  return result
};

export const Foldable_toList: (_1:t) => list<key> = Ley_StrSetBS.Foldable.toList;

export const Foldable_fnull: (_1:t) => boolean = Ley_StrSetBS.Foldable.null;

export const Foldable_flength: (_1:t) => number = Ley_StrSetBS.Foldable.length;

export const Foldable_elem: (_1:key, _2:t) => boolean = function (Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_StrSetBS.Foldable.elem, Arg1, Arg2);
  return result
};

export const Foldable_concatMap: (_1:((_1:key) => t), _2:t) => t = function (Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_StrSetBS.Foldable.concatMap, Arg1, Arg2);
  return result
};

export const Foldable_any: (_1:((_1:key) => boolean), _2:t) => boolean = function (Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_StrSetBS.Foldable.any, Arg1, Arg2);
  return result
};

export const Foldable_all: (_1:((_1:key) => boolean), _2:t) => boolean = function (Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_StrSetBS.Foldable.all, Arg1, Arg2);
  return result
};

export const Foldable_notElem: (_1:key, _2:t) => boolean = function (Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_StrSetBS.Foldable.notElem, Arg1, Arg2);
  return result
};

export const Foldable_find: (_1:((_1:key) => boolean), _2:t) => (null | undefined | key) = function (Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_StrSetBS.Foldable.find, Arg1, Arg2);
  return result
};

export const empty: t = Ley_StrSetBS.empty;

export const singleton: (_1:key) => t = Ley_StrSetBS.singleton;

export const fromList: (_1:list<key>) => t = Ley_StrSetBS.fromList;

export const insert: (_1:key, _2:t) => t = function (Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_StrSetBS.insert, Arg1, Arg2);
  return result
};

export const sdelete: (_1:key, _2:t) => t = function (Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_StrSetBS.delete, Arg1, Arg2);
  return result
};

export const toggle: (_1:key, _2:t) => t = function (Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_StrSetBS.toggle, Arg1, Arg2);
  return result
};

export const member: (_1:key, _2:t) => boolean = function (Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_StrSetBS.member, Arg1, Arg2);
  return result
};

export const notMember: (_1:key, _2:t) => boolean = function (Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_StrSetBS.notMember, Arg1, Arg2);
  return result
};

export const size: (_1:t) => number = Ley_StrSetBS.size;

/** 
 * Excludes the items from both sets.
  */
export const union: (_1:t, _2:t) => t = function (Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_StrSetBS.union, Arg1, Arg2);
  return result
};

/** 
 * Excludes the items in the second set from the first.
  */
export const difference: (_1:t, _2:t) => t = function (Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_StrSetBS.difference, Arg1, Arg2);
  return result
};

export const filter: (_1:((_1:key) => boolean), _2:t) => t = function (Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_StrSetBS.filter, Arg1, Arg2);
  return result
};

export const map: (_1:((_1:key) => key), _2:t) => t = function (Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_StrSetBS.map, Arg1, Arg2);
  return result
};

export const elems: (_1:t) => list<key> = Ley_StrSetBS.elems;

export const Foldable: {
  foldl: <a>(_1:((_1:a, _2:key) => a), _2:a, _3:t) => a; 
  flength: (_1:t) => number; 
  elem: (_1:key, _2:t) => boolean; 
  concatMap: (_1:((_1:key) => t), _2:t) => t; 
  notElem: (_1:key, _2:t) => boolean; 
  toList: (_1:t) => list<key>; 
  fnull: (_1:t) => boolean; 
  any: (_1:((_1:key) => boolean), _2:t) => boolean; 
  find: (_1:((_1:key) => boolean), _2:t) => (null | undefined | key); 
  foldr: <a>(_1:((_1:key, _2:a) => a), _2:a, _3:t) => a; 
  all: (_1:((_1:key) => boolean), _2:t) => boolean
} = Ley_StrSetBS.Foldable

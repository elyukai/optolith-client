/* TypeScript file generated from Ley_StrMap.rei by genType. */
/* eslint-disable import/first */


// tslint:disable-next-line:no-var-requires
const CreateBucklescriptBlock = require('bs-platform/lib/es6/block.js');

// tslint:disable-next-line:no-var-requires
const Curry = require('bs-platform/lib/es6/curry.js');

// tslint:disable-next-line:no-var-requires
const Ley_StrMapBS = require('./Ley_StrMap.bs');

import {list} from '../../src/shims/ReasonPervasives.shim';

import {t as $$t} from '../shims/StrMap.shim';

// tslint:disable-next-line:interface-over-type-literal
export type key = string;

// tslint:disable-next-line:interface-over-type-literal
export type t<a> = $$t<a>;

// tslint:disable-next-line:interface-over-type-literal
export type strmap<a> = t<a>;
export type StrMap<a> = strmap<a>;

export const Foldable_foldr: <a,b>(_1:((_1:a, _2:b) => b), _2:b, _3:t<a>) => b = function <a,b>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_StrMapBS.Foldable.foldr, Arg1, Arg2, Arg3);
  return result
};

export const Foldable_foldl: <a,b>(_1:((_1:a, _2:b) => a), _2:a, _3:t<b>) => a = function <a,b>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_StrMapBS.Foldable.foldl, Arg1, Arg2, Arg3);
  return result
};

export const Foldable_toList: <a>(_1:t<a>) => list<[key, a]> = Ley_StrMapBS.Foldable.toList;

export const Foldable_fnull: <a>(_1:t<a>) => boolean = Ley_StrMapBS.Foldable.null;

export const Foldable_flength: <a>(_1:t<a>) => number = Ley_StrMapBS.Foldable.length;

export const Foldable_elem: <a>(_1:a, _2:t<a>) => boolean = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_StrMapBS.Foldable.elem, Arg1, Arg2);
  return result
};

export const Foldable_sum: (_1:t<number>) => number = Ley_StrMapBS.Foldable.sum;

export const Foldable_product: (_1:t<number>) => number = Ley_StrMapBS.Foldable.product;

export const Foldable_maximum: (_1:t<number>) => number = Ley_StrMapBS.Foldable.maximum;

export const Foldable_minimum: (_1:t<number>) => number = Ley_StrMapBS.Foldable.minimum;

export const Foldable_concat: <a>(_1:t<list<a>>) => list<a> = Ley_StrMapBS.Foldable.concat;

export const Foldable_concatMap: <a,b>(_1:((_1:a) => t<b>), _2:t<a>) => t<b> = function <a,b>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_StrMapBS.Foldable.concatMap, Arg1, Arg2);
  return result
};

export const Foldable_and: (_1:t<boolean>) => boolean = Ley_StrMapBS.Foldable.con;

export const Foldable_or: (_1:t<boolean>) => boolean = Ley_StrMapBS.Foldable.dis;

export const Foldable_any: <a>(_1:((_1:a) => boolean), _2:t<a>) => boolean = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_StrMapBS.Foldable.any, Arg1, Arg2);
  return result
};

export const Foldable_all: <a>(_1:((_1:a) => boolean), _2:t<a>) => boolean = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_StrMapBS.Foldable.all, Arg1, Arg2);
  return result
};

export const Foldable_notElem: <a>(_1:a, _2:t<a>) => boolean = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_StrMapBS.Foldable.notElem, Arg1, Arg2);
  return result
};

export const Foldable_find: <a>(_1:((_1:a) => boolean), _2:t<a>) => (null | undefined | a) = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_StrMapBS.Foldable.find, Arg1, Arg2);
  return result
};

export const Traversable_mapMEither: <a,b,c>(_1:((_1:a) => 
    { tag: "Ok"; value: b }
  | { tag: "Error"; value: c }), _2:t<a>) => 
    { tag: "Ok"; value: t<b> }
  | { tag: "Error"; value: c } = function <a,b,c>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_StrMapBS.Traversable.mapMEither, function (Arg11: any) {
      const result1 = Arg1(Arg11);
      return result1.tag==="Ok"
        ? CreateBucklescriptBlock.__(0, [result1.value])
        : CreateBucklescriptBlock.__(1, [result1.value])
    }, Arg2);
  return result.tag===0
    ? {tag:"Ok", value:result[0]}
    : {tag:"Error", value:result[0]}
};

export const fnull: <a>(_1:t<a>) => boolean = Ley_StrMapBS.null;

export const size: <a>(_1:t<a>) => number = Ley_StrMapBS.size;

export const member: <a>(_1:key, _2:t<a>) => boolean = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_StrMapBS.member, Arg1, Arg2);
  return result
};

export const notMember: <a>(_1:key, _2:t<a>) => boolean = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_StrMapBS.notMember, Arg1, Arg2);
  return result
};

export const lookup: <a>(_1:key, _2:t<a>) => (null | undefined | a) = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_StrMapBS.lookup, Arg1, Arg2);
  return result
};

export const findWithDefault: <a>(_1:a, _2:key, _3:t<a>) => a = function <a>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_StrMapBS.findWithDefault, Arg1, Arg2, Arg3);
  return result
};

export const singleton: <a>(_1:key, _2:a) => t<a> = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_StrMapBS.singleton, Arg1, Arg2);
  return result
};

export const insert: <a>(_1:key, _2:a, _3:t<a>) => t<a> = function <a>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_StrMapBS.insert, Arg1, Arg2, Arg3);
  return result
};

export const insertWith: <a>(_1:((_1:a, _2:a) => a), _2:key, _3:a, _4:t<a>) => t<a> = function <a>(Arg1: any, Arg2: any, Arg3: any, Arg4: any) {
  const result = Curry._4(Ley_StrMapBS.insertWith, Arg1, Arg2, Arg3, Arg4);
  return result
};

export const insertWithKey: <a>(_1:((_1:key, _2:a, _3:a) => a), _2:key, _3:a, _4:t<a>) => t<a> = function <a>(Arg1: any, Arg2: any, Arg3: any, Arg4: any) {
  const result = Curry._4(Ley_StrMapBS.insertWithKey, Arg1, Arg2, Arg3, Arg4);
  return result
};

export const insertLookupWithKey: <a>(_1:((_1:key, _2:a, _3:a) => a), _2:key, _3:a, _4:t<a>) => [(null | undefined | a), t<a>] = function <a>(Arg1: any, Arg2: any, Arg3: any, Arg4: any) {
  const result = Curry._4(Ley_StrMapBS.insertLookupWithKey, Arg1, Arg2, Arg3, Arg4);
  return result
};

export const sdelete: <a>(_1:key, _2:t<a>) => t<a> = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_StrMapBS.delete, Arg1, Arg2);
  return result
};

export const adjust: <a>(_1:((_1:a) => a), _2:key, _3:t<a>) => t<a> = function <a>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_StrMapBS.adjust, Arg1, Arg2, Arg3);
  return result
};

export const adjustWithKey: <a>(_1:((_1:key, _2:a) => a), _2:key, _3:t<a>) => t<a> = function <a>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_StrMapBS.adjustWithKey, Arg1, Arg2, Arg3);
  return result
};

export const update: <a>(_1:((_1:a) => (null | undefined | a)), _2:key, _3:t<a>) => t<a> = function <a>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_StrMapBS.update, function (Arg11: any) {
      const result1 = Arg1(Arg11);
      return (result1 == null ? undefined : result1)
    }, Arg2, Arg3);
  return result
};

export const updateWithKey: <a>(_1:((_1:key, _2:a) => (null | undefined | a)), _2:key, _3:t<a>) => t<a> = function <a>(Arg1: any, Arg21: any, Arg3: any) {
  const result = Curry._3(Ley_StrMapBS.updateWithKey, function (Arg11: any, Arg2: any) {
      const result1 = Arg1(Arg11, Arg2);
      return (result1 == null ? undefined : result1)
    }, Arg21, Arg3);
  return result
};

export const updateLookupWithKey: <a>(_1:((_1:key, _2:a) => (null | undefined | a)), _2:key, _3:t<a>) => [(null | undefined | a), t<a>] = function <a>(Arg1: any, Arg21: any, Arg3: any) {
  const result = Curry._3(Ley_StrMapBS.updateLookupWithKey, function (Arg11: any, Arg2: any) {
      const result1 = Arg1(Arg11, Arg2);
      return (result1 == null ? undefined : result1)
    }, Arg21, Arg3);
  return result
};

export const alter: <a>(_1:((_1:(null | undefined | a)) => (null | undefined | a)), _2:key, _3:t<a>) => t<a> = function <a>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_StrMapBS.alter, function (Arg11: any) {
      const result1 = Arg1(Arg11);
      return (result1 == null ? undefined : result1)
    }, Arg2, Arg3);
  return result
};

export const union: <a>(_1:t<a>, _2:t<a>) => t<a> = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_StrMapBS.union, Arg1, Arg2);
  return result
};

export const map: <a,b>(_1:((_1:a) => b), _2:t<a>) => t<b> = function <a,b>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_StrMapBS.map, Arg1, Arg2);
  return result
};

export const mapWithKey: <a,b>(_1:((_1:key, _2:a) => b), _2:t<a>) => t<b> = function <a,b>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_StrMapBS.mapWithKey, Arg1, Arg2);
  return result
};

export const foldrWithKey: <a,b>(_1:((_1:key, _2:a, _3:b) => b), _2:b, _3:t<a>) => b = function <a,b>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_StrMapBS.foldrWithKey, Arg1, Arg2, Arg3);
  return result
};

export const foldlWithKey: <a,b>(_1:((_1:a, _2:key, _3:b) => a), _2:a, _3:t<b>) => a = function <a,b>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_StrMapBS.foldlWithKey, Arg1, Arg2, Arg3);
  return result
};

export const elems: <a>(_1:t<a>) => list<a> = Ley_StrMapBS.elems;

export const keys: <a>(_1:t<a>) => list<key> = Ley_StrMapBS.keys;

export const assocs: <a>(_1:t<a>) => list<[key, a]> = Ley_StrMapBS.assocs;

export const fromList: <a>(_1:list<[key, a]>) => t<a> = Ley_StrMapBS.fromList;

export const fromArray: <a>(_1:Array<[key, a]>) => t<a> = Ley_StrMapBS.fromArray;

export const filter: <a>(_1:((_1:a) => boolean), _2:t<a>) => t<a> = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_StrMapBS.filter, Arg1, Arg2);
  return result
};

export const filterWithKey: <a>(_1:((_1:key, _2:a) => boolean), _2:t<a>) => t<a> = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_StrMapBS.filterWithKey, Arg1, Arg2);
  return result
};

export const mapMaybe: <a,b>(_1:((_1:a) => (null | undefined | b)), _2:t<a>) => t<b> = function <a,b>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_StrMapBS.mapMaybe, function (Arg11: any) {
      const result1 = Arg1(Arg11);
      return (result1 == null ? undefined : result1)
    }, Arg2);
  return result
};

export const mapMaybeWithKey: <a,b>(_1:((_1:key, _2:a) => (null | undefined | b)), _2:t<a>) => t<b> = function <a,b>(Arg1: any, Arg21: any) {
  const result = Curry._2(Ley_StrMapBS.mapMaybeWithKey, function (Arg11: any, Arg2: any) {
      const result1 = Arg1(Arg11, Arg2);
      return (result1 == null ? undefined : result1)
    }, Arg21);
  return result
};

/** 
 * Takes a function and a list. The function is mapped over the list and the
 * return value is used as the key which's value is increased by one every
 * time the value is returned. This way, you can count elements grouped by
 * the value the mapping function returns.
  */
export const countBy: <a>(_1:((_1:a) => key), _2:list<a>) => t<number> = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_StrMapBS.countBy, Arg1, Arg2);
  return result
};

/** 
 * Takes a function and a list. The function is mapped over the list and for
 * each `Just` it returns, the value at the key contained in the `Just` is
 * increased by one. This way, you can count elements grouped by the value
 * the mapping function returns, but you can also ignore values, which is
 * not possible with `countBy`.
  */
export const countByM: <a>(_1:((_1:a) => (null | undefined | key)), _2:list<a>) => t<number> = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_StrMapBS.countByM, function (Arg11: any) {
      const result1 = Arg1(Arg11);
      return (result1 == null ? undefined : result1)
    }, Arg2);
  return result
};

/** 
 * `groupByKey f xs` groups the elements of the list `xs` by the key
 * returned by passing the respective element to `f` in a map.
  */
export const groupBy: <a>(_1:((_1:a) => key), _2:list<a>) => t<list<a>> = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_StrMapBS.groupBy, Arg1, Arg2);
  return result
};

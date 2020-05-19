/* TypeScript file generated from Ley_IntMap.rei by genType. */
/* eslint-disable import/first */


// tslint:disable-next-line:no-var-requires
const CreateBucklescriptBlock = require('bs-platform/lib/es6/block.js');

// tslint:disable-next-line:no-var-requires
const Curry = require('bs-platform/lib/es6/curry.js');

// tslint:disable-next-line:no-var-requires
const Ley_IntMapBS = require('./Ley_IntMap.bs');

import {list} from '../../src/shims/ReasonPervasives.shim';

import {t as $$t} from '../shims/IntMap.shim';

// tslint:disable-next-line:interface-over-type-literal
export type key = number;

// tslint:disable-next-line:interface-over-type-literal
export type t<a> = $$t<a>;

// tslint:disable-next-line:interface-over-type-literal
export type intmap<a> = t<a>;
export type IntMap<a> = intmap<a>;

export const Foldable_foldr: <a,b>(_1:((_1:a, _2:b) => b), _2:b, _3:t<a>) => b = function <a,b>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_IntMapBS.Foldable.foldr, Arg1, Arg2, Arg3);
  return result
};

export const Foldable_foldl: <a,b>(_1:((_1:a, _2:b) => a), _2:a, _3:t<b>) => a = function <a,b>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_IntMapBS.Foldable.foldl, Arg1, Arg2, Arg3);
  return result
};

export const Foldable_toList: <a>(_1:t<a>) => list<[key, a]> = Ley_IntMapBS.Foldable.toList;

export const Foldable_fnull: <a>(_1:t<a>) => boolean = Ley_IntMapBS.Foldable.null;

export const Foldable_flength: <a>(_1:t<a>) => number = Ley_IntMapBS.Foldable.length;

export const Foldable_elem: <a>(_1:a, _2:t<a>) => boolean = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_IntMapBS.Foldable.elem, Arg1, Arg2);
  return result
};

export const Foldable_sum: (_1:t<number>) => number = Ley_IntMapBS.Foldable.sum;

export const Foldable_product: (_1:t<number>) => number = Ley_IntMapBS.Foldable.product;

export const Foldable_maximum: (_1:t<number>) => number = Ley_IntMapBS.Foldable.maximum;

export const Foldable_minimum: (_1:t<number>) => number = Ley_IntMapBS.Foldable.minimum;

export const Foldable_concat: <a>(_1:t<list<a>>) => list<a> = Ley_IntMapBS.Foldable.concat;

export const Foldable_concatMap: <a,b>(_1:((_1:a) => t<b>), _2:t<a>) => t<b> = function <a,b>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_IntMapBS.Foldable.concatMap, Arg1, Arg2);
  return result
};

export const Foldable_and: (_1:t<boolean>) => boolean = Ley_IntMapBS.Foldable.con;

export const Foldable_or: (_1:t<boolean>) => boolean = Ley_IntMapBS.Foldable.dis;

export const Foldable_any: <a>(_1:((_1:a) => boolean), _2:t<a>) => boolean = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_IntMapBS.Foldable.any, Arg1, Arg2);
  return result
};

export const Foldable_all: <a>(_1:((_1:a) => boolean), _2:t<a>) => boolean = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_IntMapBS.Foldable.all, Arg1, Arg2);
  return result
};

export const Foldable_notElem: <a>(_1:a, _2:t<a>) => boolean = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_IntMapBS.Foldable.notElem, Arg1, Arg2);
  return result
};

export const Foldable_find: <a>(_1:((_1:a) => boolean), _2:t<a>) => (null | undefined | a) = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_IntMapBS.Foldable.find, Arg1, Arg2);
  return result
};

export const Traversable_mapMEither: <a,b,c>(_1:((_1:a) => 
    { tag: "Ok"; value: b }
  | { tag: "Error"; value: c }), _2:t<a>) => 
    { tag: "Ok"; value: t<b> }
  | { tag: "Error"; value: c } = function <a,b,c>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_IntMapBS.Traversable.mapMEither, function (Arg11: any) {
      const result1 = Arg1(Arg11);
      return result1.tag==="Ok"
        ? CreateBucklescriptBlock.__(0, [result1.value])
        : CreateBucklescriptBlock.__(1, [result1.value])
    }, Arg2);
  return result.tag===0
    ? {tag:"Ok", value:result[0]}
    : {tag:"Error", value:result[0]}
};

export const fnull: <a>(_1:t<a>) => boolean = Ley_IntMapBS.null;

export const size: <a>(_1:t<a>) => number = Ley_IntMapBS.size;

export const member: <a>(_1:key, _2:t<a>) => boolean = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_IntMapBS.member, Arg1, Arg2);
  return result
};

export const notMember: <a>(_1:key, _2:t<a>) => boolean = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_IntMapBS.notMember, Arg1, Arg2);
  return result
};

export const lookup: <a>(_1:key, _2:t<a>) => (null | undefined | a) = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_IntMapBS.lookup, Arg1, Arg2);
  return result
};

export const findWithDefault: <a>(_1:a, _2:key, _3:t<a>) => a = function <a>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_IntMapBS.findWithDefault, Arg1, Arg2, Arg3);
  return result
};

export const singleton: <a>(_1:key, _2:a) => t<a> = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_IntMapBS.singleton, Arg1, Arg2);
  return result
};

export const insert: <a>(_1:key, _2:a, _3:t<a>) => t<a> = function <a>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_IntMapBS.insert, Arg1, Arg2, Arg3);
  return result
};

export const insertWith: <a>(_1:((_1:a, _2:a) => a), _2:key, _3:a, _4:t<a>) => t<a> = function <a>(Arg1: any, Arg2: any, Arg3: any, Arg4: any) {
  const result = Curry._4(Ley_IntMapBS.insertWith, Arg1, Arg2, Arg3, Arg4);
  return result
};

export const insertWithKey: <a>(_1:((_1:key, _2:a, _3:a) => a), _2:key, _3:a, _4:t<a>) => t<a> = function <a>(Arg1: any, Arg2: any, Arg3: any, Arg4: any) {
  const result = Curry._4(Ley_IntMapBS.insertWithKey, Arg1, Arg2, Arg3, Arg4);
  return result
};

export const insertLookupWithKey: <a>(_1:((_1:key, _2:a, _3:a) => a), _2:key, _3:a, _4:t<a>) => [(null | undefined | a), t<a>] = function <a>(Arg1: any, Arg2: any, Arg3: any, Arg4: any) {
  const result = Curry._4(Ley_IntMapBS.insertLookupWithKey, Arg1, Arg2, Arg3, Arg4);
  return result
};

export const sdelete: <a>(_1:key, _2:t<a>) => t<a> = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_IntMapBS.delete, Arg1, Arg2);
  return result
};

export const adjust: <a>(_1:((_1:a) => a), _2:key, _3:t<a>) => t<a> = function <a>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_IntMapBS.adjust, Arg1, Arg2, Arg3);
  return result
};

export const adjustWithKey: <a>(_1:((_1:key, _2:a) => a), _2:key, _3:t<a>) => t<a> = function <a>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_IntMapBS.adjustWithKey, Arg1, Arg2, Arg3);
  return result
};

export const update: <a>(_1:((_1:a) => (null | undefined | a)), _2:key, _3:t<a>) => t<a> = function <a>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_IntMapBS.update, function (Arg11: any) {
      const result1 = Arg1(Arg11);
      return (result1 == null ? undefined : result1)
    }, Arg2, Arg3);
  return result
};

export const updateWithKey: <a>(_1:((_1:key, _2:a) => (null | undefined | a)), _2:key, _3:t<a>) => t<a> = function <a>(Arg1: any, Arg21: any, Arg3: any) {
  const result = Curry._3(Ley_IntMapBS.updateWithKey, function (Arg11: any, Arg2: any) {
      const result1 = Arg1(Arg11, Arg2);
      return (result1 == null ? undefined : result1)
    }, Arg21, Arg3);
  return result
};

export const updateLookupWithKey: <a>(_1:((_1:key, _2:a) => (null | undefined | a)), _2:key, _3:t<a>) => [(null | undefined | a), t<a>] = function <a>(Arg1: any, Arg21: any, Arg3: any) {
  const result = Curry._3(Ley_IntMapBS.updateLookupWithKey, function (Arg11: any, Arg2: any) {
      const result1 = Arg1(Arg11, Arg2);
      return (result1 == null ? undefined : result1)
    }, Arg21, Arg3);
  return result
};

export const alter: <a>(_1:((_1:(null | undefined | a)) => (null | undefined | a)), _2:key, _3:t<a>) => t<a> = function <a>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_IntMapBS.alter, function (Arg11: any) {
      const result1 = Arg1(Arg11);
      return (result1 == null ? undefined : result1)
    }, Arg2, Arg3);
  return result
};

export const union: <a>(_1:t<a>, _2:t<a>) => t<a> = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_IntMapBS.union, Arg1, Arg2);
  return result
};

export const map: <a,b>(_1:((_1:a) => b), _2:t<a>) => t<b> = function <a,b>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_IntMapBS.map, Arg1, Arg2);
  return result
};

export const mapWithKey: <a,b>(_1:((_1:key, _2:a) => b), _2:t<a>) => t<b> = function <a,b>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_IntMapBS.mapWithKey, Arg1, Arg2);
  return result
};

export const foldrWithKey: <a,b>(_1:((_1:key, _2:a, _3:b) => b), _2:b, _3:t<a>) => b = function <a,b>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_IntMapBS.foldrWithKey, Arg1, Arg2, Arg3);
  return result
};

export const foldlWithKey: <a,b>(_1:((_1:a, _2:key, _3:b) => a), _2:a, _3:t<b>) => a = function <a,b>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_IntMapBS.foldlWithKey, Arg1, Arg2, Arg3);
  return result
};

export const elems: <a>(_1:t<a>) => list<a> = Ley_IntMapBS.elems;

export const keys: <a>(_1:t<a>) => list<key> = Ley_IntMapBS.keys;

export const assocs: <a>(_1:t<a>) => list<[key, a]> = Ley_IntMapBS.assocs;

export const fromList: <a>(_1:list<[key, a]>) => t<a> = Ley_IntMapBS.fromList;

export const fromArray: <a>(_1:Array<[key, a]>) => t<a> = Ley_IntMapBS.fromArray;

export const filter: <a>(_1:((_1:a) => boolean), _2:t<a>) => t<a> = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_IntMapBS.filter, Arg1, Arg2);
  return result
};

export const filterWithKey: <a>(_1:((_1:key, _2:a) => boolean), _2:t<a>) => t<a> = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_IntMapBS.filterWithKey, Arg1, Arg2);
  return result
};

export const mapMaybe: <a,b>(_1:((_1:a) => (null | undefined | b)), _2:t<a>) => t<b> = function <a,b>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_IntMapBS.mapMaybe, function (Arg11: any) {
      const result1 = Arg1(Arg11);
      return (result1 == null ? undefined : result1)
    }, Arg2);
  return result
};

export const mapMaybeWithKey: <a,b>(_1:((_1:key, _2:a) => (null | undefined | b)), _2:t<a>) => t<b> = function <a,b>(Arg1: any, Arg21: any) {
  const result = Curry._2(Ley_IntMapBS.mapMaybeWithKey, function (Arg11: any, Arg2: any) {
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
  const result = Curry._2(Ley_IntMapBS.countBy, Arg1, Arg2);
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
  const result = Curry._2(Ley_IntMapBS.countByM, function (Arg11: any) {
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
  const result = Curry._2(Ley_IntMapBS.groupBy, Arg1, Arg2);
  return result
};

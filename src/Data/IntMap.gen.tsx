/* TypeScript file generated from IntMap.rei by genType. */
/* eslint-disable import/first */


const $$toJS1024164449: { [key: string]: any } = {"0": "Nothing"};

const $$toRE1024164449: { [key: string]: any } = {"Nothing": 0};

// tslint:disable-next-line:no-var-requires
const CreateBucklescriptBlock = require('bs-platform/lib/js/block.js');

// tslint:disable-next-line:no-var-requires
const Curry = require('bs-platform/lib/js/curry.js');

// tslint:disable-next-line:no-var-requires
const IntMapBS = require('./IntMap.bs');

import {list} from '../../src/shims/ReasonPervasives.shim';

import {t as $$t} from '../shims/IntMap.shim';

import {t as Either_t} from './Either.gen';

import {t as Maybe_t} from './Maybe.gen';

// tslint:disable-next-line:interface-over-type-literal
export type key = number;

// tslint:disable-next-line:interface-over-type-literal
export type t<a> = $$t<a>;

// tslint:disable-next-line:interface-over-type-literal
export type intmap<a> = t<a>;
export type IntMap<a> = intmap<a>;

export const Foldable_foldr: <a,b>(_1:((_1:a, _2:b) => b), _2:b, _3:t<a>) => b = function <a,b>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(IntMapBS.Foldable.foldr, Arg1, Arg2, Arg3);
  return result
};

export const Foldable_foldl: <a,b>(_1:((_1:a, _2:b) => a), _2:a, _3:t<b>) => a = function <a,b>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(IntMapBS.Foldable.foldl, Arg1, Arg2, Arg3);
  return result
};

export const Foldable_toList: <a>(_1:t<a>) => list<[key, a]> = IntMapBS.Foldable.toList;

export const Foldable_fnull: <a>(_1:t<a>) => boolean = IntMapBS.Foldable.null;

export const Foldable_length: <a>(_1:t<a>) => number = IntMapBS.Foldable.length;

export const Foldable_elem: <a>(_1:a, _2:t<a>) => boolean = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(IntMapBS.Foldable.elem, Arg1, Arg2);
  return result
};

export const Foldable_sum: (_1:t<number>) => number = IntMapBS.Foldable.sum;

export const Foldable_product: (_1:t<number>) => number = IntMapBS.Foldable.product;

export const Foldable_maximum: (_1:t<number>) => number = IntMapBS.Foldable.maximum;

export const Foldable_minimum: (_1:t<number>) => number = IntMapBS.Foldable.minimum;

export const Foldable_concat: <a>(_1:t<list<a>>) => list<a> = IntMapBS.Foldable.concat;

export const Foldable_concatMap: <a,b>(_1:((_1:a) => t<b>), _2:t<a>) => t<b> = function <a,b>(Arg1: any, Arg2: any) {
  const result = Curry._2(IntMapBS.Foldable.concatMap, Arg1, Arg2);
  return result
};

export const Foldable_and: (_1:t<boolean>) => boolean = IntMapBS.Foldable.con;

export const Foldable_or: (_1:t<boolean>) => boolean = IntMapBS.Foldable.dis;

export const Foldable_any: <a>(_1:((_1:a) => boolean), _2:t<a>) => boolean = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(IntMapBS.Foldable.any, Arg1, Arg2);
  return result
};

export const Foldable_all: <a>(_1:((_1:a) => boolean), _2:t<a>) => boolean = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(IntMapBS.Foldable.all, Arg1, Arg2);
  return result
};

export const Foldable_notElem: <a>(_1:a, _2:t<a>) => boolean = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(IntMapBS.Foldable.notElem, Arg1, Arg2);
  return result
};

export const Foldable_find: <a>(_1:((_1:a) => boolean), _2:t<a>) => Maybe_t<a> = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(IntMapBS.Foldable.find, Arg1, Arg2);
  return typeof(result) === 'object'
    ? {tag:"Just", value:result[0]}
    : $$toJS1024164449[result]
};

export const Traversable_mapMEither: <a,b,c>(_1:((_1:a) => Either_t<b,c>), _2:t<a>) => Either_t<b,t<c>> = function <a,b,c>(Arg1: any, Arg2: any) {
  const result = Curry._2(IntMapBS.Traversable.mapMEither, function (Arg11: any) {
      const result1 = Arg1(Arg11);
      return result1.tag==="Left"
        ? CreateBucklescriptBlock.__(0, [result1.value])
        : CreateBucklescriptBlock.__(1, [result1.value])
    }, Arg2);
  return result.tag===0
    ? {tag:"Left", value:result[0]}
    : {tag:"Right", value:result[0]}
};

export const fnull: <a>(_1:t<a>) => boolean = IntMapBS.null;

export const size: <a>(_1:t<a>) => number = IntMapBS.size;

export const member: <a>(_1:key, _2:t<a>) => boolean = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(IntMapBS.member, Arg1, Arg2);
  return result
};

export const notMember: <a>(_1:key, _2:t<a>) => boolean = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(IntMapBS.notMember, Arg1, Arg2);
  return result
};

export const lookup: <a>(_1:key, _2:t<a>) => Maybe_t<a> = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(IntMapBS.lookup, Arg1, Arg2);
  return typeof(result) === 'object'
    ? {tag:"Just", value:result[0]}
    : $$toJS1024164449[result]
};

export const findWithDefault: <a>(_1:a, _2:key, _3:t<a>) => a = function <a>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(IntMapBS.findWithDefault, Arg1, Arg2, Arg3);
  return result
};

export const singleton: <a>(_1:key, _2:a) => t<a> = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(IntMapBS.singleton, Arg1, Arg2);
  return result
};

export const insert: <a>(_1:key, _2:a, _3:t<a>) => t<a> = function <a>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(IntMapBS.insert, Arg1, Arg2, Arg3);
  return result
};

export const insertWith: <a>(_1:((_1:a, _2:a) => a), _2:key, _3:a, _4:t<a>) => t<a> = function <a>(Arg1: any, Arg2: any, Arg3: any, Arg4: any) {
  const result = Curry._4(IntMapBS.insertWith, Arg1, Arg2, Arg3, Arg4);
  return result
};

export const insertWithKey: <a>(_1:((_1:key, _2:a, _3:a) => a), _2:key, _3:a, _4:t<a>) => t<a> = function <a>(Arg1: any, Arg2: any, Arg3: any, Arg4: any) {
  const result = Curry._4(IntMapBS.insertWithKey, Arg1, Arg2, Arg3, Arg4);
  return result
};

export const insertLookupWithKey: <a>(_1:((_1:key, _2:a, _3:a) => a), _2:key, _3:a, _4:t<a>) => [Maybe_t<a>, t<a>] = function <a>(Arg1: any, Arg2: any, Arg3: any, Arg4: any) {
  const result = Curry._4(IntMapBS.insertLookupWithKey, Arg1, Arg2, Arg3, Arg4);
  return [typeof(result[0]) === 'object'
    ? {tag:"Just", value:result[0][0]}
    : $$toJS1024164449[result[0]], result[1]]
};

export const sdelete: <a>(_1:key, _2:t<a>) => t<a> = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(IntMapBS.delete, Arg1, Arg2);
  return result
};

export const adjust: <a>(_1:((_1:a) => a), _2:key, _3:t<a>) => t<a> = function <a>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(IntMapBS.adjust, Arg1, Arg2, Arg3);
  return result
};

export const adjustWithKey: <a>(_1:((_1:key, _2:a) => a), _2:key, _3:t<a>) => t<a> = function <a>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(IntMapBS.adjustWithKey, Arg1, Arg2, Arg3);
  return result
};

export const update: <a>(_1:((_1:a) => Maybe_t<a>), _2:key, _3:t<a>) => t<a> = function <a>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(IntMapBS.update, function (Arg11: any) {
      const result1 = Arg1(Arg11);
      return typeof(result1) === 'object'
        ? CreateBucklescriptBlock.__(0, [result1.value])
        : $$toRE1024164449[result1]
    }, Arg2, Arg3);
  return result
};

export const updateWithKey: <a>(_1:((_1:key, _2:a) => Maybe_t<a>), _2:key, _3:t<a>) => t<a> = function <a>(Arg1: any, Arg21: any, Arg3: any) {
  const result = Curry._3(IntMapBS.updateWithKey, function (Arg11: any, Arg2: any) {
      const result1 = Arg1(Arg11, Arg2);
      return typeof(result1) === 'object'
        ? CreateBucklescriptBlock.__(0, [result1.value])
        : $$toRE1024164449[result1]
    }, Arg21, Arg3);
  return result
};

export const updateLookupWithKey: <a>(_1:((_1:key, _2:a) => Maybe_t<a>), _2:key, _3:t<a>) => [Maybe_t<a>, t<a>] = function <a>(Arg1: any, Arg21: any, Arg3: any) {
  const result = Curry._3(IntMapBS.updateLookupWithKey, function (Arg11: any, Arg2: any) {
      const result1 = Arg1(Arg11, Arg2);
      return typeof(result1) === 'object'
        ? CreateBucklescriptBlock.__(0, [result1.value])
        : $$toRE1024164449[result1]
    }, Arg21, Arg3);
  return [typeof(result[0]) === 'object'
    ? {tag:"Just", value:result[0][0]}
    : $$toJS1024164449[result[0]], result[1]]
};

export const alter: <a>(_1:((_1:Maybe_t<a>) => Maybe_t<a>), _2:key, _3:t<a>) => t<a> = function <a>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(IntMapBS.alter, function (Arg11: any) {
      const result1 = Arg1(typeof(Arg11) === 'object'
        ? {tag:"Just", value:Arg11[0]}
        : $$toJS1024164449[Arg11]);
      return typeof(result1) === 'object'
        ? CreateBucklescriptBlock.__(0, [result1.value])
        : $$toRE1024164449[result1]
    }, Arg2, Arg3);
  return result
};

export const union: <a>(_1:t<a>, _2:t<a>) => t<a> = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(IntMapBS.union, Arg1, Arg2);
  return result
};

export const map: <a,b>(_1:((_1:a) => b), _2:t<a>) => t<b> = function <a,b>(Arg1: any, Arg2: any) {
  const result = Curry._2(IntMapBS.map, Arg1, Arg2);
  return result
};

export const mapWithKey: <a,b>(_1:((_1:key, _2:a) => b), _2:t<a>) => t<b> = function <a,b>(Arg1: any, Arg2: any) {
  const result = Curry._2(IntMapBS.mapWithKey, Arg1, Arg2);
  return result
};

export const foldrWithKey: <a,b>(_1:((_1:key, _2:a, _3:b) => b), _2:b, _3:t<a>) => b = function <a,b>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(IntMapBS.foldrWithKey, Arg1, Arg2, Arg3);
  return result
};

export const foldlWithKey: <a,b>(_1:((_1:a, _2:key, _3:b) => a), _2:a, _3:t<b>) => a = function <a,b>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(IntMapBS.foldlWithKey, Arg1, Arg2, Arg3);
  return result
};

export const elems: <a>(_1:t<a>) => list<a> = IntMapBS.elems;

export const keys: <a>(_1:t<a>) => list<key> = IntMapBS.keys;

export const assocs: <a>(_1:t<a>) => list<[key, a]> = IntMapBS.assocs;

export const fromList: <a>(_1:list<[key, a]>) => t<a> = IntMapBS.fromList;

export const fromArray: <a>(_1:Array<[key, a]>) => t<a> = IntMapBS.fromArray;

export const filter: <a>(_1:((_1:a) => boolean), _2:t<a>) => t<a> = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(IntMapBS.filter, Arg1, Arg2);
  return result
};

export const filterWithKey: <a>(_1:((_1:key, _2:a) => boolean), _2:t<a>) => t<a> = function <a>(Arg1: any, Arg2: any) {
  const result = Curry._2(IntMapBS.filterWithKey, Arg1, Arg2);
  return result
};

export const mapMaybe: <a,b>(_1:((_1:a) => Maybe_t<b>), _2:t<a>) => t<b> = function <a,b>(Arg1: any, Arg2: any) {
  const result = Curry._2(IntMapBS.mapMaybe, function (Arg11: any) {
      const result1 = Arg1(Arg11);
      return typeof(result1) === 'object'
        ? CreateBucklescriptBlock.__(0, [result1.value])
        : $$toRE1024164449[result1]
    }, Arg2);
  return result
};

export const mapMaybeWithKey: <a,b>(_1:((_1:key, _2:a) => Maybe_t<b>), _2:t<a>) => t<b> = function <a,b>(Arg1: any, Arg21: any) {
  const result = Curry._2(IntMapBS.mapMaybeWithKey, function (Arg11: any, Arg2: any) {
      const result1 = Arg1(Arg11, Arg2);
      return typeof(result1) === 'object'
        ? CreateBucklescriptBlock.__(0, [result1.value])
        : $$toRE1024164449[result1]
    }, Arg21);
  return result
};

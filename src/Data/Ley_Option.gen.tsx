/* TypeScript file generated from Ley_Option.rei by genType. */
/* eslint-disable import/first */


// tslint:disable-next-line:no-var-requires
const Curry = require('bs-platform/lib/es6/curry.js');

// tslint:disable-next-line:no-var-requires
const Ley_OptionBS = require('./Ley_Option.bs');

import {list} from '../../src/shims/ReasonPervasives.shim';

// tslint:disable-next-line:interface-over-type-literal
export type t<a> = (null | undefined | a);
export type Option<a> = t<a>;

export const Functor_fmap: <T1,T2>(_1:((_1:T1) => T2), _2:(null | undefined | T1)) => (null | undefined | T2) = function <T1,T2>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_OptionBS.Functor.fmap, Arg1, (Arg2 == null ? undefined : Arg2));
  return result
};

export const Functor_fmapF: <T1,T2>(_1:(null | undefined | T1), _2:((_1:T1) => T2)) => (null | undefined | T2) = function <T1,T2>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_OptionBS.Functor.fmapF, (Arg1 == null ? undefined : Arg1), Arg2);
  return result
};

export const Applicative_ap: <T1,T2>(_1:(null | undefined | (((_1:T1) => T2))), _2:(null | undefined | T1)) => (null | undefined | T2) = function <T1,T2>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_OptionBS.Applicative.ap, (Arg1 == null ? undefined : Arg1), (Arg2 == null ? undefined : Arg2));
  return result
};

export const Alternative_alt: <T1>(_1:(null | undefined | T1), _2:(null | undefined | T1)) => (null | undefined | T1) = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_OptionBS.Alternative.alt, (Arg1 == null ? undefined : Arg1), (Arg2 == null ? undefined : Arg2));
  return result
};

export const Alternative_guard: (pred:boolean) => (null | undefined | void) = Ley_OptionBS.Alternative.guard;

export const Monad_return: <T1>(x:T1) => (null | undefined | T1) = Ley_OptionBS.Monad.return;

export const Monad_bind: <T1,T2>(_1:(null | undefined | T1), _2:((_1:T1) => (null | undefined | T2))) => (null | undefined | T2) = function <T1,T2>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_OptionBS.Monad.bind, (Arg1 == null ? undefined : Arg1), function (Arg11: any) {
      const result1 = Arg2(Arg11);
      return (result1 == null ? undefined : result1)
    });
  return result
};

export const Monad_bindF: <T1,T2>(_1:((_1:T1) => (null | undefined | T2)), _2:(null | undefined | T1)) => (null | undefined | T2) = function <T1,T2>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_OptionBS.Monad.bindF, function (Arg11: any) {
      const result1 = Arg1(Arg11);
      return (result1 == null ? undefined : result1)
    }, (Arg2 == null ? undefined : Arg2));
  return result
};

export const Monad_then: <T1,T2>(_1:(null | undefined | T1), _2:(null | undefined | T2)) => (null | undefined | T2) = function <T1,T2>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_OptionBS.Monad.then_, (Arg1 == null ? undefined : Arg1), (Arg2 == null ? undefined : Arg2));
  return result
};

export const Monad_thenF: <T1,T2>(_1:(null | undefined | T1), _2:(null | undefined | T2)) => (null | undefined | T1) = function <T1,T2>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_OptionBS.Monad.thenF, (Arg1 == null ? undefined : Arg1), (Arg2 == null ? undefined : Arg2));
  return result
};

export const Monad_mapM: <T1,T2>(f:((_1:T1) => (null | undefined | T2)), xs:list<T1>) => (null | undefined | list<T2>) = function <T1,T2>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_OptionBS.Monad.mapM, function (Arg11: any) {
      const result1 = Arg1(Arg11);
      return (result1 == null ? undefined : result1)
    }, Arg2);
  return result
};

export const Monad_kleisli: <T1,T2,T3>(_1:((_1:T1) => (null | undefined | T2)), _2:((_1:T2) => (null | undefined | T3)), _3:T1) => (null | undefined | T3) = function <T1,T2,T3>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_OptionBS.Monad.kleisli, function (Arg11: any) {
      const result1 = Arg1(Arg11);
      return (result1 == null ? undefined : result1)
    }, function (Arg12: any) {
      const result2 = Arg2(Arg12);
      return (result2 == null ? undefined : result2)
    }, Arg3);
  return result
};

export const Monad_join: <T1>(x:(null | undefined | (null | undefined | T1))) => (null | undefined | T1) = function <T1>(Arg1: any) {
  const result = Ley_OptionBS.Monad.join((Arg1 == null ? undefined : (Arg1 == null ? undefined : Arg1)));
  return result
};

export const Monad_liftM2: <T1,T2,T3>(f:((_1:T1, _2:T2) => T3), mx:(null | undefined | T1), my:(null | undefined | T2)) => (null | undefined | T3) = function <T1,T2,T3>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_OptionBS.Monad.liftM2, Arg1, (Arg2 == null ? undefined : Arg2), (Arg3 == null ? undefined : Arg3));
  return result
};

export const Monad_liftM3: <T1,T2,T3,T4>(f:((_1:T1, _2:T2, _3:T3) => T4), mx:(null | undefined | T1), my:(null | undefined | T2), mz:(null | undefined | T3)) => (null | undefined | T4) = function <T1,T2,T3,T4>(Arg1: any, Arg2: any, Arg3: any, Arg4: any) {
  const result = Curry._4(Ley_OptionBS.Monad.liftM3, Arg1, (Arg2 == null ? undefined : Arg2), (Arg3 == null ? undefined : Arg3), (Arg4 == null ? undefined : Arg4));
  return result
};

export const Monad_liftM4: <T1,T2,T3,T4,T5>(f:((_1:T1, _2:T2, _3:T3, _4:T4) => T5), mx:(null | undefined | T1), my:(null | undefined | T2), mz:(null | undefined | T3), ma:(null | undefined | T4)) => (null | undefined | T5) = function <T1,T2,T3,T4,T5>(Arg1: any, Arg2: any, Arg3: any, Arg4: any, Arg5: any) {
  const result = Curry._5(Ley_OptionBS.Monad.liftM4, Arg1, (Arg2 == null ? undefined : Arg2), (Arg3 == null ? undefined : Arg3), (Arg4 == null ? undefined : Arg4), (Arg5 == null ? undefined : Arg5));
  return result
};

export const Monad_liftM5: <T1,T2,T3,T4,T5,T6>(f:((_1:T1, _2:T2, _3:T3, _4:T4, _5:T5) => T6), mx:(null | undefined | T1), my:(null | undefined | T2), mz:(null | undefined | T3), ma:(null | undefined | T4), mb:(null | undefined | T5)) => (null | undefined | T6) = function <T1,T2,T3,T4,T5,T6>(Arg1: any, Arg2: any, Arg3: any, Arg4: any, Arg5: any, Arg6: any) {
  const result = Curry._6(Ley_OptionBS.Monad.liftM5, Arg1, (Arg2 == null ? undefined : Arg2), (Arg3 == null ? undefined : Arg3), (Arg4 == null ? undefined : Arg4), (Arg5 == null ? undefined : Arg5), (Arg6 == null ? undefined : Arg6));
  return result
};

export const Foldable_foldr: <T1,T2>(f:((_1:T1, _2:T2) => T2), init:T2, mx:(null | undefined | T1)) => T2 = function <T1,T2>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_OptionBS.Foldable.foldr, Arg1, Arg2, (Arg3 == null ? undefined : Arg3));
  return result
};

export const Foldable_foldl: <T1,T2>(f:((_1:T1, _2:T2) => T1), init:T1, mx:(null | undefined | T2)) => T1 = function <T1,T2>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_OptionBS.Foldable.foldl, Arg1, Arg2, (Arg3 == null ? undefined : Arg3));
  return result
};

export const Foldable_toList: <T1>(mx:(null | undefined | T1)) => list<T1> = function <T1>(Arg1: any) {
  const result = Ley_OptionBS.Foldable.toList((Arg1 == null ? undefined : Arg1));
  return result
};

export const Foldable_fnull: <T1>(_1:(null | undefined | T1)) => boolean = function <T1>(Arg1: any) {
  const result = Ley_OptionBS.Foldable.null((Arg1 == null ? undefined : Arg1));
  return result
};

export const Foldable_flength: <T1>(mx:(null | undefined | T1)) => number = function <T1>(Arg1: any) {
  const result = Ley_OptionBS.Foldable.length((Arg1 == null ? undefined : Arg1));
  return result
};

export const Foldable_elem: <T1>(e:T1, mx:(null | undefined | T1)) => boolean = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_OptionBS.Foldable.elem, Arg1, (Arg2 == null ? undefined : Arg2));
  return result
};

export const Foldable_sum: (mx:(null | undefined | number)) => number = function (Arg1: any) {
  const result = Ley_OptionBS.Foldable.sum((Arg1 == null ? undefined : Arg1));
  return result
};

export const Foldable_product: (mx:(null | undefined | number)) => number = function (Arg1: any) {
  const result = Ley_OptionBS.Foldable.product((Arg1 == null ? undefined : Arg1));
  return result
};

export const Foldable_concat: <T1>(mxs:(null | undefined | list<T1>)) => list<T1> = function <T1>(Arg1: any) {
  const result = Ley_OptionBS.Foldable.concat((Arg1 == null ? undefined : Arg1));
  return result
};

export const Foldable_concatMap: <T1,T2>(f:((_1:T1) => list<T2>), mx:(null | undefined | T1)) => list<T2> = function <T1,T2>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_OptionBS.Foldable.concatMap, Arg1, (Arg2 == null ? undefined : Arg2));
  return result
};

export const Foldable_and: (mx:(null | undefined | boolean)) => boolean = function (Arg1: any) {
  const result = Ley_OptionBS.Foldable.con((Arg1 == null ? undefined : Arg1));
  return result
};

export const Foldable_or: (mx:(null | undefined | boolean)) => boolean = function (Arg1: any) {
  const result = Ley_OptionBS.Foldable.dis((Arg1 == null ? undefined : Arg1));
  return result
};

export const Foldable_any: <T1>(pred:((_1:T1) => boolean), mx:(null | undefined | T1)) => boolean = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_OptionBS.Foldable.any, Arg1, (Arg2 == null ? undefined : Arg2));
  return result
};

export const Foldable_all: <T1>(pred:((_1:T1) => boolean), mx:(null | undefined | T1)) => boolean = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_OptionBS.Foldable.all, Arg1, (Arg2 == null ? undefined : Arg2));
  return result
};

export const Foldable_notElem: <T1>(e:T1, mx:(null | undefined | T1)) => boolean = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_OptionBS.Foldable.notElem, Arg1, (Arg2 == null ? undefined : Arg2));
  return result
};

export const Foldable_find: <T1>(pred:((_1:T1) => boolean), mx:(null | undefined | T1)) => (null | undefined | T1) = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_OptionBS.Foldable.find, Arg1, (Arg2 == null ? undefined : Arg2));
  return result
};

export const Semigroup_sappend: <T1>(mxs:(null | undefined | list<T1>), mys:(null | undefined | list<T1>)) => (null | undefined | list<T1>) = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_OptionBS.Semigroup.sappend, (Arg1 == null ? undefined : Arg1), (Arg2 == null ? undefined : Arg2));
  return result
};

export const isSome: <T1>(m:(null | undefined | T1)) => boolean = function <T1>(Arg1: any) {
  const result = Ley_OptionBS.isSome((Arg1 == null ? undefined : Arg1));
  return result
};

export const isNone: <T1>(m:(null | undefined | T1)) => boolean = function <T1>(Arg1: any) {
  const result = Ley_OptionBS.isNone((Arg1 == null ? undefined : Arg1));
  return result
};

export const fromSome: <T1>(_1:(null | undefined | T1)) => T1 = function <T1>(Arg1: any) {
  const result = Ley_OptionBS.fromSome((Arg1 == null ? undefined : Arg1));
  return result
};

export const fromOption: <T1>(def:T1, mx:(null | undefined | T1)) => T1 = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_OptionBS.fromOption, Arg1, (Arg2 == null ? undefined : Arg2));
  return result
};

export const option: <T1,T2>(def:T1, f:((_1:T2) => T1), mx:(null | undefined | T2)) => T1 = function <T1,T2>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_OptionBS.option, Arg1, Arg2, (Arg3 == null ? undefined : Arg3));
  return result
};

export const listToOption: <T1>(xs:list<T1>) => (null | undefined | T1) = Ley_OptionBS.listToOption;

export const optionToList: <T1>(_1:(null | undefined | T1)) => list<T1> = function <T1>(Arg1: any) {
  const result = Ley_OptionBS.optionToList((Arg1 == null ? undefined : Arg1));
  return result
};

export const catOptions: <T1>(xs:list<(null | undefined | T1)>) => list<T1> = Ley_OptionBS.catOptions;

export const mapOption: <T1,T2>(f:((_1:T1) => (null | undefined | T2)), xs:list<T1>) => list<T2> = function <T1,T2>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_OptionBS.mapOption, function (Arg11: any) {
      const result1 = Arg1(Arg11);
      return (result1 == null ? undefined : result1)
    }, Arg2);
  return result
};

export const ensure: <T1>(pred:((_1:T1) => boolean), x:T1) => (null | undefined | T1) = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_OptionBS.ensure, Arg1, Arg2);
  return result
};

export const imapOption: <T1,T2>(f:((_1:number, _2:T1) => (null | undefined | T2)), xs:list<T1>) => list<T2> = function <T1,T2>(Arg1: any, Arg21: any) {
  const result = Curry._2(Ley_OptionBS.imapOption, function (Arg11: any, Arg2: any) {
      const result1 = Arg1(Arg11, Arg2);
      return (result1 == null ? undefined : result1)
    }, Arg21);
  return result
};

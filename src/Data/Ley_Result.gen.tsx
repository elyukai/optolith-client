/* TypeScript file generated from Ley_Result.re by genType. */
/* eslint-disable import/first */


// tslint:disable-next-line:no-var-requires
const CreateBucklescriptBlock = require('bs-platform/lib/es6/block.js');

// tslint:disable-next-line:no-var-requires
const Curry = require('bs-platform/lib/es6/curry.js');

// tslint:disable-next-line:no-var-requires
const Ley_ResultBS = require('./Ley_Result.bs');

import {list} from '../../src/shims/ReasonPervasives.shim';

// tslint:disable-next-line:interface-over-type-literal
export type t<l,r> = 
    { tag: "Ok"; value: r }
  | { tag: "Error"; value: l };
export type Result<l,r> = t<l,r>;

/** 
   * Return the contents of a `Error`-value or a default value otherwise.
   *
   * `fromError 1 (Error 3) == 3`
   * `fromError 1 (Ok "foo") == 1`
    */
export const Extra_fromError: <T1,T2>(def:T1, x:
    { tag: "Ok"; value: T2 }
  | { tag: "Error"; value: T1 }) => T1 = function <T1,T2>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ResultBS.Extra.fromError, Arg1, Arg2.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg2.value])
    : CreateBucklescriptBlock.__(1, [Arg2.value]));
  return result
};

/** 
   * Return the contents of a `Ok`-value or a default value otherwise.
   *
   * `fromOk 1 (Ok 3) == 3`
   * `fromOk 1 (Error "foo") == 1`
    */
export const Extra_fromOk: <T1,T2>(def:T1, x:
    { tag: "Ok"; value: T1 }
  | { tag: "Error"; value: T2 }) => T1 = function <T1,T2>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ResultBS.Extra.fromOk, Arg1, Arg2.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg2.value])
    : CreateBucklescriptBlock.__(1, [Arg2.value]));
  return result
};

/** 
   * Pull the value out of an `Either` where both alternatives have the same type.
   *
   * `\x -> fromEither (Error x ) == x`
   * `\x -> fromEither (Ok x) == x`
    */
export const Extra_fromResult: <T1>(x:
    { tag: "Ok"; value: T1 }
  | { tag: "Error"; value: T1 }) => T1 = function <T1>(Arg1: any) {
  const result = Ley_ResultBS.Extra.fromResult(Arg1.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg1.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value]));
  return result
};

export const Extra_fromError_: <T1,T2>(_1:
    { tag: "Ok"; value: T1 }
  | { tag: "Error"; value: T2 }) => T2 = function <T1,T2>(Arg1: any) {
  const result = Ley_ResultBS.Extra.fromError_(Arg1.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg1.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value]));
  return result
};

export const Extra_fromOk_: <T1,T2>(_1:
    { tag: "Ok"; value: T1 }
  | { tag: "Error"; value: T2 }) => T1 = function <T1,T2>(Arg1: any) {
  const result = Ley_ResultBS.Extra.fromOk_(Arg1.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg1.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value]));
  return result
};

/** 
   * `eitherToMaybe :: Either a b -> Maybe b`
   *
   * Given an `Either`, convert it to a `Maybe`, where `Error` becomes `Nothing`.
   *
   * `\x -> eitherToMaybe (Error x) == Nothing`
   * `\x -> eitherToMaybe (Ok x) == Just x`
    */
export const Extra_resultToOption: <T1,T2>(x:
    { tag: "Ok"; value: T1 }
  | { tag: "Error"; value: T2 }) => (null | undefined | T1) = function <T1,T2>(Arg1: any) {
  const result = Ley_ResultBS.Extra.resultToOption(Arg1.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg1.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value]));
  return result
};

/** 
   * `maybeToEither :: a -> Maybe b -> Either a b`
   *
   * Given a `Maybe`, convert it to an `Either`, providing a suitable value for
   * the `Error` should the value be `Nothing`.
   *
   * `\a b -> maybeToEither a (Just b) == Ok b`
   * `\a -> maybeToEither a Nothing == Error a`
    */
export const Extra_optionToResult: <T1,T2>(error:T1, x:(null | undefined | T2)) => 
    { tag: "Ok"; value: T2 }
  | { tag: "Error"; value: T1 } = function <T1,T2>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ResultBS.Extra.optionToResult, Arg1, (Arg2 == null ? undefined : Arg2));
  return result.tag===0
    ? {tag:"Ok", value:result[0]}
    : {tag:"Error", value:result[0]}
};

export const Extra_optionToResult_: <T1,T2>(_1:(() => T1), _2:(null | undefined | T2)) => 
    { tag: "Ok"; value: T2 }
  | { tag: "Error"; value: T1 } = function <T1,T2>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ResultBS.Extra.optionToResult_, Arg1, (Arg2 == null ? undefined : Arg2));
  return result.tag===0
    ? {tag:"Ok", value:result[0]}
    : {tag:"Error", value:result[0]}
};

export const Functor_fmap: <T1,T2,T3>(_1:((_1:T1) => T2), _2:
    { tag: "Ok"; value: T1 }
  | { tag: "Error"; value: T3 }) => 
    { tag: "Ok"; value: T2 }
  | { tag: "Error"; value: T3 } = function <T1,T2,T3>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ResultBS.Functor.fmap, Arg1, Arg2.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg2.value])
    : CreateBucklescriptBlock.__(1, [Arg2.value]));
  return result.tag===0
    ? {tag:"Ok", value:result[0]}
    : {tag:"Error", value:result[0]}
};

export const Bifunctor_bimap: <T1,T2,T3,T4>(fError:((_1:T1) => T2), fOk:((_1:T3) => T4), x:
    { tag: "Ok"; value: T3 }
  | { tag: "Error"; value: T1 }) => 
    { tag: "Ok"; value: T4 }
  | { tag: "Error"; value: T2 } = function <T1,T2,T3,T4>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_ResultBS.Bifunctor.bimap, Arg1, Arg2, Arg3.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg3.value])
    : CreateBucklescriptBlock.__(1, [Arg3.value]));
  return result.tag===0
    ? {tag:"Ok", value:result[0]}
    : {tag:"Error", value:result[0]}
};

export const Bifunctor_first: <T1,T2,T3>(f:((_1:T1) => T2), x:
    { tag: "Ok"; value: T3 }
  | { tag: "Error"; value: T1 }) => 
    { tag: "Ok"; value: T3 }
  | { tag: "Error"; value: T2 } = function <T1,T2,T3>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ResultBS.Bifunctor.first, Arg1, Arg2.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg2.value])
    : CreateBucklescriptBlock.__(1, [Arg2.value]));
  return result.tag===0
    ? {tag:"Ok", value:result[0]}
    : {tag:"Error", value:result[0]}
};

export const Bifunctor_second: <T1,T2,T3>(_1:((_1:T1) => T2), _2:
    { tag: "Ok"; value: T1 }
  | { tag: "Error"; value: T3 }) => 
    { tag: "Ok"; value: T2 }
  | { tag: "Error"; value: T3 } = function <T1,T2,T3>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ResultBS.Bifunctor.second, Arg1, Arg2.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg2.value])
    : CreateBucklescriptBlock.__(1, [Arg2.value]));
  return result.tag===0
    ? {tag:"Ok", value:result[0]}
    : {tag:"Error", value:result[0]}
};

export const Applicative_ap: <T1,T2,T3>(_1:
    { tag: "Ok"; value: ((_1:T1) => T2) }
  | { tag: "Error"; value: T3 }, _2:
    { tag: "Ok"; value: T1 }
  | { tag: "Error"; value: T3 }) => 
    { tag: "Ok"; value: T2 }
  | { tag: "Error"; value: T3 } = function <T1,T2,T3>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ResultBS.Applicative.ap, Arg1.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg1.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value]), Arg2.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg2.value])
    : CreateBucklescriptBlock.__(1, [Arg2.value]));
  return result.tag===0
    ? {tag:"Ok", value:result[0]}
    : {tag:"Error", value:result[0]}
};

export const Monad_bind: <T1,T2,T3>(_1:
    { tag: "Ok"; value: T1 }
  | { tag: "Error"; value: T2 }, _2:((_1:T1) => 
    { tag: "Ok"; value: T3 }
  | { tag: "Error"; value: T2 })) => 
    { tag: "Ok"; value: T3 }
  | { tag: "Error"; value: T2 } = function <T1,T2,T3>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ResultBS.Monad.bind, Arg1.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg1.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value]), function (Arg11: any) {
      const result1 = Arg2(Arg11);
      return result1.tag==="Ok"
        ? CreateBucklescriptBlock.__(0, [result1.value])
        : CreateBucklescriptBlock.__(1, [result1.value])
    });
  return result.tag===0
    ? {tag:"Ok", value:result[0]}
    : {tag:"Error", value:result[0]}
};

export const Monad_bindF: <T1,T2,T3>(_1:((_1:T1) => 
    { tag: "Ok"; value: T2 }
  | { tag: "Error"; value: T3 }), _2:
    { tag: "Ok"; value: T1 }
  | { tag: "Error"; value: T3 }) => 
    { tag: "Ok"; value: T2 }
  | { tag: "Error"; value: T3 } = function <T1,T2,T3>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ResultBS.Monad.bindF, function (Arg11: any) {
      const result1 = Arg1(Arg11);
      return result1.tag==="Ok"
        ? CreateBucklescriptBlock.__(0, [result1.value])
        : CreateBucklescriptBlock.__(1, [result1.value])
    }, Arg2.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg2.value])
    : CreateBucklescriptBlock.__(1, [Arg2.value]));
  return result.tag===0
    ? {tag:"Ok", value:result[0]}
    : {tag:"Error", value:result[0]}
};

export const Monad_then: <T1,T2,T3>(_1:
    { tag: "Ok"; value: T1 }
  | { tag: "Error"; value: T2 }, _2:
    { tag: "Ok"; value: T3 }
  | { tag: "Error"; value: T2 }) => 
    { tag: "Ok"; value: T3 }
  | { tag: "Error"; value: T2 } = function <T1,T2,T3>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ResultBS.Monad.then_, Arg1.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg1.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value]), Arg2.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg2.value])
    : CreateBucklescriptBlock.__(1, [Arg2.value]));
  return result.tag===0
    ? {tag:"Ok", value:result[0]}
    : {tag:"Error", value:result[0]}
};

export const Monad_kleisli: <T1,T2,T3,T4>(_1:((_1:T1) => 
    { tag: "Ok"; value: T2 }
  | { tag: "Error"; value: T3 }), _2:((_1:T2) => 
    { tag: "Ok"; value: T4 }
  | { tag: "Error"; value: T3 }), _3:T1) => 
    { tag: "Ok"; value: T4 }
  | { tag: "Error"; value: T3 } = function <T1,T2,T3,T4>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_ResultBS.Monad.kleisli, function (Arg11: any) {
      const result1 = Arg1(Arg11);
      return result1.tag==="Ok"
        ? CreateBucklescriptBlock.__(0, [result1.value])
        : CreateBucklescriptBlock.__(1, [result1.value])
    }, function (Arg12: any) {
      const result2 = Arg2(Arg12);
      return result2.tag==="Ok"
        ? CreateBucklescriptBlock.__(0, [result2.value])
        : CreateBucklescriptBlock.__(1, [result2.value])
    }, Arg3);
  return result.tag===0
    ? {tag:"Ok", value:result[0]}
    : {tag:"Error", value:result[0]}
};

export const Monad_join: <T1,T2>(x:
    { tag: "Ok"; value: 
    { tag: "Ok"; value: T1 }
  | { tag: "Error"; value: T2 } }
  | { tag: "Error"; value: T2 }) => 
    { tag: "Ok"; value: T1 }
  | { tag: "Error"; value: T2 } = function <T1,T2>(Arg1: any) {
  const result = Ley_ResultBS.Monad.join(Arg1.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg1.value.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg1.value.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value.value])])
    : CreateBucklescriptBlock.__(1, [Arg1.value]));
  return result.tag===0
    ? {tag:"Ok", value:result[0]}
    : {tag:"Error", value:result[0]}
};

export const Monad_mapM: <T1,T2,T3>(f:((_1:T1) => 
    { tag: "Ok"; value: T2 }
  | { tag: "Error"; value: T3 }), xs:list<T1>) => 
    { tag: "Ok"; value: list<T2> }
  | { tag: "Error"; value: T3 } = function <T1,T2,T3>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ResultBS.Monad.mapM, function (Arg11: any) {
      const result1 = Arg1(Arg11);
      return result1.tag==="Ok"
        ? CreateBucklescriptBlock.__(0, [result1.value])
        : CreateBucklescriptBlock.__(1, [result1.value])
    }, Arg2);
  return result.tag===0
    ? {tag:"Ok", value:result[0]}
    : {tag:"Error", value:result[0]}
};

export const Monad_liftM2: <T1,T2,T3,T4>(f:((_1:T1, _2:T2) => T3), mx:
    { tag: "Ok"; value: T1 }
  | { tag: "Error"; value: T4 }, my:
    { tag: "Ok"; value: T2 }
  | { tag: "Error"; value: T4 }) => 
    { tag: "Ok"; value: T3 }
  | { tag: "Error"; value: T4 } = function <T1,T2,T3,T4>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_ResultBS.Monad.liftM2, Arg1, Arg2.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg2.value])
    : CreateBucklescriptBlock.__(1, [Arg2.value]), Arg3.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg3.value])
    : CreateBucklescriptBlock.__(1, [Arg3.value]));
  return result.tag===0
    ? {tag:"Ok", value:result[0]}
    : {tag:"Error", value:result[0]}
};

export const Monad_liftM3: <T1,T2,T3,T4,T5>(f:((_1:T1, _2:T2, _3:T3) => T4), mx:
    { tag: "Ok"; value: T1 }
  | { tag: "Error"; value: T5 }, my:
    { tag: "Ok"; value: T2 }
  | { tag: "Error"; value: T5 }, mz:
    { tag: "Ok"; value: T3 }
  | { tag: "Error"; value: T5 }) => 
    { tag: "Ok"; value: T4 }
  | { tag: "Error"; value: T5 } = function <T1,T2,T3,T4,T5>(Arg1: any, Arg2: any, Arg3: any, Arg4: any) {
  const result = Curry._4(Ley_ResultBS.Monad.liftM3, Arg1, Arg2.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg2.value])
    : CreateBucklescriptBlock.__(1, [Arg2.value]), Arg3.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg3.value])
    : CreateBucklescriptBlock.__(1, [Arg3.value]), Arg4.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg4.value])
    : CreateBucklescriptBlock.__(1, [Arg4.value]));
  return result.tag===0
    ? {tag:"Ok", value:result[0]}
    : {tag:"Error", value:result[0]}
};

export const Monad_liftM4: <T1,T2,T3,T4,T5,T6>(f:((_1:T1, _2:T2, _3:T3, _4:T4) => T5), mx:
    { tag: "Ok"; value: T1 }
  | { tag: "Error"; value: T6 }, my:
    { tag: "Ok"; value: T2 }
  | { tag: "Error"; value: T6 }, mz:
    { tag: "Ok"; value: T3 }
  | { tag: "Error"; value: T6 }, ma:
    { tag: "Ok"; value: T4 }
  | { tag: "Error"; value: T6 }) => 
    { tag: "Ok"; value: T5 }
  | { tag: "Error"; value: T6 } = function <T1,T2,T3,T4,T5,T6>(Arg1: any, Arg2: any, Arg3: any, Arg4: any, Arg5: any) {
  const result = Curry._5(Ley_ResultBS.Monad.liftM4, Arg1, Arg2.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg2.value])
    : CreateBucklescriptBlock.__(1, [Arg2.value]), Arg3.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg3.value])
    : CreateBucklescriptBlock.__(1, [Arg3.value]), Arg4.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg4.value])
    : CreateBucklescriptBlock.__(1, [Arg4.value]), Arg5.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg5.value])
    : CreateBucklescriptBlock.__(1, [Arg5.value]));
  return result.tag===0
    ? {tag:"Ok", value:result[0]}
    : {tag:"Error", value:result[0]}
};

export const Foldable_foldr: <T1,T2,T3>(f:((_1:T1, _2:T2) => T2), init:T2, mx:
    { tag: "Ok"; value: T1 }
  | { tag: "Error"; value: T3 }) => T2 = function <T1,T2,T3>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_ResultBS.Foldable.foldr, Arg1, Arg2, Arg3.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg3.value])
    : CreateBucklescriptBlock.__(1, [Arg3.value]));
  return result
};

export const Foldable_foldl: <T1,T2,T3>(f:((_1:T1, _2:T2) => T1), init:T1, mx:
    { tag: "Ok"; value: T2 }
  | { tag: "Error"; value: T3 }) => T1 = function <T1,T2,T3>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_ResultBS.Foldable.foldl, Arg1, Arg2, Arg3.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg3.value])
    : CreateBucklescriptBlock.__(1, [Arg3.value]));
  return result
};

export const Foldable_toList: <T1,T2>(mx:
    { tag: "Ok"; value: T1 }
  | { tag: "Error"; value: T2 }) => list<T1> = function <T1,T2>(Arg1: any) {
  const result = Ley_ResultBS.Foldable.toList(Arg1.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg1.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value]));
  return result
};

export const Foldable_fnull: <T1,T2>(mx:
    { tag: "Ok"; value: T1 }
  | { tag: "Error"; value: T2 }) => boolean = function <T1,T2>(Arg1: any) {
  const result = Ley_ResultBS.Foldable.null(Arg1.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg1.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value]));
  return result
};

export const Foldable_flength: <T1,T2>(mx:
    { tag: "Ok"; value: T1 }
  | { tag: "Error"; value: T2 }) => number = function <T1,T2>(Arg1: any) {
  const result = Ley_ResultBS.Foldable.length(Arg1.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg1.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value]));
  return result
};

export const Foldable_elem: <T1,T2>(e:T1, mx:
    { tag: "Ok"; value: T1 }
  | { tag: "Error"; value: T2 }) => boolean = function <T1,T2>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ResultBS.Foldable.elem, Arg1, Arg2.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg2.value])
    : CreateBucklescriptBlock.__(1, [Arg2.value]));
  return result
};

export const Foldable_sum: <T1>(mx:
    { tag: "Ok"; value: number }
  | { tag: "Error"; value: T1 }) => number = function <T1>(Arg1: any) {
  const result = Ley_ResultBS.Foldable.sum(Arg1.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg1.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value]));
  return result
};

export const Foldable_product: <T1>(mx:
    { tag: "Ok"; value: number }
  | { tag: "Error"; value: T1 }) => number = function <T1>(Arg1: any) {
  const result = Ley_ResultBS.Foldable.product(Arg1.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg1.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value]));
  return result
};

export const Foldable_concat: <T1,T2>(mxs:
    { tag: "Ok"; value: list<T1> }
  | { tag: "Error"; value: T2 }) => list<T1> = function <T1,T2>(Arg1: any) {
  const result = Ley_ResultBS.Foldable.concat(Arg1.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg1.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value]));
  return result
};

export const Foldable_concatMap: <T1,T2,T3>(f:((_1:T1) => list<T2>), mx:
    { tag: "Ok"; value: T1 }
  | { tag: "Error"; value: T3 }) => list<T2> = function <T1,T2,T3>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ResultBS.Foldable.concatMap, Arg1, Arg2.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg2.value])
    : CreateBucklescriptBlock.__(1, [Arg2.value]));
  return result
};

export const Foldable_and: <T1>(mx:
    { tag: "Ok"; value: boolean }
  | { tag: "Error"; value: T1 }) => boolean = function <T1>(Arg1: any) {
  const result = Ley_ResultBS.Foldable.con(Arg1.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg1.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value]));
  return result
};

export const Foldable_or: <T1>(mx:
    { tag: "Ok"; value: boolean }
  | { tag: "Error"; value: T1 }) => boolean = function <T1>(Arg1: any) {
  const result = Ley_ResultBS.Foldable.dis(Arg1.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg1.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value]));
  return result
};

export const Foldable_any: <T1,T2>(pred:((_1:T1) => boolean), mx:
    { tag: "Ok"; value: T1 }
  | { tag: "Error"; value: T2 }) => boolean = function <T1,T2>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ResultBS.Foldable.any, Arg1, Arg2.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg2.value])
    : CreateBucklescriptBlock.__(1, [Arg2.value]));
  return result
};

export const Foldable_all: <T1,T2>(pred:((_1:T1) => boolean), mx:
    { tag: "Ok"; value: T1 }
  | { tag: "Error"; value: T2 }) => boolean = function <T1,T2>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ResultBS.Foldable.all, Arg1, Arg2.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg2.value])
    : CreateBucklescriptBlock.__(1, [Arg2.value]));
  return result
};

export const Foldable_notElem: <T1,T2>(e:T1, mx:
    { tag: "Ok"; value: T1 }
  | { tag: "Error"; value: T2 }) => boolean = function <T1,T2>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ResultBS.Foldable.notElem, Arg1, Arg2.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg2.value])
    : CreateBucklescriptBlock.__(1, [Arg2.value]));
  return result
};

export const Foldable_find: <T1,T2>(pred:((_1:T1) => boolean), mx:
    { tag: "Ok"; value: T1 }
  | { tag: "Error"; value: T2 }) => (null | undefined | T1) = function <T1,T2>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ResultBS.Foldable.find, Arg1, Arg2.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg2.value])
    : CreateBucklescriptBlock.__(1, [Arg2.value]));
  return result
};

/** 
 * Case analysis for the `Either` type. If the value is `Error a`, apply the
 * first function to `a` if it is `Ok b`, apply the second function to `b`.
  */
export const result: <T1,T2,T3>(fError:((_1:T1) => T2), fOk:((_1:T3) => T2), x:
    { tag: "Ok"; value: T3 }
  | { tag: "Error"; value: T1 }) => T2 = function <T1,T2,T3>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_ResultBS.result, Arg1, Arg2, Arg3.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg3.value])
    : CreateBucklescriptBlock.__(1, [Arg3.value]));
  return result
};

/** 
 * Extracts from a list of `Either` all the `Error` elements. All the `Error`
 * elements are extracted in order.
  */
export const errors: <T1,T2>(xs:list<
    { tag: "Ok"; value: T1 }
  | { tag: "Error"; value: T2 }>) => list<T2> = Ley_ResultBS.errors;

/** 
 * Extracts from a list of `Either` all the `Ok` elements. All the `Ok`
 * elements are extracted in order.
  */
export const oks: <T1,T2>(xs:list<
    { tag: "Ok"; value: T1 }
  | { tag: "Error"; value: T2 }>) => list<T1> = Ley_ResultBS.oks;

/** 
 * Partitions a list of `Either` into two lists. All the `Error` elements are
 * extracted, in order, to the first component of the output. Similarly the
 * `Ok` elements are extracted to the second component of the output.
  */
export const partitionResults: <T1,T2>(xs:list<
    { tag: "Ok"; value: T1 }
  | { tag: "Error"; value: T2 }>) => [list<T2>, list<T1>] = Ley_ResultBS.partitionResults;

/** 
 * Converts an `Error` into a `Ok` and a `Ok` into an `Error`.
  */
export const swap: <T1,T2>(_1:
    { tag: "Ok"; value: T1 }
  | { tag: "Error"; value: T2 }) => 
    { tag: "Ok"; value: T2 }
  | { tag: "Error"; value: T1 } = function <T1,T2>(Arg1: any) {
  const result = Ley_ResultBS.swap(Arg1.tag==="Ok"
    ? CreateBucklescriptBlock.__(0, [Arg1.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value]));
  return result.tag===0
    ? {tag:"Ok", value:result[0]}
    : {tag:"Error", value:result[0]}
};

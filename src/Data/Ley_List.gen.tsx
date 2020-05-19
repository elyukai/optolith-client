/* TypeScript file generated from Ley_List.re by genType. */
/* eslint-disable import/first */


const $$toRE259611490: { [key: string]: any } = {"LT": 0, "EQ": 1, "GT": 2};

// tslint:disable-next-line:no-var-requires
const Curry = require('bs-platform/lib/es6/curry.js');

// tslint:disable-next-line:no-var-requires
const Ley_ListBS = require('./Ley_List.bs');

import {list} from '../../src/shims/ReasonPervasives.shim';

import {ordering as Ley_Ord_ordering} from './Ley_Ord.gen';

import {t as Js_re_t} from './Js_re.gen';

import {t as Ley_Option_t} from './Ley_Option.gen';

export const Functor_fmap: <T1,T2>(_1:((_1:T1) => T2), _2:list<T1>) => list<T2> = function <T1,T2>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.Functor.fmap, Arg1, Arg2);
  return result
};

export const Functor_fmapF: <T1,T2>(_1:list<T1>, _2:((_1:T1) => T2)) => list<T2> = function <T1,T2>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.Functor.fmapF, Arg1, Arg2);
  return result
};

export const Applicative_ap: <T1,T2>(_1:list<((_1:T1) => T2)>, _2:list<T1>) => list<T2> = function <T1,T2>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.Applicative.ap, Arg1, Arg2);
  return result
};

export const Alternative_alt: <T1>(_1:list<T1>, _2:list<T1>) => list<T1> = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.Alternative.alt, Arg1, Arg2);
  return result
};

export const Alternative_guard: (pred:boolean) => list<void> = Ley_ListBS.Alternative.guard;

export const Monad_bind: <T1,T2>(_1:list<T1>, _2:((_1:T1) => list<T2>)) => list<T2> = function <T1,T2>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.Monad.bind, Arg1, Arg2);
  return result
};

export const Monad_bindF: <T1,T2>(_1:((_1:T1) => list<T2>), _2:list<T1>) => list<T2> = function <T1,T2>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.Monad.bindF, Arg1, Arg2);
  return result
};

export const Monad_then: <T1,T2>(_1:list<T1>, _2:list<T2>) => list<T2> = function <T1,T2>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.Monad.then_, Arg1, Arg2);
  return result
};

export const Monad_kleisli: <T1,T2,T3>(_1:((_1:T1) => list<T2>), _2:((_1:T2) => list<T3>), _3:T1) => list<T3> = function <T1,T2,T3>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_ListBS.Monad.kleisli, Arg1, Arg2, Arg3);
  return result
};

export const Monad_join: <T1>(x:list<list<T1>>) => list<T1> = Ley_ListBS.Monad.join;

export const Monad_liftM2: <T1,T2,T3>(f:((_1:T1, _2:T2) => T3), mx:list<T1>, my:list<T2>) => list<T3> = function <T1,T2,T3>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_ListBS.Monad.liftM2, Arg1, Arg2, Arg3);
  return result
};

export const Monad_liftM3: <T1,T2,T3,T4>(f:((_1:T1, _2:T2, _3:T3) => T4), mx:list<T1>, my:list<T2>, mz:list<T3>) => list<T4> = function <T1,T2,T3,T4>(Arg1: any, Arg2: any, Arg3: any, Arg4: any) {
  const result = Curry._4(Ley_ListBS.Monad.liftM3, Arg1, Arg2, Arg3, Arg4);
  return result
};

export const Monad_liftM4: <T1,T2,T3,T4,T5>(f:((_1:T1, _2:T2, _3:T3, _4:T4) => T5), mx:list<T1>, my:list<T2>, mz:list<T3>, ma:list<T4>) => list<T5> = function <T1,T2,T3,T4,T5>(Arg1: any, Arg2: any, Arg3: any, Arg4: any, Arg5: any) {
  const result = Curry._5(Ley_ListBS.Monad.liftM4, Arg1, Arg2, Arg3, Arg4, Arg5);
  return result
};

/** 
   * Right-associative fold of a structure.
   *
   * In the case of lists, `foldr`, when applied to a binary operator, a
   * starting value (typically the right-identity of the operator), and a list,
   * reduces the list using the binary operator, from right to left:
   *
   * ```foldr f z [x1, x2, ..., xn] == x1 `f` (x2 `f` ... (xn `f` z)...)```
    */
export const Foldable_foldr: <T1,T2>(f:((_1:T1, _2:T2) => T2), initial:T2, xs:list<T1>) => T2 = function <T1,T2>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_ListBS.Foldable.foldr, Arg1, Arg2, Arg3);
  return result
};

/** 
   * A variant of `foldr` that has no base case, and thus may only be applied to
   * non-empty structures.
   *
   * `foldr1 f = foldr1 f . toList`
    */
export const Foldable_foldr1: <T1>(f:((_1:T1, _2:T1) => T1), xs:list<T1>) => T1 = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.Foldable.foldr1, Arg1, Arg2);
  return result
};

/** 
   * Left-associative fold of a structure.
   *
   * In the case of lists, foldl, when applied to a binary operator, a starting
   * value (typically the left-identity of the operator), and a list, reduces
   * the list using the binary operator, from left to right:
   *
   * ```foldl f z [x1, x2, ..., xn] == (...((z `f` x1) `f` x2) `f`...) `f` xn```
    */
export const Foldable_foldl: <T1,T2>(f:((_1:T1, _2:T2) => T1), initial:T1, xs:list<T2>) => T1 = function <T1,T2>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_ListBS.Foldable.foldl, Arg1, Arg2, Arg3);
  return result
};

/** 
   * `foldl1 :: (a -> a -> a) -> [a] -> a`
   *
   * A variant of `foldl` that has no base case, and thus may only be applied to
   * non-empty structures.
   *
   * `foldl1 f = foldl1 f . toList`
    */
export const Foldable_foldl1: <T1>(f:((_1:T1, _2:T1) => T1), xs:list<T1>) => T1 = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.Foldable.foldl1, Arg1, Arg2);
  return result
};

export const Foldable_toList: <a>(xs:list<a>) => list<a> = Ley_ListBS.Foldable.toList;

export const Foldable_fnull: <T1>(xs:list<T1>) => boolean = Ley_ListBS.Foldable.null;

export const Foldable_flength: <T1>(xs:list<T1>) => number = Ley_ListBS.Foldable.length;

export const Foldable_elem: <T1>(e:T1, xs:list<T1>) => boolean = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.Foldable.elem, Arg1, Arg2);
  return result
};

export const Foldable_sum: (xs:list<number>) => number = Ley_ListBS.Foldable.sum;

export const Foldable_product: (xs:list<number>) => number = Ley_ListBS.Foldable.product;

export const Foldable_maximum: (xs:list<number>) => number = Ley_ListBS.Foldable.maximum;

export const Foldable_minimum: (xs:list<number>) => number = Ley_ListBS.Foldable.minimum;

export const Foldable_concat: <T1>(xss:list<list<T1>>) => list<T1> = Ley_ListBS.Foldable.concat;

export const Foldable_concatMap: <T1,T2>(f:((_1:T1) => list<T2>), xs:list<T1>) => list<T2> = function <T1,T2>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.Foldable.concatMap, Arg1, Arg2);
  return result
};

export const Foldable_and: (xs:list<boolean>) => boolean = Ley_ListBS.Foldable.con;

export const Foldable_or: (xs:list<boolean>) => boolean = Ley_ListBS.Foldable.dis;

export const Foldable_any: <T1>(f:((_1:T1) => boolean), xs:list<T1>) => boolean = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.Foldable.any, Arg1, Arg2);
  return result
};

export const Foldable_all: <T1>(f:((_1:T1) => boolean), xs:list<T1>) => boolean = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.Foldable.all, Arg1, Arg2);
  return result
};

export const Foldable_notElem: <T1>(e:T1, xs:list<T1>) => boolean = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.Foldable.notElem, Arg1, Arg2);
  return result
};

export const Foldable_find: <T1>(f:((_1:T1) => boolean), xs:list<T1>) => (null | undefined | T1) = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.Foldable.find, Arg1, Arg2);
  return result
};

/** 
   * `indexed` pairs each element with its index.
   *
   * ```haskell
   * >>> indexed "hello"
   * [(0,'h'),(1,'e'),(2,'l'),(3,'l'),(4,'o')]
   * ```
    */
export const Index_indexed: <T1>(xs:list<T1>) => list<[number, T1]> = Ley_ListBS.Index.indexed;

/** 
   * `deleteAt` deletes the element at an index.
   *
   * If the index is negative or exceeds list length, the original list will be
   * returned.
    */
export const Index_deleteAt: <T1>(index:number, xs:list<T1>) => list<T1> = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.Index.deleteAt, Arg1, Arg2);
  return result
};

/** 
   * `deleteAtPair` deletes the element at an index and returns a `Just` of the
   * deleted element together with the remaining list.
   *
   * If the index is negative or exceeds list length, the original list will be
   * returned, together with `Nothing` representing no deleted element.
    */
export const Index_deleteAtPair: <T1>(index:number, xs:list<T1>) => [(null | undefined | T1), list<T1>] = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.Index.deleteAtPair, Arg1, Arg2);
  return result
};

/** 
   * `setAt` sets the element at the index.
   *
   * If the index is negative or exceeds list length, the original list will be
   * returned.
    */
export const Index_setAt: <T1>(index:number, e:T1, xs:list<T1>) => list<T1> = function <T1>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_ListBS.Index.setAt, Arg1, Arg2, Arg3);
  return result
};

/** 
   * `modifyAt` applies a function to the element at the index.
   *
   * If the index is negative or exceeds list length, the original list will be
   * returned.
    */
export const Index_modifyAt: <T1>(index:number, f:((_1:T1) => T1), xs:list<T1>) => list<T1> = function <T1>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_ListBS.Index.modifyAt, Arg1, Arg2, Arg3);
  return result
};

/** 
   * `updateAt` applies a function to the element at the index, and then either
   * replaces the element or deletes it (if the function has returned
   * `Nothing`).
   *
   * If the index is negative or exceeds list length, the original list will be
   * returned.
    */
export const Index_updateAt: <T1>(index:number, f:((_1:T1) => Ley_Option_t<T1>), xs:list<T1>) => list<T1> = function <T1>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_ListBS.Index.updateAt, Arg1, Arg2, Arg3);
  return result
};

/** 
   * `insertAt` inserts an element at the given position:
   *
   * `(insertAt i x xs) !! i == x`
   *
   * If the index is negative or exceeds list length, the original list will be
   * returned. (If the index is equal to the list length, the insertion can be
   * carried out.)
    */
export const Index_insertAt: <T1>(index:number, e:T1, xs:list<T1>) => list<T1> = function <T1>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_ListBS.Index.insertAt, Arg1, Arg2, Arg3);
  return result
};

/** 
   * `imap f xs` is the list obtained by applying `f` to each element of `xs`.
    */
export const Index_imap: <T1,T2>(f:((_1:number, _2:T1) => T2), xs:list<T1>) => list<T2> = function <T1,T2>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.Index.imap, Arg1, Arg2);
  return result
};

/** 
   * Right-associative fold of a structure.
    */
export const Index_ifoldr: <T1,T2>(f:((_1:number, _2:T1, _3:T2) => T2), initial:T2, xs:list<T1>) => T2 = function <T1,T2>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_ListBS.Index.ifoldr, Arg1, Arg2, Arg3);
  return result
};

/** 
   * Left-associative fold of a structure.
    */
export const Index_ifoldl: <T1,T2>(f:((_1:T1, _2:number, _3:T2) => T1), initial:T1, xs:list<T2>) => T1 = function <T1,T2>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_ListBS.Index.ifoldl, Arg1, Arg2, Arg3);
  return result
};

/** 
   * Determines whether all elements of the structure satisfy the predicate.
    */
export const Index_iall: <T1>(f:((_1:number, _2:T1) => boolean), xs:list<T1>) => boolean = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.Index.iall, Arg1, Arg2);
  return result
};

/** 
   * Determines whether any element of the structure satisfies the predicate.
    */
export const Index_iany: <T1>(f:((_1:number, _2:T1) => boolean), xs:list<T1>) => boolean = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.Index.iany, Arg1, Arg2);
  return result
};

export const Index_iconcatMap: <T1,T2>(f:((_1:number, _2:T1) => list<T2>), xs:list<T1>) => list<T2> = function <T1,T2>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.Index.iconcatMap, Arg1, Arg2);
  return result
};

/** 
   * `ifilter`, applied to a predicate and a list, returns the list of those
   * elements that satisfy the predicate.
    */
export const Index_ifilter: <T1>(pred:((_1:number, _2:T1) => boolean), xs:list<T1>) => list<T1> = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.Index.ifilter, Arg1, Arg2);
  return result
};

/** 
   * The `ipartition` function takes a predicate a list and returns the pair of
   * lists of elements which do and do not satisfy the predicate, respectively.
   *
   * ```haskell
   * >>> partition (`elem` "aeiou") "Hello World!"
   * ("eoo","Hll Wrld!")
   * ```
    */
export const Index_ipartition: <T1>(pred:((_1:number, _2:T1) => boolean), xs:list<T1>) => [list<T1>, list<T1>] = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.Index.ipartition, Arg1, Arg2);
  return result
};

/** 
   * The `find` function takes a predicate and a structure and returns the
   * leftmost element of the structure matching the predicate, or `Nothing` if
   * there is no such element.
    */
export const Index_ifind: <T1>(pred:((_1:number, _2:T1) => boolean), xs:list<T1>) => (null | undefined | T1) = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.Index.ifind, Arg1, Arg2);
  return result
};

/** 
   * The `ifindIndex` function takes a predicate and a list and returns the
   * index of the first element in the list satisfying the predicate, or
   * `Nothing` if there is no such element.
    */
export const Index_ifindIndex: <T1>(pred:((_1:number, _2:T1) => boolean), xs:list<T1>) => (null | undefined | number) = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.Index.ifindIndex, Arg1, Arg2);
  return result
};

/** 
   * The `findIndices` function extends `findIndex`, by returning the indices of
   * all elements satisfying the predicate, in ascending order.
    */
export const Index_ifindIndices: <T1>(pred:((_1:number, _2:T1) => boolean), xs:list<T1>) => list<number> = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.Index.ifindIndices, Arg1, Arg2);
  return result
};

export const cons: <T1>(_1:T1, _2:list<T1>) => list<T1> = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.cons, Arg1, Arg2);
  return result
};

export const append: <T1>(_1:list<T1>, _2:list<T1>) => list<T1> = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.append, Arg1, Arg2);
  return result
};

/** 
 * Extract the first element of a list, which must be non-empty.
  */
export const head: <T1>(_1:list<T1>) => T1 = Ley_ListBS.head;

/** 
 * Extract the last element of a list, which must be finite and non-empty.
  */
export const last: <T1>(_1:list<T1>) => T1 = Ley_ListBS.last;

/** 
 * Extract the elements after the head of a list, which must be non-empty.
  */
export const tail: <T1>(_1:list<T1>) => list<T1> = Ley_ListBS.tail;

/** 
 * Return all the elements of a list except the last one. The list must be
 * non-empty.
  */
export const init: <T1>(_1:list<T1>) => list<T1> = Ley_ListBS.init;

/** 
 * Decompose a list into its head and tail. If the list is empty, returns
 * `Nothing`. If the list is non-empty, returns `Just (x, xs)`, where `x` is
 * the head of the list and `xs` its tail.
  */
export const uncons: <T1>(_1:list<T1>) => (null | undefined | [T1, list<T1>]) = Ley_ListBS.uncons;

/** 
 * `map f xs` is the list obtained by applying `f` to each element of `xs`.
  */
export const map: <T1,T2>(_1:((_1:T1) => T2), _2:list<T1>) => list<T2> = function <T1,T2>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.map, Arg1, Arg2);
  return result
};

/** 
 * `reverse xs` returns the elements of `xs` in reverse order. `xs` must be
 * finite.
  */
export const reverse: <T1>(xs:list<T1>) => list<T1> = Ley_ListBS.reverse;

/** 
 * The intersperse function takes an element and a list and 'intersperses' that
 * element between the elements of the list. For example,
 *
 * ```haskell
 * intersperse ',' "abcde" == "a,b,c,d,e"
 * ```
  */
export const intersperse: <T1>(sep:T1, xs:list<T1>) => list<T1> = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.intersperse, Arg1, Arg2);
  return result
};

/** 
 * `intercalate xs xss` is equivalent to `(concat (intersperse xs xss))`. It
 * inserts the list `xs` in between the lists in `xss` and concatenates the
 * result.
  */
export const intercalate: (separator:string, xs:list<string>) => string = function (Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.intercalate, Arg1, Arg2);
  return result
};

/** 
 * The `permutations` function returns the list of all permutations of the
 * argument.
 *
 * ```haskell
 * >>> permutations "abc"
 * ["abc","bac","cba","bca","cab","acb"]
 * ```
 *
 * If the given list is empty, an empty list is returned by this function.
  */
export const permutations: <T1>(xs:list<T1>) => list<list<T1>> = Ley_ListBS.permutations;

/** 
 * `scanl :: (b -> a -> b) -> b -> [a] -> [b]`
 *
 * scanl is similar to foldl, but returns a list of successive reduced values
 * from the left:
 *
 * ```scanl f z [x1, x2, ...] == [z, z `f` x1, (z `f` x1) `f` x2, ...]```
 *
 * Note that
 *
 * ```last (scanl f z xs) == foldl f z xs.```
  */
export const scanl: <T1,T2>(f:((_1:T1, _2:T2) => T1), initial:T1, xs:list<T2>) => list<T1> = function <T1,T2>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_ListBS.scanl, Arg1, Arg2, Arg3);
  return result
};

/** 
 * The `mapAccumL` function behaves like a combination of `fmap` and `foldl`;
 * it applies a function to each element of a structure, passing an
 * accumulating parameter from left to right, and returning a final value of
 * this accumulator together with the new structure.
  */
export const mapAccumL: <T1,T2,T3>(f:((_1:T1, _2:T2) => [T1, T3]), initial:T1, ls:list<T2>) => [T1, list<T3>] = function <T1,T2,T3>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_ListBS.mapAccumL, Arg1, Arg2, Arg3);
  return result
};

/** 
 * The `mapAccumR` function behaves like a combination of `fmap` and `foldr`;
 * it applies a function to each element of a structure, passing an
 * accumulating parameter from right to left, and returning a final value of
 * this accumulator together with the new structure.
  */
export const mapAccumR: <T1,T2,T3>(f:((_1:T1, _2:T2) => [T1, T3]), initial:T1, ls:list<T2>) => [T1, list<T3>] = function <T1,T2,T3>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_ListBS.mapAccumR, Arg1, Arg2, Arg3);
  return result
};

/** 
 * `replicate n x` is a list of length `n` with `x` the value of every element.
 * It is an instance of the more general `genericReplicate`, in which `n` may be
 * of any integral type.
  */
export const replicate: <T1>(len:number, x:T1) => list<T1> = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.replicate, Arg1, Arg2);
  return result
};

/** 
 * The `unfoldr` function is a 'dual' to `foldr`: while `foldr` reduces a list
 * to a summary value, `unfoldr` builds a list from a seed value. The function
 * takes the element and returns `Nothing` if it is done producing the list or
 * returns `Just (a,b)`, in which case, `a` is a prepended to the list and `b`
 * is used as the next element in a recursive call. For example,
 *
 * ```haskell
 * iterate f == unfoldr (\x -> Just (x, f x))
 * ```
 *
 * In some cases, unfoldr can undo a foldr operation:
 *
 * ```haskell
 * unfoldr f' (foldr f z xs) == xs
 * ```
 *
 * if the following holds:
 *
 * ```haskell
 * f' (f x y) = Just (x,y)
 * f' z       = Nothing
 * ```
 *
 * A simple use of unfoldr:
 *
 * ```haskell
 * >>> unfoldr (\b -> if b == 0 then Nothing else Just (b, b-1)) 10
 * [10,9,8,7,6,5,4,3,2,1]
 * ```
  */
export const unfoldr: <T1,T2>(f:((_1:T1) => (null | undefined | [T2, T1])), seed:T1) => list<T2> = function <T1,T2>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.unfoldr, function (Arg11: any) {
      const result1 = Arg1(Arg11);
      return (result1 == null ? undefined : result1)
    }, Arg2);
  return result
};

/** 
 * `take n`, applied to a list `xs`, returns the prefix of `xs` of length `n`,
 * or `xs` itself if `n > length xs`.
  */
export const take: <T1>(n:number, xs:list<T1>) => list<T1> = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.take, Arg1, Arg2);
  return result
};

/** 
 * `drop n xs` returns the suffix of `xs` after the first `n` elements, or
 * `[]` if `n > length x`.
  */
export const drop: <T1>(n:number, xs:list<T1>) => list<T1> = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.drop, Arg1, Arg2);
  return result
};

/** 
 * `splitAt n xs` returns a tuple where first element is `xs` prefix of length
 * `n` and second element is the remainder of the list.
  */
export const splitAt: <T1>(n:number, xs:list<T1>) => [list<T1>, list<T1>] = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.splitAt, Arg1, Arg2);
  return result
};

/** 
 * The `isInfixOf` function takes two strings and returns `True` if the first
 * string is contained, wholly and intact, anywhere within the second.
 *
 * ```haskell
 * >>> isInfixOf "Haskell" "I really like Haskell."
 * True
 * ```
 *
 * ```haskell
 * >>> isInfixOf "Ial" "I really like Haskell."
 * False
 * ```
 *
  */
export const isInfixOf: (x:string, y:string) => boolean = function (Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.isInfixOf, Arg1, Arg2);
  return result
};

export const elem: <T1>(_1:T1, _2:list<T1>) => boolean = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.elem, Arg1, Arg2);
  return result
};

export const notElem: <T1>(_1:T1, _2:list<T1>) => boolean = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.notElem, Arg1, Arg2);
  return result
};

/** 
 * `lookup key assocs` looks up a key in an association list.
  */
export const lookup: <T1,T2>(k:T1, xs:list<[T1, T2]>) => Ley_Option_t<T2> = function <T1,T2>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.lookup, Arg1, Arg2);
  return result
};

/** 
 * `filter`, applied to a predicate and a list, returns the list of those
 * elements that satisfy the predicate.
  */
export const filter: <T1>(pred:((_1:T1) => boolean), xs:list<T1>) => list<T1> = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.filter, Arg1, Arg2);
  return result
};

/** 
 * The `partition` function takes a predicate a list and returns the pair of
 * lists of elements which do and do not satisfy the predicate, respectively.
 *
 * ```haskell
 * >>> partition (`elem` "aeiou") "Hello World!"
 * ("eoo","Hll Wrld!")
 * ```
  */
export const partition: <T1>(pred:((_1:T1) => boolean), xs:list<T1>) => [list<T1>, list<T1>] = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.partition, Arg1, Arg2);
  return result
};

export const subscript: <T1>(_1:list<T1>, _2:number) => T1 = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.subscript, Arg1, Arg2);
  return result
};

/** 
 * The `elemIndex` function returns the index of the first element in the
 * given list which is equal (by `==`) to the query element, or `Nothing` if
 * there is no such element.
  */
export const elemIndex: <T1>(e:T1, xs:list<T1>) => Ley_Option_t<number> = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.elemIndex, Arg1, Arg2);
  return result
};

/** 
 * The `elemIndices` function extends `elemIndex`, by returning the indices of
 * all elements equal to the query element, in ascending order.
  */
export const elemIndices: <T1>(e:T1, xs:list<T1>) => list<number> = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.elemIndices, Arg1, Arg2);
  return result
};

/** 
 * The `findIndex` function takes a predicate and a list and returns the index
 * of the first element in the list satisfying the predicate, or `Nothing` if
 * there is no such element.
  */
export const findIndex: <T1>(pred:((_1:T1) => boolean), xs:list<T1>) => Ley_Option_t<number> = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.findIndex, Arg1, Arg2);
  return result
};

/** 
 * The `findIndices` function extends `findIndex`, by returning the indices of
 * all elements satisfying the predicate, in ascending order.
  */
export const findIndices: <T1>(pred:((_1:T1) => boolean), xs:list<T1>) => list<number> = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.findIndices, Arg1, Arg2);
  return result
};

/** 
 * `zip` takes two lists and returns a list of corresponding pairs. If one
 * input list is short, excess elements of the longer list are discarded.
  */
export const zip: <T1,T2>(xs:list<T1>, ys:list<T2>) => list<[T1, T2]> = function <T1,T2>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.zip, Arg1, Arg2);
  return result
};

/** 
 * `zipWith` generalises `zip` by zipping with the function given as the first
 * argument, instead of a tupling function. For example, `zipWith (+)` is
 * applied to two lists to produce the list of corresponding sums.
  */
export const zipWith: <T1,T2,T3>(f:((_1:T1, _2:T2) => T3), xs:list<T1>, ys:list<T2>) => list<T3> = function <T1,T2,T3>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_ListBS.zipWith, Arg1, Arg2, Arg3);
  return result
};

/** 
 * `lines` breaks a string up into a list of strings at newline characters. The
 * resulting strings do not contain newlines.
 *
 * Note that after splitting the string at newline characters, the last part of
 * the string is considered a line even if it doesn't end with a newline. For
 * example,
 *
 * ```haskell
 * >>> lines ""
 * []
 * ```
 *
 * ```haskell
 * >>> lines "\n"
 * [""]
 * ```
 *
 * ```haskell
 * >>> lines "one"
 * ["one"]
 * ```
 *
 * ```haskell
 * >>> lines "one\n"
 * ["one"]
 * ```
 *
 * ```haskell
 * >>> lines "one\n\n"
 * ["one",""]
 * ```
 *
 * ```haskell
 * >>> lines "one\ntwo"
 * ["one","two"]
 * ```
 *
 * ```haskell
 * >>> lines "one\ntwo\n"
 * ["one","two"]
 * ```
 *
 * Thus `lines s` contains at least as many elements as newlines in `s`.
  */
export const lines: (x:string) => list<string> = Ley_ListBS.lines;

/** 
 * The `nub` function removes duplicate elements from a list. In particular, it
 * keeps only the first occurrence of each element. (The name `nub` means
 * 'essence'.) It is a special case of `nubBy`, which allows the programmer to
 * supply their own equality test.
  */
export const nub: <T1>(xs:list<T1>) => list<T1> = Ley_ListBS.nub;

/** 
 * `delete x` removes the first occurrence of `x` from its list argument.
  */
export const sdelete: <T1>(e:T1, xs:list<T1>) => list<T1> = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.delete, Arg1, Arg2);
  return result
};

/** 
 * The `intersect` function takes the list intersection of two lists. For
 * example,
 *
 * ```haskell
 * >>> [1,2,3,4] `intersect` [2,4,6,8]
 * [2,4]
 * ```
 *
 * If the first list contains duplicates, so will the result.
 *
 * ```haskell
 * >>> [1,2,2,3,4] `intersect` [6,4,4,2]
 * [2,2,4]
 * ```
 *
 * It is a special case of `intersectBy`, which allows the programmer to supply
 * their own equality test. If the element is found in both the first and the
 * second list, the element from the first list will be used.
  */
export const intersect: <T1>(xs:list<T1>, ys:list<T1>) => list<T1> = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.intersect, Arg1, Arg2);
  return result
};

/** 
 * The `sortBy` function sorts all elements in the passed list using the passed
 * comparison function.
  */
export const sortBy: <T1>(f:((_1:T1, _2:T1) => Ley_Ord_ordering), _2:list<T1>) => list<T1> = function <T1>(Arg1: any, Arg21: any) {
  const result = Curry._2(Ley_ListBS.sortBy, function (Arg11: any, Arg2: any) {
      const result1 = Arg1(Arg11, Arg2);
      return $$toRE259611490[result1]
    }, Arg21);
  return result
};

/** 
 * The largest element of a non-empty structure with respect to the given
 * comparison function.
  */
export const maximumBy: <T1>(f:((_1:T1, _2:T1) => Ley_Ord_ordering), xs:list<T1>) => T1 = function <T1>(Arg1: any, Arg21: any) {
  const result = Curry._2(Ley_ListBS.maximumBy, function (Arg11: any, Arg2: any) {
      const result1 = Arg1(Arg11, Arg2);
      return $$toRE259611490[result1]
    }, Arg21);
  return result
};

/** 
 * The least element of a non-empty structure with respect to the given
 * comparison function.
  */
export const minimumBy: <T1>(f:((_1:T1, _2:T1) => Ley_Ord_ordering), xs:list<T1>) => T1 = function <T1>(Arg1: any, Arg21: any) {
  const result = Curry._2(Ley_ListBS.minimumBy, function (Arg11: any, Arg2: any) {
      const result1 = Arg1(Arg11, Arg2);
      return $$toRE259611490[result1]
    }, Arg21);
  return result
};

export const countBy: <T1>(f:((_1:T1) => boolean), xs:list<T1>) => number = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.countBy, Arg1, Arg2);
  return result
};

export const listToArray: <T1>(_1:list<T1>) => T1[] = Ley_ListBS.listToArray;

export const arrayToList: <T1>(_1:T1[]) => list<T1> = Ley_ListBS.arrayToList;

/** 
   * Convert a string to lower case.
    */
export const Extra_lower: (str:string) => string = Ley_ListBS.Extra.lower;

/** 
   * Remove spaces from the start of a string, see `trim`.
    */
export const Extra_trimStart: (str:string) => string = Ley_ListBS.Extra.trimStart;

/** 
   * Remove spaces from the end of a string, see `trim`.
    */
export const Extra_trimEnd: (str:string) => string = Ley_ListBS.Extra.trimEnd;

/** 
   * Escape a string that may contain `Regex`-specific notation for use in
   * regular expressions.
   *
   * ```haskell
   * escapeRegex "." == "\."
   * escapeRegex "This (or that)." == "This \(or that\)\."
   * ```
    */
export const Extra_escapeRegex: (_1:string) => string = Ley_ListBS.Extra.escapeRegex;

/** 
   * `splitOn :: (Partial, Eq a) => [a] -> [a] -> [[a]]`
   *
   * Break a list into pieces separated by the first list argument, consuming
   * the delimiter. An empty delimiter is invalid, and will cause an error to be
   * raised.
    */
export const Extra_splitOn: (del:string, x:string) => list<string> = function (Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.Extra.splitOn, Arg1, Arg2);
  return result
};

/** 
   * A composition of `not` and `null`: Checks if a list has at least one
   * element.
    */
export const Extra_notNull: <T1>(xs:list<T1>) => boolean = Ley_ListBS.Extra.notNull;

/** 
   * A composition of `not` and `null`: Checks if a string is not empty.
    */
export const Extra_notNullStr: (xs:string) => boolean = Ley_ListBS.Extra.notNullStr;

/** 
   * Non-recursive transform over a list, like `maybe`.
   *
   * ```haskell
   * list 1 (\v _ -> v - 2) [5,6,7] == 3
   * list 1 (\v _ -> v - 2) []      == 1
   * nil cons xs -> maybe nil (uncurry cons) (uncons xs) == list nil cons xs
   * ```
    */
export const Extra_list: <T1,T2>(def:T1, f:((_1:T2, _2:list<T2>) => T1), xs:list<T2>) => T1 = function <T1,T2>(Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_ListBS.Extra.list, Arg1, Arg2, Arg3);
  return result
};

/** 
   * If the list is empty returns `Nothing`, otherwise returns the `init` and
   * the `last`.
    */
export const Extra_unsnoc: <T1>(xs:list<T1>) => (null | undefined | [list<T1>, T1]) = Ley_ListBS.Extra.unsnoc;

/** 
   * Append an element to the end of a list, takes *O(n)* time.
    */
export const Extra_snoc: <T1>(xs:list<T1>, x:T1) => list<T1> = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.Extra.snoc, Arg1, Arg2);
  return result
};

/** 
   * Find the first element of a list for which the operation returns `Just`,
   * along with the result of the operation. Like `find` but useful where the
   * function also computes some expensive information that can be reused.
   * Particular useful when the function is monadic, see `firstJustM`.
   *
   * ```haskell
   * firstJust id [Nothing,Just 3]  == Just 3
   * firstJust id [Nothing,Nothing] == Nothing
   * ```
    */
export const Extra_firstJust: <T1,T2>(pred:((_1:T1) => (null | undefined | T2)), xs:list<T1>) => (null | undefined | T2) = function <T1,T2>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.Extra.firstJust, function (Arg11: any) {
      const result1 = Arg1(Arg11);
      return (result1 == null ? undefined : result1)
    }, Arg2);
  return result
};

/** 
   * Replace a subsequence everywhere it occurs. The first argument must not be
   * the empty string.
    */
export const Extra_replaceStr: (old_subseq:string, new_subseq:string, x:string) => string = function (Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_ListBS.Extra.replaceStr, Arg1, Arg2, Arg3);
  return result
};

/** 
   * `replace :: (Partial, Eq a) => RegExp -> [a] -> [a] -> [a]`
   *
   * Replace a subsequence. Use the `g` flag on the `RegExp` to replace all
   * occurrences.
    */
export const Extra_replaceStrRe: (old_subseq_rx:Js_re_t, new_subseq:string, x:string) => string = function (Arg1: any, Arg2: any, Arg3: any) {
  const result = Curry._3(Ley_ListBS.Extra.replaceStrRe, Arg1, Arg2, Arg3);
  return result
};

/** 
   * Returns the element at the passed index. If the index is invalid (index
   * negative or index >= list length), `Nothing` is returned, otherwise a
   * `Just` of the found element.
    */
export const Safe_atMay: <T1>(xs:list<T1>, i:number) => (null | undefined | T1) = function <T1>(Arg1: any, Arg2: any) {
  const result = Curry._2(Ley_ListBS.Safe.atMay, Arg1, Arg2);
  return result
};

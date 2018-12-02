/**
 * The `Maybe` type encapsulates an optional value. A value of type `Maybe a`
 * either contains a value of type `a` (represented as `Just a`), or it is empty
 * (represented as `Nothing`). Using `Maybe` is a good way to deal with errors
 * or exceptional cases without resorting to drastic measures such as `error`.
 *
 * The `Maybe` type is also a monad. It is a simple kind of error monad, where
 * all errors are represented by `Nothing`. A richer error monad can be built
 * using the `Either` type.
 *
 * @author Lukas Obermann
 * @author hackage.haskell.org (a lot of JSDocs)
 */

import * as R from 'ramda';
import { not } from '../not';
import { fromNullable, Just, Maybe, Nothing, Some } from './maybe2';
import { Tuple } from './tuple';
import { Mutable } from './typeUtils';

// CONTENT ACCESS KEY

const LIST = Symbol ('LIST');


// CONSTRUCTOR

interface ListConstructor {
  new <A extends Some>(value: ReadonlyArray<A>): List<A>;
  prototype: List<Some>;
}

export interface List<A extends Some> {
  readonly [LIST]: ReadonlyArray<A>;
  [Symbol.iterator] (): IterableIterator<A>;
  toString (): string;
}

const _List =
  function <A extends Some> (this: Mutable<List<A>>, value: ReadonlyArray<A>) {
    Object.defineProperty (this, LIST, { value });
  } as unknown as ListConstructor;

_List.prototype.toString = function (this: List<Some>) {
  return `[${this[LIST]}]`;
}

_List.prototype[Symbol.iterator] = function (this: List<Some>) {
  return this[LIST][Symbol.iterator] ();
}

/**
 * `fromElements :: (...a) -> [a]`
 *
 * Creates a new `List` instance from the passed arguments.
 */
export const fromElements = <A extends Some> (...values: A[]) => new _List (values);

/**
 * `fromElements :: Array a -> [a]`
 *
 * Creates a new `List` instance from the passed native `Array`.
 */
export const fromArray = <A extends Some> (arr: ReadonlyArray<A>) => new _List (arr);


// MONAD

/**
 * `(>>=) :: [a] -> (a -> [b]) -> [b]`
 */
export const bind =
  <A extends Some, B extends Some> (xs: List<A>) => (f: (value: A) => List<B>): List<B> =>
    fromElements (
      ...(xs[LIST] .reduce<ReadonlyArray<B>> (
        (acc, e) => [...acc, ...f (e)],
        []
      ))
    );

/**
 * `(=<<) :: (a -> [b]) -> [a] -> [b]`
 */
export const bind_ =
  <A extends Some, B extends Some> (f: (value: A) => List<B>) => (xs: List<A>): List<B> =>
    bind<A, B> (xs) (f);

/**
 * `(>>) :: forall a b. m a -> m b -> m b`
 *
 * Sequentially compose two actions, discarding any value produced by the
 * first, like sequencing operators (such as the semicolon) in imperative
 * languages.
 *
 * ```a >> b = a >>= \ _ -> b```
 */
export const then =
  <A extends Some> (xs1: List<any>) => (xs2: List<A>): List<A> =>
    bind<any, A> (xs1) (() => xs2);


/**
 * `return :: a -> [a]`
 *
 * Inject a value into a list.
 */
export const mreturn = <A extends Some> (x: A) => new _List ([x]);

/**
 * `join :: Monad m => m (m a) -> m a`
 *
 * The `join` function is the conventional monad join operator. It is used to
 * remove one level of monadic structure, projecting its bound argument into the
 * outer level.
 */
export const join =
  <A extends Some>(xs: List<List<A>>): List<A> =>
    bind<List<A>, A> (xs) (e => e);


// FUNCTOR

/**
 * `fmap :: (a -> b) -> [a] -> [b]`
 */
export const fmap =
  <A extends Some, B extends Some> (f: (value: A) => B) => (xs: List<A>): List<B> =>
    fromArray (xs[LIST] .map (f));

/**
 * `(<$) :: Functor f => a -> f b -> f a`
 *
 * Replace all locations in the input with the same value. The default
 * definition is `fmap . const`, but this may be overridden with a more
 * efficient version.
 */
export const mapReplace =
  <A extends Some, B extends Some> (x: A) =>
    fmap<B, A> (() => x);


// APPLICATIVE

/**
 * `pure :: a -> [a]`
 *
 * Inject a value into a `Maybe` type.
 */
export const pure = <A extends Some> (x: A) => new _List ([x]);

/**
 * `(<*>) :: [a -> b] -> [a] -> [b]`
 */
export const ap =
  <A extends Some, B extends Some> (ma: List<(value: A) => B>) => (m: List<A>): List<B> =>
    bind<(value: A) => B, B> (ma) (f => fmap<A, B> (f) (m));


// FOLDABLE

/**
 * `foldr :: Foldable t => (a -> b -> b) -> b -> t a -> b`
 *
 * Right-associative fold of a structure.
 *
 * In the case of lists, `foldr`, when applied to a binary operator, a
 * starting value (typically the right-identity of the operator), and a list,
 * reduces the list using the binary operator, from right to left:
 *
 * ```foldr f z [x1, x2, ..., xn] == x1 `f` (x2 `f` ... (xn `f` z)...)```
 */
export const foldr =
  <A extends Some, B extends Some>
  (f: (current: A) => (acc: B) => B) =>
  (initial: B) =>
  (xs: List<A>): B =>
    xs [LIST] .reduceRight<B> ((acc, e) => f (e) (acc), initial);

/**
 * `foldl :: Foldable t => (b -> a -> b) -> b -> t a -> b`
 *
 * Left-associative fold of a structure.
 *
 * In the case of lists, foldl, when applied to a binary operator, a starting
 * value (typically the left-identity of the operator), and a list, reduces
 * the list using the binary operator, from left to right:
 *
 * ```foldl f z [x1, x2, ..., xn] == (...((z `f` x1) `f` x2) `f`...) `f` xn```
 */
export const foldl =
  <A extends Some, B extends Some>
  (f: (acc: B) => (current: A) => B) =>
  (initial: B) =>
  (xs: List<A>): B =>
    xs [LIST] .reduce<B> ((acc, e) => f (acc) (e), initial);

/**
 * `foldr1 :: (a -> a -> a) -> t a -> a`
 *
 * A variant of `foldr` that has no base case, and thus may only be applied to
 * non-empty structures.
 *
 * `foldr1 f = foldr1 f . toList`
 */
export const foldr1 =
  <A extends Some>
  (f: (current: A) => (acc: A) => A) =>
  (xs: List<A>): A => {
    if (xs [LIST] .length > 0) {
      const _init = xs [LIST] .slice (0, -1);
      const _last = xs [LIST] [xs [LIST] .length - 1];

      return _init .reduceRight<A> ((acc, e) => f (e) (acc), _last);
    }

    throw new TypeError ('Cannot apply foldr1 to an empty list.');
  };

/**
 * `foldl1 :: (a -> a -> a) -> t a -> a`
 *
 * A variant of `foldl` that has no base case, and thus may only be applied to
 * non-empty structures.
 *
 * `foldl1 f = foldl1 f . toList`
 */
export const foldl1 =
  <A extends Some>
  (f: (acc: A) => (current: A) => A) =>
  (xs: List<A>): A => {
    if (xs [LIST] .length > 0) {
      const [_head, ..._tail] = xs;

      return _tail .reduce<A> ((acc, e) => f (acc) (e), _head);
    }

    throw new TypeError ('Cannot apply foldl1 to an empty list.');
  };

/**
 * `toList :: t a -> [a]`
 *
 * List of elements of a structure, from left to right.
 */
export const toList = <A extends Some>(xs: List<A>): List<A> => xs;

/**
 * `null :: t a -> Bool`
 *
 * Test whether the structure is empty. The default implementation is optimized
 * for structures that are similar to cons-lists, because there is no general
 * way to do better.
 */
export const fnull = (xs: List<any>): boolean => xs [LIST] .length === 0;

/**
 * `length :: t a -> Int`
 *
 * Returns the size/length of a finite structure as an `Int`. The default
 * implementation is optimized for structures that are similar to cons-lists,
 * because there is no general way to do better.
 */
export const length = (xs: List<any>): number => xs [LIST] .length;

/**
 * `elem :: (Foldable t, Eq a) => a -> t a -> Bool`
 *
 * Does the element occur in the structure?
 */
export const elem = <A extends Some>(e: A) => (xs: List<A>): boolean => xs [LIST] .includes (e);

/**
 * `elem_ :: (Foldable t, Eq a) => t a -> a -> Bool`
 *
 * Does the element occur in the structure?
 *
 * Same as `List.elem` but with arguments switched.
 */
export const elem_ = <A extends Some>(xs: List<A>) => (e: A): boolean => elem (e) (xs);

/**
 * `sum :: (Foldable t, Num a) => t a -> a`
 *
 * The `sum` function computes the sum of the numbers of a structure.
 */
export const sum = (xs: List<number>): number => xs [LIST] .reduce ((acc, e) => acc + e, 0);

/**
 * `product :: (Foldable t, Num a) => t a -> a`
 *
 * The `product` function computes the product of the numbers of a structure.
 */
export const product = (xs: List<number>): number => xs [LIST] .reduce ((acc, e) => acc * e, 1);

/**
 * `maximum :: forall a. (Foldable t, Ord a) => t a -> a`
 *
 * The largest element of a non-empty structure.
 */
export const maximum = (xs: List<number>): number => Math.max (...xs);

/**
 * `minimum :: forall a. (Foldable t, Ord a) => t a -> a`
 *
 * The least element of a non-empty structure.
 */
export const minimum = (xs: List<number>): number => Math.min (...xs);

// Specialized folds

/**
 * `concat :: [[a]] -> [a]`
 *
 * The concatenation of all the elements of a container of lists.
 */
export const concat = join;

/**
 * `concatMap :: (a -> [b]) -> [a] -> [b]`
 *
 * Map a function over all the elements of a container and concatenate the
 * resulting lists.
 */
export const concatMap = bind_;

/**
 * `and :: Foldable t => t Bool -> Bool`
 *
 * `and` returns the conjunction of a container of Bools. For the result to be
 * `True`, the container must be finite; `False`, however, results from a
 * `False` value finitely far from the left end.
 */
export const and = (xs: List<boolean>): boolean => xs [LIST] .every (e => e);

/**
 * `or :: Foldable t => t Bool -> Bool`
 *
 * `or` returns the disjunction of a container of Bools. For the result to be
 * `False`, the container must be finite; `True`, however, results from a
 * `True` value finitely far from the left end.
 */
export const or = (xs: List<boolean>): boolean => xs [LIST] .some (e => e);

/**
 * `any :: Foldable t => (a -> Bool) -> t a -> Bool`
 *
 * Determines whether any element of the structure satisfies the predicate.
 */
export const any =
  <A extends Some>(f: (x: A) => boolean) => (xs: List<A>): boolean =>
    xs [LIST] .some (f);

/**
 * `all :: Foldable t => (a -> Bool) -> t a -> Bool`
 *
 * Determines whether all elements of the structure satisfy the predicate.
 */
export const all =
  <A extends Some>(f: (x: A) => boolean) => (xs: List<A>): boolean =>
    xs [LIST] .every (f);

// Searches

/**
 * `notElem :: (Foldable t, Eq a) => a -> t a -> Bool`
 *
 * `notElem` is the negation of `elem`.
 */
export const notElem = <A> (e: A) => R.pipe (
  elem<A> (e),
  not
);

interface Find {
  /**
   * `find :: Foldable t => (a -> Bool) -> t a -> Maybe a`
   *
   * The `find` function takes a predicate and a structure and returns the
   * leftmost element of the structure matching the predicate, or `Nothing` if
   * there is no such element.
   */
  <A, A1 extends A> (pred: (x: A) => x is A1): (xs: List<A>) => Maybe<A1>;
  /**
   * `find :: Foldable t => (a -> Bool) -> t a -> Maybe a`
   *
   * The `find` function takes a predicate and a structure and returns the
   * leftmost element of the structure matching the predicate, or `Nothing` if
   * there is no such element.
   */
  <A> (pred: (x: A) => boolean): (xs: List<A>) => Maybe<A>;
}

/**
 * `find :: Foldable t => (a -> Bool) -> t a -> Maybe a`
 *
 * The `find` function takes a predicate and a structure and returns the
 * leftmost element of the structure matching the predicate, or `Nothing` if
 * there is no such element.
 */
export const find: Find =
  <A> (pred: (x: A) => boolean) => (xs: List<A>): Maybe<A> =>
    fromNullable (xs [LIST] .find (pred));


// ALTERNATIVE

/**
 * `alt :: [a] -> [a] -> [a]`
 *
 * The `alt` function takes a list of the same type. If the first list
 * is empty, it returns the second list, otherwise it returns the
 * first.
 */
export const alt =
  <A extends Some> (xs1: List<A>) => (xs2: List<A>): List<A> =>
    fnull (xs1) ? xs2 : xs1;

/**
 * `alt :: f a -> f a -> f a`
 *
 * The `alt` function takes a `Maybe` of the same type. If the second `Maybe`
 * is `Nothing`, it returns the first `Maybe`, otherwise it returns the
 * second.
 *
 * This is the same as `Maybe.alt` but with arguments swapped.
 */
export const alt_ =
  <A extends Some> (xs1: List<A>) => (xs2: List<A>): List<A> =>
    alt (xs2) (xs1);

/**
 * `empty :: () -> Nothing`
 *
 * Returns the empty `Maybe`.
 */
export const empty = <A extends Some> () => new _List<A> ([]);


// EQ

/**
 * `(==) :: Maybe a -> Maybe a -> Bool`
 *
 * Returns if both given values are equal.
 */
export const equals =
  <A extends Some> (xs1: List<A>) => (xs2: List<A>): boolean =>
    length (xs1) === length (xs2)
    && xs1 [LIST] .every ((e, i) => e === xs2 [LIST] [i]);

/**
 * `(!=) :: Maybe a -> Maybe a -> Bool`
 *
 * Returns if both given values are not equal.
 */
export const notEquals =
  <A extends Some> (xs1: List<A>) => (xs2: List<A>): boolean =>
    !equals (xs1) (xs2);


// SHOW

/**
 * `show :: [a] -> String`
 */
export const show = (xs: List<any>): string => xs.toString ();


// BASIC FUNCTIONS

/**
 * `(++) :: [a] -> [a] -> [a]`
 *
 * Append two lists.
 */
export const append =
  <A> (xs1: List<A>) => (xs2: List<A>): List<A> =>
    fromElements (...xs1, ...xs2);

/**
 * `(:) :: [a] -> a -> [a]`
 *
 * Prepends an element to the list.
 */
export const cons = <A> (xs: List<A>) => (e: A): List<A> => fromElements (e, ...xs);

/**
 * `(:) :: a -> [a] -> [a]`
 *
 * Prepends an element to the list.
 *
 * Same as `cons` but with arguments flipped.
 */
export const cons_ = <A> (e: A) => (xs: List<A>): List<A> => cons (xs) (e);

/**
 * `(!!) :: [a] -> Int -> Maybe a`
 *
 * List index (subscript) operator, starting from 0. If the index is invalid,
 * returns `Nothing`, otherwise `Just a`.
 */
export const subscript =
  <A> (xs: List<A>) => (index: number): Maybe<A> =>
    fromNullable (xs [LIST] [index]);

/**
 * `(!!) :: Int -> [a] -> Maybe a`
 *
 * List index (subscript) operator, starting from 0. If the index is invalid,
 * returns `Nothing`, otherwise `Just a`.
 *
 * Same as `subscript` but with arguments flipped.
 */
export const subscript_ =
  (index: number) => <A>(xs: List<A>): Maybe<A> =>
    subscript (xs) (index);

/**
 * `head :: [a] -> a`
 *
 * Extract the first element of a list, which must be non-empty.
 */
export const head = <A> (xs: List<A>): A => {
  if (fnull (xs)) {
    throw new TypeError (
      `head does only work on non-empty lists. If you do not know whether the list is empty or not, use listToMaybe instead.`
    );
  }

  return xs [LIST] [0];
}

/**
 * `last :: [a] -> a`
 *
 * Extract the last element of a list, which must be finite and non-empty.
 */
export const last = <A> (xs: List<A>): A => {
  if (fnull (xs)) {
    throw new TypeError (`last does only work on non-empty lists.`);
  }

  return xs [LIST] [length (xs) - 1];
}

/**
 * `last_ :: [a] -> Maybe a`
 *
 * Extract the last element of a list, which must be finite. If the list is
 * empty, it returns `Nothing`. If the list is not empty, it returns the last
 * element wrapped in a `Just`.
 *
 * A safe version of `List.last`.
 */
export const last_ = <A> (xs: List<A>): Maybe<A> => fnull (xs) ? Nothing : Just (last (xs));

/**
 * `tail :: [a] -> [a]`
 *
 * Extract the elements after the head of a list, which must be non-empty.
 */
export const tail = <A> (xs: List<A>): List<A> => {
  if (fnull (xs)) {
    throw new TypeError (`tail does only work on non-empty lists.`);
  }

  return fromArray (xs [LIST] .slice (1));
}

/**
 * `tail_ :: [a] -> Maybe [a]`
 *
 * Extract the elements after the head of a list. If the list is
 * empty, it returns `Nothing`. If the list is not empty, it returns the
 * elements wrapped in a `Just`.
 *
 * A safe version of `List.tail`.
 */
export const tail_ =
  <A> (xs: List<A>): Maybe<List<A>> =>
    fnull (xs) ? Nothing : Just (tail (xs));

/**
 * `init :: [a] -> [a]`
 *
 * Return all the elements of a list except the last one. The list must be
 * non-empty.
 */
export const init = <A> (xs: List<A>): List<A> => {
  if (fnull (xs)) {
    throw new TypeError (`init does only work on non-empty lists.`);
  }

  return fromArray (xs [LIST] .slice (0, -1));
}

/**
 * `init_ :: [a] -> Maybe [a]`
 *
 * Return all the elements of a list except the last one. If the list is
 * empty, it returns `Nothing`. If the list is not empty, it returns the
 * elements wrapped in a `Just`.
 *
 * A safe version of `List.init`.
 */
export const init_ =
  <A> (xs: List<A>): Maybe<List<A>> =>
    fnull (xs) ? Nothing : Just (init (xs));

/**
 * `uncons :: [a] -> Maybe (a, [a])`
 *
 * Decompose a list into its head and tail. If the list is empty, returns
 * `Nothing`. If the list is non-empty, returns `Just (x, xs)`, where `x` is
 * the head of the list and `xs` its tail.
 */
export const uncons =
  <A> (xs: List<A>): Maybe<Tuple<A, List<A>>> =>
    fnull (xs) ? Nothing : Just (Tuple.of<A, List<A>> (head (xs)) (tail (xs)));


// LIST TRANSFORMATIONS

/**
 * `map :: (a -> b) -> [a] -> [b]`
 *
 * `map f xs` is the list obtained by applying `f` to each element of `xs`.
 */
export const map = fmap;

//   /**
//    * `imap :: (Int -> a -> b) -> [a] -> [b]`
//    *
//    * `imap f xs` is the list obtained by applying `f` to each element of `xs`.
//    */
//   imap<U> (fn: (index: number) => (x: T) => U): List<U> {
//     return List.fromArray (this.value.map ((e, i) => fn (i) (e)));
//   }

//   /**
//    * `imap :: (Int -> a -> b) -> [a] -> [b]`
//    *
//    * `imap f xs` is the list obtained by applying `f` to each element of `xs`.
//    */
//   static imap<T, U> (fn: (index: number) => (x: T) => U): (list: List<T>) => List<U> {
//     return list => List.fromArray (list.value.map ((e, i) => fn (i) (e)));
//   }

/**
 * `reverse :: [a] -> [a]`
 *
 * `reverse xs` returns the elements of `xs` in reverse order. `xs` must be
 * finite.
 */
export const reverse = <A extends Some>(xs: List<A>): List<A> => fromArray ([...xs].reverse ());

/**
 * `intercalate :: [a] -> [[a]] -> [a]`
 *
 * `intercalate xs xss` is equivalent to `(concat (intersperse xs xss))`. It
 * inserts the list `xs` in between the lists in `xss` and concatenates the
 * result.
 */
export const intercalate =
  (separator: string) => (list: List<number | string>): string =>
    list [LIST] .join (separator);

//   // REDUCING LISTS (FOLDS)

/**
 * `ifoldl :: Foldable t => (b -> Int -> a -> b) -> b -> t a -> b`
 *
 * Left-associative fold of a structure.
 *
 * In the case of lists, `ifoldl`, when applied to a binary operator, a
 * starting value (typically the left-identity of the operator), and a list,
 * reduces the list using the binary operator, from left to right.
 */
// static ifoldl<T extends Some, U extends Some> (
//   fn: (acc: U) => (index: number) => (current: T) => U
// ): (initial: U) => (list: List<T>) => U {
//   return initial => list => list.value.reduce<U> (
//     (acc, e, index) => fn (acc) (index) (e),
//     initial
//   );
// }

/**
 * `ifoldr :: (Int -> a -> b -> b) -> b -> [a] -> b`
 *
 * Right-associative fold of a structure.
 */
// static ifoldr<T extends Some, U extends Some> (
//   fn: (index: number) => (current: T) => (acc: U) => U
// ): (initial: U) => (list: List<T>) => U {
//   return initial => list => list.value.reduceRight<U> (
//     (acc, e, index) => fn (index) (e) (acc),
//     initial
//   );
// }

//   // // SPECIAL FOLDS

//   /**
//    * `concat :: [[a]] -> [a]`
//    *
//    * The concatenation of all the elements of a container of lists.
//    */
//   concat<U> (this: List<List<U>>): List<U> {
//     return List.fromArray (
//       this.value.reduce<U[]> (
//         (acc, e) => acc.concat (e.value),
//         []
//       )
//     );
//   }

//   /**
//    * `concat :: [[a]] -> [a]`
//    *
//    * The concatenation of all the elements of a container of lists.
//    */
//   static concat<U> (list: List<List<U>>): List<U> {
//     return List.fromArray (
//       list.value.reduce<U[]> (
//         (acc, e) => acc.concat (e.value),
//         []
//       )
//     );
//   }

//   /**
//    * `and :: Foldable t => t Bool -> Bool`
//    *
//    * `and` returns the conjunction of a container of Bools. For the result to be
//    * `True`, the container must be finite; `False`, however, results from a
//    * `False` value finitely far from the left end.
//    */
//   and (this: List<boolean>): boolean {
//     return this.value.every (e => e);
//   }

//   /**
//    * `or :: Foldable t => t Bool -> Bool`
//    *
//    * `or` returns the disjunction of a container of Bools. For the result to be
//    * `False`, the container must be finite; `True`, however, results from a
//    * `True` value finitely far from the left end.
//    */
//   or (this: List<boolean>): boolean {
//     return this.value.some (e => e);
//   }

//   /**
//    * `any :: Foldable t => (a -> Bool) -> t a -> Bool`
//    *
//    * Determines whether any element of the structure satisfies the predicate.
//    */
//   any (fn: (x: T) => boolean): boolean {
//     return this.value.some (fn);
//   }

//   /**
//    * `any :: Foldable t => (a -> Bool) -> t a -> Bool`
//    *
//    * Determines whether any element of the structure satisfies the predicate.
//    */
//   static any<T> (fn: (x: T) => boolean): (list: List<T>) => boolean {
//     return list => list.value.some (fn);
//   }

//   /**
//    * `iany :: Foldable t => (Int -> a -> Bool) -> t a -> Bool`
//    *
//    * Determines whether any element of the structure satisfies the predicate.
//    */
//   iany (fn: (index: number) => (x: T) => boolean): boolean {
//     return this.value.some ((e, i) => fn (i) (e));
//   }

//   /**
//    * `all :: Foldable t => (a -> Bool) -> t a -> Bool`
//    *
//    * Determines whether all elements of the structure satisfy the predicate.
//    */
//   all (fn: (x: T) => boolean): boolean {
//     return this.value.every (fn);
//   }

//   /**
//    * `iall :: Foldable t => (Int -> a -> Bool) -> t a -> Bool`
//    *
//    * Determines whether all elements of the structure satisfy the predicate.
//    */
//   iall (fn: (index: number) => (x: T) => boolean): boolean {
//     return this.value.every ((e, i) => fn (i) (e));
//   }

//   // BUILDING LISTS

//   // SCANS

//   /**
//    * `scanl :: (b -> a -> b) -> b -> [a] -> [b]`
//    *
//    * scanl is similar to foldl, but returns a list of successive reduced values
//    * from the left:
//    *
//    * ```scanl f z [x1, x2, ...] == [z, z `f` x1, (z `f` x1) `f` x2, ...]```
//    *
//    * Note that
//    *
//    * ```last (scanl f z xs) == foldl f z xs.```
//    */
//   scanl<U extends Some> (fn: (acc: U) => (current: T) => U): (initial: U) => List<U> {
//     return initial => List.of (
//       ...this.value.reduce<U[]> (
//         (acc, e, index) => [...acc, fn (acc[index]) (e)],
//         [initial]
//       )
//     );
//   }

//   // ACCUMULATING MAPS

//   /**
//    * `mapAccumL :: Traversable t => (a -> b -> (a, c)) -> a -> t b -> (a, t c)`
//    *
//    * The `mapAccumL` function behaves like a combination of `fmap` and `foldl`;
//    * it applies a function to each element of a structure, passing an
//    * accumulating parameter from left to right, and returning a final value of
//    * this accumulator together with the new structure.
//    */
//   static mapAccumL<A, B, C> (
//     f: (acc: A) => (current: B) => Tuple<A, C>
//   ): (initial: A) => (list: List<B>) => Tuple<A, List<C>> {
//     return initial => list => {
//       const pair = list
//         .toArray ()
//         .reduce<[A, C[]]> (
//           (acc, current) => {
//             const result = f (acc[0]) (current);

//             return [Tuple.fst (result), [...acc[1], Tuple.snd (result)]]
//           },
//           [initial, []]
//         );

//       return Tuple.of<A, List<C>> (pair[0]) (List.fromArray (pair[1]));
//     };
//   }

//   // UNFOLDING

//   /**
//    * `unfoldr :: (b -> Maybe (a, b)) -> b -> [a]`
//    *
//    * The `unfoldr` function is a 'dual' to `foldr`: while `foldr` reduces a list
//    * to a summary value, `unfoldr` builds a list from a seed value. The function
//    * takes the element and returns `Nothing` if it is done producing the list or
//    * returns `Just (a,b)`, in which case, `a` is a prepended to the list and `b`
//    * is used as the next element in a recursive call. For example,
// ```hs
// iterate f == unfoldr (\x -> Just (x, f x))
// ```
//    *
//    * In some cases, unfoldr can undo a foldr operation:
//    *
// ```hs
// unfoldr f' (foldr f z xs) == xs
// ```
//    *
//    * if the following holds:
//    *
// ```hs
// f' (f x y) = Just (x,y)
// f' z       = Nothing
// ```
//    *
//    * A simple use of unfoldr:
//    *
// ```hs
// >>> unfoldr (\b -> if b == 0 then Nothing else Just (b, b-1)) 10
// [10,9,8,7,6,5,4,3,2,1]
// ```
//    */
//   static unfoldr<T, U> (f: (value: U) => Maybe<Tuple<T, U>>): (seedValue: U) => List<T> {
//     const buildList = (acc: List<T>) => (value: U): List<T> => {
//       const result = f (value);

//       if (Maybe.isJust (result)) {
//         const newValue = Maybe.fromJust (result);

//         return buildList (acc) (Tuple.snd (newValue)) .cons (Tuple.fst (newValue));
//       }

//       return acc;
//     };

//     return buildList (List.empty ());
//   }

//   // EXTRACTING SUBLISTS

//   /**
//    * `take :: Int -> [a] -> [a]`
//    *
//    * `take n`, applied to a list `xs`, returns the prefix of `xs` of length `n`,
//    * or `xs` itself if `n > length xs`.
//    */
//   take (length: number): List<T> {
//     return this.value.length < length
//       ? this
//       : List.fromArray (this.value.slice (0, length));
//   }

//   /**
//    * `take :: Int -> [a] -> [a]`
//    *
//    * `take n`, applied to a list `xs`, returns the prefix of `xs` of length `n`,
//    * or `xs` itself if `n > length xs`.
//    */
//   static take<T> (length: number): (list: List<T>) => List<T> {
//     return list => list.value.length < length
//       ? list
//       : List.fromArray (list.value.slice (0, length));
//   }

//   /**
//    * `drop :: Int -> [a] -> [a]`
//    *
//    * `drop n xs` returns the suffix of `xs` after the first `n` elements, or
//    * `[]` if `n > length x`.
//    */
//   static drop<T> (length: number): (list: List<T>) => List<T> {
//     return list => list.value.length < length
//       ? List.empty ()
//       : List.fromArray (list.value.slice (length));
//   }

//   /**
//    * `splitAt :: Int -> [a] -> ([a], [a])`
//    *
//    * `splitAt n xs` returns a tuple where first element is `xs` prefix of length
//    * `n` and second element is the remainder of the list.
//    */
//   static splitAt<T> (length: number): (list: List<T>) => Tuple<List<T>, List<T>> {
//     return list => Tuple.of<List<T>, List<T>>
//       (List.fromArray (list.value.slice (0, length)))
//       (List.fromArray (list.value.slice (length)));
//   }

//   // SEARCHING BY EQUALITY

//   /**
//    * `elem :: (Foldable t, Eq a) => a -> t a -> Bool`
//    *
//    * Does the element occur in the structure?
//    */
//   elem (e: T): boolean {
//     return this.value.includes (e);
//   }


//   /**
//    * `notElem :: (Foldable t, Eq a) => a -> t a -> Bool`
//    *
//    * `notElem` is the negation of `elem`.
//    */
//   notElem (e: T): boolean {
//     return !this.elem (e);
//   }

//   /**
//    * `notElem :: (Foldable t, Eq a) => a -> t a -> Bool`
//    *
//    * `notElem` is the negation of `elem`.
//    */
//   static notElem<T> (e: T): (list: List<T>) => boolean {
//     return R.pipe (
//       List.elem (e),
//       not
//     );
//   }

//   /**
//    * `notElem_ :: (Foldable t, Eq a) => t a -> a -> Bool`
//    *
//    * `notElem_` is the negation of `elem_`.
//    *
//    * Same as `List.elem_` but with arguments swapped.
//    */
//   static notElem_<T> (list: List<T>): (e: T) => boolean {
//     return R.pipe (
//       List.elem_ (list),
//       not
//     );
//   }

//   /**
//    * `lookup :: Eq a => a -> [(a, b)] -> Maybe b`
//    *
//    * `lookup key assocs` looks up a key in an association list.
//    */
//   lookup<K, V> (this: List<Tuple<K, V>>, key: K): Maybe<V> {
//     return Maybe.fmap<Tuple<K, V>, V> (Tuple.snd) (this.find (e => Tuple.fst (e) === key));
//   }

//   /**
//    * `lookup :: Eq a => a -> [(a, b)] -> Maybe b`
//    *
//    * `lookup key assocs` looks up a key in an association list.
//    */
//   static lookup<A, B> (key: A): (list: List<Tuple<A, B>>) => Maybe<B> {
//     return list => Maybe.fmap<Tuple<A, B>, B> (Tuple.snd)
//                                               (list .find (e => Tuple.fst (e) === key));
//   }

//   // SEARCHING WITH A PREDICATE

//   /**
//    * `find :: Foldable t => (a -> Bool) -> t a -> Maybe a`
//    *
//    * The `find` function takes a predicate and a structure and returns the
//    * leftmost element of the structure matching the predicate, or `Nothing` if
//    * there is no such element.
//    */
//   find<U extends T> (pred: (x: T) => x is U): Maybe<U>;
//   /**
//    * `find :: Foldable t => (a -> Bool) -> t a -> Maybe a`
//    *
//    * The `find` function takes a predicate and a structure and returns the
//    * leftmost element of the structure matching the predicate, or `Nothing` if
//    * there is no such element.
//    */
//   find (pred: (x: T) => boolean): Maybe<T>;
//   find (pred: (x: T) => boolean): Maybe<T> {
//     return Maybe.fromNullable (this.value.find (pred));
//   }

//   /**
//    * `find :: Foldable t => (a -> Bool) -> t a -> Maybe a`
//    *
//    * The `find` function takes a predicate and a structure and returns the
//    * leftmost element of the structure matching the predicate, or `Nothing` if
//    * there is no such element.
//    */
//   static find<T, U extends T> (pred: (x: T) => x is U): (list: List<T>) => Maybe<U>;
//   /**
//    * `find :: Foldable t => (a -> Bool) -> t a -> Maybe a`
//    *
//    * The `find` function takes a predicate and a structure and returns the
//    * leftmost element of the structure matching the predicate, or `Nothing` if
//    * there is no such element.
//    */
//   static find<T> (pred: (x: T) => boolean): (list: List<T>) => Maybe<T>;
//   static find<T> (pred: (x: T) => boolean): (list: List<T>) => Maybe<T> {
//     return list => list.find (pred);
//   }

//   /**
//    * `ifind :: Foldable t => (Int -> a -> Bool) -> t a -> Maybe a`
//    *
//    * The `find` function takes a predicate and a structure and returns the
//    * leftmost element of the structure matching the predicate, or `Nothing` if
//    * there is no such element.
//    */
//   ifind<U extends T> (pred: (index: number) => (x: T) => x is U): Maybe<U>;
//   /**
//    * `ifind :: Foldable t => (Int -> a -> Bool) -> t a -> Maybe a`
//    *
//    * The `find` function takes a predicate and a structure and returns the
//    * leftmost element of the structure matching the predicate, or `Nothing` if
//    * there is no such element.
//    */
//   ifind (pred: (index: number) => (x: T) => boolean): Maybe<T>;
//   ifind (pred: (index: number) => (x: T) => boolean): Maybe<T> {
//     return Maybe.fromNullable (this.value.find ((e, i) => pred (i) (e)));
//   }

//   /**
//    * `filter :: (a -> Bool) -> [a] -> [a]`
//    *
//    * `filter`, applied to a predicate and a list, returns the list of those
//    * elements that satisfy the predicate.
//    */
//   filter<U extends T> (pred: (x: T) => x is U): List<U>;
//   /**
//    * `filter :: (a -> Bool) -> [a] -> [a]`
//    *
//    * `filter`, applied to a predicate and a list, returns the list of those
//    * elements that satisfy the predicate.
//    */
//   filter (pred: (x: T) => boolean): List<T>;
//   filter (pred: (x: T) => boolean): List<T> {
//     return List.fromArray (this.value.filter (pred));
//   }

//   /**
//    * `filter :: (a -> Bool) -> [a] -> [a]`
//    *
//    * `filter`, applied to a predicate and a list, returns the list of those
//    * elements that satisfy the predicate.
//    */
//   static filter<T, U extends T> (pred: (x: T) => x is U): (list: List<T>) => List<U>;
//   /**
//    * `filter :: (a -> Bool) -> [a] -> [a]`
//    *
//    * `filter`, applied to a predicate and a list, returns the list of those
//    * elements that satisfy the predicate.
//    */
//   static filter<T> (pred: (x: T) => boolean): (list: List<T>) => List<T>;
//   static filter<T> (pred: (x: T) => boolean): (list: List<T>) => List<T> {
//     return list => list.filter (pred);
//   }

//   /**
//    * `ifilter :: (Int -> a -> Bool) -> [a] -> [a]`
//    *
//    * `ifilter`, applied to a predicate and a list, returns the list of those
//    * elements that satisfy the predicate.
//    */
//   ifilter<U extends T> (pred: (index: number) => (x: T) => x is U): List<U>;
//   /**
//    * `ifilter :: (Int -> a -> Bool) -> [a] -> [a]`
//    *
//    * `ifilter`, applied to a predicate and a list, returns the list of those
//    * elements that satisfy the predicate.
//    */
//   ifilter (pred: (index: number) => (x: T) => boolean): List<T>;
//   ifilter (pred: (index: number) => (x: T) => boolean): List<T> {
//     return List.fromArray (this.value.filter ((e, i) => pred (i) (e)));
//   }

//   /**
//    * `partition :: (a -> Bool) -> [a] -> ([a], [a])`
//    *
//    * The `partition` function takes a predicate a list and returns the pair of
//    * lists of elements which do and do not satisfy the predicate, respectively.
//    *
// ```
// >>> partition (`elem` "aeiou") "Hello World!"
// ("eoo","Hll Wrld!")
// ```
//    */
//   partition (f: (value: T) => boolean): Tuple<List<T>, List<T>> {
//     const pair = this.value.reduce<[List<T>, List<T>]> (
//       ([included, excluded], value) => f (value)
//         ? [included.append (value), excluded]
//         : [included, excluded.append (value)],
//       [List.empty (), List.empty ()]
//     );

//     return Tuple.of<List<T>, List<T>> (pair[0]) (pair[1]);
//   }

//   /**
//    * `ipartition :: (Int ->a -> Bool) -> [a] -> ([a], [a])`
//    *
//    * The `ipartition` function takes a predicate a list and returns the pair of
//    * lists of elements which do and do not satisfy the predicate, respectively.
//    *
// ```
// >>> partition (`elem` "aeiou") "Hello World!"
// ("eoo","Hll Wrld!")
// ```
//    */
//   ipartition (f: (index: number) => (value: T) => boolean): Tuple<List<T>, List<T>> {
//     const pair = this.value.reduce<[List<T>, List<T>]> (
//       ([included, excluded], value, index) => f (index) (value)
//         ? [included.append (value), excluded]
//         : [included, excluded.append (value)],
//       [List.empty (), List.empty ()]
//     );

//     return Tuple.of<List<T>, List<T>> (pair[0]) (pair[1]);
//   }

//   // INDEXING LISTS

//   /**
//    * `elemIndex :: Eq a => a -> [a] -> Maybe Int`
//    *
//    * The `elemIndex` function returns the index of the first element in the
//    * given list which is equal (by `==`) to the query element, or `Nothing` if
//    * there is no such element.
//    */
//   elemIndex (x: T): Maybe<number> {
//     const res = this.value.indexOf (x);

//     return res > -1 ? Maybe.return (res) : Maybe.empty ();
//   }

//   /**
//    * `elemIndices :: Eq a => a -> [a] -> [Int]`
//    *
//    * The `elemIndices` function extends `elemIndex`, by returning the indices of
//    * all elements equal to the query element, in ascending order.
//    */
//   elemIndices (x: T): List<number> {
//     return List.of (
//       ...this.value.reduce<number[]> (
//         (acc, e, index) => e === x ? [...acc, index] : acc,
//         []
//       )
//     );
//   }

//   /**
//    * `findIndex :: (a -> Bool) -> [a] -> Maybe Int`
//    *
//    * The `findIndex` function takes a predicate and a list and returns the index
//    * of the first element in the list satisfying the predicate, or `Nothing` if
//    * there is no such element.
//    */
//   findIndex (pred: (x: T) => boolean): Maybe<number> {
//     const res = this.value.findIndex (pred);

//     return res > -1 ? Maybe.return (res) : Maybe.empty ();
//   }

//   /**
//    * `ifindIndex :: (Int -> a -> Bool) -> [a] -> Maybe Int`
//    *
//    * The `ifindIndex` function takes a predicate and a list and returns the
//    * index of the first element in the list satisfying the predicate, or
//    * `Nothing` if there is no such element.
//    */
//   ifindIndex (pred: (index: number) => (x: T) => boolean): Maybe<number> {
//     const res = this.value.findIndex ((e, i) => pred (i) (e));

//     return res > -1 ? Maybe.return (res) : Maybe.empty ();
//   }

//   /**
//    * `findIndices :: (a -> Bool) -> [a] -> [Int]`
//    *
//    * The `findIndices` function extends `findIndex`, by returning the indices of
//    * all elements satisfying the predicate, in ascending order.
//    */
//   findIndices (pred: (x: T) => boolean): List<number> {
//     return List.of (
//       ...this.value.reduce<number[]> (
//         (acc, e, index) => pred (e) ? [...acc, index] : acc,
//         []
//       )
//     );
//   }

//   /**
//    * `ifindIndices :: (a -> Bool) -> [a] -> [Int]`
//    *
//    * The `ifindIndices` function extends `findIndex`, by returning the indices
//    * of all elements satisfying the predicate, in ascending order.
//    */
//   ifindIndices (pred: (index: number) => (x: T) => boolean): List<number> {
//     return List.of (
//       ...this.value.reduce<number[]> (
//         (acc, e, index) => pred (index) (e) ? [...acc, index] : acc,
//         []
//       )
//     );
//   }

//   // ZIPPING AND UNZIPPING LISTS

//   /**
//    * `zip :: [a] -> [b] -> [(a, b)]`
//    *
//    * `zip` takes two lists and returns a list of corresponding pairs. If one
//    * input list is short, excess elements of the longer list are discarded.
//    */
//   static zip<A, B> (list1: List<A>): (list2: List<B>) => List<Tuple<A, B>> {
//     return list2 => Maybe.imapMaybe<A, Tuple<A, B>> (
//                                                       index => e => list2.subscript (index)
//                                                         .fmap (e2 => Tuple.of<A, B> (e) (e2))
//                                                     )
//                                                     (list1);
//   }

//   /**
//    * `zipWith :: (a -> b -> c) -> [a] -> [b] -> [c]`
//    *
//    * `zipWith` generalises `zip` by zipping with the function given as the first
//    * argument, instead of a tupling function. For example, `zipWith (+)` is
//    * applied to two lists to produce the list of corresponding sums.
//    */
//   static zipWith<A, B, C> (
//     f: (value1: A) => (value2: B) => C
//   ): (list1: List<A>) => (list2: List<B>) => List<C> {
//     return list1 => list2 => Maybe.imapMaybe<A, C> (
//                                                      index => e => list2
//                                                        .subscript (index)
//                                                        .fmap (f (e))
//                                                    )
//                                                    (list1);
//   }

//   // "SET" OPERATIONS

//   /**
//    * `delete :: Eq a => a -> [a] -> [a]`
//    *
//    * `delete x` removes the first occurrence of `x` from its list argument.
//    */
//   delete (x: T): List<T> {
//     const index = this.value.findIndex (e => R.equals (e, x));

//     return this.deleteAt (index);
//   }

//   // ORDERED LISTS

//   /**
//    * `sortBy :: (a -> a -> Ordering) -> [a] -> [a]`
//    *
//    * The `sortBy` function is the non-overloaded version of `sort`.
//    */
//   sortBy (fn: (a: T) => (b: T) => number): List<T> {
//     return List.fromArray ([...this.value].sort ((a, b) => fn (a) (b)));
//   }

//   // BASIC INDEX-BASED (from Data.List.Index)

//   /**
//    * `deleteAt :: Int -> [a] -> [a]`
//    *
//    * `deleteAt` deletes the element at an index.
//    *
//    * If the index is negative or exceeds list length, the original list will be
//    * returned.
//    */
//   deleteAt (index: number): List<T> {
//     if (index > -1 && index < this.value.length) {
//       return List.of (
//         ...this.value.slice (0, index),
//         ...this.value.slice (index + 1)
//       );
//     }
//     else {
//       return this;
//     }
//   }

//   /**
//    * `setAt :: Int -> a -> [a] -> [a]`
//    *
//    * `setAt` sets the element at the index.
//    *
//    * If the index is negative or exceeds list length, the original list will be
//    * returned.
//    */
//   setAt (index: number, value: T): List<T> {
//     const resultFn = (x1: number, x2: T): List<T> => {
//       if (x1 > -1 && x1 < this.value.length) {
//         return List.fromArray (this.value.map ((e, i) => i === x1 ? x2 : e));
//       }
//       else {
//         return this;
//       }
//     };

//     return resultFn (index, value!);
//   }

//   /**
//    * `modifyAt :: Int -> (a -> a) -> [a] -> [a]`
//    *
//    * `modifyAt` applies a function to the element at the index.
//    *
//    * If the index is negative or exceeds list length, the original list will be
//    * returned.
//    */
//   modifyAt (index: number, fn: (oldValue: T) => T): List<T> {
//     const resultFn = (x1: number, x2: (oldValue: T) => T): List<T> => {
//       if (x1 > -1 && x1 < this.value.length) {
//         return List.fromArray (this.value.map ((e, i) => i === x1 ? x2 (e) : e));
//       }
//       else {
//         return this;
//       }
//     };

//     return resultFn (index, fn!);
//   }

//   /**
//    * `updateAt :: Int -> (a -> Maybe a) -> [a] -> [a]`
//    *
//    * `updateAt` applies a function to the element at the index, and then either
//    * replaces the element or deletes it (if the function has returned
//    * `Nothing`).
//    *
//    * If the index is negative or exceeds list length, the original list will be
//    * returned.
//    */
//   updateAt (index: number, fn: (oldValue: T) => Maybe<T>): List<T> {
//     const resultFn = (x1: number, x2: (oldValue: T) => Maybe<T>): List<T> => {
//       if (x1 > -1 && x1 < this.value.length) {
//         const maybeRes = x2 (this.value[x1]);

//         if (Maybe.isJust (maybeRes)) {
//           return this.setAt (x1, Maybe.fromJust (maybeRes));
//         }
//         else {
//           return this.deleteAt (x1);
//         }
//       }
//       else {
//         return this;
//       }
//     };

//     return resultFn (index, fn!);
//   }

//   /**
//    * `insertAt :: Int -> a -> [a] -> [a]`
//    *
//    * `insertAt` inserts an element at the given position:
//    *
//    * `(insertAt i x xs) !! i == x`
//    *
//    * If the index is negative or exceeds list length, the original list will be
//    * returned. (If the index is equal to the list length, the insertion can be
//    * carried out.)
//    */
//   insertAt (index: number, value: T): List<T> {
//     const resultFn = (x1: number, x2: T): List<T> => {
//       if (x1 > -1 && x1 < this.value.length) {
//         return List.of (
//           ...this.value.slice (0, x1),
//           x2,
//           ...this.value.slice (x1)
//         );
//       }
//       else if (x1 === this.value.length) {
//         return this.append (x2);
//       }
//       else {
//         return this;
//       }
//     };

//     return resultFn (index, value!);
//   }

//   // MONAD METHODS

//   bind<U> (f: (value: T) => List<U>): List<U> {
//     return List.fromArray (this.value.reduce<U[]> (
//       (acc, e) => [...acc, ...f (e)],
//       []
//     ));
//   }

//   then<U> (x: List<U>): List<U> {
//     return this.value.length > 0 ? x : this as any;
//   }

//   ap<U> (x: List<(value: T) => U>): List<U> {
//     return List.fromArray (this.value.reduce<U[]> (
//       (acc, e) => [...acc, ...x.value.map (f => f (e))],
//       []
//     ));
//   }

//   // OWN METHODS

//   /**
//    * `append :: a -> [a]`
//    *
//    * Appends an element to the list.
//    */
//   append (e: T): List<T> {
//     return List.of (...this.value, e);
//   }

//   /**
//    * Transforms the list instance into a native array instance.
//    */
//   toArray (): ReadonlyArray<T> {
//     return this.value;
//   }

//   /**
//    * Converts a `List` to a native Array.
//    */
//   static toArray<T> (list: List<T>): ReadonlyArray<T> {
//     return list.value;
//   }

//   /**
//    * Converts a native Array to a `List`.
//    */
//   static fromArray<T> (arr: ReadonlyArray<T>): List<T> {
//     return new List (arr);
//   }

//   /**
//    * Transforms a `List` of `Tuple`s into an `OrderedMap` where the first values
//    * in the `Tuple` are the keys and the second values are the actual values.
//    */
//   static toMap<K, V> (list: List<Tuple<K, V>>): OrderedMap<K, V> {
//     return OrderedMap.of (list.value.map (t =>
//       [Tuple.fst (t), Tuple.snd (t)] as [K, V]
//     ));
//   }

//   /**
//    * Checks if the given value is a `List`.
//    * @param value The value to test.
//    */
//   static isList<T> (value: any): value is List<T> {
//     return value instanceof List;
//   }

//   toString (): string {
//     return List.show (this);
//   }

//   static show (list: List<any>): string {
//     return `[${list.value.toString ()}]`;
//   }
// }

// TYPE HELPERS

export type ListElement<T> = T extends List<infer I> ? I : never;

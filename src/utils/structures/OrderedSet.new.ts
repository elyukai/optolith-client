/**
 * @module OrderedSet
 *
 * A `Set` is a structure for storing unique values.
 *
 * @author Lukas Obermann
 */

import { pipe } from 'ramda';
import { add, multiply } from '../mathUtils';
import { not } from '../not';
import { id } from './combinators';
import { equals, notEquals } from './Eq';
import { fromElements, isList, List, mappend } from './List.new';
import { fromNullable, Maybe, Some } from './Maybe.new';
import { show } from './Show';


// CONSTRUCTOR

interface OrderedSetPrototype<A> {
  [Symbol.iterator] (): IterableIterator<A>;
  readonly isOrderedSet: true;
}

export interface OrderedSet<A extends Some> extends OrderedSetPrototype<A> {
  readonly value: ReadonlySet<A>;
  readonly prototype: OrderedSetPrototype<A>;
}

const OrderedSetPrototype: OrderedSetPrototype<Some> =
  Object.create (
    Object.prototype,
    {
      [Symbol.iterator]: {
        value (this: OrderedSet<Some>) {
          return this .value [Symbol.iterator] ();
        },
      },
      isOrderedSet: { value: true },
    }
  );

const _OrderedSet =
  <A extends Some> (x: ReadonlySet<A>): OrderedSet<A> =>
    Object.create (OrderedSetPrototype, { value: { value: x, enumerable: true }});

/**
 * `fromUniqueElements :: ...a -> Set a`
 *
 * Creates a new `Set` instance from the passed arguments.
 */
export const fromUniqueElements =
  <A extends Some> (...xs: A[]): OrderedSet<A> =>
    _OrderedSet (new Set (xs));

/**
 * `fromArray :: Array a -> Set a`
 *
 * Creates a new `Set` instance from the passed native `Array`.
 */
export const fromArray = <A extends Some> (xs: ReadonlyArray<A>): OrderedSet<A> => {
  if (Array.isArray (xs)) {
    return _OrderedSet (new Set (xs));
  }

  throw new TypeError (`fromArray requires an array but instead it received ${show (xs)}`);
};

/**
 * `fromSet :: NSet a -> Set a`
 *
 * Creates a new `Set` instance from the passed native `Set`.
 */
export const fromSet = <A extends Some> (xs: ReadonlySet<A>): OrderedSet<A> => {
  if (xs instanceof Set) {
    return _OrderedSet (xs);
  }

  throw new TypeError (`fromArray requires a native Set but instead it received ${show (xs)}`);
};


// // FUNCTOR

// /**
//  * `fmap :: (a -> b) -> Set a -> Set b`
//  *
//  * `fmap f s` is the set obtained by applying `f` to each element of `s`.
//  */
// export const fmap =
//   <A extends Some, B extends Some> (f: (value: A) => B) => (xs: OrderedSet<A>): OrderedSet<B> =>
//     fromArray ([...xs .value] .map (f));

// /**
//  * `(<$) :: a -> Set b -> Set a`
//  *
//  * Replace all locations in the input with the same value. The default
//  * definition is `fmap . const`, but this may be overridden with a more
//  * efficient version.
//  */
// export const mapReplace = <A extends Some> (x: A) => fromArray ([x]);


// // APPLICATIVE

// /**
//  * `pure :: a -> Set a`
//  *
//  * Lift a value.
//  */
// export const pure = <A extends Some> (x: A) => fromArray ([x]);

// /**
//  * `(<*>) :: Set (a -> b) -> Set a -> Set b`
//  *
//  * Sequential application.
//  */
// export const ap =
//   <A extends Some, B extends Some>
//   (ma: OrderedSet<(value: A) => B>) =>
//   (m: OrderedSet<A>): OrderedSet<B> =>
//     fromArray (
//       [...ma .value] .reduce<B[]> (
//         (acc, f) => [...acc, ...fmap (f) (m)],
//         []
//       )
//     );


// // ALTERNATIVE

// /**
//  * `alt :: Set a -> Set a -> Set a`
//  *
//  * The `alt` function takes a list of the same type. If the first list
//  * is empty, it returns the second list, otherwise it returns the
//  * first.
//  */
// export const alt =
//   <A extends Some> (xs1: OrderedSet<A>) => (xs2: OrderedSet<A>): OrderedSet<A> =>
//     fnull (xs1) ? xs2 : xs1;

// /**
//  * `alt :: Set a -> Set a -> Set a`
//  *
//  * The `alt` function takes a `Maybe` of the same type. If the second `Maybe`
//  * is `Nothing`, it returns the first `Maybe`, otherwise it returns the
//  * second.
//  *
//  * This is the same as `Maybe.alt` but with arguments swapped.
//  */
// export const alt_ =
//   <A extends Some> (xs1: OrderedSet<A>) => (xs2: OrderedSet<A>): OrderedSet<A> =>
//     alt (xs2) (xs1);

// /**
//  * `empty :: Set a`
//  *
//  * The empty `Set`.
//  */
// export const empty = fromArray ([]);

// /**
//  * `guard :: Bool -> Set ()`
//  *
//  * Conditional failure of Alternative computations. Defined by
// ```hs
// guard True  = pure ()
// guard False = empty
// ```
//   * In TypeScript, this is not possible, so instead it's
// ```ts
// guard (true)  = pure (true)
// guard (false) = empty
// ```
//   */
// export const guard = (pred: boolean): OrderedSet<true> => pred ? pure<true> (true) : empty;


// // MONAD

// /**
//  * `(>>=) :: Set a -> (a -> Set b) -> Set b`
//  */
// export const bind =
//   <A extends Some, B extends Some>
//   (xs: OrderedSet<A>) =>
//   (f: (value: A) => OrderedSet<B>): OrderedSet<B> =>
//     fromArray (
//       [...xs .value] .reduce<B[]> (
//         (acc, e) => [...acc, ...f (e)],
//         []
//       )
//     );

// /**
//  * `(=<<) :: (a -> Set b) -> Set a -> Set b`
//  */
// export const bind_ =
//   <A extends Some, B extends Some>
//   (f: (value: A) => OrderedSet<B>) =>
//   (xs: OrderedSet<A>): OrderedSet<B> =>
//     bind<A, B> (xs) (f);

// /**
//  * `(>>) :: Set a -> Set b -> Set b`
//  *
//  * Sequentially compose two actions, discarding any value produced by the
//  * first, like sequencing operators (such as the semicolon) in imperative
//  * languages.
//  *
//  * ```a >> b = a >>= \ _ -> b```
//  */
// export const then =
//   <A extends Some> (xs1: OrderedSet<any>) => (xs2: OrderedSet<A>): OrderedSet<A> =>
//     bind<any, A> (xs1) (_ => xs2);


// /**
//  * `return :: a -> Set a`
//  *
//  * Inject a value into a list.
//  */
// export const mreturn = <A extends Some> (x: A) => fromArray ([x]);

// /**
//  * `(>=>) :: (a -> Set b) -> (b -> Set c) -> a -> Set c`
//  *
//  * Left-to-right Kleisli composition of monads.
//  */
// export const kleisli =
//   <A extends Some, B extends Some, C extends Some>
//   (f1: (x: A) => OrderedSet<B>) =>
//   (f2: (x: B) => OrderedSet<C>) =>
//     pipe (f1, bind_ (f2));

// /**
//  * `join :: Set (Set a) -> Set a`
//  *
//  * The `join` function is the conventional monad join operator. It is used to
//  * remove one level of monadic structure, projecting its bound argument into the
//  * outer level.
//  */
// export const join =
//   <A extends Some>(xs: OrderedSet<OrderedSet<A>>): OrderedSet<A> =>
//     bind<OrderedSet<A>, A> (xs) (id);


// FOLDABLE

/**
 * `foldr :: (a -> b -> b) -> b -> Set a -> b`
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
  (xs: OrderedSet<A>): B =>
    [...xs .value] .reduceRight<B> ((acc, e) => f (e) (acc), initial);

/**
 * `foldl :: (b -> a -> b) -> b -> Set a -> b`
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
  (xs: OrderedSet<A>): B =>
    [...xs .value] .reduce<B> ((acc, e) => f (acc) (e), initial);

/**
 * `foldr1 :: (a -> a -> a) -> Set a -> a`
 *
 * A variant of `foldr` that has no base case, and thus may only be applied to
 * non-empty structures.
 *
 * `foldr1 f = foldr1 f . toList`
 */
export const foldr1 =
  <A extends Some>
  (f: (current: A) => (acc: A) => A) =>
  (xs: OrderedSet<A>): A => {
    if (xs .value .size > 0) {
      const arr = [...xs .value];
      const _init = arr .slice (0, -1);
      const _last = arr [arr .length - 1];

      return _init .reduceRight<A> ((acc, e) => f (e) (acc), _last);
    }

    throw new TypeError ('Cannot apply foldr1 to an empty Set.');
  };

/**
 * `foldl1 :: (a -> a -> a) -> Set a -> a`
 *
 * A variant of `foldl` that has no base case, and thus may only be applied to
 * non-empty structures.
 *
 * `foldl1 f = foldl1 f . toList`
 */
export const foldl1 =
  <A extends Some>
  (f: (acc: A) => (current: A) => A) =>
  (xs: OrderedSet<A>): A => {
    if (xs .value .size > 0) {
      const [_head, ..._tail] = xs;

      return _tail .reduce<A> ((acc, e) => f (acc) (e), _head);
    }

    throw new TypeError ('Cannot apply foldl1 to an empty Set.');
  };

/**
 * `toList :: Set a -> [a]`
 *
 * List of elements of a structure, from left to right.
 */
export const toList = <A extends Some>(xs: OrderedSet<A>): List<A> => fromElements (...xs);

/**
 * `null :: Set a -> Bool`
 *
 * Test whether the structure is empty. The default implementation is optimized
 * for structures that are similar to cons-lists, because there is no general
 * way to do better.
 */
export const fnull = (xs: OrderedSet<any>): boolean => xs .value .size === 0;

/**
 * `length :: Set a -> Int`
 *
 * Returns the size/length of a finite structure as an `Int`. The default
 * implementation is optimized for structures that are similar to cons-lists,
 * because there is no general way to do better.
 */
export const length = (xs: OrderedSet<any>): number => xs .value .size;

/**
 * `elem :: Eq a => a -> Set a -> Bool`
 *
 * Does the element occur in the structure?
 */
export const elem =
  <A extends Some>(e: A) => (xs: OrderedSet<A>): boolean =>
    [...xs .value] .some (equals (e));

/**
 * `elem_ :: Eq a => Set a -> a -> Bool`
 *
 * Does the element occur in the structure?
 *
 * Same as `List.elem` but with arguments switched.
 */
export const elem_ = <A extends Some>(xs: OrderedSet<A>) => (e: A): boolean => elem (e) (xs);

/**
 * `sum :: Num a => Set a -> a`
 *
 * The `sum` function computes the sum of the numbers of a structure.
 */
export const sum = foldr (add) (0);

/**
 * `product :: Num a => Set a -> a`
 *
 * The `product` function computes the product of the numbers of a structure.
 */
export const product = foldr (multiply) (1);

/**
 * `maximum :: Ord a => Set a -> a`
 *
 * The largest element of a non-empty structure.
 */
export const maximum = (xs: OrderedSet<number>): number => Math.max (...xs);

/**
 * `minimum :: Ord a => Set a -> a`
 *
 * The least element of a non-empty structure.
 */
export const minimum = (xs: OrderedSet<number>): number => Math.min (...xs);

// Specialized folds

/**
 * `concat :: Set [a] -> [a]`
 *
 * The concatenation of all the elements of a container of lists.
 */
export const concat =
  <A extends Some> (xs: OrderedSet<List<A>>): List<A> =>
    foldl<List<A>, List<A>> (mappend) (List.empty) (xs);

/**
 * `concatMap :: (a -> Set b) -> Set a -> Set b`
 *
 * Map a function over all the elements of a container and concatenate the
 * resulting lists.
 */
export const concatMap =
  <A extends Some, B extends Some>
  (f: (value: A) => OrderedSet<B>) =>
  (xs: OrderedSet<A>): OrderedSet<B> =>
    fromArray (
      [...xs .value] .reduce<B[]> (
        (acc, e) => [...acc, ...f (e)],
        []
      )
    );

/**
 * `and :: Set Bool -> Bool`
 *
 * `and` returns the conjunction of a container of Bools. For the result to be
 * `True`, the container must be finite; `False`, however, results from a
 * `False` value finitely far from the left end.
 */
export const and = (xs: OrderedSet<boolean>): boolean => [...xs .value] .every (id);

/**
 * `or :: Set Bool -> Bool`
 *
 * `or` returns the disjunction of a container of Bools. For the result to be
 * `False`, the container must be finite; `True`, however, results from a
 * `True` value finitely far from the left end.
 */
export const or = (xs: OrderedSet<boolean>): boolean => [...xs .value] .some (id);

/**
 * `any :: (a -> Bool) -> Set a -> Bool`
 *
 * Determines whether any element of the structure satisfies the predicate.
 */
export const any =
  <A extends Some>(f: (x: A) => boolean) => (xs: OrderedSet<A>): boolean =>
    [...xs .value] .some (f);

/**
 * `all :: (a -> Bool) -> Set a -> Bool`
 *
 * Determines whether all elements of the structure satisfy the predicate.
 */
export const all =
  <A extends Some>(f: (x: A) => boolean) => (xs: OrderedSet<A>): boolean =>
    [...xs .value] .every (f);

// Searches

/**
 * `notElem :: Eq a => a -> Set a -> Bool`
 *
 * `notElem` is the negation of `elem`.
 */
export const notElem = <A extends Some> (e: A) => pipe (
  elem<A> (e),
  not
);

interface Find {
  /**
   * `find :: (a -> Bool) -> Set a -> Maybe a`
   *
   * The `find` function takes a predicate and a structure and returns the
   * leftmost element of the structure matching the predicate, or `Nothing` if
   * there is no such element.
   */
  <A extends Some, A1 extends A> (pred: (x: A) => x is A1): (xs: OrderedSet<A>) => Maybe<A1>;
  /**
   * `find :: (a -> Bool) -> Set a -> Maybe a`
   *
   * The `find` function takes a predicate and a structure and returns the
   * leftmost element of the structure matching the predicate, or `Nothing` if
   * there is no such element.
   */
  <A extends Some> (pred: (x: A) => boolean): (xs: OrderedSet<A>) => Maybe<A>;
}

/**
 * `find :: (a -> Bool) -> Set a -> Maybe a`
 *
 * The `find` function takes a predicate and a structure and returns the
 * leftmost element of the structure matching the predicate, or `Nothing` if
 * there is no such element.
 */
export const find: Find =
  <A extends Some> (pred: (x: A) => boolean) => (xs: OrderedSet<A>): Maybe<A> =>
    fromNullable ([...xs .value] .find (pred));


// CONSTRUCTION

/**
 * `empty :: Set a`
 *
 * The empty `Set`.
 */
export const empty = fromArray ([]);

/**
 * `singleton :: a -> Set a`
 *
 * Create a singleton set.
 */
export const singleton = <A extends Some> (x: A) => fromArray ([x]);

/**
 * `fromList :: [a] -> Set a`
 *
 * Create a set from a list of elements.
 */
export const fromList = <A extends Some> (xs: List<A>): OrderedSet<A> => {
  if (isList (xs)) {
    return _OrderedSet (new Set (xs .value));
  }

  throw new TypeError (`fromList requires a list but instead it received ${show (xs)}`);
};


// INSERTION

/**
 * `insert :: Ord a => a -> Set a -> Set a`
 *
 * Insert an element in a set. If the set already contains an element equal to
 * the given value, it is replaced with the new value.
 */
export const insert =
  <A extends Some> (x: A) => (xs: OrderedSet<A>): OrderedSet<A> =>
    fromArray ([...xs .value, x]);


// DELETION

/**
 * `delete :: Ord a => a -> Set a -> Set a`
 *
 * Delete an element from a set.
 */
export const sdelete =
  <A extends Some> (x: A) => (xs: OrderedSet<A>): OrderedSet<A> =>
    fromArray ([...xs .value] .filter (notEquals (x)));


// QUERY

/**
 * `member :: Ord a => a -> Set a -> Bool`
 *
 * Is the element in the set?
 */
export const member = elem;

/**
 * `notMember :: Ord k => k -> Set a -> Bool`
 *
 * Is the element not in the set?
 */
export const notMember = notElem;

/**
 * `size :: Set a -> Int`
 *
 * The number of elements in the set.
 */
export const size = length;


// COMBINE

/**
 * `union :: Ord a => Set a -> Set a -> Set a`
 *
 * The union of two sets, preferring the first set when equal elements are
 * encountered.
 */
export const union =
  <A extends Some> (xs1: OrderedSet<A>) => (xs2: OrderedSet<A>): OrderedSet<A> =>
    fromArray ([...xs1, ...xs2]);


// FILTER

interface Filter {
  /**
   * `filter :: (a -> Bool) -> Set a -> [a]`
   *
   * Filter all values that satisfy the predicate.
   */
  <A extends Some, A1 extends A> (pred: (x: A) => x is A1): (list: OrderedSet<A>) => OrderedSet<A1>;
  /**
   * `filter :: (a -> Bool) -> Set a -> [a]`
   *
   * Filter all values that satisfy the predicate.
   */
  <A extends Some> (pred: (x: A) => boolean): (list: OrderedSet<A>) => OrderedSet<A>;
}

/**
 * `filter :: (a -> Bool) -> Set a -> [a]`
 *
 * Filter all values that satisfy the predicate.
 */
export const filter: Filter =
  <A extends Some> (pred: (x: A) => boolean) => (xs: OrderedSet<A>): OrderedSet<A> =>
    fromArray ([...xs .value] .filter (pred));


// MAP

/**
 * `map :: Ord b => (a -> b) -> Set a -> Set b`
 *
 * `map f s` is the set obtained by applying `f` to each element of `s`.
 *
 * It's worth noting that the size of the result may be smaller if, for some
 * `(x,y), x /= y && f x == f y`.
 */
export const map =
  <A extends Some, B extends Some> (f: (value: A) => B) => (xs: OrderedSet<A>): OrderedSet<B> =>
    fromArray ([...xs .value] .map (f));


// CONVERSION LIST

/**
 * `elems :: Set a -> [a]`
 *
 * An alias of toAscList. The elements of a set in ascending order. Subject to
 * list fusion.
 */
export const elems = toList;


// CUSTOM FUNCTIONS

/**
 * Converts the `OrderedSet` into a native Set instance.
 */
export const toSet = <A extends Some> (xs: OrderedSet<A>): ReadonlySet<A> => xs .value;

/**
 * `toggle :: Ord a => a -> Set a -> Set a`
 *
 * Delete an element from a set if the value already exists in the set.
 * Otherwise, insert the element in the set.
 */
export const toggle =
  <A extends Some> (x: A) => (xs: OrderedSet<A>): OrderedSet<A> =>
    member (x) (xs) ? sdelete (x) (xs) : insert (x) (xs);

/**
 * Checks if the given value is a `List`.
 * @param x The value to test.
 */
export const isOrderedSet =
  (x: any): x is OrderedSet<any> =>
    typeof x === 'object' && x !== null && x.isOrderedSet;


// NAMESPACED FUNCTIONS

export const OrderedSet = {
  fromUniqueElements,
  fromArray,
  fromSet,

  foldr,
  foldl,
  foldr1,
  foldl1,
  toList,
  fnull,
  length,
  elem,
  elem_,
  sum,
  product,
  maximum,
  minimum,
  concat,
  concatMap,
  and,
  or,
  any,
  all,
  notElem,
  find,

  empty,
  singleton,
  fromList,

  insert,

  sdelete,

  member,
  notMember,
  size,

  union,

  filter,

  map,

  elems,

  toSet,
  toggle,
  isOrderedSet,
};

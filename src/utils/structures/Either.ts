/**
 * @module Either
 *
 * The `Either` type represents values with two possibilities: a value of type
 * `Either a b` is either `Left a` or `Right b`.
 *
 * The `Either` type is sometimes used to represent a value which is either
 * correct or an error; by convention, the `Left` constructor is used to hold an
 * error value and the `Right` constructor is used to hold a correct value
 * (mnemonic: "right" also means "correct").
 *
 * @author Lukas Obermann
 */

import { pipe } from 'ramda';
import { cnst, id } from './combinators';
import { cons, cons_, empty as emptyList, foldr as foldrList, fromElements, List } from './List.new';
import { fromJust, isJust, Just, Maybe, Nothing, Some } from './Maybe.new';
import { Tuple } from './tuple';
import { Mutable } from './typeUtils';


// EITHER TYPE DEFINITION

export type Either<A extends Some, B extends Some> = Left<A> | Right<B>;


// CONSTRUCTORS

// Left

interface LeftPrototype {
  readonly isLeft: true;
  readonly isRight: false;
}

export interface Left<A extends Some> extends LeftPrototype {
  readonly value: A;
  readonly prototype: LeftPrototype;
}

const LeftPrototype: LeftPrototype = {
  isLeft: true,
  isRight: false,
};

export const Left = <A extends Some> (value: A): Left<A> => {
  const left: Mutable<Left<A>> = Object.create (LeftPrototype);
  left.value = value;

  return left;
};

// Right

interface RightPrototype {
  readonly isLeft: false;
  readonly isRight: true;
}

export interface Right<B extends Some> extends RightPrototype {
  readonly value: B;
  readonly prototype: RightPrototype;
}

const RightPrototype: RightPrototype = {
  isLeft: false,
  isRight: true,
};

export const Right = <B extends Some> (value: B): Right<B> => {
  const right: Mutable<Right<B>> = Object.create (RightPrototype);
  right.value = value;

  return right;
};


// EITHER.EXTRA

/**
 * `fromLeft :: a -> Either a b -> a`
 *
 * Return the contents of a `Left`-value or a default value otherwise.
 *
 * `fromLeft 1 (Left 3) == 3`
 * `fromLeft 1 (Right "foo") == 1`
 */
export const fromLeft =
  <A extends Some> (def: A) => (m: Either<A, any>): A =>
    isLeft (m) ? m .value : def;

/**
 * `fromRight :: b -> Either a b -> b`
 *
 *
 * Return the contents of a `Right`-value or a default value otherwise.
 *
 * `fromRight 1 (Right 3) == 3`
 * `fromRight 1 (Left "foo") == 1`
 */
export const fromRight =
  <B extends Some> (def: B) => (m: Either<any, B>): B =>
    isRight (m) ? m .value : def;

/**
 * `fromEither :: Either a a -> a`
 *
 * Pull the value out of an `Either` where both alternatives have the same type.
 *
 * `\x -> fromEither (Left x ) == x`
 * `\x -> fromEither (Right x) == x`
 */
export const fromEither =
  <A extends Some> (m: Either<A, A>): A =>
    isRight (m) ? m .value : m .value;

/**
 * `fromLeft' :: Either l r -> l`
 *
 * The `fromLeft'` function extracts the element out of a `Left` and throws an
 * error if its argument is `Right`. Much like `fromJust`, using this function
 * in polished code is usually a bad idea.
 *
 * `\x -> fromLeft' (Left  x) == x`
 * `\x -> fromLeft' (Right x) == undefined`
 *
 * @throws TypeError
 */
export const fromLeft_ =
  <L extends Some> (x: Left<L>): L => {
    if (isLeft (x)) {
      return x .value;
    }

    throw new TypeError (`Cannot extract a Left value out of ${x}.`);
  };

/**
 * `fromRight' :: Either l r -> r`
 *
 * The `fromRight'` function extracts the element out of a `Right` and throws an
 * error if its argument is `Left`. Much like `fromJust`, using this function
 * in polished code is usually a bad idea.
 *
 * `\x -> fromRight' (Right x) == x`
 * `\x -> fromRight' (Left  x) == undefined`
 *
 * @throws TypeError
 */
export const fromRight_ =
  <R extends Some> (x: Right<R>): R => {
    if (isRight (x)) {
      return x .value;
    }

    throw new TypeError (`Cannot extract a Right value out of ${x}.`);
  };

/**
 * `eitherToMaybe :: Either a b -> Maybe b`
 *
 * Given an `Either`, convert it to a `Maybe`, where `Left` becomes `Nothing`.
 *
 * `\x -> eitherToMaybe (Left x) == Nothing`
 * `\x -> eitherToMaybe (Right x) == Just x`
 */
export const eitherToMaybe =
  <B extends Some> (m: Either<any, B>): Maybe<B> =>
    isRight (m) ? Just (m .value) : Nothing;

/**
 * `maybeToEither :: a -> Maybe b -> Either a b`
 *
 * Given a `Maybe`, convert it to an `Either`, providing a suitable value for
 * the `Left` should the value be `Nothing`.
 *
 * `\a b -> maybeToEither a (Just b) == Right b`
 * `\a -> maybeToEither a Nothing == Left a`
 */
export const maybeToEither =
  <A extends Some, B extends Some> (left: A) => (m: Maybe<B>): Either<A, B> =>
    isJust (m) ? Right (fromJust (m)) : Left (left);


// FUNCTOR

/**
 * `fmap :: (a -> b) -> Either a a -> Either a b`
 */
export const fmap =
  <A extends Some, A0 extends Some, B extends Some>
  (f: (value: A0) => B) =>
  (x: Either<A, A0>): Either<A, B> =>
    isRight (x) ? Right (f (x .value)) : x;

/**
 * `(<$) :: a0 -> Either a b -> Either a a0`
 *
 * Replace all locations in the input with the same value. The default
 * definition is `fmap . const`, but this may be overridden with a more
 * efficient version.
 */
export const mapReplace =
  <A extends Some, A0 extends Some> (x: A0) =>
    fmap<A, Some, A0> (cnst (x));


// BIFUNCTOR

/**
 * `bimap :: (a -> b) -> (c -> d) -> Either a c -> Either b d`
 */
export const bimap =
  <A extends Some, B extends Some, C extends Some, D extends Some>
  (fLeft: (left: A) => B) =>
  (fRight: (right: C) => D) =>
  (m: Either<A, C>): Either<B, D> =>
    isRight (m)
      ? Right (fRight (m .value))
      : Left (fLeft (m .value));

/**
 * `first :: (a -> b) -> Either a c -> Either b c`
 */
export const first =
  <A extends Some, B extends Some, C extends Some>
  (f: (left: A) => B) =>
  (m: Either<A, C>): Either<B, C> =>
    isLeft (m)
      ? Left (f (m .value))
      : m;

/**
 * `second :: (b -> c) -> Either a b -> Either a c`
 */
export const second =
  <A extends Some, B extends Some, C extends Some>
  (f: (right: B) => C) =>
  (m: Either<A, B>): Either<A, C> =>
    isRight (m)
      ? Right (f (m .value))
      : m;


// APPLICATIVE

/**
 * `pure :: a -> Either e a`
 *
 * Lift a value.
 */
export const pure = Right;

/**
 * `(<*>) :: Either e (a -> b) -> Either e a -> Either e b`
 *
 * Sequential application.
 */
export const ap =
  <E extends Some, A extends Some, B extends Some>
  (ma: Either<E, (value: A) => B>) => (m: Either<E, A>): Either<E, B> =>
    isRight (ma) ? fmap<E, A, B> (ma .value) (m) : ma;


// MONAD

/**
 * `(>>=) :: Either e a -> (a -> Either e b) -> Either e b`
 */
export const bind =
  <E extends Some, A extends Some, B extends Some>
  (m: Either<E, A>) => (f: (value: A) => Either<E, B>): Either<E, B> =>
    isRight (m) ? f (m .value) : m;

/**
 * `(=<<) :: (a -> Either e b) -> Either e a -> Either e b`
 */
export const bind_ =
  <E extends Some, A extends Some, B extends Some>
  (f: (value: A) => Either<E, B>) => (m: Either<E, A>): Either<E, B> =>
    bind<E, A, B> (m) (f);

/**
 * `(>>) :: Either e a -> Either e b -> Either e b`
 *
 * Sequentially compose two actions, discarding any value produced by the
 * first, like sequencing operators (such as the semicolon) in imperative
 * languages.
 *
 * ```a >> b = a >>= \ _ -> b```
 */
export const then =
  <E extends Some, B extends Some> (m1: Either<E, any>) => (m2: Either<E, B>): Either<E, B> =>
    bind<E, any, B> (m1) (() => m2);

/**
 * `return :: a -> Either e a`
 *
 * Inject a value into the `Either` type.
 */
export const mreturn = Right;

/**
 * `(>=>) :: (a -> Either e b) -> (b -> Either e c) -> a -> Either e c`
 *
 * Left-to-right Kleisli composition of monads.
 */
export const kleisli =
  <E extends Some, A extends Some, B extends Some, C extends Some>
  (f1: (x: A) => Either<E, B>) => (f2: (x: B) => Either<E, C>) =>
    pipe (f1, bind_ (f2));

/**
 * `join :: Either e (Either e a) -> Either e a`
 *
 * The `join` function is the conventional monad join operator. It is used to
 * remove one level of monadic structure, projecting its bound argument into the
 * outer level.
 */
export const join =
  <E extends Some, A extends Some> (x: Either<E, Either<E, A>>): Either<E, A> =>
    bind<E, Either<E, A>, A> (x) (id);


// FOLDABLE

/**
 * `foldr :: (a0 -> b -> b) -> b -> Either a a0 -> b`
 *
 * Right-associative fold of a structure.
 */
export const foldr =
  <A0 extends Some, B extends Some>
  (f: (current: A0) => (acc: B) => B) => (initial: B) => (x: Either<any, A0>): B =>
    isRight (x) ? f (x .value) (initial) : initial;

/**
 * `foldl :: (b -> a0 -> b) -> b -> Either a a0 -> b`
 *
 * Left-associative fold of a structure.
 */
export const foldl =
  <A0 extends Some, B extends Some>
  (fn: (acc: B) => (current: A0) => B) => (initial: B) => (x: Either<any, A0>): B =>
    isRight (x) ? fn (initial) (x .value) : initial;

/**
 * `toList :: Either a a0 -> [a0]`
 *
 * List of elements of a structure, from left to right.
 */
export const toList =
  <A0 extends Some>(xs: Either<any, A0>): List<A0> =>
    isRight (xs) ? fromElements (xs .value) : emptyList ();

/**
 * `null :: Either a a0 -> Bool`
 *
 * Test whether the structure is empty. The default implementation is optimized
 * for structures that are similar to cons-lists, because there is no general
 * way to do better.
 */
export const fnull = (xs: Either<any, any>): boolean => length (xs) === 0;

/**
 * `length :: Either a a0 -> Int`
 *
 * Returns the size/length of a finite structure as an `Int`. The default
 * implementation is optimized for structures that are similar to cons-lists,
 * because there is no general way to do better.
 */
export const length = (xs: Either<any, any>): number => isRight (xs) ? 1 : 0;

/**
 * `elem :: Eq a0 => a0 -> Either a a0 -> Bool`
 *
 * Does the element occur in the structure?
 *
 * Always returns `False` if the provided `Either` is a `Left`.
 */
export const elem =
  <A0 extends Some> (e: A0) => (m: Either<any, A0>): boolean =>
    isRight (m) && e === m .value;

/**
 * `elem_ :: Eq a0 => Either a a0 -> a0 -> Bool`
 *
 * Does the element occur in the structure?
 *
 * Always returns `False` if the provided `Either` is a `Left`.
 *
 * Flipped version of `elem`.
 */
export const elem_ = <A extends Some> (m: Either<A, A>) => (e: A): boolean => elem (e) (m);

/**
 * `sum :: Num a => Either a a0 -> a`
 *
 * The `sum` function computes the sum of the numbers of a structure.
 */
export const sum = fromRight (0);

/**
 * `product :: Num a => Either a a0 -> a`
 *
 * The `product` function computes the product of the numbers of a structure.
 */
export const product = fromRight (1);

// Specialized folds

/**
 * `concat :: Either a [a0] -> [a0]`
 *
 * The concatenation of all the elements of a container of lists.
 */
export const concat =
  <A0 extends Some>(m: Either<any, List<A0>>): List<A0> =>
    fromRight<List<A0>> (emptyList<A0> ()) (m);

/**
 * `concatMap :: (a0 -> [b]) -> Either a a0 -> [b]`
 *
 * Map a function over all the elements of a container and concatenate the
 * resulting lists.
 */
export const concatMap =
  <A0 extends Some, B extends Some> (f: (x: A0) => List<B>) => (xs: Either<any, A0>): List<B> =>
    fromRight (emptyList<B> ()) (fmap (f) (xs));

/**
 * `and :: Either a Bool -> Bool`
 *
 * `and` returns the conjunction of a container of Bools. For the result to be
 * `True`, the container must be finite; `False`, however, results from a
 * `False` value finitely far from the left end.
 */
export const and = fromRight (true);

/**
 * `or :: Either a Bool -> Bool`
 *
 * `or` returns the disjunction of a container of Bools. For the result to be
 * `False`, the container must be finite; `True`, however, results from a
 * `True` value finitely far from the left end.
 */
export const or = fromRight (false);

/**
 * `any :: (a0 -> Bool) -> Either a a0 -> Bool`
 *
 * Determines whether any element of the structure satisfies the predicate.
 */
export const any =
  <A0 extends Some>(f: (x: A0) => boolean) => (m: Either<any, A0>): boolean =>
    fromRight (false) (fmap (f) (m));
/**
 * `all :: (a0 -> Bool) -> Either a a0 -> Bool`
 *
 * Determines whether all elements of the structure satisfy the predicate.
 */
export const all =
  <A0 extends Some>(f: (x: A0) => boolean) => (m: Either<any, A0>): boolean =>
    fromRight (true) (fmap (f) (m));

// Searches

/**
 * `notElem :: Eq a0 => a0 -> Either a a0 -> Bool`
 *
 * `notElem` is the negation of `elem`.
 */
export const notElem =
  <A0 extends Some> (e: A0) => (m: Either<any, A0>): boolean =>
    !elem (e) (m);

interface Find {
  /**
   * `find :: (a0 -> Bool) -> Either a a0 -> Maybe a0`
   *
   * The `find` function takes a predicate and a structure and returns the
   * leftmost element of the structure matching the predicate, or `Nothing` if
   * there is no such element.
   */
  <A, A1 extends A> (pred: (x: A) => x is A1): (xs: Either<any, A>) => Maybe<A1>;

  /**
   * `find :: (a0 -> Bool) -> Either a a0 -> Maybe a0`
   *
   * The `find` function takes a predicate and a structure and returns the
   * leftmost element of the structure matching the predicate, or `Nothing` if
   * there is no such element.
   */
  <A> (pred: (x: A) => boolean): (xs: Either<any, A>) => Maybe<A>;
}

/**
 * `find :: (a0 -> Bool) -> Either a a0 -> Maybe a0`
 *
 * The `find` function takes a predicate and a structure and returns the
 * leftmost element of the structure matching the predicate, or `Nothing` if
 * there is no such element.
 */
export const find: Find =
  <A> (pred: (x: A) => boolean) => (xs: Either<any, A>): Maybe<A> =>
    isRight (xs) && pred (xs .value) ? Just (xs .value) : Nothing;


// ORD

/**
 * `(>) :: Either a b -> Either a b -> Bool`
 *
 * Returns if the *second* value is greater than the first value.
 *
 * If the second value is a `Right` and the first is a `Left`, `(>)` always
 * returns `True`.
 *
 * If the second value is a `Left` and the first is a `Right`, `(>)` always
 * returns `False`.
 */
export const gt =
  <A extends number | string, B extends number | string>
  (m1: Either<A, B>) =>
  (m2: Either<A, B>): boolean =>
    isRight (m2) && isLeft (m1)
    || isRight (m1) && isRight (m2) && m2 .value > m1 .value
    || isLeft (m1) && isLeft (m2) && m2 .value > m1 .value;

/**
 * `(<) :: Either a b -> Either a b -> Bool`
 *
 * Returns if the *second* value is lower than the first value.
 *
 * If the second value is a `Left` and the first is a `Right`, `(<)` always
 * returns `True`.
 *
 * If the second value is a `Right` and the first is a `Left`, `(<)` always
 * returns `False`.
 */
export const lt =
  <A extends number | string, B extends number | string>
  (m1: Either<A, B>) =>
  (m2: Either<A, B>): boolean =>
    isLeft (m2) && isRight (m1)
    || isRight (m1) && isRight (m2) && m2 .value < m1 .value
    || isLeft (m1) && isLeft (m2) && m2 .value < m1 .value;

/**
 * `(>=) :: Either a b -> Either a b -> Bool`
 *
 * Returns if the *second* value is greater than or equals the first
 * value.
 *
 * If the second value is a `Right` and the first is a `Left`, `(>=)` always
 * returns `True`.
 *
 * If the second value is a `Left` and the first is a `Right`, `(>=)` always
 * returns `False`.
 */
export const gte =
  <A extends number | string, B extends number | string>
  (m1: Either<A, B>) =>
  (m2: Either<A, B>): boolean =>
    isRight (m2) && isLeft (m1)
    || isRight (m1) && isRight (m2) && m2 .value >= m1 .value
    || isLeft (m1) && isLeft (m2) && m2 .value >= m1 .value;

/**
 * `(<=) :: Either a b -> Either a b -> Bool`
 *
 * Returns if the *second* value is lower than or equals the second
 * value.
 *
 * If the second value is a `Left` and the first is a `Right`, `(<=)` always
 * returns `True`.
 *
 * If the second value is a `Right` and the first is a `Left`, `(<=)` always
 * returns `False`.
 */
export const lte =
  <A extends number | string, B extends number | string>
  (m1: Either<A, B>) =>
  (m2: Either<A, B>): boolean =>
    isLeft (m2) && isRight (m1)
    || isRight (m1) && isRight (m2) && m2 .value <= m1 .value
    || isLeft (m1) && isLeft (m2) && m2 .value <= m1 .value;


// SEMIGROUP

// /**
//  * `mappend :: Semigroup a => Either a a0 -> Either a a0 -> Either a a0`
//  *
//  * Concatenates the `Semigroup`s contained in the two `Maybe`s, if both are of
//  * type `Just a`. If at least one of them is `Nothing`, it returns the first
//  * element.
//  */
// export const mappend = <U, S extends Semigroup<U>> (m1: Maybe<S>) => (m2: Maybe<S>): Maybe<S> =>
//   isJust (m1) && isJust (m2)
//     ? Just (mappend (fromJust (m1), fromJust (m2)))
//     : m1;


// EITHER FUNCTIONS

/**
 * `isLeft :: Either a b -> Bool`
 *
 * Return `True` if the given value is a `Left`-value, `False` otherwise.
 */
export const isLeft =
<A extends Some, B extends Some> (x: Either<A, B>): x is Left<A> => x.prototype === LeftPrototype;

/**
* `isRight :: Either a b -> Bool`
*
* Return `True` if the given value is a `Right`-value, `False` otherwise.
*/
export const isRight =
<A extends Some, B extends Some> (x: Either<A, B>): x is Right<B> => x.prototype === RightPrototype;

/**
 * `either :: (a -> c) -> (b -> c) -> Either a b -> c`
 *
 * Case analysis for the `Either` type. If the value is `Left a`, apply the
 * first function to `a`; if it is `Right b`, apply the second function to `b`.
 */
export const either =
  <A extends Some, B extends Some, C extends Some>
  (fLeft: (left: A) => C) =>
  (fRight: (right: B) => C) =>
  (m: Either<A, B>): C =>
    isRight (m) ? fRight (m .value) : fLeft (m .value);

/**
 * `lefts :: [Either a b] -> [a]`
 *
 * Extracts from a list of `Either` all the `Left` elements. All the `Left`
 * elements are extracted in order.
 */
export const lefts =
  <A extends Some, B extends Some> (list: List<Either<A, B>>): List<A> =>
    foldrList<Either<A, B>, List<A>> (m => acc => isLeft (m) ? cons (acc) (m .value) : acc)
                                 (emptyList ())
                                 (list);

/**
 * `rights :: [Either a b] -> [b]`
 *
 * Extracts from a list of `Either` all the `Right` elements. All the `Right`
 * elements are extracted in order.
 */
export const rights =
  <A extends Some, B extends Some> (list: List<Either<A, B>>): List<B> =>
    foldrList<Either<A, B>, List<B>> (m => acc => isRight (m) ? cons (acc) (m .value) : acc)
                                 (emptyList ())
                                 (list);

/**
 * `partitionEithers :: [Either a b] -> ([a], [b])`
 *
 * Partitions a list of `Either` into two lists. All the `Left` elements are
 * extracted, in order, to the first component of the output. Similarly the
 * `Right` elements are extracted to the second component of the output.
 */
export const partitionEithers =
  <A extends Some, B extends Some> (list: List<Either<A, B>>): Tuple<List<A>, List<B>> =>
    foldrList<Either<A, B>, Tuple<List<A>, List<B>>>
      (m => isRight (m) ? Tuple.second (cons_ (m .value)) : Tuple.first (cons_ (m .value)))
      (Tuple.of<List<A>, List<B>> (emptyList ()) (emptyList ()))
      (list);


// CUSTOM FUNCTIONS

/**
 * `isEither :: a -> Bool`
 *
 * Return `True` if the given value is an `Either`.
 */
export const isEither =
  (x: any): x is Either<any, any> =>
    x && (x.prototype === LeftPrototype || x.prototype === RightPrototype);

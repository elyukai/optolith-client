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

import { equals as requals, pipe } from 'ramda';
import { cons, cons_, empty, foldr, List } from './List.new';
import { fromJust, isJust, Just, Maybe, Nothing, Some } from './Maybe.new';
import { Tuple } from './tuple';
import { Mutable } from './typeUtils';

// CONTENT ACCESS KEY

const LEFT = Symbol ('LEFT');
const RIGHT = Symbol ('RIGHT');


// EITHER TYPE DEFINITION

export type Either<A extends Some, B extends Some> = Left<A> | Right<B>;


// CONSTRUCTORS

// Left

interface LeftConstructor {
  new <A extends Some>(value: A): Left<A>;
  prototype: Left<Some>;
}

interface Left<A extends Some> {
  readonly [LEFT]: A;
  toString (): string;
}

const _Left =
  function <A extends Some> (this: Mutable<Left<A>>, value: A) {
    Object.defineProperty (this, LEFT, { value });
  } as unknown as LeftConstructor;

_Left.prototype.toString = function (this: Left<Some>) {
  return `Left ${this[LEFT]}`;
}

export const Left = <A extends Some> (value: A) => new _Left (value);

// Right

interface RightConstructor {
  new <B extends Some>(value: B): Right<B>;
  prototype: Right<Some>;
}

interface Right<B extends Some> {
  readonly [RIGHT]: B;
  toString (): string;
}

const _Right =
  function <B extends Some> (this: Mutable<Right<B>>, value: B) {
    Object.defineProperty (this, RIGHT, { value });
  } as unknown as RightConstructor;

_Right.prototype.toString = function (this: Right<Some>) {
  return `Right ${this[RIGHT]}`;
}

export const Right = <B extends Some> (value: B) => new _Right (value);


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
      ? Right (fRight (m[RIGHT]))
      : Left (fLeft (m[LEFT]));

/**
 * `first :: (a -> b) -> Either a c -> Either b c`
 */
export const first =
  <A extends Some, B extends Some, C extends Some>
  (f: (left: A) => B) =>
  (m: Either<A, C>): Either<B, C> =>
    isLeft (m)
      ? Left (f (m[LEFT]))
      : m;

/**
 * `second :: (b -> c) -> Either a b -> Either a c`
 */
export const second =
  <A extends Some, B extends Some, C extends Some>
  (f: (right: B) => C) =>
  (m: Either<A, B>): Either<A, C> =>
    isRight (m)
      ? Right (f (m[RIGHT]))
      : m;


// MONAD

/**
 * `(>>=) :: Either e a -> (a -> Either e b) -> Either e b`
 */
export const bind =
  <E extends Some, A extends Some, B extends Some>
  (m: Either<E, A>) =>
  (f: (value: A) => Either<E, B>): Either<E, B> =>
    isLeft (m) ? m : f (m[RIGHT]);

/**
 * `(=<<) :: (a -> Maybe b) -> Maybe a -> Maybe b`
 */
export const bind_ =
  <E extends Some, A extends Some, B extends Some>
  (f: (value: A) => Either<E, B>) =>
  (m: Either<E, A>): Either<E, B> =>
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
 * Inject a value into an `Either` type.
 */
export const mreturn = Right;

/**
 * `(>=>) :: (a -> Either e b) -> (b -> Either e c) -> a -> Either e c`
 *
 * Left-to-right Kleisli composition of monads.
 */
export const kleisli =
  <E extends Some, A extends Some, B extends Some, C extends Some>
  (f1: (x: A) => Either<E, B>) =>
  (f2: (x: B) => Either<E, C>) =>
    pipe (f1, bind_ (f2));


// FUNCTOR

/**
 * `fmap :: (a -> b) -> Either a a -> Either a b`
 */
export const fmap =
  <A extends Some, B extends Some> (f: (value: A) => B) =>
    bind_<A, A, B> (pipe<A, B, Right<B>> (f, Right));

/**
 * `(<$) :: a -> Either a b -> Either a a`
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
 * `pure :: a -> Either e a`
 *
 * Inject a value into an `Either` type.
 */
export const pure = Right;

/**
 * `(<*>) :: Either e (a -> b) -> Either e a -> Either e b`
 */
export const ap =
  <E extends Some, A extends Some, B extends Some>
  (ma: Either<E, (value: A) => B>) =>
  (m: Either<E, A>): Either<E, B> =>
    isRight (ma) ? isRight (m) ? Right (ma[RIGHT] (m[RIGHT])) : m : ma;


// FOLDABLE

/**
 * `foldl :: (b -> a -> b) -> b -> Either a a -> b`
 *
 * Left-associative fold of a structure.
 *
 * In the case of lists, `foldl`, when applied to a binary operator, a
 * starting value (typically the left-identity of the operator), and a list,
 * reduces the list using the binary operator, from left to right:
 *
 * ```foldl f z [x1, x2, ..., xn] == (...((z `f` x1) `f` x2) `f`...) `f` xn```
 *
 * Note that to produce the outermost application of the operator the entire
 * input list must be traversed. This means that `foldl'` will diverge if
 * given an infinite list.
 *
 * Also note that if you want an efficient left-fold, you probably want to use
 * `foldl'` instead of `foldl`. The reason for this is that latter does not
 * force the "inner" results (e.g. `z f x1` in the above example) before
 * applying them to the operator (e.g. to `(f x2)`). This results in a thunk
 * chain `O(n)` elements long, which then must be evaluated from the
 * outside-in.
 *
 * For a general `Foldable` structure this should be semantically identical to,
 *
 * ```foldl f z = foldl f z . toList```
 */
export const foldl =
  <A extends Some, B extends Some> (fn: (acc: B) => (current: A) => B) =>
    (initial: B) => (m: Either<A, A>): B =>
      isRight (m) ? fn (initial) (m[RIGHT]) : initial;

/**
 * `elem :: Eq a => a -> Either a a -> Bool`
 *
 * Does the element occur in the structure?
 *
 * Always returns `False` if the provided `Either` is a `Left`.
 */
export const elem =
  <A extends Some> (e: A) => (m: Either<A, A>): boolean =>
    isRight (m) && e === m[RIGHT];

/**
 * `elem_ :: Eq a => Either a a -> a -> Bool`
 *
 * Does the element occur in the structure?
 *
 * Always returns `False` if the provided `Either` is a `Left`.
 *
 * Flipped version of `elem`.
 */
export const elem_ = <A extends Some> (m: Either<A, A>) => (e: A): boolean => elem (e) (m);

// Searches

/**
 * `notElem :: Eq a => a -> Maybe a -> Bool`
 *
 * `notElem` is the negation of `elem`.
 */
export const notElem =
  <A extends Some> (e: A) => (m: Either<A, A>): boolean =>
    !elem (e) (m);


// EQ

/**
 * `(==) :: Maybe a -> Maybe a -> Bool`
 *
 * Returns if both given values are equal.
 */
export const equals =
  <A extends Some, B extends Some> (m1: Either<A, B>) => (m2: Either<A, B>): boolean =>
    isRight (m1) && isRight (m2) && requals (m1[RIGHT]) (m2[RIGHT])
    || isLeft (m1) && isLeft (m2) && requals (m1[LEFT]) (m2[LEFT]);

/**
 * `(!=) :: Maybe a -> Maybe a -> Bool`
 *
 * Returns if both given values are not equal.
 */
export const notEquals =
  <A extends Some, B extends Some> (m1: Either<A, B>) => (m2: Either<A, B>): boolean =>
    !equals (m1) (m2);


// ORD

/**
 * `(>) :: Either a b -> Either a b -> Bool`
 *
 * Returns if the first value is greater than the second value.
 *
 * If the first value is a `Right` and the second is a `Left`, `(>)` always
 * returns `True`.
 *
 * If the first value is a `Left` and the second is a `Right`, `(>)` always
 * returns `False`.
 */
export const gt =
  <A extends number | string, B extends number | string>
  (m1: Either<A, B>) =>
  (m2: Either<A, B>): boolean =>
    isRight (m1) && isLeft (m2)
    || isRight (m1) && isRight (m2) && m1[RIGHT] > m2[RIGHT]
    || isLeft (m1) && isLeft (m2) && m1[LEFT] > m2[LEFT];

/**
 * `(<) :: Either a b -> Either a b -> Bool`
 *
 * Returns if the first value is lower than the second value.
 *
 * If the first value is a `Left` and the second is a `Right`, `(<)` always
 * returns `True`.
 *
 * If the first value is a `Right` and the second is a `Left`, `(<)` always
 * returns `False`.
 */
export const lt =
  <A extends number | string, B extends number | string>
  (m1: Either<A, B>) =>
  (m2: Either<A, B>): boolean =>
    isLeft (m1) && isRight (m2)
    || isRight (m1) && isRight (m2) && m1[RIGHT] < m2[RIGHT]
    || isLeft (m1) && isLeft (m2) && m1[LEFT] < m2[LEFT];

/**
 * `(>=) :: Either a b -> Either a b -> Bool`
 *
 * Returns if the first value is greater than or equals the second
 * value.
 *
 * If the first value is a `Right` and the second is a `Left`, `(>=)` always
 * returns `True`.
 *
 * If the first value is a `Left` and the second is a `Right`, `(>=)` always
 * returns `False`.
 */
export const gte =
  <A extends number | string, B extends number | string>
  (m1: Either<A, B>) =>
  (m2: Either<A, B>): boolean =>
    isRight (m1) && isLeft (m2)
    || isRight (m1) && isRight (m2) && m1[RIGHT] >= m2[RIGHT]
    || isLeft (m1) && isLeft (m2) && m1[LEFT] >= m2[LEFT];

/**
 * `(<=) :: Either a b -> Either a b -> Bool`
 *
 * Returns if the first value is lower than or equals the second
 * value.
 *
 * If the first value is a `Left` and the second is a `Right`, `(<=)` always
 * returns `True`.
 *
 * If the first value is a `Right` and the second is a `Left`, `(<=)` always
 * returns `False`.
 */
export const lte =
  <A extends number | string, B extends number | string>
  (m1: Either<A, B>) =>
  (m2: Either<A, B>): boolean =>
    isLeft (m1) && isRight (m2)
    || isRight (m1) && isRight (m2) && m1[RIGHT] <= m2[RIGHT]
    || isLeft (m1) && isLeft (m2) && m1[LEFT] <= m2[LEFT];


// SHOW

/**
 * `show :: Either a b -> String`
 */
export const show = (m: Either<any, any>): string => m.toString ();


// SEMIGROUP

// /**
//  * `mappend :: Semigroup a => Maybe a -> Maybe a -> Maybe a`
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
<A extends Some, B extends Some> (x: Either<A, B>): x is Left<A> => x instanceof _Left;

/**
* `isRight :: Either a b -> Bool`
*
* Return `True` if the given value is a `Right`-value, `False` otherwise.
*/
export const isRight =
<A extends Some, B extends Some> (x: Either<A, B>): x is Right<B> => x instanceof _Right;

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
    isRight (m)
      ? fRight (m[RIGHT])
      : fLeft (m[LEFT]);

/**
 * `lefts :: [Either a b] -> [a]`
 *
 * Extracts from a list of `Either` all the `Left` elements. All the `Left`
 * elements are extracted in order.
 */
export const lefts =
  <A extends Some, B extends Some> (list: List<Either<A, B>>): List<A> =>
    foldr<Either<A, B>, List<A>> (m => acc => isLeft (m) ? cons (acc) (m[LEFT]) : acc)
                                 (empty ())
                                 (list);

/**
 * `rights :: [Either a b] -> [b]`
 *
 * Extracts from a list of `Either` all the `Right` elements. All the `Right`
 * elements are extracted in order.
 */
export const rights =
  <A extends Some, B extends Some> (list: List<Either<A, B>>): List<B> =>
    foldr<Either<A, B>, List<B>> (m => acc => isRight (m) ? cons (acc) (m[RIGHT]) : acc)
                                 (empty ())
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
    foldr<Either<A, B>, Tuple<List<A>, List<B>>>
      (m => isRight (m) ? Tuple.second (cons_ (m[RIGHT])) : Tuple.first (cons_ (m[LEFT])))
      (Tuple.of<List<A>, List<B>> (empty ()) (empty ()))
      (list);


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
    isLeft (m) ? m [LEFT] : def;

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
    isRight (m) ? m [RIGHT] : def;

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
    isRight (m) ? m [RIGHT] : m [LEFT];

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
      return x [LEFT];
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
      return x [RIGHT];
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
    isRight (m) ? Just (m[RIGHT]) : Nothing;

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


// CUSTOM FUNCTIONS

/**
 * `isEither :: a -> Bool`
 *
 * Return `True` if the given value is an `Either`.
 */
export const isEither =
  (x: any): x is Either<any, any> =>
    x instanceof _Left || x instanceof _Right;

/**
 * @module Data.Maybe
 *
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
 * @see Either
 */

import { ReactNode } from "react"
import { pipe } from "../App/Utilities/pipe"
import { flip } from "./Function"
import * as ReOption from "./Ley_Option.gen"
import { cons, ifoldr, List } from "./List"
import { uncurryN, uncurryN3, uncurryN4, uncurryN5 } from "./Tuple/All"


// CONSTRUCTORS

export type Just<A> = A
export const Just = <A> (x: A): Just<A> => x

export type Nothing = undefined
export const Nothing: Nothing = undefined

const normalize = <A> (x: A | null | undefined): A | undefined => x === null ? undefined : x

export type Maybe<A> = A | undefined

export const isJust = <A> (x: Maybe<A>): x is Just<A> => ReOption.isSome (x)
export const isNothing = <A> (x: Maybe<A>): x is Nothing => ReOption.isNone (x)

/**
 * `Maybe :: a -> Maybe a`
 *
 * Creates a new `Maybe` from the given nullable value.
 */
// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Maybe =
  <A> (x: A | Nullable): Maybe<A> =>
    x !== null && x !== undefined ? Just (x) : Nothing


// MAYBE FUNCTIONS (PART 1)

/**
 * `fromJust :: Maybe a -> a`
 *
 * The `fromJust` function extracts the element out of a `Just` and throws an
 * error if its argument is `Nothing`.
 *
 * @throws TypeError
 */
export const fromJust =
  <A> (x: Just<A>): A => ReOption.fromSome (x)

/**
 * `fromMaybe :: a -> Maybe a -> a`
 *
 * The `fromMaybe` function takes a default value and and `Maybe` value. If
 * the `Maybe` is `Nothing`, it returns the default values otherwise, it
 * returns the value contained in the `Maybe`.
 */
export const fromMaybe =
  <A> (def: A) => (x: Maybe<A>): A =>
    ReOption.fromOption (def, x)

/**
 * `fromMaybe' :: (() -> a) -> Maybe a -> a`
 *
 * The `fromMaybe'` function takes a default value and and `Maybe` value. If
 * the `Maybe` is `Nothing`, it returns the default values otherwise, it
 * returns the value contained in the `Maybe`.
 *
 * Lazy version of `fromMaybe`.
 */
export const fromMaybe_ =
  <A> (def: () => A) => (x: Maybe<A>): A =>
    ReOption.isSome (x) ? ReOption.fromSome (x) : def ()


// FUNCTOR

/**
 * `fmap :: (a -> b) -> f a -> f b`
 */
export const fmap =
  <A, B> (f: (x: A) => B) => (x: Maybe<A>): Maybe<B> =>
    normalize (ReOption.Functor_fmap (f, x))

/**
 * `fmapF :: f a -> (a -> b) -> f b`
 */
export const fmapF =
  <A> (x: Maybe<A>) => <B> (f: (x: A) => B): Maybe<B> =>
    normalize (ReOption.Functor_fmap (f, x))


// APPLICATIVE

/**
 * `pure :: a -> Maybe a`
 *
 * Lift a value.
 */
export const pure = ReOption.Monad_return

/**
 * `(<*>) :: Maybe (a -> b) -> Maybe a -> Maybe b`
 *
 * Sequential application.
 */
export const ap =
  <A, B>
  (f: Maybe<(x: A) => B>) =>
  (x: Maybe<A>): Maybe<B> =>
    normalize (ReOption.Applicative_ap (f, x))


// ALTERNATIVE

/**
 * `alt :: Maybe a -> Maybe a -> Maybe a`
 *
 * Returns the first `Maybe` if it is `Just`, otherwise the second.
 */
export const alt =
  <A> (x: Maybe<A>) => (y: Maybe<A>): Maybe<A> =>
    normalize (ReOption.Alternative_alt (x, y))

/**
 * `alt' :: Maybe a -> Maybe a -> Maybe a`
 *
 * Returns the first `Maybe` if it is `Just`, otherwise the second.
 *
 * Lazy version of `alt`.
 */
export const alt_ =
  <A> (x: Maybe<A>) => (g: () => Maybe<A>): Maybe<A> =>
    ReOption.isSome (x) ? x : g ()

/**
 * `altF :: Maybe a -> Maybe a -> Maybe a`
 *
 * Returns the second `Maybe` if it is `Just`, otherwise the first.
 *
 * Flipped version of `alt`.
 */
export const altF =
  <A> (y: Maybe<A>) => (x: Maybe<A>): Maybe<A> =>
    normalize (ReOption.Alternative_alt (x, y))

/**
 * `altF' :: Maybe a -> Maybe a -> Maybe a`
 *
 * Returns the second `Maybe` if it is `Just`, otherwise the first.
 *
 * Flipped version of `alt'`.
 */
export const altF_ =
  <A> (g: () => Maybe<A>) => (x: Maybe<A>): Maybe<A> =>
    ReOption.isSome (x) ? x : g ()

/**
 * `empty :: Maybe a`
 */
export const empty = Nothing

/**
 * `guard :: Bool -> Maybe ()`
 *
 * Conditional failure of Alternative computations. Defined by
 * ```hs
 * guard True  = pure ()
 * guard False = empty
 * ```
 * In TypeScript, this is not possible, so instead it's
 * ```ts
 * guard (true)  = pure (true)
 * guard (false) = empty
 * ```
 */
export const guard =
  (pred: boolean): Maybe<void> =>
    normalize (ReOption.Alternative_guard (pred))

/**
 * `guard' :: (() -> Bool) -> Maybe ()`
 *
 * Conditional failure of Alternative computations. Defined by
 *
 * ```haskell
 * guard True  = pure ()
 * guard False = empty
 * ```
 *
 * In TypeScript, this is not possible, so instead it's
 *
 * ```ts
 * guard (true)  = pure (true)
 * guard (false) = empty
 * ```
 *
 * Lazy version of `guard`.
 */
export const guard_ =
  (pred: () => boolean): Maybe<void> =>
    normalize (pred () ? pure<void> (undefined) : empty)


// MONAD

/**
 * `(>>=) :: Maybe a -> (a -> Maybe b) -> Maybe b`
 */
export const bind =
  <A>
  (m: Maybe<A>) =>
  <B>
  (f: (x: A) => Maybe<B>): Maybe<B> =>
    normalize (ReOption.Monad_bind (x, f))

/**
 * `(=<<) :: Monad m => (a -> m b) -> m a -> m b`
 */
export const bindF =
  <A, B>
  (f: (x: A) => Maybe<B>) =>
  (x: Maybe<A>): Maybe<B> =>
    normalize (ReOption.Monad_bindF (f, x))

/**
 * `(>>) :: Maybe a -> Maybe b -> Maybe b`
 *
 * Sequentially compose two actions, discarding any value produced by the
 * first, like sequencing operators (such as the semicolon) in imperative
 * languages.
 *
 * ```a >> b = a >>= \ _ -> b```
 */
export const then =
  (x: Maybe<any>) => <A> (y: Maybe<A>): Maybe<A> =>
    normalize (ReOption.Monad_then (x, y))

/**
 * `(<<) :: Maybe a -> Maybe b -> Maybe a`
 *
 * Sequentially compose two actions, discarding any value produced by the
 * second.
 */
export const thenF =
  <A> (x: Maybe<A>) => (y: Maybe<any>): Maybe<A> =>
    normalize (ReOption.Monad_thenF (x, y))

/**
 * `(>=>) :: (a -> Maybe b) -> (b -> Maybe c) -> a -> Maybe c`
 *
 * Left-to-right Kleisli composition of monads.
 */
export const kleisli =
  <A, B>
  (f: (x: A) => Maybe<B>) =>
  <C>
  (g: (x: B) => Maybe<C>) =>
  (x: A): Maybe<C> =>
    normalize (ReOption.Monad_kleisli (f, g, x))

/**
 * `join :: Maybe (Maybe a) -> Maybe a`
 *
 * The `join` function is the conventional monad join operator. It is used to
 * remove one level of monadic structure, projecting its bound argument into the
 * outer level.
 */
export const join =
  <A> (x: Maybe<Maybe<A>>): Maybe<A> =>
    normalize (ReOption.Monad_join (x))

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type join<A> = (x: Maybe<Maybe<A>>) => Maybe<A>

/**
 * `mapM :: (a -> Maybe b) -> [a] -> Maybe [b]`
 *
 * `mapM f xs` takes a function and a list and maps the function over every
 * element in the list. If the function returns a `Nothing`, it is immediately
 * returned by the function. If `f` did not return any `Nothing`, the list of
 * unwrapped return values is returned as a `Just`. If `xs` is empty,
 * `Just []` is returned.
 */
export const mapM =
  <A, B>
  (f: (x: A) => Maybe<B>) =>
  (xs: List<A>): Maybe<List<B>> =>
    normalize (ReOption.Monad_mapM (f, xs))

/**
 * `liftM2 :: (a1 -> a2 -> r) -> Maybe a1 -> Maybe a2 -> Maybe r`
 *
 * Promote a function to a monad, scanning the monadic arguments from left to
 * right.
 */
export const liftM2 =
  <A1, A2, B>
  (f: (a1: A1) => (a2: A2) => B) =>
  (x1: Maybe<A1>) =>
  (x2: Maybe<A2>): Maybe<B> =>
    normalize (ReOption.Monad_liftM2 (uncurryN (f), x1, x2))

/**
 * `liftM3 :: (a1 -> a2 -> a3 -> r) -> Maybe a1 -> Maybe a2 -> Maybe a3 -> Maybe r`
 *
 * Promote a function to a monad, scanning the monadic arguments from left to
 * right.
 */
export const liftM3 =
  <A1, A2, A3, B>
  (f: (x1: A1) => (x2: A2) => (x3: A3) => B) =>
  (x1: Maybe<A1>) =>
  (x2: Maybe<A2>) =>
  (x3: Maybe<A3>): Maybe<B> =>
    normalize (ReOption.Monad_liftM3 (uncurryN3 (f), x1, x2, x3))

/**
 * `liftM4 :: Maybe m => (a1 -> a2 -> a3 -> a4 -> r) -> m a1 -> m a2 -> m a3 ->
m a4 -> m r`
 *
 * Promote a function to a monad, scanning the monadic arguments from left to
 * right.
 */
export const liftM4 =
  <A1, A2, A3, A4, B>
  (f: (a1: A1) => (a2: A2) => (a3: A3) => (a4: A4) => B) =>
  (x1: Maybe<A1>) =>
  (x2: Maybe<A2>) =>
  (x3: Maybe<A3>) =>
  (x4: Maybe<A4>): Maybe<B> =>
    normalize (ReOption.Monad_liftM4 (uncurryN4 (f), x1, x2, x3, x4))

/**
 * `liftM5 :: Maybe m => (a1 -> a2 -> a3 -> a4 -> a5 -> r) -> m a1 -> m a2 -> m
a3 -> m a4 -> m a5 -> m r`
 *
 * Promote a function to a monad, scanning the monadic arguments from left to
 * right.
 */
export const liftM5 =
  <A1, A2, A3, A4, A5, B>
  (f: (a1: A1) => (a2: A2) => (a3: A3) => (a4: A4) => (a5: A5) => B) =>
  (x1: Maybe<A1>) =>
  (x2: Maybe<A2>) =>
  (x3: Maybe<A3>) =>
  (x4: Maybe<A4>) =>
  (x5: Maybe<A5>): Maybe<B> =>
    normalize (ReOption.Monad_liftM5 (uncurryN5 (f), x1, x2, x3, x4, x5))


// FOLDABLE

/**
 * `foldr :: (a -> b -> b) -> b -> Maybe a -> b`
 *
 * Right-associative fold of a structure.
 */
export const foldr =
  <A, B>
  (f: (x: A) => (acc: B) => B) =>
  (initial: B) =>
  (x: Maybe<A>): B =>
    ReOption.Foldable_foldr (uncurryN (f), initial, x)

/**
 * `foldl :: (b -> a -> b) -> b -> Maybe a -> b`
 *
 * Left-associative fold of a structure.
 */
export const foldl =
  <A, B>
  (f: (acc: B) => (x: A) => B) =>
  (initial: B) =>
  (x: Maybe<A>): B =>
    ReOption.Foldable_foldl (uncurryN (f), initial, x)

/**
 * `toList :: Maybe a -> [a]`
 *
 * List of elements of a structure, from left to right.
 */
export const toList =
  <A>(x: Maybe<A>): List<A> =>
    ReOption.Foldable_toList (x)

/**
 * `null :: Maybe a -> Bool`
 *
 * Test whether the structure is empty. The default implementation is optimized
 * for structures that are similar to cons-lists, because there is no general
 * way to do better.
 */
export const fnull = ReOption.Foldable_fnull

/**
 * `length :: Maybe a -> Int`
 *
 * Returns the size/length of a finite structure as an `Int`. The default
 * implementation is optimized for structures that are similar to cons-lists,
 * because there is no general way to do better.
 */
export const flength = (x: Maybe<any>): number => ReOption.Foldable_flength (x)

/**
 * `elem :: Eq a => a -> Maybe a -> Bool`
 *
 * Does the element occur in the structure?
 *
 * Always returns `False` if the provided `Maybe` is `Nothing`.
 */
export const elem =
  <A> (x: A) => (y: Maybe<A>): boolean =>
    ReOption.Foldable_elem (x, y)

/**
 * `elemF :: Eq a => Maybe a -> a -> Bool`
 *
 * Does the element occur in the structure?
 *
 * Always returns `False` if the provided `Maybe` is `Nothing`.
 *
 * Flipped version of `elem`.
 */
export const elemF =
  <A> (y: Maybe<A>) => (x: A): boolean =>
    ReOption.Foldable_elem (x, y)

/**
 * `sum :: Num a => Maybe a -> a`
 *
 * The `sum` function computes the sum of the numbers of a structure.
 */
export const sum = ReOption.Foldable_sum

/**
 * `product :: Num a => Maybe a -> a`
 *
 * The `product` function computes the product of the numbers of a structure.
 */
export const product = ReOption.Foldable_product

// Specialized folds

/**
 * `concat :: Maybe [a] -> [a]`
 *
 * The concatenation of all the elements of a container of lists.
 */
export const concat =
  <A>(x: Maybe<List<A>>): List<A> =>
    ReOption.Foldable_concat (x)

/**
 * `concatMap :: (a -> [b]) -> Maybe a -> [b]`
 *
 * Map a function over all the elements of a container and concatenate the
 * resulting lists.
 */
export const concatMap =
  <A, B>
  (f: (x: A) => List<B>) =>
  (x: Maybe<A>): List<B> =>
    ReOption.Foldable_concatMap (f, x)

/**
 * `and :: Maybe Bool -> Bool`
 *
 * `and` returns the conjunction of a container of Bools. For the result to be
 * `True`, the container must be finite `False`, however, results from a
 * `False` value finitely far from the left end.
 *
 * ```haskell
 * and Nothing = true
 * and Just x  = x
 * ```
 */
export const and = ReOption.Foldable_and

/**
 * `or :: Maybe Bool -> Bool`
 *
 * `or` returns the disjunction of a container of Bools. For the result to be
 * `False`, the container must be finite `True`, however, results from a
 * `True` value finitely far from the left end.
 *
 * ```haskell
 * or Nothing = false
 * or Just x  = x
 * ```
 */
export const or = ReOption.Foldable_or

interface Any {
  <A, A1 extends A>
  (f: (x: A) => x is A1):
  (x: Maybe<A>) => x is Just<A1>

  <A>
  (f: (x: A) => boolean):
  (x: Maybe<A>) => x is Just<A>
}

/**
 * `any :: (a -> Bool) -> Maybe a -> Bool`
 *
 * Determines whether any element of the structure satisfies the predicate.
 *
 * ```haskell
 * any _ Nothing  = False
 * any f (Just x) = f x
 * ```
 */
export const any: Any =
  <A>
  (f: (x: A) => boolean) =>
  (x: Maybe<A>): x is Just<A> =>
    ReOption.Foldable_any (f, x)

interface All {
  <A, A1 extends A> (f: (x: A) => x is A1): (x: Maybe<A>) => x is Maybe<A1>
  <A> (f: (x: A) => boolean): (x: Maybe<A>) => boolean
}

/**
 * `all :: (a -> Bool) -> Maybe a -> Bool`
 *
 * Determines whether all elements of the structure satisfy the predicate.
 *
 * ```haskell
 * any _ Nothing  = True
 * any f (Just x) = f x
 * ```
 */
export const all = (
  <A>
  (f: (x: A) => boolean) =>
  (x: Maybe<A>): boolean =>
    ReOption.Foldable_all (f, x)
) as All

// Searches

/**
 * `notElem :: Eq a => a -> Maybe a -> Bool`
 *
 * `notElem` is the negation of `elem`.
 */
export const notElem =
  <A> (e: A) => (m: Maybe<A>): boolean =>
    ReOption.Foldable_notElem (e, m)

interface Find {

  /**
   * `find :: (a -> Bool) -> Maybe a -> Maybe a`
   *
   * The `find` function takes a predicate and a structure and returns the
   * leftmost element of the structure matching the predicate, or `Nothing` if
   * there is no such element.
   */
  <A, A1 extends A> (pred: (x: A) => x is A1): (x: Maybe<A>) => Maybe<A1>

  /**
   * `find :: (a -> Bool) -> Maybe a -> Maybe a`
   *
   * The `find` function takes a predicate and a structure and returns the
   * leftmost element of the structure matching the predicate, or `Nothing` if
   * there is no such element.
   */
  <A> (pred: (x: A) => boolean): (x: Maybe<A>) => Maybe<A>
}

/**
 * `find :: (a -> Bool) -> Maybe a -> Maybe a`
 *
 * The `find` function takes a predicate and a structure and returns the
 * leftmost element of the structure matching the predicate, or `Nothing` if
 * there is no such element.
 */
export const find: Find =
  <A> (pred: (x: A) => boolean) => (x: Maybe<A>): Maybe<A> =>
    normalize (ReOption.Foldable_find (pred, x))


// SEMIGROUP

/**
 * `mappend :: Semigroup a => Maybe a -> Maybe a -> Maybe a`
 *
 * Concatenates the `Semigroup`s contained in the two `Maybe`s, if both are of
 * type `Just a`. If at least one of them is `Nothing`, it returns the first
 * element.
 */
export const mappend =
  <A> (x: Maybe<List<A>>) => (y: Maybe<List<A>>): Maybe<List<A>> =>
    normalize (ReOption.Semigroup_sappend (x, y))


// MAYBE FUNCTIONS (PART 2)

/**
 * `maybe :: b -> (a -> b) -> Maybe a -> b`
 *
 * The `maybe` function takes a default value, a function, and a `Maybe`
 * value. If the `Maybe` value is `Nothing`, the function returns the default
 * value. Otherwise, it applies the function to the value inside the `Just`
 * and returns the result.
 */
export const maybe =
  <B> (def: B) =>
  <A> (f: (x: A) => B) =>
  (x: Maybe<A>): B =>
    ReOption.option (def, f, x)

/**
 * `listToMaybe :: [a] -> Maybe a`
 *
 * The `listToMaybe` function returns `Nothing` on an empty list or `Just a`
 * where `a` is the first element of the list.
 */
export const listToMaybe =
  <A> (xs: List<A>): Maybe<A> =>
    normalize (ReOption.listToOption (xs))

/**
 * `maybeToList :: Maybe a -> [a]`
 *
 * The `maybeToList` function returns an empty list when given `Nothing` or a
 * singleton list when not given `Nothing`.
 */
export const maybeToList = ReOption.optionToList

/**
 * `catMaybes :: [Maybe a] -> [a]`
 *
 * The `catMaybes` function takes a list of `Maybe`s and returns a list of all
 * the `Just` values.
 */
export const catMaybes =
  <A> (xs: List<Maybe<A>>): List<A> => ReOption.catOptions (xs)

/**
 * `mapMaybe :: (a -> Maybe b) -> [a] -> [b]`
 *
 * The `mapMaybe` function is a version of `map` which can throw out elements.
 * If particular, the functional argument returns something of type `Maybe b`.
 * If this is `Nothing`, no element is added on to the result list. If it is
 * `Just b`, then `b` is included in the result list.
 */
export const mapMaybe =
  <A, B> (f: (x: A) => Maybe<B>) => (xs: List<A>): List<B> =>
    ReOption.mapOption (f, xs)


// CUSTOM MAYBE FUNCTIONS

interface Ensure {

  /**
   * `ensure :: (a -> Bool) -> a -> Maybe a`
   *
   * Creates a new `Just a` from the given value if the given predicate
   * evaluates to `True` and the given value is not nullable. Otherwise returns
   * `Nothing`.
   */
  <A, A1 extends A>
  (pred: (x: A) => x is A1):
  (x: A) => Maybe<A1>

  /**
   * `ensure :: (a -> Bool) -> a -> Maybe a`
   *
   * Creates a new `Just a` from the given value if the given predicate
   * evaluates to `True` and the given value is not nullable. Otherwise returns
   * `Nothing`.
   */
  <A>
  (pred: (x: A) => boolean):
  (x: A) => Maybe<A>
}

/**
 * `ensure :: (a -> Bool) -> a -> Maybe a`
 *
 * Creates a new `Just a` from the given value if the given predicate
 * evaluates to `True`. Otherwise returns `Nothing`.
 */
export const ensure: Ensure =
  <A>
  (pred: (x: A) => boolean) =>
  (x: A): Maybe<A> =>
    normalize (ReOption.ensure (pred, x))

Maybe.ensure = ensure

/**
 * `imapMaybe :: (Int -> a -> Maybe b) -> [a] -> [b]`
 *
 * The `imapMaybe` function is a version of `map` which can throw out
 * elements. If particular, the functional argument returns something of type
 * `Maybe b`. If this is `Nothing`, no element is added on to the result list.
 * If it is `Just b`, then `b` is included in the result list.
 */
export const imapMaybe =
  <A, B>
  (f: (index: number) => (x: A) => Maybe<B>) =>
    ifoldr<A, List<B>>
      (index => flip (acc => pipe (
                       f (index),
                       maybe<List<B>> (acc)
                                      (cons (acc))
                     )))
      (List.empty)

Maybe.imapMaybe = imapMaybe

/**
 * `maybeToNullable :: Maybe a -> (a | Null)`
 *
 * The `maybeToNullable` function returns `null` when given `Nothing` or
 * returns the value inside the `Just`.
 */
export const maybeToNullable =
  <A>
  (x: Maybe<A>): A | null =>
    ReOption.isSome (x) ? ReOption.fromSome (x) : null

Maybe.maybeToNullable = maybeToNullable

/**
 * `maybeToUndefined :: Maybe a -> (a | undefined)`
 *
 * The `maybeToUndefined` function returns `undefined` when given `Nothing` or
 * returns the value inside the `Just`.
 */
export const maybeToUndefined =
  <A>
  (x: Maybe<A>): A | undefined =>
    ReOption.isSome (x) ? ReOption.fromSome (x) : undefined

Maybe.maybeToUndefined = maybeToUndefined

/**
 * `maybe' :: (() -> b) -> (a -> b) -> Maybe a -> b`
 *
 * The `maybe'` function takes a default value, a function, and a `Maybe`
 * value. If the `Maybe` value is `Nothing`, the function returns the default
 * value. Otherwise, it applies the function to the value inside the `Just`
 * and returns the result.
 *
 * This is a lazy variant of `maybe`.
 */
export const maybe_ =
  <B>
  (def: () => B) =>
    maybe<B> (def ())

export const INTERNAL_shallowEquals =
  <A>
  (x: Maybe<A>) =>
  (y: Maybe<A>) =>
    (ReOption.isNone (x) && ReOption.isNone (y))
    || (
      ReOption.isSome (x)
      && ReOption.isSome (y)
      && ReOption.fromSome (x) === ReOption.fromSome (y)
    )

// REACT-SPECIFIC FUNCTIONS

/**
 * `maybeR :: (a -> b) -> Maybe a -> b | Null`
 *
 * The function `maybeR f x` maps the function `f` over the inner value of `x`
 * if `x` is a `Just` and then returns the result, otherwise it returns `null`.
 */
export const maybeRNull = <A, B extends ReactNode> (f: (x: A) => B) => (x: Maybe<A>): B | null =>
  maybe<B | null> (null) (f) (x)

Maybe.maybeRNull = maybeRNull

/**
 * `maybeRF :: Maybe a -> (a -> b) -> b | Null`
 *
 * The function `maybeRF x f` maps the function `f` over the inner value of `x`
 * if `x` is a `Just` and then returns the result, otherwise it returns `null`.
 */
export const maybeRNullF = <A> (m: Maybe<A>) => <B extends ReactNode> (f: (x: A) => B): B | null =>
  maybe<B | null> (null) (f) (m)

Maybe.maybeRNullF = maybeRNullF

/**
 * `joinMaybeList :: Maybe [a] -> [a]`
 *
 * Returns an empty list on `Nothing`, otherwise the contained list.
 */
export const joinMaybeList = <A> (x: Maybe<List<A>>): List<A> => fromMaybe (List<A> ()) (x)

Maybe.joinMaybeList = joinMaybeList

/**
 * `guardReplace :: Bool -> a -> Maybe a`
 *
 * `guardReplace cond x` returns `Just x` if `cond` is `True`, otherwise
 * `Nothing`.
 *
 * ```haskell
 * guardReplace = (flip mapReplace) . guard
 * ```
 */
export const guardReplace: (cond: boolean) => <A> (x: A) => Maybe<A> =
  cond => x => cond ? Just (x) : Nothing

Maybe.guardReplace = guardReplace

/**
 * `orN :: Bool | Undefined -> Bool`
 *
 * ```haskell
 * orN True == True
 * orN False == False
 * orN Undefined == False
 * ```
 */
export const orN: (x: boolean | undefined) => boolean = x => x === undefined ? false : x

Maybe.orN = orN


// NAMESPACED FUNCTIONS

Maybe.Just = Just
Maybe.fromNullable = Maybe

Maybe.pure = pure
Maybe.ap = ap

Maybe.alt = alt
Maybe.alt_ = alt_
Maybe.altF = altF
Maybe.altF_ = altF_
Maybe.guard = guard
Maybe.guard_ = guard_

Maybe.bind = bind
Maybe.bindF = bindF
Maybe.then = then
Maybe.kleisli = kleisli
Maybe.join = join
Maybe.mapM = mapM
Maybe.liftM2 = liftM2
Maybe.liftM3 = liftM3
Maybe.liftM4 = liftM4
Maybe.liftM5 = liftM5

Maybe.foldr = foldr
Maybe.foldl = foldl
Maybe.toList = toList
Maybe.fnull = fnull
Maybe.flength = flength
Maybe.elem = elem
Maybe.elemF = elemF
Maybe.sum = sum
Maybe.product = product
Maybe.concat = concat
Maybe.concatMap = concatMap
Maybe.and = and
Maybe.or = or
Maybe.any = any
Maybe.all = all
Maybe.notElem = notElem
Maybe.find = find

Maybe.isJust = ReOption.isSome
Maybe.isNothing = ReOption.isNone
Maybe.fromJust = fromJust
Maybe.fromMaybe = fromMaybe
Maybe.fromMaybe_ = fromMaybe_

Maybe.maybe = maybe
Maybe.maybe_ = maybe_
Maybe.listToMaybe = listToMaybe
Maybe.maybeToList = maybeToList
Maybe.catMaybes = catMaybes
Maybe.mapMaybe = mapMaybe


// TYPE HELPERS

export type MaybeI<A> = A extends Maybe<infer AI> ? AI : never

// tslint:disable-next-line:interface-over-type-literal
export type Some = string | number | boolean | object | symbol
export type Nullable = null | undefined

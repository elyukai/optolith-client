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

import { pipe } from "ramda";
import * as Math from "../App/Utils/mathUtils";
import { cnst, ident, thrush } from "./Function";
import { cons, consF, head, ifoldr, List } from "./List";


// MAYBE TYPE DEFINITION

export type Maybe<A extends Some> = Just<A> | Nothing


// CONSTRUCTORS

// Just

interface JustPrototype {
  readonly isJust: true
  readonly isNothing: false
}

export interface Just<A extends Some> extends JustPrototype {
  readonly value: A
}

const JustPrototype =
  Object.freeze<JustPrototype> ({
    isJust: true,
    isNothing: false,
  })

/**
 * `Just :: a -> Maybe a`
 *
 * Creates a new `Just` from the passed value.
 */
export const Just = <A extends Some> (x: A): Just<A> => {
  if (x !== null && x !== undefined) {
    return Object.create (
      JustPrototype,
      {
        value: {
          value: x,
          enumerable: true,
        },
      }
    )
  }

  throw new TypeError ("Cannot create a Just from a nullable value.")
}

// Nothing

interface NothingPrototype extends Object {
  readonly isJust: false
  readonly isNothing: true
}

export interface Nothing extends NothingPrototype { }

const NothingPrototype: NothingPrototype =
  Object.freeze<NothingPrototype> ({
    isJust: false,
    isNothing: true,
  })

/**
 * `Nothing :: Maybe a`
 *
 * The empty `Maybe`.
 */
export const Nothing: Nothing = Object.create (NothingPrototype)

/**
 * `fromNullable :: a -> Maybe a`
 *
 * Creates a new `Maybe` from the given nullable value.
 */
export const fromNullable =
  <A extends Some> (x: A | Nullable): Maybe<A> =>
    x !== null && x !== undefined ? Just (x) : Nothing


// MAYBE FUNCTIONS (PART 1)

/**
 * `isJust :: Maybe a -> Bool`
 *
 * The `isJust` function returns `true` if its argument is of the form
 * `Just _`.
 */
export const isJust =
  <A extends Some> (x: Maybe<A>): x is Just<A> =>
    Object.getPrototypeOf (x) === JustPrototype

/**
 * `isNothing :: Maybe a -> Bool`
 *
 * The `isNothing` function returns `true` if its argument is `Nothing`.
 */
export const isNothing = (x: Maybe<Some>): x is Nothing => x === Nothing

/**
 * `fromJust :: Maybe a -> a`
 *
 * The `fromJust` function extracts the element out of a `Just` and throws an
 * error if its argument is `Nothing`.
 *
 * @throws TypeError
 */
export const fromJust =
  <A extends Some> (x: Just<A>): A => {
    if (isJust (x)) {
      return x.value
    }

    throw new TypeError (`Cannot extract a value out of type Nothing.`)
  }

/**
 * `fromMaybe :: a -> Maybe a -> a`
 *
 * The `fromMaybe` function takes a default value and and `Maybe` value. If
 * the `Maybe` is `Nothing`, it returns the default values otherwise, it
 * returns the value contained in the `Maybe`.
 */
export const fromMaybe =
  <A extends Some> (def: A) => (x: Maybe<A>): A =>
    isJust (x) ? x .value : def


// FUNCTOR

/**
 * `fmap :: (a -> b) -> Maybe a -> Maybe b`
 */
export const fmap =
  <A extends Some, B extends Some>
  (f: (x: A) => B) => (x: Maybe<A>): Maybe<B> =>
    isJust (x) ? Just (f (x .value)) : x

/**
 * `(<$) :: a -> Maybe b -> Maybe a`
 *
 * Replace all locations in the input with the same value. The default
 * definition is `fmap . const`, but this may be overridden with a more
 * efficient version.
 */
export const mapReplace =
  <A extends Some, B extends Some>
  (x: A) =>
    fmap<B, A> (cnst (x))


// APPLICATIVE

/**
 * `pure :: a -> Maybe a`
 *
 * Lift a value.
 */
export const pure = Just

/**
 * `(<*>) :: Maybe (a -> b) -> Maybe a -> Maybe b`
 *
 * Sequential application.
 */
export const ap =
  <A extends Some, B extends Some>
  (f: Maybe<(x: A) => B>) =>
  (x: Maybe<A>): Maybe<B> =>
    isJust (f) ? fmap (f .value) (x) : f


// ALTERNATIVE

/**
 * `alt :: Maybe a -> Maybe a -> Maybe a`
 *
 * Returns the first `Maybe` if it is `Just`, otherwise the second.
 */
export const alt =
  <A extends Some> (x: Maybe<A>) => (y: Maybe<A>): Maybe<A> =>
    isJust (x) ? x : y

/**
 * `altF :: Maybe a -> Maybe a -> Maybe a`
 *
 * Returns the second `Maybe` if it is `Just`, otherwise the first.
 *
 * Flipped version of `alt`.
 */
export const altF =
  <A extends Some> (y: Maybe<A>) => (x: Maybe<A>): Maybe<A> =>
    alt (x) (y)

/**
 * `empty :: Maybe a`
 */
export const empty = Nothing

/**
 * `guard :: Bool -> Maybe ()`
 *
 * Conditional failure of Alternative computations. Defined by
```hs
guard True  = pure ()
guard False = empty
```
  * In TypeScript, this is not possible, so instead it's
```ts
guard (true)  = pure (true)
guard (false) = empty
```
  */
export const guard =
  (pred: boolean): Maybe<true> =>
    pred ? pure<true> (true) : empty


// MONAD

/**
 * `(>>=) :: Maybe a -> (a -> Maybe b) -> Maybe b`
 */
export const bind =
  <A extends Some, B extends Some>
  (x: Maybe<A>) =>
  (f: (x: A) => Maybe<B>): Maybe<B> =>
    isJust (x) ? f (x .value) : x

/**
 * `(=<<) :: Monad m => (a -> m b) -> m a -> m b`
 */
export const bindF =
  <A extends Some, B extends Some>
  (f: (x: A) => Maybe<B>) =>
  (x: Maybe<A>): Maybe<B> =>
    bind<A, B> (x) (f)


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
  <A extends Some> (x: Maybe<any>) => (y: Maybe<A>): Maybe<A> =>
    bind<any, A> (x) (_ => y)

/**
 * `(>=>) :: (a -> Maybe b) -> (b -> Maybe c) -> a -> Maybe c`
 *
 * Left-to-right Kleisli composition of monads.
 */
export const kleisli =
  <A extends Some, B extends Some, C extends Some>
  (f: (x: A) => Maybe<B>) =>
  (g: (x: B) => Maybe<C>) =>
    pipe (f, bindF (g))

/**
 * `join :: Maybe (Maybe a) -> Maybe a`
 *
 * The `join` function is the conventional monad join operator. It is used to
 * remove one level of monadic structure, projecting its bound argument into the
 * outer level.
 */
export const join =
  <A extends Some> (x: Maybe<Maybe<A>>): Maybe<A> =>
    bind<Maybe<A>, A> (x) (ident)

/**
 * `liftM2 :: (a1 -> a2 -> r) -> Maybe a1 -> Maybe a2 -> Maybe r`
 *
 * Promote a function to a monad, scanning the monadic arguments from left to
 * right.
 */
export const liftM2 =
  <A1 extends Some, A2 extends Some, B extends Some>
  (f: (a1: A1) => (a2: A2) => B) =>
  (x1: Maybe<A1>) =>
  (x2: Maybe<A2>): Maybe<B> =>
    bind<A1, B> (x1) (pipe (f, fmap, thrush (x2)))

/**
 * `liftM3 :: (a1 -> a2 -> a3 -> r) -> Maybe a1 -> Maybe a2 -> Maybe a3 -> Maybe r`
 *
 * Promote a function to a monad, scanning the monadic arguments from left to
 * right.
 */
export const liftM3 =
  <A1 extends Some, A2 extends Some, A3 extends Some, B extends Some>
  (f: (x1: A1) => (x2: A2) => (x3: A3) => B) =>
  (x1: Maybe<A1>) =>
  (x2: Maybe<A2>) =>
  (x3: Maybe<A3>): Maybe<B> =>
    bind<A1, B> (x1) (a1 => liftM2 (f (a1)) (x2) (x3))

/**
 * `liftM4 :: Maybe m => (a1 -> a2 -> a3 -> a4 -> r) -> m a1 -> m a2 -> m a3 ->
m a4 -> m r`
 *
 * Promote a function to a monad, scanning the monadic arguments from left to
 * right.
 */
export const liftM4 =
  <A1 extends Some, A2 extends Some, A3 extends Some, A4 extends Some, B extends Some>
  (f: (a1: A1) => (a2: A2) => (a3: A3) => (a4: A4) => B) =>
  (x1: Maybe<A1>) =>
  (x2: Maybe<A2>) =>
  (x3: Maybe<A3>) =>
  (x4: Maybe<A4>): Maybe<B> =>
    bind<A1, B> (x1) (a1 => liftM3 (f (a1)) (x2) (x3) (x4))

/**
 * `liftM5 :: Maybe m => (a1 -> a2 -> a3 -> a4 -> a5 -> r) -> m a1 -> m a2 -> m
a3 -> m a4 -> m a5 -> m r`
 *
 * Promote a function to a monad, scanning the monadic arguments from left to
 * right.
 */
export const liftM5 =
  <
    A1 extends Some,
    A2 extends Some,
    A3 extends Some,
    A4 extends Some,
    A5 extends Some,
    B extends Some
  >
  (f: (a1: A1) => (a2: A2) => (a3: A3) => (a4: A4) => (a5: A5) => B) =>
  (x1: Maybe<A1>) =>
  (x2: Maybe<A2>) =>
  (x3: Maybe<A3>) =>
  (x4: Maybe<A4>) =>
  (x5: Maybe<A5>): Maybe<B> =>
    bind<A1, B> (x1) (a1 => liftM4 (f (a1)) (x2) (x3) (x4) (x5))


// FOLDABLE

/**
 * `foldr :: (a -> b -> b) -> b -> Maybe a -> b`
 *
 * Right-associative fold of a structure.
 */
export const foldr =
  <A extends Some, B extends Some>
  (f: (x: A) => (acc: B) => B) =>
  (initial: B) =>
  (x: Maybe<A>): B =>
    isJust (x) ? f (x .value) (initial) : initial

/**
 * `foldl :: (b -> a -> b) -> b -> Maybe a -> b`
 *
 * Left-associative fold of a structure.
 */
export const foldl =
  <A extends Some, B extends Some>
  (f: (acc: B) => (x: A) => B) =>
  (initial: B) =>
  (x: Maybe<A>): B =>
    isJust (x) ? f (initial) (x .value) : initial

/**
 * `toList :: Maybe a -> [a]`
 *
 * List of elements of a structure, from left to right.
 */
export const toList =
  <A extends Some>(x: Maybe<A>): List<A> =>
    isJust (x) ? List.pure (x .value) : List.empty

/**
 * `null :: Maybe a -> Bool`
 *
 * Test whether the structure is empty. The default implementation is optimized
 * for structures that are similar to cons-lists, because there is no general
 * way to do better.
 */
export const fnull = isNothing

/**
 * `length :: Maybe a -> Int`
 *
 * Returns the size/length of a finite structure as an `Int`. The default
 * implementation is optimized for structures that are similar to cons-lists,
 * because there is no general way to do better.
 */
export const length = (x: Maybe<Some>): number => isJust (x) ? 1 : 0

/**
 * `elem :: Eq a => a -> Maybe a -> Bool`
 *
 * Does the element occur in the structure?
 *
 * Always returns `False` if the provided `Maybe` is `Nothing`.
 */
export const elem =
  <A extends Some> (x: A) => (y: Maybe<A>): boolean =>
    isJust (y) && x === y .value

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
  <A extends Some> (y: Maybe<A>) => (x: A): boolean =>
    elem (x) (y)

/**
 * `sum :: Num a => Maybe a -> a`
 *
 * The `sum` function computes the sum of the numbers of a structure.
 */
export const sum = fromMaybe (0)

/**
 * `product :: Num a => Maybe a -> a`
 *
 * The `product` function computes the product of the numbers of a structure.
 */
export const product = fromMaybe (1)

// Specialized folds

/**
 * `concat :: Maybe [a] -> [a]`
 *
 * The concatenation of all the elements of a container of lists.
 */
export const concat =
  <A extends Some>(x: Maybe<List<A>>): List<A> =>
    fromMaybe<List<A>> (List.empty) (x)

/**
 * `concatMap :: (a -> [b]) -> Maybe a -> [b]`
 *
 * Map a function over all the elements of a container and concatenate the
 * resulting lists.
 */
export const concatMap =
  <A extends Some, B extends Some>
  (f: (x: A) => List<B>) =>
  (x: Maybe<A>): List<B> =>
    fromMaybe<List<B>> (List.empty) (fmap (f) (x))

/**
 * `and :: Maybe Bool -> Bool`
 *
 * `and` returns the conjunction of a container of Bools. For the result to be
 * `True`, the container must be finite `False`, however, results from a
 * `False` value finitely far from the left end.
 */
export const and = fromMaybe (true)

/**
 * `or :: Maybe Bool -> Bool`
 *
 * `or` returns the disjunction of a container of Bools. For the result to be
 * `False`, the container must be finite `True`, however, results from a
 * `True` value finitely far from the left end.
 */
export const or = fromMaybe (false)

/**
 * `any :: (a -> Bool) -> Maybe a -> Bool`
 *
 * Determines whether any element of the structure satisfies the predicate.
 */
export const any =
  <A extends Some>
  (f: (x: A) => boolean) =>
  (x: Maybe<A>): x is Just<A> =>
    fromMaybe (false) (fmap (f) (x))

/**
 * `all :: (a -> Bool) -> Maybe a -> Bool`
 *
 * Determines whether all elements of the structure satisfy the predicate.
 */
export const all =
  <A extends Some>
  (f: (x: A) => boolean) =>
  (x: Maybe<A>): boolean =>
    fromMaybe (true) (fmap (f) (x))

// Searches

/**
 * `notElem :: Eq a => a -> Maybe a -> Bool`
 *
 * `notElem` is the negation of `elem`.
 */
export const notElem =
  <A extends Some> (e: A) => (m: Maybe<A>): boolean =>
    !elem (e) (m)

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
    isJust (x) && pred (x .value) ? x : Nothing


// ORD

/**
 * `(>) :: Maybe a -> Maybe a -> Bool`
 *
 * Returns if the *second* value is greater than the first value.
 *
 * If one of the values is `Nothing`, `(>)` always returns `false`.
 */
export const gt =
  (x: Maybe<number>) => (y: Maybe<number>): boolean =>
    fromMaybe (false) (liftM2 (Math.gt) (x) (y))

/**
 * `(<) :: Maybe a -> Maybe a -> Bool`
 *
 * Returns if the *second* value is lower than the first value.
 *
 * If one of the values is `Nothing`, `(<)` always returns `false`.
 */
export const lt =
  (x: Maybe<number>) => (y: Maybe<number>): boolean =>
    fromMaybe (false) (liftM2 (Math.lt) (x) (y))

/**
 * `(>=) :: Maybe a -> Maybe a -> Bool`
 *
 * Returns if the *second* value is greater than or equals the first
 * value.
 *
 * If one of the values is `Nothing`, `(>=)` always returns `false`.
 */
export const gte =
  (x: Maybe<number>) => (y: Maybe<number>): boolean =>
    fromMaybe (false) (liftM2 (Math.gte) (x) (y))

/**
 * `(<=) :: Maybe a -> Maybe a -> Bool`
 *
 * Returns if the *second* value is lower than or equals the first
 * value.
 *
 * If one of the values is `Nothing`, `(<=)` always returns `false`.
 */
export const lte =
  (x: Maybe<number>) => (y: Maybe<number>): boolean =>
    fromMaybe (false) (liftM2 (Math.lte) (x) (y))


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
    isJust (x) && isJust (y)
      ? Just (List.append (fromJust (x)) (fromJust (y)))
      : x


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
  <A extends Some, B extends Some>
  (def: B) =>
  (f: (x: A) => B) =>
    foldl<A, B> (() => f) (def)

/**
 * `listToMaybe :: [a] -> Maybe a`
 *
 * The `listToMaybe` function returns `Nothing` on an empty list or `Just a`
 * where `a` is the first element of the list.
 */
export const listToMaybe =
  <A extends Some> (xs: List<A>): Maybe<A> =>
    List.fnull (xs) ? Nothing : Just (head (xs))

/**
 * `maybeToList :: Maybe a -> [a]`
 *
 * The `maybeToList` function returns an empty list when given `Nothing` or a
 * singleton list when not given `Nothing`.
 */
export const maybeToList = toList

/**
 * `catMaybes :: [Maybe a] -> [a]`
 *
 * The `catMaybes` function takes a list of `Maybe`s and returns a list of all
 * the `Just` values.
 */
export const catMaybes =
  <A extends Some>
  (xs: List<Maybe<A>>): List<A> =>
    List.foldr<Maybe<A>, List<A>> (maybe<A, (x: List<A>) => List<A>> (ident)
                                                                     (consF))
                                  (List.empty)
                                  (xs)

/**
 * `mapMaybe :: (a -> Maybe b) -> [a] -> [b]`
 *
 * The `mapMaybe` function is a version of `map` which can throw out elements.
 * If particular, the functional argument returns something of type `Maybe b`.
 * If this is `Nothing`, no element is added on to the result list. If it is
 * `Just b`, then `b` is included in the result list.
 */
export const mapMaybe =
  <A extends Some, B extends Some>
  (f: (x: A) => Maybe<B>) =>
    List.foldr<A, List<B>> (pipe (
                             f,
                             maybe<B, (x: List<B>) => List<B>> (ident)
                                                               (consF)
                           ))
                           (List.empty)


// CUSTOM MAYBE FUNCTIONS

/**
 * `isMaybe :: a -> Bool`
 *
 * The `isMaybe` function returns `True` if its argument is a `Maybe`.
 */
export const isMaybe =
  (x: any): x is Maybe<any> =>
    typeof x === "object" && x !== null && isJust (x) || isNothing (x)

/**
 * `normalize :: (a | Maybe a) -> Maybe a`
 *
 * Creates a new `Maybe` from the given nullable value. If the value is
 * already an instance of `Maybe`, it will just return the value.
 */
export const normalize =
  <A extends Some>
  (x: A | Nullable | Maybe<A>): Maybe<A> =>
    isMaybe (x) ? x : fromNullable (x)

interface Ensure {
  /**
   * `ensure :: (a -> Bool) -> a -> Maybe a`
   *
   * Creates a new `Just a` from the given value if the given predicate
   * evaluates to `True` and the given value is not nullable. Otherwise returns
   * `Nothing`.
   */
  <A extends Some, A1 extends A>
  (pred: (x: A) => x is A1):
  (x: A | Nullable) => Maybe<A1>

  /**
   * `ensure :: (a -> Bool) -> a -> Maybe a`
   *
   * Creates a new `Just a` from the given value if the given predicate
   * evaluates to `True` and the given value is not nullable. Otherwise returns
   * `Nothing`.
   */
  <A extends Some>
  (pred: (x: A) => boolean):
  (x: A | Nullable) => Maybe<A>
}

/**
 * `ensure :: (a -> Bool) -> a -> Maybe a`
 *
 * Creates a new `Just a` from the given value if the given predicate
 * evaluates to `True` and the given value is not nullable. Otherwise returns
 * `Nothing`.
 */
export const ensure: Ensure =
  <A extends Some>
  (pred: (x: A) => boolean) =>
  (x: A | Nullable): Maybe<A> =>
    bind<A, A> (fromNullable (x))
               (a => pred (a) ? Just (a) : Nothing)

/**
 * `imapMaybe :: (Int -> a -> Maybe b) -> [a] -> [b]`
 *
 * The `imapMaybe` function is a version of `map` which can throw out
 * elements. If particular, the functional argument returns something of type
 * `Maybe b`. If this is `Nothing`, no element is added on to the result list.
 * If it is `Just b`, then `b` is included in the result list.
 */
export const imapMaybe =
  <A extends Some, B extends Some>
  (f: (index: number) => (x: A) => Maybe<B>) =>
    ifoldr<A, List<B>>
      (index => x => acc =>
        pipe (
          f (index),
          maybe<B, List<B>> (acc)
                            (cons (acc)))
                            (x))
      (List.empty)

/**
 * `maybeToNullable :: Maybe a -> (a | Null)`
 *
 * The `maybeToNullable` function returns `null` when given `Nothing` or
 * returns the value inside the `Just`.
 */
export const maybeToNullable =
  <A extends Some>
  (x: Maybe<A>): A | null =>
    isJust (x) ? x .value : null

/**
 * `maybeToUndefined :: Maybe a -> (a | undefined)`
 *
 * The `maybeToUndefined` function returns `undefined` when given `Nothing` or
 * returns the value inside the `Just`.
 */
export const maybeToUndefined =
  <A extends Some>
  (x: Maybe<A>): A | undefined =>
    isJust (x) ? x .value : undefined

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
  <A extends Some, B extends Some>
  (def: () => B) =>
    maybe<A, B> (def ())

export const INTERNAL_shallowEquals =
  <A extends Some>
  (x: Maybe<A>) =>
  (y: Maybe<A>) =>
    isNothing (x) && isNothing (y)
    || isJust (x) && isJust (y) && x .value === y .value


// NAMESPACED FUNCTIONS

export const Maybe = {
  Just,
  Nothing,
  fromNullable,

  isJust,
  isNothing,
  fromJust,
  fromMaybe,

  fmap,
  mapReplace,

  pure,
  ap,

  alt,
  altF,
  empty,
  guard,

  bind,
  then,
  kleisli,
  join,
  liftM2,
  liftM3,
  liftM4,
  liftM5,

  foldr,
  foldl,
  toList,
  fnull,
  length,
  elem,
  elemF,
  sum,
  product,
  concat,
  concatMap,
  and,
  or,
  any,
  all,
  notElem,
  find,

  gt,
  lt,
  gte,
  lte,

  maybe,
  maybe_,
  listToMaybe,
  maybeToList,
  catMaybes,
  mapMaybe,

  isMaybe,
  normalize,
  ensure,
  imapMaybe,
  maybeToNullable,
  maybeToUndefined,
}


// TYPE HELPERS

export type MaybeContent<A> = A extends Maybe<infer AI> ? AI : never

// tslint:disable-next-line:interface-over-type-literal
export type Some = {}
export type Nullable = null | undefined

/**
 * @module Data.List
 *
 * A list (`[a]`) is a simple flat data structure for values of the same type.
 *
 * @author Lukas Obermann
 */

import { pipe, pipe_ } from "../App/Utilities/pipe"
import { not } from "./Bool"
import { equals } from "./Eq"
import { ident, thrush } from "./Function"
import { fmap, fmapF } from "./Functor"
import { Internals } from "./Internals"
import { add, inc, max, min, multiply } from "./Num"
import { Compare, GT, isLTorEQ, LT, Ordering } from "./Ord"
import { fromDefault, RecordBase } from "./Record"
import { show } from "./Show"
import { first, fst, Pair, second, snd } from "./Tuple"

export import NonEmptyList = Internals.NonEmptyList
export import Cons = Internals.Cons
import Nil = Internals.Nil
import isNil = Internals.isNil
import Maybe = Internals.Maybe
import Just = Internals.Just
import Nothing = Internals.Nothing
import isJust = Internals.isJust
import OrderedMap = Internals.OrderedMap
import _OrderedMap = Internals._OrderedMap

const fromJust =
  <A> (x: Just<A>): A => {
    if (isJust (x)) {
      return x.value
    }

    throw new TypeError (`Cannot extract a value out of type Nothing.`)
  }

const maybe =
  <B> (def: B) =>
  <A> (f: (x: A) => B) =>
  (x: Maybe<A>) =>
    isJust (x) ? f (x .value) : def

const imapMaybe =
  <A, B>
  (f: (index: number) => (x: A) => Maybe<B>) =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    ifoldr<A, List<B>>
      (index => x => acc =>
        pipe_ (
          x,
          f (index),
          maybe<List<B>> (acc)
                         // eslint-disable-next-line @typescript-eslint/no-use-before-define
                         (cons (acc))
        ))
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      (List.empty)

const mapMaybe =
  <A, B>
  (f: (x: A) => Maybe<B>) =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    List.foldr<A, List<B>> (pipe (
                             f,
                             maybe<(xs: List<B>) => List<B>> (ident)
                                                             // eslint-disable-next-line @typescript-eslint/no-use-before-define
                                                             (consF)
                           ))
                           // eslint-disable-next-line @typescript-eslint/no-use-before-define
                           (List.empty)

const fromMap =
  <K, A> (xs: ReadonlyMap<K, A>): OrderedMap<K, A> => {
    if (xs instanceof Map) {
      return _OrderedMap (xs)
    }

    throw new TypeError (
      `fromArray requires a native Map but instead it received ${show (xs)}`
    )
  }

// const Maybe =
//   <A> (x: A | Nullable): Maybe<A> =>
//     x !== null && x !== undefined ? Just (x) : Nothing

const lookupF =
  <K, A>
  (m: OrderedMap<K, A>) =>
  (key: K): Maybe<A> =>
    Maybe (m .value .get (key))

// CONSTRUCTOR

export type List<A> = Nil | Cons<A>

/**
 * `List :: (...a) -> [a]`
 *
 * Creates a new `List` instance from the passed arguments.
 */
export const List =
  <A> (...values: A[]): List<A> => {
    if (values .length === 0) {
      return Nil
    }

    let h: List<A> = Nil

    for (let i = 0; i < values.length; i++) {
      const x = values[values.length - 1 - i]

      h = Cons (x, h)
    }

    return h

    // const [_head, ..._tail] = values

    // return Cons (_head, List (..._tail))
  }


// APPLICATIVE

/**
 * `pure :: a -> [a]`
 *
 * Lift a value.
 */
export const pure = <A> (x: A) => Cons (x, Nil)

List.pure = pure

const mapAp =
  <A, B>
  (f: (x: A) => B) =>
  (xs: List<B>) =>
  (x: List<A>): List<B> =>
    isNil (x)
    ? xs
    : Cons (f (x .x), mapAp (f) (xs) (x .xs))

/**
 * `(<*>) :: [a -> b] -> [a] -> [b]`
 *
 * Sequential application.
 */
export const ap =
  <A, B> (fs: List<(x: A) => B>) => (xs: List<A>): List<B> =>
    isNil (fs) || isNil (xs)
    ? Nil
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    : mapAp<A, B> (head (fs)) (ap (fs .xs) (xs)) (xs)

List.ap = ap


// ALTERNATIVE

/**
 * `alt :: [a] -> [a] -> [a]`
 *
 * The `alt` function takes a list of the same type. If the first list
 * is empty, it returns the second list, otherwise it returns the
 * first.
 */
export const alt =
  <A> (xs1: List<A>) => (xs2: List<A>): List<A> =>
    isNil (xs1) ? xs2 : xs1

List.alt = alt

/**
 * `altF :: [a] -> [a] -> [a]`
 *
 * The `altF` function takes a `Maybe` of the same type. If the second `Maybe`
 * is `Nothing`, it returns the first `Maybe`, otherwise it returns the
 * second.
 *
 * Flipped version of `alt`.
 */
export const altF =
  <A> (xs1: List<A>) => (xs2: List<A>): List<A> =>
    alt (xs2) (xs1)

List.altF = altF

/**
 * `empty :: [a]`
 *
 * The empty list.
 */
export const empty = Nil

List.empty = empty

/**
 * `guard :: Bool -> [()]`
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
  (pred: boolean): List<true> =>
    pred ? pure<true> (true) : empty

List.guard = guard


// MONAD

/**
 * `(>>=) :: [a] -> (a -> [b]) -> [b]`
 */
export const bind =
  <A, B> (xs: List<A>) => (f: (x: A) => List<B>): List<B> =>
    isNil (xs)
    ? Nil
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    : append (f (xs .x)) (bind<A, B> (xs .xs) (f))

List.bind = bind

/**
 * `(=<<) :: (a -> [b]) -> [a] -> [b]`
 */
export const bindF =
  <A, B> (f: (x: A) => List<B>) => (xs: List<A>): List<B> =>
    bind<A, B> (xs) (f)

List.bindF = bindF

/**
 * `(>>) :: [a] -> [b] -> [b]`
 *
 * Sequentially compose two actions, discarding any value produced by the
 * first, like sequencing operators (such as the semicolon) in imperative
 * languages.
 *
 * ```a >> b = a >>= \ _ -> b```
 */
export const then =
  <A> (xs1: List<any>) => (xs2: List<A>): List<A> =>
    bind<any, A> (xs1) (_ => xs2)

List.then = then

/**
 * `(>=>) :: (a -> [b]) -> (b -> [c]) -> a -> [c]`
 *
 * Left-to-right Kleisli composition of monads.
 */
export const kleisli =
  <A, B, C> (f1: (x: A) => List<B>) => (f2: (x: B) => List<C>) =>
    pipe (f1, bindF (f2))

List.kleisli = kleisli

/**
 * `join :: [[a]] -> [a]`
 *
 * The `join` function is the conventional monad join operator. It is used to
 * remove one level of monadic structure, projecting its bound argument into the
 * outer level.
 */
export const join =
  <A> (xss: List<List<A>>): List<A> =>
    bind<List<A>, A> (xss) (ident)

List.join = join


// FOLDABLE

/**
 * `foldr :: (a -> b -> b) -> b -> [a] -> b`
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
  <A, B> (f: (x: A) => (acc: B) => B) => (initial: B) => (xs: List<A>): B =>
    isNil (xs) ? initial : f (xs .x) (foldr (f) (initial) (xs .xs))

List.foldr = foldr

/**
 * `foldl :: (b -> a -> b) -> b -> [a] -> b`
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
  <A, B> (f: (acc: B) => (x: A) => B) => (initial: B) => (xs: List<A>): B =>
    isNil (xs) ? initial : foldl (f) (f (initial) (xs .x)) (xs .xs)

List.foldl = foldl

const foldr1Safe =
  <A> (f: (x: A) => (acc: A) => A) => (xs: Cons<A>): A =>
    isNil (xs .xs)
    ? xs .x
    : f (xs .x) (foldr1Safe (f) (xs .xs))

/**
 * `foldr1 :: (a -> a -> a) -> [a] -> a`
 *
 * A variant of `foldr` that has no base case, and thus may only be applied to
 * non-empty structures.
 *
 * `foldr1 f = foldr1 f . toList`
 */
export const foldr1 =
  <A> (f: (x: A) => (acc: A) => A) => (xs: List<A>): A => {
    if (!isNil (xs)) {
      return foldr1Safe (f) (xs)
    }

    throw new TypeError ("Cannot apply foldr1 to an empty list.")
  }

List.foldr1 = foldr1

const foldl1Safe =
  <A>
  (f: (acc: A) => (x: A) => A) =>
  (xs: List<A>) =>
  (acc: A): A =>
    isNil (xs) ? acc : foldl1Safe (f) (xs .xs) (f (acc) (xs .x))

/**
 * `foldl1 :: (a -> a -> a) -> [a] -> a`
 *
 * A variant of `foldl` that has no base case, and thus may only be applied to
 * non-empty structures.
 *
 * `foldl1 f = foldl1 f . toList`
 */
export const foldl1 =
  <A> (f: (acc: A) => (x: A) => A) => (xs: List<A>): A => {
    if (!isNil (xs)) {
      return foldl1Safe (f) (xs .xs) (xs .x)
    }

    throw new TypeError ("Cannot apply foldl1 to an empty list.")
  }

List.foldl1 = foldl1

/**
 * `toList :: [a] -> [a]`
 *
 * List of elements of a structure, from left to right.
 */
export const toList = <A> (xs: List<A>): List<A> => xs

List.toList = toList

/**
 * `null :: [a] -> Bool`
 *
 * Test whether the structure is empty. The default implementation is optimized
 * for structures that are similar to cons-lists, because there is no general
 * way to do better.
 */
export const fnull = isNil

List.fnull = fnull

/**
 * `null :: [a] -> Bool`
 *
 * Test whether the structure is empty. The default implementation is optimized
 * for structures that are similar to cons-lists, because there is no general
 * way to do better.
 */
export const fnullStr = (xs: string): boolean => xs .length === 0

List.fnullStr = fnullStr

/**
 * `length :: [a] -> Int`
 *
 * Returns the size/length of a finite structure as an `Int`. The default
 * implementation is optimized for structures that are similar to cons-lists,
 * because there is no general way to do better.
 */
export const flength =
  (xs: List<any>): number =>
    foldr<any, number> (() => inc) (0) (xs)

List.flength = flength

/**
 * `length :: [a] -> Int`
 *
 * Returns the size/length of a finite structure as an `Int`. The default
 * implementation is optimized for structures that are similar to cons-lists,
 * because there is no general way to do better.
 */
export const flengthStr =
  (xs: string): number =>
    xs .length

List.flengthStr = flengthStr

/**
 * `elem :: Eq a => a -> [a] -> Bool`
 *
 * Does the element occur in the structure?
 */
export const elem =
  <A> (x: A) => (xs: List<A>): boolean =>
    isNil (xs) ? false : equals (x) (xs .x) || elem (x) (xs .xs)

export type elem<A> = (x: A) => (xs: List<A>) => boolean

List.elem = elem

/**
 * `elemF :: Eq a => [a] -> a -> Bool`
 *
 * Does the element occur in the structure?
 *
 * Flipped version of `elem`.
 */
export const elemF = <A> (xs: List<A>) => (x: A): boolean => elem (x) (xs)

List.elemF = elemF

/**
 * `sum :: Num a => [a] -> a`
 *
 * The `sum` function computes the sum of the numbers of a structure.
 */
export const sum = foldr (add) (0)

List.sum = sum

/**
 * `product :: Num a => [a] -> a`
 *
 * The `product` function computes the product of the numbers of a structure.
 */
export const product = foldr (multiply) (1)

List.product = product

/**
 * `maximum :: Ord a => [a] -> a`
 *
 * The largest element of a non-empty structure.
 */
export const maximum = foldr (max) (-Infinity)

List.maximum = maximum

/**
 * `minimum :: Ord a => [a] -> a`
 *
 * The least element of a non-empty structure.
 */
export const minimum = foldr (min) (Infinity)

List.minimum = minimum

// Specialized folds

/**
 * `concat :: [[a]] -> [a]`
 *
 * The concatenation of all the elements of a container of lists.
 */
export const concat = join

List.concat = concat

/**
 * `concatMap :: (a -> [b]) -> [a] -> [b]`
 *
 * Map a function over all the elements of a container and concatenate the
 * resulting lists.
 */
export const concatMap = bindF

List.concatMap = concatMap

/**
 * `and :: [Bool] -> Bool`
 *
 * `and` returns the conjunction of a container of Bools. For the result to be
 * `True`, the container must be finite. `False`, however, results from a
 * `False` value finitely far from the left end.
 */
export const and =
  (xs: List<boolean>): boolean =>
    isNil (xs) ? true : xs .x && and (xs .xs)

List.and = and

/**
 * `or :: [Bool] -> Bool`
 *
 * `or` returns the disjunction of a container of Bools. For the result to be
 * `False`, the container must be finite. `True`, however, results from a
 * `True` value finitely far from the left end.
 */
export const or =
  (xs: List<boolean>): boolean =>
    isNil (xs) ? false : xs .x || or (xs .xs)

List.or = or

/**
 * `any :: (a -> Bool) -> [a] -> Bool`
 *
 * Determines whether any element of the structure satisfies the predicate.
 */
export const any =
  <A> (f: (x: A) => boolean) => (xs: List<A>): boolean =>
    isNil (xs) ? false : f (xs .x) || any (f) (xs .xs)

List.any = any

/**
 * `all :: (a -> Bool) -> [a] -> Bool`
 *
 * Determines whether all elements of the structure satisfy the predicate.
 */
export const all =
  <A> (f: (x: A) => boolean) => (xs: List<A>): boolean =>
    isNil (xs) ? true : f (xs .x) && all (f) (xs .xs)

List.all = all

// Searches

/**
 * `notElem :: Eq a => a -> [a] -> Bool`
 *
 * `notElem` is the negation of `elem`.
 */
export const notElem = <A> (x: A) => pipe (elem (x), not)

List.notElem = notElem

/**
 * `notElemF :: Eq a => a -> [a] -> Bool`
 *
 * `notElemF` is the negation of `elem_`.
 *
 * `notElemF` is the same as `notElem` but with arguments flipped.
 */
export const notElemF = <A> (xs: List<A>) => (x: A) => notElem (x) (xs)

List.notElemF = notElemF

interface Find {

  /**
   * `find :: (a -> Bool) -> [a] -> Maybe a`
   *
   * The `find` function takes a predicate and a structure and returns the
   * leftmost element of the structure matching the predicate, or `Nothing` if
   * there is no such element.
   */
  <A, A1 extends A> (pred: (x: A) => x is A1): (xs: List<A>) => Maybe<A1>

  /**
   * `find :: (a -> Bool) -> [a] -> Maybe a`
   *
   * The `find` function takes a predicate and a structure and returns the
   * leftmost element of the structure matching the predicate, or `Nothing` if
   * there is no such element.
   */
  <A> (pred: (x: A) => boolean): (xs: List<A>) => Maybe<A>
}

/**
 * `find :: (a -> Bool) -> [a] -> Maybe a`
 *
 * The `find` function takes a predicate and a structure and returns the
 * leftmost element of the structure matching the predicate, or `Nothing` if
 * there is no such element.
 */
export const find: Find =
  <A> (pred: (x: A) => boolean) => (xs: List<A>): Maybe<A> =>
    isNil (xs) ? Nothing : pred (xs .x) ? Just (xs .x) : find (pred) (xs .xs)

List.find = find


// BASIC FUNCTIONS

const appendSafe =
  <A> (xs1: List<A>) => (xs2: Cons<A>): Cons<A> =>
    isNil (xs1) ? xs2 : Cons (xs1 .x, appendSafe (xs1 .xs) (xs2))

/**
 * `(++) :: [a] -> [a] -> [a]`
 *
 * Append two lists.
 *
 * ```haskell
 * [1, 2, 3] ++ [4, 5, 6] == [1, 2, 3, 4, 5, 6]
 * (++) [1, 2, 3] [4, 5, 6] == [1, 2, 3, 4, 5, 6]
 * ```
 */
export const append =
  <A> (xs1: List<A>) => (xs2: List<A>): List<A> =>
    isNil (xs2) ? xs1 : isNil (xs1) ? xs2 : appendSafe (xs1) (xs2)

export type append<A> = (xs1: List<A>) => (xs2: List<A>) => List<A>

List.append = append

/**
 * `(++) :: String -> String -> String`
 *
 * Append two lists.
 *
 * ```haskell
 * "abc" ++ "def" == "abcdef"
 * (++) "abc" "def" == "abcdef"
 * ```
 */
export const appendStr =
  (xs1: string) => (xs2: string): string =>
    xs1 + xs2

List.appendStr = appendStr

/**
 * `(:) :: [a] -> a -> [a]`
 *
 * Prepends an element to the list.
 */
export const cons = <A> (xs: List<A>) => (x: A): List<A> => Cons (x, xs)

List.cons = cons

/**
 * `head :: [a] -> a`
 *
 * Extract the first element of a list, which must be non-empty.
 */
export const head = <A> (xs: Cons<A>): A => {
  if (isNil (xs)) {
    throw new TypeError (
      `head does only work on non-empty lists. If you do not know whether the`
      + `list is empty or not, use listToMaybe instead.`
    )
  }

  return xs .x
}

List.head = head

/**
 * `last :: [a] -> a`
 *
 * Extract the last element of a list, which must be finite and non-empty.
 */
export const last = <A> (xs: Cons<A>): A => {
  if (isNil (xs)) {
    throw new TypeError (`last does only work on non-empty lists.`)
  }

  return isNil (xs .xs) ? xs .x : last (xs .xs)
}

List.last = last

/**
 * `lastS :: [a] -> Maybe a`
 *
 * Extract the last element of a list, which must be finite. If the list is
 * empty, it returns `Nothing`. If the list is not empty, it returns the last
 * element wrapped in a `Just`.
 *
 * A safe version of `last`.
 */
export const lastS =
  <A> (xs: List<A>): Maybe<A> =>
    fnull (xs) ? Nothing : Just (last (xs))

List.lastS = lastS

/**
 * `tail :: [a] -> [a]`
 *
 * Extract the elements after the head of a list, which must be non-empty.
 */
export const tail = <A> (xs: Cons<A>): List<A> => {
  if (isNil (xs)) {
    throw new TypeError (`tail does only work on non-empty lists.`)
  }

  return xs .xs
}

List.tail = tail

/**
 * `tailS :: [a] -> Maybe [a]`
 *
 * Extract the elements after the head of a list. If the list is
 * empty, it returns `Nothing`. If the list is not empty, it returns the
 * elements wrapped in a `Just`.
 *
 * A safe version of `tail`.
 */
export const tailS =
  <A> (xs: List<A>): Maybe<List<A>> =>
    fnull (xs) ? Nothing : Just (tail (xs))

List.tailS = tailS

/**
 * `init :: [a] -> [a]`
 *
 * Return all the elements of a list except the last one. The list must be
 * non-empty.
 */
export const init = <A> (xs: Cons<A>): List<A> => {
  if (isNil (xs)) {
    throw new TypeError (`init does only work on non-empty lists.`)
  }

  return isNil (xs .xs) ? Nil : Cons (xs .x, init (xs .xs))
}

List.init = init

/**
 * `initS :: [a] -> Maybe [a]`
 *
 * Return all the elements of a list except the last one. If the list is
 * empty, it returns `Nothing`. If the list is not empty, it returns the
 * elements wrapped in a `Just`.
 *
 * A safe version of `init`.
 */
export const initS =
  <A> (xs: List<A>): Maybe<List<A>> =>
    fnull (xs) ? Nothing : Just (init (xs))

List.initS = initS

/**
 * `uncons :: [a] -> Maybe (a, [a])`
 *
 * Decompose a list into its head and tail. If the list is empty, returns
 * `Nothing`. If the list is non-empty, returns `Just (x, xs)`, where `x` is
 * the head of the list and `xs` its tail.
 */
export const uncons =
  <A> (xs: List<A>): Maybe<Pair<A, List<A>>> =>
    fnull (xs) ? Nothing : Just (Pair (xs .x, tail (xs)))

export type unconsSafe = <A> (xs: NonEmptyList<A>) => Just<Pair<A, List<A>>>

List.uncons = uncons


// LIST TRANSFORMATIONS

/**
 * `map :: (a -> b) -> [a] -> [b]`
 *
 * `map f xs` is the list obtained by applying `f` to each element of `xs`.
 */
export const map =
  <A, B> (f: (x: A) => B) => (xs: List<A>): List<B> =>
    isNil (xs) ? Nil : Cons (f (xs .x), map (f) (xs .xs))

List.map = map

/**
 * `reverse :: [a] -> [a]`
 *
 * `reverse xs` returns the elements of `xs` in reverse order. `xs` must be
 * finite.
 */
export const reverse =
  <A> (xs: List<A>): List<A> =>
    foldl<A, List<A>> (cons) (empty) (xs)

List.reverse = reverse

const intersperseIterator =
  <A> (x: A) => (xs: List<A>): List<A> =>
    isNil (xs)
    ? Nil
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    : pipe_ (intersperseIterator (x) (xs .xs), consF (xs .x), consF (x))

/**
 * `intersperse :: a -> [a] -> [a]`
 *
 * The intersperse function takes an element and a list and 'intersperses' that
 * element between the elements of the list. For example,
 *
 * ```haskell
 * intersperse ',' "abcde" == "a,b,c,d,e"
 * ```
 */
export const intersperse =
  <A> (x: A) => (xs: List<A>): List<A> =>
    isNil (xs)
    ? Nil
    : isNil (xs .xs)
    ? xs
    : cons (intersperseIterator (x) (xs .xs)) (xs .x)

List.intersperse = intersperse


/**
 * `intercalate :: [a] -> [[a]] -> [a]`
 *
 * `intercalate xs xss` is equivalent to `(concat (intersperse xs xss))`. It
 * inserts the list `xs` in between the lists in `xss` and concatenates the
 * result.
 */
export const intercalate =
  (separator: string) => (xs: List<number | string>): string =>
    isNil (xs)
    ? ""
    : isNil (xs .xs)
    ? xs .x .toString ()
    : xs .x .toString () + separator + intercalate (separator) (xs .xs)

List.intercalate = intercalate


const pick = <A> (xs: List<A>): List<Pair<A, List<A>>> =>
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  imap (i => (x: A) => Pair (x, deleteAt (i) (xs)))
       (xs)

/**
 * ```haskell
 * permutations :: [a] -> [[a]]
 * ```
 *
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
export const permutations: <A> (xs: List<A>) => List<List<A>> =
  <A> (xs: List<A>) => isNil (xs)
                       ? List ()
                       : isNil (xs .xs)
                       ? List (xs)
                       : pipe_ (
                           xs,
                           pick,
                           // eslint-disable-next-line @typescript-eslint/no-use-before-define
                           concatMap (p => map (consF (fst (p)))
                                               (permutations (snd (p))))
                         )

List.permutations = permutations


// BUILDING LISTS


// SCANS

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
export const scanl =
  <A, B>
  (f: (acc: B) => (x: A) => B) =>
  (initial: B) =>
  (xs: List<A>): List<B> =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    Cons (initial, scanlIterator (f) (initial) (xs))

const scanlIterator =
  <A, B>
  (f: (acc: B) => (x: A) => B) =>
  (acc: B) =>
  (xs: List<A>): List<B> => {
    if (!isNil (xs)) {
      const x = f (acc) (xs .x)

      return Cons (x, scanlIterator (f) (x) (xs .xs))
    }

    return Nil
  }

List.scanl = scanl


// ACCUMULATING MAPS

/**
 * `mapAccumL :: (a -> b -> (a, c)) -> a -> [b] -> (a, [c])`
 *
 * The `mapAccumL` function behaves like a combination of `fmap` and `foldl`;
 * it applies a function to each element of a structure, passing an
 * accumulating parameter from left to right, and returning a final value of
 * this accumulator together with the new structure.
 */
export const mapAccumL =
  <A, B, C>
  (f: (acc: A) => (x: B) => Pair<A, C>) =>
  (initial: A) =>
  (xs: List<B>): Pair<A, List<C>> => {
    if (!isNil (xs)) {
      const p = f (initial) (xs .x)

      const res = mapAccumL<A, B, C> (f) (fst (p)) (xs .xs)

      return Pair (fst (res), Cons (snd (p), snd (res)))
    }

    return Pair (initial, Nil)
  }

List.mapAccumL = mapAccumL

/**
 * `mapAccumR :: (a -> b -> (a, c)) -> a -> [b] -> (a, [c])`
 *
 * The `mapAccumR` function behaves like a combination of `fmap` and `foldr`;
 * it applies a function to each element of a structure, passing an
 * accumulating parameter from right to left, and returning a final value of
 * this accumulator together with the new structure.
 */
export const mapAccumR =
  <A, B, C>
  (f: (acc: A) => (x: B) => Pair<A, C>) =>
  (initial: A) =>
  (xs: List<B>): Pair<A, List<C>> => {
    if (!isNil (xs)) {
      const res = mapAccumR<A, B, C> (f) (initial) (xs .xs)
      const new_xs = snd (res)
      const p = f (fst (res)) (xs .x)
      const acc = fst (p)
      const new_x = snd (p)

      return Pair (acc, Cons (new_x, new_xs))
    }

    return Pair (initial, Nil)
  }

List.mapAccumR = mapAccumR


// INFINITE LISTS

/**
 * `replicate :: Int -> a -> [a]`
 *
 * `replicate n x` is a list of length `n` with `x` the value of every element.
 * It is an instance of the more general `genericReplicate`, in which `n` may be
 * of any integral type.
 */
export const replicate =
  (len: number) => <A> (x: A): List<A> => len > 0 ? Cons (x, replicate (len - 1) (x)) : Nil

List.replicate = replicate

/**
 * `replicateR :: Int -> (Int -> a) -> [a]`
 *
 * `replicate n f` is a list of length `n` with the result of `f` the value of
 * every element. Its used for lists of React elements to get a accumulating
 * key, as the `Int` passed to `f` is the index of the element
 */
export const replicateR =
  (len: number) =>
  <A>
  (f: (index: number) => A): List<A> =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    unfoldr ((index: number) => index < len ? Just (Pair (f (index), index + 1)) : Nothing)
            (0)

List.replicateR = replicateR


// UNFOLDING

/**
 * `unfoldr :: (b -> Maybe (a, b)) -> b -> [a]`
 *
 * The `unfoldr` function is a 'dual' to `foldr`: while `foldr` reduces a list
 * to a summary value, `unfoldr` builds a list from a seed value. The function
 * takes the element and returns `Nothing` if it is done producing the list or
 * returns `Just (a,b)`, in which case, `a` is a prepended to the list and `b`
 * is used as the next element in a recursive call. For example,
```hs
iterate f == unfoldr (\x -> Just (x, f x))
```
  *
  * In some cases, unfoldr can undo a foldr operation:
  *
```hs
unfoldr f' (foldr f z xs) == xs
```
  *
  * if the following holds:
  *
```hs
f' (f x y) = Just (x,y)
f' z       = Nothing
```
  *
  * A simple use of unfoldr:
  *
```hs
>>> unfoldr (\b -> if b == 0 then Nothing else Just (b, b-1)) 10
[10,9,8,7,6,5,4,3,2,1]
```
  */
export const unfoldr =
  <A, B> (f: (x: B) => Maybe<Pair<A, B>>) => (seedValue: B): List<A> => {
    const result = f (seedValue)

    if (isJust (result)) {
      const newValue = fromJust (result)

      return Cons (fst (newValue), unfoldr (f) (snd (newValue)))
    }

    return Nil
  }

List.unfoldr = unfoldr


// EXTRACTING SUBLISTS

/**
 * `take :: Int -> [a] -> [a]`
 *
 * `take n`, applied to a list `xs`, returns the prefix of `xs` of length `n`,
 * or `xs` itself if `n > length xs`.
 */
export const take =
  (n: number) => <A> (xs: List<A>): List<A> =>
    n <= 0 || isNil (xs) ? Nil : Cons (xs .x, take (n - 1) (xs .xs))

List.take = take

/**
 * `drop :: Int -> [a] -> [a]`
 *
 * `drop n xs` returns the suffix of `xs` after the first `n` elements, or
 * `[]` if `n > length x`.
 */
export const drop =
  (n: number) => <A> (xs: List<A>): List<A> =>
    n <= 0 ? xs : isNil (xs) ? Nil : drop (n - 1) (xs .xs)

List.drop = drop

/**
 * `splitAt :: Int -> [a] -> ([a], [a])`
 *
 * `splitAt n xs` returns a tuple where first element is `xs` prefix of length
 * `n` and second element is the remainder of the list.
 */
export const splitAt =
  (n: number) => <A> (xs: List<A>): Pair<List<A>, List<A>> => {
    if (n <= 0) {
      return Pair (Nil, xs)
    }

    if (isNil (xs)) {
      return Pair (Nil, Nil)
    }

    const y = xs .x

    const p = splitAt (n - 1) (xs .xs)

    return Pair (Cons (y, fst (p)), snd (p))
  }

List.splitAt = splitAt


// PREDICATES

/**
 * `isInfixOf :: Eq a => [a] -> [a] -> Bool`
 *
 * The `isInfixOf` function takes two lists and returns `True` if the first
 * list is contained, wholly and intact, anywhere within the second.
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
export const isInfixOf =
  (x: string) => (y: string): boolean =>
    y .includes (x)

List.isInfixOf = isInfixOf


// SEARCHING BY EQUALITY

/**
 * `lookup :: Eq a => a -> [(a, b)] -> Maybe b`
 *
 * `lookup key assocs` looks up a key in an association list.
 */
export const lookup = <K, V> (key: K) => (assocs: List<Pair<K, V>>): Maybe<V> =>
  fmapF (find<Pair<K, V>> (pipe (fst, equals (key)))
                          (assocs))
        (snd)

List.lookup = lookup


// SEARCHING WITH A PREDICATE

interface Filter {

  /**
   * `filter :: (a -> Bool) -> [a] -> [a]`
   *
   * `filter`, applied to a predicate and a list, returns the list of those
   * elements that satisfy the predicate.
   */
  <A, A1 extends A> (pred: (x: A) => x is A1): (xs: List<A>) => List<A1>

  /**
   * `filter :: (a -> Bool) -> [a] -> [a]`
   *
   * `filter`, applied to a predicate and a list, returns the list of those
   * elements that satisfy the predicate.
   */
  <A> (pred: (x: A) => boolean): (xs: List<A>) => List<A>
}

/**
 * `filter :: (a -> Bool) -> [a] -> [a]`
 *
 * `filter`, applied to a predicate and a list, returns the list of those
 * elements that satisfy the predicate.
 */
export const filter: Filter =
  <A> (pred: (x: A) => boolean) => (xs: List<A>): List<A> =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    foldr<A, List<A>> (x => pred (x) ? consF (x) : ident)
                      (Nil)
                      (xs)

List.filter = filter

/**
 * `partition :: (a -> Bool) -> [a] -> ([a], [a])`
 *
 * The `partition` function takes a predicate a list and returns the pair of
 * lists of elements which do and do not satisfy the predicate, respectively.
 *
 * ```haskell
 * >>> partition (`elem` "aeiou") "Hello World!"
 * ("eoo","Hll Wrld!")
 * ```
  */
export const partition =
  <A>
  (pred: (value: A) => boolean) =>
    foldr<A, Pair<List<A>, List<A>>>
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      (x => pred (x) ? first (consF (x)) : second (consF (x)))
      (Pair (Nil, Nil))

List.partition = partition


// INDEXING LISTS

/**
 * `(!!) :: [a] -> Int -> Maybe a`
 *
 * List index (subscript) operator, starting from 0. If the index is invalid,
 * returns `Nothing`, otherwise `Just a`.
 */
export const subscript =
  <A> (xs: List<A>) => (index: number): Maybe<A> =>
    isNil (xs) || index < 0
    ? Nothing
    : index > 0
    ? subscript (xs .xs) (index - 1)
    : Just (xs .x)

List.subscript = subscript

/**
 * `(!!) :: Int -> [a] -> Maybe a`
 *
 * List index (subscript) operator, starting from 0. If the index is invalid,
 * returns `Nothing`, otherwise `Just a`.
 *
 * Flipped version of `subscript`.
 */
export const subscriptF =
  (index: number) => <A> (xs: List<A>): Maybe<A> =>
    subscript (xs) (index)

List.subscriptF = subscriptF

/**
 * `elemIndex :: Eq a => a -> [a] -> Maybe Int`
 *
 * The `elemIndex` function returns the index of the first element in the
 * given list which is equal (by `==`) to the query element, or `Nothing` if
 * there is no such element.
 */
export const elemIndex =
  <A> (x: A) => (xs: List<A>): Maybe<number> =>
    isNil (xs)
    ? Nothing
    : equals (x) (xs .x)
    ? Just (0)
    : fmap (inc) (elemIndex (x) (xs .xs))

List.elemIndex = elemIndex

const elemIndicesIndex =
  <A> (x: A) => (index: number) => (xs: List<A>): List<number> =>
    isNil (xs)
    ? Nil
    : equals (x) (xs .x)
    ? Cons (index, elemIndicesIndex (x) (index + 1) (xs .xs))
    : elemIndicesIndex (x) (index + 1) (xs .xs)

/**
 * `elemIndices :: Eq a => a -> [a] -> [Int]`
 *
 * The `elemIndices` function extends `elemIndex`, by returning the indices of
 * all elements equal to the query element, in ascending order.
 */
export const elemIndices =
  <A> (x: A) => (xs: List<A>): List<number> =>
    elemIndicesIndex (x) (0) (xs)

List.elemIndices = elemIndices

/**
 * `findIndex :: (a -> Bool) -> [a] -> Maybe Int`
 *
 * The `findIndex` function takes a predicate and a list and returns the index
 * of the first element in the list satisfying the predicate, or `Nothing` if
 * there is no such element.
 */
export const findIndex =
  <A> (pred: (x: A) => boolean) => (xs: List<A>): Maybe<number> =>
    isNil (xs)
    ? Nothing
    : pred (xs .x)
    ? Just (0)
    : fmap (inc) (findIndex (pred) (xs .xs))

List.findIndex = findIndex

const findIndicesIndex =
  <A>
  (pred: (x: A) => boolean) =>
  (index: number) =>
  (xs: List<A>): List<number> =>
    isNil (xs)
    ? Nil
    : pred (xs .x)
    ? Cons (index, findIndicesIndex (pred) (index + 1) (xs .xs))
    : findIndicesIndex (pred) (index + 1) (xs .xs)

/**
 * `findIndices :: (a -> Bool) -> [a] -> [Int]`
 *
 * The `findIndices` function extends `findIndex`, by returning the indices of
 * all elements satisfying the predicate, in ascending order.
 */
export const findIndices =
  <A> (pred: (x: A) => boolean) => (xs: List<A>): List<number> =>
    findIndicesIndex (pred) (0) (xs)

List.findIndices = findIndices


// ZIPPING AND UNZIPPING LISTS

/**
 * `zip :: [a] -> [b] -> [(a, b)]`
 *
 * `zip` takes two lists and returns a list of corresponding pairs. If one
 * input list is short, excess elements of the longer list are discarded.
 */
export const zip =
  <A> (xs1: List<A>) => <B> (xs2: List<B>): List<Pair<A, B>> =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    zipWith<A, B, Pair<A, B>> (Pair) (xs1) (xs2)

List.zip = zip

/**
 * `zipWith :: (a -> b -> c) -> [a] -> [b] -> [c]`
 *
 * `zipWith` generalises `zip` by zipping with the function given as the first
 * argument, instead of a tupling function. For example, `zipWith (+)` is
 * applied to two lists to produce the list of corresponding sums.
 */
export const zipWith =
  <A, B, C>
  (f: (x1: A) => (x2: B) => C) =>
  (xs1: List<A>) =>
  (xs2: List<B>): List<C> =>
    imapMaybe<A, C> (index => e => fmap (f (e)) (subscript (xs2) (index)))
                    (xs1)

List.zipWith = zipWith


// SPECIAL LISTS

// Functions on strings

const lfEndRx = /\n$/u
const lfRx = /\n/u

/**
 * `lines :: String -> [String]`
 *
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
export const lines =
  (x: string): List<string> =>
    x .length === 0
    ? empty
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    : fromArray (x .replace (lfEndRx, "") .split (lfRx))

List.lines = lines


// "SET" OPERATIONS

/**
 * `nub :: Eq a => [a] -> [a]`
 *
 * The `nub` function removes duplicate elements from a list. In particular, it
 * keeps only the first occurrence of each element. (The name `nub` means
 * 'essence'.) It is a special case of `nubBy`, which allows the programmer to
 * supply their own equality test.
 */
export const nub =
  <A> (xs: List<A>) =>
    foldr<A, List<A>> (x => acc => notElem (x) (acc) ? cons (acc) (x) : acc)
                      (List ())
                      (xs)

List.nub = nub

/**
 * `delete :: Eq a => a -> [a] -> [a]`
 *
 * `delete x` removes the first occurrence of `x` from its list argument.
 */
export const sdelete =
  <A> (x: A) => (xs: List<A>): List<A> =>
    isNil (xs)
    ? Nil
    : equals (x) (xs .x)
    ? xs .xs
    : Cons (xs .x, sdelete (x) (xs .xs))

List.sdelete = sdelete

/**
 * `intersect :: Eq a => [a] -> [a] -> [a]`
 *
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
export const intersect =
  <A> (xs: List<A>) => (ys: List<A>): List<A> =>
    filter (elemF (ys)) (xs)

List.intersect = intersect


// ORDERED LISTS

const sortByGetMiddle = <A> (xs: List<A>): Pair<List<A>, List<A>> =>
  splitAt (flength (xs) / 2) (xs)

const sortBySortedMerge =
  <A>
  (f: (a: A) => (b: A) => Ordering) =>
  (a: List<A>, b: List<A>): List<A> => {
    // Base cases
    if (isNil (a)) {
      return b
    }

    if (isNil (b)) {
      return a
    }

    // Pick either a or b, and recur
    return isLTorEQ (f (head (a)) (head (b)))
      ? Cons (head (a), sortBySortedMerge (f) (a .xs, b))
      : Cons (head (b), sortBySortedMerge (f) (a, b .xs))
  }

const sortByNodeMergeSort =
  <A>
  (f: (a: A) => (b: A) => Ordering) =>
  (xs: List<A>): List<A> => {
    // Base case: if head is undefined
    if (isNil (xs) || isNil (xs .xs)) {
      return xs
    }

    // get the two halfs of the list
    const parts = sortByGetMiddle (xs)

    // Apply mergeSort on left list
    const left = sortByNodeMergeSort (f) (fst (parts))

    // Apply mergeSort on right list
    const right = sortByNodeMergeSort (f) (snd (parts))

    // Merge the left and right lists
    return sortBySortedMerge (f) (left, right)
  }

/**
 * `sortBy :: (a -> a -> Ordering) -> [a] -> [a]`
 *
 * The `sortBy` function is the non-overloaded version of `sort`.
 */
export const sortBy =
  <A> (f: (a: A) => (b: A) => Ordering) => (xs: List<A>): List<A> =>
    sortByNodeMergeSort (f) (xs)

List.sortBy = sortBy

/**
 * `maximumBy :: Foldable t => (a -> a -> Ordering) -> t a -> a`
 *
 * The largest element of a non-empty structure with respect to the given
 * comparison function.
 */
export const maximumBy = <A> (f: Compare<A>) => (xs: NonEmptyList<A>): A =>
  foldr1Safe <A> (x => acc => f (x) (acc) === GT ? x : acc)
                 (xs)

List.maximumBy = maximumBy

/**
 * `minimumBy :: Foldable t => (a -> a -> Ordering) -> t a -> a`
 *
 * The least element of a non-empty structure with respect to the given
 * comparison function.
 */
export const minimumBy = <A> (f: Compare<A>) => (xs: NonEmptyList<A>): A =>
  foldr1Safe <A> (x => acc => f (x) (acc) === LT ? x : acc)
                 (xs)

List.minimumBy = minimumBy

// LIST.INDEX

// Original functions

/**
 * `indexed :: [a] -> [(Int, a)]`
 *
 * `indexed` pairs each element with its index.
 *
 * ```haskell
 * >>> indexed "hello"
 * [(0,'h'),(1,'e'),(2,'l'),(3,'l'),(4,'o')]
 * ```
 */
export const indexed = <A> (xs: List<A>): List<Pair<number, A>> =>
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  imap<A, Pair<number, A>> (Pair) (xs)

List.indexed = indexed

/**
 * `deleteAt :: Int -> [a] -> [a]`
 *
 * `deleteAt` deletes the element at an index.
 *
 * If the index is negative or exceeds list length, the original list will be
 * returned.
 */
export const deleteAt =
  (index: number) => <A> (xs: List<A>): List<A> =>
    index < 0
    ? xs
    : isNil (xs)
    ? Nil
    : index === 0
    ? xs .xs
    : Cons (xs .x, deleteAt (index - 1) (xs .xs))

List.deleteAt = deleteAt

/**
 * `deleteAtPair :: Int -> [a] -> (Maybe a, [a])`
 *
 * `deleteAtPair` deletes the element at an index and returns a `Just` of the
 * deleted element together with the remaining list.
 *
 * If the index is negative or exceeds list length, the original list will be
 * returned, together with `Nothing` representing the deleted element.
 */
export const deleteAtPair =
  (index: number) => <A> (xs: List<A>): Pair<Maybe<A>, List<A>> =>
    index < 0
    ? Pair (Nothing, xs)
    : isNil (xs)
    ? Pair (Nothing, Nil)
    : index === 0
    ? Pair (Just (xs .x), xs .xs)
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    : second (consF (xs .x))
             (deleteAtPair (index - 1) (xs .xs))

List.deleteAtPair = deleteAtPair

/**
 * `setAt :: Int -> a -> [a] -> [a]`
 *
 * `setAt` sets the element at the index.
 *
 * If the index is negative or exceeds list length, the original list will be
 * returned.
 */
export const setAt =
  (index: number) => <A> (x: A) => (xs: List<A>): List<A> =>
    index < 0
    ? xs
    : isNil (xs)
    ? Nil
    : index === 0
    ? Cons (x, xs .xs)
    : Cons (xs .x, setAt (index - 1) (x) (xs .xs))

List.setAt = setAt

/**
 * `modifyAt :: Int -> (a -> a) -> [a] -> [a]`
 *
 * `modifyAt` applies a function to the element at the index.
 *
 * If the index is negative or exceeds list length, the original list will be
 * returned.
 */
export const modifyAt =
  (index: number) =>
  <A>
  (f: (old_value: A) => A) =>
  (xs: List<A>): List<A> =>
    index < 0
    ? xs
    : isNil (xs)
    ? Nil
    : index === 0
    ? Cons (f (xs .x), xs .xs)
    : Cons (xs .x, modifyAt (index - 1) (f) (xs .xs))

List.modifyAt = modifyAt

/**
 * `updateAt :: Int -> (a -> Maybe a) -> [a] -> [a]`
 *
 * `updateAt` applies a function to the element at the index, and then either
 * replaces the element or deletes it (if the function has returned
 * `Nothing`).
 *
 * If the index is negative or exceeds list length, the original list will be
 * returned.
 */
export const updateAt =
  (index: number) =>
  <A>
  (f: (old_value: A) => Maybe<A>) =>
  (xs: List<A>): List<A> =>
    index < 0
    ? xs
    : isNil (xs)
    ? Nil
    : index === 0
    ? maybe (xs .xs)
            ((x: A) => Cons (x, xs .xs))
            (f (xs .x))
    : Cons (xs .x, updateAt (index - 1) (f) (xs .xs))

List.updateAt = updateAt

/**
 * `insertAt :: Int -> a -> [a] -> [a]`
 *
 * `insertAt` inserts an element at the given position:
 *
 * `(insertAt i x xs) !! i == x`
 *
 * If the index is negative or exceeds list length, the original list will be
 * returned. (If the index is equal to the list length, the insertion can be
 * carried out.)
 */
export const insertAt =
  (index: number) => <A> (x: A) => (xs: List<A>): List<A> =>
    index < 0
    ? xs
    : index === 0
    ? Cons (x, xs)
    : isNil (xs)
    ? Nil
    : Cons (xs .x, insertAt (index - 1) (x) (xs .xs))

List.insertAt = insertAt

// Maps

/**
 * `imap :: (Int -> a -> b) -> [a] -> [b]`
 *
 * `imap f xs` is the list obtained by applying `f` to each element of `xs`.
 */
export const imap =
  <A, B> (f: (index: number) => (x: A) => B) => (xs: List<A>): List<B> =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    ifoldr (i => pipe (f (i), consF)) (Nil) (xs)

List.imap = imap

// Folds

const ifoldrSafe =
  <A, B>
  (f: (index: number) => (current: A) => (acc: B) => B) =>
  (index: number) =>
  (acc: B) =>
  (xs: List<A>): B =>
    isNil (xs)
    ? acc
    : f (index) (xs .x) (ifoldrSafe (f) (index + 1) (acc) (xs .xs))

/**
 * `ifoldr :: (Int -> a -> b -> b) -> b -> [a] -> b`
 *
 * Right-associative fold of a structure.
 */
export const ifoldr =
  <A, B>
  (f: (index: number) => (current: A) => (acc: B) => B) =>
  (initial: B) =>
  (xs: List<A>): B =>
    ifoldrSafe (f) (0) (initial) (xs)

List.ifoldr = ifoldr

const ifoldlIterator =
  <A, B>
  (f: (acc: B) => (index: number) => (current: A) => B) =>
  (index: number) =>
  (acc: B) =>
  (xs: List<A>): B =>
    isNil (xs)
    ? acc
    : ifoldlIterator (f) (index + 1) (f (acc) (index) (xs .x)) (xs .xs)

/**
 * `ifoldl :: Foldable t => (b -> Int -> a -> b) -> b -> t a -> b`
 *
 * Left-associative fold of a structure.
 *
 * In the case of lists, `ifoldl`, when applied to a binary operator, a
 * starting value (typically the left-identity of the operator), and a list,
 * reduces the list using the binary operator, from left to right.
 */
export const ifoldl =
  <A, B>
  (f: (acc: B) => (index: number) => (current: A) => B) =>
  (initial: B) =>
  (xs: List<A>): B =>
    ifoldlIterator (f) (0) (initial) (xs)

List.ifoldl = ifoldl

const iallIterator =
  <A>
  (f: (index: number) => (x: A) => boolean) =>
  (index: number) =>
  (xs: List<A>): boolean =>
    isNil (xs)
    ? true
    : f (index) (xs .x) && iallIterator (f) (index + 1) (xs .xs)

/**
 * `iall :: Foldable t => (Int -> a -> Bool) -> t a -> Bool`
 *
 * Determines whether all elements of the structure satisfy the predicate.
 */
export const iall =
  <A> (f: (index: number) => (x: A) => boolean) => (xs: List<A>): boolean =>
    iallIterator (f) (0) (xs)

List.iall = iall

const ianyIterator =
  <A>
  (f: (index: number) => (x: A) => boolean) =>
  (index: number) =>
  (xs: List<A>): boolean =>
    isNil (xs)
    ? false
    : f (index) (xs .x) || ianyIterator (f) (index + 1) (xs .xs)

/**
 * `iany :: Foldable t => (Int -> a -> Bool) -> t a -> Bool`
 *
 * Determines whether any element of the structure satisfies the predicate.
 */
export const iany =
  <A> (f: (index: number) => (x: A) => boolean) => (xs: List<A>): boolean =>
    ianyIterator (f) (0) (xs)

List.iany = iany

const iconcatMapIterator =
  <A, B>
  (f: (index: number) => (x: A) => List<B>) =>
  (index: number) =>
  (xs: List<A>): List<B> =>
    isNil (xs)
    ? Nil
    : append (f (index) (xs .x))
             (iconcatMapIterator (f) (index + 1) (xs .xs))

/**
 * `iconcatMap :: (Int -> a -> [b]) -> [a] -> [b]`
 */
export const iconcatMap =
  <A, B> (f: (index: number) => (x: A) => List<B>) => (xs: List<A>): List<B> =>
    iconcatMapIterator (f) (0) (xs)

List.iconcatMap = iconcatMap

// Sublists

interface Ifilter {

  /**
   * `ifilter :: (Int -> a -> Bool) -> [a] -> [a]`
   *
   * `ifilter`, applied to a predicate and a list, returns the list of those
   * elements that satisfy the predicate.
   */
  <A, A1 extends A>
  (pred: (index: number) => (x: A) => x is A1):
  (xs: List<A>) => List<A1>

  /**
   * `ifilter :: (Int -> a -> Bool) -> [a] -> [a]`
   *
   * `ifilter`, applied to a predicate and a list, returns the list of those
   * elements that satisfy the predicate.
   */
  <A> (pred: (index: number) => (x: A) => boolean): (xs: List<A>) => List<A>
}

/**
 * `ifilter :: (Int -> a -> Bool) -> [a] -> [a]`
 *
 * `ifilter`, applied to a predicate and a list, returns the list of those
 * elements that satisfy the predicate.
 */
export const ifilter: Ifilter =
  <A> (pred: (index: number) => (x: A) => boolean) => (xs: List<A>): List<A> =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    ifoldr<A, List<A>> (i => x => pred (i) (x) ? consF (x) : ident)
                       (Nil)
                       (xs)

List.ifilter = ifilter

/**
 * `ipartition :: (Int ->a -> Bool) -> [a] -> ([a], [a])`
 *
 * The `ipartition` function takes a predicate a list and returns the pair of
 * lists of elements which do and do not satisfy the predicate, respectively.
 *
 * ```haskell
 * >>> partition (`elem` "aeiou") "Hello World!"
 * ("eoo","Hll Wrld!")
 * ```
 */
export const ipartition =
  <A>
  (pred: (index: number) => (value: A) => boolean) =>
    ifoldr<A, Pair<List<A>, List<A>>>
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      (i => x => pred (i) (x) ? first (consF (x)) : second (consF (x)))
      (Pair (Nil, Nil))

List.ipartition = ipartition

// Search

const ifindIterator =
  <A>
  (pred: (index: number) => (x: A) => boolean) =>
  (index: number) =>
  (xs: List<A>): Maybe<A> =>
    isNil (xs)
    ? Nothing
    : pred (index) (xs .x)
    ? Just (xs .x)
    : ifindIterator (pred) (index + 1) (xs .xs)

interface Ifind {

  /**
   * `ifind :: Foldable t => (Int -> a -> Bool) -> t a -> Maybe a`
   *
   * The `find` function takes a predicate and a structure and returns the
   * leftmost element of the structure matching the predicate, or `Nothing` if
   * there is no such element.
   */
  <A, A1 extends A>
  (pred: (index: number) => (x: A) => x is A1):
  (xs: List<A>) => Maybe<A1>

  /**
   * `ifind :: Foldable t => (Int -> a -> Bool) -> t a -> Maybe a`
   *
   * The `find` function takes a predicate and a structure and returns the
   * leftmost element of the structure matching the predicate, or `Nothing` if
   * there is no such element.
   */
  <A> (pred: (index: number) => (x: A) => boolean): (xs: List<A>) => Maybe<A>
}

/**
 * `ifind :: Foldable t => (Int -> a -> Bool) -> t a -> Maybe a`
 *
 * The `find` function takes a predicate and a structure and returns the
 * leftmost element of the structure matching the predicate, or `Nothing` if
 * there is no such element.
 */
export const ifind: Ifind =
  <A> (pred: (index: number) => (x: A) => boolean) => (xs: List<A>): Maybe<A> =>
    ifindIterator (pred) (0) (xs)

List.ifind = ifind

const ifindIndexNode =
  <A>
  (pred: (index: number) => (x: A) => boolean) =>
  (index: number) =>
  (xs: List<A>): Maybe<number> =>
    isNil (xs)
    ? Nothing
    : pred (index) (xs .x)
    ? Just (index)
    : ifindIndexNode (pred) (index + 1) (xs .xs)

/**
 * `ifindIndex :: (Int -> a -> Bool) -> [a] -> Maybe Int`
 *
 * The `ifindIndex` function takes a predicate and a list and returns the
 * index of the first element in the list satisfying the predicate, or
 * `Nothing` if there is no such element.
 */
export const ifindIndex =
  <A>
  (pred: (index: number) => (x: A) => boolean) =>
  (xs: List<A>): Maybe<number> =>
    ifindIndexNode (pred) (0) (xs)

List.ifindIndex = ifindIndex

const ifindIndicesNode =
  <A>
  (pred: (index: number) => (x: A) => boolean) =>
  (index: number) =>
  (xs: List<A>): List<number> =>
    isNil (xs)
    ? Nil
    : pred (index) (xs .x)
    ? Cons (index, ifindIndicesNode (pred) (index + 1) (xs .xs))
    : ifindIndicesNode (pred) (index + 1) (xs .xs)

/**
 * `ifindIndices :: (a -> Bool) -> [a] -> [Int]`
 *
 * The `ifindIndices` function extends `findIndex`, by returning the indices
 * of all elements satisfying the predicate, in ascending order.
 */
export const ifindIndices =
  <A>
  (pred: (index: number) => (x: A) => boolean) =>
  (xs: List<A>): List<number> =>
    ifindIndicesNode (pred) (0) (xs)

List.ifindIndices = ifindIndices


// LIST.EXTRA

// String operations

/**
 * `lower :: String -> String`
 *
 * Convert a string to lower case.
 */
export const lower = (str: string) => str .toLowerCase ()

List.lower = lower

const spacesStartRx = /^\s+/u

/**
 * `trimStart :: String -> String`
 *
 * Remove spaces from the start of a string, see `trim`.
 */
export const trimStart = (str: string) => str .replace (spacesStartRx, "")

List.trimStart = trimStart

const spacesEndRx = /\s+$/u

/**
 * `trimEnd :: String -> String`
 *
 * Remove spaces from the end of a string, see `trim`.
 */
export const trimEnd = (str: string) => str .replace (spacesEndRx, "")

List.trimEnd = trimEnd

const regexRx = /[.*+?^${}()|[\]\\]/gu

/**
 * `escapeRegex :: String -> String`
 *
 * Escape a string that may contain `Regex`-specific notation for use in
 * regular expressions.
 *
 * ```haskell
 * escapeRegex "." == "\."
 * escapeRegex "This (or that)." == "This \(or that\)\."
 * ```
 */
export const escapeRegex =

  // $& means the whole matched string
  (x: string) => x .replace (regexRx, "\\$&")

List.escapeRegex = escapeRegex


// Splitting

/**
 * `splitOn :: (Partial, Eq a) => [a] -> [a] -> [[a]]`
 *
 * Break a list into pieces separated by the first list argument, consuming the
 * delimiter. An empty delimiter is invalid, and will cause an error to be
 * raised.
 */
export const splitOn =
  (del: string) => (x: string): List<string> =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    fromArray (x .split (del))

List.splitOn = splitOn


// Basics

/**
 * `notNull :: [a] -> Bool`
 *
 * A composition of `not` and `null`.
 */
export const notNull =
  pipe (fnull, not) as <A> (xs: List<A>) => xs is NonEmptyList<A>

export type notNull<A> = (xs: List<A>) => xs is NonEmptyList<A>

List.notNull = notNull

/**
 * `notNull :: String -> Bool`
 *
 * A composition of `not` and `null`.
 */
export const notNullStr = (xs: string) => xs .length > 0

List.notNullStr = notNullStr

/**
 * `list :: b -> (a -> [a] -> b) -> [a] -> b`
 *
 * Non-recursive transform over a list, like `maybe`.
 *
 * ```haskell
 * ist 1 (\v _ -> v - 2) [5,6,7] == 3
 * ist 1 (\v _ -> v - 2) []      == 1
 * nil cons xs -> maybe nil (uncurry cons) (uncons xs) == list nil cons xs
 * ```
 */
export const list =
  <B> (def: B) => <A> (f: (x: A) => (xs: List<A>) => B) => (xs: List<A>): B =>
    isNil (xs) ? def : f (xs .x) (xs .xs)

List.list = list


const unsnocSafe =
  <A> (xs: Cons<A>): Pair<List<A>, A> =>
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    isNil (xs .xs) ? Pair (Nil, xs .x) : first (consF (xs .x)) (unsnocSafe (xs .xs))

/**
 * `unsnoc :: [a] -> Maybe ([a], a)`
 *
 * If the list is empty returns `Nothing`, otherwise returns the `init` and the
 * `last`.
 */
export const unsnoc =
  <A> (xs: List<A>): Maybe<Pair<List<A>, A>> =>
    isNil (xs)
      ? Nothing
      : Just (unsnocSafe (xs))

List.unsnoc = unsnoc

/**
 * `cons :: a -> [a] -> [a]`
 *
 * Prepends an element to the list.
 *
 * Flipped version of `(:)`.
 */
export const consF = <A> (x: A) => (xs: List<A>): List<A> => cons (xs) (x)

List.consF = consF

const snocSafe =
  <A> (xs: Cons<A>) => (x: A): Cons<A> =>
    isNil (xs .xs)
    ? Cons (xs .x, pure (x))
    : Cons (xs .x, snocSafe (xs .xs) (x))

/**
 * `snoc :: [a] -> a -> [a]`
 *
 * Append an element to the end of a list, takes *O(n)* time.
 */
export const snoc =
  <A> (xs: List<A>) => (x: A): List<A> =>
    isNil (xs) ? pure (x) : snocSafe (xs) (x)

List.snoc = snoc

/**
 * `snocF :: a -> [a] -> [a]`
 *
 * Append an element to the end of a list, takes *O(n)* time.
 *
 * Flipped version of `snoc`.
 */
export const snocF =
  <A> (x: A) => (xs: List<A>): List<A> =>
    snoc (xs) (x)

List.snocF = snocF


// List operations

/**
 * `maximumOn :: Ord b => (a -> b) -> [a] -> Maybe a`
 *
 * A version of `maximum` where the comparison is done on some extracted value.
 *
 * Original `maximumOn :: Ord b => (a -> b) -> [a] -> a`.
 */
export const maximumOn =
  <A> (f: (x: A) => number) =>
    pipe (
      foldr<A, Pair<Maybe<A>, number>>
        (x => acc => {
          const res = f (x)

          return res > snd (acc) ? Pair (Just (x), res) : acc
        })
        (Pair (Nothing, -Infinity)),
      fst
    )

List.maximumOn = maximumOn

/**
 * `minimumOn :: Ord b => (a -> b) -> [a] -> Maybe a`
 *
 * A version of `minimum` where the comparison is done on some extracted value.
 *
 * Original `minimumOn :: Ord b => (a -> b) -> [a] -> a`.
 */
export const minimumOn =
  <A> (f: (x: A) => number) =>
    pipe (
      foldr<A, Pair<Maybe<A>, number>>
        (x => acc => {
          const res = f (x)

          return res < snd (acc) ? Pair (Just (x), res) : acc
        })
        (Pair (Nothing, Infinity)),
      fst
    )

List.minimumOn = minimumOn

/**
 * `firstJust :: (a -> Maybe b) -> [a] -> Maybe b`
 *
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
export const firstJust =
  <A, B> (pred: (x: A) => Maybe<B>) => (xs: List<A>): Maybe<B> => {
    if (isNil (xs)) {
      return Nothing
    }

    const res = pred (xs .x)

    if (isJust (res)) {
      return res
    }

    return firstJust (pred) (xs .xs)
  }

List.firstJust = firstJust

/**
 * `replace :: (Partial, Eq a) => [a] -> [a] -> [a] -> [a]`
 *
 * Replace a subsequence everywhere it occurs. The first argument must not be
 * the empty list.
 */
export const replaceStr =
  (old_subseq: string) => (new_subseq: string) => (x: string): string =>
    x .replace (new RegExp (escapeRegex (old_subseq), "gu"), new_subseq)

List.replaceStr = replaceStr

/**
 * `replace :: (Partial, Eq a) => RegExp -> [a] -> [a] -> [a]`
 *
 * Replace a subsequence. Use the `g` flag on the `RegExp` to replace all
 * occurrences.
 */
export const replaceStrRx =
  (old_subseq_rx: RegExp) => (new_subseq: string) => (x: string): string =>
    x .replace (old_subseq_rx, new_subseq)

List.replaceStrRx = replaceStrRx


// OWN METHODS

/**
 * `unsafeIndex :: [a] -> Int -> a`
 *
 * Unsafe list index operator, starting from 0. If the index is invalid this
 * function throws an error, otherwise returns `a`.
 */
export const unsafeIndex =
  <A> (xs: List<A>) => (index: number): A => {
    if (isNil (xs)) {
      throw new RangeError (
        `List.unsafeIndex: The index exceeds the length of the list.`
      )
    }

    if (index < 0) {
      throw new Error (
        `List.unsafeIndex: Negative index provided to `
        + `unsafeIndex. (${index})`
      )
    }

    if (index === 0) {
      return xs .x
    }

    return unsafeIndex (xs .xs) (index - 1)
  }

List.unsafeIndex = unsafeIndex

/**
 * Builds a new `List` from a native Array.
 */
export const fromArray = <A> (xs: readonly A[]): List<A> => {
  if (Array.isArray (xs)) {
    return List (...xs)
  }

  throw new TypeError (
    `fromArray requires an array but instead it received ${show (xs)}`
  )
}

List.fromArray = fromArray

/**
 * Converts a `List` to a native Array.
 */
export const toArray = <A> (xs: List<A>): A[] =>
  foldl<A, A[]> (arr => x => [ ...arr, x ]) ([]) (xs)

List.toArray = toArray

/**
 * Returns the sum of all elements of the list that match the provided
 * predicate.
 */
export const countWith =
  <A> (pred: (x: A) => boolean) => pipe (filter (pred), flength)

List.countWith = countWith

/**
 * `countWithByKey :: (a -> k) -> [a] -> Map k Int`
 *
 * Maps a function over a list that returns a key. The returned map contains the
 * returned keys and the value at the keys represent how often this key has been
 * returned from the passed function for this list.
 */
export const countWithByKey =
  <A, B>
  (f: (x: A) => B) =>
  (xs: List<A>): OrderedMap<B, number> => {
    // this implementation is only for perf reasons
    // once OrderedMap has it's own performant implementation, the
    // implementationof `groupByKey` can be changed

    const m = new Map<B, number> ()

    const arr = toArray (xs)

    for (const e of arr) {
      const key = f (e)

      const current = m .get (key)

      m .set (key, current === undefined ? 1 : current + 1)
    }

    return fromMap (m)
  }

List.countWithByKey = countWithByKey

/**
 * `countWithByKeyMaybe :: (a -> Maybe k) -> [a] -> Map k Int`
 *
 * Maps a function over a list that returns a key. The returned map contains the
 * returned `Just` keys and the value at the keys represent how often this key
 * has been returned as a `Just` from the passed function for this list.
 */
export const countWithByKeyMaybe =
  <A, B>
  (f: (x: A) => Maybe<B>) =>
  (xs: List<A>): OrderedMap<B, number> => {
    // this implementation is only for perf reasons
    // once OrderedMap has it's own performant implementation, the
    // implementationof `groupByKey` can be changed

    const m = new Map<B, number> ()

    const arr = toArray (xs)

    for (const e of arr) {
      const mkey = f (e)

      if (isJust (mkey)) {
        const key = fromJust (mkey)

        const current = m .get (key)

        m .set (key, current === undefined ? 1 : current + 1)
      }
    }

    return fromMap (m)
  }

List.countWithByKeyMaybe = countWithByKeyMaybe

/**
 * The largest element of a non-empty structure. The minimum value returned is
 * `0`.
 */
export const maximumNonNegative = pipe (consF (0), maximum)

List.maximumNonNegative = maximumNonNegative

/**
 * `groupByKey :: (a -> b) -> [a] -> Map b [a]`
 *
 * `groupByKey f xs` groups the elements of the list `xs` by the key returned by
 * passing the respective element to `f` in a map.
 */
export const groupByKey =
  <A, B>
  (f: (x: A) => B) =>
  (xs: List<A>): OrderedMap<B, List<A>> => {
    // this implementation is only for perf reasons
    // once OrderedMap has it's own performant implementation, the
    // implementationof `groupByKey` can be changed

    const m = new Map<B, List<A>> ()

    const arr = toArray (xs) .reverse ()

    for (const e of arr) {
      const key = f (e)

      const current = m .get (key)

      m .set (key, cons (current === undefined ? empty : current) (e))
    }

    return fromMap (m)
  }

List.groupByKey = groupByKey

interface RecordBaseWithId extends RecordBase {
  "@@name": "RecordBaseWithId"
  id: string
}

const RecordBaseWithId = fromDefault ("RecordBaseWithId") <RecordBaseWithId> ({ id: "" })

/**
 * `mapByIdKeyMap map xs` takes a map and a list containing records with an `id`
 * property and maps the records from the list by the `id` property to the keys
 * in the map, placing the element at that key at the respective position.
 */
export const mapByIdKeyMap =
  <A> (m: OrderedMap<string, A>) =>
    mapMaybe (pipe (RecordBaseWithId.AL.id, lookupF (m)))

List.mapByIdKeyMap = mapByIdKeyMap

export import isList = Internals.isList

List.isList = isList

/**
 * Returns `True` if the passed value is a non-empty string, `False` if the
 * passed value is either an empty string or `undefined`.
 */
export const notNullStrUndef =
  (str: string | undefined): str is string =>
    str !== undefined && str .length > 0

List.notNullStrUndef = notNullStrUndef

/**
 * `intersecting :: [a] -> [a] -> Bool`
 *
 * Returns if the passed lists have at least one value in common.
 */
export const intersecting =
  <A> (ys: List<A>) => any (elemF (ys))

List.intersecting = intersecting

/**
 * `filterMulti :: [a -> Bool] -> [a] -> [a]`
 *
 * `filterMulti`, applied to a list of predicates and a list, returns the list of those elements that satisfy the all predicates.
 */
export const filterMulti =
  <A> (preds: List<(x: A) => boolean>): (xs: List<A>) => List<A> =>
    filter<A> (x => all<(x: A) => boolean> (thrush (x)) (preds))

List.filterMulti = filterMulti

const lengthAtLeastIter =
  (min_len: number) => (len: number) => <A> (xs: List<A>): boolean => {
    if (isNil (xs)) {
      return false
    }
    else if (min_len === len + 1) {
      return true
    }
    else {
      return lengthAtLeastIter (min_len) (len + 1) (xs .xs)
    }
  }

/**
 * `lengthAtLeast :: Int -> [a] -> Bool`
 */
export const lengthAtLeast =
  (min_len: number) => <A> (xs: List<A>): boolean => {
    if (min_len < 0) {
      throw new RangeError ("lengthAtLeast: A list length cannot be negative!")
    }
    else if (min_len === 0) {
      return true
    }
    else if (min_len === 1) {
      return !isNil (xs)
    }
    else {
      return lengthAtLeastIter (min_len) (0) (xs)
    }
  }

List.lengthAtLeast = lengthAtLeast

const lengthAtMostIter =
  (max_len: number) => (len: number) => <A> (xs: List<A>): boolean => {
    if (isNil (xs)) {
      return true
    }
    else if (max_len < len + 1) {
      return false
    }
    else {
      return lengthAtMostIter (max_len) (len + 1) (xs .xs)
    }
  }

/**
 * `lengthAtLeast :: Int -> [a] -> Bool`
 */
export const lengthAtMost =
  (max_len: number) => <A> (xs: List<A>): boolean => {
    if (max_len < 0) {
      throw new RangeError ("lengthAtMost: A list length cannot be negative!")
    }
    else if (max_len === 0) {
      return isNil (xs)
    }
    else {
      return lengthAtMostIter (max_len) (0) (xs)
    }
  }

List.lengthAtMost = lengthAtMost


// Data.List.Unique


/**
 * `countElem` gets the number of occurrences of the specified element.
 */
export const countElem: <A> (x: A) => (xs: List<A>) => number
                      = x => foldr (pipe (
                                     equals (x),
                                     equal => equal ? inc : ident as ident<number>
                                   ))
                                   (0)


// TYPE HELPERS

export type ListI<A> = A extends Cons<infer AI> ? AI : never

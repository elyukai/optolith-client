/**
 * @module Data.List
 *
 * A list (`[a]`) is a simple flat data structure for values of the same type.
 *
 * @author Lukas Obermann
 */

import { pipe } from "../App/Utilities/pipe"
import { Cons as c, EmptyList as n, list as t } from "../shims/ReasonPervasives.shim"
import { equals } from "./Eq"
import { ident, thrush } from "./Function"
import * as ReList from "./Ley_List.gen"
import * as ReOption from "./Ley_Option.gen"
import { StrMap } from "./Ley_StrMap.gen"
import { inc } from "./Num"
import { Compare, isLTorEQ, Ordering } from "./Ord"
import { fromDefault, Record, RecordBase } from "./Record"
import { show } from "./Show"
import { lookupF } from "./StrMap"
import { fst, Pair, snd } from "./Tuple"
import { uncurryN, uncurryN3 } from "./Tuple/All"

type Maybe<A> = ReOption.t<A>
export type NonEmptyList<A> = Cons<A>

// CONSTRUCTOR

export type List<A> = t<A>

type Nil = n
const Nil: Nil = 0 as unknown as Nil

const isNil = (xs: List<any>): xs is Nil => xs === Nil

type Cons<A> = c<A>
const Cons = <A>(x: A, xs: List<A>): List<A> => [ x, xs ] as unknown as Cons<A>

const unconsHead = <A>(xs: Cons<A>): A => (xs as unknown as [A, List<A>])[0]
const unconsTail = <A>(xs: Cons<A>): List<A> => (xs as unknown as [A, List<A>])[1]

/**
 * `List :: (...a) -> [a]`
 *
 * Creates a new `List` instance from the passed arguments.
 */
export const List =
  <A> (...values: A[]): List<A> => {
    let h: List<A> = Nil

    for (let i = 0; i < values.length; i++) {
      const x = values[values.length - 1 - i]

      h = Cons (x, h)
    }

    return h
  }


// FUNCTOR

/**
 * `fmap :: (a -> b) -> f a -> f b`
 */
export const fmap =
  <A, B> (f: (x: A) => B) => (x: List<A>): List<B> =>
    ReList.Functor_fmap (f, x)

/**
 * `fmapF :: f a -> (a -> b) -> f b`
 */
export const fmapF =
  <A> (x: List<A>) => <B> (f: (x: A) => B): List<B> =>
    ReList.Functor_fmap (f, x)


// APPLICATIVE

/**
 * `pure :: a -> [a]`
 *
 * Lift a value.
 */
export const pure = <A> (x: A) => Cons (x, Nil)

List.pure = pure

/**
 * `(<*>) :: [a -> b] -> [a] -> [b]`
 *
 * Sequential application.
 */
export const ap =
  <A, B> (fs: List<(x: A) => B>) => (xs: List<A>): List<B> =>
    ReList.Applicative_ap (fs, xs)

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
    ReList.Alternative_alt (xs1, xs2)

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
  ReList.Alternative_alt (xs2, xs1)

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
  (pred: boolean): List<void> =>
    ReList.Alternative_guard (pred)

List.guard = guard


// MONAD

/**
 * `(>>=) :: [a] -> (a -> [b]) -> [b]`
 */
export const bind =
  <A, B> (xs: List<A>) => (f: (x: A) => List<B>): List<B> =>
    ReList.Monad_bind (xs, f)

List.bind = bind

/**
 * `(=<<) :: (a -> [b]) -> [a] -> [b]`
 */
export const bindF =
  <A, B> (f: (x: A) => List<B>) => (xs: List<A>): List<B> =>
    ReList.Monad_bindF (f, xs)

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
    ReList.Monad_then (xs1, xs2)

List.then = then

/**
 * `(>=>) :: (a -> [b]) -> (b -> [c]) -> a -> [c]`
 *
 * Left-to-right Kleisli composition of monads.
 */
export const kleisli =
  <A, B, C> (f1: (x: A) => List<B>) => (f2: (x: B) => List<C>) => (x: A) =>
    ReList.Monad_kleisli (f1, f2, x)

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
    ReList.Monad_join (xss)

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
    ReList.Foldable_foldr (uncurryN (f), initial, xs)

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
    ReList.Foldable_foldl (uncurryN (f), initial, xs)

List.foldl = foldl

/**
 * `foldr1 :: (a -> a -> a) -> [a] -> a`
 *
 * A variant of `foldr` that has no base case, and thus may only be applied to
 * non-empty structures.
 *
 * `foldr1 f = foldr1 f . toList`
 */
export const foldr1 =
  <A> (f: (x: A) => (acc: A) => A) => (xs: List<A>): A =>
    ReList.Foldable_foldr1 (uncurryN (f), xs)

List.foldr1 = foldr1

/**
 * `foldl1 :: (a -> a -> a) -> [a] -> a`
 *
 * A variant of `foldl` that has no base case, and thus may only be applied to
 * non-empty structures.
 *
 * `foldl1 f = foldl1 f . toList`
 */
export const foldl1 =
  <A> (f: (acc: A) => (x: A) => A) => (xs: List<A>): A =>
    ReList.Foldable_foldl1 (uncurryN (f), xs)

List.foldl1 = foldl1

/**
 * `toList :: [a] -> [a]`
 *
 * List of elements of a structure, from left to right.
 */
export const toList = <A> (xs: List<A>): List<A> => ReList.Foldable_toList (xs)

List.toList = toList

/**
 * `null :: [a] -> Bool`
 *
 * Test whether the structure is empty. The default implementation is optimized
 * for structures that are similar to cons-lists, because there is no general
 * way to do better.
 */
export const fnull = (xs: List<any>) => ReList.Foldable_fnull (xs)

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
    ReList.Foldable_flength (xs)

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
    ReList.Foldable_elem (x, xs)

export type elem<A> = (x: A) => (xs: List<A>) => boolean

List.elem = elem

/**
 * `elemF :: Eq a => [a] -> a -> Bool`
 *
 * Does the element occur in the structure?
 *
 * Flipped version of `elem`.
 */
export const elemF = <A> (xs: List<A>) => (x: A): boolean => ReList.Foldable_elem (x, xs)

List.elemF = elemF

/**
 * `sum :: Num a => [a] -> a`
 *
 * The `sum` function computes the sum of the numbers of a structure.
 */
export const sum = (xs: List<number>) => ReList.Foldable_sum (xs)

List.sum = sum

/**
 * `product :: Num a => [a] -> a`
 *
 * The `product` function computes the product of the numbers of a structure.
 */
export const product = (xs: List<number>) => ReList.Foldable_product (xs)

List.product = product

/**
 * `maximum :: Ord a => [a] -> a`
 *
 * The largest element of a non-empty structure.
 */
export const maximum = (xs: List<number>) => ReList.Foldable_maximum (xs)

List.maximum = maximum

/**
 * `minimum :: Ord a => [a] -> a`
 *
 * The least element of a non-empty structure.
 */
export const minimum = (xs: List<number>) => ReList.Foldable_minimum (xs)

List.minimum = minimum

// Specialized folds

/**
 * `concat :: [[a]] -> [a]`
 *
 * The concatenation of all the elements of a container of lists.
 */
export const concat = ReList.Foldable_concat

List.concat = concat

/**
 * `concatMap :: (a -> [b]) -> [a] -> [b]`
 *
 * Map a function over all the elements of a container and concatenate the
 * resulting lists.
 */
export const concatMap = ReList.Foldable_concatMap

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
    ReList.Foldable_and (xs)

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
    ReList.Foldable_or (xs)

List.or = or

/**
 * `any :: (a -> Bool) -> [a] -> Bool`
 *
 * Determines whether any element of the structure satisfies the predicate.
 */
export const any =
  <A> (f: (x: A) => boolean) => (xs: List<A>): boolean =>
    ReList.Foldable_any (f, xs)

List.any = any

/**
 * `all :: (a -> Bool) -> [a] -> Bool`
 *
 * Determines whether all elements of the structure satisfy the predicate.
 */
export const all =
  <A> (f: (x: A) => boolean) => (xs: List<A>): boolean =>
    ReList.Foldable_all (f, xs)

List.all = all

// Searches

/**
 * `notElem :: Eq a => a -> [a] -> Bool`
 *
 * `notElem` is the negation of `elem`.
 */
export const notElem = <A> (x: A, xs: List<A>) => ReList.Foldable_notElem (x, xs)

List.notElem = notElem

/**
 * `notElemF :: Eq a => a -> [a] -> Bool`
 *
 * `notElemF` is the negation of `elem_`.
 *
 * `notElemF` is the same as `notElem` but with arguments flipped.
 */
export const notElemF = <A> (xs: List<A>) => (x: A) => ReList.Foldable_notElem (x, xs)

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
    ReList.Foldable_find (pred, xs)

List.find = find


// BASIC FUNCTIONS

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
    ReList.append (xs1, xs2)

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
export const cons = <A> (xs: List<A>) => (x: A): List<A> => ReList.cons (x, xs)

List.cons = cons

/**
 * `head :: [a] -> a`
 *
 * Extract the first element of a list, which must be non-empty.
 */
export const head = <A> (xs: Cons<A>): A => ReList.head (xs)

List.head = head

/**
 * `last :: [a] -> a`
 *
 * Extract the last element of a list, which must be finite and non-empty.
 */
export const last = <A> (xs: Cons<A>): A => ReList.last (xs)

List.last = last

/**
 * `tail :: [a] -> [a]`
 *
 * Extract the elements after the head of a list, which must be non-empty.
 */
export const tail = <A> (xs: Cons<A>): List<A> => ReList.tail (xs)

List.tail = tail

/**
 * `init :: [a] -> [a]`
 *
 * Return all the elements of a list except the last one. The list must be
 * non-empty.
 */
export const init = <A> (xs: Cons<A>): List<A> => ReList.init (xs)

List.init = init

/**
 * `uncons :: [a] -> Maybe (a, [a])`
 *
 * Decompose a list into its head and tail. If the list is empty, returns
 * `Nothing`. If the list is non-empty, returns `Just (x, xs)`, where `x` is
 * the head of the list and `xs` its tail.
 */
export const uncons =
  <A> (xs: List<A>): Maybe<Pair<A, List<A>>> =>
    ReList.uncons (xs)

List.uncons = uncons


// LIST TRANSFORMATIONS

/**
 * `map :: (a -> b) -> [a] -> [b]`
 *
 * `map f xs` is the list obtained by applying `f` to each element of `xs`.
 */
export const map =
  <A, B> (f: (x: A) => B) => (xs: List<A>): List<B> =>
    ReList.map (f, xs)

List.map = map

/**
 * `reverse :: [a] -> [a]`
 *
 * `reverse xs` returns the elements of `xs` in reverse order. `xs` must be
 * finite.
 */
export const reverse =
  <A> (xs: List<A>): List<A> =>
    ReList.reverse (xs)

List.reverse = reverse

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
    ReList.intersperse (x, xs)

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
    ReList.intercalate (separator, ReList.map (e => typeof e === "string" ? e : e.toString (), xs))

List.intercalate = intercalate


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
export const permutations =
  <A> (xs: List<A>): List<List<A>> =>
    ReList.permutations (xs)

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
    ReList.scanl (uncurryN (f), initial, xs)

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
  (xs: List<B>): Pair<A, List<C>> =>
    ReList.mapAccumL (uncurryN (f), initial, xs)

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
  (xs: List<B>): Pair<A, List<C>> =>
    ReList.mapAccumR (uncurryN (f), initial, xs)

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
  (len: number) => <A> (x: A): List<A> =>
    ReList.replicate (len, x)

List.replicate = replicate

// /**
//  * `replicateR :: Int -> (Int -> a) -> [a]`
//  *
//  * `replicate n f` is a list of length `n` with the result of `f` the value of
//  * every element. Its used for lists of React elements to get a accumulating
//  * key, as the `Int` passed to `f` is the index of the element
//  */
// export const replicateR =
//   (len: number) =>
//   <A>
//   (f: (index: number) => A): List<A> =>
//     // eslint-disable-next-line @typescript-eslint/no-use-before-define
//     unfoldr ((index: number) => index < len ? Just (Pair (f (index), index + 1)) : Nothing)
//             (0)

// List.replicateR = replicateR


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
  <A, B> (f: (x: B) => Maybe<Pair<A, B>>) => (seedValue: B): List<A> =>
    ReList.unfoldr (f, seedValue)

List.unfoldr = unfoldr


// EXTRACTING SUBLISTS

/**
 * `take :: Int -> [a] -> [a]`
 *
 * `take n`, applied to a list `xs`, returns the prefix of `xs` of length `n`,
 * or `xs` itself if `n > length xs`.
 */
export const take =
  (len: number) => <A> (xs: List<A>): List<A> =>
    ReList.take (len, xs)

List.take = take

/**
 * `drop :: Int -> [a] -> [a]`
 *
 * `drop n xs` returns the suffix of `xs` after the first `n` elements, or
 * `[]` if `n > length x`.
 */
export const drop =
  (len: number) => <A> (xs: List<A>): List<A> =>
    ReList.drop (len, xs)

List.drop = drop

/**
 * `splitAt :: Int -> [a] -> ([a], [a])`
 *
 * `splitAt n xs` returns a tuple where first element is `xs` prefix of length
 * `n` and second element is the remainder of the list.
 */
export const splitAt =
  (len: number) => <A> (xs: List<A>): Pair<List<A>, List<A>> => ReList.splitAt (len, xs)

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
    ReList.isInfixOf (x, y)

List.isInfixOf = isInfixOf


// SEARCHING BY EQUALITY

/**
 * `lookup :: Eq a => a -> [(a, b)] -> Maybe b`
 *
 * `lookup key assocs` looks up a key in an association list.
 */
export const lookup = <K, V> (key: K) => (assocs: List<Pair<K, V>>): Maybe<V> =>
    ReList.lookup (key, assocs)

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
    ReList.filter (pred, xs)

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
  (pred: (value: A) => boolean) => (xs: List<A>) =>
    ReList.partition (pred, xs)

List.partition = partition


// INDEXING LISTS

/**
 * List index (subscript) operator, starting from 0. If the index is invalid,
 * returns `Nothing`, otherwise `Just a`.
 */
export const subscript =
  <A> (xs: List<A>) => (index: number): A =>
    ReList.subscript (xs, index)

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
  (index: number) => <A> (xs: List<A>): A =>
    ReList.subscript (xs, index)

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
    ReList.elemIndex (x, xs)

List.elemIndex = elemIndex

/**
 * `elemIndices :: Eq a => a -> [a] -> [Int]`
 *
 * The `elemIndices` function extends `elemIndex`, by returning the indices of
 * all elements equal to the query element, in ascending order.
 */
export const elemIndices =
  <A> (x: A) => (xs: List<A>): List<number> =>
    ReList.elemIndices (x, xs)

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
    ReList.findIndex (pred, xs)

List.findIndex = findIndex

/**
 * `findIndices :: (a -> Bool) -> [a] -> [Int]`
 *
 * The `findIndices` function extends `findIndex`, by returning the indices of
 * all elements satisfying the predicate, in ascending order.
 */
export const findIndices =
  <A> (pred: (x: A) => boolean) => (xs: List<A>): List<number> =>
    ReList.findIndices (pred, xs)

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
    ReList.zip (xs1, xs2)

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
    ReList.zipWith (uncurryN (f), xs1, xs2)

List.zipWith = zipWith


// SPECIAL LISTS

// Functions on strings

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
    ReList.lines (x)

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
    ReList.nub (xs)

List.nub = nub

/**
 * `delete :: Eq a => a -> [a] -> [a]`
 *
 * `delete x` removes the first occurrence of `x` from its list argument.
 */
export const sdelete =
  <A> (x: A) => (xs: List<A>): List<A> =>
    ReList.sdelete (x, xs)

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
    ReList.intersect (xs, ys)

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
      ? Cons (head (a), sortBySortedMerge (f) (unconsTail (a), b))
      : Cons (head (b), sortBySortedMerge (f) (a, unconsTail (b)))
  }

const sortByNodeMergeSort =
  <A>
  (f: (a: A) => (b: A) => Ordering) =>
  (xs: List<A>): List<A> => {
    // Base case: if head is undefined
    if (isNil (xs) || isNil (unconsTail (xs))) {
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
    ReList.sortBy (uncurryN (f), xs)

List.sortBy = sortBy

/**
 * `maximumBy :: Foldable t => (a -> a -> Ordering) -> t a -> a`
 *
 * The largest element of a non-empty structure with respect to the given
 * comparison function.
 */
export const maximumBy = <A> (f: Compare<A>) => (xs: NonEmptyList<A>): A =>
  ReList.maximumBy (f, xs)

List.maximumBy = maximumBy

/**
 * `minimumBy :: Foldable t => (a -> a -> Ordering) -> t a -> a`
 *
 * The least element of a non-empty structure with respect to the given
 * comparison function.
 */
export const minimumBy = <A> (f: Compare<A>) => (xs: NonEmptyList<A>): A =>
  ReList.minimumBy (f, xs)

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
  ReList.Index_indexed (xs)

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
    ReList.Index_deleteAt (index, xs)

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
    ReList.Index_deleteAtPair (index, xs)

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
    ReList.Index_setAt (index, x, xs)

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
    ReList.Index_modifyAt (index, f, xs)

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
    ReList.Index_updateAt (index, f, xs)

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
    ReList.Index_insertAt (index, x, xs)

List.insertAt = insertAt

// Maps

/**
 * `imap :: (Int -> a -> b) -> [a] -> [b]`
 *
 * `imap f xs` is the list obtained by applying `f` to each element of `xs`.
 */
export const imap =
  <A, B> (f: (index: number) => (x: A) => B) => (xs: List<A>): List<B> =>
    ReList.Index_imap (uncurryN (f), xs)

List.imap = imap

// Folds

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
    ReList.Index_ifoldr (uncurryN3 (f), initial, xs)

List.ifoldr = ifoldr

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
    ReList.Index_ifoldl (uncurryN3 (f), initial, xs)

List.ifoldl = ifoldl

/**
 * `iall :: Foldable t => (Int -> a -> Bool) -> t a -> Bool`
 *
 * Determines whether all elements of the structure satisfy the predicate.
 */
export const iall =
  <A> (f: (index: number) => (x: A) => boolean) => (xs: List<A>): boolean =>
    ReList.Index_iall (uncurryN (f), xs)

List.iall = iall

/**
 * `iany :: Foldable t => (Int -> a -> Bool) -> t a -> Bool`
 *
 * Determines whether any element of the structure satisfies the predicate.
 */
export const iany =
  <A> (f: (index: number) => (x: A) => boolean) => (xs: List<A>): boolean =>
    ReList.Index_iany (uncurryN (f), xs)

List.iany = iany

/**
 * `iconcatMap :: (Int -> a -> [b]) -> [a] -> [b]`
 */
export const iconcatMap =
  <A, B> (f: (index: number) => (x: A) => List<B>) => (xs: List<A>): List<B> =>
    ReList.Index_iconcatMap (uncurryN (f), xs)

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
    ReList.Index_ifilter (uncurryN (pred), xs)

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
  (xs: List<A>) =>
    ReList.Index_ipartition (uncurryN (pred), xs)

List.ipartition = ipartition

// Search

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
    ReList.Index_ifind (uncurryN (pred), xs)

List.ifind = ifind

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
    ReList.Index_ifindIndex (uncurryN (pred), xs)

List.ifindIndex = ifindIndex

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
    ReList.Index_ifindIndices (uncurryN (pred), xs)

List.ifindIndices = ifindIndices


// LIST.EXTRA

// String operations

/**
 * `lower :: String -> String`
 *
 * Convert a string to lower case.
 */
export const lower = (str: string) => ReList.Extra_lower (str)

List.lower = lower

/**
 * `trimStart :: String -> String`
 *
 * Remove spaces from the start of a string, see `trim`.
 */
export const trimStart = (str: string) => ReList.Extra_trimStart (str)

List.trimStart = trimStart

/**
 * `trimEnd :: String -> String`
 *
 * Remove spaces from the end of a string, see `trim`.
 */
export const trimEnd = (str: string) => ReList.Extra_trimEnd (str)

List.trimEnd = trimEnd

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
  (x: string) => ReList.Extra_escapeRegex (x)

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
    ReList.Extra_splitOn (del, x)

List.splitOn = splitOn


// Basics

/**
 * `notNull :: [a] -> Bool`
 *
 * A composition of `not` and `null`.
 */
export const notNull = <A> (xs: List<A>) => ReList.Extra_notNull (xs)

export type notNull<A> = (xs: List<A>) => xs is NonEmptyList<A>

List.notNull = notNull

/**
 * `notNull :: String -> Bool`
 *
 * A composition of `not` and `null`.
 */
export const notNullStr = (xs: string) => ReList.Extra_notNullStr (xs)

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
  <A, B> (def: B) => (f: (x: A) => (xs: List<A>) => B) => (xs: List<A>): B =>
    ReList.Extra_list (def, uncurryN (f), xs)

List.list = list


/**
 * `unsnoc :: [a] -> Maybe ([a], a)`
 *
 * If the list is empty returns `Nothing`, otherwise returns the `init` and the
 * `last`.
 */
export const unsnoc =
  <A> (xs: List<A>): Maybe<Pair<List<A>, A>> =>
    ReList.Extra_unsnoc (xs)

List.unsnoc = unsnoc

/**
 * `cons :: a -> [a] -> [a]`
 *
 * Prepends an element to the list.
 *
 * Flipped version of `(:)`.
 */
export const consF = <A> (x: A) => (xs: List<A>): List<A> => ReList.cons (x, xs)

List.consF = consF

/**
 * `snoc :: [a] -> a -> [a]`
 *
 * Append an element to the end of a list, takes *O(n)* time.
 */
export const snoc =
  <A> (xs: List<A>) => (x: A): List<A> =>
    ReList.Extra_snoc (xs, x)

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
    ReList.Extra_snoc (xs, x)

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

          return res > snd (acc) ? Pair (x, res) : acc
        })
        (Pair (undefined, -Infinity)),
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

          return res < snd (acc) ? Pair (x, res) : acc
        })
        (Pair (undefined, Infinity)),
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
  <A, B> (pred: (x: A) => Maybe<B>) => (xs: List<A>): Maybe<B> =>
    ReList.Extra_firstJust (pred, xs)

List.firstJust = firstJust

/**
 * `replace :: (Partial, Eq a) => [a] -> [a] -> [a] -> [a]`
 *
 * Replace a subsequence everywhere it occurs. The first argument must not be
 * the empty list.
 */
export const replaceStr =
  (old_subseq: string) => (new_subseq: string) => (x: string): string =>
    ReList.Extra_replaceStr (old_subseq, new_subseq, x)

List.replaceStr = replaceStr

/**
 * `replace :: (Partial, Eq a) => RegExp -> [a] -> [a] -> [a]`
 *
 * Replace a subsequence. Use the `g` flag on the `RegExp` to replace all
 * occurrences.
 */
export const replaceStrRx =
  (old_subseq_rx: RegExp) => (new_subseq: string) => (x: string): string =>
    ReList.Extra_replaceStrRe (old_subseq_rx, new_subseq, x)

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
      return unconsHead (xs)
    }

    return unsafeIndex (unconsTail (xs)) (index - 1)
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
  <A> (pred: (x: A) => boolean, xs: List<A>) =>
    ReList.countBy (pred, xs)

List.countWith = countWith

/**
 * The largest element of a non-empty structure. The minimum value returned is
 * `0`.
 */
export const maximumNonNegative = pipe (consF (0), maximum)

List.maximumNonNegative = maximumNonNegative

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
  <A> (m: StrMap<A>) =>
  (xs: List<Record<RecordBaseWithId>>) =>
    ReOption.mapOption (pipe (RecordBaseWithId.AL.id, lookupF (m)), xs)

List.mapByIdKeyMap = mapByIdKeyMap

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
      return lengthAtLeastIter (min_len) (len + 1) (unconsTail (xs))
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
      return lengthAtMostIter (max_len) (len + 1) (unconsTail (xs))
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

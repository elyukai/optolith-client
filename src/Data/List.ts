/**
 * @module Data.List
 *
 * A list (`[a]`) is a simple flat data structure for values of the same type.
 *
 * @author Lukas Obermann
 */

import { pipe } from "ramda";
import { add, max, min, multiply } from "../App/Utils/mathUtils";
import { not } from "../App/Utils/not";
import { equals } from "./Eq";
import { cnst, ident } from "./Function";
import { fromJust, imapMaybe, isJust, Just, Maybe, maybe, Nothing } from "./Maybe";
import { isLTorEQ, Ordering } from "./Ord";
import { fromBinary, fromBoth, fst, Pair, snd } from "./Pair";
import { show } from "./Show";


// CONSTRUCTOR

interface ListPrototype<A> {
  readonly isList: true
}

interface Node<A> {
  readonly value: A
  readonly next?: Node<A>
}

type MaybeNode<A> = Node<A> | undefined

export interface List<A> extends ListPrototype<A> {
  readonly head: MaybeNode<A>
}

export interface NonEmptyList<A> extends List<A> {
  readonly head: Node<A>
}

const ListPrototype =
  Object.freeze<ListPrototype<any>> ({
    isList: true,
  })

const _List =
  <A> (xs: MaybeNode<A>): List<A> =>
    Object.create (
      ListPrototype, {
        head: {
          value: xs,
          enumerable: true,
        },
      }
    )

/**
 * `fromArray :: Array a -> [a]`
 *
 * Creates a new `List` instance from the passed native `Array`.
 */
export const fromArray = <A> (xs: ReadonlyArray<A>): List<A> => {
  if (Array.isArray (xs)) {
    return _List (buildNodexFromArrayWithLastIndex (xs)
                                                   (xs .length - 1)
                                                   (undefined))
  }

  throw new TypeError (
    `fromArray requires an array but instead it received ${show (xs)}`
  )
}

/**
 * `fromElements :: (...a) -> [a]`
 *
 * Creates a new `List` instance from the passed arguments.
 */
export const fromElements = <A> (...values: A[]) => fromArray (values)


// FUNCTOR

/**
 * `fmap :: (a -> b) -> [a] -> [b]`
 */
export const fmap =
  <A, B> (f: (x: A) => B) => (xs: List<A>): List<B> =>
    _List (fmapNode (f) (xs .head))

const fmapNode =
  <A, B> (f: (x: A) => B) => (xs: MaybeNode<A>): MaybeNode<B> =>
    xs !== undefined
    ? toNodeNext (f (value (xs))) (fmapNode (f) (xs .next))
    : undefined

/**
 * `(<$) :: Functor f => a -> f b -> f a`
 *
 * Replace all locations in the input with the same value. The default
 * definition is `fmap . const`, but this may be overridden with a more
 * efficient version.
 */
export const mapReplace = <A, B> (x: A) => fmap<B, A> (cnst (x))


// APPLICATIVE

/**
 * `pure :: a -> [a]`
 *
 * Lift a value.
 */
export const pure = <A> (x: A) => _List (toNode (x))

/**
 * `(<*>) :: [a -> b] -> [a] -> [b]`
 *
 * Sequential application.
 */
export const ap =
  <A, B> (fs: List<(x: A) => B>) => (xs: List<A>): List<B> =>
    _List (apNode<A, B> (fs .head) (xs .head))

const apNode =
  <A, B>
  (fs: MaybeNode<(x: A) => B>) =>
  (xs: MaybeNode<A>): MaybeNode<B> =>
    fs !== undefined && xs !== undefined
    ? mapApNode (value (fs))
                (apNode (fs .next) (xs))
                (xs)
    : undefined

const mapApNode =
  <A, B>
  (f: (x: A) => B) =>
  (xs: MaybeNode<B>) =>
  (x: MaybeNode<A>): MaybeNode<B> =>
    x !== undefined
    ? consNode (mapApNode (f) (xs) (x . next))
               (toNode (f (value (x))))
    : xs


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
    xs1 .head === undefined ? xs2 : xs1

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

/**
 * `empty :: [a]`
 *
 * The empty list.
 */
export const empty = _List<never> (undefined)

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


// MONAD

/**
 * `(>>=) :: [a] -> (a -> [b]) -> [b]`
 */
export const bind =
  <A, B> (xs: List<A>) => (f: (x: A) => List<B>): List<B> =>
    _List (bindNode<A, B> (xs .head) (f))

const bindNode =
  <A, B> (xs: MaybeNode<A>) => (f: (x: A) => List<B>): MaybeNode<B> =>
    xs !== undefined
    ? mappendNode (f (value (xs)) .head) (bindNode<A, B> (xs .next) (f))
    : undefined

/**
 * `(=<<) :: (a -> [b]) -> [a] -> [b]`
 */
export const bindF =
  <A, B> (f: (x: A) => List<B>) => (xs: List<A>): List<B> =>
    bind<A, B> (xs) (f)

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

/**
 * `(>=>) :: (a -> [b]) -> (b -> [c]) -> a -> [c]`
 *
 * Left-to-right Kleisli composition of monads.
 */
export const kleisli =
  <A, B, C> (f1: (x: A) => List<B>) => (f2: (x: B) => List<C>) =>
    pipe (f1, bindF (f2))

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
    foldrNode (f) (xs .head) (initial)

const foldrNode =
  <A, B> (f: (x: A) => (acc: B) => B) => (xs: MaybeNode<A>) => (acc: B): B =>
    xs !== undefined
    ? f (value (xs)) (foldrNode (f) (xs .next) (acc))
    : acc

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
    foldlNode (f) (xs .head) (initial)

const foldlNode =
  <A, B> (f: (acc: B) => (x: A) => B) => (xs: MaybeNode<A>) => (acc: B): B =>
    xs !== undefined
    ? foldlNode (f) (xs .next) (f (acc) (value (xs)))
    : acc

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
    if (xs .head !== undefined) {
      return foldr1Node (f) (xs .head)
    }

    throw new TypeError ("Cannot apply foldr1 to an empty list.")
  }

const foldr1Node =
  <A> (f: (x: A) => (acc: A) => A) => (xs: Node<A>): A =>
    xs .next !== undefined
    ? f (value (xs)) (foldr1Node (f) (xs .next))
    : value (xs)

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
    if (xs .head !== undefined) {
      return foldl1Node (f) (xs .head .next) (value (xs .head))
    }

    throw new TypeError ("Cannot apply foldl1 to an empty list.")
  }

const foldl1Node =
  <A>
  (f: (acc: A) => (x: A) => A) =>
  (xs: MaybeNode<A>) =>
  (acc: A): A =>
    xs === undefined ? acc : foldl1Node (f) (xs .next) (f (acc) (value (xs)))

/**
 * `toList :: [a] -> [a]`
 *
 * List of elements of a structure, from left to right.
 */
export const toList = <A> (xs: List<A>): List<A> => xs

/**
 * `null :: [a] -> Bool`
 *
 * Test whether the structure is empty. The default implementation is optimized
 * for structures that are similar to cons-lists, because there is no general
 * way to do better.
 */
export const fnull = (xs: List<any>): boolean => xs .head === undefined

/**
 * `length :: [a] -> Int`
 *
 * Returns the size/length of a finite structure as an `Int`. The default
 * implementation is optimized for structures that are similar to cons-lists,
 * because there is no general way to do better.
 */
export const length = (xs: List<any>): number => lengthNode (xs .head) (0)

const lengthNode =
  (node: MaybeNode<any>) => (acc: number): number =>
    node === undefined ? acc : lengthNode (node .next) (acc + 1)

/**
 * `elem :: Eq a => a -> [a] -> Bool`
 *
 * Does the element occur in the structure?
 */
export const elem =
  <A> (x: A) => (xs: List<A>): boolean =>
    elemNode (x) (xs .head)

const elemNode =
  <A> (x: A) => (xs: MaybeNode<A>): boolean =>
    xs === undefined
    ? false
    : equals (x) (value (xs)) || elemNode (x) (xs .next)

/**
 * `elemF :: Eq a => [a] -> a -> Bool`
 *
 * Does the element occur in the structure?
 *
 * Flipped version of `elem`.
 */
export const elemF = <A> (xs: List<A>) => (x: A): boolean => elem (x) (xs)

/**
 * `sum :: Num a => [a] -> a`
 *
 * The `sum` function computes the sum of the numbers of a structure.
 */
export const sum = foldl (add) (0)

/**
 * `product :: Num a => [a] -> a`
 *
 * The `product` function computes the product of the numbers of a structure.
 */
export const product = foldl (multiply) (1)

/**
 * `maximum :: Ord a => [a] -> a`
 *
 * The largest element of a non-empty structure.
 */
export const maximum = foldr (max) (-Infinity)

/**
 * `minimum :: Ord a => [a] -> a`
 *
 * The least element of a non-empty structure.
 */
export const minimum = foldr (min) (Infinity)

// Specialized folds

/**
 * `concat :: [[a]] -> [a]`
 *
 * The concatenation of all the elements of a container of lists.
 */
export const concat = join

/**
 * `concatMap :: (a -> [b]) -> [a] -> [b]`
 *
 * Map a function over all the elements of a container and concatenate the
 * resulting lists.
 */
export const concatMap = bindF

/**
 * `and :: [Bool] -> Bool`
 *
 * `and` returns the conjunction of a container of Bools. For the result to be
 * `True`, the container must be finite. `False`, however, results from a
 * `False` value finitely far from the left end.
 */
export const and = (xs: List<boolean>): boolean => andNode (xs .head)

const andNode =
  (xs: Node<boolean> | undefined): boolean =>
    xs !== undefined
    ? value (xs) && andNode (xs .next)
    : true

/**
 * `or :: [Bool] -> Bool`
 *
 * `or` returns the disjunction of a container of Bools. For the result to be
 * `False`, the container must be finite. `True`, however, results from a
 * `True` value finitely far from the left end.
 */
export const or = (xs: List<boolean>): boolean => orNode (xs .head)

const orNode =
  (xs: MaybeNode<boolean>): boolean =>
    xs !== undefined
    ? value (xs) || orNode (xs .next)
    : false

/**
 * `any :: (a -> Bool) -> [a] -> Bool`
 *
 * Determines whether any element of the structure satisfies the predicate.
 */
export const any =
  <A> (f: (x: A) => boolean) => (xs: List<A>): boolean =>
    anyNode (f) (xs .head)

const anyNode =
  <A> (f: (x: A) => boolean) => (xs: MaybeNode<A>): boolean =>
    xs !== undefined
    ? f (value (xs)) || anyNode (f) (xs .next)
    : false

/**
 * `all :: (a -> Bool) -> [a] -> Bool`
 *
 * Determines whether all elements of the structure satisfy the predicate.
 */
export const all =
  <A> (f: (x: A) => boolean) => (xs: List<A>): boolean =>
    allNode (f) (xs .head)

const allNode =
  <A> (f: (x: A) => boolean) => (xs: MaybeNode<A>): boolean =>
    xs !== undefined
    ? f (value (xs)) && allNode (f) (xs .next)
    : true

// Searches

/**
 * `notElem :: Eq a => a -> [a] -> Bool`
 *
 * `notElem` is the negation of `elem`.
 */
export const notElem = <A> (x: A) => pipe (elem (x), not)

/**
 * `notElemF :: Eq a => a -> [a] -> Bool`
 *
 * `notElemF` is the negation of `elem_`.
 *
 * `notElemF` is the same as `notElem` but with arguments flipped.
 */
export const notElemF = <A> (xs: List<A>) => (x: A) => notElem (x) (xs)

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
    findNode (pred) (xs .head)

const findNode =
  <A> (pred: (x: A) => boolean) => (xs: MaybeNode<A>): Maybe<A> =>
    xs !== undefined
    ? pred (value (xs))
    ? Just (value (xs))
    : findNode (pred) (xs .next)
    : Nothing


// BASIC FUNCTIONS

/**
 * `notNull :: [a] -> Bool`
 *
 * A composition of `not` and `null`.
 */
export const notNull =
  pipe (fnull, not) as (xs: List<any>) => xs is NonEmptyList<any>


/**
 * `(++) :: [a] -> [a] -> [a]`
 *
 * Append two lists.
 */
export const append =
  <A> (xs1: List<A>) => (xs2: List<A>): List<A> =>
    _List (mappendNode (xs1 .head) (xs2 .head))

const mappendNode =
  <A> (xs1: MaybeNode<A>) => (xs2: MaybeNode<A>): MaybeNode<A> =>
    xs2 === undefined
    ? xs1
    : xs1 === undefined
    ? xs2
    : mappendNodeSafe (xs1) (xs2)

const mappendNodeSafe =
  <A> (xs1: Node<A>) => (xs2: Node<A>): Node<A> =>
    xs1 .next === undefined
    ? { value: value (xs1), next: xs2 }
    : { value: value (xs1), next: mappendNodeSafe (xs1 .next) (xs2) }

/**
 * `(:) :: [a] -> a -> [a]`
 *
 * Prepends an element to the list.
 */
export const cons =
  <A> (xs: List<A>) => (x: A): List<A> =>
    _List ({ value: x, next: xs .head })

/**
 * `head :: [a] -> a`
 *
 * Extract the first element of a list, which must be non-empty.
 */
export const head = <A> (xs: List<A>): A => {
  if (xs .head === undefined) {
    throw new TypeError (
      `head does only work on non-empty lists. If you do not know whether the`
      + `list is empty or not, use listToMaybe instead.`
    )
  }

  return xs .head .value
}

/**
 * `last :: [a] -> a`
 *
 * Extract the last element of a list, which must be finite and non-empty.
 */
export const last = <A> (xs: List<A>): A => {
  if (xs .head === undefined) {
    throw new TypeError (`last does only work on non-empty lists.`)
  }

  return lastNode (xs .head) .value
}

const lastNode =
  <A> (xs: Node<A>): Node<A> =>
    xs .next === undefined ? xs : lastNode (xs .next)

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

/**
 * `tail :: [a] -> [a]`
 *
 * Extract the elements after the head of a list, which must be non-empty.
 */
export const tail = <A> (xs: List<A>): List<A> => {
  if (xs .head === undefined) {
    throw new TypeError (`tail does only work on non-empty lists.`)
  }

  return _List (xs .head .next)
}

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

/**
 * `init :: [a] -> [a]`
 *
 * Return all the elements of a list except the last one. The list must be
 * non-empty.
 */
export const init = <A> (xs: List<A>): List<A> => {
  if (xs .head === undefined) {
    throw new TypeError (`init does only work on non-empty lists.`)
  }

  return _List (initNode (xs .head))
}

const initNode =
  <A> (xs: Node<A>): MaybeNode<A> =>
    xs .next === undefined
    ? undefined
    : toNodeNext (value (xs)) (initNode (xs .next))

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

/**
 * `uncons :: [a] -> Maybe (a, [a])`
 *
 * Decompose a list into its head and tail. If the list is empty, returns
 * `Nothing`. If the list is non-empty, returns `Just (x, xs)`, where `x` is
 * the head of the list and `xs` its tail.
 */
export const uncons =
  <A> (xs: List<A>): Maybe<Pair<A, List<A>>> =>
    fnull (xs) ? Nothing : Just (fromBinary (head (xs), tail (xs)))


// LIST TRANSFORMATIONS

/**
 * `map :: (a -> b) -> [a] -> [b]`
 *
 * `map f xs` is the list obtained by applying `f` to each element of `xs`.
 */
export const map = fmap

/**
 * `reverse :: [a] -> [a]`
 *
 * `reverse xs` returns the elements of `xs` in reverse order. `xs` must be
 * finite.
 */
export const reverse =
  <A> (xs: List<A>): List<A> =>
    foldl<A, List<A>> (cons) (empty) (xs)

/**
 * `intercalate :: [a] -> [[a]] -> [a]`
 *
 * `intercalate xs xss` is equivalent to `(concat (intersperse xs xss))`. It
 * inserts the list `xs` in between the lists in `xss` and concatenates the
 * result.
 */
export const intercalate =
  (separator: string) => (xs: List<number | string>): string =>
    intercalateNode (separator) (xs .head)

const intercalateNode =
  (separator: string) =>
  (xs: Node<number | string> | undefined): string =>
    xs !== undefined
    ? xs .next !== undefined
    ? value (xs) .toString () + separator + intercalateNode (separator)
                                                            (xs .next)
    : value (xs) .toString ()
    : ""


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
    _List (scanlNode (f) (initial) (xs .head))

const scanlNode =
  <A, B>
  (f: (acc: B) => (x: A) => B) =>
  (initial: B) =>
  (xs: MaybeNode<A>): MaybeNode<B> =>
    toNodeNext (initial) (scanlNodeIterator (f) (initial) (xs))

const scanlNodeIterator =
  <A, B>
  (f: (acc: B) => (x: A) => B) =>
  (acc: B) =>
  (xs: MaybeNode<A>): MaybeNode<B> => {
    if (xs !== undefined) {
      const x = f (acc) (value (xs))

      return toNodeNext (x) (scanlNodeIterator (f) (x) (xs .next))
    }

    return undefined
  }


// ACCUMULATING MAPS

/**
 * `mapAccumL :: (a -> b -> (a, c)) -> a -> [b] -> (a, [c])`
 *
 * The `mapAccumL` function behaves like a combination of `fmap` and `foldl`
 * it applies a function to each element of a structure, passing an
 * accumulating parameter from left to right, and returning a final value of
 * this accumulator together with the new structure.
 */
export const mapAccumL =
  <A, B, C>
  (f: (acc: A) => (x: B) => Pair<A, C>) =>
  (initial: A) =>
  (xs: List<B>): Pair<A, List<C>> => {
    const res = mapAccumLNode (f) (initial) (xs .head)

    return fromBinary (res [0], _List (res [1]))
  }

export const mapAccumLNode =
  <A, B, C>
  (f: (acc: A) => (x: B) => Pair<A, C>) =>
  (acc: A) =>
  (xs: MaybeNode<B>): [A, MaybeNode<C>] => {
    if (xs !== undefined) {
      const p = f (acc) (value (xs))

      const res = mapAccumLNode<A, B, C> (f) (fst (p)) (xs .next)

      return [res [0], toNodeNext (snd (p)) (res [1])]
    }

    return [acc, undefined]
  }


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
    _List (unfoldrNode (f) (undefined) (seedValue))

const unfoldrNode =
  <A, B>
  (f: (x: B) => Maybe<Pair<A, B>>) =>
  (acc: MaybeNode<A>) =>
  (x: B): MaybeNode<A> => {
    const result = f (x)

    if (isJust (result)) {
      const newValue = fromJust (result)

      return consNode (unfoldrNode (f) (acc) (snd (newValue)))
                      (toNode (fst (newValue)))
    }

    return acc
  }


// EXTRACTING SUBLISTS

/**
 * `take :: Int -> [a] -> [a]`
 *
 * `take n`, applied to a list `xs`, returns the prefix of `xs` of length `n`,
 * or `xs` itself if `n > length xs`.
 */
export const take =
  <A> (n: number) => (xs: List<A>): List<A> =>
    _List (takeNode<A> (n) (xs .head))

const takeNode =
  <A> (n: number) => (xs: MaybeNode<A>): MaybeNode<A> =>
    n <= 0 || xs === undefined
    ? undefined
    : toNodeNext (value (xs)) (takeNode<A> (n - 1) (xs .next))

/**
 * `drop :: Int -> [a] -> [a]`
 *
 * `drop n xs` returns the suffix of `xs` after the first `n` elements, or
 * `[]` if `n > length x`.
 */
export const drop =
  <A> (n: number) => (xs: List<A>): List<A> =>
    _List (dropNode<A> (n) (xs .head))

const dropNode =
  <A> (n: number) => (xs: MaybeNode<A>): MaybeNode<A> =>
    n <= 0
    ? xs
    : xs === undefined
    ? undefined
    : dropNode<A> (n - 1) (xs .next)

/**
 * `splitAt :: Int -> [a] -> ([a], [a])`
 *
 * `splitAt n xs` returns a tuple where first element is `xs` prefix of length
 * `n` and second element is the remainder of the list.
 */
export const splitAt =
  <A> (n: number) => (xs: List<A>): Pair<List<A>, List<A>> => {
    const res = splitAtNode<A> (n) (xs .head)

    return fromBinary (_List (res [0]), _List (res [1]))
  }

const splitAtNode =
  <A>
  (n: number) =>
  (xs: MaybeNode<A>): [MaybeNode<A>, MaybeNode<A>] => {
    if (n <= 0) {
      return [undefined, xs]
    }

    if (xs === undefined) {
      return [undefined, undefined]
    }

    const y = value (xs)

    const [a, b] = splitAtNode<A> (n - 1) (xs .next)

    return [consNode (a) (toNode (y)), b]
  }


// PREDICATES

/**
 * `isSubsequenceOf :: Eq a => [a] -> [a] -> Bool`
 *
 * The `isSubsequenceOf` function takes two lists and returns `True` if all the
 * elements of the first list occur, in order, in the second. The elements do
 * not have to occur consecutively.
 *
 * `isSubsequenceOf x y` is equivalent to `elem x (subsequences y)`.
 */
export const isSubsequenceOf =
  (x: string) => (y: string): boolean =>
    y .includes (x)


// SEARCHING BY EQUALITY

/**
 * `lookup :: Eq a => a -> [(a, b)] -> Maybe b`
 *
 * `lookup key assocs` looks up a key in an association list.
 */
export const lookup = <K, V> (key: K) => (assocs: List<Pair<K, V>>): Maybe<V> =>
  Maybe.fmap<Pair<K, V>, V> (snd)
                            (find<Pair<K, V>> (pipe (fst, equals (key)))
                                              (assocs))


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
    _List (filterNode (pred) (xs .head))

const filterNode =
  <A> (pred: (x: A) => boolean) => (xs: MaybeNode<A>): MaybeNode<A> =>
    xs !== undefined
    ? pred (value (xs))
    ? toNodeNext (value (xs)) (filterNode (pred) (xs .next))
    : filterNode (pred) (xs .next)
    : undefined

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
  (xs: List<A>): Pair<List<A>, List<A>> => {
    const [accepted, rejected] = partitionNode (pred) (xs .head)

    return fromBinary (_List (accepted), _List (rejected))
  }

const partitionNode =
  <A>
  (pred: (value: A) => boolean) =>
  (xs: MaybeNode<A>): [MaybeNode<A>, MaybeNode<A>]  => {
    if (xs === undefined) {
      return [undefined, undefined]
    }

    const x = value (xs)
    const next = xs .next

    const [accepted, rejected] = partitionNode (pred) (next)

    return pred (x)
      ? [consNode (accepted) (toNode (x)), rejected]
      : [accepted, consNode (rejected) (toNode (x))]
  }


// INDEXING LISTS

/**
 * `(!!) :: [a] -> Int -> Maybe a`
 *
 * List index (subscript) operator, starting from 0. If the index is invalid,
 * returns `Nothing`, otherwise `Just a`.
 */
export const subscript =
  <A> (xs: List<A>) => (index: number): Maybe<A> =>
    subscriptNode (xs .head) (index)

const subscriptNode =
  <A> (xs: MaybeNode<A>) => (index: number): Maybe<A> =>
    xs === undefined || index < 0
    ? Nothing
    : index > 0
    ? subscriptNode (xs .next) (index - 1)
    : Just (value (xs))

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

/**
 * `elemIndex :: Eq a => a -> [a] -> Maybe Int`
 *
 * The `elemIndex` function returns the index of the first element in the
 * given list which is equal (by `==`) to the query element, or `Nothing` if
 * there is no such element.
 */
export const elemIndex =
  <A> (x: A) => (xs: List<A>): Maybe<number> =>
    elemIndexNode<A> (x) (0) (xs .head)

const elemIndexNode =
  <A> (x: A) => (index: number) => (xs: MaybeNode<A>): Maybe<number> =>
    xs === undefined
    ? Nothing
    : equals (x) (value (xs))
    ? Just (index)
    : elemIndexNode (x) (index + 1) (xs .next)

/**
 * `elemIndices :: Eq a => a -> [a] -> [Int]`
 *
 * The `elemIndices` function extends `elemIndex`, by returning the indices of
 * all elements equal to the query element, in ascending order.
 */
export const elemIndices =
  <A> (x: A) => (xs: List<A>): List<number> =>
    _List (elemIndicesNode (x) (0) (xs .head))

const elemIndicesNode =
  <A> (x: A) => (index: number) => (xs: MaybeNode<A>): MaybeNode<number> =>
    xs === undefined
    ? undefined
    : equals (x) (value (xs))
    ? toNodeNext (index) (elemIndicesNode (x) (index + 1) (xs .next))
    : elemIndicesNode (x) (index + 1) (xs .next)

/**
 * `findIndex :: (a -> Bool) -> [a] -> Maybe Int`
 *
 * The `findIndex` function takes a predicate and a list and returns the index
 * of the first element in the list satisfying the predicate, or `Nothing` if
 * there is no such element.
 */
export const findIndex =
  <A> (pred: (x: A) => boolean) => (xs: List<A>): Maybe<number> =>
    findIndexNode (pred) (0) (xs .head)

const findIndexNode =
  <A>
  (pred: (x: A) => boolean) =>
  (index: number) =>
  (xs: MaybeNode<A>): Maybe<number> =>
    xs === undefined
    ? Nothing
    : pred (value (xs))
    ? Just (index)
    : findIndexNode (pred) (index + 1) (xs .next)

/**
 * `findIndices :: (a -> Bool) -> [a] -> [Int]`
 *
 * The `findIndices` function extends `findIndex`, by returning the indices of
 * all elements satisfying the predicate, in ascending order.
 */
export const findIndices =
  <A> (pred: (x: A) => boolean) => (xs: List<A>): List<number> =>
    _List (findIndicesNode (pred) (0) (xs .head))

const findIndicesNode =
  <A>
  (pred: (x: A) => boolean) =>
  (index: number) =>
  (xs: MaybeNode<A>): MaybeNode<number> =>
    xs === undefined
    ? undefined
    : pred (value (xs))
    ? toNodeNext (index) (findIndicesNode (pred) (index + 1) (xs .next))
    : findIndicesNode (pred) (index + 1) (xs .next)


// ZIPPING AND UNZIPPING LISTS

/**
 * `zip :: [a] -> [b] -> [(a, b)]`
 *
 * `zip` takes two lists and returns a list of corresponding pairs. If one
 * input list is short, excess elements of the longer list are discarded.
 */
export const zip =
  <A, B> (xs1: List<A>) => (xs2: List<B>): List<Pair<A, B>> =>
    zipWith<A, B, Pair<A, B>> (fromBoth) (xs1) (xs2)

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
    imapMaybe<A, C> (index => e => Maybe.fmap (f (e)) (subscript (xs2) (index)))
                    (xs1)


// "SET" OPERATIONS

/**
 * `delete :: Eq a => a -> [a] -> [a]`
 *
 * `delete x` removes the first occurrence of `x` from its list argument.
 */
export const sdelete =
  <A> (x: A) => (xs: List<A>): List<A> =>
    _List (deleteNode (x) (xs .head))

const deleteNode = <A> (x: A) => (xs: MaybeNode<A>): MaybeNode<A> =>
  xs === undefined
  ? undefined
  : equals (x) (value (xs))
  ? xs .next
  : toNodeNext (value (xs)) (deleteNode (x) (xs .next))


// ORDERED LISTS

/**
 * `sortBy :: (a -> a -> Ordering) -> [a] -> [a]`
 *
 * The `sortBy` function is the non-overloaded version of `sort`.
 */
export const sortBy =
  <A> (f: (a: A) => (b: A) => Ordering) => (xs: List<A>): List<A> =>
    _List (sortByNodeMergeSort (f) (xs .head))

const sortByNodeMergeSort =
  <A>
  (f: (a: A) => (b: A) => Ordering) =>
  (h: MaybeNode<A>): MaybeNode<A> => {
    // Base case: if head is undefined
    if (h === undefined || h .next === undefined) {
      return h
    }

    // get the middle of the list
    const middle = sortByNodeGetMiddle (h)!
    const nextofmiddle = middle .next

    // set the next of middle node to undefined
    // @ts-ignore
    middle .next = undefined

    // Apply mergeSort on left list
    const left = sortByNodeMergeSort (f) (h)

    // Apply mergeSort on right list
    const right = sortByNodeMergeSort (f) (nextofmiddle)

    // Merge the left and right lists
    return sortByNodeSortedMerge (f) (left, right)
  }

const sortByNodeSortedMerge =
  <A>
  (f: (a: A) => (b: A) => Ordering) =>
  (a: MaybeNode<A>, b: MaybeNode<A>): MaybeNode<A> => {
    /* Base cases */
    if (a === undefined) {
      return b
    }

    if (b === undefined) {
      return a
    }

    /* Pick either a or b, and recur */
    return isLTorEQ (f (value (a)) (value (b)))
      ? toNodeNext (value (a)) (sortByNodeSortedMerge (f) (a .next, b))
      : toNodeNext (value (b)) (sortByNodeSortedMerge (f) (a, b .next))
  }

/**
 * Utility function to get the middle of the linked list
 */
const sortByNodeGetMiddle = <A> (h: MaybeNode<A>): MaybeNode<A> => {
  //Base case
  if (h === undefined) {
    return h
  }

  let fastptr: MaybeNode<A> = h .next
  let slowptr: Node<A> = h

  // Move fastptr by two and slowptr by one
  // Finally slowptr will point to middle node
  while (fastptr !== undefined)
  {
      fastptr = fastptr .next

      if (fastptr !== undefined)
      {
          slowptr = slowptr .next!
          fastptr = fastptr .next
      }
  }

  return slowptr
}


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
  imap<A, Pair<number, A>> (fromBoth) (xs)

/**
 * `deleteAt :: Int -> [a] -> [a]`
 *
 * `deleteAt` deletes the element at an index.
 *
 * If the index is negative or exceeds list length, the original list will be
 * returned.
 */
export const deleteAt =
  <A> (index: number) => (xs: List<A>): List<A> =>
    _List (deleteAtNode<A> (index) (xs .head))

const deleteAtNode =
  <A> (index: number) => (xs: MaybeNode<A>): MaybeNode<A> =>
    index < 0
    ? xs
    : xs === undefined
    ? undefined
    : index === 0
    ? xs .next
    : toNodeNext (value (xs)) (deleteAtNode<A> (index - 1) (xs .next))

/**
 * `setAt :: Int -> a -> [a] -> [a]`
 *
 * `setAt` sets the element at the index.
 *
 * If the index is negative or exceeds list length, the original list will be
 * returned.
 */
export const setAt =
  <A> (index: number) => (x: A) => (xs: List<A>): List<A> =>
    _List (setAtNode<A> (index) (x) (xs .head))

const setAtNode =
  <A> (index: number) => (x: A) => (xs: MaybeNode<A>): MaybeNode<A> =>
    index < 0
    ? xs
    : xs === undefined
    ? undefined
    : index === 0
    ? toNodeNext (x) (xs .next)
    : toNodeNext (value (xs)) (setAtNode<A> (index - 1) (x) (xs .next))

/**
 * `modifyAt :: Int -> (a -> a) -> [a] -> [a]`
 *
 * `modifyAt` applies a function to the element at the index.
 *
 * If the index is negative or exceeds list length, the original list will be
 * returned.
 */
export const modifyAt =
  <A> (index: number) => (f: (old_value: A) => A) => (xs: List<A>): List<A> =>
    _List (modifyAtNode<A> (index) (f) (xs .head))

const modifyAtNode =
  <A>
  (index: number) =>
  (f: (old_value: A) => A) =>
  (xs: MaybeNode<A>): MaybeNode<A> =>
    index < 0
    ? xs
    : xs === undefined
    ? undefined
    : index === 0
    ? toNodeNext (f (value (xs))) (xs .next)
    : toNodeNext (value (xs)) (modifyAtNode<A> (index - 1) (f) (xs .next))

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
  <A>
  (index: number) =>
  (f: (old_value: A) => Maybe<A>) =>
  (xs: List<A>): List<A> =>
    _List (updateAtNode<A> (index) (f) (xs .head))

const updateAtNode =
  <A>
  (index: number) =>
  (f: (old_value: A) => Maybe<A>) =>
  (xs: MaybeNode<A>): MaybeNode<A> =>
    index < 0
    ? xs
    : xs === undefined
    ? undefined
    : index === 0
    // @ts-ignore
    ? maybe<A, MaybeNode<A>> (xs .next)
                             ((x: A) => toNodeNext (x) (xs .next))
                             (f (value (xs)))
    : toNodeNext (value (xs)) (updateAtNode<A> (index - 1) (f) (xs .next))

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
  <A> (index: number) => (x: A) => (xs: List<A>): List<A> =>
    _List (insertAtNode<A> (index) (x) (xs .head))

const insertAtNode =
  <A> (index: number) => (x: A) => (xs: MaybeNode<A>): MaybeNode<A> =>
    index < 0
    ? xs
    : xs === undefined
    ? undefined
    : index === 0
    ? toNodeNext (x) (xs)
    : toNodeNext (value (xs)) (insertAtNode<A> (index - 1) (x) (xs .next))

// Maps

/**
 * `imap :: (Int -> a -> b) -> [a] -> [b]`
 *
 * `imap f xs` is the list obtained by applying `f` to each element of `xs`.
 */
export const imap =
  <A, B> (f: (index: number) => (x: A) => B) => (xs: List<A>): List<B> =>
    _List (imapNode (f) (0) (xs .head))

const imapNode =
  <A, B>
  (f: (index: number) => (x: A) => B) =>
  (index: number) =>
  (xs: MaybeNode<A>): MaybeNode<B> =>
    xs !== undefined
    ? toNodeNext (f (index) (value (xs))) (imapNode (f) (index + 1) (xs .next))
    : undefined

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
    ifoldrNode (f) (xs .head) (0) (initial)

const ifoldrNode =
  <A, B>
  (f: (index: number) => (current: A) => (acc: B) => B) =>
  (xs: MaybeNode<A>) =>
  (index: number) =>
  (acc: B): B =>
    xs !== undefined
    ? f (index) (value (xs)) (ifoldrNode (f) (xs .next) (index + 1) (acc))
    : acc

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
    ifoldlNode (f) (xs .head) (0) (initial)

const ifoldlNode =
  <A, B>
  (f: (acc: B) => (index: number) => (current: A) => B) =>
  (xs: MaybeNode<A>) =>
  (index: number) =>
  (acc: B): B =>
    xs !== undefined
    ? ifoldlNode (f) (xs .next) (index + 1) (f (acc) (index) (value (xs)))
    : acc

/**
 * `iall :: Foldable t => (Int -> a -> Bool) -> t a -> Bool`
 *
 * Determines whether all elements of the structure satisfy the predicate.
 */
export const iall =
  <A> (f: (index: number) => (x: A) => boolean) => (xs: List<A>): boolean =>
    iallNode (f) (0) (xs .head)

const iallNode =
  <A>
  (f: (index: number) => (x: A) => boolean) =>
  (index: number) =>
  (xs: MaybeNode<A>): boolean =>
    xs !== undefined
    ? f (index) (value (xs)) && iallNode (f) (index + 1) (xs .next)
    : true

/**
 * `iany :: Foldable t => (Int -> a -> Bool) -> t a -> Bool`
 *
 * Determines whether any element of the structure satisfies the predicate.
 */
export const iany =
  <A> (f: (index: number) => (x: A) => boolean) => (xs: List<A>): boolean =>
    ianyNode (f) (0) (xs .head)

const ianyNode =
  <A>
  (f: (index: number) => (x: A) => boolean) =>
  (index: number) =>
  (xs: MaybeNode<A>): boolean =>
    xs !== undefined
    ? f (index) (value (xs)) || ianyNode (f) (index + 1) (xs .next)
    : false

/**
 * `iconcatMap :: (Int -> a -> [b]) -> [a] -> [b]`
 */
export const iconcatMap =
  <A, B> (f: (index: number) => (x: A) => List<B>) => (xs: List<A>): List<B> =>
    _List (iconcatMapNode (f) (0) (xs .head))

const iconcatMapNode =
  <A, B>
  (f: (index: number) => (x: A) => List<B>) =>
  (index: number) =>
  (xs: MaybeNode<A>): MaybeNode<B> =>
    xs !== undefined
    ? mappendNode (f (index) (value (xs)) .head)
                  (iconcatMapNode (f) (index + 1) (xs .next))
    : undefined

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
    _List (ifilterNode (pred) (0) (xs .head))

const ifilterNode =
  <A>
  (pred: (index: number) => (x: A) => boolean) =>
  (index: number) =>
  (xs: MaybeNode<A>): MaybeNode<A> =>
    xs !== undefined
    ? pred (index) (value (xs))
    ? toNodeNext (value (xs)) (ifilterNode (pred) (index + 1) (xs .next))
    : ifilterNode (pred) (index + 1) (xs .next)
    : undefined

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
  (xs: List<A>): Pair<List<A>, List<A>> => {
    const [accepted, rejected] = ipartitionNode (pred) (0) (xs .head)

    return fromBinary (_List (accepted), _List (rejected))
  }

const ipartitionNode =
  <A>
  (pred: (index: number) => (value: A) => boolean) =>
  (index: number) =>
  (xs: MaybeNode<A>): [MaybeNode<A>, MaybeNode<A>]  => {
    if (xs === undefined) {
      return [undefined, undefined]
    }

    const x = value (xs)
    const next = xs .next

    const [accepted, rejected] = ipartitionNode (pred) (index + 1) (next)

    return pred (index) (x)
      ? [consNode (accepted) (toNode (x)), rejected]
      : [accepted, consNode (rejected) (toNode (x))]
  }

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
    ifindNode (pred) (0) (xs .head)

const ifindNode =
  <A>
  (pred: (index: number) => (x: A) => boolean) =>
  (index: number) =>
  (xs: MaybeNode<A>): Maybe<A> =>
    xs !== undefined
    ? pred (index) (value (xs))
    ? Just (value (xs))
    : ifindNode (pred) (index + 1) (xs .next)
    : Nothing

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
    ifindIndexNode (pred) (0) (xs .head)

const ifindIndexNode =
  <A>
  (pred: (index: number) => (x: A) => boolean) =>
  (index: number) =>
  (xs: MaybeNode<A>): Maybe<number> =>
    xs === undefined
    ? Nothing
    : pred (index) (value (xs))
    ? Just (index)
    : ifindIndexNode (pred) (index + 1) (xs .next)

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
    _List (ifindIndicesNode (pred) (0) (xs .head))

const ifindIndicesNode =
  <A>
  (pred: (index: number) => (x: A) => boolean) =>
  (index: number) =>
  (xs: MaybeNode<A>): MaybeNode<number> =>
    xs === undefined
    ? undefined
    : pred (index) (value (xs))
    ? toNodeNext (index) (ifindIndicesNode (pred) (index + 1) (xs .next))
    : ifindIndicesNode (pred) (index + 1) (xs .next)


// LIST.EXTRA

// String operations

/**
 * `lower :: String -> String`
 *
 * Convert a string to lower case.
 */
export const lower = (str: string) => str .toLowerCase ()


// Basics

/**
 * `cons :: a -> [a] -> [a]`
 *
 * Prepends an element to the list.
 *
 * Flipped version of `(:)`.
 */
export const consF = <A> (x: A) => (xs: List<A>): List<A> => cons (xs) (x)

/**
 * `snoc :: [a] -> a -> [a]`
 *
 * Append an element to the end of a list, takes *O(n)* time.
 */
export const snoc =
  <A> (xs: List<A>) => (x: A): List<A> =>
    _List (snocNode (xs .head) (x))

const snocNode =
  <A> (xs: MaybeNode<A>) => (x: A): MaybeNode<A> =>
    xs === undefined
    ? toNode (x)
    : snocNodeSafe (xs) (x)

const snocNodeSafe =
  <A> (xs: Node<A>) => (x: A): Node<A> =>
    xs .next === undefined
    ? toNodeNext (value (xs)) (toNode (x))
    : toNodeNext (value (xs)) (snocNodeSafe (xs .next) (x))


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

          return res > snd (acc) ? Pair.fromBinary (Just (x), res) : acc
        })
        (Pair.fromBinary (Nothing, -Infinity)),
      fst
    )

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

          return res < snd (acc) ? Pair.fromBinary (Just (x), res) : acc
        })
        (Pair.fromBinary (Nothing, Infinity)),
      fst
    )

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
    firstJustNode (pred) (xs .head)

const firstJustNode =
  <A, B> (pred: (x: A) => Maybe<B>) => (xs: MaybeNode<A>): Maybe<B> => {
    if (xs === undefined) {
      return Nothing
    }

    const res = pred (value (xs))

    if (isJust (res)) {
      return res
    }

    return firstJustNode (pred) (xs .next)
  }

// OWN METHODS

/**
 * `unsafeIndex :: [a] -> Int -> a`
 *
 * Unsafe list index operator, starting from 0. If the index is invalid this
 * function throws an error, otherwise returns `a`.
 */
export const unsafeIndex =
  <A> (xs: List<A>) => (index: number): A =>
    unsafeIndexNode (xs .head) (xs .head) (index)

const unsafeIndexNode =
  <A> (h: MaybeNode<A>) => (xs: MaybeNode<A>) => (index: number): A => {
    if (xs === undefined && index >= 0) {
      throw new RangeError (
        `List.unsafeIndex: Invalid index provided to index_. The list has a `
        + `length of ${lengthNode (h)}, but an index of ${index} was provided.`
      )
    }

    if (index < 0) {
      throw new Error (
        `List.unsafeIndex: Negative index provided to `
        + `unsafeIndexNode (${index}).`
      )
    }

    if (index === 0) {
      return value (xs as Node<A>)
    }

    return unsafeIndexNode (h) ((xs as Node<A>) .next) (index - 1)
  }

/**
 * Converts a `List` to a native Array.
 */
export const toArray = <A> (xs: List<A>): A[] => listToArrayNode (xs .head)

const listToArrayNode =
  <A> (xs: MaybeNode<A>): A[] =>
    xs === undefined
    ? []
    : [value (xs), ...listToArrayNode (xs .next)]

/**
 * Checks if the given value is a `List`.
 * @param x The value to test.
 */
export const isList =
  (x: any): x is List<any> =>
    Object.getPrototypeOf (x) === ListPrototype

/**
 * Returns the sum of all elements of the list that match the provided
 * predicate.
 */
export const countWith =
  <A> (pred: (x: A) => boolean) => pipe (filter (pred), length)

/**
 * The largest element of a non-empty structure. The minimum value returned is
 * `0`.
 */
export const maximumNonNegative = pipe (consF (0), maximum)


// MODULE HELPER FUNCTIONS

const buildNodexFromArrayWithLastIndex =
  <A>
  (arr: ReadonlyArray<A>) =>
  (index: number) =>
  (h: Node<A> | undefined): Node<A> | undefined =>
    index < 0
    ? h
    : h !== undefined
    ? buildNodexFromArrayWithLastIndex (arr)
                                       (index - 1)
                                       ({ value: arr[index], next: h })
    : buildNodexFromArrayWithLastIndex (arr)
                                       (index - 1)
                                       ({ value: arr[index] })

const toNode = <A> (x: A): Node<A> => ({ value: x })

const toNodeNext =
  <A> (x: A) => (nextNode: Node<A> | undefined): Node<A> =>
    ({ value: x, next: nextNode })

const value = <A> (x: Node<A>): A => x .value

const consNode =
  <A> (xs: Node<A> | undefined) => (x: Node<A>) =>
    toNodeNext (value (x)) (xs)


// NAMESPACED FUNCTIONS

export const List = {
  fromElements,
  fromArray,

  fmap,
  mapReplace,

  pure,
  ap,

  alt,
  altF,
  empty,
  guard,

  bind,
  bindF,
  then,
  kleisli,
  join,

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
  notElemF,
  find,

  append,
  cons,
  head,
  last,
  lastS,
  tail,
  tailS,
  init,
  initS,
  uncons,

  map,
  reverse,
  intercalate,

  scanl,

  mapAccumL,

  unfoldr,

  take,
  drop,
  splitAt,

  lookup,

  filter,
  partition,

  subscript,
  subscriptF,
  elemIndex,
  elemIndices,
  findIndex,
  findIndices,

  zip,
  zipWith,

  sdelete,

  sortBy,

  indexed,
  deleteAt,
  setAt,
  modifyAt,
  updateAt,
  insertAt,

  imap,

  ifoldr,
  ifoldl,
  iall,
  iany,
  iconcatMap,

  ifilter,
  ipartition,
  ifind,
  ifindIndex,
  ifindIndices,

  lower,
  consF,
  snoc,

  maximumOn,
  minimumOn,
  firstJust,

  unsafeIndex,
  toArray,
  isList,
  countWith,
  maximumNonNegative,
}


// TYPE HELPERS

export type ListI<A> = A extends List<infer AI> ? AI : never

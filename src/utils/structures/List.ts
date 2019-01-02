/**
 * @module List
 *
 * A list (`[a]`) is a simple flat data structure for values of the same type.
 *
 * @author Lukas Obermann
 */

import { pipe } from 'ramda';
import { add, max, min, multiply } from '../mathUtils';
import { not } from '../not';
import { equals } from './Eq';
import { cnst, ident } from './Function';
import { fromJust, fromNullable, imapMaybe, isJust, Just, Maybe, Nothing, Some } from './Maybe';
import { OrderedMap } from './OrderedMap';
import { fromBinary, fromBoth, fst, Pair, snd } from './Pair';
import { show } from './Show';


// CONSTRUCTOR

interface ListPrototype<A> {
  readonly isList: true
}

interface Node<A> {
  readonly value: A
  readonly next?: Node<A>
}

export interface List<A extends Some> extends ListPrototype<A> {
  readonly head?: Node<A>
  readonly prototype: ListPrototype<A>
}

export interface NonEmptyList<A extends Some> extends List<A> {
  readonly head: Node<A>
}

const ListPrototype: ListPrototype<Some> =
  Object.freeze<ListPrototype<Some>> ({
    isList: true,
  })

const _List =
  <A extends Some> (x: Node<A> | undefined): List<A> =>
    Object.create (ListPrototype, { head: { value: x, enumerable: true }})

/**
 * `fromArray :: Array a -> [a]`
 *
 * Creates a new `List` instance from the passed native `Array`.
 */
export const fromArray = <A extends Some> (xs: ReadonlyArray<A>): List<A> => {
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
export const fromElements =
  <A extends Some> (...values: A[]) =>
    fromArray (values)


// FUNCTOR

/**
 * `fmap :: (a -> b) -> [a] -> [b]`
 */
export const fmap =
  <A extends Some, B extends Some>
  (f: (value: A) => B) =>
  (xs: List<A>): List<B> =>
    _List (fmapNode (f) (xs .head))

const fmapNode =
  <A extends Some, B extends Some>
  (f: (value: A) => B) =>
  (xs: Node<A> | undefined): Node<B> | undefined =>
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
export const mapReplace =
  <A extends Some, B extends Some> (x: A) =>
    fmap<B, A> (cnst (x))


// APPLICATIVE

/**
 * `pure :: a -> [a]`
 *
 * Lift a value.
 */
export const pure = <A extends Some> (x: A) => _List (toNode (x))

/**
 * `(<*>) :: [a -> b] -> [a] -> [b]`
 *
 * Sequential application.
 */
export const ap =
  <A extends Some, B extends Some>
  (fs: List<(x: A) => B>) =>
  (xs: List<A>): List<B> =>
    _List (apNode<A, B> (fs .head) (xs .head))

const apNode =
  <A extends Some, B extends Some>
  (fs: Node<(x: A) => B> | undefined) =>
  (xs: Node<A> | undefined): Node<B> | undefined =>
    fs !== undefined && xs !== undefined
    ? mapApNode (value (fs)) (apNode (fs .next) (xs)) (xs)
    : undefined

const mapApNode =
  <A extends Some, B extends Some>
  (f: (x: A) => B) =>
  (xs: Node<B> | undefined) =>
  (x: Node<A> | undefined): Node<B> | undefined =>
    x !== undefined
    ? consNode (mapApNode (f) (xs) (x . next)) (toNode (f (value (x))))
    : x


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
  <A extends Some> (xs1: List<A>) => (xs2: List<A>): List<A> =>
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
  <A extends Some, B extends Some>
  (xs: List<A>) =>
  (f: (value: A) => List<B>): List<B> =>
    _List (bindNode<A, B> (xs .head) (f))

const bindNode =
  <A extends Some, B extends Some>
  (xs: Node<A> | undefined) =>
  (f: (value: A) => List<B>): Node<B> | undefined =>
    xs !== undefined
    ? mappendNode<B> (f (value (xs)) .head) (bindNode<A, B> (xs .next) (f))
    : undefined

/**
 * `(=<<) :: (a -> [b]) -> [a] -> [b]`
 */
export const bindF =
  <A extends Some, B extends Some>
  (f: (value: A) => List<B>) =>
  (xs: List<A>): List<B> =>
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
  <A extends Some> (xs1: List<any>) => (xs2: List<A>): List<A> =>
    bind<any, A> (xs1) (_ => xs2)


/**
 * `return :: a -> [a]`
 *
 * Inject a value into a list.
 */
export const mreturn = <A extends Some> (x: A) => _List (toNode (x))

/**
 * `(>=>) :: (a -> [b]) -> (b -> [c]) -> a -> [c]`
 *
 * Left-to-right Kleisli composition of monads.
 */
export const kleisli =
  <A extends Some, B extends Some, C extends Some>
  (f1: (x: A) => List<B>) =>
  (f2: (x: B) => List<C>) =>
    pipe (f1, bindF (f2))

/**
 * `join :: [[a]] -> [a]`
 *
 * The `join` function is the conventional monad join operator. It is used to
 * remove one level of monadic structure, projecting its bound argument into the
 * outer level.
 */
export const join =
  <A extends Some>(xs: List<List<A>>): List<A> =>
    bind<List<A>, A> (xs) (ident)


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
  <A extends Some, B extends Some>
  (f: (current: A) => (acc: B) => B) =>
  (initial: B) =>
  (xs: List<A>): B =>
    foldrNode (f) (xs .head) (initial)

const foldrNode =
  <A extends Some, B extends Some>
  (f: (current: A) => (acc: B) => B) =>
  (n: Node<A> | undefined) =>
  (acc: B): B =>
    n !== undefined
    ? f (value (n)) (foldrNode (f) (n .next) (acc))
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
  <A extends Some, B extends Some>
  (f: (acc: B) => (current: A) => B) =>
  (initial: B) =>
  (xs: List<A>): B =>
    foldlNode (f) (xs .head) (initial)

const foldlNode =
  <A extends Some, B extends Some>
  (f: (acc: B) => (current: A) => B) =>
  (n: Node<A> | undefined) =>
  (acc: B): B =>
    n !== undefined
    ? foldlNode (f) (n .next) (f (acc) (value (n)))
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
  <A extends Some>
  (f: (current: A) => (acc: A) => A) =>
  (xs: List<A>): A => {
    if (xs .head !== undefined) {
      return foldr1Node (f) (xs .head)
    }

    throw new TypeError ('Cannot apply foldr1 to an empty list.')
  }

const foldr1Node =
  <A extends Some>
  (f: (current: A) => (acc: A) => A) =>
  (n: Node<A>): A =>
    n .next !== undefined && n .next .next !== undefined
    ? f (value (n)) (foldr1Node (f) (n .next))
    : value (n)

/**
 * `foldl1 :: (a -> a -> a) -> [a] -> a`
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
    if (xs .head !== undefined) {
      return foldl1Node (f) (xs .head .next) (value (xs .head))
    }

    throw new TypeError ('Cannot apply foldl1 to an empty list.')
  }

const foldl1Node =
  <A extends Some>
  (f: (acc: A) => (current: A) => A) =>
  (n: Node<A> | undefined) =>
  (acc: A): A =>
    n === undefined ? acc : foldl1Node (f) (n .next) (f (acc) (value (n)))

/**
 * `toList :: [a] -> [a]`
 *
 * List of elements of a structure, from left to right.
 */
export const toList = <A extends Some>(xs: List<A>): List<A> => xs

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
  (node: Node<any> | undefined) =>
  (acc: number): number =>
    node === undefined ? acc : lengthNode (node .next) (acc + 1)

/**
 * `elem :: Eq a => a -> [a] -> Bool`
 *
 * Does the element occur in the structure?
 */
export const elem =
  <A extends Some>(x: A) => (xs: List<A>): boolean =>
    elemNode (x) (xs .head)

const elemNode =
  <A extends Some> (x: A) => (node: Node<A> | undefined): boolean =>
    node === undefined
    ? false
    : equals (x) (value (node)) || elemNode (x) (node .next)

/**
 * `elem_ :: Eq a => [a] -> a -> Bool`
 *
 * Does the element occur in the structure?
 *
 * Flipped version of `elem` but with arguments switched.
 */
export const elem_ =
  <A extends Some> (xs: List<A>) => (e: A): boolean =>
    elem (e) (xs)

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
export const maximum = foldl (max) (-Infinity)

/**
 * `minimum :: Ord a => [a] -> a`
 *
 * The least element of a non-empty structure.
 */
export const minimum = foldl (min) (Infinity)

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
  (n: Node<boolean> | undefined): boolean =>
    n !== undefined
    ? value (n) && andNode (n .next)
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
  (n: Node<boolean> | undefined): boolean =>
    n !== undefined
    ? value (n) || orNode (n .next)
    : false

/**
 * `any :: (a -> Bool) -> [a] -> Bool`
 *
 * Determines whether any element of the structure satisfies the predicate.
 */
export const any =
  <A extends Some> (f: (x: A) => boolean) => (xs: List<A>): boolean =>
    anyNode (f) (xs .head)

const anyNode =
  <A extends Some>
  (f: (x: A) => boolean) =>
  (n: Node<A> | undefined): boolean =>
    n !== undefined
    ? f (value (n)) || anyNode (f) (n .next)
    : false

/**
 * `all :: (a -> Bool) -> [a] -> Bool`
 *
 * Determines whether all elements of the structure satisfy the predicate.
 */
export const all =
  <A extends Some>(f: (x: A) => boolean) => (xs: List<A>): boolean =>
    allNode (f) (xs .head)

const allNode =
  <A extends Some>
  (f: (x: A) => boolean) =>
  (n: Node<A> | undefined): boolean =>
    n !== undefined
    ? f (value (n)) && allNode (f) (n .next)
    : true

// Searches

/**
 * `notElem :: Eq a => a -> [a] -> Bool`
 *
 * `notElem` is the negation of `elem`.
 */
export const notElem = <A> (e: A) => pipe (elem (e), not)

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
  <A extends Some>
  (pred: (x: A) => boolean) =>
  (n: Node<A> | undefined): Maybe<A> =>
    n !== undefined
    ? pred (value (n))
    ? Just (value (n))
    : findNode (pred) (n .next)
    : Nothing


// BASIC FUNCTIONS

/**
 * `notNull :: [a] -> Bool`
 *
 * A composition of `not` and `null`.
 */
export const notNull = pipe (fnull, not)


/**
 * `(++) :: [a] -> [a] -> [a]`
 *
 * Append two lists.
 */
export const append =
  <A extends Some> (xs1: List<A>) => (xs2: List<A>): List<A> =>
    _List (mappendNode (xs1 .head) (xs2 .head))

const mappendNode =
  <A extends Some>
  (xs1: Node<A> | undefined) =>
  (xs2: Node<A> | undefined): Node<A> | undefined =>
    xs2 === undefined
    ? xs1
    : xs1 === undefined
    ? xs2
    : mappendNodeSafe (xs1) (xs2)

const mappendNodeSafe =
  <A extends Some> (xs1: Node<A>) => (xs2: Node<A>): Node<A> =>
    xs1 .next === undefined
    ? { value: value (xs1), next: xs2 }
    : mappendNodeSafe (xs1 .next) (xs2)

/**
 * `(:) :: [a] -> a -> [a]`
 *
 * Prepends an element to the list.
 */
export const cons =
  <A extends Some> (xs: List<A>) => (x: A): List<A> =>
    _List ({ value: x, next: xs .head })

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
  <A extends Some> (xs: List<A>) => (x: A): List<A> =>
    _List (snocNode (xs .head) (x))

const snocNode =
  <A extends Some>
  (xs: Node<A> | undefined) =>
  (x: A): Node<A> | undefined =>
    xs === undefined
    ? toNode (x)
    : snocNodeSafe (xs) (x)

const snocNodeSafe =
  <A extends Some> (xs: Node<A>) => (x: A): Node<A> =>
    xs .next === undefined
    ? { value: value (xs), next: toNode (x) }
    : snocNodeSafe (xs .next) (x)

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
  <A> (node: Node<A>): Node<A> =>
    node .next === undefined ? node : lastNode (node .next)

/**
 * `lastF :: [a] -> Maybe a`
 *
 * Extract the last element of a list, which must be finite. If the list is
 * empty, it returns `Nothing`. If the list is not empty, it returns the last
 * element wrapped in a `Just`.
 *
 * A safe version of `List.last`.
 */
export const lastF = <A> (xs: List<A>): Maybe<A> => fnull (xs) ? Nothing : Just (last (xs))

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

  return _List (_init (xs .head))
}

const _init =
  <A> (node: Node<A>): Node<A> =>
    node .next === undefined
    ? node
    : node .next .next === undefined
    ? node
    : node .next

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
  <A extends Some> (xs: List<A>): List<A> =>
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
  (n: Node<number | string> | undefined): string =>
    n !== undefined
    ? n .next !== undefined
    ? value (n) .toString () + separator + intercalateNode (separator) (n .next)
    : value (n) .toString ()
    : ''


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
  <A extends Some, B extends Some>
  (f: (acc: B) => (current: A) => B) =>
  (initial: B) =>
  (xs: List<A>): List<B> =>
    _List (scanlNode (f) (initial) (xs .head))

const scanlNode =
  <A extends Some, B extends Some>
  (f: (acc: B) => (current: A) => B) =>
  (initial: B) =>
  (xs: Node<A> | undefined): Node<B> | undefined =>
    toNodeNext (initial) (scanlNodeIterator (f) (initial) (xs))

const scanlNodeIterator =
  <A extends Some, B extends Some>
  (f: (acc: B) => (current: A) => B) =>
  (acc: B) =>
  (xs: Node<A> | undefined): Node<B> | undefined => {
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
  <A extends Some, B extends Some, C extends Some>
  (f: (acc: A) => (current: B) => Pair<A, C>) =>
  (initial: A) =>
  (xs: List<B>): Pair<A, List<C>> => {
    const res = mapAccumLNode (f) (initial) (xs .head)

    return fromBinary (res [0], _List (res [1]))
  }

export const mapAccumLNode =
  <A extends Some, B extends Some, C extends Some>
  (f: (acc: A) => (current: B) => Pair<A, C>) =>
  (acc: A) =>
  (xs: Node<B> | undefined): [A, Node<C> | undefined] => {
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
  <A extends Some, B extends Some>
  (f: (x: B) => Maybe<Pair<A, B>>) =>
  (seedValue: B): List<A> =>
    _List (unfoldrNode (f) (undefined) (seedValue))

const unfoldrNode =
  <A extends Some, B extends Some>
  (f: (x: B) => Maybe<Pair<A, B>>) =>
  (acc: Node<A> | undefined) =>
  (x: B): Node<A> | undefined => {
    const result = f (x)

    if (isJust (result)) {
      const newValue = fromJust (result)

      return consNode (unfoldrNode (f) (acc) (snd (newValue)))
                      (toNode (fst (newValue)))
    }

    return acc
  }


// EXTRACTING SUBLIST

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
  <A> (n: number) => (xs: Node<A> | undefined): Node<A> | undefined =>
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
  <A> (n: number) => (xs: Node<A> | undefined): Node<A> | undefined =>
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
  (xs: Node<A> | undefined): [Node<A> | undefined, Node<A> | undefined] => {
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


// SEARCHING BY EQUALITY

/**
 * `lookup :: Eq a => a -> [(a, b)] -> Maybe b`
 *
 * `lookup key assocs` looks up a key in an association list.
 */
export const lookup = <K, V> (key: K) => (assocs: List<Pair<K, V>>): Maybe<V> =>
  Maybe.fmap<Pair<K, V>, V> (snd)
                            (find<Pair<K, V>> (e => fst (e) === key) (assocs))


// SEARCHING WITH A PREDICATE

interface Filter {
  /**
   * `filter :: (a -> Bool) -> [a] -> [a]`
   *
   * `filter`, applied to a predicate and a list, returns the list of those
   * elements that satisfy the predicate.
   */
  <A, A1 extends A> (pred: (x: A) => x is A1): (list: List<A>) => List<A1>
  /**
   * `filter :: (a -> Bool) -> [a] -> [a]`
   *
   * `filter`, applied to a predicate and a list, returns the list of those
   * elements that satisfy the predicate.
   */
  <A> (pred: (x: A) => boolean): (list: List<A>) => List<A>
}

/**
 * `filter :: (a -> Bool) -> [a] -> [a]`
 *
 * `filter`, applied to a predicate and a list, returns the list of those
 * elements that satisfy the predicate.
 */
export const filter: Filter =
  <A> (pred: (x: A) => boolean) => (xs: List<A>): List<A> =>
    fromArray (xs .value .filter (pred))

/**
 * `partition :: (a -> Bool) -> [a] -> ([a], [a])`
 *
 * The `partition` function takes a predicate a list and returns the pair of
 * lists of elements which do and do not satisfy the predicate, respectively.
 *
```
>>> partition (`elem` "aeiou") "Hello World!"
("eoo","Hll Wrld!")
```
  */
export const partition =
  <A>
  (f: (value: A) => boolean) =>
  (xs: List<A>): Pair<List<A>, List<A>> => {
    const pair = xs .value .reduceRight<[List<A>, List<A>]> (
      ([included, excluded], value) => f (value)
        ? [cons (included) (value), excluded]
        : [included, cons (excluded) (value)],
      [empty, empty]
    )

    return fromBoth<List<A>, List<A>> (pair[0]) (pair[1])
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
  Maybe.fmap<Node<A>, A> (value)
                         (fromNullable (_subscript (xs .head) (index)))

const _subscript =
<A> (node: Node<A> | undefined) => (index: number): Node<A> | undefined =>
  node === undefined
  ? undefined
  : index > 0
  ? _subscript (node .next) (index - 1)
  : node

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
  subscript (xs) (index)

/**
 * `elemIndex :: Eq a => a -> [a] -> Maybe Int`
 *
 * The `elemIndex` function returns the index of the first element in the
 * given list which is equal (by `==`) to the query element, or `Nothing` if
 * there is no such element.
 */
export const elemIndex =
  <A> (x: A) => (xs: List<A>): Maybe<number> => {
    const res = xs .value .findIndex (equals (x))

    return res > -1 ? Just (res) : Nothing
  }

/**
 * `elemIndices :: Eq a => a -> [a] -> [Int]`
 *
 * The `elemIndices` function extends `elemIndex`, by returning the indices of
 * all elements equal to the query element, in ascending order.
 */
export const elemIndices =
  <A> (x: A) => (xs: List<A>): List<number> =>
    fromArray (
      xs .value .reduce<number[]> (
        (acc, e, index) => equals (e) (x) ? [...acc, index] : acc,
        []
      )
    )

/**
 * `findIndex :: (a -> Bool) -> [a] -> Maybe Int`
 *
 * The `findIndex` function takes a predicate and a list and returns the index
 * of the first element in the list satisfying the predicate, or `Nothing` if
 * there is no such element.
 */
export const findIndex =
  <A> (pred: (x: A) => boolean) => (xs: List<A>): Maybe<number> => {
    const res = xs .value .findIndex (pred)

    return res > -1 ? Just (res) : Nothing
  }

/**
 * `findIndices :: (a -> Bool) -> [a] -> [Int]`
 *
 * The `findIndices` function extends `findIndex`, by returning the indices of
 * all elements satisfying the predicate, in ascending order.
 */
export const findIndices =
  <A> (pred: (x: A) => boolean) => (xs: List<A>): List<number> =>
    fromArray (
      xs .value .reduce<number[]> (
        (acc, e, index) => pred (e) ? [...acc, index] : acc,
        []
      )
    )


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
  (f: (value1: A) => (value2: B) => C) =>
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
export const sdelete = <T> (x: T) => (xs: List<T>): List<T> => {
  const index = xs .value .findIndex (e => e === x)

  return deleteAt<T> (index) (xs)
}


// ORDERED LISTS

/**
 * `sortBy :: (a -> a -> Ordering) -> [a] -> [a]`
 *
 * The `sortBy` function is the non-overloaded version of `sort`.
 */
export const sortBy =
  <T> (fn: (a: T) => (b: T) => number) => (xs: List<T>): List<T> =>
    fromArray ([...xs .value].sort ((a, b) => fn (a) (b)))


// LIST.INDEX

// Original functions

/**
 * `indexed :: [a] -> [(Int, a)]`
 *
 * `indexed` pairs each element with its index.
```hs
>>> indexed "hello"
[(0,'h'),(1,'e'),(2,'l'),(3,'l'),(4,'o')]
```
 */
export const indexed = <A> (xs: List<A>): List<Pair<number, A>> =>
  imap<A, Pair<number, A>> (index => x => fromBoth<number, A> (index) (x)) (xs)

/**
 * `deleteAt :: Int -> [a] -> [a]`
 *
 * `deleteAt` deletes the element at an index.
 *
 * If the index is negative or exceeds list length, the original list will be
 * returned.
 */
export const deleteAt =
  <T> (index: number) => (xs: List<T>): List<T> => {
    if (index > -1 && index < xs .value .length) {
      return fromElements (
        ...xs .value .slice (0, index),
        ...xs .value .slice (index + 1)
      )
    }

    return xs
  }

/**
 * `setAt :: Int -> a -> [a] -> [a]`
 *
 * `setAt` sets the element at the index.
 *
 * If the index is negative or exceeds list length, the original list will be
 * returned.
 */
export const setAt =
  <T> (index: number) => (value: T) => (xs: List<T>): List<T> => {
    if (index > -1 && index < xs .value .length) {
      return fromArray (xs .value .map ((e, i) => i === index ? value : e))
    }

    return xs
  }

/**
 * `modifyAt :: Int -> (a -> a) -> [a] -> [a]`
 *
 * `modifyAt` applies a function to the element at the index.
 *
 * If the index is negative or exceeds list length, the original list will be
 * returned.
 */
export const modifyAt =
  <T> (index: number) => (f: (oldValue: T) => T) => (xs: List<T>): List<T> => {
    if (index > -1 && index < xs .value .length) {
      return fromArray (xs .value .map ((e, i) => i === index ? f (e) : e))
    }

    return xs
  }

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
  <T> (index: number) => (f: (oldValue: T) => Maybe<T>) => (xs: List<T>): List<T> => {
    if (index > -1 && index < xs .value .length) {
      const maybeRes = f (xs .value [index])

      if (isJust (maybeRes)) {
        return setAt<T> (index) (fromJust (maybeRes)) (xs)
      }

      return deleteAt<T> (index) (xs)
    }

    return xs
  }

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
  <T> (index: number) => (value: T) => (xs: List<T>): List<T> => {
    if (index > -1 && index < xs .value .length) {
      return fromElements (
        ...xs .value .slice (0, index),
        value,
        ...xs .value .slice (index)
      )
    }

    if (index === xs .value .length) {
      return append (xs) (fromElements (value))
    }

    return xs
  }

// Maps

/**
 * `imap :: (Int -> a -> b) -> [a] -> [b]`
 *
 * `imap f xs` is the list obtained by applying `f` to each element of `xs`.
 */
export const imap =
  <A, B> (fn: (index: number) => (x: A) => B) => (list: List<A>): List<B> =>
    fromArray (list .value .map ((e, i) => fn (i) (e)))

// Folds

/**
 * `ifoldr :: (Int -> a -> b -> b) -> b -> [a] -> b`
 *
 * Right-associative fold of a structure.
 */
export const ifoldr =
  <A extends Some, B extends Some>
  (f: (index: number) => (current: A) => (acc: B) => B) =>
  (initial: B) =>
  (xs: List<A>): B =>
    xs .value .reduceRight<B> ((acc, e, i) => f (i) (e) (acc), initial)

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
  <A extends Some, B extends Some>
  (f: (acc: B) => (index: number) => (current: A) => B) =>
  (initial: B) =>
  (xs: List<A>): B =>
    xs .value .reduce<B> ((acc, e, i) => f (acc) (i) (e), initial)

/**
 * `iall :: Foldable t => (Int -> a -> Bool) -> t a -> Bool`
 *
 * Determines whether all elements of the structure satisfy the predicate.
 */
export const iall =
<A extends Some>(f: (index: number) => (x: A) => boolean) => (xs: List<A>): boolean =>
  xs .value .every ((e, i) => f (i) (e))

/**
 * `iany :: Foldable t => (Int -> a -> Bool) -> t a -> Bool`
 *
 * Determines whether any element of the structure satisfies the predicate.
 */
export const iany =
  <A extends Some>(f: (index: number) => (x: A) => boolean) => (xs: List<A>): boolean =>
    xs .value .some ((e, i) => f (i) (e))

/**
 * `iconcatMap :: (Int -> a -> [b]) -> [a] -> [b]`
 */
export const iconcatMap =
  <A extends Some, B extends Some>
  (f: (index: number) => (value: A) => List<B>) =>
  (xs: List<A>): List<B> =>
    fromElements (
      ...(xs .value .reduce<ReadonlyArray<B>> (
        (acc, e, i) => [...acc, ...f (i) (e)],
        []
      ))
    )

// Sbblists

interface Ifilter {
  /**
   * `ifilter :: (Int -> a -> Bool) -> [a] -> [a]`
   *
   * `ifilter`, applied to a predicate and a list, returns the list of those
   * elements that satisfy the predicate.
   */
  <A, A1 extends A> (pred: (index: number) => (x: A) => x is A1): (list: List<A>) => List<A1>
  /**
   * `ifilter :: (Int -> a -> Bool) -> [a] -> [a]`
   *
   * `ifilter`, applied to a predicate and a list, returns the list of those
   * elements that satisfy the predicate.
   */
  <A> (pred: (index: number) => (x: A) => boolean): (list: List<A>) => List<A>
}

/**
 * `ifilter :: (Int -> a -> Bool) -> [a] -> [a]`
 *
 * `ifilter`, applied to a predicate and a list, returns the list of those
 * elements that satisfy the predicate.
 */
export const ifilter: Ifilter =
  <A> (pred: (index: number) => (x: A) => boolean) => (list: List<A>): List<A> =>
    fromArray (list .value .filter ((e, i) => pred (i) (e)))

/**
 * `ipartition :: (Int ->a -> Bool) -> [a] -> ([a], [a])`
 *
 * The `ipartition` function takes a predicate a list and returns the pair of
 * lists of elements which do and do not satisfy the predicate, respectively.
 *
```
>>> partition (`elem` "aeiou") "Hello World!"
("eoo","Hll Wrld!")
```
  */
export const ipartition =
  <A>
  (f: (index: number) => (value: A) => boolean) =>
  (xs: List<A>): Pair<List<A>, List<A>> => {
    const pair = xs .value .reduceRight<[List<A>, List<A>]> (
      ([included, excluded], value, i) => f (i) (value)
        ? [cons (included) (value), excluded]
        : [included, cons (excluded) (value)],
      [empty, empty]
    )

    return fromBoth<List<A>, List<A>> (pair[0]) (pair[1])
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
  <A, A1 extends A> (pred: (index: number) => (x: A) => x is A1): (xs: List<A>) => Maybe<A1>
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
    fromNullable (xs .value .find ((e, i) => pred (i) (e)))

/**
 * `ifindIndex :: (Int -> a -> Bool) -> [a] -> Maybe Int`
 *
 * The `ifindIndex` function takes a predicate and a list and returns the
 * index of the first element in the list satisfying the predicate, or
 * `Nothing` if there is no such element.
 */
export const ifindIndex =
  <A> (pred: (index: number) => (x: A) => boolean) => (xs: List<A>): Maybe<number> => {
    const res = xs .value .findIndex ((e, i) => pred (i) (e))

    return res > -1 ? Just (res) : Nothing
  }

/**
 * `ifindIndices :: (a -> Bool) -> [a] -> [Int]`
 *
 * The `ifindIndices` function extends `findIndex`, by returning the indices
 * of all elements satisfying the predicate, in ascending order.
 */
export const ifindIndices =
  <A> (pred: (index: number) => (x: A) => boolean) => (xs: List<A>): List<number> =>
    fromArray (
      xs .value .reduce<number[]> (
        (acc, e, index) => pred (index) (e) ? [...acc, index] : acc,
        []
      )
    )


// OWN METHODS

/**
 * `index_ :: [a] -> Int -> a`
 *
 * Unsafe list index operator, starting from 0. If the index is invalid this
 * function throws an error, otherwise returns `a`.
 */
export const index_ =
  <A> (xs: List<A>) => (index: number): A => {
    if (index >= 0 && index < xs .value .length) {
      return xs .value [index]
    }

    throw new RangeError (
      `Invalid index provided to index_. The list has a length of ${xs .value .length}, but an index of ${index} was provided.`
    )
  }

/**
 * Converts a `List` to a native Array.
 */
export const toArray = <A> (list: List<A>): A[] => list .value as A[]

/**
 * Transforms a `List` of `Tuple`s into an `OrderedMap` where the first values
 * in the `Tuple` are the keys and the second values are the actual values.
 */
export const toMap = <K, V> (list: List<Pair<K, V>>): OrderedMap<K, V> =>
  OrderedMap.fromArray (list .value .map (Pair.toArray))

/**
 * Checks if the given value is a `List`.
 * @param x The value to test.
 */
export const isList = (x: any): x is List<any> => typeof x === 'object' && x !== null && x.isList

/**
 * Returns the sum of all elements of the list that match the provided
 * predicate.
 */
export const countWith = <A> (pred: (x: A) => boolean) => pipe (filter (pred), length)

/**
 * The largest element of a non-empty structure. The minimum value returned is
 * `0`.
 */
export const maximumNonNegative = pipe (consF (0), maximum)


// MODULE HELPER FUNCTIONS

const buildNodexFromArrayWithLastIndex =
  <A extends Some>
  (arr: ReadonlyArray<A>) =>
  (index: number) =>
  (h: Node<A> | undefined): Node<A> | undefined =>
    index < 0
    ? h
    : h !== undefined
    ? buildNodexFromArrayWithLastIndex (arr) (index - 1) ({ value: arr[index], next: h })
    : buildNodexFromArrayWithLastIndex (arr) (index - 1) ({ value: arr[index] })

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
  mreturn,
  kleisli,
  join,

  foldr,
  foldl,
  toList,
  fnull,
  length,
  elem,
  elem_,
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

  mappend: append,
  cons,
  cons_: consF,
  head,
  last,
  last_: lastF,
  tail,
  tail_,
  init,
  init_,
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
  subscript_,
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

  index_,
  toArray,
  toMap,
  isList,
  countWith,
  maximumNonNegative,
}


// TYPE HELPERS

export type ListElement<A> = A extends List<infer AI> ? AI : never

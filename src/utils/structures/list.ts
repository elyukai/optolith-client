import * as R from 'ramda';
import * as Al from '../../types/algebraic';
import { Just, Maybe, Nothing, Some } from './maybe';
import { OrderedMap } from './orderedMap';
import { Tuple } from './tuple';

export type ListElement<T> = T extends List<infer I> ? I : never;

export class List<T> implements Al.Monad<T>, Al.Foldable<T>, Al.Semigroup<T>,
  Al.Filterable<T> {
  private readonly value: ReadonlyArray<T>;

  private constructor (initialElements: ReadonlyArray<T>) {
    this.value = initialElements;
  }

  [Symbol.iterator] (): IterableIterator<T> {
    return this.value[Symbol.iterator] ();
  }

  // CONSTRUCTORS

  /**
   * Creates a new `List` instance from the passed arguments.
   */
  static of<T> (...initialElements: T[]): List<T> {
    return new List (initialElements);
  }

  /**
   * `pure :: a -> [a]`
   *
   * Creates a new `List` instance from the passed arguments.
   */
  static pure<T> (...initialElements: T[]): List<T> {
    return new List (initialElements);
  }

  /**
   * `return :: a -> [a]`
   *
   * Creates a new `List` instance from the passed arguments.
   */
  static return<T> (...initialElements: T[]): List<T> {
    return new List (initialElements);
  }

  /**
   * `empty :: () -> []`
   *
   * Creates an empty `List`.
   */
  static empty<T> (): List<T> {
    return new List ([]);
  }

  // BASIC

  /**
   * `(++) :: Foldable t => t [a] -> [a]`
   *
   * Append two lists.
   */
  mappend (add: List<T>): List<T> {
    return List.of (...this.value, ...add.value);
  }

  /**
   * `(++) :: Foldable t => t [a] -> [a]`
   *
   * Append two lists.
   */
  static mappend<T> (list1: List<T>): (list2: List<T>) => List<T> {
    return list2 => List.of (...list1.value, ...list2.value);
  }

  /**
   * `(:) :: [a] -> a -> [a]`
   *
   * Prepends an element to the list.
   */
  cons (e: T): List<T> {
    return List.of (e, ...this.value);
  }

  /**
   * `(:) :: [a] -> a -> [a]`
   *
   * Prepends an element to the list.
   */
  static cons<T> (list: List<T>): (e: T) => List<T> {
    return e => List.of (e, ...list.value);
  }

  /**
   * `(:) :: a -> [a] -> [a]`
   *
   * Prepends an element to the list.
   *
   * Same as `List.cons` but with arguments flipped.
   */
  static cons_<T> (e: T): (list: List<T>) => List<T> {
    return list => List.of (e, ...list.value);
  }

  /**
   * `(!!) :: [a] -> Int -> Maybe a`
   *
   * List index (subscript) operator, starting from 0. If the index is invalid,
   * returns `Nothing`, otherwise `Just a`.
   */
  subscript (index: number): Maybe<T> {
    return Maybe.of (this.value[index]);
  }

  /**
   * `(!!) :: [a] -> Int -> Maybe a`
   *
   * List index (subscript) operator, starting from 0. If the index is invalid,
   * returns `Nothing`, otherwise `Just a`.
   */
  static subscript<T> (list: List<T>): (index: number) => Maybe<T> {
    return index => Maybe.of (list.value[index]);
  }

  /**
   * `head :: [a] -> a`
   *
   * Extract the first element of a list, which must be non-empty.
   */
  head (): T {
    return List.head (this);
  }

  /**
   * `head :: [a] -> a`
   *
   * Extract the first element of a list, which must be non-empty.
   */
  static head<T> (list: List<T>): T {
    if (list.value.length === 0) {
      throw new TypeError (
        `List.head does only work on non-empty lists. If you
        do not know whether the list is empty or not, use Maybe.listToMaybe
        instead.`
      );
    }

    return list.value[0];
  }

  /**
   * `last :: [a] -> a`
   *
   * Extract the last element of a list, which must be finite and non-empty.
   */
  last (): T {
    return List.last (this);
  }

  /**
   * `last :: [a] -> a`
   *
   * Extract the last element of a list, which must be finite and non-empty.
   */
  static last<T> (list: List<T>): T {
    if (List.null (list)) {
      throw new TypeError (`List.last does only work on non-empty lists.`);
    }

    return list.value[list.value.length - 1];
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
  static last_<T> (list: List<T>): Maybe<T> {
    return List.null (list) ? Nothing () : Just (list.value[list.value.length - 1]);
  }

  /**
   * `tail :: [a] -> [a]`
   *
   * Extract the elements after the head of a list, which must be non-empty.
   */
  tail (): List<T> {
    return List.tail (this);
  }

  /**
   * `tail :: [a] -> [a]`
   *
   * Extract the elements after the head of a list, which must be non-empty.
   */
  static tail<T> (list: List<T>): List<T> {
    if (List.null (list)) {
      throw new TypeError (`List.tail does only work on non-empty lists.`);
    }

    return List.fromArray (list.value.slice (1));
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
  static tail_<T> (list: List<T>): Maybe<List<T>> {
    const tail = list.value.slice (1);

    return List.null (list) ? Nothing () : Just (List.fromArray (tail));
  }

  /**
   * `init :: [a] -> [a]`
   *
   * Return all the elements of a list except the last one. The list must be
   * non-empty.
   */
  init (): List<T> {
    return List.init (this);
  }

  /**
   * `init :: [a] -> [a]`
   *
   * Return all the elements of a list except the last one. The list must be
   * non-empty.
   */
  static init<T> (list: List<T>): List<T> {
    if (List.null (list)) {
      throw new TypeError (`List.init does only work on non-empty lists.`);
    }

    return List.fromArray (list.value.slice (0, -1));
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
  static init_<T> (list: List<T>): Maybe<List<T>> {
    const init = list.value.slice (0, -1);

    return List.null (list) ? Nothing () : Just (List.fromArray (init));
  }

  /**
   * `uncons :: [a] -> Maybe (a, [a])`
   *
   * Decompose a list into its head and tail. If the list is empty, returns
   * `Nothing`. If the list is non-empty, returns `Just (x, xs)`, where `x` is
   * the head of the list and `xs` its tail.
   */
  uncons (): Maybe<Tuple<T, List<T>>> {
    if (this.null ()) {
      return Nothing ();
    }
    else {
      const [head, ...tail] = this.value;

      return Just (Tuple.of<T, List<T>> (head) (List.fromArray (tail)));
    }
  }

  /**
   * `uncons :: [a] -> Maybe (a, [a])`
   *
   * Decompose a list into its head and tail. If the list is empty, returns
   * `Nothing`. If the list is non-empty, returns `Just (x, xs)`, where `x` is
   * the head of the list and `xs` its tail.
   */
  static uncons<T> (list: List<T>): Maybe<Tuple<T, List<T>>> {
    if (list.null ()) {
      return Nothing ();
    }
    else {
      const [head, ...tail] = list.value;

      return Just (Tuple.of<T, List<T>> (head) (List.fromArray (tail)));
    }
  }

  /**
   * `null :: Foldable t => t a -> Bool`
   *
   * Test whether the structure is empty.
   */
  null (): boolean {
    return this.value.length === 0;
  }

  /**
   * `null :: Foldable t => t a -> Bool`
   *
   * Test whether the structure is empty.
   */
  static null (list: List<any>): boolean {
    return list.value.length === 0;
  }

  /**
   * `length :: Foldable t => t a -> Int`
   *
   * Returns the size/length of a finite structure as an `Int`.
   */
  length (): number {
    return this.value.length;
  }

  /**
   * `length :: Foldable t => t a -> Int`
   *
   * Returns the size/length of a finite structure as an `Int`.
   */
  static lengthL (list: List<any>): number {
    return list.value.length;
  }

  // LIST TRANSFORMATIONS

  /**
   * `fmap :: (a -> b) -> [a] -> [b]`
   *
   * `fmap f xs` is the list obtained by applying `f` to each element of `xs`.
   */
  fmap<U> (fn: (x: T) => U): List<U> {
    return List.fromArray (this.value.map (fn));
  }

  /**
   * `map :: (a -> b) -> [a] -> [b]`
   *
   * `map f xs` is the list obtained by applying `f` to each element of `xs`.
   */
  map<U> (fn: (x: T) => U): List<U> {
    return this.fmap (fn);
  }

  /**
   * `map :: (a -> b) -> [a] -> [b]`
   *
   * `map f xs` is the list obtained by applying `f` to each element of `xs`.
   */
  static map<T, U> (fn: (x: T) => U): (list: List<T>) => List<U> {
    return list => list.map (fn);
  }

  /**
   * `imap :: (Int -> a -> b) -> [a] -> [b]`
   *
   * `imap f xs` is the list obtained by applying `f` to each element of `xs`.
   */
  imap<U> (fn: (index: number) => (x: T) => U): List<U> {
    return List.fromArray (this.value.map ((e, i) => fn (i) (e)));
  }

  /**
   * `reverse :: [a] -> [a]`
   *
   * `reverse xs` returns the elements of `xs` in reverse order. `xs` must be
   * finite.
   */
  reverse (): List<T> {
    return List.fromArray ([...this.value].reverse ());
  }

  /**
   * `intercalate :: [a] -> [[a]] -> [a]`
   *
   * `intercalate xs xss` is equivalent to `(concat (intersperse xs xss))`. It
   * inserts the list `xs` in between the lists in `xss` and concatenates the
   * result.
   */
  intercalate (this: List<number | string>, separator: string): string {
    return this.value.join (separator);
  }

  /**
   * `intercalate :: [a] -> [[a]] -> [a]`
   *
   * `intercalate xs xss` is equivalent to `(concat (intersperse xs xss))`. It
   * inserts the list `xs` in between the lists in `xss` and concatenates the
   * result.
   */
  static intercalate (separator: string): (list: List<number | string>) => string {
    return list => list.value.join (separator);
  }

  // REDUCING LISTS (FOLDS)

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
  foldl<U extends Some> (fn: (acc: U) => (current: T) => U): (initial: U) => U {
    return initial => this.value.reduce<U> ((acc, e) => fn (acc) (e), initial);
  }

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
  static foldl<T, U> (fn: (acc: U) => (current: T) => U): (initial: U) => (list: List<T>) => U {
    return initial => list => list.value.reduce<U> ((acc, e) => fn (acc) (e), initial);
  }

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
  static foldr<T, U> (fn: (current: T) => (acc: U) => U): (initial: U) => (list: List<T>) => U {
    return initial => list => list.value.reduceRight<U> ((acc, e) => fn (e) (acc), initial);
  }

  /**
   * `ifoldl :: Foldable t => (b -> Int -> a -> b) -> b -> t a -> b`
   *
   * Left-associative fold of a structure.
   *
   * In the case of lists, `ifoldl`, when applied to a binary operator, a
   * starting value (typically the left-identity of the operator), and a list,
   * reduces the list using the binary operator, from left to right.
   */
  ifoldl<U extends Some> (fn: (acc: U) => (index: number) => (current: T) => U): (initial: U) => U {
    return initial => this.value.reduce<U> ((acc, e, index) => fn (acc) (index) (e), initial);
  }

  /**
   * `foldl1 :: Foldable t => (a -> a -> a) -> t a -> a`
   *
   * A variant of `foldl` that has no base case, and thus may only be applied to
   * non-empty structures.
   */
  static foldl1<A> (fn: (acc: A) => (current: A) => A): (list: List<A>) => A {
    return list => {
      if (list.value.length > 0) {
        const [head, ...tail] = list.value;

        return tail.reduce<A> ((acc, e) => fn (acc) (e), head);
      }

      throw new TypeError ('Cannot apply foldl1 to an empty list.');
    }
  }

  /**
   * `ifoldlWithList :: Foldable t => (t -> b -> Int -> a -> b) -> b -> t a -> b`
   *
   * Left-associative fold of a structure.
   *
   * In the case of lists, `ifoldl`, when applied to a binary operator, a
   * starting value (typically the left-identity of the operator), and a list,
   * reduces the list using the binary operator, from left to right.
   *
   * It does not only include the index of the current element but also the
   * original `List`.
   */
  ifoldlWithList<U extends Some> (
    fn: (list: List<T>) => (acc: U) => (index: number) => (current: T) => U
  ): (initial: U) => U {
    return initial => this.value.reduce<U> (
      (acc, e, index) => fn (this) (acc) (index) (e),
      initial
    );
  }

  // // SPECIAL FOLDS

  /**
   * `concat :: [[a]] -> [a]`
   *
   * The concatenation of all the elements of a container of lists.
   */
  concat<U> (this: List<List<U>>): List<U> {
    return List.fromArray (
      this.value.reduce<U[]> (
        (acc, e) => acc.concat (e.value),
        []
      )
    );
  }

  /**
   * `concat :: [[a]] -> [a]`
   *
   * The concatenation of all the elements of a container of lists.
   */
  static concat<U> (list: List<List<U>>): List<U> {
    return List.fromArray (
      list.value.reduce<U[]> (
        (acc, e) => acc.concat (e.value),
        []
      )
    );
  }

  /**
   * `and :: Foldable t => t Bool -> Bool`
   *
   * `and` returns the conjunction of a container of Bools. For the result to be
   * `True`, the container must be finite; `False`, however, results from a
   * `False` value finitely far from the left end.
   */
  and (this: List<boolean>): boolean {
    return this.value.every (e => e === true);
  }

  /**
   * `or :: Foldable t => t Bool -> Bool`
   *
   * `or` returns the disjunction of a container of Bools. For the result to be
   * `False`, the container must be finite; `True`, however, results from a
   * `True` value finitely far from the left end.
   */
  or (this: List<boolean>): boolean {
    return this.value.some (e => e === true);
  }

  /**
   * `any :: Foldable t => (a -> Bool) -> t a -> Bool`
   *
   * Determines whether any element of the structure satisfies the predicate.
   */
  any (fn: (x: T) => boolean): boolean {
    return this.value.some (fn);
  }

  /**
   * `any :: Foldable t => (a -> Bool) -> t a -> Bool`
   *
   * Determines whether any element of the structure satisfies the predicate.
   */
  static any<T> (fn: (x: T) => boolean): (list: List<T>) => boolean {
    return list => list.value.some (fn);
  }

  /**
   * `iany :: Foldable t => (Int -> a -> Bool) -> t a -> Bool`
   *
   * Determines whether any element of the structure satisfies the predicate.
   */
  iany (fn: (index: number) => (x: T) => boolean): boolean {
    return this.value.some ((e, i) => fn (i) (e));
  }

  /**
   * `all :: Foldable t => (a -> Bool) -> t a -> Bool`
   *
   * Determines whether all elements of the structure satisfy the predicate.
   */
  all (fn: (x: T) => boolean): boolean {
    return this.value.every (fn);
  }

  /**
   * `iall :: Foldable t => (Int -> a -> Bool) -> t a -> Bool`
   *
   * Determines whether all elements of the structure satisfy the predicate.
   */
  iall (fn: (index: number) => (x: T) => boolean): boolean {
    return this.value.every ((e, i) => fn (i) (e));
  }

  /**
   * `sum :: (Foldable t, Num a) => t a -> a`
   *
   * The `sum` function computes the sum of the numbers of a structure.
   */
  sum (this: List<number>): number {
    return this.value.reduce ((acc, e) => acc + e, 0);
  }

  /**
   * `sum :: (Foldable t, Num a) => t a -> a`
   *
   * The `sum` function computes the sum of the numbers of a structure.
   */
  static sum (list: List<number>): number {
    return list.value.reduce ((acc, e) => acc + e, 0);
  }

  /**
   * `product :: (Foldable t, Num a) => t a -> a`
   *
   * The `product` function computes the product of the numbers of a structure.
   */
  product (this: List<number>): number {
    return this.value.reduce ((acc, e) => acc * e, 1);
  }

  /**
   * `maximum :: forall a. (Foldable t, Ord a) => t a -> a`
   *
   * The largest element of a non-empty structure.
   */
  maximum (this: List<number>): number {
    return Math.max (...this.value);
  }

  /**
   * `maximum :: forall a. (Foldable t, Ord a) => t a -> a`
   *
   * The largest element of a non-empty structure.
   */
  static maximum (list: List<number>): number {
    return list.maximum ();
  }

  /**
   * `minimum :: forall a. (Foldable t, Ord a) => t a -> a`
   *
   * The least element of a non-empty structure.
   */
  minimum (this: List<number>): number {
    return Math.min (...this.value);
  }

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
  scanl<U extends Some> (fn: (acc: U) => (current: T) => U): (initial: U) => List<U> {
    return initial => List.of (
      ...this.value.reduce<U[]> (
        (acc, e, index) => [...acc, fn (acc[index]) (e)],
        [initial]
      )
    );
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
  static unfoldr<T, U> (f: (value: U) => Maybe<Tuple<T, U>>): (seedValue: U) => List<T> {
    const buildList = (acc: List<T>) => (value: U): List<T> => {
      const result = f (value);

      if (Maybe.isJust (result)) {
        const newValue = Maybe.fromJust (result);

        return buildList (acc.append (Tuple.fst (newValue))) (Tuple.snd (newValue));
      }

      return acc;
    };

    return buildList (List.empty ());
  }

  // EXTRACTING SUBLISTS

  /**
   * `take :: Int -> [a] -> [a]`
   *
   * `take n`, applied to a list `xs`, returns the prefix of `xs` of length `n`,
   * or `xs` itself if `n > length xs`.
   */
  take (length: number): List<T> {
    return this.value.length < length
      ? this
      : List.fromArray (this.value.slice (0, length));
  }

  /**
   * `take :: Int -> [a] -> [a]`
   *
   * `take n`, applied to a list `xs`, returns the prefix of `xs` of length `n`,
   * or `xs` itself if `n > length xs`.
   */
  static take<T> (length: number): (list: List<T>) => List<T> {
    return list => list.value.length < length
      ? list
      : List.fromArray (list.value.slice (0, length));
  }

  /**
   * `drop :: Int -> [a] -> [a]`
   *
   * `drop n xs` returns the suffix of `xs` after the first `n` elements, or
   * `[]` if `n > length x`.
   */
  static drop<T> (length: number): (list: List<T>) => List<T> {
    return list => list.value.length < length
      ? List.empty ()
      : List.fromArray (list.value.slice (length));
  }

  /**
   * `splitAt :: Int -> [a] -> ([a], [a])`
   *
   * `splitAt n xs` returns a tuple where first element is `xs` prefix of length
   * `n` and second element is the remainder of the list.
   */
  static splitAt<T> (length: number): (list: List<T>) => Tuple<List<T>, List<T>> {
    return list => Tuple.of<List<T>, List<T>>
      (List.fromArray (list.value.slice (0, length)))
      (List.fromArray (list.value.slice (length)));
  }

  // SEARCHING BY EQUALITY

  /**
   * `elem :: (Foldable t, Eq a) => a -> t a -> Bool`
   *
   * Does the element occur in the structure?
   */
  elem (e: T): boolean {
    return this.value.includes (e);
  }

  /**
   * `elem :: (Foldable t, Eq a) => a -> t a -> Bool`
   *
   * Does the element occur in the structure?
   */
  static elem<T> (e: T): (list: List<T>) => boolean {
    return list => list.value.includes (e);
  }

  /**
   * `elem_ :: (Foldable t, Eq a) => ta a -> a -> Bool`
   *
   * Does the element occur in the structure?
   *
   * Same as `List.elem` but with arguments switched.
   */
  static elem_<T> (list: List<T>): (e: T) => boolean {
    return e => list.value.includes (e);
  }

  /**
   * `notElem :: (Foldable t, Eq a) => a -> t a -> Bool`
   *
   * `notElem` is the negation of `elem`.
   */
  notElem (e: T): boolean {
    return !this.elem (e);
  }

  /**
   * `lookup :: Eq a => a -> [(a, b)] -> Maybe b`
   *
   * `lookup key assocs` looks up a key in an association list.
   */
  lookup<K, V> (this: List<Tuple<K, V>>, key: K): Maybe<V> {
    return Maybe.fmap<Tuple<K, V>, V> (Tuple.snd) (this.find (e => Tuple.fst (e) === key));
  }

  // SEARCHING WITH A PREDICATE

  /**
   * `find :: Foldable t => (a -> Bool) -> t a -> Maybe a`
   *
   * The `find` function takes a predicate and a structure and returns the
   * leftmost element of the structure matching the predicate, or `Nothing` if
   * there is no such element.
   */
  find<U extends T> (pred: (x: T) => x is U): Maybe<U>;
  /**
   * `find :: Foldable t => (a -> Bool) -> t a -> Maybe a`
   *
   * The `find` function takes a predicate and a structure and returns the
   * leftmost element of the structure matching the predicate, or `Nothing` if
   * there is no such element.
   */
  find (pred: (x: T) => boolean): Maybe<T>;
  find (pred: (x: T) => boolean): Maybe<T> {
    return Maybe.of (this.value.find (pred));
  }

  /**
   * `find :: Foldable t => (a -> Bool) -> t a -> Maybe a`
   *
   * The `find` function takes a predicate and a structure and returns the
   * leftmost element of the structure matching the predicate, or `Nothing` if
   * there is no such element.
   */
  static find<T, U extends T> (pred: (x: T) => x is U): (list: List<T>) => Maybe<U>;
  /**
   * `find :: Foldable t => (a -> Bool) -> t a -> Maybe a`
   *
   * The `find` function takes a predicate and a structure and returns the
   * leftmost element of the structure matching the predicate, or `Nothing` if
   * there is no such element.
   */
  static find<T> (pred: (x: T) => boolean): (list: List<T>) => Maybe<T>;
  static find<T> (pred: (x: T) => boolean): (list: List<T>) => Maybe<T> {
    return list => list.find (pred);
  }

  /**
   * `ifind :: Foldable t => (Int -> a -> Bool) -> t a -> Maybe a`
   *
   * The `find` function takes a predicate and a structure and returns the
   * leftmost element of the structure matching the predicate, or `Nothing` if
   * there is no such element.
   */
  ifind<U extends T> (pred: (index: number) => (x: T) => x is U): Maybe<U>;
  /**
   * `ifind :: Foldable t => (Int -> a -> Bool) -> t a -> Maybe a`
   *
   * The `find` function takes a predicate and a structure and returns the
   * leftmost element of the structure matching the predicate, or `Nothing` if
   * there is no such element.
   */
  ifind (pred: (index: number) => (x: T) => boolean): Maybe<T>;
  ifind (pred: (index: number) => (x: T) => boolean): Maybe<T> {
    return Maybe.of (this.value.find ((e, i) => pred (i) (e)));
  }

  /**
   * `filter :: (a -> Bool) -> [a] -> [a]`
   *
   * `filter`, applied to a predicate and a list, returns the list of those
   * elements that satisfy the predicate.
   */
  filter<U extends T> (pred: (x: T) => x is U): List<U>;
  /**
   * `filter :: (a -> Bool) -> [a] -> [a]`
   *
   * `filter`, applied to a predicate and a list, returns the list of those
   * elements that satisfy the predicate.
   */
  filter (pred: (x: T) => boolean): List<T>;
  filter (pred: (x: T) => boolean): List<T> {
    return List.fromArray (this.value.filter (pred));
  }

  /**
   * `filter :: (a -> Bool) -> [a] -> [a]`
   *
   * `filter`, applied to a predicate and a list, returns the list of those
   * elements that satisfy the predicate.
   */
  static filter<T, U extends T> (pred: (x: T) => x is U): (list: List<T>) => List<U>;
  /**
   * `filter :: (a -> Bool) -> [a] -> [a]`
   *
   * `filter`, applied to a predicate and a list, returns the list of those
   * elements that satisfy the predicate.
   */
  static filter<T> (pred: (x: T) => boolean): (list: List<T>) => List<T>;
  static filter<T> (pred: (x: T) => boolean): (list: List<T>) => List<T> {
    return list => list.filter (pred);
  }

  /**
   * `ifilter :: (Int -> a -> Bool) -> [a] -> [a]`
   *
   * `ifilter`, applied to a predicate and a list, returns the list of those
   * elements that satisfy the predicate.
   */
  ifilter<U extends T> (pred: (index: number) => (x: T) => x is U): List<U>;
  /**
   * `ifilter :: (Int -> a -> Bool) -> [a] -> [a]`
   *
   * `ifilter`, applied to a predicate and a list, returns the list of those
   * elements that satisfy the predicate.
   */
  ifilter (pred: (index: number) => (x: T) => boolean): List<T>;
  ifilter (pred: (index: number) => (x: T) => boolean): List<T> {
    return List.fromArray (this.value.filter ((e, i) => pred (i) (e)));
  }

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
  partition (f: (value: T) => boolean): Tuple<List<T>, List<T>> {
    const pair = this.value.reduce<[List<T>, List<T>]> (
      ([included, excluded], value) => f (value)
        ? [included.append (value), excluded]
        : [included, excluded.append (value)],
      [List.empty (), List.empty ()]
    );

    return Tuple.of<List<T>, List<T>> (pair[0]) (pair[1]);
  }

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
  ipartition (f: (index: number) => (value: T) => boolean): Tuple<List<T>, List<T>> {
    const pair = this.value.reduce<[List<T>, List<T>]> (
      ([included, excluded], value, index) => f (index) (value)
        ? [included.append (value), excluded]
        : [included, excluded.append (value)],
      [List.empty (), List.empty ()]
    );

    return Tuple.of<List<T>, List<T>> (pair[0]) (pair[1]);
  }

  // INDEXING LISTS

  /**
   * `elemIndex :: Eq a => a -> [a] -> Maybe Int`
   *
   * The `elemIndex` function returns the index of the first element in the
   * given list which is equal (by `==`) to the query element, or `Nothing` if
   * there is no such element.
   */
  elemIndex (x: T): Maybe<number> {
    const res = this.value.indexOf (x);

    return res > -1 ? Maybe.return (res) : Maybe.empty ();
  }

  /**
   * `elemIndices :: Eq a => a -> [a] -> [Int]`
   *
   * The `elemIndices` function extends `elemIndex`, by returning the indices of
   * all elements equal to the query element, in ascending order.
   */
  elemIndices (x: T): List<number> {
    return List.of (
      ...this.value.reduce<number[]> (
        (acc, e, index) => e === x ? [...acc, index] : acc,
        []
      )
    );
  }

  /**
   * `findIndex :: (a -> Bool) -> [a] -> Maybe Int`
   *
   * The `findIndex` function takes a predicate and a list and returns the index
   * of the first element in the list satisfying the predicate, or `Nothing` if
   * there is no such element.
   */
  findIndex (pred: (x: T) => boolean): Maybe<number> {
    const res = this.value.findIndex (pred);

    return res > -1 ? Maybe.return (res) : Maybe.empty ();
  }

  /**
   * `ifindIndex :: (Int -> a -> Bool) -> [a] -> Maybe Int`
   *
   * The `ifindIndex` function takes a predicate and a list and returns the
   * index of the first element in the list satisfying the predicate, or
   * `Nothing` if there is no such element.
   */
  ifindIndex (pred: (index: number) => (x: T) => boolean): Maybe<number> {
    const res = this.value.findIndex ((e, i) => pred (i) (e));

    return res > -1 ? Maybe.return (res) : Maybe.empty ();
  }

  /**
   * `findIndices :: (a -> Bool) -> [a] -> [Int]`
   *
   * The `findIndices` function extends `findIndex`, by returning the indices of
   * all elements satisfying the predicate, in ascending order.
   */
  findIndices (pred: (x: T) => boolean): List<number> {
    return List.of (
      ...this.value.reduce<number[]> (
        (acc, e, index) => pred (e) ? [...acc, index] : acc,
        []
      )
    );
  }

  /**
   * `ifindIndices :: (a -> Bool) -> [a] -> [Int]`
   *
   * The `ifindIndices` function extends `findIndex`, by returning the indices
   * of all elements satisfying the predicate, in ascending order.
   */
  ifindIndices (pred: (index: number) => (x: T) => boolean): List<number> {
    return List.of (
      ...this.value.reduce<number[]> (
        (acc, e, index) => pred (index) (e) ? [...acc, index] : acc,
        []
      )
    );
  }

  // ZIPPING AND UNZIPPING LISTS

  /**
   * `zip :: [a] -> [b] -> [(a, b)]`
   *
   * `zip` takes two lists and returns a list of corresponding pairs. If one
   * input list is short, excess elements of the longer list are discarded.
   */
  static zip<A, B> (list1: List<A>): (list2: List<B>) => List<Tuple<A, B>> {
    return list2 => Maybe.imapMaybe<A, Tuple<A, B>> (
                                                      index => e => list2.subscript (index)
                                                        .fmap (e2 => Tuple.of<A, B> (e) (e2))
                                                    )
                                                    (list1)
  }

  // "SET" OPERATIONS

  /**
   * `delete :: Eq a => a -> [a] -> [a]`
   *
   * `delete x` removes the first occurrence of `x` from its list argument.
   */
  delete (x: T): List<T> {
    const index = this.value.findIndex (e => R.equals (e, x));

    return this.deleteAt (index);
  }

  // ORDERED LISTS

  /**
   * `sortBy :: (a -> a -> Ordering) -> [a] -> [a]`
   *
   * The `sortBy` function is the non-overloaded version of `sort`.
   */
  sortBy (fn: (a: T) => (b: T) => number): List<T> {
    return List.fromArray ([...this.value].sort ((a, b) => fn (a) (b)));
  }

  // BASIC INDEX-BASED (from Data.List.Index)

  /**
   * `deleteAt :: Int -> [a] -> [a]`
   *
   * `deleteAt` deletes the element at an index.
   *
   * If the index is negative or exceeds list length, the original list will be
   * returned.
   */
  deleteAt (index: number): List<T> {
    if (index > 0 && index < this.value.length) {
      return List.of (
        ...this.value.slice (0, index),
        ...this.value.slice (index + 1)
      );
    }
    else {
      return this;
    }
  }

  /**
   * `setAt :: Int -> a -> [a] -> [a]`
   *
   * `setAt` sets the element at the index.
   *
   * If the index is negative or exceeds list length, the original list will be
   * returned.
   */
  setAt (index: number, value: T): List<T> {
    const resultFn = (x1: number, x2: T): List<T> => {
      if (x1 > 0 && x1 < this.value.length) {
        return List.fromArray (this.value.map ((e, i) => i === x1 ? x2 : e));
      }
      else {
        return this;
      }
    };

    return resultFn (index, value!);
  }

  /**
   * `modifyAt :: Int -> (a -> a) -> [a] -> [a]`
   *
   * `modifyAt` applies a function to the element at the index.
   *
   * If the index is negative or exceeds list length, the original list will be
   * returned.
   */
  modifyAt (index: number, fn: (oldValue: T) => T): List<T> {
    const resultFn = (x1: number, x2: (oldValue: T) => T): List<T> => {
      if (x1 > 0 && x1 < this.value.length) {
        return List.fromArray (this.value.map ((e, i) => i === x1 ? x2 (e) : e));
      }
      else {
        return this;
      }
    };

    return resultFn (index, fn!);
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
  updateAt (index: number, fn: (oldValue: T) => Maybe<T>): List<T> {
    const resultFn = (x1: number, x2: (oldValue: T) => Maybe<T>): List<T> => {
      if (x1 > 0 && x1 < this.value.length) {
        const maybeRes = x2 (this.value[x1]);

        if (Maybe.isJust (maybeRes)) {
          return this.setAt (x1, Maybe.fromJust (maybeRes));
        }
        else {
          return this.deleteAt (x1);
        }
      }
      else {
        return this;
      }
    };

    return resultFn (index, fn!);
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
  insertAt (index: number, value: T): List<T> {
    const resultFn = (x1: number, x2: T): List<T> => {
      if (x1 > 0 && x1 < this.value.length) {
        return List.of (
          ...this.value.slice (0, x1),
          x2,
          ...this.value.slice (x1)
        );
      }
      else if (x1 === this.value.length) {
        return this.append (x2);
      }
      else {
        return this;
      }
    };

    return resultFn (index, value!);
  }

  // MONAD METHODS

  bind<U> (f: (value: T) => List<U>): List<U> {
    return List.fromArray (this.value.reduce<U[]> (
      (acc, e) => [...acc, ...f (e)],
      []
    ));
  }

  then<U> (x: List<U>): List<U> {
    return this.value.length > 0 ? x : this as any;
  }

  ap<U> (x: List<(value: T) => U>): List<U> {
    return List.fromArray (this.value.reduce<U[]> (
      (acc, e) => [...acc, ...x.value.map (f => f (e))],
      []
    ));
  }

  // OWN METHODS

  /**
   * `append :: a -> [a]`
   *
   * Appends an element to the list.
   */
  append (e: T): List<T> {
    return List.of (...this.value, e);
  }

  /**
   * Transforms the list instance into a native array instance.
   */
  toArray (): ReadonlyArray<T> {
    return this.value;
  }

  /**
   * Converts a `List` to a native Array.
   */
  static toArray<T> (list: List<T>): ReadonlyArray<T> {
    return list.value;
  }

  /**
   * Converts a native Array to a `List`.
   */
  static fromArray<T> (arr: ReadonlyArray<T>): List<T> {
    return new List (arr);
  }

  /**
   * Transforms a `List` of `Tuple`s into an `OrderedMap` where the first values
   * in the `Tuple` are the keys and the second values are the actual values.
   */
  static toMap<K, V> (list: List<Tuple<K, V>>): OrderedMap<K, V> {
    return OrderedMap.of (list.value.map (t =>
      [Tuple.fst (t), Tuple.snd (t)] as [K, V]
    ));
  }

  /**
   * Checks if the given value is a `List`.
   * @param value The value to test.
   */
  static isList<T> (value: any): value is List<T> {
    return value instanceof List;
  }
}

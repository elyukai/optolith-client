import R from 'ramda';
import * as Al from '../../types/algebraic.d';
import { Maybe, Some } from './maybe';
import { OrderedMap } from './orderedMap';
import { Tuple } from './tuple';

export type ListElement<T> = T extends List<infer I> ? I : never;

export class List<T> implements Al.Functor<T>, Al.Foldable<T>, Al.Semigroup<T>,
  Al.Filterable<T> {
  private readonly value: ReadonlyArray<T>;

  constructor(...initialElements: T[]) {
    this.value = initialElements;
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this.value[Symbol.iterator]();
  }

  // BASIC

  /**
   * `(++) :: Foldable t => t [a] -> [a]`
   *
   * Append two lists.
   */
  concat(add: List<T>): List<T> {
    return List.of(...this.value, ...add.value);
  }

  /**
   * `(:) :: [a] -> a -> [a]`
   *
   * Prepends an element to the list.
   */
  prepend(e: T): List<T> {
    return List.of(e, ...this.value);
  }

  /**
   * `(!!) :: [a] -> Int -> Maybe a`
   *
   * List index (subscript) operator, starting from 0. If the index is invalid,
   * returns `Nothing`, otherwise `Just a`.
   */
  subscript(index: number): Maybe<T> {
    return Maybe.of(this.value[index]);
  }

  /**
   * `head :: [a] -> Maybe a`
   *
   * Extract the first element of a list.
   */
  head(): Maybe<T> {
    return this.subscript(0);
  }

  /**
   * `last :: [a] -> Maybe a`
   *
   * Extract the last element of a list, which must be finite.
   */
  last(): Maybe<T> {
    return this.subscript(this.length() - 1);
  }

  /**
   * `tail :: [a] -> [a]`
   *
   * Extract the elements after the head of a list.
   */
  tail(): List<T> {
    const hasMultiple = this.value.length > 1;
    const tail = this.value.slice(1);

    return hasMultiple ? List.of(...tail) : List.of();
  }

  /**
   * `init :: [a] -> [a]`
   *
   * Return all the elements of a list except the last one.
   */
  init(): List<T> {
    const hasMultiple = this.value.length > 1;
    const init = this.value.slice(0, -1);

    return hasMultiple ? List.of(...init) : List.of();
  }

  /**
   * `null :: Foldable t => t a -> Bool`
   *
   * Test whether the structure is empty.
   */
  null(): boolean {
    return this.value.length === 0;
  }

  /**
   * `length :: Foldable t => t a -> Int`
   *
   * Returns the size/length of a finite structure as an `Int`.
   */
  length(): number {
    return this.value.length;
  }

  // LIST TRANSFORMATIONS

  /**
   * `map :: (a -> b) -> [a] -> [b]`
   *
   * `map f xs` is the list obtained by applying `f` to each element of `xs`.
   */
  map<U>(fn: (x: T) => U): List<U> {
    return List.of(...this.value.map(fn));
  }

  /**
   * `imap :: (Int -> a -> b) -> [a] -> [b]`
   *
   * `imap f xs` is the list obtained by applying `f` to each element of `xs`.
   */
  imap<U>(fn: (index: number) => (x: T) => U): List<U> {
    return List.of(...this.value.map((e, i) => fn(i)(e)));
  }

  /**
   * `intercalate :: [a] -> [[a]] -> [a]`
   *
   * `intercalate xs xss` is equivalent to `(concat (intersperse xs xss))`. It
   * inserts the list `xs` in between the lists in `xss` and concatenates the
   * result.
   */
  intercalate(this: List<number | string>, separator: string): string {
    return this.value.join(separator);
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
  foldl<U extends Some>(fn: (acc: U) => (current: T) => U): (initial: U) => U;
  foldl<U extends Some>(fn: (acc: U) => (current: T) => U, initial: U): U;
  foldl<U extends Some>(
    fn: (acc: U) => (current: T) => U,
    initial?: U
  ): U | ((initial: U) => U) {
    const resultFn = (x1: (acc: U) => (current: T) => U) => (x2: U) =>
      this.value.reduce<U>((acc, e) => x1(acc)(e), x2);

    if (arguments.length === 2) {
      return resultFn(fn)(initial!);
    }

    return resultFn(fn);
  }

  /**
   * `ifoldl :: Foldable t => (b -> Int -> a -> b) -> b -> t a -> b`
   */
  ifoldl<U extends Some>(
    fn: (acc: U) => (index: number) => (current: T) => U
  ): (initial: U) => U;
  ifoldl<U extends Some>(
    fn: (acc: U) => (index: number) => (current: T) => U,
    initial: U
  ): U;
  ifoldl<U extends Some>(
    fn: (acc: U) => (index: number) => (current: T) => U,
    initial?: U
  ): U | ((initial: U) => U) {
    const resultFn =
      (x1: (acc: U) => (index: number) => (current: T) => U) =>
        (x2: U) =>
          this.value.reduce<U>((acc, e, index) => x1(acc)(index)(e), x2);

    if (arguments.length === 2) {
      return resultFn(fn)(initial!);
    }

    return resultFn(fn);
  }

  // /**
  //  * `foldl1 :: Foldable t => (a -> a -> a) -> t a -> a`
  //  *
  //  * A variant of `foldl` that has no base case, and thus may only be applied to
  //  * non-empty structures.
  //  */
  // foldl1(fn: (acc: T) => (current: T) => T): T {
  //   if (this.value.length > 0) {
  //     const [head, ...tail] = this.value;

  //     return tail.reduce<T>((acc, e) => fn(acc)(e), head);
  //   }
  //   else {
  //     throw new TypeError('Cannot apply foldl1 to an empty list.');
  //   }
  // }

  /**
   * `ifoldlWithList :: Foldable t => (t -> b -> Int -> a -> b) -> b -> t a -> b`
   */
  ifoldlWithList<U extends Some>(
    fn: (list: List<T>) => (acc: U) => (index: number) => (current: T) => U
  ): (initial: U) => U;
  ifoldlWithList<U extends Some>(
    fn: (list: List<T>) => (acc: U) => (index: number) => (current: T) => U,
    initial: U
  ): U;
  ifoldlWithList<U extends Some>(
    fn: (list: List<T>) => (acc: U) => (index: number) => (current: T) => U,
    initial?: U
  ): U | ((initial: U) => U) {
    const resultFn = (
      x1: (list: List<T>) => (acc: U) => (index: number) => (current: T) => U
    ) =>
      (x2: U) =>
        this.value.reduce<U>((acc, e, index) => x1(this)(acc)(index)(e), x2);

    if (arguments.length === 2) {
      return resultFn(fn)(initial!);
    }

    return resultFn(fn);
  }

  // // SPECIAL FOLDS

  /**
   * `concatInner :: [[a]] -> [a]`
   *
   * The concatenation of all the elements of a container of lists.
   */
  concatInner<U>(this: List<List<U>>): List<U> {
    return List.of(
      ...this.value.reduce<U[]>(
        (acc, e) => acc.concat(e.value),
        []
      )
    );
  }

  /**
   * `any :: Foldable t => (a -> Bool) -> t a -> Bool`
   *
   * Determines whether any element of the structure satisfies the predicate.
   */
  any(fn: (x: T) => boolean): boolean {
    return this.value.some(fn);
  }

  /**
   * `iany :: Foldable t => (Int -> a -> Bool) -> t a -> Bool`
   *
   * Determines whether any element of the structure satisfies the predicate.
   */
  iany(fn: (index: number) => (x: T) => boolean): boolean {
    return this.value.some((e, i) => fn(i)(e));
  }

  /**
   * `all :: Foldable t => (a -> Bool) -> t a -> Bool`
   *
   * Determines whether all elements of the structure satisfy the predicate.
   */
  all(fn: (x: T) => boolean): boolean {
    return this.value.every(fn);
  }

  /**
   * `iall :: Foldable t => (Int -> a -> Bool) -> t a -> Bool`
   *
   * Determines whether all elements of the structure satisfy the predicate.
   */
  iall(fn: (index: number) => (x: T) => boolean): boolean {
    return this.value.every((e, i) => fn(i)(e));
  }

  /**
   * `sum :: (Foldable t, Num a) => t a -> a`
   *
   * The `sum` function computes the sum of the numbers of a structure.
   */
  sum(this: List<number>): number {
    return this.value.reduce((acc, e) => acc + e, 0);
  }

  /**
   * `product :: (Foldable t, Num a) => t a -> a`
   *
   * The `product` function computes the product of the numbers of a structure.
   */
  product(this: List<number>): number {
    return this.value.reduce((acc, e) => acc * e, 0);
  }

  /**
   * `maximum :: forall a. (Foldable t, Ord a) => t a -> a`
   *
   * The largest element of a non-empty structure.
   */
  maximum(this: List<number>): number {
    return Math.max(...this.value);
  }

  /**
   * `minimum :: forall a. (Foldable t, Ord a) => t a -> a`
   *
   * The least element of a non-empty structure.
   */
  minimum(this: List<number>): number {
    return Math.min(...this.value);
  }

  // EXTRACTING SUBLISTS

  /**
   * `take :: Int -> [a] -> [a]`
   *
   * `take n`, applied to a list `xs`, returns the prefix of `xs` of length `n`,
   * or `xs` itself if `n > length xs`.
   */
  take(length: number): List<T> {
    return this.value.length < length
      ? this
      : List.of(...this.value.slice(0, length - 1));
  }

  // SEARCHING BY EQUALITY

  /**
   * `elem :: (Foldable t, Eq a) => a -> t a -> Bool`
   *
   * Does the element occur in the structure?
   */
  elem(e: T): boolean {
    return this.value.includes(e);
  }

  /**
   * `notElem :: (Foldable t, Eq a) => a -> t a -> Bool`
   *
   * `notElem` is the negation of `elem`.
   */
  notElem(e: T): boolean {
    return !this.elem(e);
  }

  /**
   * `lookup :: Eq a => a -> [(a, b)] -> Maybe b`
   *
   * `lookup key assocs` looks up a key in an association list.
   */
  lookup<K, V>(this: List<Tuple<K, V>>, key: K): Maybe<V> {
    return this.find(e => Tuple.fst(e) === key).map(Tuple.snd);
  }

  // SEARCHING WITH A PREDICATE

  /**
   * `find :: Foldable t => (a -> Bool) -> t a -> Maybe a`
   *
   * The `find` function takes a predicate and a structure and returns the
   * leftmost element of the structure matching the predicate, or `Nothing` if
   * there is no such element.
   */
  find<U extends T>(pred: (x: T) => x is U): Maybe<U>;
  find(pred: (x: T) => boolean): Maybe<T>;
  find(pred: (x: T) => boolean): Maybe<T> {
    return Maybe.of(this.value.find(pred));
  }

  /**
   * `ifind :: Foldable t => (Int -> a -> Bool) -> t a -> Maybe a`
   *
   * The `find` function takes a predicate and a structure and returns the
   * leftmost element of the structure matching the predicate, or `Nothing` if
   * there is no such element.
   */
  ifind<U extends T>(pred: (index: number) => (x: T) => x is U): Maybe<U>;
  ifind(pred: (index: number) => (x: T) => boolean): Maybe<T>;
  ifind(pred: (index: number) => (x: T) => boolean): Maybe<T> {
    return Maybe.of(this.value.find((e, i) => pred(i)(e)));
  }

  /**
   * `filter :: (a -> Bool) -> [a] -> [a]`
   *
   * `filter`, applied to a predicate and a list, returns the list of those
   * elements that satisfy the predicate.
   */
  filter<U extends T>(pred: (x: T) => x is U): List<U>;
  filter(pred: (x: T) => boolean): List<T>;
  filter(pred: (x: T) => boolean): List<T> {
    return List.of(...this.value.filter(pred));
  }

  /**
   * `ifilter :: (Int -> a -> Bool) -> [a] -> [a]`
   *
   * `ifilter`, applied to a predicate and a list, returns the list of those
   * elements that satisfy the predicate.
   */
  ifilter<U extends T>(pred: (index: number) => (x: T) => x is U): List<U>;
  ifilter(pred: (index: number) => (x: T) => boolean): List<T>;
  ifilter(pred: (index: number) => (x: T) => boolean): List<T> {
    return List.of(...this.value.filter((e, i) => pred(i)(e)));
  }

  // INDEXING LISTS

  /**
   * `elemIndex :: Eq a => a -> [a] -> Maybe Int`
   *
   * The `elemIndex` function returns the index of the first element in the
   * given list which is equal (by `==`) to the query element, or `Nothing` if
   * there is no such element.
   */
  elemIndex(x: T): Maybe<number> {
    const res = this.value.indexOf(x);

    return res > -1 ? Maybe.Just(res) : Maybe.Nothing();
  }

  /**
   * `elemIndices :: Eq a => a -> [a] -> [Int]`
   *
   * The `elemIndices` function extends `elemIndex`, by returning the indices of
   * all elements equal to the query element, in ascending order.
   */
  elemIndices(x: T): List<number> {
    return List.of(
      ...this.value.reduce<number[]>(
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
  findIndex(pred: (x: T) => boolean): Maybe<number> {
    const res = this.value.findIndex(pred);

    return res > -1 ? Maybe.Just(res) : Maybe.Nothing();
  }

  /**
   * `ifindIndex :: (Int -> a -> Bool) -> [a] -> Maybe Int`
   *
   * The `ifindIndex` function takes a predicate and a list and returns the
   * index of the first element in the list satisfying the predicate, or
   * `Nothing` if there is no such element.
   */
  ifindIndex(pred: (index: number) => (x: T) => boolean): Maybe<number> {
    const res = this.value.findIndex((e, i) => pred(i)(e));

    return res > -1 ? Maybe.Just(res) : Maybe.Nothing();
  }

  /**
   * `findIndices :: (a -> Bool) -> [a] -> [Int]`
   *
   * The `findIndices` function extends `findIndex`, by returning the indices of
   * all elements satisfying the predicate, in ascending order.
   */
  findIndices(pred: (x: T) => boolean): List<number> {
    return List.of(
      ...this.value.reduce<number[]>(
        (acc, e, index) => pred(e) ? [...acc, index] : acc,
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
  ifindIndices(pred: (index: number) => (x: T) => boolean): List<number> {
    return List.of(
      ...this.value.reduce<number[]>(
        (acc, e, index) => pred(index)(e) ? [...acc, index] : acc,
        []
      )
    );
  }

  // "SET" OPERATIONS

  /**
   * `delete :: Eq a => a -> [a] -> [a]`
   *
   * `delete x` removes the first occurrence of `x` from its list argument.
   */
  delete(x: T): List<T> {
    const index = this.value.findIndex(e => R.equals(e, x));

    return this.deleteAt(index);
  }

  // ORDERED LISTS

  /**
   * `sortBy :: (a -> a -> Ordering) -> [a] -> [a]`
   *
   * The `sortBy` function is the non-overloaded version of `sort`.
   */
  sortBy(fn: (a: T) => (b: T) => number): List<T> {
    return List.of(...[...this.value].sort((a, b) => fn(a)(b)));
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
  deleteAt(index: number): List<T> {
    if (index > 0 && index < this.value.length) {
      return List.of(
        ...this.value.slice(0, index),
        ...this.value.slice(index + 1)
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
  // setAt(index: number): (value: T) => List<T>;
  // setAt(index: number, value: T): List<T>;
  // setAt(index: number, value?: T): List<T> | ((value: T) => List<T>) {
  setAt(index: number, value: T): List<T> {
    const resultFn = (x1: number, x2: T): List<T> => {
      if (x1 > 0 && x1 < this.value.length) {
        return List.of(...this.value.map((e, i) => i === x1 ? x2 : e));
      }
      else {
        return this;
      }
    };

    // if (arguments.length === 2) {
    return resultFn(index, value!);
    // }
    // else {
    //   return x2 => resultFn(index, x2);
    // }
  }

  /**
   * `modifyAt :: Int -> (a -> a) -> [a] -> [a]`
   *
   * `modifyAt` applies a function to the element at the index.
   *
   * If the index is negative or exceeds list length, the original list will be
   * returned.
   */
  // modifyAt(index: number): (fn: (oldValue: T) => T) => List<T>;
  // modifyAt(index: number, fn: (oldValue: T) => T): List<T>;
  // modifyAt(
  //   index: number, fn?: (oldValue: T) => T
  // ): List<T> | ((fn: (oldValue: T) => T) => List<T>) {
  modifyAt(index: number, fn: (oldValue: T) => T): List<T> {
    const resultFn = (x1: number, x2: (oldValue: T) => T): List<T> => {
      if (x1 > 0 && x1 < this.value.length) {
        return List.of(...this.value.map((e, i) => i === x1 ? x2(e) : e));
      }
      else {
        return this;
      }
    };

    // if (arguments.length === 2) {
    return resultFn(index, fn!);
    // }
    // else {
    //   return x2 => resultFn(index, x2);
    // }
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
  // updateAt(index: number): (fn: (oldValue: T) => Maybe<T>) => List<T>;
  // updateAt(index: number, fn: (oldValue: T) => Maybe<T>): List<T>;
  // updateAt(
  //   index: number, fn?: (oldValue: T) => Maybe<T>
  // ): List<T> | ((fn: (oldValue: T) => Maybe<T>) => List<T>) {
  updateAt(index: number, fn: (oldValue: T) => Maybe<T>): List<T> {
    const resultFn = (x1: number, x2: (oldValue: T) => Maybe<T>): List<T> => {
      if (x1 > 0 && x1 < this.value.length) {
        const maybeRes = x2(this.value[x1]);

        if (Maybe.isJust(maybeRes)) {
          return this.setAt(x1, Maybe.fromJust(maybeRes));
        }
        else {
          return this.deleteAt(x1);
        }
      }
      else {
        return this;
      }
    };

    // if (arguments.length === 2) {
    return resultFn(index, fn!);
    // }
    // else {
    //   return x2 => resultFn(index, x2);
    // }
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
  // insertAt(index: number): (value: T) => List<T>;
  // insertAt(index: number, value: T): List<T>;
  // insertAt(index: number, value?: T): List<T> | ((value: T) => List<T>) {
  insertAt(index: number, value: T): List<T> {
    const resultFn = (x1: number, x2: T): List<T> => {
      if (x1 > 0 && x1 < this.value.length) {
        return List.of(
          ...this.value.slice(0, x1),
          x2,
          ...this.value.slice(x1)
        );
      }
      else if (x1 === this.value.length) {
        return this.append(x2);
      }
      else {
        return this;
      }
    };

    // if (arguments.length === 2) {
    return resultFn(index, value!);
    // }
    // else {
    //   return x2 => resultFn(index, x2);
    // }
  }

  // OWN METHODS

  /**
   * `append :: a -> [a]`
   *
   * Appends an element to the list.
   */
  append(e: T): List<T> {
    return List.of(...this.value, e);
  }

  toArray(): ReadonlyArray<T> {
    return this.value;
  }

  static of<T>(...initialElements: T[]): List<T> {
    return new List(...initialElements);
  }

  static find<T, U extends T>(
    pred: (x: T) => x is U
  ): (list: List<T>) => Maybe<U>;
  static find<T>(pred: (x: T) => boolean): (list: List<T>) => Maybe<T>;
  static find<T>(pred: (x: T) => boolean): (list: List<T>) => Maybe<T> {
    return list => list.find(pred);
  }

  static filter<T, U extends T>(
    pred: (x: T) => x is U
  ): (list: List<T>) => List<U>;
  static filter<T>(pred: (x: T) => boolean): (list: List<T>) => List<T>;
  static filter<T>(pred: (x: T) => boolean): (list: List<T>) => List<T> {
    return list => list.filter(pred);
  }

  static toMap<K, V>(list: List<Tuple<K, V>>): OrderedMap<K, V> {
    return OrderedMap.of(list.value.map(t =>
      [Tuple.fst(t), Tuple.snd(t)] as [K, V]
    ));
  }

  static toArray<T>(list: List<T>): ReadonlyArray<T> {
    return list.value;
  }

  static fromArray<T>(arr: ReadonlyArray<T>): List<T> {
    return List.of(...arr);
  }

  static isList(value: any): value is List<any> {
    return value instanceof List;
  }

  // INSTANCE METHODS AS STATIC METHODS

  // LIST TRANSFORMATIONS

  /**
   * `map :: (a -> b) -> [a] -> [b]`
   *
   * `map f xs` is the list obtained by applying `f` to each element of `xs`.
   */
  static map<T, U>(fn: (x: T) => U): (list: List<T>) => List<U>;
  static map<T, U>(fn: (x: T) => U, list: List<T>): List<U>;
  static map<T, U>(
    fn: (x: T) => U, list?: List<T>
  ): List<U> | ((list: List<T>) => List<U>) {
    if (arguments.length === 1) {
      return listParam => List.of(...listParam.value.map(fn))
    }
    else {
      return List.of(...list!.value.map(fn));
    }
  }

  // SPECIAL FOLDS

  static maximum(list: List<number>): number {
    return Math.max(...list.value);
  }
}

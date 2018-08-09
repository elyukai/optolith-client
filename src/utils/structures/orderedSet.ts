import * as Al from '../../types/algebraic';
import { List } from './list';
import { Some } from './maybe';

export class OrderedSet<T> implements Al.Functor<T>, Al.Foldable<T>,
  Al.Filterable<T> {
  private readonly value: ReadonlySet<T>;

  constructor(initial?: ReadonlySet<T> | T[] | List<T>) {
    // tslint:disable-next-line:prefer-conditional-expression
    if (initial instanceof Set) {
      this.value = initial;
    }
    else if (initial instanceof List) {
      this.value = new Set(List.toArray(initial));
    }
    else if (initial !== undefined) {
      this.value = new Set(initial);
    }
    else {
      this.value = new Set();
    }
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this.value[Symbol.iterator]();
  }

  // QUERY

  /**
   * `null :: Set a -> Bool`
   *
   * Is this the empty set?
   */
  null(): boolean {
    return this.value.size === 0;
  }

  /**
   * `size :: Set a -> Int`
   *
   * The number of elements in the set.
   */
  size(): number {
    return this.value.size;
  }

  /**
   * `member :: Ord a => a -> Set a -> Bool`
   *
   * Is the element in the set?
   */
  member(value: T): boolean {
    return this.value.has(value);
  }

  /**
   * `notMember :: Ord k => k -> Set a -> Bool`
   *
   * Is the element not in the set?
   */
  notMember(value: T): boolean {
    return !this.member(value);
  }

  // CONSTRUCTION

  /**
   * `insert :: Ord a => a -> Set a -> Set a`
   *
   * Insert an element in a set. If the set already contains an element equal to
   * the given value, it is replaced with the new value.
   */
  insert(value: T): OrderedSet<T> {
    return OrderedSet.of([...this.value, value]);
  }

  /**
   * `delete :: Ord a => a -> Set a -> Set a`
   *
   * Delete an element from a set.
   */
  delete(value: T): OrderedSet<T> {
    return OrderedSet.of([...this.value].filter(e => e !== value));
  }

  // COMBINE

  /**
   * `union :: Ord a => Set a -> Set a -> Set a`
   *
   * The union of two sets, preferring the first set when equal elements are
   * encountered.
   */
  union(add: OrderedSet<T>) {
    return OrderedSet.of([...this.value, ...add.value]);
  }

  // FILTER

  /**
   * `filter :: (a -> Bool) -> Set a -> Set a`
   *
   * Filter all values that satisfy the predicate.
   */
  filter<U extends T>(pred: (value: T) => value is U): OrderedSet<U>;
  filter(pred: (value: T) => boolean): OrderedSet<T>;
  filter(pred: (value: T) => boolean): OrderedSet<T> {
    return OrderedSet.of([...this.value].filter(pred));
  }

  // MAP

  /**
   * `map :: Ord b => (a -> b) -> Set a -> Set b`
   *
   * `map f s` is the set obtained by applying `f` to each element of `s`.
   *
   * It's worth noting that the size of the result may be smaller if, for some
   * `(x,y), x /= y && f x == f y`.
   */
  map<U>(fn: (value: T) => U): OrderedSet<U> {
    return OrderedSet.of([...this.value].map(fn));
  }

  // FOLDS

  /**
   * `foldl :: Foldable t => (b -> a -> b) -> b -> t a -> b`
   *
   * Fold the elements in the set using the given left-associative binary
   * operator, such that `foldl f z == foldl f z . toAscList`.
   */
  foldl<U extends Some>(fn: (acc: U) => (current: T) => U): (initial: U) => U;
  foldl<U extends Some>(fn: (acc: U) => (current: T) => U, initial: U): U;
  foldl<U extends Some>(
    fn: (acc: U) => (current: T) => U,
    initial?: U
  ): U | ((initial: U) => U) {
    const resultFn = (x1: (acc: U) => (current: T) => U) => (x2: U) =>
      [...this.value].reduce<U>((acc, e) => x1(acc)(e), x2);

    if (arguments.length === 2) {
      return resultFn(fn)(initial!);
    }

    return resultFn(fn);
  }

  toSet(): ReadonlySet<T> {
    return this.value;
  }

  // CONVERSION LIST

  /**
   * `elems :: Set a -> [a]`
   *
   * An alias of toAscList. The elements of a set in ascending order. Subject to
   * list fusion.
   */
  elems(): List<T> {
    return List.of(...this.value);
  }

  static of<T>(set: ReadonlySet<T> | T[] | List<T>): OrderedSet<T> {
    return new OrderedSet(set);
  }

  /**
   * `empty :: Set a`
   *
   * The empty set.
   */
  static empty<T>(): OrderedSet<T> {
    return new OrderedSet();
  }

  /**
   * `singleton :: a -> Set a`
   *
   * Create a singleton set.
   */
  static singleton<T>(value: T): OrderedSet<T> {
    return new OrderedSet([value]);
  }
}

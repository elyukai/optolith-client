import R from 'ramda';
import { List } from './list';
import { isSome, Just, Maybe } from './maybe';
import { Tuple } from './tuple';

export interface StringKeyObject<V> {
  readonly [id: string]: V;
}

export interface NumberKeyObject<V> {
  readonly [id: number]: V;
}

export type RecordInterface<T> = T extends Record<infer O> ? O : never;

export type RecordKey<K extends keyof T, T> =
  T[K] extends NonNullable<T[K]> ? Just<T[K]> : Maybe<NonNullable<T[K]>>;

export type RecordMaybe<T> = {
  [P in keyof T]: T[P] extends Maybe<infer M> ? M | undefined : T[P];
};

export type RecordWithMaybe<T> = {
  [P in keyof T]: T[P] extends NonNullable<T[P]> ? T[P] : Maybe<NonNullable<T[P]>>;
};

export type RecordSafeKeys<T> = {
  [K in keyof T]: T[K] extends NonNullable<T[K]> ? K : never;
}[keyof T];

type ObjectDeleteProperty<T, D extends keyof T> = {
  [K in Exclude<keyof T, D>]: T[K];
};

interface RecordBase {
  [key: string]: any
}

export class Record<T extends RecordBase> {
  private readonly value: T;

  constructor(initial: T) {
    this.value = initial;
  }

  // BASIC

  /**
   * `member :: String -> a -> Bool`
   *
   * Returns if the key is a member of the record and if the key holds a `Just`
   * when using `lookup key`.
   */
  member(key: string): boolean {
    return this.value.hasOwnProperty(key) && isSome(this.value[key]);
  }

  /**
   * `get :: String -> a -> a[String]`
   *
   * Returns the value at the given key. Only use for NonNullable properties,
   * use `lookup` otherwise.
   */
  get<K extends RecordSafeKeys<T>>(key: K): T[K] {
    return this.value[key];
  }

  /**
   * `lookup :: String -> a -> Maybe a[String]`
   *
   * Returns a `Maybe` of the requested value.
   */
  lookup<K extends keyof T>(key: K): RecordKey<K, T> {
    return Maybe.of(this.value[key]) as RecordKey<K, T>;
  }

  /**
   * `lookupWithDefault :: a[String] -> a -> String -> Record a -> a[String]`
   *
   * Returns the requested value if it exists. Returns the given default
   * otherwise.
   */
  lookupWithDefault<K extends keyof T>(
    def: NonNullable<T[K]>
  ): (key: K) => NonNullable<T[K]>;
  /**
   * `lookupWithDefault :: a[String] -> a -> String -> Record a -> a[String]`
   *
   * Returns the requested value if it exists. Returns the given default
   * otherwise.
   */
  lookupWithDefault<K extends keyof T>(
    def: NonNullable<T[K]>, key: K
  ): NonNullable<T[K]>;
  lookupWithDefault<K extends keyof T>(
    def: NonNullable<T[K]>, key?: K
  ): NonNullable<T[K]> | ((key: K) => NonNullable<T[K]>) {
    if (arguments.length === 2) {
      return Maybe.fromMaybe(def, this.lookup(key!));
    }

    return (x2: K) => Maybe.fromMaybe(def, this.lookup(x2));
  }

  // RECORD TRANSFORMATIONS

  /**
   * `insert :: keyof a -> a[keyof a] -> Record a -> Record a`
   *
   * Overwrites the value at the given key.
   */
  insert<K extends keyof T>(key: K): (value: T[K]) => Record<T>;
  /**
   * `insert :: keyof a -> a[keyof a] -> Record a -> Record a`
   *
   * Overwrites the value at the given key.
   */
  insert<K extends keyof T>(key: K, value: T[K]): Record<T>;
  insert<K extends keyof T>(
    key: K, value?: T[K]
  ): Record<T> | ((value: T[K]) => Record<T>) {
    if (arguments.length === 2) {
      return Record.of({ ...(this.value as any), [key]: value });
    }
    else {
      return x2 => Record.of({ ...(this.value as any), [key]: x2 });
    }
  }

  /**
   * `modify :: Ord k => (a -> a) -> k -> Record a -> Record a`
   *
   * Takes a function that is called with the current value at the given key.
   * The value returned by the function will replace the old value.
   */
  modify<K extends keyof T>(
    fn: (value: NonNullable<T[K]>) => NonNullable<T[K]>
  ): (key: K) => Record<T>;
  /**
   * `modify :: Ord k => (a -> a) -> k -> Record a -> Record a`
   *
   * Takes a function that is called with the current value at the given key.
   * The value returned by the function will replace the old value.
   */
  modify<K extends keyof T>(
    fn: (value: NonNullable<T[K]>) => NonNullable<T[K]>, key: K
  ): Record<T>;
  modify<K extends keyof T>(
    fn: (value: NonNullable<T[K]>) => NonNullable<T[K]>,
    key?: K
  ): Record<T> | ((key: K) => Record<T>) {
    const resultFn = (x1: (value: NonNullable<T[K]>) => NonNullable<T[K]>, x2: K) => {
      const entry = this.lookup(x2);
      if (Maybe.isJust(entry)) {
        const res = x1(Maybe.fromJust(entry as Just<NonNullable<T[K]>>));

        return Record.of({
          ...(this.value as any),
          [x2]: res
        });
      }
      else {
        return this;
      }
    };

    if (arguments.length === 2) {
      return resultFn(fn, key!);
    }
    else {
      return (x2: K) => resultFn(fn, x2);
    }
  }

  /**
   * `update :: Ord k => (a -> Maybe a) -> k -> Map k a -> Map k a`
   *
   * Accepts a function that takes the current value at the given key. The
   * function returns a `Maybe`. If it is a `Just`, it replaces the current
   * value. If it is a `Nothing`, it removes the key from the record.
   */
  update<K extends keyof T>(
    fn: (value: T[K]) => Maybe<NonNullable<T[K]>>
  ): (key: K) => Record<T>;
  /**
   * `update :: Ord k => (a -> Maybe a) -> k -> Map k a -> Map k a`
   *
   * Accepts a function that takes the current value at the given key. The
   * function returns a `Maybe`. If it is a `Just`, it replaces the current
   * value. If it is a `Nothing`, it removes the key from the record.
   */
  update<K extends keyof T>(
    fn: (value: T[K]) => Maybe<NonNullable<T[K]>>, key: K
  ): Record<T>;
  update<K extends keyof T>(
    fn: (value: T[K]) => Maybe<NonNullable<T[K]>>,
    key?: K
  ): Record<T> | ((key: K) => Record<T>) {
    const resultFn = (
      x1: (value: T[K]) => Maybe<NonNullable<T[K]>>, x2: K
    ) => {
      const entry = this.lookup(x2);
      if (Maybe.isJust(entry)) {
        const res = x1(Maybe.fromJust(entry));
        if (Maybe.isJust(res)) {
          return Record.of({
            ...(this.value as any),
            [x2]: Maybe.fromJust(res)
          });
        }
        else {
          const { [x2]: _, ...other } = (this.value as any);

          return Record.of(other);
        }
      }
      else {
        return this;
      }
    };

    if (arguments.length === 2) {
      return resultFn(fn, key!);
    }
    else {
      return (x2: K) => resultFn(fn, x2);
    }
  }

  /**
   * `alter :: (Maybe a[String] -> Maybe a[String]) -> String -> a ->
   * Maybe a[String]`
   *
   * `alter` alters the value at the given key, or absence thereof. `alter` can
   * be used to insert, modify, update or delete a value.
   */
  alter<K extends keyof T>(
    fn: (value: RecordKey<K, T>) => RecordKey<K, T>
  ): (key: K) => Record<T>;
  /**
   * `alter :: (Maybe a[String] -> Maybe a[String]) -> String -> a ->
   * Maybe a[String]`
   *
   * `alter` alters the value at the given key, or absence thereof. `alter` can
   * be used to insert, modify, update or delete a value.
   */
  alter<K extends keyof T>(
    fn: (value: RecordKey<K, T>) => RecordKey<K, T>,
    key: K
  ): Record<T>;
  alter<K extends keyof T>(
    fn: (value: RecordKey<K, T>) => RecordKey<K, T>,
    key?: K
  ): Record<T> | ((key: K) => Record<T>) {
    const resultFn = (
      x1: (value: RecordKey<K, T>) => RecordKey<K, T>,
      x2: K
    ): Record<T> => {
      const { [x2]: _, ...other } = this.value as any;
      const res = x1(this.lookup(x2));

      if (Maybe.isJust(res)) {
        const obj: T = {
          ...other,
          [x2]: Maybe.fromJust(res)
        };

        return Record.of(obj);
      }
      else {
        return Record.of(other as T);
      }
    };

    if (arguments.length === 2) {
      return resultFn(fn, key!);
    }
    else {
      return x2 => resultFn(fn, x2);
    }
  }

  /**
   * `delete :: String -> a -> b`
   *
   * Removes the key from the record.
   */
  delete<K extends keyof T>(key: K): Record<ObjectDeleteProperty<T, K>> {
    const {
      [key]: _,
      ...other
    } = this.value as any;

    return Record.of(other as ObjectDeleteProperty<T, K>);
  }

  // MERGING RECORDS

  /**
   * Merges the provided `Record` instance into the current `Record` instance.
   * If a key in the provided `Record` instance is also a member of the current
   * `Record` instance, the result contains the value from the provided (second)
   * `Record` instance.
   */
  merge<U>(record: Record<U>): Record<T & U> {
    return Record.of({
      ...(this.value as any),
      ...(record.value as any)
    });
  }

  /**
   * Merges the provided `Record` instance into the current `Record` instance.
   * If a key in the provided `Record` instance is also a member of the current
   * `Record` instance, the result contains the value from the provided (second)
   * `Record` instance.
   *
   * If a value is a `Maybe`, it will be unwrapped. If it is a `Just`, it will
   * overwrite the value in the current `Record` instance, if existent. If it is
   * a `Nothing`, it will delete the value in the current `Record` instance, if
   * existent.
   */
  mergeMaybe<U>(record: Record<U>): Record<T & RecordMaybe<U>> {
    return Record.of(Object.entries(record.value).reduce(
      (acc, [key, value]) => {
        if (value instanceof Maybe) {
          if (Maybe.isJust(value)) {
            return {
              ...acc,
              [key]: Maybe.fromJust(value),
            };
          }
          else {
            const { [key]: _, ...other } = acc;

            return other;
          }
        }
        else {
          return {
            ...acc,
            [key]: value,
          };
        }
      },
      { ...(this.value as any) }
    ));
  }

  // COMPARE

  /**
   * Compares the key-value pairs of the current instance with provided (second)
   * instance's ones. Returns `True` if completely equal.
   */
  equals(second: Record<T>): boolean {
    return R.equals(this.value, second.value);
  }

  // CONVERSION

  /**
   * Return all elements of the record.
   */
  elems(): List<T[keyof T]> {
    return List.of(...Object.values(this.value));
  }

  /**
   * Return all keys of the record.
   */
  keys(): List<keyof T> {
    return List.of(...Object.keys(this.value));
  }

  /**
   * Return all key/value pairs in the record.
   */
  assocs(): List<Tuple<keyof T, T[keyof T]>> {
    return List.of(
      ...Object.entries(this.value).map(([key, value]) => Tuple.of(key, value))
    );
  }

  // JS SPECIFIC

  toObject(): T {
    return this.value;
  }

  /**
   * Creates a new `Record` from the passed native plain object.
   */
  static of<T>(initial: T): Record<T> {
    return new Record(initial);
  }

  /**
   * Creates a new `Record` from the passed native plain object.
   *
   * If a value is a `Maybe`, it will be unwrapped. If it is a `Just`, it will
   * be unwrapped and written to it's key. If it is a `Nothing`, it will not be
   * included in the `Record` to create.
   */
  static ofMaybe<T>(initial: RecordWithMaybe<T>): Record<T> {
    return Record.of(Object.entries(initial).reduce(
      (acc, [key, value]) => {
        if (value instanceof Maybe) {
          if (Maybe.isJust(value)) {
            return {
              ...acc,
              [key]: Maybe.fromJust(value),
            };
          }
          else {
            const { [key]: _, ...other } = acc;

            return other;
          }
        }
        else {
          return {
            ...acc,
            [key]: value,
          };
        }
      },
      {} as any
    ));
  }

  /**
   * `get :: String -> a -> a[String]`
   *
   * Returns the value at the given key. Only use for NonNullable properties,
   * use `lookup` otherwise.
   */
  static get<T extends RecordBase, K extends RecordSafeKeys<T>>(key: K): (x: Record<T>) => T[K];
  /**
   * `get :: String -> a -> a[String]`
   *
   * Returns the value at the given key. Only use for NonNullable properties,
   * use `lookup` otherwise.
   */
  static get<T extends RecordBase, K extends RecordSafeKeys<T>>(key: K, x: Record<T>): T[K];
  static get<T extends RecordBase, K extends RecordSafeKeys<T>>(
    key: K,
    x?: Record<T>
  ): T[K] | ((x: Record<T>) => T[K]) {
    if (arguments.length === 2) {
      return x!.get(key);
    }
    else {
      return (p2: Record<T>) => p2.get(key);
    }
  }
}

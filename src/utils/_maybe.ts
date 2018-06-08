// type OnlyNil<T> = T extends null | undefined ? T : never;
// export type OrNot<T> = T | undefined;

// export interface Functor<T> {
//   map<U, X>(fn: (t: T) => U): Functor<U | X>;
//   map<U>(fn: (t: T) => U): Functor<U>;
// }

// export interface Monad<T> {
//   bind<U, X>(fn: (t: T) => Monad<U>): Monad<U | X>;
//   bind<U>(fn: (t: T) => Monad<U>): Monad<U>;
// }

// export interface Maybe<T> extends Functor<T>, Monad<T> {
//   map<U>(fn: (value: NonNullable<T>) => U): Maybe<U | OnlyNil<T>>;
//   bind<U>(fn: (value: NonNullable<T>) => Maybe<U>): Maybe<U | OnlyNil<T>>
//   valueOr<U>(or: U): NonNullable<T> | U;
//   reduce<U>(fn: (acc: U, current: NonNullable<T>) => U, acc: U): U;
//   toString(): string;
// }

// export const NIL = () => undefined;

// // export type Maybe<T> = Just<T> | Nothing;

// /**
//  * The Maybe type allows the programmer to specify something may not be there.
//  */
// export const Maybe = {
//   /**
//    * `from :: a -> Maybe a`
//    *
//    * Creates a new `Maybe` from the given value.
//    */
//   from<T>(value: T | null | undefined): Maybe<T> {
//     return value == null ? new Nothing() : new Just(value as NonNullable<T>);
//   },

//   /**
//    * `maybe :: b -> (a -> b) -> Maybe a -> b`
//    *
//    * The `maybe` function takes a default value, a function, and a `Maybe`
//    * value. If the `Maybe` value is `Nothing`, the function returns the default
//    * value. Otherwise, it applies the function to the value inside the `Just`
//    * and returns the result.
//    */
//   maybe<T, U>(defaultTo: U): (fn: (x: T) => U) => (m: Maybe<T>) => U {
//     return fn => m => m instanceof Nothing ? defaultTo : fn(this.fromJust(m));
//   },

//   /**
//    * `isJust :: Maybe a -> Bool`
//    *
//    * The `isJust` function returns `true` if its argument is of the form
//    * `Just _`.
//    */
//   isJust<T>(x: Maybe<T>): x is Just<NonNullable<T>> {
//     return x instanceof Just;
//   },

//   /**
//    * `isNothing :: Maybe a -> Bool`
//    *
//    * The `isNothing` function returns `true` if its argument is `Nothing`.
//    */
//   isNothing<T>(x: Maybe<T>): x is Nothing {
//     return x instanceof Nothing;
//   },

//   /**
//    * `fromJust :: Maybe a -> a`
//    *
//    * The `fromJust` function extracts the element out of a `Just` and throws an
//    * error if its argument is `Nothing`.
//    */
//   fromJust<T>(m: Maybe<T>): NonNullable<T> {
//     if (Maybe.isJust(m)) {
//       return m.value;
//     }

//     throw new TypeError(`Cannot extract a value out of type Nothing`);
//   },

//   /**
//    * `fromMaybe :: a -> Maybe a -> a`
//    *
//    * The `fromMaybe` function takes a default value and and `Maybe` value. If
//    * the `Maybe` is `Nothing`, it returns the default values; otherwise, it
//    * returns the value contained in the `Maybe`.
//    */
//   fromMaybe<T>(defaultTo: NonNullable<T>): <U>(m: Maybe<U>) => NonNullable<T> | NonNullable<U> {
//     return m => this.isJust(m) ? m.value : defaultTo;
//   },

//   /**
//    * `catMaybes :: [Maybe a] -> [a]`
//    *
//    * The `catMaybes` function takes a list of `Maybe`s and returns a list of all
//    * the `Just` values.
//    */
//   catMaybes<T>(
//     list: ReadonlyArray<Maybe<T>>
//   ): ReadonlyArray<NonNullable<T>> {
//     return list.reduce<NonNullable<T>[]>(
//       (acc, e) => Maybe.isJust(e) ? [...acc, e.value] : acc,
//       [],
//     );
//   },

//   /**
//    * `mapMaybe :: (a -> Maybe b) -> [a] -> [b]`
//    *
//    * The `mapMaybe` function is a version of `map` which can throw out elements.
//    * If particular, the functional argument returns something of type `Maybe b`.
//    * If this is `Nothing`, no element is added on to the result list. If it is
//    * `Just b`, then `b` is included in the result list.
//    */
//   mapMaybe<T, U>(
//     fn: (x: T) => Maybe<U>
//   ): (list: ReadonlyArray<T>) => ReadonlyArray<NonNullable<U>> {
//     return list => list.reduce<NonNullable<U>[]>(
//       (acc, e) => {
//         const res = fn(e);
//         return Maybe.isJust(res) ? [...acc, res.value] : acc;
//       },
//       [],
//     );
//   },
// };

// class Nothing implements Maybe<any> {
//   map(): Nothing {
//     return this;
//   }

//   bind(): Nothing {
//     return this;
//   }

//   valueOr<U>(or: U): U {
//     return or;
//   }

//   reduce<U>(_: any, initial: U): U {
//     return initial;
//   }

//   toString(): string {
//     return `Maybe.Nothing`;
//   }
// }

// class Just<T> implements Maybe<T> {
//   readonly value: NonNullable<T>;

//   constructor(value: NonNullable<T>) {
//     this.value = value;
//   }

//   map<U>(fn: (value: NonNullable<T>) => U): Maybe<U> {
//     return this.value == null
//       ? new Nothing()
//       : Maybe.from(fn(this.value));
//   }

//   bind<U>(fn: (value: NonNullable<T>) => Maybe<U>): Maybe<U> {
//     return this.value == null
//       ? new Nothing()
//       : fn(this.value as NonNullable<T>)
//   }

//   valueOr(): NonNullable<T> {
//     return this.value;
//   }

//   reduce<U>(fn: (acc: U, current: NonNullable<T>) => U, initial: U): U {
//     return fn(initial, this.value);
//   }

//   toString(): string {
//     return `Maybe.Just(${this.value})`;
//   }
// }

// export interface JustPartial<T> extends MaybeFunctor<T> {
//   value: NonNullable<T>;
//   isJust: true;
//   isNothing: false;
// }

// export interface Just<T> extends JustPartial<T> {
//   map<U>(fn: (value: NonNullable<T>) => U): Maybe<U>;
//   valueOr(): NonNullable<T>;
// }

// export interface NothingPartial<T> extends MaybeFunctor<T> {
//   value: JustNullable<T>;
//   isJust: false;
//   isNothing: true;
// }

// export interface Nothing<T> extends NothingPartial<T> {
//   map<U>(fn: (value: NonNullable<T>) => U): Maybe<JustNullable<T>>;
//   valueOr<U>(or: U): U;
// }

// export type Maybe<T> = NothingPartial<T> | JustPartial<T>;
// export type Maybe<T> = T extends null | undefined ? Nothing<T> : Just<T>;

// export interface MaybeStatic {
//   from<T>(x: T): Maybe<T>;
//   isJust<T>(x: Maybe<T>): x is Just<T>;
//   isNothing<T>(x: Maybe<T>): x is Nothing<T>;
// }

// const MaybeConstructor = <T>(value: T): Maybe<T> => ({
//   value,
//   isJust: value != null,
//   isNothing: value == null,
//   map(fn) {
//     if (value == null) {
//       return MaybeConstructor(value);
//     }
//     else {
//       return MaybeConstructor(fn(value as NonNullable<T>));
//     }
//   },
//   valueOr(or) {
//     return value == null ? or : value;
//   }
// }) as Maybe<T>;

// export const Maybe: MaybeStatic = {
//   from: x => MaybeConstructor(x),
//   isJust: <T>(x: Maybe<T>): x is Just<T> => x.isJust,
//   isNothing: <T>(x: Maybe<T>): x is Nothing<T> => x.isNothing,
// };



// // semigroup
// Just.prototype.concat = function(that) {
//   return that.isNothing ? this : this.of(
//     this.value.concat(that.value)
//   );
// };

// Nothing.prototype.concat = util.identity;

// // apply
// // takes a Maybe that wraps a function (`app`) and applies its `map`
// // method to this Maybe's value, which must be a function.
// Just.prototype.ap = function(m) {
//   return m.map(this.value);
// };

// Nothing.prototype.ap = util.returnThis;

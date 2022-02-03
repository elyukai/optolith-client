import { Just as OldJust, Maybe as OldMaybe, maybe as oldMaybe, Nothing as OldNothing } from "../../Data/Maybe"

// type NothingValue = { readonly tag: "Nothing" }
// type JustValue<T> = { readonly tag: "Just", readonly value: T }
// type Value<T> = NothingValue | JustValue<T>

// const isNonNullable = <T>(x: T): x is NonNullable<T> => x != null

// export class Maybe<T> {
//   readonly value: Value<T>

//   private constructor(value: Value<T>) {
//     this.value = value
//   }

//   static Nothing = Object.freeze(new Maybe<any>({ tag: "Nothing" })) as Maybe<any>

//   static Just<T>(value: T) {
//     return Object.freeze(new Maybe({ tag: "Just", value })) as Maybe<T>
//   }

//   static Nullable<T>(x: T | null | undefined): Maybe<NonNullable<T>> {
//     return isNonNullable(x) ? Maybe.Just(x) : Maybe.Nothing
//   }

//   map<U>(f: (x: T) => U): Maybe<U> {
//     switch (this.value.tag) {
//       case "Just":    return Maybe.Just(f(this.value.value))
//       case "Nothing": return Maybe.Nothing
//     }
//   }

//   bind<U>(f: (x: T) => Maybe<U>): Maybe<U> {
//     switch (this.value.tag) {
//       case "Just":    return f(this.value.value)
//       case "Nothing": return Maybe.Nothing
//     }
//   }

//   fromMaybe(def: T): T {
//     switch (this.value.tag) {
//       case "Just":    return this.value.value
//       case "Nothing": return def
//     }
//   }

//   maybe<U>(def: U, f: (x: T) => U): U {
//     switch (this.value.tag) {
//       case "Just":    return f(this.value.value)
//       case "Nothing": return def
//     }
//   }

//   isNothing(): this is Nothing {
//     return this.value.tag === "Nothing"
//   }

//   isJust(): this is Just<T> {
//     return this.value.tag === "Just"
//   }

//   elem<U extends T>(x: U): this is Just<U>
//   elem(x: T): boolean {
//     switch (this.value.tag) {
//       case "Just":    return this.value.value === x
//       case "Nothing": return false
//     }
//   }

//   sum(this: Maybe<number>): number {
//     switch (this.value.tag) {
//       case "Just":    return this.value.value
//       case "Nothing": return 0
//     }
//   }

//   product(this: Maybe<number>): number {
//     switch (this.value.tag) {
//       case "Just":    return this.value.value
//       case "Nothing": return 1
//     }
//   }

//   any<U extends T>(pred: (x: T) => x is U): this is Just<U>
//   any(pred: (x: T) => boolean): boolean
//   any(pred: (x: T) => boolean): boolean {
//     switch (this.value.tag) {
//       case "Just":    return pred(this.value.value)
//       case "Nothing": return false
//     }
//   }

//   alt(x: Maybe<T>): Maybe<T> {
//     switch (this.value.tag) {
//       case "Just":    return this
//       case "Nothing": return x
//     }
//   }

//   altLazy(x: () => Maybe<T>): Maybe<T> {
//     switch (this.value.tag) {
//       case "Just":    return this
//       case "Nothing": return x()
//     }
//   }

//   toOldMaybe(): OldMaybe<T> {
//     switch (this.value.tag) {
//       case "Just":    return OldJust(this.value.value)
//       case "Nothing": return OldNothing
//     }
//   }

//   liftM2<U, R>(this: Maybe<T>, m2: Maybe<U>, f: (x1: T, x2: U) => R): Maybe<R> {
//     return this.bind(x1 => m2.map(x2 => f(x1, x2)))
//   }

//   liftM3<U, V, R>(m2: Maybe<U>, m3: Maybe<V>, f: (x1: T, x2: U, x3: V) => R): Maybe<R> {
//     return this.bind(x1 => m2.bind(x2 => m3.map(x3 => f(x1, x2, x3))))
//   }

//   liftM4<U, V, W, R>(m2: Maybe<U>, m3: Maybe<V>, m4: Maybe<W>, f: (x1: T, x2: U, x3: V, x4: W) => R): Maybe<R> {
//     return this.bind(x1 => m2.bind(x2 => m3.bind(x3 => m4.map(x4 => f(x1, x2, x3, x4)))))
//   }

//   liftM5<U, V, W, X, R>(m2: Maybe<U>, m3: Maybe<V>, m4: Maybe<W>, m5: Maybe<X>, f: (x1: T, x2: U, x3: V, x4: W, x5: X) => R): Maybe<R> {
//     return this.bind(x1 => m2.bind(x2 => m3.bind(x3 => m4.bind(x4 => m5.map(x5 => f(x1, x2, x3, x4, x5))))))
//   }
// }

// interface Nothing extends Maybe<any> {
//   readonly value: NothingValue
//   map(): Nothing
//   bind(): Nothing
//   fromMaybe<T>(def: T): T
//   maybe<T>(def: T): T
//   isNothing(): true
//   isJust(): false
//   elem(): false
//   sum(): number
//   product(): number
//   any(): false
//   alt<T>(x: Maybe<T>): Maybe<T>
//   altLazy<T>(x: () => Maybe<T>): Maybe<T>
//   toOldMaybe(): OldNothing
// }

// interface Just<T> extends Maybe<T> {
//   readonly value: JustValue<T>
//   map<U>(f: (x: T) => U): Just<U>
//   bind<U>(f: (x: T) => Maybe<U>): Maybe<U>
//   fromMaybe(): T
//   maybe<U>(_: any, f: (x: T) => U): U
//   isNothing(): false
//   isJust(): true
//   elem<U extends T>(x: U): this is Just<U>
//   elem(x: T): boolean
//   sum(this: Just<number>): number
//   product(this: Just<number>): number
//   any<U extends T>(pred: (x: T) => x is U): this is Just<U>
//   any(pred: (x: T) => boolean): boolean
//   alt(): Just<T>
//   altLazy(): Just<T>
//   toOldMaybe(): OldJust<T>
// }

// export const Nothing = Maybe.Nothing

// export const Just = Maybe.Just

// export const Nullable = Maybe.Nullable

// export const ensure: {
//   <T, U extends T>(x: T, pred: (x: T) => x is U): Maybe<U>
//   <T>(x: T, pred: (x: T) => boolean): Maybe<T>
// } = <T>(x: T, pred: (x: T) => boolean): Maybe<T> =>
//   pred(x) ? Just(x) : Nothing

// export const toNewMaybe = <T>(x: OldMaybe<T>): Maybe<T> =>
//   oldMaybe<Maybe<T>>(Nothing)<T>(Just)(x)

interface BaseMaybe<T> {
  isNothing: boolean

  isJust: boolean

  map<U>(this: Maybe<T>, f: (x: T) => U): Maybe<U>

  bind<U>(this: Maybe<T>, f: (x: T) => Maybe<U>): Maybe<U>

  fromMaybe (this: Maybe<T>, def: T): T

  maybe<U>(this: Maybe<T>, def: U, f: (x: T) => U): U

  elem<U extends T>(this: Maybe<T>, x: U): this is Just<U>

  elem (this: Maybe<T>, x: T): boolean

  sum (this: Maybe<number>): number

  product (this: Maybe<number>): number

  any<U extends T>(this: Maybe<T>, pred: (x: T) => x is U): this is Just<U>

  any (this: Maybe<T>, pred: (x: T) => boolean): boolean

  any (this: Maybe<T>, pred: (x: T) => boolean): boolean

  alt (this: Maybe<T>, x: Maybe<T>): Maybe<T>

  altLazy (this: Maybe<T>, x: () => Maybe<T>): Maybe<T>

  liftM2<U, R>(this: Maybe<T>, m2: Maybe<U>, f: (x1: T, x2: U) => R): Maybe<R>

  liftM3<U, V, R>(
    this: Maybe<T>,
    m2: Maybe<U>,
    m3: Maybe<V>,
    f: (x1: T, x2: U, x3: V) => R
  ): Maybe<R>

  liftM4<U, V, W, R>(
    this: Maybe<T>,
    m2: Maybe<U>,
    m3: Maybe<V>,
    m4: Maybe<W>,
    f: (x1: T, x2: U, x3: V, x4: W) => R
  ): Maybe<R>

  liftM5<U, V, W, X, R>(
    this: Maybe<T>,
    m2: Maybe<U>,
    m3: Maybe<V>,
    m4: Maybe<W>,
    m5: Maybe<X>,
    f: (x1: T, x2: U, x3: V, x4: W, x5: X) => R
  ): Maybe<R>

  toUndefined (this: Maybe<T>): T | undefined

  toNullable (this: Maybe<T>): T | null

  toOldMaybe (this: Maybe<T>): OldMaybe<T>
}

class Nothing implements BaseMaybe<never> {
  private constructor () { }

  static singleton = Object.freeze (new Nothing ()) as Nothing

  isNothing: true = true

  isJust: false = false

  map () {
    return this
  }

  bind () {
    return this
  }

  // eslint-disable-next-line class-methods-use-this
  fromMaybe<U>(this: Maybe<U>, def: U) {
    return def
  }

  // eslint-disable-next-line class-methods-use-this
  maybe<U>(def: U) {
    return def
  }

  // eslint-disable-next-line class-methods-use-this
  elem () {
    return false
  }

  // eslint-disable-next-line class-methods-use-this
  sum () {
    return 0
  }

  // eslint-disable-next-line class-methods-use-this
  product () {
    return 1
  }

  // eslint-disable-next-line class-methods-use-this
  any () {
    return false
  }

  // eslint-disable-next-line class-methods-use-this
  alt<T>(x: Maybe<T>) {
    return x
  }

  // eslint-disable-next-line class-methods-use-this
  altLazy<T>(x: () => Maybe<T>) {
    return x ()
  }

  liftM2 () {
    return this
  }

  liftM3 () {
    return this
  }

  liftM4 () {
    return this
  }

  liftM5 () {
    return this
  }

  // eslint-disable-next-line class-methods-use-this
  toUndefined () {
    return undefined
  }

  // eslint-disable-next-line class-methods-use-this
  toNullable () {
    return null
  }

  // eslint-disable-next-line class-methods-use-this
  toOldMaybe () {
    return OldNothing
  }
}

class Just<T> implements BaseMaybe<T> {
  constructor (readonly value: T) { }

  isNothing: false = false

  isJust: true = true

  map<U>(f: (x: T) => U) {
    return new Just (f (this.value))
  }

  bind<U>(f: (x: T) => Maybe<U>) {
    return f (this.value)
  }

  fromMaybe () {
    return this.value
  }

  maybe<U>(def: U, f: (x: T) => U) {
    return f (this.value)
  }

  elem (x: T) {
    return this.value === x
  }

  sum (this: Maybe<number>) {
    return (this as Just<number>).value
  }

  product (this: Maybe<number>) {
    return (this as Just<number>).value
  }

  any (pred: (x: T) => boolean) {
    return pred (this.value)
  }

  alt () {
    return this
  }

  altLazy () {
    return this
  }

  liftM2<U, R>(this: Maybe<T>, m2: Maybe<U>, f: (x1: T, x2: U) => R): Maybe<R> {
    return this.bind (x1 => m2.map (x2 => f (x1, x2)))
  }

  liftM3<U, V, R>(
    this: Maybe<T>,
    m2: Maybe<U>,
    m3: Maybe<V>,
    f: (x1: T, x2: U, x3: V) => R
  ): Maybe<R> {
    return this.bind (x1 => m2.bind (x2 => m3.map (x3 => f (x1, x2, x3))))
  }

  liftM4<U, V, W, R>(
    this: Maybe<T>,
    m2: Maybe<U>,
    m3: Maybe<V>,
    m4: Maybe<W>,
    f: (x1: T, x2: U, x3: V, x4: W) => R
  ): Maybe<R> {
    return this.bind (x1 => m2.bind (x2 => m3.bind (x3 => m4.map (x4 => f (x1, x2, x3, x4)))))
  }

  liftM5<U, V, W, X, R>(
    this: Maybe<T>,
    m2: Maybe<U>,
    m3: Maybe<V>,
    m4: Maybe<W>,
    m5: Maybe<X>,
    f: (x1: T, x2: U, x3: V, x4: W, x5: X) => R
  ): Maybe<R> {
    return this.bind (x1 =>
      m2.bind (x2 =>
        m3.bind (x3 =>
          m4.bind (x4 =>
            m5.map (x5 =>
              f (x1, x2, x3, x4, x5))))))
  }

  toUndefined () {
    return this.value
  }

  toNullable () {
    return this.value
  }

  toOldMaybe () {
    return OldJust (this.value)
  }
}

type Maybe<T> = (Just<T> | Nothing)

const Nothing$ = Nothing.singleton

const Just$ = <T>(value: T) => new Just (value)

const isNonNullable = <T>(x: T): x is NonNullable<T> => x !== null && x !== undefined

export const Nullable = <T>(x: T | null | undefined): Maybe<NonNullable<T>> =>
  isNonNullable (x) ? Just$ (x) : Nothing$

export {
  Maybe,
  Nothing$ as Nothing,
  Just$ as Just,
}

export const ensure: {
  <T, U extends T>(x: T, pred: (x: T) => x is U): Maybe<U>
  <T>(x: T, pred: (x: T) => boolean): Maybe<T>
} = <T>(x: T, pred: (x: T) => boolean): Maybe<T> =>
  pred (x) ? Just$ (x) : Nothing$

export const toNewMaybe = <T>(x: OldMaybe<T>): Maybe<T> =>
  oldMaybe<Maybe<T>> (Nothing$)<T> (Just$) (x)

declare global {
  interface Array<T> {
    mapMaybe<U>(f: (x: T) => Maybe<U>): U[]
    catMaybes<T extends Maybe<any>, U extends (T extends Just<infer I> ? I : never)>(): U[]
    mapM<U>(f: (x: T) => Maybe<U>): Maybe<U[]>
  }

  interface ReadonlyArray<T> {
    mapMaybe<U>(f: (x: T) => Maybe<U>): readonly U[]
    catMaybes<T extends Maybe<any>, U extends (T extends Just<infer I> ? I : never)>(): readonly U[]
    mapM<U>(f: (x: T) => Maybe<U>): Maybe<readonly U[]>
  }
}

Array.prototype.mapMaybe = function mapMaybe<T, U> (this: T[], f: (x: T) => Maybe<U>): U[] {
  return this.reduce<U[]> (
    (prev, current) =>
      f (current).maybe (prev, y => {
        prev.push (y)

        return prev
      }),
    []
  )
}

Array.prototype.catMaybes = function catMaybes<
  T extends Maybe<any>,
  U extends (T extends Just<infer I> ? I : never)
> (this: T[]): U[] {
  return this.reduce<U[]> (
    (prev, current) =>
      current.maybe (prev, y => {
        prev.push (y)

        return prev
      }),
    []
  )
}

Array.prototype.mapM = function mapM<T, U> (this: T[], f: (x: T) => Maybe<U>): Maybe<U[]> {
  return this.reduce<Maybe<U[]>> (
    (prev, current) =>
      prev.bind (ys =>
        f (current).map (y => {
          ys.push (y)

          return ys
        })),
    Just$ ([])
  )
}

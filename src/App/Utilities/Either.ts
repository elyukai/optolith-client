/* eslint-disable @typescript-eslint/no-use-before-define */
import { Either as OldEither, either as oldEither } from "../../Data/Either"
import { Just, Maybe, Nothing } from "./Maybe"

interface BaseEither<L, R> {
  isLeft: boolean

  isRight: boolean

  map<S>(this: Either<L, R>, f: (x: R) => S): Either<L, S>

  bind<S>(this: Either<L, R>, f: (x: R) => Either<L, S>): Either<L, S>

  toMaybe (this: Either<L, R>): Maybe<R>

  first<M>(this: Either<L, R>, f: (x: L) => M): Either<M, R>

  second<S>(this: Either<L, R>, f: (x: R) => S): Either<L, S>

  bimap<M, S>(this: Either<L, R>, left: (x: L) => M, right: (x: R) => S): Either<M, S>

  either<A>(this: Either<L, R>, left: (x: L) => A, right: (x: R) => A): A

  toOldEither (this: Either<L, R>): OldEither<L, R>
}

class Left<L> implements BaseEither<L, never> {
  constructor (readonly value: L) { }

  readonly isLeft: true = true

  readonly isRight: false = false

  map () {
    return this
  }

  bind () {
    return this
  }

  // eslint-disable-next-line class-methods-use-this
  toMaybe () {
    return Nothing
  }

  first<M>(f: (x: L) => M) {
    return new Left (f (this.value))
  }

  second () {
    return this
  }

  bimap<M>(left: (x: L) => M) {
    return new Left (left (this.value))
  }

  either<A>(left: (x: L) => A) {
    return left (this.value)
  }

  toOldEither () {
    return OldEither.Left (this.value)
  }
}

class Right<R> implements BaseEither<never, R> {
  constructor (readonly value: R) { }

  readonly isLeft: false = false

  readonly isRight: true = true

  map<S>(f: (value: R) => S) {
    return new Right (f (this.value))
  }

  bind<L, S>(f: (value: R) => Either<L, S>) {
    return f (this.value)
  }

  toMaybe () {
    return Just (this.value)
  }

  first () {
    return this
  }

  second<S>(f: (value: R) => S) {
    return new Right (f (this.value))
  }

  bimap<S>(left: unknown, right: (x: R) => S) {
    return new Right (right (this.value))
  }

  either<A>(left: unknown, right: (x: R) => A) {
    return right (this.value)
  }

  toOldEither () {
    return OldEither.Right (this.value)
  }
}

type Either<L, R> = (Left<L> | Right<R>) & BaseEither<L, R>

const Left$ = <L>(value: L) => new Left (value)

const Right$ = <R>(value: R) => new Right (value)

export const toNewEither = <L, R>(x: OldEither<L, R>): Either<L, R> =>
oldEither<L, Either<L, R>> (Left$)<R> (Right$) (x)

export {
  Left$ as Left,
  Right$ as Right,
  Either,
}

declare global {
  interface Array<T> {
    mapE<L, R>(this: T[], f: (x: T) => Either<L, R>): Either<L, R[]>
  }
}

Array.prototype.mapE =
  function mapE<T, L, R> (this: T[], f: (x: T) => Either<L, R>): Either<L, R[]> {
    return this.reduce<Either<L, R[]>> (
      (prev, current) =>
        prev.bind (ys =>
          f (current).map (y => {
            ys.push (y)

            return ys
          })),
      Right$ ([])
    )
  }

// abstract class BaseEither<L, R> {
//   constructor (protected readonly tagged: { tag: "Left"; value: L } | { tag: "Right"; value: R }) {}

//   isLeft (): this is Left<L> {
//     return this.tagged.tag === "Left"
//   }

//   isRight (): this is Right<R> {
//     return this.tagged.tag === "Right"
//   }

//   map<S>(this: Either<L, R>, f: (x: R) => S): Either<L, S> {
//     return this.isRight () ? new Right (f (this.value)) : this
//   }

//   bind<S>(this: Either<L, R>, f: (x: R) => Either<L, S>): Either<L, S> {
//     return this.isRight () ? f (this.value) : this
//   }

//   toMaybe (this: Either<L, R>): Maybe<R> {
//     return this.isRight () ? Just (this.value) : Nothing
//   }

//   first<M>(this: Either<L, R>, f: (x: L) => M): Either<M, R> {
//     return this.isRight () ? this : new Left (f (this.value))
//   }

//   second<S>(this: Either<L, R>, f: (x: R) => S): Either<L, S> {
//     return this.isRight () ? new Right (f (this.value)) : this
//   }

//   bimap<M, S>(this: Either<L, R>, left: (x: L) => M, right: (x: R) => S): Either<M, S> {
//     return this.isRight () ? new Right (right (this.value)) : new Left (left (this.value))
//   }

//   either<A>(this: Either<L, R>, left: (x: L) => A, right: (x: R) => A): A {
//     return this.isRight () ? right (this.value) : left (this.value)
//   }

//   toOldEither (this: Either<L, R>): OldEither<L, R> {
//     return this.isRight () ? OldEither.Right (this.value) : OldEither.Left (this.value)
//   }
// }

// class Left<L> extends BaseEither<L, never> {
//   declare protected readonly tagged: { tag: "Left"; value: L }

//   constructor (value: L) {
//     super ({ tag: "Left", value })
//   }

//   get value () {
//     return this.tagged.value
//   }
// }

// class Right<R> extends BaseEither<never, R> {
//   declare protected readonly tagged: { tag: "Right"; value: R }

//   constructor (value: R) {
//     super ({ tag: "Right", value })
//   }

//   get value () {
//     return this.tagged.value
//   }
// }

// type Either<L, R> = Left<L> | Right<R>

// type TaggedEither<L, R> = { tag: "Left"; value: L } | { tag: "Right"; value: R }

// export class Either<L, R> {
//   readonly #tagged: TaggedEither<L, R>

//   private constructor (tagged: TaggedEither<L, R>) {
//     this.#tagged = tagged
//   }

//   static Left<L>(value: L) {
//     return new Either<L, never> ({ tag: "Left", value })
//   }

//   static Right<R>(value: R) {
//     return new Either<never, R> ({ tag: "Right", value })
//   }

//   map<S>(f: (x: R) => S): Either<L, S> {
//     switch (this.#tagged.tag) {
//       case "Left": return (this as Either<L, S>)
//       case "Right": return Either.Right (f (this.#tagged.value))
//       default: return this.#tagged
//     }
//   }

//   bind<S>(f: (x: R) => Either<L, S>): Either<L, S> {
//     return this.isRight () ? f (this.value) : this
//   }

//   toMaybe (): Maybe<R> {
//     return this.isRight () ? Just (this.value) : Nothing
//   }

//   first<M>(f: (x: L) => M): Either<M, R> {
//     return this.isRight () ? this : new Left (f (this.value))
//   }

//   second<S>(f: (x: R) => S): Either<L, S> {
//     return this.isRight () ? new Right (f (this.value)) : this
//   }

//   bimap<M, S>(left: (x: L) => M, right: (x: R) => S): Either<M, S> {
//     return this.isRight () ? new Right (right (this.value)) : new Left (left (this.value))
//   }

//   either<A>(left: (x: L) => A, right: (x: R) => A): A {
//     return this.isRight () ? right (this.value) : left (this.value)
//   }

//   toOldEither (): OldEither<L, R> {
//     return this.isRight () ? OldEither.Right (this.value) : OldEither.Left (this.value)
//   }
// }

// class Left<L> {
//   readonly isLeft = true
//   readonly isRight = false
//   constructor(readonly value: L) {}

//   map() {
//     return this
//   }

//   bind() {
//     return this
//   }

//   toMaybe() {
//     return Nothing
//   }

//   first<M>(f: (x: L) => M) {
//     return new Left(f(this.value))
//   }

//   bimap<M>(f: (x: L) => M) {
//     return new Left(f(this.value))
//   }

//   either<A>(f: (x: L) => A) {
//     return f(this.value)
//   }

//   toOldEither() {
//     return OldEither.Left(this.value)
//   }
// }

// class Right<R> {
//   readonly isLeft = false
//   readonly isRight = true
//   constructor(readonly value: R) {}

//   map<S>(f: (value: R) => S) {
//     return new Right(f(this.value))
//   }

//   bind<S>(f: (value: R) => Either<unknown, S>) {
//     return f(this.value)
//   }

//   toMaybe() {
//     return Just(this.value)
//   }

//   first() {
//     return this
//   }

//   bimap<S>(_: any, f: (x: R) => S) {
//     return new Right(f(this.value))
//   }

//   either<A>(_: any, f: (x: R) => A) {
//     return f(this.value)
//   }

//   toOldEither() {
//     return OldEither.Right(this.value)
//   }
// }

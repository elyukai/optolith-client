/**
 * @module Control.Applicative
 *
 * This module describes a structure intermediate between a functor and a monad
 * (technically, a strong lax monoidal functor). Compared with monads, this
 * interface lacks the full power of the binding operation `>>=`.
 *
 * @author Lukas Obermann
 */

import { Either, fromRight_, isEither, isRight, Right } from "../Data/Either";
import { fmap } from "../Data/Functor";
import { Cons, head, isList, isNil, List, Nil } from "../Data/List";
import { fromJust, isJust, isMaybe, Just, Maybe, Nothing, Some } from "../Data/Maybe";
import { showP } from "../Data/Show";
import { Identity, isIdentity, runIdentity } from "./Monad/Identity";

export type Applicative<A> = Either<any, A>
                           | Identity<A>
                           | List<A>
                           | Maybe<A>

type ApplicativeStr = "Either" | "Identity" | "List" | "Maybe"

interface ApplicativePure {
  (t: "Identity"): <A> (x: A) => Identity<A>
  (t: "Either"): <A> (x: A) => Right<A>
  (t: "List"): <A> (x: A) => Cons<A>
  (t: "Maybe"): <A extends Some> (x: A) => Just<A>
}

/**
 * `pure :: a -> f a`
 *
 * Lift a value.
 */
export const pure: ApplicativePure =
  (t: ApplicativeStr) =>
  <A>
  (x: A): any => {
    if (t === "List") {
      return Cons (x, Nil)
    }

    if (t === "Either") {
      return Right (x)
    }

    if (t === "Identity") {
      return Identity (x)
    }

    if (t === "Maybe") {
      return Just (x)
    }

    throw new TypeError (applicativeInstanceErrorMsg ("pure") (x))
  }

interface ApplicativeAp {
  <A, B> (fs: List<(x: A) => B>): (xs: List<A>) => List<B>
  <E, A, B> (ff: Either<E, (x: A) => B>): (x: Either<E, A>) => Either<E, B>
  <A, B> (ff: Identity<(x: A) => B>): (x: Identity<A>) => Identity<B>
  <A extends Some, B extends Some> (ff: Maybe<(x: A) => B>): (x: Maybe<A>) => Maybe<B>
}

/**
 * `(<*>) :: f (a -> b) -> f a -> f b`
 *
 * Sequential application.
 */
export const ap: ApplicativeAp =
  (ff: any) =>
  (x: any): any => {
    if (isList (ff)) {
      if (isList (x)) {
        return isNil (ff) || isNil (x)
          ? Nil
          : mapAp (head (ff)) (ap (ff .xs) (x)) (x)
      }

      throw new TypeError (applicativeDifferentInstanceErrorMsg ("<*>") (ff) (x))
    }

    if (isEither (ff)) {
      if (isEither (x)) {
        return isRight (ff) ? fmap (fromRight_ (ff)) (x) : ff
      }

      throw new TypeError (applicativeDifferentInstanceErrorMsg ("<*>") (ff) (x))
    }

    if (isIdentity (ff)) {
      if (isIdentity (x)) {
        return fmap (runIdentity (ff)) (x)
      }

      throw new TypeError (applicativeDifferentInstanceErrorMsg ("<*>") (ff) (x))
    }

    if (isMaybe (ff)) {
      if (isMaybe (x)) {
        return isJust (ff) ? fmap (fromJust (ff)) (x) : ff
      }

      throw new TypeError (applicativeDifferentInstanceErrorMsg ("<*>") (ff) (x))
    }

    throw new TypeError (applicativeInstanceErrorMsg ("<*>") (ff))
  }

const mapAp =
  <A, B>
  (f: (x: A) => B) =>
  (xs: List<B>) =>
  (x: List<A>): List<B> =>
    isNil (x)
    ? xs
    : Cons (f (x .x), mapAp (f) (xs) (x .xs))

export const Applicative = {
  pure,
  ap,
}


// ALTERNATIVE

export type Alternative<A> = List<A>
                           | Maybe<A>

type AlternativeStr = "List" | "Maybe"

interface AlternativeAlt {
  <A> (x: List<A>): (y: List<A>) => List<A>
  <A extends Some> (x: Maybe<A>): (y: Maybe<A>) => Maybe<A>
}

/**
 * `alt :: f a -> f a -> f a`
 *
 * Returns the first `Alternative` if it is not `empty`, otherwise the second.
 */
export const alt: AlternativeAlt =
  (x: any) => (y: any): any => {
    if (isList (x)) {
      if (isList (y)) {
        return isNil (x) ? y : x
      }

      throw new TypeError (alternativeDifferentInstanceErrorMsg ("<*>") (x) (y))
    }

    if (isMaybe (x)) {
      if (isMaybe (y)) {
        return isJust (x) ? x : y
      }

      throw new TypeError (alternativeDifferentInstanceErrorMsg ("<*>") (x) (y))
    }

    throw new TypeError (alternativeInstanceErrorMsg ("<*>") (x))
  }

interface AlternativeAlt_ {
  <A> (x: List<A>): (g: () => List<A>) => List<A>
  <A extends Some> (x: Maybe<A>): (g: () => Maybe<A>) => Maybe<A>
}

/**
 * `alt' :: f a -> (() -> f a) -> f a`
 *
 * Returns the first `Alternative` if it is not `empty`, otherwise the second.
 *
 * Lazy version of `alt`.
 */
export const alt_: AlternativeAlt_ =
  (x: any) => (g: () => any): any => {
    if (isList (x)) {
      return isNil (x) ? g () : x
    }

    if (isMaybe (x)) {
      return isJust (x) ? x : g ()
    }

    throw new TypeError (alternativeInstanceErrorMsg ("<*>") (x))
  }

interface AlternativeAltF {
  <A> (y: List<A>): (x: List<A>) => List<A>
  <A extends Some> (y: Maybe<A>): (x: Maybe<A>) => Maybe<A>
}

/**
 * `altF :: f a -> f a -> f a`
 *
 * Returns the second `Alternative` if it is not `empty`, otherwise the first.
 *
 * Flipped version of `alt`.
 */
export const altF: AlternativeAltF = (y: any) => (x: any): any => alt (x) (y)

interface AlternativeAltF_ {
  <A> (g: () => List<A>): (x: List<A>) => List<A>
  <A extends Some> (g: () => Maybe<A>): (x: Maybe<A>) => Maybe<A>
}

/**
 * `altF' :: (() -> f a) -> f a -> f a`
 *
 * Returns the second `Alternative` if it is not `empty`, otherwise the first.
 *
 * Flipped version of `alt'`.
 */
export const altF_: AlternativeAltF_ =
  (g: () => any) => (x: any): any =>
    alt_ (x) (g)

interface AlternativeEmpty {
  (t: "List"): Nil
  (t: "Maybe"): Nothing
}

/**
 * `empty :: f a`
 */
export const empty: AlternativeEmpty =
  (t: AlternativeStr): any => {
    if (t === "List") {
      return Nil
    }

    if (t === "Maybe") {
      return Nothing
    }

    throw new TypeError (applicativeInstanceErrorMsg ("empty") (t))
  }

interface AlternativeGuard {
  (t: "List"): (pred: boolean) => List<true>
  (t: "Maybe"): (pred: boolean) => Maybe<true>
}

/**
 * `guard :: Bool -> Maybe ()`
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
export const guard: AlternativeGuard =
  (t: AlternativeStr) =>
  (pred: boolean): any =>{
    if (t === "List") {
      return pred ? pure ("List") <true> (true) : empty ("List")
    }

    if (t === "Maybe") {
      return pred ? pure ("Maybe") <true> (true) : empty ("Maybe")
    }

    throw new TypeError (applicativeInstanceErrorMsg ("empty") (t))
  }

export const Alternative = {
  alt,
  alt_,
  altF,
  altF_,
  empty,
  guard,
}

const applicativeInstanceErrorMsg =
  (fname: string) =>
  (x: any) =>
    `${fname}: missing instance of Applicative\n${showP (x)}`

const applicativeDifferentInstanceErrorMsg =
  (fname: string) =>
  (x: any) =>
  (y: any) =>
    `${fname}: different instance of Applicative\n${showP (x)}\nand\n${showP (y)}`

const alternativeInstanceErrorMsg =
  (fname: string) =>
  (x: any) =>
    `${fname}: missing instance of Alternative\n${showP (x)}`

const alternativeDifferentInstanceErrorMsg =
  (fname: string) =>
  (x: any) =>
  (y: any) =>
    `${fname}: different instance of Alternative\n${showP (x)}\nand\n${showP (y)}`

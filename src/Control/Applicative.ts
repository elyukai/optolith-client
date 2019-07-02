import { Either, isEither, isRight, Right } from "../Data/Either";
import { fromRight_ } from "../Data/Either/Extra";
import { fmap } from "../Data/Functor";
import { consF, fnull, head, isList, List, Nil, NonEmptyList } from "../Data/List";
import { fromJust, isJust, isMaybe, Just, Maybe, Nothing, Some } from "../Data/Maybe";
import { showP } from "../Data/Show";
import { isTagged, Tagged } from "../Data/Tagged";
import { Identity, isIdentity, runIdentity } from "./Monad/Identity";

export type Applicative<A> = Maybe<A>
                           | List<A>
                           | Either<any, A>
                           | Identity<A>
                           | Tagged<any, A>

export type ApplicativeName = "Maybe" | "List" | "Either" | "Identity" | "Tagged"

export interface ApplicativeMap<A> {
  Maybe: Maybe<A>
  List: List<A>
  Either: Either<any, A>
  Identity: Identity<A>
  Tagged: Tagged<any, A>
}

interface Pure {
  (t: "Maybe"): <A> (x: A) => Just<A>
  (t: "List"): <A> (x: A) => NonEmptyList<A>
  (t: "Either"): <A> (x: A) => Right<A>
  (t: "Identity"): <A> (x: A) => Identity<A>
  (t: "Tagged"): <A> (x: A) => Tagged<any, A>
  (t: ApplicativeName): <A> (x: A) => Applicative<A>
}

export const pure: Pure =
  (t: ApplicativeName) =>
  <A> (x: A): any => {
    if (t === "Maybe") {
      return Just (x)
    }

    if (t === "List") {
      return List (x)
    }

    if (t === "Either") {
      return Right (x)
    }

    if (t === "Identity") {
      return Identity (x)
    }

    if (t === "Tagged") {
      return Tagged (x)
    }

    throw new TypeError (applicativeInstanceErrorMsg ("pure") (t))
  }

export const typeFromApplicative =
  (x: Applicative<any>): ApplicativeName => {
    if (isMaybe (x)) {
      return "Maybe"
    }

    if (isList (x)) {
      return "List"
    }

    if (isEither (x)) {
      return "Either"
    }

    if (isIdentity (x)) {
      return "Identity"
    }

    if (isTagged (x)) {
      return "Tagged"
    }

    throw new TypeError (applicativeInstanceErrorMsg ("typeFromApplicative") (x))
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
  (ff: Applicative<(x: any) => any>) =>
  (x: any): any => {
    if (isList (ff)) {
      if (isList (x)) {
        return fnull (ff) || fnull (x)
          ? List ()
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
    fnull (x)
      ? xs
      : consF (f (x .x)) (mapAp (f) (xs) (x .xs))

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
        return fnull (x) ? y : x
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
      return fnull (x) ? g () : x
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
      return List ()
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
  * ```haskell
  * guard True  = pure ()
  * guard False = empty
  * ```
  * In TypeScript, this is not possible, so instead it's
  * ```ts
  * guard (true)  = pure (true)
  * guard (false) = empty
  * ```
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

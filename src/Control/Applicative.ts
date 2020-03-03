import { Either, isEither, Right } from "../Data/Either"
import { Internals } from "../Data/Internals"
import { isList, List, NonEmptyList } from "../Data/List"
import { isMaybe, Just, Maybe } from "../Data/Maybe"
import { showP } from "../Data/Show"
import { isTagged, Tagged } from "../Data/Tagged"
import { Identity } from "./Monad/Identity"

const instanceErrorMsg =
  (fname: string) =>
  (x: any) =>
    `${fname}: missing instance of Applicative\n${showP (x)}`

export type Applicative<A> = Maybe<A>
                           | List<A>
                           | Either<any, A>
                           | Identity<A>
                           | Tagged<any, A>

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

    throw new TypeError (instanceErrorMsg ("pure") (t))
  }

export type ApplicativeName = "Maybe" | "List" | "Either" | "Identity" | "Tagged"

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

    if (Internals.isIdentity (x)) {
      return "Identity"
    }

    if (isTagged (x)) {
      return "Tagged"
    }

    throw new TypeError (instanceErrorMsg ("typeFromApplicative") (x))
  }

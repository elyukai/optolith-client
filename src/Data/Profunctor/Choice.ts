/**
 * @module Data.Profunctor.Choice
 *
 * @author Lukas Obermann
 */

import { pipe } from "../../App/Utilities/pipe"
import { bimap, Either, either, first, Left, Right, second } from "../Either"
import { ident } from "../Function"
import { isMarket, Market } from "../Market"
import { showP } from "../Show"
import { isTagged, Tagged } from "../Tagged"

const instanceErrorMsg =
  (fname: string) =>
  (x: any) =>
    `${fname}: missing instance of Choice\n${showP (x)}`

export type Choice<A, B> = Market<any, any, A, B>
                         | Tagged<A, B>
                         | ((x: A) => B)

export type ChoiceLeft_ =
  <A, B, C, F extends Choice<A, B>>
  (x: F) =>
    F extends Market<infer A_, infer B_, A, B> ? Market<A_, B_, Either<A, C>, Either<B, C>> :
    F extends Tagged<A, B> ? Tagged<Either<A, C>, Either<B, C>> :
    F extends ((x: A) => B) ? (x: Either<A, C>) => Either<B, C> :
    never

/**
 * `left' :: p a b -> p (Either a c) (Either b c)`
 *
 * Wrap both sides of the `Profunctor` in a `Left`.
 */
export const left_: ChoiceLeft_ =
  (x: Choice<any, any>): any => {
    if (isMarket (x)) {
      return Market<any, Either<any, any>>
        (pipe (x.to, Left))
        (either <any, Either<Either<any, any>, any>> (pipe (x.fro, bimap (Left) (ident)))
                (pipe (Right, Left)))
    }

    if (isTagged (x)) {
      return Tagged (Left (x.x))
    }

    if (typeof x === "function") {
      return first (x)
    }

    throw new TypeError (instanceErrorMsg ("left'") (x))
  }

export type ChoiceRight_ =
  <A, B, C, F extends Choice<A, B>>
  (x: F) =>
    F extends Market<infer A_, infer B_, A, B> ? Market<A_, B_, Either<C, A>, Either<C, B>> :
    F extends Tagged<A, B> ? Tagged<Either<C, A>, Either<C, B>> :
    F extends ((x: A) => B) ? (x: Either<C, A>) => Either<C, B> :
    never

/**
 * `right' :: p a b -> p (Either c a) (Either c b)`
 *
 * Wrap both sides of the `Profunctor` in a `Right`.
 */
export const right_: ChoiceRight_ =
  (x: Choice<any, any>): any => {
    if (isMarket (x)) {
      return Market<any, Either<any, any>>
        (pipe (x.to, Right))
        (either <any, Either<Either<any, any>, any>> (pipe (Left, Left))
                (pipe (x.fro, bimap (Right) (ident))))
    }

    if (isTagged (x)) {
      return Tagged (Right (x.x))
    }

    if (typeof x === "function") {
      return second (x)
    }

    throw new TypeError (instanceErrorMsg ("left'") (x))
  }

/**
 * @module Control.Monad.Identity
 *
 * The `Identity` monad is a monad that does not embody any computational
 * strategy. It simply applies the bound function to its input without any
 * modification. Computationally, there is no reason to use the `Identity` monad
 * instead of the much simpler act of simply applying functions to their
 * arguments. The purpose of the `Identity` monad is its fundamental role in the
 * theory of monad transformers. Any monad transformer applied to the `Identity`
 * monad yields a non-transformer version of that monad.
 *
 * @author Lukas Obermann
 */

import { cnst } from "../../Data/Function";


// PROTOTYPE

interface IdentityPrototype {
  readonly isIdentity: true
}

const IdentityPrototype =
  Object.freeze<IdentityPrototype> ({
    isIdentity: true,
  })


// CONSTRUCTOR

export interface Identity<A> extends IdentityPrototype {
  readonly value: A
}

/**
 * `Identity :: a -> Identity a`
 */
export const Identity =
  <A>
  (x: A): Identity<A> =>
    Object.create (
      IdentityPrototype,
      {
        value: {
          value: x,
          enumerable: true,
        },
      }
    )

/**
 * `runIdentity :: Identity a -> a`
 */
export const runIdentity = <A> (x: Identity<A>): A => x .value

Identity.runIdentity = runIdentity


// FUNCTOR

/**
 * `fmap :: (a -> b) -> Identity a -> Identity b`
 */
export const fmap =
  <A, B>
  (f: (x: A) => B) =>
  (x: Identity<A>): Identity<B> =>
    Identity (f (runIdentity (x)))

Identity.fmap = fmap

/**
 * `(<$) :: a -> Identity b -> Identity a`
 *
 * Replace all locations in the input with the same value. The default
 * definition is `fmap . const`, but this may be overridden with a more
 * efficient version.
 */
export const mapReplace = <A> (x: A) => fmap<any, A> (cnst (x))

Identity.mapReplace = mapReplace


// APPLICATIVE

/**
 * `pure :: a -> Identity a`
 */
export const pure: <A> (x: A) => Identity<A> = Identity

Identity.pure = pure


// CUSTOM IDENTITY FUNCTIONS

/**
 * `isIdentity :: a -> Bool`
 *
 * The `isIdentity` function returns `True` if its argument is an `Identity`.
 */
export const isIdentity =
  (x: any): x is Identity<any> =>
    typeof x === "object" && x !== null && Object.getPrototypeOf (x) === IdentityPrototype

Identity.isIdentity = isIdentity

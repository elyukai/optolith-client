/**
 * @module Const
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

import { cnst } from './Function';
import { Some } from './Maybe';


// CONSTRUCTOR

interface IdentityPrototype {
  readonly isIdentity: true;
}

export interface Identity<A extends Some> extends IdentityPrototype {
  readonly value: A;
  readonly prototype: IdentityPrototype;
}

const IdentityPrototype: IdentityPrototype =
  Object.create (
    Object.prototype,
    { isIdentity: { value: true }}
  );

/**
 * `Identity :: a -> Identity a`
 */
export const Identity =
  <A extends Some> (x: A): Identity<A> =>
    Object.create (IdentityPrototype, { value: { value: x, enumerable: true }});

/**
 * `runIdentity :: Identity a -> a`
 */
export const runIdentity = <A extends Some> (x: Identity<A>): A => x .value;


// FUNCTOR

/**
 * `fmap :: (a -> b) -> Identity a -> Identity b`
 */
export const fmap =
  <A extends Some, B extends Some> (f: (value: A) => B) => (i: Identity<A>): Identity<B> =>
    Identity (f (runIdentity (i)));

/**
 * `(<$) :: a -> Identity b -> Identity a`
 *
 * Replace all locations in the input with the same value. The default
 * definition is `fmap . const`, but this may be overridden with a more
 * efficient version.
 */
export const mapReplace = <A extends Some> (x: A) => fmap<any, A> (cnst (x));

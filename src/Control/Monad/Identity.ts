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

import { Internals } from "../../Data/Internals"

// CONSTRUCTOR

export import Identity = Internals.Identity

/**
 * `runIdentity :: Identity a -> a`
 */
export const runIdentity = <A> (x: Identity<A>): A => x .value


// CUSTOM IDENTITY FUNCTIONS

export import isIdentity = Internals.isIdentity

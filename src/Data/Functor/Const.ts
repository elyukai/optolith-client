/**
 * @module Data.Functor.Const
 *
 * `Const` is like the `id` function as a functor. It always keeps its initial
 * value.
 *
 * @author Lukas Obermann
 */

import { cnst } from "../Function";


// PROTOTYPE

interface ConstPrototype {
  readonly isConst: true
}

const ConstPrototype =
  Object.freeze<ConstPrototype> ({
    isConst: true,
  })


// CONSTRUCTOR

export interface Const<A> extends ConstPrototype {
  readonly value: A
}


/**
 * `Const :: a -> Const a`
 */
export const Const =
  <A>
  (x: A): Const<A> =>
    Object.create (
      ConstPrototype,
      {
        value: {
          value: x,
          enumerable: true,
        },
      }
    )

/**
 * `getConst :: Const a -> a`
 */
export const getConst = <A> (x: Const<A>): A => x .value

Const.getConst = getConst


// FUNCTOR

/**
 * `fmap :: (a0 -> b) -> Const a a0 -> Const a b`
 */
export const fmap = <A> (_: (x: A) => any) => (c: Const<A>): Const<A> => c

Const.fmap = fmap

/**
 * `(<$) :: a0 -> Const a b -> Const a a0`
 *
 * Replace all locations in the input with the same value. The default
 * definition is `fmap . const`, but this may be overridden with a more
 * efficient version.
 */
export const mapReplace = <A> (x: any) => fmap<A> (cnst (x))

Const.mapReplace = mapReplace


// APPLICATIVE

/**
 * `pure :: a -> Const a`
 */
export const pure: <A> (x: A) => Const<A> = Const

Const.pure = pure


// CUSTOM CONST FUNCTIONS

/**
 * `isConst :: a -> Bool`
 *
 * The `isConst` function returns `True` if its argument is a `Const`.
 */
export const isConst =
  (x: any): x is Const<any> =>
    typeof x === "object" && x !== null && Object.getPrototypeOf (x) === ConstPrototype

Const.isConst = isConst

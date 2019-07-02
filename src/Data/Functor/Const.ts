/**
 * @module Data.Functor.Const
 *
 * `Const` is like the `id` function as a functor. It always keeps its initial
 * value.
 *
 * @author Lukas Obermann
 */

// PROTOTYPE

interface ConstPrototype {
  readonly isConst: true
}

const ConstPrototype =
  Object.freeze<ConstPrototype> ({
    isConst: true,
  })

// CONSTRUCTOR

export interface Const<A, B> extends ConstPrototype {
  readonly value: A
  /**
   * No actual field!
   */
  readonly phantom: B
}

/**
 * `Const :: a -> Const a b`
 */
export const Const =
  <A, B>
  (x: A): Const<A, B> =>
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
 * `getConst :: Const a b -> a`
 */
export const getConst = <A, B> (x: Const<A, B>): A => x .value


// CUSTOM CONST FUNCTIONS


/**
 * `isConst :: a -> Bool`
 *
 * The `isConst` function returns `True` if its argument is a `Const`.
 */
export const isConst =
  (x: any): x is Const<any, any> =>
    typeof x === "object" && x !== null && Object.getPrototypeOf (x) === ConstPrototype

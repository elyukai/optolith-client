/**
 * @module Const
 *
 * @author Lukas Obermann
 */

import { cnst } from './combinators';
import { Some } from './Maybe.new';


// CONSTRUCTOR

interface ConstPrototype {
  readonly isConst: true;
}

export interface Const<A extends Some> extends ConstPrototype {
  readonly value: A;
  readonly prototype: ConstPrototype;
}

const ConstPrototype: ConstPrototype =
  Object.create (
    Object.prototype,
    {
      isConst: { value: true },
      ['@@type/Functor']: { value: true },
    }
  );

/**
 * `Const :: a -> Const a`
 */
export const Const =
  <A extends Some> (x: A): Const<A> =>
    Object.create (ConstPrototype, { value: { value: x, enumerable: true }});

/**
 * `getConst :: Const a -> a`
 */
export const getConst = <A extends Some> (x: Const<A>): A => x .value;


// FUNCTOR

/**
 * `fmap :: (a0 -> b) -> Const a a0 -> Const a b`
 */
export const fmap = <A extends Some> (_: (value: A) => any) => (c: Const<A>): Const<A> => c;

/**
 * `(<$) :: Functor f => a -> f b -> f a`
 *
 * Replace all locations in the input with the same value. The default
 * definition is `fmap . const`, but this may be overridden with a more
 * efficient version.
 */
export const mapReplace = <A extends Some> (x: any) => fmap<A> (cnst (x));

/**
 * @module Alternative
 *
 * @author Lukas Obermann
 */

import { fromElements, isList, List } from "./List.new";
import { isJust, isMaybe, Maybe, Nothing, Some } from "./Maybe.new";
import { show } from "./Show";

type AlternativeType = 'List' | 'Maybe';

/**
 * `alt :: f a -> f a -> f a`
 */
export const alt: alt =
  (m1: any) => (m2: any): any => {
    if (isMaybe (m1) && isMaybe (m2)) {
      return isJust (m1) ? m1 : m2;
    }

    if (isList (m1) && isList (m2)) {
      return m1 .value .length > 0 ? m1 : m2;
    }

    throw new TypeError (
      `${show (m1)} or ${show (m2)} is no Alternative or they are not of the same type.`
    );
  }

interface alt {
  <A extends Some>(m1: List<A>): (m2: List<A>) => List<A>;
  <A extends Some>(m1: Maybe<A>): (m2: Maybe<A>) => Maybe<A>;
}

/**
 * `alt :: f a -> f a -> f a`
 *
 * This is the same as `alt` but with arguments swapped.
 */
export const alt_: alt_ = (m2: any) => (m1: any): any => alt (m1) (m2);

interface alt_ {
  <A extends Some>(m2: List<A>): (m1: List<A>) => List<A>;
  <A extends Some>(m2: Maybe<A>): (m1: Maybe<A>) => Maybe<A>;
}

/**
 * `empty :: f a`
 */
export const empty: empty =
  (type: AlternativeType): any => {
    if (type === 'List') {
      return fromElements ();
    }

    if (type === 'Maybe') {
      return Nothing;
    }

    throw new TypeError (`${type} is not an Alternative.`);
  };

interface empty {
  <A extends Some>(type: 'List'): List<A>;
  <A extends Some>(type: 'Maybe'): Maybe<A>;
}

/**
 * `guard :: Alternative f => Bool -> f ()`
 *
 * Conditional failure of Alternative computations. Defined by
```hs
guard True  = pure ()
guard False = empty
```
  * In TypeScript, this is not possible, so instead it's
```ts
guard (true)  = pure (true)
guard (false) = empty ()
```
  */
export const guard = (pred: boolean): Maybe<true> => pred ? Just<true> (true) : Nothing;

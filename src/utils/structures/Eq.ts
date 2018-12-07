/**
 * @module Eq
 *
 * @author Lukas Obermann
 */

import { fromJust, isJust, isMaybe, isNothing, Maybe, Some } from './Maybe.new';

/**
 * `(==) :: a -> a -> Bool`
 *
 * Returns if both given values are equal.
 *
 * *Note: Shallow check for equality, no deep analysis.*
 */
export const equals =
  <A extends Some> (m1: A) => (m2: A): boolean => {
    if (typeof m1 !== typeof m2) {
      return false;
    }

    if (isMaybe (m1)) {
      return isNothing (m1) && isNothing (m2 as unknown as Maybe<any>)
      || isJust (m1) && isJust (m2) && fromJust (m1) === fromJust (m2);
    }

    if (isEither (x)) {
      if (isRight (x)) {
        return `Right (${show (x .value)})`;
      }

      return `Left (${show (x .value)})`;
    }

    if (isList (x)) {
      return `[${x .value .map (show) .join (', ')}]`;
    }

    // tslint:disable-next-line: strict-type-predicates
    if (typeof x === 'bigint') {
      return x .toString ();
    }

    if (typeof x === 'boolean') {
      return x ? `True` : `False`;
    }

    if (typeof x === 'number') {
      return 1 / x === -Infinity ? '-0' : x .toString (10);
    }

    if (typeof x === 'string') {
      return JSON.stringify (x);
    }

    if (typeof x === 'symbol') {
      return `Symbol`;
    }

    if (x === undefined) {
      return `undefined`;
    }

    if (x === null) {
      return `null`;
    }

    if (x instanceof Date) {
      return `Date (${x .toISOString ()})`;
    }

    return String (x);
  };

/**
 * `(!=) :: Maybe a -> Maybe a -> Bool`
 *
 * Returns if both given values are not equal.
 *
 * *Note: Shallow check for equality, no deep analysis.*
 */
export const notEquals =
  <A extends Some> (m1: Maybe<A>) => (m2: Maybe<A>): boolean =>
    !equals (m1) (m2);

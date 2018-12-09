/**
 * @module Eq
 *
 * @author Lukas Obermann
 */

import { isEither, isRight } from './Either';
import { isList, length } from './List.new';
import { isJust, isMaybe, isNothing, Maybe, Some } from './Maybe.new';
import { isOrderedSet, OrderedSet } from './OrderedSet.new';
import { isPair } from './Pair';

/**
 * `(==) :: a -> a -> Bool`
 *
 * Returns if both given values are equal.
 *
 * *Note: Shallow check for equality, no deep analysis.*
 */
export const equals =
  // tslint:disable-next-line: cyclomatic-complexity
  <A extends Some> (x1: A) => (x2: A): boolean => {
    if (typeof x1 !== typeof x2) {
      return false;
    }

    if (isMaybe (x1)) {
      return isMaybe (x2)
        && (
          isNothing (x1) && isNothing (x2 as unknown as Maybe<any>)
          || isJust (x1) && isJust (x2) && equals (x1 .value) (x2 .value)
        );
    }

    if (isEither (x1)) {
      return isEither (x2) && isRight (x1) === isRight (x2) && equals (x1 .value) (x2 .value);
    }

    if (isList (x1)) {
      return isList (x2)
        && length (x1) === length (x2)
        && x1 .value .every ((e, i) => equals (e) (x2 .value [i]));
    }

    if (isPair (x1)) {
      return isPair (x2)
        && equals (x1 .first) (x2 .first)
        && equals (x1 .second) (x2 .second);
    }

    if (isOrderedSet (x1)) {
      return isOrderedSet (x2)
        && OrderedSet.size (x1) === OrderedSet.size (x2)
        && [...x1 .value] .every (e => OrderedSet.member (e) (x2));
    }

    // tslint:disable-next-line: strict-type-predicates
    if (typeof x1 === 'bigint') {
      // tslint:disable-next-line: strict-type-predicates
      return typeof x2 === 'bigint' && x1 === x2;
    }

    if (typeof x1 === 'boolean') {
      return typeof x2 === 'boolean' && x1 === x2;
    }

    if (typeof x1 === 'number') {
      return typeof x2 === 'number' && x1 === x2;
    }

    if (typeof x1 === 'string') {
      return typeof x2 === 'string' && x1 === x2;
    }

    if (typeof x1 === 'symbol') {
      return typeof x2 === 'symbol' && x1 === x2;
    }

    if (x1 === undefined) {
      return x2 === undefined;
    }

    if (x1 === null) {
      return x2 === null;
    }

    if (x1 instanceof Date) {
      return x2 instanceof Date && x1 .toISOString () === x2 .toISOString ();
    }

    return x1 === x2;
  };

/**
 * `(!=) :: Maybe a -> Maybe a -> Bool`
 *
 * Returns if both given values are not equal.
 *
 * *Note: Shallow check for equality, no deep analysis.*
 */
export const notEquals =
  <A extends Some> (m1: A) => (m2: A): boolean =>
    !equals (m1) (m2);

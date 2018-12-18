/**
 * @module Show
 *
 * Conversion of values to readable `String`s.
 *
 * @author Lukas Obermann
 */

import { isEither, isRight } from './Either';
import { isList } from './List';
import { isJust, isMaybe } from './Maybe';
import { isOrderedMap } from './OrderedMap';
import { isOrderedSet } from './OrderedSet';
import { isPair } from './Pair';
import { isRecord } from './Record';

/**
 * `show :: a -> String`
 *
 * Convert a value to a readable `String`.
 */
export const show = (x: any): string => {
  if (isMaybe (x)) {
    if (isJust (x)) {
      return `Just (${show (x.value)})`
    }

    return `Nothing`
  }

  if (isEither (x)) {
    if (isRight (x)) {
      return `Right (${show (x .value)})`
    }

    return `Left (${show (x .value)})`
  }

  if (isList (x)) {
    return `[${x .value .map (show) .join (', ')}]`
  }

  if (isPair (x)) {
    return `(${show (x .first)}, ${show (x .second)})`
  }

  if (isOrderedSet (x)) {
    return `Set (${[...x] .map (show) .join (', ')})`
  }

  if (isOrderedMap (x)) {
    return `Map (${[...x] .map (([k, v]) => `${show (k)} = ${show (v)}`) .join (', ')})`
  }

  if (isRecord (x)) {
    return `{ ${
      [...x .keys .value]
        .sort ()
        .map (key =>
          `${key} = ${show (x .values [key] === null || x .values [key] === undefined ? x .defaultValues [key] : x .values [key])}`
        )
        .join (', ')
    } }`
  }

  // tslint:disable-next-line: strict-type-predicates
  if (typeof x === 'bigint') {
    return x .toString ()
  }

  if (typeof x === 'boolean') {
    return x ? `True` : `False`
  }

  if (typeof x === 'number') {
    return 1 / x === -Infinity ? '-0' : x .toString (10)
  }

  if (typeof x === 'string') {
    return JSON.stringify (x)
  }

  if (typeof x === 'symbol') {
    return `Symbol`
  }

  if (x === undefined) {
    return `undefined`
  }

  if (x === null) {
    return `null`
  }

  if (x instanceof Date) {
    return `Date (${x .toISOString ()})`
  }

  return String (x)
}

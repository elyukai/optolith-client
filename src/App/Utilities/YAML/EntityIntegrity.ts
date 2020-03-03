/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { Either, Left, Right } from "../../../Data/Either"
import { ArrayValue } from "./Array"


/**
 * Converts an array of key-value pairs into a map while checking entity
 * integrity by using the first pair element as the key. Returns a `Right` with
 * the map on success or a `Left` with the error message.
 */
export const toMapIntegrity : <A extends string | number, B> (xs : [A, B][])
                            => Either<Error[], Map<A, B>>
                            = xs => {
                              type P = ArrayValue<typeof xs>

                              const mp = new Map<P[0], P[1]> ()

                              for (const [ k, v ] of xs) {
                                if (mp.has (k)) {
                                  return Left ([ new Error (`toMapIntegrity: Key ${k.toString ()} is set twice`) ])
                                }
                                else {
                                  mp.set (k, v)
                                }
                              }

                              return Right (mp)
                            }

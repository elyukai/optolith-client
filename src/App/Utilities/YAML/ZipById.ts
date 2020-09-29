/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { Either, Left, Right } from "../../../Data/Either"
import { ArrayValue } from "./Array"


export interface ObjectWithId<A extends string | number> {
  id : A
}


export type ObjectWithKey<K extends string, A extends string | number> = {
  [B in K] : A
}

/**
 * merges two arrays by the property name 'key'. If the element exists in main, it
 * will be used, if not the element from def will be used.
 */
export const mergeBy : <K extends string> (key : K)
                  => <A extends string | number, B extends ObjectWithKey<K, A>> (def : B[])
                  => (main : B[]|undefined)
                  => B[]
                  = key => base => override => {
                    type A1 = ArrayValue<typeof base> extends ObjectWithKey<string, infer A>
                      ? A
                      : never
                    const result : ArrayValue<typeof base>[] = []

                    // collect all possible keys
                    const allkeys = new Set<string | number> ()

                    for (const b of base) {
                      allkeys.add (b[key])
                    }

                    if (override !== undefined) {
                      for (const b of override) {
                        allkeys.add (b[key])
                      }
                    }

                    // merge
                    for (const k of allkeys) {
                      const b = base.find (x => (x[key] as A1) === (k as A1))
                      const o = override === undefined
                                ? undefined
                                : override.find (x => (x[key] as A1) === (k as A1))

                      if (o === undefined) {
                        if (b !== undefined) {
                          result.push (b)
                        }
                      }
                      else {
                        result.push (o)
                      }
                    }

                    return result
                  }


/**
 * `zipById key os rs` zips two arrays by the property named `key`. There must
 * always be a matching element in `os` for an `r`, but its not needed to have
 * an element in `rs` for every `o`. Either returns a list of occurred errors or
 * the list of successful zips.
 */
export const zipBy : <K extends string> (key : K)
                   => <A extends string | number, B extends ObjectWithKey<K, A>> (os : B[])
                   => <C extends ObjectWithKey<K, A>> (base : C[])
                   => (override : C[]|undefined)
                   => Either<Error[], [B, C][]>
                   = key => os => base => override => {
                     type A1 = ArrayValue<typeof os> extends ObjectWithKey<string, infer A>
                       ? A
                       : never
                     const ress : [ArrayValue<typeof os>, ArrayValue<typeof override>][]
                                = []

                     const errs : Error[]
                                = []

                     // collect all possible keys
                     const allkeys = new Set<string | number> ()

                     for (const b of base) {
                       allkeys.add (b[key])
                     }

                     if (override !== undefined) {
                       for (const b of override) {
                         allkeys.add (b[key])
                       }
                     }

                     // merge for all keys
                     for (const k of allkeys) {
                       const u = os.find (x => (x[key] as A1) === (k as A1))

                       const o = override?.find (x => (x[key] as A1) === (k as A1))
                                 ?? base.find (x => (x[key] as A1) === (k as A1))

                       if (u === undefined) {
                         errs.push (new Error (`zipById: No matching entry found for "${JSON.stringify (k)}"`))
                       }
                       else if (o !== undefined) {
                         ress.push ([ u, o ])
                       }
                     }

                     return errs.length > 0 ? Left (errs) : Right (ress)
                   }


/**
 * `zipById os rs` zips two arrays by the `id` property. There must always be a
 * matching element in `os` for an `r`, but its not needed to have an element in
 * `rs` for every `o`. Returns a pair where the first element is the list of
 * combined elements and the second element is the list of elements from `rs`
 * that do not have a corresponding part in `os`.
 */
export const zipByIdLoose : <A extends string | number, B extends ObjectWithId<A>> (os : B[])
                          => <C extends ObjectWithId<A>> (rs : C[])
                          => [[B, C][], C[]]
                          = os => rs => {
                            const ress : [ArrayValue<typeof os>, ArrayValue<typeof rs>][]
                                       = []

                            const alones : ArrayValue<typeof rs>[]
                                         = []

                            for (const r of rs) {
                              const o = os .find (x => x .id === r .id)

                              if (o === undefined) {
                               alones.push (r)
                              }
                              else {
                                ress.push ([ o, r ])
                              }
                            }

                            return [ ress, alones ]
                          }

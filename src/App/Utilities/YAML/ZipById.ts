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
                  => <A extends string | number, B extends ObjectWithKey<K, A>> (def: B[])
                  => (main : B[]|undefined)
                  => B[]
                  = key => base => override => {
                    const result : ArrayValue<typeof base>[] = []

                    // collect all possible keys
                    let allkeys = Array.from(base.keys());
                    if (override != undefined)
                    {
                      allkeys = allkeys.concat(Array.from(override.keys()))
                      // remove duplicates
                      allkeys = allkeys.filter((item, pos) => allkeys.indexOf(item) === pos)
                    }

                    // merge
                    for (const k of allkeys)
                    {
                      if (override === undefined) {
                        result.push ( base[k] )
                      } else if (override[k] === undefined) {
                        result.push ( base[k] )
                      } else {
                        result.push ( override[k] )
                      }
                    }

                    return result;
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
                     const ress : [ArrayValue<typeof os>, ArrayValue<typeof override>][]
                                = []

                     const errs : Error[]
                                = []

                     // collect all possible keys
                     let allkeys = Array.from(base.keys());
                     if (override != undefined)
                     {
                       allkeys = allkeys.concat(Array.from(override.keys()))
                       // remove duplicates
                       allkeys = allkeys.filter((item, pos) => allkeys.indexOf(item) === pos)
                     }
                    
                     // merge for all keys
                     for (const k of allkeys) {
                       if (os[k] === undefined) {
                         errs.push (new Error (`zipById: No matching entry found for "${JSON.stringify (k)}"`))
                       }
                       else if ( override === undefined) {
                         // no override found, fall back to base.
                         ress.push([ os[k], base[k] ])
                       }
                       else {
                         // override found
                         ress.push ([ os[k], override[k] ])
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

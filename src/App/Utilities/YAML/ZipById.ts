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
                  => (main : B[])
                  => B[]
                  = key => def => main => {
                    type A1 = ArrayValue<typeof def> extends ObjectWithKey<string, infer A>
                    ? A
                    : never
                    const result : ArrayValue<typeof def>[] = []

                    for (const d of def)
                    {
                      const m = main.find (x => (x[key] as A1) === (d[key] as A1))

                      result.push ( (m === undefined) ? d : m )
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
                   => <C extends ObjectWithKey<K, A>> (rs : C[])
                   => (gs : C[])
                   => Either<Error[], [B, C][]>
                   = key => os => rs => gs => {
                     type A1 = ArrayValue<typeof os> extends ObjectWithKey<string, infer A>
                               ? A
                               : never

                     const ress : [ArrayValue<typeof os>, ArrayValue<typeof rs>][]
                                = []

                     const errs : Error[]
                                = []

                     for (const g of gs) {
                       const r = rs .find (x => (x[key] as A1) === (g[key] as A1))
                       const o = os .find (x => (x[key] as A1) === (g[key] as A1))

                       if (o === undefined) {
                         errs.push (new Error (`zipById: No matching entry found for "${JSON.stringify (r)}"`))
                       }
                       else if ( r === undefined) {
                         // no local translation found, fall back to german.
                         ress.push([ o, g ])
                       }
                       else {
                        // local translation found
                        ress.push ([ o, r ])
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

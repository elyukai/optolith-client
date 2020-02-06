/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { Either, Left, Right } from "../../../Data/Either"
import { ArrayValue } from "./Array"


export interface ObjectWithId<A extends string | number> {
  id : A
}


/**
 * `zipById os rs` zips two arrays by the `id` property. There must always be a
 * matching element in `os` for an `r`, but its not needed to have an element in
 * `rs` for every `o`. Either returns a list of occurred errors or the list of
 * successful zips.
 */
export const zipById : <A extends string | number, B extends ObjectWithId<A>> (os : B[])
                     => <C extends ObjectWithId<A>> (rs : C[])
                     => Either<Error[], [B, C][]>
                     = os => rs => {
                       const ress : [ArrayValue<typeof os>, ArrayValue<typeof rs>][]
                                  = []

                       const errs : Error[]
                                  = []

                       for (const r of rs) {
                         const o = os .find (x => x .id === r .id)

                         if (o === undefined) {
                           errs.push (new Error (`zipById: No matching entry found for "${JSON.stringify (r)}"`))
                         }
                         else {
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

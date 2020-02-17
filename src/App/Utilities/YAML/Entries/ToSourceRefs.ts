/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { fromArray, List, map } from "../../../../Data/List"
import { Record } from "../../../../Data/Record"
import { Pair } from "../../../../Data/Tuple"
import { SourceLink } from "../../../Models/Wiki/sub/SourceLink"
import { pipe } from "../../pipe"
import { SourceRefs } from "../Schema/SourceRefs/SourceRefs"

export const toSourceRefs : (xs : SourceRefs) => List<Record<SourceLink>>
                          = pipe (
                            fromArray,
                            map (x => SourceLink ({
                                        id: x.id,
                                        page: x.lastPage === undefined
                                              ? x.firstPage
                                              : Pair (x.firstPage, x.lastPage),
                                      }))
                          )

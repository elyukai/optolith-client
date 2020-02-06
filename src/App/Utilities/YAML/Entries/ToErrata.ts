/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { fromArray, List, map } from "../../../../Data/List"
import { Record } from "../../../../Data/Record"
import { Erratum } from "../../../Models/Wiki/sub/Errata"
import { pipe } from "../../pipe"
import { Errata } from "../Schema/Errata/Errata"

export const toErrata : (xs : Errata | undefined) => List<Record<Erratum>>
                      = pipe (
                        xs => xs === undefined ? [] : xs,
                        fromArray,
                        map (x => Erratum ({
                                    date: new Date (x.date),
                                    description: x.description,
                                  }))
                      )

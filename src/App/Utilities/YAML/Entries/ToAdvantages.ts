/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { bindF, Either, fromRight_, isLeft, Left, Right, RightI, second } from "../../../../Data/Either"
import { Just, Nothing } from "../../../../Data/Maybe"
import { fromMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { Category } from "../../../Constants/Categories"
import { Advantage } from "../../../Models/Wiki/Advantage"
import { pipe, pipe_ } from "../../pipe"
import { mapM } from "../Either"
import { toMapIntegrity } from "../EntityIntegrity"
import { YamlFileConverter } from "../ToRecordsByFile"
import { zipBy } from "../ZipById"


export const toAdvantages : YamlFileConverter<string, Record<Advantage>>
                          = pipe (
                            yaml_mp => zipBy (yaml_mp.AdvantagesUniv)
                                               (yaml_mp.AdvantagesL10n),
                            bindF (pipe (
                              mapM ((x) : Either<Error | Error[], [string, Record<Advantage>]> => {
                                const eselect_options =
                                  x [1] .selectOptions === undefined
                                  ? Right (Nothing)
                                  : x [0] .selectOptions === undefined
                                  ? Left (new Error ())
                                  : pipe_ (
                                      zipBy (x [0] .selectOptions)
                                              (x [1] .selectOptions),
                                      second (Just)
                                    )

                                if (isLeft<Error | Error[]> (eselect_options)) {
                                  return eselect_options
                                }

                                const select_options =
                                  fromRight_<RightI<typeof eselect_options>> (eselect_options)

                                return Right ([
                                  x .id,
                                  Advantage ({
                                    id,
                                    name,
                                    cost,
                                    input,
                                    max,
                                    prerequisites,
                                    prerequisitesText,
                                    prerequisitesTextIndex,
                                    prerequisitesTextStart,
                                    prerequisitesTextEnd,
                                    tiers,
                                    select,
                                    gr,
                                    src,
                                    errata,
                                    rules,
                                    range,
                                    actions,
                                    apValue,
                                    apValueAppend,
                                    category: Category.ADVANTAGES,
                                  }),
                                ])
                              }),
                              toMapIntegrity,
                            )),
                            second (fromMap)
                          )

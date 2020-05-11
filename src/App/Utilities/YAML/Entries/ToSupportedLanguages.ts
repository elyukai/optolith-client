/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { Either, second } from "../../../../Data/Either"
import { StrMap } from "../../../../Data/Ley_StrMap.gen"
import { Locale } from "../../../Models/Locale"
import { pipe } from "../../pipe"
import { map } from "../Array"
import { toMapIntegrity } from "../EntityIntegrity"
import { SupportedLanguage, SupportedLanguages } from "../Schema/SupportedLanguages"


const toLang : (x : SupportedLanguage) => [string, Locale]
             = x => [ x.id, Locale (x) ]


export const toSupportedLanguages : (langs : SupportedLanguages)
                                  => Either<Error[], StrMap<Locale>>
                                  = pipe (
                                      map (toLang),
                                      toMapIntegrity,
                                      second (fromMap)
                                    )

/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { SupportedLanguage, SupportedLanguages } from "../../../../../app/Database/Schema/SupportedLanguages"
import { Either, second } from "../../../../Data/Either"
import { StrMap } from "../../../../Data/Ley_StrMap.gen"
import { Locale } from "../../../Models/Locale"
import { isPrerelease } from "../../../Selectors/envSelectors"
import { pipe } from "../../pipe"
import { mapMaybe } from "../Array"
import { toMapIntegrity } from "../EntityIntegrity"


const toLang : (x : SupportedLanguage) => [string, Locale] | undefined
             = x => isPrerelease || x.isMissingImplementation !== true
                    ? [ x.id, x ]
                    : undefined


export const toSupportedLanguages : (langs : SupportedLanguages)
                                  => Either<Error[], StrMap<Locale>>
                                  = pipe (
                                      mapMaybe (toLang),
                                      toMapIntegrity,
                                      second (fromMap)
                                    )

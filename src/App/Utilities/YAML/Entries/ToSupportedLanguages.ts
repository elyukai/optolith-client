/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import { SupportedLanguage, SupportedLanguages } from "../../../../../app/Database/Schema/SupportedLanguages"
import { Either, second } from "../../../../Data/Either"
import { fromMap, OrderedMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { Locale } from "../../../Models/Locale"
import { isPrerelease } from "../../../Selectors/envSelectors"
import { pipe } from "../../pipe"
import { mapMaybe } from "../Array"
import { toMapIntegrity } from "../EntityIntegrity"


const toLang : (x : SupportedLanguage) => [string, Record<Locale>] | undefined
             = x => isPrerelease || x.isMissingImplementation !== true
                    ? [ x.id, Locale (x) ]
                    : undefined


export const toSupportedLanguages : (langs : SupportedLanguages)
                                  => Either<Error[], OrderedMap<string, Record<Locale>>>
                                  = pipe (
                                      mapMaybe (toLang),
                                      toMapIntegrity,
                                      second (fromMap)
                                    )

/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import Ajv from "ajv"
import { handleE } from "../../Control/Exception"
import { Either, fromLeft_, fromRight_, isLeft, Right } from "../../Data/Either"
import { parseByFile } from "./YAML/ParseByFile"
import { readYamlL10n, readYamlUniv } from "./YAML/Parser"
import { getAllSchemes } from "./YAML/Schemes"

export const parseStaticData : (locale : string) => Promise<Either<Error, void>>
                             = async locale => {
                               const eschemes = await handleE (getAllSchemes ())

                               if (isLeft (eschemes)) {
                                 console.log (fromLeft_ (eschemes))

                                 return eschemes
                               }

                               console.log ("Schemes loaded")

                               const schemes = fromRight_ (eschemes)

                               const validator = new Ajv ({ allErrors: true }) .addSchema (schemes)

                               const univ_parser = readYamlUniv (validator)
                               const l10n_parser = readYamlL10n (locale) (validator)

                               const estatic_data_by_file =
                                await parseByFile (univ_parser) (l10n_parser)

                               if (isLeft (estatic_data_by_file)) {
                                 console.log (fromLeft_ (estatic_data_by_file))

                                 return estatic_data_by_file
                               }

                               console.log ("Files parsed")

                               const static_data_by_file = fromRight_ (estatic_data_by_file)

                               console.log (static_data_by_file)

                               // eslint-disable-next-line no-alert
                               alert ("Parsing static data done!")

                               return Right (undefined)
                             }

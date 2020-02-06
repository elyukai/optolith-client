/* eslint "@typescript-eslint/type-annotation-spacing": [2, { "before": true, "after": true }] */
import Ajv from "ajv"
import { join } from "path"
import YAML from "yaml"
import { handleE } from "../../../Control/Exception"
import { Either, either, Left, Right } from "../../../Data/Either"
import { fmap } from "../../../Data/Functor"
import { bindF, IO, readFile } from "../../../System/IO"
import { app_path } from "../../Selectors/envSelectors"
import { pipe, pipe_ } from "../pipe"
import { schema_to_data, YamlSchemaMap } from "./SchemaMap"


export type YamlValidationError = Error
                                | Ajv.ErrorObject[]
                                | null
                                | undefined


/**
 * The result from the `FileParser`. Either an error or the valid data.
 */
export type YamlParserResult<A extends keyof YamlSchemaMap>
  = Either<YamlValidationError, YamlSchemaMap [A]>


/**
 * Takes a schema ID and returns the parsed data for the corresponding file.
 */
export type YamlParser = <A extends keyof YamlSchemaMap> (schemaRef : A) => IO<YamlParserResult<A>>


const parseYamlStr : (data : string) => Promise<unknown>
                   = async data => Promise.resolve (YAML.parse (data))


/**
 * `parseYaml :: String -> IO (Either Error Unknown)`
 *
 * Takes a YAML file path and returnes the parsed data.
 */
const parseYamlFile : (path : string) => IO<unknown>
                    = pipe (
                      readFile,
                      bindF (parseYamlStr)
                    )


const validate : (validator : Ajv.Ajv)
               => <A extends keyof YamlSchemaMap> (ref : A)
               => (data : unknown)
               => YamlParserResult<A>
               = validator => ref => data => pipe_ (
                 validator .validate (ref, data),
                 x => typeof x === "boolean"
                   ? x
                     ? Right (data as YamlSchemaMap [typeof ref])
                     : Left (validator .errors)
                   : Left (new TypeError (
                       "validateYaml: Async schemes are not supported"
                     ))
               )


const readYaml : (pathToDir : string) => (validator : Ajv.Ajv) => YamlParser
               = pathToDir => validator => async ref => pipe_ (
                 join (app_path, "app", "Database", pathToDir, schema_to_data [ref]),
                 parseYamlFile,
                 handleE,
                 fmap (either ((err : Error) : YamlParserResult<typeof ref> => Left (err))
                               (validate (validator) (ref)))
               )


/**
 * Takes a validator and returns a `YamlParser` for universal static data.
 */
export const readYamlUniv = readYaml ("univ")


/**
 * Takes a locale and a validator and returns a `YamlParser` for locale-aware
 * static data.
 */
export const readYamlL10n : (locale : string) => (validator : Ajv.Ajv) => YamlParser = readYaml

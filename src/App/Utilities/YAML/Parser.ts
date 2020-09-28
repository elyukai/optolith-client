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


/**
 * The result from the `FileParser`. Either an error or the valid data.
 */
export type YamlParserResult<A extends keyof YamlSchemaMap>
  = Either<Error[], YamlSchemaMap [A]>


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
export const parseYamlFile : (path : string) => IO<unknown>
                           = pipe (
                             readFile,
                             bindF (pipe (
                               data => data.replace (/^\uFEFF/u, ""),
                               parseYamlStr
                             ))
                           )


/**
 * Takes a validator, the ID of the main schema for the data and the parsed data
 * and either returns the errors from the validator or the valid data.
 */
export const validateJson : (validator : Ajv.Ajv)
                          => (mainSchemaId : string)
                          => <A> (data : unknown)
                          => Either<Error[], A>
                          = validator => ref => <A> (data : unknown) => pipe_ (
                            validator .validate (ref, data),
                            x => typeof x === "boolean"
                              ? x
                                ? Right (data as A)
                                : Left (typeof validator.errors === "object"
                                        && validator.errors !== null
                                        ? validator.errors.map (
                                            err => new Error (
                                              `validate: JSON validation error at ${err.schemaPath}: ${err.message}`
                                            )
                                          )
                                        : [])
                              : Left ([ new TypeError (
                                  "validateYaml: Async schemes are not supported"
                                ) ])
                          )


/**
 * Takes a path to the directory of the YAML file (base `/app/Database`) and a
 * validator and returns a `YamlParser`, which required a scheme ID for the file
 * and then either returns occurred errors or the parsed result.
 */
export const readYaml : (pathToDir : string) => (validator : Ajv.Ajv) => YamlParser
                      = pathToDir => validator => async ref => pipe_ (
                          join (
                            app_path,
                            "app",
                            "Database",
                            "Data",
                            pathToDir,
                            schema_to_data [ref]
                          ),
                          parseYamlFile,
                          handleE,
                          fmap (either ((err : Error) : YamlParserResult<typeof ref> =>
                                          Left ([ err ]))
                                        (validateJson (validator) (ref)))
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

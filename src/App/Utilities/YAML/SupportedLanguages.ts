import Ajv from "ajv"
import { handleE } from "../../../Control/Exception"
import { Either, fromLeft_, fromRight_, isLeft, Left } from "../../../Data/Either"
import { OrderedMap } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { readFile } from "../../../System/IO"
import { Locale } from "../../Models/Locale"
import { toSupportedLanguages } from "./Entries/ToSupportedLanguages"
import { readYaml } from "./Parser"
import { schemeIdToPath } from "./Schemes"

type SupportedLanguagesResult = Either<Error[], OrderedMap<string, Record<Locale>>>

export const getSupportedLanguages = async (): Promise<SupportedLanguagesResult> => {
  const schemaPath = schemeIdToPath ("Schema/SupportedLanguages.schema.json")
  const schema = await handleE (readFile (schemaPath).then (JSON.parse))

  if (schema.isLeft) {
    console.log (schema.value)

    return Left ([ schema.value ])
  }

  const validator = new Ajv ({ allErrors: true }) .addSchema (schema.value)

  const univ_parser = readYaml (".") (validator)

  const esupported_languages_js = await univ_parser ("Schema/SupportedLanguages.schema.json")

  if (isLeft (esupported_languages_js)) {
    const errs = fromLeft_ (esupported_languages_js)

    return Left (errs)
  }

  const supported_languages_js = fromRight_ (esupported_languages_js)

  const esupported_languages = toSupportedLanguages (supported_languages_js)

  return esupported_languages
}

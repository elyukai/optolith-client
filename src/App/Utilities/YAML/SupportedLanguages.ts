import Ajv from "ajv"
import { handleE } from "../../../Control/Exception"
import { Either, fromLeft_, fromRight_, isLeft, Left } from "../../../Data/Either"
import { fmap } from "../../../Data/Functor"
import { Record } from "../../../Data/Record"
import { readFile } from "../../../System/IO"
import { Locale } from "../../Models/Locale"
import { pipe_ } from "../pipe"
import { toSupportedLanguages } from "./Entries/ToSupportedLanguages"
import { readYaml } from "./Parser"
import { schemeIdToPath } from "./Schemes"

type SupportedLanguagesResult = Either<Error[], StrMap<Record<Locale>>>

export const getSupportedLanguages = async (): Promise<SupportedLanguagesResult> => {
  const eschema = await pipe_ (
                    "Schema/SupportedLanguages.schema.json",
                    schemeIdToPath,
                    readFile,
                    fmap (JSON.parse),
                    handleE
                  )

  if (isLeft (eschema)) {
    console.log (fromLeft_ (eschema))

    return Left ([ fromLeft_ (eschema) ])
  }

  const schema = fromRight_ (eschema)

  const validator = new Ajv ({ allErrors: true }) .addSchema (schema)

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

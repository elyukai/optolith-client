import Ajv from "ajv"
import { handleE } from "../../Control/Exception"
import { Either, fromLeft_, fromRight_, isLeft, Left } from "../../Data/Either"
import { fromJust, isJust, Maybe } from "../../Data/Maybe"
import { StaticDataRecord } from "../Models/Wiki/WikiModel"
import { parseByFile } from "./YAML/ParseByFile"
import { readYamlL10n, readYamlUniv } from "./YAML/Parser"
import { getAllSchemes } from "./YAML/Schemes"
import { toWiki } from "./YAML/ToRecordsByFile"

export const parseStaticData = async (
  locale: string,
  fallbackLocale: Maybe<string>
): Promise<Either<Error[], StaticDataRecord>> => {
  console.time ("parseStaticData")

  const schemes = await handleE (getAllSchemes ())

  if (schemes.isLeft) {
    console.log (schemes.value)

    return Left ([ schemes.value ])
  }

  console.log ("Schemes loaded")

  const validator = new Ajv ({ allErrors: true }) .addSchema (schemes.value)

  const univ_parser = readYamlUniv (validator)
  const l10n_parser = readYamlL10n (locale) (validator)
  const default_parser = isJust (fallbackLocale)
                         && fromJust (fallbackLocale) !== locale
                         ? readYamlL10n (fromJust (fallbackLocale))
                                        (validator)
                         : undefined

  const estatic_data_by_file =
      (default_parser === undefined)
        ? await parseByFile (univ_parser)
                            (l10n_parser)
                            (undefined)
        : await parseByFile (univ_parser)
                            (default_parser)
                            (l10n_parser)


  if (isLeft (estatic_data_by_file)) {
    const errs = fromLeft_ (estatic_data_by_file)
    console.log (errs)

    return Left (
      Object.values (errs)
        .filter<Error[]> (Array.isArray)
        .flat (1)
    )
  }

  console.log ("Files parsed")

  const static_data_by_file = fromRight_ (estatic_data_by_file)

  const wiki = toWiki (locale, static_data_by_file)

  console.log ("Parsing static data done!")
  console.timeEnd ("parseStaticData")

  return wiki
}

import Ajv from "ajv"
import { join } from "path"
import { RawHero } from "../../../../../app/Schema/Hero/Hero"
import { handleE } from "../../../../Control/Exception"
import { fmap } from "../../../../Data/Functor"
import { fromJust, isNothing, Just } from "../../../../Data/Maybe"
import { existsFile, IO, readFile } from "../../../../System/IO"
import { AlertOptions } from "../../../Actions/AlertActions"
import { IdPrefixes } from "../../../Constants/IdPrefixes"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { app_path, current_version } from "../../../Selectors/envSelectors"
import { Either, Left, Right } from "../../Either"
import { getNewIdByDate, prefixId } from "../../IDUtils"
import { pipe_ } from "../../pipe"
import { isBase64Image } from "../../RegexUtils"
import { parseYamlFile, validateJson } from "../../YAML/Parser"
import { convertHero } from "./Hero/Compat"
import { convertFromRawHero } from "./Hero/HeroFromJSON"

const heroSchemaPath = join (app_path, "app", "Schema", "Hero", "Hero.schema.json")

const getHeroSchema = async (): IO<Either<Error, object>> =>
  handleE (readFile (heroSchemaPath).then (JSON.parse))

export const parseHero = (staticData: StaticDataRecord) => async (path: string) => {
  // Get hero schema
  const heroSchema = await getHeroSchema ()

  if (heroSchema.isLeft) {
    return Left (AlertOptions ({
      title: Just (`Hero Schema Error`),
      message: `The schema for the hero file could not be loaded.`,
    }))
  }

  const heroSchemaId = (heroSchema.value as any)["$id"] as string

  // Parse hero file
  const data = await handleE (parseYamlFile (path))

  if (data.isLeft) {
    return Left (AlertOptions ({
      title: Just (`Hero IO Error`),
      message: `The hero file could not be loaded.\nDetails: ${data.value.message}`,
    }))
  }

  const validator = new Ajv ({ allErrors: true })
    .addSchema (heroSchema.value)

  // Validate hero file contents
  const validated_data = validateJson (validator)
                                      (heroSchemaId)
                                      <RawHero> (data.value)

  if (validated_data.isLeft) {
    const details =
      validated_data.value
        .map (e => e.message)
        .join ("\n")

    return Left (AlertOptions ({
      title: Just (`Hero Invalidity Error`),
      message: `The file is not a valid Optolith hero document.\nDetails:\n${details}`,
    }))
  }

  // Generate new local ID
  const new_id = prefixId (IdPrefixes.HERO) (getNewIdByDate ())

  const { player: _player, avatar, ...other } = validated_data.value

  // Adjust data with new ID and valid avatar
  const adjusted_data: RawHero = {
    ...other,
    id: new_id,
    avatar: avatar !== undefined
      && avatar.length > 0
      && (isBase64Image (avatar)
          || await existsFile (avatar.replace (/file:[\\/]+/u, "")))
      ? avatar
      : undefined,
  }

  const mhero = pipe_ (
    adjusted_data,
    convertHero (staticData),
    fmap (convertFromRawHero (staticData)),
  )

  if (isNothing (mhero)) {
    return Left (AlertOptions ({
      title: Just (`Hero Incompatibility Error`),
      message: `The hero was built with a version of Optolith (${adjusted_data.clientVersion}) that is not supported by the current version (${current_version}).`,
    }))
  }

  return Right (fromJust (mhero))
}

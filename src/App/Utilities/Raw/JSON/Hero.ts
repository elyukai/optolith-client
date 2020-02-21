import Ajv from "ajv"
import { join } from "path"
import { RawHero } from "../../../../../app/Schema/Hero/Hero"
import { handleE } from "../../../../Control/Exception"
import { Either, fromLeft_, fromRight_, isLeft, Left, Right } from "../../../../Data/Either"
import { fmap } from "../../../../Data/Functor"
import { fromJust, isNothing, Just } from "../../../../Data/Maybe"
import { existsFile, IO, readFile } from "../../../../System/IO"
import { AlertOptions } from "../../../Actions/AlertActions"
import { IdPrefixes } from "../../../Constants/IdPrefixes"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { app_path, current_version } from "../../../Selectors/envSelectors"
import { getNewIdByDate, prefixId } from "../../IDUtils"
import { pipe_ } from "../../pipe"
import { isBase64Image } from "../../RegexUtils"
import { parseYamlFile, validateJson } from "../../YAML/Parser"
import { convertHero } from "./Hero/Compat"
import { convertFromRawHero } from "./Hero/HeroFromJSON"

const heroSchemaPath = join (app_path, "app", "Schema", "Hero", "Hero.schema.json")

const getHeroSchema = async (): IO<Either<Error, object>> => pipe_ (
                        heroSchemaPath,
                        readFile,
                        handleE,
                        fmap (fmap<string, object> (JSON.parse))
                      )

export const parseHero = (staticData: StaticDataRecord) =>
                         async (path: string) => {
                           // Get hero schema
                           const eheroSchema = await getHeroSchema ()

                           if (isLeft (eheroSchema)) {
                             return Left (AlertOptions ({
                               title: Just (`Hero Schema Error`),
                               message: `The schema for the hero file could not be loaded.`,
                             }))
                           }

                           const heroSchema = fromRight_ (eheroSchema)

                           const heroSchemaId = (heroSchema as any)["$id"] as string

                           // Parse hero file
                           const edata = await handleE (parseYamlFile (path))

                           if (isLeft (edata)) {
                             return Left (AlertOptions ({
                               title: Just (`Hero IO Error`),
                               message: `The hero file could not be loaded.\nDetails: ${fromLeft_ (edata).message}`,
                             }))
                           }

                           const data = fromRight_ (edata)

                           const validator = new Ajv ({ allErrors: true }) .addSchema (heroSchema)

                           // Validate hero file contents
                           const evalidated_data = validateJson (validator)
                                                                (heroSchemaId)
                                                                <RawHero> (data)

                           if (isLeft (evalidated_data)) {
                             const details =
                               fromLeft_ (evalidated_data)
                                 .map (e => e.message)
                                 .join ("\n")

                             return Left (AlertOptions ({
                               title: Just (`Hero Invalidity Error`),
                               message: `The file is not a valid Optolith hero document.\nDetails:\n${details}`,
                             }))
                           }

                           const validated_data = fromRight_ (evalidated_data)

                           // Generate new local ID
                           const new_id = prefixId (IdPrefixes.HERO) (getNewIdByDate ())

                           const { player, avatar, ...other } = validated_data

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

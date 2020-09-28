import Ajv from "ajv"
import { join } from "path"
import { RawConfig } from "../../../../../app/Schema/Config/Config"
import { handleE } from "../../../../Control/Exception"
import { Either, fromLeft_, fromRight_, isLeft, Left, Right } from "../../../../Data/Either"
import { fmap } from "../../../../Data/Functor"
import { Just, Maybe, maybeToUndefined, Nothing } from "../../../../Data/Maybe"
import { Record, toObject } from "../../../../Data/Record"
import { IO, readFile } from "../../../../System/IO"
import { AlertOptions } from "../../../Actions/AlertActions"
import { MeleeCombatTechniqueId, RangedCombatTechniqueId } from "../../../Constants/Ids"
import { Config, CulturesVisibilityFilter, HeroListVisibilityFilter, ProfessionsVisibilityFilter, Theme } from "../../../Models/Config"
import { app_path, user_data_path } from "../../../Selectors/envSelectors"
import { SortNames } from "../../../Views/Universal/SortOptions"
import { pipe_ } from "../../pipe"
import { parseYamlFile, validateJson } from "../../YAML/Parser"

const configSchemaPath = join (app_path, "app", "Schema", "Config", "Config.schema.json")
const configPath = join (user_data_path, "config.json")

const getConfigSchema = async (): IO<Either<Error, object>> => pipe_ (
                          configSchemaPath,
                          readFile,
                          handleE,
                          fmap (fmap<string, object> (JSON.parse))
                        )

export const parseConfig = async () => {
                             // Get config schema
                             const econfigSchema = await getConfigSchema ()

                             if (isLeft (econfigSchema)) {
                               return Left (AlertOptions ({
                                 title: Just (`Config Schema Error`),
                                 message: `The schema for the config file could not be loaded.`,
                               }))
                             }

                             const configSchema = fromRight_ (econfigSchema)

                             const configSchemaId = (configSchema as any)["$id"] as string

                             // Parse config file
                             const edata = await handleE (parseYamlFile (configPath))

                             if (isLeft (edata)) {
                               return Right (Config.default)
                             }

                             const data = fromRight_ (edata)

                             const validator = new Ajv ({ allErrors: true })
                               .addSchema (configSchema)

                             // Validate config file contents
                             const evalidated_data = validateJson (validator)
                                                                  (configSchemaId)
                                                                  <RawConfig> (data)

                             if (isLeft (evalidated_data)) {
                               const details =
                                 fromLeft_ (evalidated_data)
                                   .map (e => e.message)
                                   .join ("\n\n")

                               return Left (AlertOptions ({
                                 title: Just (`Config Invalidity error`),
                                 message: `The file is not a valid Optolith config document.\n\nDetails:\n\n${details}`,
                               }))
                             }

                             const validated_data = fromRight_ (evalidated_data)

                             return Right (Config ({
                               herolistSortOrder:
                                 validated_data.herolistSortOrder === "name"
                                 ? SortNames.Name
                                 : SortNames.DateModified,
                               herolistVisibilityFilter:
                                 validated_data.herolistVisibilityFilter === "all"
                                 ? HeroListVisibilityFilter.All
                                 : validated_data.herolistVisibilityFilter === "own"
                                 ? HeroListVisibilityFilter.Own
                                 : HeroListVisibilityFilter.Shared,
                               racesSortOrder:
                                 validated_data.racesSortOrder === "name"
                                 ? SortNames.Name
                                 : SortNames.Cost,
                               culturesSortOrder:
                                 validated_data.culturesSortOrder === "name"
                                 ? SortNames.Name
                                 : SortNames.Cost,
                               culturesVisibilityFilter:
                                 validated_data.culturesVisibilityFilter === "all"
                                 ? CulturesVisibilityFilter.All
                                 : CulturesVisibilityFilter.Common,
                               professionsSortOrder:
                                 validated_data.professionsSortOrder === "name"
                                 ? SortNames.Name
                                 : SortNames.Cost,
                               professionsVisibilityFilter:
                                 validated_data.professionsVisibilityFilter === "all"
                                 ? ProfessionsVisibilityFilter.All
                                 : ProfessionsVisibilityFilter.Common,
                               professionsGroupVisibilityFilter:
                                 validated_data.professionsGroupVisibilityFilter,
                               advantagesDisadvantagesCultureRatingVisibility:
                                 validated_data.advantagesDisadvantagesCultureRatingVisibility,
                               talentsSortOrder:
                                 validated_data.talentsSortOrder === "name"
                                 ? SortNames.Name
                                 : validated_data.talentsSortOrder === "group"
                                 ? SortNames.Group
                                 : SortNames.IC,
                               talentsCultureRatingVisibility:
                                 validated_data.talentsCultureRatingVisibility,
                               combatTechniquesSortOrder:
                                 validated_data.combatTechniquesSortOrder === "name"
                                 ? SortNames.Name
                                 : validated_data.combatTechniquesSortOrder === "group"
                                 ? SortNames.Group
                                 : SortNames.IC,
                               specialAbilitiesSortOrder:
                                 validated_data.specialAbilitiesSortOrder === "name"
                                 ? SortNames.Name
                                 : SortNames.GroupName,
                               spellsSortOrder:
                                 validated_data.spellsSortOrder === "name"
                                 ? SortNames.Name
                                 : validated_data.spellsSortOrder === "group"
                                 ? SortNames.Group
                                 : validated_data.spellsSortOrder === "property"
                                 ? SortNames.Property
                                 : SortNames.IC,
                               spellsUnfamiliarVisibility:
                                 validated_data.spellsUnfamiliarVisibility,
                               liturgiesSortOrder:
                                 validated_data.liturgiesSortOrder === "name"
                                 ? SortNames.Name
                                 : validated_data.liturgiesSortOrder === "group"
                                 ? SortNames.Group
                                 : SortNames.IC,
                               equipmentSortOrder:
                                 validated_data.equipmentSortOrder === "name"
                                 ? SortNames.Name
                                 : validated_data.equipmentSortOrder === "groupname"
                                 ? SortNames.GroupName
                                 : validated_data.equipmentSortOrder === "where"
                                 ? SortNames.Where
                                 : SortNames.Weight,
                               equipmentGroupVisibilityFilter:
                                 validated_data.equipmentGroupVisibilityFilter,
                               sheetCheckAttributeValueVisibility:
                                 Maybe (validated_data.sheetCheckAttributeValueVisibility),
                              sheetUseParchment:
                                 Maybe (validated_data.sheetUseParchment),
                              sheetZoomFactor:
                                 validated_data.sheetZoomFactor ?? 100,
                               enableActiveItemHints:
                                 validated_data.enableActiveItemHints,
                               locale:
                                 Maybe (validated_data.locale),
                               fallbackLocale:
                                 Maybe (validated_data.fallbackLocale),
                               theme:
                                 validated_data.theme === "dark"
                                 ? Just (Theme.Dark)
                                 : validated_data.theme === "light"
                                 ? Just (Theme.Light)
                                 : Nothing,
                               enableEditingHeroAfterCreationPhase:
                                 Maybe (validated_data.enableEditingHeroAfterCreationPhase),
                               meleeItemTemplatesCombatTechniqueFilter:
                                 Maybe (
                                   validated_data.meleeItemTemplatesCombatTechniqueFilter as
                                     MeleeCombatTechniqueId | undefined
                                 ),
                               rangedItemTemplatesCombatTechniqueFilter:
                                 Maybe (
                                   validated_data.rangedItemTemplatesCombatTechniqueFilter as
                                     RangedCombatTechniqueId | undefined
                                 ),
                               enableAnimations:
                                 Maybe (validated_data.enableAnimations),
                             }))
                           }

export const writeConfig = (x: Record<Config>): string => {
  const obj = toObject (x)

  const serialized_obj: RawConfig = {
    ...obj,
    sheetCheckAttributeValueVisibility: maybeToUndefined (obj.sheetCheckAttributeValueVisibility),
    sheetUseParchment: maybeToUndefined (obj.sheetUseParchment),
    sheetZoomFactor: obj.sheetZoomFactor,
    locale: maybeToUndefined (obj.locale),
    fallbackLocale: maybeToUndefined (obj.fallbackLocale),
    theme: maybeToUndefined (obj.theme),
    enableEditingHeroAfterCreationPhase: maybeToUndefined (obj.enableEditingHeroAfterCreationPhase),
    enableAnimations: maybeToUndefined (obj.enableAnimations),
    meleeItemTemplatesCombatTechniqueFilter:
      maybeToUndefined (obj.meleeItemTemplatesCombatTechniqueFilter as Maybe<string>),
    rangedItemTemplatesCombatTechniqueFilter:
      maybeToUndefined (obj.rangedItemTemplatesCombatTechniqueFilter as Maybe<string>),
  }

  return JSON.stringify (serialized_obj)
}

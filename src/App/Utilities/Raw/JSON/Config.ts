import Ajv from "ajv"
import { join } from "path"
import { RawConfig } from "../../../../../app/Schema/Config/Config"
import { handleE } from "../../../../Control/Exception"
import { Just, Maybe, maybeToUndefined, Nothing } from "../../../../Data/Maybe"
import { Record, toObject } from "../../../../Data/Record"
import { IO, readFile } from "../../../../System/IO"
import { AlertOptions } from "../../../Actions/AlertActions"
import { MeleeCombatTechniqueId, RangedCombatTechniqueId } from "../../../Constants/Ids"
import { Config, CulturesVisibilityFilter, HeroListVisibilityFilter, ProfessionsVisibilityFilter, Theme } from "../../../Models/Config"
import { app_path, user_data_path } from "../../../Selectors/envSelectors"
import { SortNames } from "../../../Views/Universal/SortOptions"
import { Either, Left, Right } from "../../Either"
import { parseYamlFile, validateJson } from "../../YAML/Parser"

const configSchemaPath = join (app_path, "app", "Schema", "Config", "Config.schema.json")
const configPath = join (user_data_path, "config.json")

const getConfigSchema = async (): IO<Either<Error, object>> =>
  handleE (readFile (configSchemaPath).then (JSON.parse))

export const parseConfig = async () => {
                             // Get config schema
                             const configSchema = await getConfigSchema ()

                             if (configSchema.isLeft) {
                               return Left (AlertOptions ({
                                 title: Just (`Config Schema Error`),
                                 message: `The schema for the config file could not be loaded.`,
                               }))
                             }

                             const configSchemaId = (configSchema.value as any)["$id"] as string

                             // Parse config file
                             const data = await handleE (parseYamlFile (configPath))

                             if (data.isLeft) {
                               return Right (Config.default)
                             }

                             const validator = new Ajv ({ allErrors: true })
                               .addSchema (configSchema.value)

                             // Validate config file contents
                             const validated_data = validateJson (validator)
                                                                  (configSchemaId)
                                                                  <RawConfig> (data.value)

                             if (validated_data.isLeft) {
                               const details =
                                 validated_data.value
                                   .map (e => e.message)
                                   .join ("\n\n")

                               return Left (AlertOptions ({
                                 title: Just (`Config Invalidity error`),
                                 message: `The file is not a valid Optolith config document.\n\nDetails:\n\n${details}`,
                               }))
                             }

                             return Right (Config ({
                               herolistSortOrder:
                                 validated_data.value.herolistSortOrder === "name"
                                 ? SortNames.Name
                                 : SortNames.DateModified,
                               herolistVisibilityFilter:
                                 validated_data.value.herolistVisibilityFilter === "all"
                                 ? HeroListVisibilityFilter.All
                                 : validated_data.value.herolistVisibilityFilter === "own"
                                 ? HeroListVisibilityFilter.Own
                                 : HeroListVisibilityFilter.Shared,
                               racesSortOrder:
                                 validated_data.value.racesSortOrder === "name"
                                 ? SortNames.Name
                                 : SortNames.Cost,
                               culturesSortOrder:
                                 validated_data.value.culturesSortOrder === "name"
                                 ? SortNames.Name
                                 : SortNames.Cost,
                               culturesVisibilityFilter:
                                 validated_data.value.culturesVisibilityFilter === "all"
                                 ? CulturesVisibilityFilter.All
                                 : CulturesVisibilityFilter.Common,
                               professionsSortOrder:
                                 validated_data.value.professionsSortOrder === "name"
                                 ? SortNames.Name
                                 : SortNames.Cost,
                               professionsVisibilityFilter:
                                 validated_data.value.professionsVisibilityFilter === "all"
                                 ? ProfessionsVisibilityFilter.All
                                 : ProfessionsVisibilityFilter.Common,
                               professionsGroupVisibilityFilter:
                                 validated_data.value.professionsGroupVisibilityFilter,
                               advantagesDisadvantagesCultureRatingVisibility:
                                 validated_data.value
                                   .advantagesDisadvantagesCultureRatingVisibility,
                               talentsSortOrder:
                                 validated_data.value.talentsSortOrder === "name"
                                 ? SortNames.Name
                                 : validated_data.value.talentsSortOrder === "group"
                                 ? SortNames.Group
                                 : SortNames.IC,
                               talentsCultureRatingVisibility:
                                 validated_data.value.talentsCultureRatingVisibility,
                               combatTechniquesSortOrder:
                                 validated_data.value.combatTechniquesSortOrder === "name"
                                 ? SortNames.Name
                                 : validated_data.value.combatTechniquesSortOrder === "group"
                                 ? SortNames.Group
                                 : SortNames.IC,
                               specialAbilitiesSortOrder:
                                 validated_data.value.specialAbilitiesSortOrder === "name"
                                 ? SortNames.Name
                                 : SortNames.GroupName,
                               spellsSortOrder:
                                 validated_data.value.spellsSortOrder === "name"
                                 ? SortNames.Name
                                 : validated_data.value.spellsSortOrder === "group"
                                 ? SortNames.Group
                                 : validated_data.value.spellsSortOrder === "property"
                                 ? SortNames.Property
                                 : SortNames.IC,
                               spellsUnfamiliarVisibility:
                                 validated_data.value.spellsUnfamiliarVisibility,
                               liturgiesSortOrder:
                                 validated_data.value.liturgiesSortOrder === "name"
                                 ? SortNames.Name
                                 : validated_data.value.liturgiesSortOrder === "group"
                                 ? SortNames.Group
                                 : SortNames.IC,
                               equipmentSortOrder:
                                 validated_data.value.equipmentSortOrder === "name"
                                 ? SortNames.Name
                                 : validated_data.value.equipmentSortOrder === "groupname"
                                 ? SortNames.GroupName
                                 : validated_data.value.equipmentSortOrder === "where"
                                 ? SortNames.Where
                                 : SortNames.Weight,
                               equipmentGroupVisibilityFilter:
                                 validated_data.value.equipmentGroupVisibilityFilter,
                               sheetCheckAttributeValueVisibility:
                                 Maybe (validated_data.value.sheetCheckAttributeValueVisibility),
                              sheetUseParchment:
                                 Maybe (validated_data.value.sheetUseParchment),
                              sheetZoomFactor:
                                 validated_data.value.sheetZoomFactor ?? 100,
                               sheetShowRules:
                                 Maybe(validated_data.value.sheetShowRules),
                               enableActiveItemHints:
                                 validated_data.value.enableActiveItemHints,
                               locale:
                                 Maybe (validated_data.value.locale),
                               fallbackLocale:
                                 Maybe (validated_data.value.fallbackLocale),
                               theme:
                                 validated_data.value.theme === "dark"
                                 ? Just (Theme.Dark)
                                 : validated_data.value.theme === "light"
                                 ? Just (Theme.Light)
                                 : Nothing,
                               enableEditingHeroAfterCreationPhase:
                                 Maybe (validated_data.value.enableEditingHeroAfterCreationPhase),
                               meleeItemTemplatesCombatTechniqueFilter:
                                 Maybe (
                                   validated_data.value.meleeItemTemplatesCombatTechniqueFilter as
                                     MeleeCombatTechniqueId | undefined
                                 ),
                               rangedItemTemplatesCombatTechniqueFilter:
                                 Maybe (
                                   validated_data.value.rangedItemTemplatesCombatTechniqueFilter as
                                     RangedCombatTechniqueId | undefined
                                 ),
                               enableAnimations:
                                 Maybe (validated_data.value.enableAnimations),
                             }))
                           }

export const writeConfig = (x: Record<Config>): string => {
  const obj = toObject (x)

  const serialized_obj: RawConfig = {
    ...obj,
    sheetCheckAttributeValueVisibility: maybeToUndefined (obj.sheetCheckAttributeValueVisibility),
    sheetUseParchment: maybeToUndefined (obj.sheetUseParchment),
    sheetShowRules: maybeToUndefined (obj.sheetShowRules),
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

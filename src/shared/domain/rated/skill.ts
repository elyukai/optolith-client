import { NewApplicationsAndUsesCache } from "optolith-database-schema/cache/newApplicationsAndUses"
import { Culture } from "optolith-database-schema/types/Culture"
import { Skill } from "optolith-database-schema/types/Skill"
import { SkillCheck } from "optolith-database-schema/types/_SkillCheck"
import { isNotNullish } from "../../utils/nullable.ts"
import { assertExhaustive } from "../../utils/typeSafety.ts"
import { Activatable, countOptions } from "../activatable/activatableEntry.ts"
import { createImprovementCost } from "../adventurePoints/improvementCost.ts"
import { All, GetById } from "../getTypes.ts"
import { createLibraryEntryCreator } from "../libraryEntry.ts"
import { Rated } from "./ratedEntry.ts"
import { getTextForCheck } from "./skillCheck.ts"

/**
 * The minimum value of a skill.
 */
export const minimumSkillValue = 0

/**
 * Returns the value for a dynamic skill entry that might not exist yet.
 */
export const getSkillValue = (dynamic: Rated | undefined): number =>
  dynamic?.value ?? minimumSkillValue

/**
 * Creates an initial dynamic skill entry.
 */
export const createEmptyDynamicSkill = (id: number): Rated => ({
  id,
  value: minimumSkillValue,
  cachedAdventurePoints: {
    general: 0,
    bound: 0,
  },
  dependencies: [],
  boundAdventurePoints: [],
})

/**
 * Returns the highest required attribute and its value for a skill, if any.
 */
export const getHighestRequiredAttributeForSkill = (
  getSingleHighestCheckAttributeId: (check: SkillCheck) => number | undefined,
  staticSkill: Skill,
  dynamicSkill: Rated,
  exceptionalSkill: Activatable | undefined,
): { id: number; value: number } | undefined => {
  const singleHighestAttributeId = getSingleHighestCheckAttributeId(staticSkill.check)

  if (singleHighestAttributeId === undefined) {
    return undefined
  }

  const exceptionalSkillBonus = countOptions(exceptionalSkill, {
    tag: "Skill",
    skill: staticSkill.id,
  })

  return {
    id: singleHighestAttributeId,
    value: dynamicSkill.value - 2 - exceptionalSkillBonus,
  }
}

/**
 * Returns if a skill is common or uncommon for a culture.
 */
export const getSkillCommonness = (
  culture: Pick<Culture, "common_skills" | "uncommon_skills">,
  skill: Skill,
): "common" | "uncommon" | undefined =>
  culture.common_skills.some(({ id: { skill: id } }) => skill.id === id)
    ? "common"
    : culture.uncommon_skills?.some(({ id: { skill: id } }) => skill.id === id) ?? false
    ? "uncommon"
    : undefined

/**
 * Get a JSON representation of the rules text for a skill.
 */
export const getSkillLibraryEntry = createLibraryEntryCreator<
  Skill,
  {
    getAttributeById: GetById.Static.Attribute
    blessedTraditions: All.Static.BlessedTraditions
    diseases: All.Static.Diseases
    regions: All.Static.Regions
    cache: NewApplicationsAndUsesCache
  }
>(
  (entry, { getAttributeById, blessedTraditions, diseases, regions, cache }) =>
    ({ translate, translateMap, localeCompare }) => {
      const translation = translateMap(entry.translations)

      if (translation === undefined) {
        return undefined
      }

      const newApplications = (entry === undefined ? [] : cache.newApplications[entry.id] ?? [])
        .map(x => translateMap(x.data.translations)?.name)
        .filter(isNotNullish)
        .sort(localeCompare)

      const uses = (entry === undefined ? [] : cache.uses[entry.id] ?? [])
        .map(x => translateMap(x.data.translations)?.name)
        .filter(isNotNullish)
        .sort(localeCompare)

      const applications = (() => {
        switch (entry.applications.tag) {
          case "Derived":
            return (() => {
              switch (entry.applications.derived) {
                case "BlessedTraditions":
                  return Object.values(blessedTraditions)
                    .map(x => translateMap(x.translations)?.name)
                    .filter(isNotNullish)
                    .sort(localeCompare)
                case "Diseases":
                  return Object.values(diseases)
                    .map(x => translateMap(x.translations)?.name)
                    .filter(isNotNullish)
                    .sort(localeCompare)
                case "Regions":
                  return Object.values(regions)
                    .map(x => translateMap(x.translations)?.name)
                    .filter(isNotNullish)
                    .sort(localeCompare)
                default:
                  return assertExhaustive(entry.applications.derived)
              }
            })()
          case "Explicit":
            return entry.applications.explicit
              .map(x => translateMap(x.translations)?.name)
              .filter(isNotNullish)
              .sort(localeCompare)
          default:
            return assertExhaustive(entry.applications)
        }
      })()

      return {
        title: translation.name,
        className: "skill",
        content: [
          newApplications.length === 0
            ? undefined
            : {
                label: translate("New Applications"),
                value: newApplications.join(", "),
              },
          uses.length === 0
            ? undefined
            : {
                label: translate("Uses"),
                value: uses.join(", "),
              },
          getTextForCheck({ translate, translateMap, getAttributeById }, entry.check),
          {
            label: translate("Applications"),
            value: applications.join(", "),
          },
          {
            label: translate("Encumbrance"),
            value:
              entry.encumbrance === "True"
                ? translate("Yes")
                : entry.encumbrance === "False"
                ? translate("No")
                : translation.encumbrance_description ?? translate("Maybe"),
          },
          translation?.tools === undefined
            ? undefined
            : {
                label: translate("Tools"),
                value: translation.tools,
              },
          {
            label: translate("Quality"),
            value: translation.quality,
          },
          {
            label: translate("Failed Check"),
            value: translation.failed,
          },
          {
            label: translate("Critical Success"),
            value: translation.critical,
          },
          {
            label: translate("Botch"),
            value: translation.botch,
          },
          createImprovementCost(translate, entry.improvement_cost),
        ],
      }
    },
)
